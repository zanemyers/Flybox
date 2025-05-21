import "dotenv/config";
import { chromium } from "playwright";
import { fishingReportScraper } from "./reportScrapers.js";
import { getUrlsFromCSV, checkDuplicateUrls } from "./reportScrapingUtils.js";
import { normalizeUrl } from "../base/scrapingUtils.js";

async function main() {
  // TODO: we should run this occassionally and use chatGPT to see if there are new urls,
  // check those to see if they've updated recently and add them to the sites list of dictionaries
  // const urls = await getUrlsFromCSV();

  // List of URLs to scrape, UPDATED MAY 21, 2025
  const sites = [
    {
      url: "https://bigskyanglers.com/",
      selector: "article",
      lastUpdated: "OCT 2024",
    },
    {
      url: "http://henrysforkanglers.com/",
      selector: "article",
      lastUpdated: "MAY 2025",
    },
    {
      url: "https://www.thetackleshop.com/",
      selector: "article",
      lastUpdated: "MAY 2025",
    },
    {
      url: "http://www.hatchfinders.com/",
      selector: "article",
      lastUpdated: "APR 2025",
    },
    {
      url: "https://snakeriverangler.com/",
      selector: "article",
      lastUpdated: "MAY 2025",
    },
    {
      url: "http://worldcastanglers.com/",
      selector: "article",
      lastUpdated: "MAY 2025",
    },
    {
      url: "http://www.montanaangler.com/",
      selector: "article",
      lastUpdated: "MAY 2025",
    },
    {
      url: "https://danbaileys.com/",
      selector: "article",
      lastUpdated: "MAY 2025",
    },
    {
      url: "https://bozemanflyfishing.com/",
      selector: "article",
      lastUpdated: "FEB 2025",
    },
    {
      url: "http://frontieranglers.com/",
      selector: "article",
      lastUpdated: "MAY 2025",
    },
    {
      url: "http://www.flyfishfood.com/",
      selector: "article",
      lastUpdated: "MAY 2025",
    },
    {
      url: "https://bighornangler.com/",
      selector: "article",
      lastUpdated: "MAY 2025",
    },
    {
      url: "http://trroutfitters.com/",
      selector: "article",
      lastUpdated: "APR 2025",
    },
    {
      url: "https://www.beartoothflyfishing.com/",
      selector: "div.post",
      lastUpdated: "MAY 2025",
    },
    {
      url: "http://www.sweetwaterflyshop.com/",
      selector: "div.post",
      lastUpdated: "MAY 2025",
    },
    {
      url: "http://snakeriverfly.com/",
      selector: "div.main-sidebar",
      lastUpdated: "MAY 2025",
    },
    {
      url: "https://northforkanglers.com/",
      selector: "div.user-items-list",
      lastUpdated: "MAY 2025",
    },
    {
      url: "https://www.yellowdogflyfishing.com/",
      selector: "div.reportContent",
      lastUpdated: "MAY 2025",
    },
    {
      url: "http://blackfootriver.com/",
      selector: "div.full-report",
      lastUpdated: "MAY 2025",
    },
    {
      url: "http://parksflyshop.com/",
      selector: "div.entry-content",
      lastUpdated: "2025",
    },
    {
      url: "http://www.montanatrout.com/",
      selector: "main.page-blocks",
      lastUpdated: "MAY 2025",
    },
    {
      url: "http://www.sunriseflyshop.com/",
      selector: "ul.wp-block-latest-posts__list",
      lastUpdated: "MAY 2025",
    },
    {
      url: "http://www.bozemanflysupply.com/",
      selector: 'div._1140-w-wrapper:has(h1:has-text("fishing report"))',
      lastUpdated: "MAY 2025",
    },
    {
      url: "https://theriversedge.com/",
      selector: 'div.container:has(h2:has-text("river fishing report"))',
      lastUpdated: "MAY 2025",
    },
    {
      url: "http://troutfitters.com/",
      selector: 'div.mb-5:has(h2:has-text("Fly Pattern Suggestions"))',
      lastUpdated: "MAY 2025",
    },
    {
      url: "http://madisonriveroutfitters.com/",
      selector: "div.container.main.content",
      lastUpdated: "MAY 2025",
    },
    {
      url: "https://www.thestonefly.com/",
      selector: "div#main-content",
      lastUpdated: "2025",
    },
    {
      url: "http://westbankanglers.com/",
      selector: "main.main-content",
      lastUpdated: "MAY 2025",
    },
    {
      url: "http://www.mrfc.com/",
      selector: "main.main-content",
      lastUpdated: "MAY 2025",
    },
  ];

  const normalizedSites = await checkDuplicateUrls(sites);

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });

  // // await fishingReportScraper(context, urls);
  await fishingReportScraper(context, normalizedSites);

  browser.close();
}

main().catch((err) => {
  console.error("Fatal error:", err);
});
