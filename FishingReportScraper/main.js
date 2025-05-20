import "dotenv/config";
import { chromium } from "playwright";
import { fishingReportScraper } from "./reportScrapers.js";
import { getUrlsFromCSV } from "./reportScrapingUtils.js";
import { normalizeUrl } from "../base/scrapingUtils.js";

async function main() {
  const urls = await getUrlsFromCSV();

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
