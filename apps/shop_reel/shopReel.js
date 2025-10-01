import "dotenv/config";
import { getJson } from "serpapi";
import { PromisePool } from "@supercharge/promise-pool";
import { JobStatus } from "@prisma/client";

import { ERRORS, FALLBACK_DETAILS } from "../base/constants.js";
import { addShopSelectors, buildCacheFileRows, buildShopRows } from "./shopUtils.js";
import { BaseApp, ExcelFileHandler, normalizeUrl, StealthBrowser } from "../base/index.js";

/**
 * ShopReel class handles scraping shops from Google Maps via SerpAPI,
 * fetching additional website details, and saving results to Excel.
 *
 * Extends BaseApp to integrate with the job system (progress tracking,
 * cancellation, messages, and file attachments).
 */
export class ShopReel extends BaseApp {
  /**
   * @param {string} jobId - Job ID for tracking progress and files
   * @param {Object} searchParams - Parameters for the shop search
   */
  constructor(jobId, searchParams) {
    super(jobId);
    this.searchParams = searchParams;
    this.shopWriter = new ExcelFileHandler(); // Excel writer for results
    this.websiteCache = new Map(); // Cache for previously scraped website details
    this.browser = new StealthBrowser({
      headless: process.env.RUN_HEADLESS !== "false",
    });
  }

  /**
   * Executes the full shop scraping workflow:
   * 1. Fetches shop results (SerpAPI or cached)
   * 2. Scrapes website details for each shop
   * 3. Writes the combined data to Excel
   *
   * Updates job messages, attaches files, and sets job status accordingly.
   */
  async shopScraper() {
    try {
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
   * Fetches shops from SerpAPI or loads them from a cached Excel file.
   *
   * @returns {Promise<Array<Object>>} Array of shop objects
   */
  async fetchShops() {
    const cacheFileHandler = new ExcelFileHandler();

    // Return cached shops if buffer provided
    if (this.searchParams?.file?.buffer) {
      await cacheFileHandler.loadBuffer(this.searchParams.file.buffer);
      return await cacheFileHandler.read();
    }

    // Use the environment variable SERP_API_KEY for development/testing if the provided apiKey is "test";
    // Otherwise, use the actual apiKey
    const apiKey =
      this.searchParams.apiKey === "test" && process.env.NODE_ENV === "development"
        ? process.env.SERP_API_KEY
        : this.searchParams.apiKey;

    const results = [];

    // Fetch in pages of 20 until maxResults
    for (let start = 0; start < (+this.searchParams.maxResults || 100); start += 20) {
      await this.throwIfJobCancelled();

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

      if (pageResults.length < 20) break; // Last page
    }

    // Save results to secondary file if any found
    if (results.length > 0) {
      await cacheFileHandler.write(buildCacheFileRows(results));
      await this.addJobFile("secondaryFile", await cacheFileHandler.getBuffer());
    }

    return results;
  }

  /**
   * Scrapes website details for each shop with concurrency control.
   *
   * @param {Array<Object>} shops - Array of shop objects
   * @returns {Promise<Array<Object>>} Array of shop detail objects
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
            await page.close();
          }
        }

        await this.addJobMessage(messageTemplate(++completed), true);
      });

    await this.addJobMessage("✅ Scraping Complete", true);
    return results;
  }

  /**
   * Scrapes a single shop's website for emails, online sales, fishing reports, and social media.
   *
   * Uses cached results if available to avoid redundant scraping.
   *
   * @param {Page} page - Playwright page instance
   * @param {string} url - Shop website URL
   * @returns {Promise<Object>} Scraped details or fallback values
   */
  async scrapeWebsite(page, url) {
    const normalizedUrl = normalizeUrl(url);

    if (this.websiteCache.has(normalizedUrl)) {
      return this.websiteCache.get(normalizedUrl);
    }

    let details;
    try {
      await this.throwIfJobCancelled();
      const response = await page.load(normalizedUrl);

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
