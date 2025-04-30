const { chromium } = require("playwright");
const cheerio = require("cheerio");

// List of fishing report URLs to scrape
const urls = [
  "https://northforkanglers.com/fishing-reports",
  "https://www.hatchfinders.com/post/april-1-spring-report",
  "https://theriversedge.com/pages/spring-creeks-fishing-report",
];

async function scrapeAndGroup(url) {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded" });

  // 1) grab full HTML
  const html = await page.content();
  await browser.close();

  // 2) load into Cheerio
  const $ = cheerio.load(html);

  // 3) pick the wrapper elements for each “card” or report block
  //    (you’ll need to inspect a few pages to find the right selector)
  const wrappers = $("li.list-item, div.report-card, section.post, article");

  // 4) map over them and pull out title / date / body / image, etc.
  const reports = [];
  wrappers.each((_, el) => {
    const $el = $(el);

    // Example heuristics—adjust selectors to your page’s actual classes/tags:
    const title =
      $el.find("h2, .title, .post-title").first().text().trim() || null;
    const date =
      $el.find("time, .date, .post-date").first().text().trim() || null;
    const body = $el
      .find("p")
      .map((_, p) => $(p).text().trim())
      .get()
      .join("\n\n");
    const img = $el.find("img").first().attr("src") || null;

    // Only include if we actually found meaningful content
    if (title || body) {
      reports.push({ title, date, body, img });
    }
  });

  return reports;
}

async function fishingReportScraper() {
  for (const url of urls) {
    const data = await scrapeAndGroup(url);
    console.log(data);
  }
}

module.exports = { fishingReportScraper };
