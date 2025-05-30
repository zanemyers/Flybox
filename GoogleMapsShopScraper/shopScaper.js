const axios = require("axios");
const pLimit = require("p-limit");
const normalizeUrl = require("normalize-url");

import { MESSAGES } from "../base/enums.js";
import { addShopSelectors } from "./shopScrapingUtils.js";
import { normalizeUrl } from "../base/scrapingUtils.js";

const limit = pLimit(5);
const failedWebsites = [];
const scrapedWebsiteCache = new Map();

/**
 * Fetches a list of fly fishing shops near Yellowstone National Park
 * using SerpAPI's Google Maps engine and coordinates-based search origin.
 *
 * @returns {Promise<Array>} A list of local results (shops), or an empty array if none found.
 */
async function fetchShopsFromSerpAPI() {
  const response = await axios.get("https://serpapi.com/search.json", {
    params: {
      engine: "google_maps",
      q: "Fly Fishing Shops",
      ll: "@44.4280,-110.5885,3z", // Coordinates for Yellowstone, max zoom out
      type: "search",
      api_key: process.env.SERP_API_KEY,
    },
  });

  return response.data.local_results || [];
}

/**
 * Scrapes additional details (email, online store, fishing report, social media)
 * from the websites of each shop in parallel.
 *
 * Each shop is processed in parallel with controlled concurrency to avoid overwhelming
 * system resources or triggering anti-bot protections. Shops without websites are skipped.
 *
 * @param {Array} shops - The list of shops to scrape extra details from.
 * @param {Browser} browser - The Playwright browser instance used to create new pages.
 * @returns {Promise<Array>} - A list of detail objects (one per shop), with fallback values on failure.
 */
async function getExtraDetails(shops, browser) {
  // Map each shop to a limited concurrency async task
  const tasks = shops.map((shop) =>
    limit(async () => {
      const website = shop.website || MESSAGES.NO_WEB;

      // Skip scraping if no website is available
      if (website === MESSAGES.NO_WEB) {
        return {
          email: "",
          sellsOnline: false,
          fishingReport: false,
          socialMedia: "",
        };
      }

      const page = await browser.newPage();
      addShopSelectors(page); // Attach additional scraping helpers

      try {
        // Scrape detailed info from the shop's website
        return await scrapeWebsite(page, website);
      } finally {
        // Always close the page when done (success or failure)
        await page.close();
      }
    })
  );

  // Wait for all scraping tasks to complete (some may fail)
  const results = await Promise.allSettled(tasks);

  // Normalize the result list by handling any rejected promises
  return results.map((result, index) => {
    if (result.status === "fulfilled") return result.value;

    // Log and return fallback values for failed attempts
    console.warn(`⚠️ Failed to get details for ${shops[index].title}`);
    return {
      email: MESSAGES.ERROR_EMAIL,
      sellsOnline: MESSAGES.ERROR_SHOP,
      fishingReport: MESSAGES.ERROR_REPORT,
      socialMedia: MESSAGES.ERROR_SOCIAL,
    };
  });
}

/**
 * Scrapes useful business-related data from a given website using Playwright.
 * Extracts whether the site sells online, publishes a fishing report,
 * contains links to social media platforms, and displays an email address.
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

  const details = {}; // Initialize the result object
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
      failedWebsites.push({ normalizedUrl, error });

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
    failedWebsites.push({ normalizedUrl, error: err.message });
    details.sellsOnline = MESSAGES.ERROR_LOAD_FAILED;
    details.fishingReport = MESSAGES.ERROR_LOAD_FAILED;
    details.socialMedia = MESSAGES.ERROR_LOAD_FAILED;
    details.email = MESSAGES.ERROR_LOAD_FAILED;
  }

  // Cache and return the result
  scrapedWebsiteCache.set(normalizedUrl, details);
  return details;
}

export { fetchShopsFromSerpAPI, getExtraDetails, scrapeWebsite };
