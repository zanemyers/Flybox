import "dotenv/config";
import { getJson } from "serpapi";
import { PromisePool } from "@supercharge/promise-pool";
import { JobStatus } from "@prisma/client";

import { ERRORS, FALLBACK_DETAILS } from "../base/constants/index.js";
import { addShopSelectors, buildCacheFileRows, buildShopRows } from "./shopUtils.js";
import { BaseApp, ExcelFileHandler, normalizeUrl, StealthBrowser } from "../base/index.js";

export class ShopReel extends BaseApp {
  constructor(jobId, searchParams) {
    super(jobId);
    this.searchParams = searchParams;
    this.shopWriter = new ExcelFileHandler();
    this.browser = new StealthBrowser({ headless: process.env.RUN_HEADLESS !== "false" });
    this.websiteCache = new Map(); // Stores previously scraped website details
  }

  /**
   * Executes the complete shop scraping workflow:
   *
   * 1. Retrieves shop search results from SerpAPI or cached data.
   * 2. Scrapes additional details from each shop's website.
   * 3. Writes the aggregated shop data into an Excel file.
   *
   * @returns {Promise<void>} Resolves when scraping completes successfully, is cancelled, or encounters an error.
   */
  async shopScraper() {
    try {
      await this.throwIfJobCancelled();
      await this.addJobMessage("Searching for shops...");
      const shops = await this.fetchShops();
      await this.addJobMessage(`✅ Found ${shops.length} shops.`, true);

      await this.throwIfJobCancelled();
      const shopDetails = await this.getDetails(shops);

      await this.throwIfJobCancelled();
      await this.addJobMessage("📝 Writing shop data to Excel...");
      const rows = buildShopRows(shops, shopDetails);
      await this.shopWriter.write(rows);
      await this.addJobMessage("✅ Excel file created.", true);
      await this.addJobFile("primaryFile", await this.shopWriter.getBuffer());
      await this.updateJobStatus(JobStatus.COMPLETED);
    } catch (err) {
      if (err.message !== ERRORS.CANCELLED) {
        await this.addJobMessage(`❌ Error: ${err.message || err}`);
        await this.updateJobStatus(JobStatus.FAILED);
      }
    } finally {
      await this.browser.close();
    }
  }

  /**
   * Fetches a list of shops near the specified location using SerpAPI's Google Maps engine.
   * If a cached Excel file buffer is provided, loads and returns shops from the cache instead.
   *
   * @returns {Promise<Object[]>} Resolves to an array of shop result objects, or an empty array if none found.
   */
  async fetchShops() {
    const cacheFileHandler = new ExcelFileHandler();

    // If a cached Excel buffer is provided, load and return cached shop data
    if (this.searchParams?.file?.buffer) {
      await cacheFileHandler.loadBuffer(this.searchParams.file.buffer);
      return await cacheFileHandler.read();
    }

    const results = [];

    // Fetch shop results in pages of 20, up to maxResults
    for (let start = 0; start < (+this.searchParams.maxResults || 100); start += 20) {
      await this.throwIfJobCancelled();

      // Use the environment variable if the API key is "test" and we're in development, otherwise use the provided key
      const apiKey =
        this.searchParams.apiKey === "test" && process.env.NODE_ENV === "development"
          ? process.env.SERP_API_KEY
          : this.searchParams.apiKey;

      const data = await getJson({
        engine: "google_maps",
        q: this.searchParams.query,
        ll: `@${this.searchParams.lat},${this.searchParams.lng},10z`,
        start,
        type: "search",
        api_key: apiKey,
      });

      const pageResults = data?.local_results || [];
      results.push(...pageResults);

      // Stop fetching if fewer than 20 results are returned (last page)
      if (pageResults.length < 20) break;
    }

    // If any results found, write them to cache file and provide download
    if (results.length > 0) {
      await cacheFileHandler.write(buildCacheFileRows(results));
      await this.addJobFile("secondaryFile", await cacheFileHandler.getBuffer());
    }

    return results;
  }

  /**
   * Scrapes additional business details from each shop's website using Playwright.
   *
   * Shops are processed in parallel with controlled concurrency to avoid overwhelming
   * system resources or triggering anti-bot protections.
   *
   * @param {Array<object>} shops - Array of shop objects to process.
   *
   * @returns {Promise<Array<object>>} Resolves to an array of shop detail objects, one per shop,
   *   with fallback values used when scraping fails or no website is provided.
   */
  async getDetails(shops) {
    const results = new Array(shops.length);
    let completed = 0;
    await this.browser.launch();

    const messageTemplate = (done) => `Scraping shops (${done}/${shops.length})`;
    await this.addJobMessage(messageTemplate(completed));

    await PromisePool.withConcurrency(parseInt(process.env.CONCURRENCY, 10) || 5)
      .for(shops)
      .process(async (shop, index) => {
        if (!shop.website) {
          results[index] = FALLBACK_DETAILS.NONE;
        } else {
          await this.throwIfJobCancelled();
          const page = await addShopSelectors(await this.browser.newPage());
          try {
            results[index] = await this.scrapeWebsite(page, shop.website);
          } catch (err) {
            if (err.message !== ERRORS.CANCELLED) {
              console.warn(`⚠️ Failed to get details for ${shop.title}`, err);
              results[index] = FALLBACK_DETAILS.ERROR;
            }
          } finally {
            await page.close(); // Close the page after scraping attempt
          }
        }

        await this.addJobMessage(messageTemplate(++completed), true);
      });

    await this.addJobMessage("✅ Scraping Complete", true);

    return results;
  }

  /**
   * Scrapes useful business-related data from a shop’s website using Playwright.
   *
   * If available, cached results are used to avoid redundant requests.
   * Handles blocked access or errors by returning predefined fallback values.
   *
   * @param {Page} page - Playwright Page instance for navigating and scraping the website.
   * @param {string} url - Raw URL of the shop’s website to be scraped.
   *
   * @returns {Promise<object>} Resolves to a details object containing scraped data or fallback error information.
   */
  async scrapeWebsite(page, url) {
    const normalizedUrl = normalizeUrl(url);

    // Return cached details if available
    if (this.websiteCache.has(normalizedUrl)) {
      return this.websiteCache.get(normalizedUrl);
    }

    let details;
    try {
      await this.throwIfJobCancelled();
      const response = await page.load(normalizedUrl);

      // Check if the request was blocked or rate-limited
      const status = response?.status();
      if ([403, 429].includes(status)) {
        details = FALLBACK_DETAILS.BLOCKED(status);
      } else {
        details = {
          email: await page.getEmail(),
          sellsOnline: await page.hasOnlineShop(),
          fishingReport: await page.publishesFishingReport(),
          socialMedia: await page.getSocialMedia(),
        };
      }
    } catch {
      details = FALLBACK_DETAILS.TIMEOUT;
    }

    this.websiteCache.set(normalizedUrl, details);

    return details;
  }
}
