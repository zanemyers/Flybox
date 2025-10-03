import { EMAIL_REGEX, MESSAGES, SHOP_KEYWORDS, SOCIAL_MEDIA_MAP } from "../base/constants";
import type { Page } from "playwright";
import type { Shops, ShopDetails } from "./shopReel";

/** Enhances a Playwright `Page` instance with custom scraping helper methods for extracting specific shop-related data */
async function addShopSelectors(page: Page): Promise<Page> {
  /** Checks if the page contains a hyperlink (`<a>`) with the keyword "report" (case-insensitive). */
  page.publishesFishingReport = async function () {
    try {
      return await page.hasElementWithKeyword("a", "report");
    } catch {
      return MESSAGES.ERROR_REPORT;
    }
  };

  /** Detects linked social media platforms by scanning all `<a>` tags for domains listed in `SOCIAL_MEDIA_MAP`. */
  page.getSocialMedia = async function () {
    try {
      const hrefs = await page.$$eval("a", (links) => links.map((link) => link.href.toLowerCase()));

      const foundSocials: string[] = [];
      for (const { domain, name } of SOCIAL_MEDIA_MAP) {
        if (hrefs.some((href) => href.includes(domain)) && !foundSocials.includes(name)) {
          foundSocials.push(name);
        }
      }

      return foundSocials.join(", ");
    } catch {
      return MESSAGES.ERROR_SOCIAL;
    }
  };

  /** Finds the first `<a>` element whose `href` contains "contact" and returns its absolute URL. */
  page.getContactLink = async function () {
    try {
      const href = await page.getAttByLocator('a[href*="contact"]', "href");
      if (!href) return null;

      return new URL(href, page.url()).toString();
    } catch {
      return null;
    }
  };

  /** Extracts the email address from the first `mailto:` link found in an `<a>` tag. */
  page.getEmailFromHref = async function () {
    try {
      const email = await page.getAttByLocator('a[href^="mailto:"]', "href");
      return email ? email.replace("mailto:", "").split("?")[0] : null;
    } catch {
      return null;
    }
  };

  /** Searches the page body text for an email address using `EMAIL_REGEX`. */
  page.getEmailFromText = async function () {
    try {
      const fullText = await page.locator("body").innerText();
      const match = fullText.match(EMAIL_REGEX);
      return match ? match[0] : null;
    } catch {
      return null;
    }
  };

  /** Retrieves an email address using a tiered approach */
  page.getEmail = async function (onContactPage = false): Promise<string> {
    try {
      const emailFromHref = await this.getEmailFromHref!();
      if (emailFromHref) return emailFromHref;

      const emailFromText = await this.getEmailFromText!();
      if (emailFromText) return emailFromText;

      if (!onContactPage) {
        const contactLink = await this.getContactLink!();
        if (contactLink) {
          await page.load(contactLink);
          return await this.getEmail!(true);
        }
      }

      return MESSAGES.NO_EMAIL;
    } catch {
      return MESSAGES.ERROR_EMAIL;
    }
  };

  /** Checks if the page contains keywords related to an online shop in either `<a>` or `<button>` elements. */
  page.hasOnlineShop = async function () {
    try {
      for (const keyword of SHOP_KEYWORDS) {
        const hasLink = await page.hasElementWithKeyword("a", keyword);
        const hasButton = await page.hasElementWithKeyword("button", keyword);

        if (hasLink || hasButton) return true;
      }
      return false;
    } catch {
      return MESSAGES.ERROR_SHOP;
    }
  };

  return page;
}

/** Combines base shop data with scraped details to create a list of export-ready row objects. */
function buildShopRows(shops: Shops[], shopDetails: ShopDetails[]) {
  if (shops.length !== shopDetails.length)
    // ensure both arrays are the same length
    throw new Error(`Shop count - ${shops.length} ≠ details count - ${shopDetails.length}`);

  return shops.map((shop, i) => {
    return {
      Name: shop.title || "",
      Category: shop.type || "",
      Phone: shop.phone || "",
      Address: shop.address || "",
      Email: shopDetails[i]?.email || "",
      "Has Website": !!shop.website,
      Website: shop.website || MESSAGES.NO_WEB,
      "Sells Online": shopDetails[i]?.sellsOnline || "",
      Rating: shop.rating != null ? `${shop.rating}/5` : "N/A",
      Reviews: shop.reviews || 0,
      "Has Report": shopDetails[i]?.fishingReport || "",
      Socials: shopDetails[i]?.socialMedia || [],
    };
  });
}

/** Formats a list of shop objects into simplified row data for the intermediate file. */
function buildCacheFileRows(shops: Shops[]): Array<object> {
  if (shops.length === 0) return [];

  return shops.map((shop) => {
    return {
      Name: shop.title || "",
      Category: shop.type || "",
      Phone: shop.phone || "",
      Address: shop.address || "",
      "Has Website": !!shop.website,
      Website: shop.website || MESSAGES.NO_WEB,
      Rating: shop.rating != null ? `${shop.rating}/5` : "N/A",
      Reviews: shop.reviews || 0,
    };
  });
}

export { addShopSelectors, buildCacheFileRows, buildShopRows };
