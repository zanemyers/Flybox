import { CSVFileReader, TXTFileWriter } from "../base/fileUtils.js";
import {
  REPORT_SELECTORS,
  REPORT_URL_KEYWORDS,
  LOW_PRIORITY_URL_KEYWORDS,
} from "../base/enums.js";
import { normalizeUrl } from "../base/scrapingUtils.js";

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
 * Crawls a fishing shop website starting from a given URL,
 * prioritizing internal links that are more likely to contain fishing reports
 * based on a list of prioritized keywords.
 *
 * Navigates the site up to `maxVisits` pages, collects visible text content,
 * and returns an array of reports with their source URLs.
 *
 * @param {import('playwright').Page} page - The Playwright page object.
 * @param {string} startUrl - The starting URL to begin crawling from.
 * @param {number} maxVisits - Maximum number of pages to visit.
 * @returns {Promise<string[]>} - A list of report texts with source URLs.
 */
async function findFishingReports(page, startUrl, maxVisits = 25) {
  const visited = new Set(); // Track visited URLs
  const toVisit = [startUrl]; // Queue of URLs to crawl
  const baseHostname = new URL(startUrl).hostname;
  const reports = []; // Collected report texts

  while (toVisit.length > 0) {
    if (visited.size >= maxVisits) {
      console.log(`Reached max visits limit for site: ${maxVisits}`);
      break;
    }

    const url = toVisit.shift();
    if (visited.has(url)) continue;
    visited.add(url);

    // Navigate to the page
    try {
      await page.goto(url, { timeout: 10000, waitUntil: "domcontentloaded" });
    } catch (error) {
      console.error(`Error navigating to ${url}:`, error);
      continue;
    }

    // Get all anchor tag hrefs from the page
    const links = await page.$$eval("a[href]", (anchors) =>
      anchors.map((a) => a.href)
    );

    // Scrape visible text and save it with the source URL
    const text = await scrapeVisibleText(page);
    if (text) {
      reports.push(text + `\nSource: ${url}`);
    }

    // Filter and prioritize links on the same domain that match report keywords
    const prioritizedLinks = links
      .filter((link) => {
        try {
          const linkUrl = new URL(link);
          return linkUrl.hostname === baseHostname;
        } catch {
          return false; // Skip malformed URLs
        }
      })
      .map((link) => {
        const priority = REPORT_URL_KEYWORDS.findIndex((keyword) =>
          link.toLowerCase().includes(keyword)
        );
        return {
          link,
          priority: priority === -1 ? Infinity : priority, // Lower = higher priority
        };
      })
      .filter(({ priority }) => priority !== Infinity) // Keep only matching links
      .sort((a, b) => a.priority - b.priority); // Sort by keyword priority

    // Add prioritized links to visit queue
    for (const { link } of prioritizedLinks) {
      const normalizedLink = normalizeUrl(link);
      if (!visited.has(normalizedLink) && !toVisit.includes(normalizedLink)) {
        const isLowPriority = LOW_PRIORITY_URL_KEYWORDS.some((keyword) =>
          normalizedLink.toLowerCase().includes(keyword)
        );

        if (isLowPriority) {
          toVisit.push(normalizedLink); // Deprioritized: go to end of queue
        } else {
          toVisit.unshift(normalizedLink); // Prioritized: go to front of queue
        }
      }
    }
  }

  return reports;
}

/**
 * Scrapes only visible text from the first matching wrapper element per selector.
 *
 * @param {object} page - Playwright Page object
 * @returns {Array<{ text: string, source: string }>} - Array of visible text blocks
 */
async function scrapeVisibleText(page) {
  for (const selector of REPORT_SELECTORS) {
    // Find the first element matching this selector
    const element = await page.$(selector);
    if (!element) continue; // No match, try next selector

    // Evaluate visible text on the outer element only
    const text = await element.evaluate((node) => {
      const style = window.getComputedStyle(node);
      const isVisible =
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        node.offsetParent !== null;

      return isVisible ? node.innerText.trim().replace(/\n{2,}/g, "\n") : null;
    });

    if (text) {
      // Return immediately once found first visible block of text
      return text;
    }
  }

  // If no visible text found on any selector
  return null;
}

/**
 * Compiles an array of fishing report texts into a single formatted file.
 *
 * @param {string[]} reports - An array of report texts, each already tagged with a source.
 */
async function compileFishingReports(reports) {
  // Create a TXTFileWriter instance for writing and archiving reports
  const reportWriter = new TXTFileWriter(
    "resources/txt/fishing_reports.txt", // Output file path
    "fishingReports" // Archive folder name
  );

  // Divider between individual reports for readability
  const divider = "\n" + "-".repeat(50) + "\n";

  // Combine all report entries into a single string
  const compiledReports = reports.join(divider);

  // Write the final compiled content to the file
  await reportWriter.write(compiledReports);
}

export { compileFishingReports, findFishingReports, getUrlsFromCSV };
