const fs = require("fs");
const csv = require("csv-parser");

// Function to read the CSV and filter the relevant rows
const readShopDetailCSV = () => {
  // List to store objects containing the Name and Website for scraping
  let websitesToScrape = [];

  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream("../GoogleMapsScraper/shop_details.csv")
      .pipe(csv())
      .on("data", (row) => {
        // Check if 'Publishes Fishing Report' is true
        if (row["Publishes Fishing Report"] === "true") {
          websitesToScrape.push({
            name: row["Name"], // Assuming the column is named 'Name'
            website: row["Website"], // Assuming the column is named 'Website'
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

  return websitesToScrape;
};

module.exports = { readShopDetailCSV };
