import { CSVFileReader, TXTFileWriter } from "../base/fileUtils.js";
import { REPORT_SELECTORS, REPORT_URL_KEYWORDS } from "../base/enums.js";

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

/**
 * Scrapes only visible text from the first matching wrapper element per selector.
 *
 * @param {object} page - Playwright Page object
 * @returns {Array<{ text: string, source: string }>} - Array of visible text blocks
 */
async function scrapeVisibleText(page, link) {
  try {
    await page.goto(link, { timeout: 10000, waitUntil: "domcontentloaded" });
  } catch (error) {
    console.error(`Error navigating to ${link}:`, error);
  }

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

export { getUrlsFromCSV, scrapeVisibleText, compileFishingReports };
