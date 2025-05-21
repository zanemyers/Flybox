import axios from "axios";
import fs from "fs";
import tokenizer from "gpt-tokenizer";

import {
  findFishingReports,
  compileFishingReports,
} from "./reportScrapingUtils.js";

/**
 * Scrapes fishing reports from a list of URLs and writes them to a text file.
 *
 * @param {import('playwright').BrowserContext} context - Playwright browser context to isolate each page.
 * @param {string[]} urls - List of base URLs for fishing shops to crawl.
 * @returns {Promise<void>} - Resolves when all reports are gathered and written.
 */
async function fishingReportScraper(context, urls) {
  const reports = [];

  // Sets batch size to 10
  const BATCH_SIZE = 10;

  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE);

    const batchReports = await Promise.all(
      batch.map(async (url) => {
        const page = await context.newPage();
        try {
          return await findFishingReports(page, url); // returns array of reports
        } catch (error) {
          console.error(`Error scraping ${url}:`, error);
          return []; // fallback to empty array on error
        } finally {
          await page.close();
        }
      })
    );

    // Flatten batch results and append
    for (const result of batchReports) {
      reports.push(...result);
    }
  }

  await compileFishingReports(reports);
  await makeReportSummary();
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
    - If the body of water is mentioned more than once, summarize the info into a single entry and break down data by the Month if possible
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
  // const result = await axios.post(`http://localhost:11434/api/generate`, {
  //   model: "dolphin-llama3:8b",
  //   prompt,
  //   stream: false,
  // });

  // Initialize a new TXTFileWriter
  // const summaryWriter = new TXTFileWriter(
  //   "resources/txt/summary.txt",
  //   "reportSummaries"
  // );

  // Write the summary to a textfile
  // await summaryWriter.write(result.data.response.trim());
}

export { fishingReportScraper };
