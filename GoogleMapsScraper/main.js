const { chromium } = require("playwright");
const {
  scrapeGoogleShopUrl,
  scrapeGoogleShopDetails,
} = require("./scrapers.js");

async function main() {
  const startingUrl = `https://www.google.com/maps/search/Fly+Fishing+Shops/@44.5782686,-111.1761556,9z/data=!3m1!4b1!4m7!2m6!3m5!2sYellowstone+National+Park,+United+States!3s0x5351e55555555555:0xaca8f930348fe1bb!4m2!1d-110.561249!2d44.5979182?entry=ttu&g_ep=EgoyMDI1MDQwMi4xIKXMDSoJLDEwMjExNjQwSAFQAw%3D%3D`;

  // Open the browser
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });

  // Scraping
  const urls = await scrapeGoogleShopUrl(context, startingUrl);

  // Testing URL
  // testURLS = [
  //   "https://www.google.com/maps/place/Big+Sky+Anglers/data=!4m7!3m6!1s0x5351b9ece366c2dd:0xe22088b9c1e93f5f!8m2!3d44.6607068!4d-111.0994042!16s%2Fg%2F1hdznxkxd!19sChIJ3cJm4-y5UVMRXz_pwbmIIOI?authuser=0&hl=en&rclk=1",
  // ];

  await scrapeGoogleShopDetails(context, urls);

  // Close the browser
  await browser.close();
}

main().catch((err) => {
  console.error("Fatal error:", err);
});
