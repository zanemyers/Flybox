const { chromium } = require("playwright");
// const { readShopDetailCSV } = require("./csvReader");
const { CSVFileReader } = require("../base/csvHandler.js");
const { fishingReportScraper } = require("./FRScrapers.js");

async function main() {
  // Initialize the CSV file reader
  const reader = new CSVFileReader(
    "resources/csv/shop_details.csv",
    (row) => row["publishesFishingReport"] === "true", // filter function
    (row) => ({
      name: row["name"],
      website: row["website"],
    }) // row map function
  );

  // Read the CSV to get website URLs that publish fishing reports
  // Note: The CSV file should have a header row with "name", "publishesFishingReport" and "website" columns
  const urls = await reader.read();

  await fishingReportScraper(urls);
}

main().catch((err) => {
  console.error("Fatal error:", err);
});
