import "dotenv/config";
import { getJson } from "serpapi";
import { PromisePool } from "@supercharge/promise-pool";

import { FALLBACK_DETAILS } from "../../constants/index.js";
import { addShopSelectors, buildCacheFileRows, buildShopRows } from "./shopUtils.js";
import { ExcelFileHandler, normalizeUrl, StealthBrowser } from "../../utils/index.js";

/**
 * Runs the full shop scraping workflow:
 *
 * 1. Fetches shop search results using SerpAPI or cached data.
 * 2. Scrapes additional details from shop websites.
 * 3. Writes the collected data to an Excel file.
 *
 * Supports real-time progress updates and graceful cancellation at any step.
 *
 * @param {string} searchParams - ....
 * @param {Function} [progressUpdate] - Optional callback for progress/status updates.
 * @param returnFile
 * @param {Object} [cancelToken] - Optional cancellation token with a `throwIfCancelled()` method.
 *
 * @returns {Promise<void>} Resolves when the scraping completes, errors, or is cancelled.
 */

export async function shopScraper({
  searchParams,
  progressUpdate = () => {},
  returnFile = () => {},
  cancelToken = { throwIfCancelled: () => {} }, // default to no-op if not provided
}) {
  const shopWriter = new ExcelFileHandler("media/xlsx/shop_details.xlsx");
  const browser = new StealthBrowser({
    headless: process.env.RUN_HEADLESS !== "false",
  });

  try {
    cancelToken.throwIfCancelled();
    progressUpdate("Searching for shops...");
    const shops = await fetchShops(searchParams, progressUpdate, returnFile, cancelToken);
    progressUpdate(`STATUS:✅ Found ${shops.length} shops.`);

    cancelToken.throwIfCancelled();
    await browser.launch();
    const shopDetails = await getDetails(browser, shops, progressUpdate, cancelToken);

    cancelToken.throwIfCancelled();
    progressUpdate("📝 Writing shop data to Excel...");
    const rows = buildShopRows(shops, shopDetails);
    await shopWriter.write(rows);
    progressUpdate("STATUS:✅ Excel file created.");
    progressUpdate(`DOWNLOAD:shop_details.xlsx`);
    returnFile(await shopWriter.getBuffer());
  } catch (err) {
    if (err.isCancelled) {
      progressUpdate(err.message);
    } else {
      progressUpdate(`❌ Error: ${err.message || err}`);
    }
  } finally {
    await browser.close();
  }
}

/**
 * Fetches a list of shops near the specified location using SerpAPI's Google Maps engine.
 * Falls back to cached results if available and matching the current query and coordinates.
 *
 * @param searchParams
 * @param progressUpdate
 * @param returnFile
 * @param {Object} cancelToken - An object with a `throwIfCancelled()` method to support graceful cancellation.
 *
 * @returns {Promise<object[]>} A list of shop result objects, or an empty array if none found.
 */

async function fetchShops(searchParams, progressUpdate, returnFile, cancelToken) {
  const cacheFileHandler = new ExcelFileHandler();

  if (searchParams?.fileBuffer) {
    await cacheFileHandler.loadBuffer(searchParams.fileBuffer);
    return await cacheFileHandler.read();
  }

  const results = [];
  for (let start = 0; start < (+searchParams.maxResults || 100); start += 20) {
    cancelToken.throwIfCancelled();

    const data = await getJson({
      engine: "google_maps",
      q: searchParams.query,
      ll: `@${searchParams.lat},${searchParams.lng},10z`,
      start,
      type: "search",
      api_key: process.env.SERP_API_KEY, // searchParams.apiKey
    });

    const pageResults = data?.local_results || [];
    results.push(...pageResults);

    if (pageResults.length < 20) break; // Last page reached
  }

  if (results.length > 0) {
    await cacheFileHandler.write(buildCacheFileRows(results));
    progressUpdate(`DOWNLOAD:simple_shop_details.xlsx`);
    returnFile(await cacheFileHandler.getBuffer());
  }

  return results;
}

/**
 * Scrapes additional business details from each shop's website using Playwright.
 *
 * Shops are processed in parallel with controlled concurrency to avoid overwhelming
 * system resources or triggering anti-bot protections.
 *
 * @param browser
 * @param {Array<object>} shops - The list of shops to process.
 * @param {Function} progressUpdate - A function to send real-time progress updates (optional).
 * @param {Object} cancelToken - An object with a `throwIfCancelled()` method to support graceful cancellation.
 *
 * @returns {Promise<Array<object>>} A list of shop detail objects (one per shop), using fallback values when scraping fails.
 */
async function getDetails(browser, shops, progressUpdate = () => {}, cancelToken) {
  const websiteCache = new Map();
  const results = new Array(shops.length);
  let completed = 0;

  const messageTemplate = (done) => `Scraping shops (${done}/${shops.length})`;
  progressUpdate(messageTemplate(completed));

  await PromisePool.withConcurrency(parseInt(process.env.CONCURRENCY, 10) || 5)
    .for(shops)
    .process(async (shop, index) => {
      if (!shop.website) {
        results[index] = FALLBACK_DETAILS.NONE;
      } else {
        cancelToken.throwIfCancelled();
        const page = await addShopSelectors(await browser.newPage());
        try {
          results[index] = await scrapeWebsite(websiteCache, page, shop.website, cancelToken);
        } catch (err) {
          if (!err.isCancelled) {
            console.warn(`⚠️ Failed to get details for ${shop.title}`, err);
            results[index] = FALLBACK_DETAILS.ERROR;
          } else {
            throw err; // Bubble up
          }
        } finally {
          await page.close();
        }
      }

      ++completed;
      progressUpdate("STATUS:" + messageTemplate(completed));
    });

  progressUpdate("STATUS:✅ Scraping Complete");

  return results;
}

/**
 * Scrapes useful business-related data from a shop’s website using Playwright.
 *
 * If available, cached results are used to avoid unnecessary requests. If the site
 * blocks access or an error occurs, fallback values are returned.
 *
 * @param websiteCache
 * @param {Page} page - A Playwright Page instance used to navigate and scrape the website.
 * @param {string} url - The raw URL of the shop’s website to be scraped.
 * @param {Object} cancelToken - An object with a `throwIfCancelled()` method to support graceful cancellation.
 *
 * @returns {Promise<object>} A details object containing scraped data or fallback error values.
 */

async function scrapeWebsite(websiteCache, page, url, cancelToken) {
  const normalizedUrl = normalizeUrl(url);

  // Check for cached results
  if (websiteCache.has(normalizedUrl)) {
    return websiteCache.get(normalizedUrl);
  }

  let details;
  try {
    cancelToken.throwIfCancelled();
    const response = await page.load(normalizedUrl); // Open the page and wiggle the mouse

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

  // Cache and return the result
  websiteCache.set(normalizedUrl, details);
  return details;
}
