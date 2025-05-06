const fs = require("fs");
const path = require("path");
const { parse } = require("@fast-csv/parse");

// Function to read the CSV and filter the relevant rows
const readShopDetailCSV = () => {
  const websitesToScrape = [];

  const csvPath = path.resolve(__dirname, "../resources/csv/shop_details.csv");

  return new Promise((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(parse({ headers: true }))
      .on("error", reject)
      .on("data", (row) => {
        if (row["publishesFishingReport"] === "true") {
          websitesToScrape.push({
            name: row["name"],
            website: row["website"],
          });
        }
      })
      .on("end", () => {
        resolve(websitesToScrape);
      });
  });
};

module.exports = { readShopDetailCSV };
