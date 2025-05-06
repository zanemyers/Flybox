const { chromium } = require("playwright");
const { readShopDetailCSV } = require("./csvReader");
const { fishingReportScraper } = require("./FRScrapers.js");

async function main() {
  const urls = await readShopDetailCSV();
  await fishingReportScraper(urls);
}

main().catch((err) => {
  console.error("Fatal error:", err);
});
