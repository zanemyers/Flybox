const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");

// Function to read the CSV and filter the relevant rows
const readShopDetailCSV = () => {
  // List to store objects containing the Name and Website for scraping
  const websitesToScrape = [];

  const csvPath = path.resolve(
    __dirname,
    "../GoogleMapsScraper/shop_details.csv"
  );

  return new Promise((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on("data", (row) => {
        // Check if 'Publishes Fishing Report' is true
        if (row["Publishes Fishing Report"] === "true") {
          websitesToScrape.push({
            name: row["Name"],
            website: row["Website"],
          });
        }
      })
      .on("end", () => {
        resolve(websitesToScrape);
      })
      .on("error", (err) => {
        reject(err);
      });
  });
};

module.exports = { readShopDetailCSV };
