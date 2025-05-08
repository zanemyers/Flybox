import "dotenv/config";
import { chromium } from "playwright";
import { fishingReportScraper, getUrlsFromCSV } from "./reportScrapers.js";

async function main() {
  const urls = await getUrlsFromCSV();

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });

  // await fishingReportScraper(context, urls);
  await fishingReportScraper(context);

  browser.close();
}

main().catch((err) => {
  console.error("Fatal error:", err);
});
