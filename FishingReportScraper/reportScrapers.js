// import axios from "axios";
import fs from "fs";
import tokenizer from "gpt-tokenizer";

import { TXTFileWriter } from "../base/fileUtils.js";
import {
  scrapeVisibleText,
  extractAnchors,
  filterReports,
  includesAny,
  isSameDomain,
} from "./reportScrapingUtils.js";

import { normalizeUrl } from "../base/scrapingUtils.js";

/**
 * Scrapes fishing reports from a list of site objects and writes them to a text file.
 *
 * Each site object should include:
 *   - `url` (string): The base URL of the fishing shop to crawl.
 *   - `selector` (string): The CSS selector to extract the report content.
 *   - `lastUpdated` (string): A human-readable date string for when the report was last confirmed.
 *
 * @param {import('playwright').BrowserContext} context - Playwright browser context to isolate each page.
 * @param {{ url: string, selector: string, lastUpdated: string }[]} sites - List of site objects to crawl.
 * @returns {Promise<void>} - Resolves when all reports are gathered and written.
 */
async function fishingReportScraper(context, sites) {
  const reports = [];

  // Sets batch size to 10
  const BATCH_SIZE = 5;

  for (let i = 0; i < sites.length; i += BATCH_SIZE) {
    const batch = sites.slice(i, i + BATCH_SIZE);

    const batchReports = await Promise.all(
      batch.map(async (site) => {
        const page = await context.newPage();
        try {
          return await findFishingReports(page, site); // returns array of reports
        } catch (error) {
          console.error(`Error scraping ${site.url}:`, error);
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
// async function fishingReportScraper(context, sites) {
//   const reports = [];

//   for (const site of sites) {
//     const page = await context.newPage();
//     try {
//       const siteReports = await findFishingReports(page, site); // returns array of reports
//       reports.push(...siteReports);
//     } catch (error) {
//       console.error(`Error scraping ${site.url}:`, error);
//     } finally {
//       await page.close();
//     }
//   }

//   await compileFishingReports(reports);
//   await makeReportSummary();
// }

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
async function findFishingReports(page, site, maxVisits = 25) {
  const visited = new Set(); // Keep track of visited URLs
  const toVisit = [{ url: site.url, priority: -1 }]; // Queue of URLs to visit
  const baseHostname = new URL(site.url).hostname; // pull hostname to restrict crawling domains
  const reports = []; // Array to store fishing reports

  // Continue crawling as long as there are URLs to visit and we haven't reached the visit limit
  while (toVisit.length > 0 && visited.size < maxVisits) {
    const { url } = toVisit.shift(); // Take the next URL to visit
    if (visited.has(url)) continue; // Skip if visited
    visited.add(url); // Mark this URL as visited

    // Try to navigate to the page; skip if navigation fails
    try {
      await page.goto(url, { timeout: 10000, waitUntil: "domcontentloaded" });
    } catch (error) {
      console.error(`Error navigating to ${url}:`, error);
      continue;
    }

    // Scrape visible text only if the URL is not the base site URL
    if (url !== site.url) {
      const text = await scrapeVisibleText(page, site.selector);
      if (text) {
        // Store the scraped text with the source URL for reference
        reports.push(`${text}\nSource: ${url}`);
      }
    }

    const pageLinks = await extractAnchors(page); // Extract all anchor links (href + visible text)
    const currentUrlHasKeyword = includesAny(url, site.keywords); // check current url has report keyword

    // Process each link on the page to evaluate if it should be queued
    for (const { href, linkText } of pageLinks) {
      if (!isSameDomain(href, baseHostname)) continue; // Ignore links to different domains

      const normLink = normalizeUrl(href); // normalize for consistent comparison

      // Skip if we've already visited or queued the url
      if (
        visited.has(normLink) ||
        toVisit.some((item) => item.url === normLink)
      )
        continue;

      const hasKeyword = includesAny(normLink, site.keywords); // Check priority based on keywords
      const hasJunkWord = includesAny(normLink, site.junkWords); // Check for low priority keywords
      const hasClickPhrase = includesAny(linkText, site.clickPhrases);

      let priority = Infinity; // do not queue by default
      if (hasKeyword && !hasJunkWord) {
        // Best case: link contains a report keyword and no junk words
        priority = 0;
      } else if (currentUrlHasKeyword && hasClickPhrase) {
        // Current page has a keyword and the link text contains a phrase that implies more content
        priority = 1;
      } else if (hasKeyword && hasJunkWord) {
        // Link contains a report keywords and a junk word
        priority = 2;
      }

      // Only add the link to the queue if it has a valid priority
      if (priority !== Infinity) {
        toVisit.push({ url: normLink, priority });
      }
    }

    // resort the queue so that highest priority URLs come first
    toVisit.sort((a, b) => a.priority - b.priority);
  }

  // Log if we stopped crawling because we reached the max visit limit
  if (visited.size >= maxVisits) {
    console.log(`Reached max visits limit for site: ${maxVisits}`);
  }

  return reports;
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

  // Filter reports based on date and keywords
  const filteredReports = filterReports(reports);
  console.log(`Old Reports: ${reports.length - filteredReports.length}`);

  // Divider between individual reports for readability
  const divider = "\n" + "-".repeat(50) + "\n";

  // Combine all filtered report entries into a single string
  const compiledReports = filteredReports.join(divider);

  // Write the final compiled content to the file
  await reportWriter.write(compiledReports);
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
