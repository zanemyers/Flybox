const { chromium } = require("playwright");
const { readShopDetailCSV } = require("./csvReader");
const { fishingReportScraper } = require("./scrapers");

async function main() {
  //   console.log(await readShopDetailCSV());
  await fishingReportScraper();
}

main().catch((err) => {
  console.error("Fatal error:", err);
});
