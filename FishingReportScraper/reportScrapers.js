import { InferenceClient } from "@huggingface/inference";
import * as cheerio from "cheerio";
import fs from "fs";
import path from "path";

import { CSVFileReader, TXTFileWriter } from "../base/fileUtils.js";

// Example URLs for testing
const urls = [
  "https://northforkanglers.com/fishing-reports",
  "https://www.hatchfinders.com/post/april-1-spring-report",
  "https://theriversedge.com/pages/spring-creeks-fishing-report",
];

async function getReportSummary() {
  // Initialize the TXTFileWriter for saving the summary
  const summaryWriter = new TXTFileWriter(
    "resources/txt/summary.txt",
    "reportSummaries"
  );

  // Initialize the Hugging Face Inference client
  const client = new InferenceClient(process.env.HF_API_KEY);

  // Read the text file containing fishing reports
  const fileText = fs.readFileSync(
    "resources/txt/fishing_reports.txt",
    "utf-8"
  );

  // Prepare the input for the summarization model
  const inputWithPrompt = `
    Summarize the following fishing reports. For each report, extract:
    - River name
    - Date
    - Fly type (if mentioned)
    - Fly color (if mentioned)
    - Any patterns, conditions, or notable results

    Fishing Reports:
    ${fileText}
  `;

  // Call the summarization model
  const result = await client.summarization({
    model: "facebook/bart-large-cnn",
    inputs: inputWithPrompt,
  });

  // Save the summary to a text file
  await summaryWriter.write(result[0].summary_text);
}

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
    (row) => ({
      name: row["name"],
      website: row["website"],
    }) // row map function
  );

  // Read the CSV to get website URLs that publish fishing reports
  return await reader.read();
}

async function scrapeAndGroup(page, url) {
  try {
    await page.goto(url, { timeout: 10000 });
  } catch (error) {
    console.error(`Error navigating to ${url}:`, error);
    return null;
  }

  // 1) grab full HTML
  const html = await page.content();

  // 2) load into Cheerio
  const $ = cheerio.load(html);

  // 3) pick the wrapper elements for each “card” or report block
  //    (you’ll need to inspect a few pages to find the right selector)
  const wrappers = $("li.list-item, div.report-card, section.post, article");

  // 4) map over them and pull out title / date / body / image, etc.
  const reports = [];
  wrappers.each((_, el) => {
    const $el = $(el);

    // Example heuristics—adjust selectors to your page’s actual classes/tags:
    const title =
      $el.find("h2, .title, .post-title").first().text().trim() || null;
    const date =
      $el.find("time, .date, .post-date").first().text().trim() || null;
    const body = $el
      .find("p")
      .map((_, p) => $(p).text().trim())
      .get()
      .join("\n\n");
    const img = $el.find("img").first().attr("src") || null;

    // Only include if we actually found meaningful content
    if (title || body) {
      reports.push({ title, date, body, img });
    }
  });

  return reports;
}

// async function fishingReportScraper(context, urls) {
/**
 * Scrapes fishing reports from a list of URLs and writes them to a text file.
 *
 * @param {object} context - The browser context used to create new pages for scraping.
 */
async function fishingReportScraper(context) {
  // Initialize the TXTFileWriter with the target file path and archive folder name.
  const reportWriter = new TXTFileWriter(
    "resources/txt/fishing_reports.txt", // Path where the report will be saved
    "fishingReports" // Folder name for archiving old reports
  );

  // Create a new page instance from the provided browser context.
  const page = await context.newPage();

  // Initialize an array to store all scraped fishing reports.
  const allReports = [];

  // Iterate over each URL in the 'urls' array to scrape data.
  for (const url of urls) {
    // Scrape and process the fishing report data from the current URL.
    const data = await scrapeAndGroup(page, url);

    // Add the processed data to the allReports array.
    allReports.push(data);
  }

  // After collecting all reports, write them to the specified text file.
  // The bulkWrite method serializes the data into JSON format and writes it to the file.
  await reportWriter.bulkWrite(allReports);

  await getReportSummary(); // Call the function to generate a summary of the reports.
}

async function findFishingReports() {}

export { fishingReportScraper, getUrlsFromCSV };
