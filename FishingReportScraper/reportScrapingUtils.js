import { differenceInDays } from "date-fns";

import { CSVFileReader } from "../base/fileUtils.js";
import { normalizeUrl } from "../base/scrapingUtils.js";
import { extractMostRecentDate } from "../base/dateUtils.js";

/**
 * Reads a CSV file containing shop details and returns a filtered list of shops
 * that publish fishing reports. Each result includes the shop's name and website.
 *
 * The CSV file is expected to have at least the following columns:
 * - "name": Name of the shop
 * - "website": Website URL of the shop
 * - "publishesFishingReport": Boolean string ("true"/"false") indicating if reports are published
 *
 * @returns {Promise<Array<{ name: string, website: string }>>} List of filtered shop info
 */
async function getUrlsFromCSV() {
  // Initialize the CSV file reader
  const reader = new CSVFileReader(
    "resources/csv/shop_details.csv", // Path to the CSV file
    (row) => row["publishesFishingReport"] === "true", // filter function
    (row) => row["website"]
  );

  // Read the CSV to get website URLs that publish fishing reports
  return await reader.read();
}

/**
 * Normalize site URLs and remove duplicates.
 *
 * This function ensures each site object has a normalized URL and
 * that only unique URLs are included in the returned array.
 * Duplicate URLs are detected and logged.
 *
 * @param {Array} sites - Array of site objects with a `url` property.
 * @returns {Array} A new array of site objects with normalized, unique URLs.
 */
async function checkDuplicateUrls(sites) {
  const urlsSet = new Set(); // Track normalized URLs to detect duplicates
  const normalizedSites = []; // Store unique, normalized site objects

  for (const site of sites) {
    const normalized = await normalizeUrl(site.url); // Normalize the URL

    if (!urlsSet.has(normalized)) {
      urlsSet.add(normalized);

      // Add a new site object with the normalized URL
      normalizedSites.push({
        ...site,
        url: normalized,
      });
    } else {
      // Log a warning if the normalized URL was already seen
      console.warn("Duplicate found:", normalized);
    }
  }

  return normalizedSites;
}

/**
 * Checks whether a given URL belongs to the same domain as the base hostname.
 *
 * @param {string} url - The URL to check.
 * @param {string} hostname - The hostname to compare against (e.g., "example.com").
 * @returns {boolean} True if the url's hostname matches the base hostname, false otherwise.
 */
function isSameDomain(url, hostname) {
  try {
    return new URL(url).hostname === hostname;
  } catch {
    return false;
  }
}

/**
 * Checks if any term in the list is included in the target string (case-insensitive).
 *
 * @param {string} target - The string to search in.
 * @param {string[]} terms - List of keywords/phrases/junk words to search for.
 * @returns {boolean} True if any term is found, otherwise false.
 */
function includesAny(target, terms) {
  // if target isn't a string or terms is not an array return false
  if (typeof target !== "string" || !Array.isArray(terms)) return false;

  const lower = target.toLowerCase();
  return terms.some((term) => lower.includes(term.toLowerCase()));
}

/**
 * Extract all anchor tags with href and normalized text content from the page.
 *
 * @param {import('playwright').Page} page - The Playwright page object.
 * @returns {Promise<{href: string, text: string}[]>} - Array of objects with href and text.
 */
async function extractAnchors(page) {
  return await page.$$eval("a[href]", (anchors) =>
    anchors.map((a) => ({
      href: a.href,
      text: a.textContent?.toLowerCase().trim() || "",
    }))
  );
}

/**
 * Scrapes only visible text from the first matching wrapper element per selector.
 *
 * @param {object} page - Playwright Page object
 * @param {string} selector - CSS selector to match
 * @returns {Promise<string|null>} - Visible text if found, otherwise null
 */
async function scrapeVisibleText(page, selector) {
  // Find the first element on the page that matches the selector
  const element = await page.$(selector);
  if (!element) return null; // No matching element found

  // Evaluate the matched element in the browser context
  return await element.evaluate((node) => {
    // Get computed styles to determine visibility
    const style = window.getComputedStyle(node);
    const isVisible =
      style.display !== "none" && // not display: none
      style.visibility !== "hidden" && // not visibility: hidden
      node.offsetParent !== null; // not detached or invisible due to layout

    // If visible, return cleaned-up inner text (remove extra blank lines)
    return isVisible
      ? node.innerText.trim().replace(/\n{2,}/g, "\n") // condense multiple newlines
      : null; // otherwise return null
  });
}

/**
 * Filters fishing reports based on date and keywords,
 * and extracts source URLs into the provided array.
 *
 * @param {string[]} reports - Array of report texts.
 * @returns {string[]} Filtered reports that pass the criteria.
 */
function filterReports(reports, maxDaysOld = 100) {
  return reports.filter((report) => {
    // Get all dates from the report text
    const reportDate = extractMostRecentDate(report);

    // If no dates found exclude it
    if (!reportDate) return false;

    // Exclude reports older than specified days
    const daysDifference = differenceInDays(new Date(), reportDate);
    if (daysDifference > maxDaysOld) return false;

    // Additional filtering logic can go here
    // if (!includesAny(report, IMPORTANT_RIVERS)) return false;

    return true;
  });
}

export {
  checkDuplicateUrls,
  extractAnchors,
  filterReports,
  getUrlsFromCSV,
  includesAny,
  isSameDomain,
  scrapeVisibleText,
};
