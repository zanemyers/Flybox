import "dotenv/config";
import { chromium } from "playwright";
import { fishingReportScraper } from "./reportScrapers.js";
import { getUrlsFromCSV } from "./reportScrapingUtils.js";
import { normalizeUrl } from "../base/scrapingUtils.js";

async function main() {
  // TODO: we should run this occassionally and use chatGPT to see if there are new ones,
  // check those to see if they've updated recently
  // const urls = await getUrlsFromCSV();

  // List of URLs to scrape, UPDATED MAY 21, 2025
  const urls = [
    // URL, selector to get report, date site was last updated
    "https://bigskyanglers.com/", // article - OCT 2024
    "http://henrysforkanglers.com/", // article - MAY 2025
    "https://www.thetackleshop.com/", // article - MAY 2025
    "http://www.hatchfinders.com/", // article - APR 2025
    "https://snakeriverangler.com/", // article - MAY 2025
    "http://worldcastanglers.com/", // article - MAY 2025
    "http://www.montanaangler.com/", // article - MAY 2025
    "https://danbaileys.com/", // article - MAY 2025
    "https://bozemanflyfishing.com/", // article - FEB 2025
    "http://frontieranglers.com/", // article - MAY 2025
    "http://www.flyfishfood.com/", // article - MAY 2025
    "https://bighornangler.com/", // article - MAY 2025
    "http://trroutfitters.com/", // article - APR 2025
    "https://www.beartoothflyfishing.com/", // div.post - MAY 2025
    "http://www.sweetwaterflyshop.com/", // div.post - MAY 2025
    "http://snakeriverfly.com/", // div.main-sidebar - MAY 2025
    "https://northforkanglers.com/", // div.user-items-list - MAY 2025
    "https://www.yellowdogflyfishing.com/", // div.reportContent - MAY 2025
    "http://blackfootriver.com/", // div.full-report - MAY 2025
    "http://parksflyshop.com/", // div.entry-content - 2025
    "http://www.montanatrout.com/", // main.page-blocks - MAY 2025
    "http://www.sunriseflyshop.com/", // ul.wp-block-latest-posts__list - MAY 2025
    "http://www.bozemanflysupply.com/", // div._1140-w-wrapper:has(h1:has-text("fishing report")) - MAY 2025
    "https://theriversedge.com/", // div.container:has(h2:has-text("river fishing report")) - MAY 2025
    "http://troutfitters.com/", // div.mb-5:has(h2:has-text("Fly Pattern Suggestions")) - MAY 2025
    "http://madisonriveroutfitters.com/", // div.container.main.content - MAY 2025
    "https://www.thestonefly.com/", // div#main-content - 2025
    "http://westbankanglers.com/", // main.main-content - MAY 2025
    "http://www.mrfc.com/", // main.main-content - MAY 2025
  ];

  // make sure URLs are normalized and no duplicates
  const normalizedURLs = new Set();
  for (const url of urls) {
    normalizedURLs.add(await normalizeUrl(url));
  }

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });

  // // await fishingReportScraper(context, urls);
  await fishingReportScraper(context, Array.from(normalizedURLs));

  browser.close();
}

main().catch((err) => {
  console.error("Fatal error:", err);
});
