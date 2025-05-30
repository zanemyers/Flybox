import { chromium } from "playwright";
import { ExcelFileHandler } from "../base/fileUtils.js";

import { fetchShopsFromSerpAPI, getExtraDetails } from "./shopScaper.js";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Initialize CSV file writer
const shopWriter = new ExcelFileHandler("resources/csv/shop_details.csv");

async function main() {
  try {
    console.log("🔍 Searching for shops...");
    const shops = await fetchShopsFromSerpAPI();

    console.log(`🌐 Found ${shops.length} shops. Scraping websites...`);
    // If RUN_HEADLESS is not set, default to true, otherwise use the environment variable value
    const runHeadless = (process.env.RUN_HEADLESS ?? "true") === "true";
    const browser = await chromium.launch({ headless: runHeadless });
    const extraDetails = await getExtraDetails(shops, browser);

    const rows = shops.map((shop, i) => {
      const extra = extraDetails[i];
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
        Email: extra.email,
        "Has Website": website !== MESSAGES.NO_WEB,
        Website: website,
        "Sells Online": extra.sellsOnline,
        Rating: `${stars}/5`,
        Reviews: reviewCount,
        "Has Report": extra.fishingReport,
        Socials: extra.socialMedia,
      };
    });

    exportToExcel(rows);
    console.log(`✅ Finished. Output written to ${OUTPUT_FILE}`);
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
});
