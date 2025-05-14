import * as cheerio from "cheerio";
import { CSVFileReader } from "../base/fileUtils.js";

/**
 * Reads a CSV file containing shop details and returns a filtered list of shops
 * that publish fishing reports. Each result includes the shop's name and website.
 *
 * The CSV file is expected to have at least the following columns:
 * - "name": Name of the shop
 * - "website": Website URL of the shop
 * - "publishesFishingReport": Boolean string ("true"/"false") indicating if reports are published
 *
 * @returns {Promise<Array<{ name: string, website: string }>>} List of filtered shop info
 */
async function getUrlsFromCSV() {
  // Initialize the CSV file reader
  const reader = new CSVFileReader(
    "resources/csv/shop_details.csv", // Path to the CSV file
    (row) => row["publishesFishingReport"] === "true", // filter function
    (row) => ({
      name: row["name"],
      website: row["website"],
    }) // row map function
  );

  // Read the CSV to get website URLs that publish fishing reports
  return await reader.read();
}

/**
 * Given a Cheerio instance $ and a selector for potential wrappers,
 * returns either all wrappers (if none are nested) or only the innermost
 * (nested) ones when there is nesting.
 *
 * @param {CheerioStatic} $      — the cheerio root
 * @param {string} selector      — e.g. "li.list-item, div.report-card, section.post, article"
 * @returns {CheerioElement[]}   — an array of the chosen wrapper elements
 */
function checkWrappers($, selector) {
  // 1) collect all matching elements as an array
  const allWrappers = $(selector).toArray();

  // 2) detect if any wrapper contains another
  const hasNested = allWrappers.some((el, i) =>
    allWrappers.some((other, j) => i !== j && $(el).find(other).length > 0)
  );

  // 3) filter accordingly
  return hasNested
    ? // keep only the inner (nested) elements
      allWrappers.filter((el, i) =>
        allWrappers.some((other, j) => i !== j && $(other).find(el).length > 0)
      )
    : // no nesting? keep them all
      allWrappers;
}

async function scrapeAndGroup(page, url) {
  try {
    await page.goto(url, { timeout: 10000 });
  } catch (error) {
    console.error(`Error navigating to ${url}:`, error);
    return null;
  }

  // 1) grab full HTML
  const html = await page.content();

  // 2) load into Cheerio
  const $ = cheerio.load(html);

  // 3) pick the wrapper elements for each “card” or report block
  //    (you’ll need to inspect a few pages to find the right selector)
  const wrappers = checkWrappers(
    $,
    "li.list-item, div.report-card, section.post, article"
  );

  // 4) map over them and pull out title / date / body / source, etc.
  return wrappers
    .map((el) => {
      const $el = $(el);

      const title =
        $el.find("h1, h2, h3, .title, .post-title").first().text().trim() ||
        null;
      const date =
        $el.find("time, .date, .post-date").first().text().trim() || null;
      const body = $el
        .find("p")
        .map((_, p) => $(p).text().trim())
        .get()
        .filter(Boolean)
        .join("\n\n");

      if (title || body) {
        return { title, date, body, source: url };
      }
    })
    .filter(Boolean);
}

async function findFishingReports() {}

export { getUrlsFromCSV, scrapeAndGroup };
