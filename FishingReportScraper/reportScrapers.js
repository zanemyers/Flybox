import axios from "axios";
import fs from "fs";
import tokenizer from "gpt-tokenizer";

import { normalizeUrl } from "../base/scrapingUtils.js";
import {
  REPORT_URL_KEYWORDS,
  LOW_PRIORITY_URL_KEYWORDS,
} from "../base/enums.js";

import {
  scrapeVisibleText,
  compileFishingReports,
} from "./reportScrapingUtils.js";

// Example URLs for testing
const urls = [
  "https://bigskyanglers.com/",
  "http://arricks.com/",
  "http://henrysforkanglers.com/",
  "http://slideinn.com/",
  "https://thetackleshop.com/",
  "https://northforkanglers.com/",
  "http://hatchfinders.com/",
  "https://snakeriverangler.com/",
  "http://worldcastanglers.com/",
  "http://montanaangler.com/",
  "http://snakeriverangler.com/",
  "https://danbaileys.com/",
  "https://bozemanflyfishing.com/",
  "http://frontieranglers.com/",
  "http://flyfishfood.com/",
  "https://bighornangler.com/",
];

// async function fishingReportScraper(context, urls) {
/**
 * Scrapes fishing reports from a list of URLs and writes them to a text file.
 *
 * @param {object} context - The Playwright browser context used to create isolated pages.
 */
async function fishingReportScraper(context) {
  // Create a new page instance within the provided browser context
  const page = await context.newPage();

  // Array to hold all compiled fishing report texts
  const report_links = new Set();
  const reports = [];

  // Loop through each URL to find fishing reports
  for (const url of urls) {
    const foundLinks = await findFishingReports(page, url);
    for (const link of foundLinks) {
      if (link !== url) {
        // exclude the main page url itself
        report_links.add(link);
      }
    }
  }

  // Loop through all found links and scrape the text if possible
  for (const link of report_links) {
    // Extract the visible text content from the page
    const text = await scrapeVisibleText(page, link);

    if (text) {
      // Store the report text along with its source URL
      reports.push(text + `\nSource: ${link}`);
    }
  }

  // Compile and write the reports to a file
  await compileFishingReports(reports);

  // Generate a high-level summary of all reports
  await makeReportSummary();
}

/**
 * Look through the website provided to find fishing reports within the last year and a half.
 * Looks for URLs with keywords in REPORT_URL_KEYWORDS.
 * If it finds any, adds them to a set of URLs.
 * Once all URLs with a matching keyword on a page have been added to a set,
 * navigate to each URL in the set recursively until all URLs have been visited.
 *
 * @param {object} page - Playwright page instance
 * @param {string} startUrl - URL to start scraping from
 * @returns {Set<string>} Set of all found fishing report URLs
 */
async function findFishingReports(page, startUrl, maxVisits = 25) {
  const visited = new Set();
  const toVisit = [startUrl];
  const baseHostname = new URL(startUrl).hostname;

  while (toVisit.length > 0) {
    if (visited.size >= maxVisits) {
      console.log(`Reached max visits limit for site: ${maxVisits}`);
      break;
    }
    const url = toVisit.shift();

    if (visited.has(url)) {
      continue; // Skip if already visited
    }
    visited.add(url);

    try {
      await page.goto(url, { timeout: 10000, waitUntil: "domcontentloaded" });
    } catch (error) {
      console.error(`Error navigating to ${url}:`, error);
      continue; // skip to next url in queue
    }

    // Extract all <a> hrefs from the page
    const links = await page.$$eval("a[href]", (anchors) =>
      anchors.map((a) => a.href)
    );

    // Filter links containing any keyword from REPORT_URL_KEYWORDS AND on the same domain
    const reportLinks = links.filter((link) => {
      try {
        const linkUrl = new URL(link);
        // Check same domain
        if (linkUrl.hostname !== baseHostname) {
          return false;
        }
        // Check for keywords in the URL
        return REPORT_URL_KEYWORDS.some((keyword) =>
          linkUrl.href.toLowerCase().includes(keyword)
        );
      } catch {
        return false; // invalid URL
      }
    });

    // Normalize and add new URLs to the toVisit queue if not visited
    for (const link of reportLinks) {
      const normalizedLink = normalizeUrl(link);
      if (!visited.has(normalizedLink) && !toVisit.includes(normalizedLink)) {
        const isLowPriority = IGNORE_URL_KEYWORDS.some((keyword) =>
          normalizedLink.toLowerCase().includes(keyword)
        );

        // Add to end if low-priority, else to front (or beginning)
        if (isLowPriority) {
          toVisit.push(normalizedLink); // deprioritized
        } else {
          toVisit.unshift(normalizedLink); // prioritize
        }
      }
      }
    }
  }

  return visited;
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
