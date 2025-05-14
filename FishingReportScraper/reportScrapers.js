import axios from "axios";
import fs from "fs";
import tokenizer from "gpt-tokenizer";

import { TXTFileWriter } from "../base/fileUtils.js";
import { scrapeAndGroup } from "./reportScrapingUtils.js";

// Example URLs for testing
const urls = [
  "https://northforkanglers.com/fishing-reports",
  "https://www.hatchfinders.com/post/april-1-spring-report",
];

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

  let compiledReports = "";
  for (const report of allReports) {
    for (const entry of report) {
      compiledReports += `Title: ${entry.title}\nDate: ${entry.date}\nBody: ${entry.body}\nSource: ${entry.source}\n---------------------\n`;
    }
  }

  // After collecting all reports, write them to the specified text file.
  // The bulkWrite method serializes the data into JSON format and writes it to the file.
  await reportWriter.write(compiledReports);

  await makeReportSummary(); // Call the function to generate a summary of the reports.
}

async function makeReportSummary() {
  // Read the text file containing fishing reports
  const fileText = fs.readFileSync(
    "resources/txt/fishing_reports.txt",
    "utf-8"
  );

  // Prepare the input for the summarization model
  const prompt = `
    For each river or body of water mentioned create a bulleted list that follows the template below.
    - If you cannot find information for a bullet leave it blank.
    - If the body of water is mentioned more than once, summarize the info into a single entry.
    - If the date is in the body and not in the date field, add it to the date field.
    - If an article contains multiple reports break them into separate entries based on the body of water.

    # 1. Mississippi River
    (River Specifics)
    * Date: (Date of report)
    * Water Type: (river, lake, stream, fork, tailwater, creek, reservoir, etc.)
    (Fly Fishing Specifics)
    * Fly Patterns: (list of fly fishing fly patterns mentioned)
    * Colors: (list of colors for fly fishing flies that were mentioned)
    * Hook Sizes: (list of hook sizes mentioned)

    ${fileText}
  `;

  // Tokenize the prompt
  const tokens = tokenizer.encode(prompt); // .encode() should work directly
  console.log(`🔢 Prompt uses ${tokens.length} tokens.`);

  // Send the prompt to local LLM api for summarization
  const result = await axios.post(`http://localhost:11434/api/generate`, {
    model: "dolphin-llama3:8b",
    prompt,
    stream: false,
  });

  // Initialize a new TXTFileWriter
  const summaryWriter = new TXTFileWriter(
    "resources/txt/summary.txt",
    "reportSummaries"
  );

  // Write the summary to a textfile
  await summaryWriter.write(result.data.response.trim());
}

export { fishingReportScraper };
