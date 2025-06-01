import fs from "fs/promises";
import { getJson } from "serpapi";
import { PromisePool } from "@supercharge/promise-pool";

import { MESSAGES } from "../base/enums.js";
import { addShopSelectors, loadCachedShops } from "./shopUtils.js";
import { normalizeUrl } from "../base/scrapingUtils.js";
import { progressBar } from "../base/terminalUtils.js";

const scrapedWebsiteCache = new Map();
const SHOPS_FILE = "./shops.json";

/**
 * Fetches a list of fly fishing shops near Yellowstone National Park
 * using SerpAPI's Google Maps engine and coordinates-based search origin.
 *
 * @returns {Promise<Array>} A list of local results (shops), or an empty array if none found.
 */
async function fetchShops() {
  // Try to load cached shops first
  const cachedShops = await loadCachedShops(SHOPS_FILE);
  if (cachedShops) return cachedShops;

  let allResults = [];
  let maxResults = 100; // Set to 100 or whatever you want

  for (let start = 0; start < maxResults; start += 20) {
    const response = await getJson({
      engine: "google_maps",
      q: "Fly Fishing Shops",
      ll: "@44.4280,-110.5885,10z", // Coordinates for Yellowstone NP
      start: start,
      type: "search",
      api_key: process.env.SERP_API_KEY,
    });

    const results = response.data.local_results || [];
    allResults.push(...results);

    if (results.length < 20) {
      // No more results, stop pagination
      break;
    }
  }

  // Save results to file
  await fs.writeFile(SHOPS_FILE, JSON.stringify(allResults, null, 2), "utf-8");

  return allResults;
}

/**
 * Scrapes additional details (email, online store, fishing report, social media)
 * from the websites of each shop in parallel.
 *
 * Each shop is processed in parallel with controlled concurrency to avoid overwhelming
 * system resources or triggering anti-bot protections. Shops without websites are skipped.
 *
 * @param {Array} shops - The list of shops to scrape extra details from.
 * @param {BrowserContext} context - The browser context used to create new pages.
 * @returns {Promise<Array>} - A list of detail objects (one per shop), with fallback values on failure.
 */
async function getDetails(shops, context) {
  const total = shops.length;
  let complete = 0;
  progressBar(complete, total);

  const results = [];

  // Use PromisePool to process shops with concurrency of 5
  await PromisePool.withConcurrency(5)
    .for(shops)
    .process(async (shop) => {
      // Get the website URL or fallback to a "no website" message
      const website = shop.website || MESSAGES.NO_WEB;

      // Skip scraping if no website is available
      if (website === MESSAGES.NO_WEB) {
        complete++;
        progressBar(complete, total);

        results.push({
          email: "",
          sellsOnline: false,
          fishingReport: false,
          socialMedia: "",
        });
        return;
      }

      // Open a new browser page for scraping
      const page = await context.newPage();
      addShopSelectors(page); // attach custom helper selector

      try {
        // Attempt to scrape detailed info from the shop's website
        const details = await scrapeWebsite(page, website);
        results.push(details);
      } catch (err) {
        // Log any scraping errors and add fallback error values
        console.warn(`⚠️ Failed to get details for ${shop.title}`, err);
        results.push({
          email: MESSAGES.ERROR_EMAIL,
          sellsOnline: MESSAGES.ERROR_SHOP,
          fishingReport: MESSAGES.ERROR_REPORT,
          socialMedia: MESSAGES.ERROR_SOCIAL,
        });
      } finally {
        // Always close the page to free up resources
        await page.close();

        // Update progress after each shop is processed
        complete++;
        progressBar(complete, total);
      }
    });

  // Return the array containing details for all shops
  return results;
}

/**
 * Scrapes useful business-related data from a given website using Playwright.
 *
 * @param {Page} page - A Playwright page instance used to navigate and scrape the website.
 * @param {string} url - The raw URL of the shop’s website to be scraped.
 * @returns {Promise<object>} - An object with extracted details or fallback error values.
 */
async function scrapeWebsite(page, url) {
  const normalizedUrl = normalizeUrl(url);

  // Return cached result if this site was already scraped
  if (scrapedWebsiteCache.has(normalizedUrl)) {
    return scrapedWebsiteCache.get(normalizedUrl);
  }

  const details = {};
  try {
    // Attempt to navigate to the site (with a 10s timeout)
    const response = await page.goto(normalizedUrl, {
      waitUntil: "domcontentloaded",
      timeout: 10000,
    });

    // Check if the request was blocked or rate-limited
    const status = response?.status();
    if (status === 403 || status === 429) {
      const error = MESSAGES.ERROR_BLOCKED_FORBIDDEN(status);

      // Store and return uniform error values for all fields
      const fallback = {
        email: error,
        sellsOnline: error,
        fishingReport: error,
        socialMedia: error,
      };
      scrapedWebsiteCache.set(normalizedUrl, fallback);
      return fallback;
    }

    // Wait briefly to allow dynamic content to render before scraping
    await page.waitForTimeout(1500);
    details.sellsOnline = await page.hasOnlineShop();
    details.fishingReport = await page.publishesFishingReport();
    details.socialMedia = await page.getSocialMedia();
    details.email = await page.getEmail();
  } catch (err) {
    // Log errors and return fallback error messages
    details.sellsOnline = MESSAGES.ERROR_LOAD_FAILED;
    details.fishingReport = MESSAGES.ERROR_LOAD_FAILED;
    details.socialMedia = MESSAGES.ERROR_LOAD_FAILED;
    details.email = MESSAGES.ERROR_LOAD_FAILED;
  }

  // Cache and return the result
  scrapedWebsiteCache.set(normalizedUrl, details);
  return details;
}

export { fetchShops, getDetails };
