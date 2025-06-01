import { chromium } from "playwright";
import { ExcelFileHandler } from "../base/fileUtils.js";

import { fetchShops, getDetails } from "./shopScaper.js";
import { MESSAGES } from "../base/enums.js";
import dotenv from "dotenv";
import { Spinner } from "../base/terminalUtils.js";

// Load environment variables from .env file
dotenv.config();

// Initialize CSV file writer
const shopWriter = new ExcelFileHandler("resources/csv/shop_details.csv");
const searchSpinner = new Spinner(["🔍", "🔎", "🔍", "🔎"]);

async function main() {
  // If RUN_HEADLESS is not set, default to true, otherwise use the environment variable value
  const runHeadless = (process.env.RUN_HEADLESS ?? "true") === "true";
  const browser = await chromium.launch({ headless: runHeadless });
  const context = await browser.newContext();

  try {
    searchSpinner.start("Searching for shops...");
    const shops = await fetchShops();
    searchSpinner.stop(`🌐 Found ${shops.length} shops.`);

    const details = await getDetails(shops, context);

    const rows = shops.map((shop, i) => {
      const extra = details[i];
      const name = shop.title || "";
      const category = shop.type || "";
      const phone = shop.phone || "";
      const website = shop.website || MESSAGES.NO_WEB;
      const stars = shop.rating || "N/A";
      const reviewCount = shop.reviews || 0;

      return {
        Index: i + 1,
        Name: name,
        Category: category,
        Phone: phone,
        Email: details.email,
        "Has Website": website !== MESSAGES.NO_WEB,
        Website: website,
        "Sells Online": details.sellsOnline,
        Rating: `${stars}/5`,
        Reviews: reviewCount,
        "Has Report": details.fishingReport,
        Socials: details.socialMedia,
      };
    });

    shopWriter.write(rows);
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
});
