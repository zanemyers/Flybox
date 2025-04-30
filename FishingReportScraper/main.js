const { chromium } = require("playwright");
const { readShopDetailCSV } = require("./csvReader");

async function main() {
  console.log(await readShopDetailCSV());
}

main().catch((err) => {
  console.error("Fatal error:", err);
});
