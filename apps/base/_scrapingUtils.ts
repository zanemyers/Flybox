import { chromium } from "playwright-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import type { Browser, BrowserContext, Page, Response } from "playwright";

import { BLOCKED_OR_FORBIDDEN } from "./constants.ts";

/** Declare custom methods on top of the default Playwright Page */
declare module "playwright" {
  interface Page {
    simulateUserInteraction(): Promise<void>;
    load(url: string, retries?: number): Promise<Response | null>;
    getAttByLocator(locator: string, attribute: string, filter: object): Promise<string | null>;
    getAttByLabel(label: string, attribute: string, filter: object): Promise<string | null>;
    getTextContent(locator: string, filter: object): Promise<string | null>;
    hasElementWithKeyword(element: string, keyword: string): Promise<boolean>;
  }
}

// Enable plugins
chromium.use(StealthPlugin());

/**
 * StealthBrowser wraps a Playwright Chromium browser with additional features
 * to mimic human browsing behavior and avoid bot detection.
 */
class StealthBrowser {
  protected headless: boolean = process.env.RUN_HEADLESS !== "false" || true;
  protected args: string[] = ["--start-maximized", "--no-sandbox"];
  protected agentProfile = this._getAgentProfile();
  protected userAgent: string = this.agentProfile.userAgent;
  protected locale: string = this.agentProfile.locale;
  protected timezoneId: string = this.agentProfile.timezoneId;
  protected browser: Browser | null = null;
  protected context: BrowserContext | null = null;

  /** Launches the Chromium browser and creates a new browser context */
  async launch() {
    this.browser = await chromium.launch({ headless: this.headless, args: this.args });

    this.context = await this.browser.newContext({
      viewport: this._getViewport(),
      userAgent: this.userAgent,
      locale: this.locale,
      timezoneId: this.timezoneId,
    });

    return this;
  }

  /** Adds custom helper functions to a Playwright page object for stealthy navigation. */
  async _enhancePageLoad(page: Page) {
    /** Simulates basic user interactions such as mouse movements. */
    page.simulateUserInteraction = async function () {
      await page.mouse.move(100, 100);
      await page.mouse.move(200, 300);
      await page.mouse.move(50, 175);
    };

    /** Navigates to a URL with retry support. */
    page.load = async function (url, retries = 2) {
      while (retries--) {
        try {
          const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });

          const status = response?.status();
          if (status != null && [401, 403, 429].includes(status)) {
            const content = await page.content();
            if (BLOCKED_OR_FORBIDDEN.some((text) => content.includes(text))) {
              throw new Error(`Blocked or forbidden (HTTP ${status})`);
            }
          }

          await page.simulateUserInteraction();
          return response;
        } catch (err) {
          if (err instanceof Error && (retries === 0 || /HTTP (401|403|429)/.test(err.message))) {
            throw new Error(`Failed to load ${url}: ${err.message}`);
          }
          await new Promise((res) => setTimeout(res, 1000));
        }
      }
      return null;
    };
  }

  /** Returns a random user agent profile with userAgent, locale, and timezone. */
  _getAgentProfile(): { userAgent: string; locale: string; timezoneId: string } {
    const agentProfiles = [
      {
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        locale: "en-US",
        timezoneId: "America/New_York",
      },
      {
        userAgent: "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:114.0) Gecko/20100101 Firefox/114.0",
        locale: "de-DE",
        timezoneId: "Europe/Berlin",
      },
      {
        userAgent:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
        locale: "en-GB",
        timezoneId: "Europe/London",
      },
      {
        userAgent:
          "Mozilla/5.0 (Linux; Android 10; Pixel 4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Mobile Safari/537.36",
        locale: "en-CA",
        timezoneId: "America/Toronto",
      },
    ];

    return agentProfiles[Math.floor(Math.random() * agentProfiles.length)];
  }

  /** Returns a random viewport size from common screen resolutions. */
  _getViewport(): { width: number; height: number } {
    const viewports = [
      { width: 1366, height: 768 },
      { width: 1440, height: 900 },
      { width: 1536, height: 864 },
      { width: 1920, height: 1080 },
      { width: 1280, height: 800 },
    ];

    return viewports[Math.floor(Math.random() * viewports.length)];
  }

  /** Sets up request interception to reduce bandwidth and speed up scraping. */
  async _setupRequestInterception(page: Page) {
    await page.route("**/*", (route) => {
      const type = route.request().resourceType();
      const url = route.request().url();

      // List of resource types to block
      const blockedTypes = ["image", "font", "stylesheet", "media"];

      // Block analytics / ad URLs (add more patterns as needed)
      const blockedUrls = [
        "google-analytics",
        "doubleclick.net",
        "ads.",
        "googletagmanager.com",
        "facebook.net",
        "tiktok.com/tracker",
      ];

      if (blockedTypes.includes(type) || blockedUrls.some((pattern) => url.includes(pattern))) {
        route.abort();
      } else {
        route.continue();
      }
    });
  }

  /** Creates a new page in the browser context and applies custom helper methods. */
  async newPage() {
    if (!this.context) {
      throw new Error("Browser context has not been initialized. Did you call launch()?");
    }

    const page = await this.context.newPage();
    await this._enhancePageLoad(page);
    await extendPageSelectors(page);
    await this._setupRequestInterception(page);
    return page;
  }

  /** Closes the browser instance if it is running. */
  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

/** Extends a Playwright Page instance with custom helper methods for scraping and element inspection. */
async function extendPageSelectors(page: Page) {
  /** Retrieves the value of a specified attribute from the first matching element located by the given selector. */
  page.getAttByLocator = async function (locator, attribute, filter = {}) {
    const value = page
      .locator(locator)
      .filter(filter)
      .first()
      .getAttribute(attribute, { timeout: 1000 });
    return value || null;
  };

  /** Retrieves the value of a specified attribute from the first element whose `aria-label` contains the given text. */
  page.getAttByLabel = async function (label, attribute, filter = {}) {
    return await page.getAttByLocator(`[aria-label*="${label}"]`, attribute, filter);
  };

  /** Retrieves the text content of the first element matching the given selector. */
  page.getTextContent = async function (locator, filter = {}) {
    return await page.locator(locator).filter(filter).first().textContent({ timeout: 1000 });
  };

  /** Checks if an element of a given type contains the specified keyword text. */
  page.hasElementWithKeyword = async function (element, keyword) {
    return await page
      .locator(`${element}:has-text("${keyword}")`)
      .count()
      .then((count) => count > 0)
      .catch(() => false);
  };
}

/** Normalizes a URL to a consistent format for comparison or deduplication. */
function normalizeUrl(url: string): string {
  try {
    const u = new URL(url);

    // Remove hash and query string for a clean, comparable URL
    u.hash = "";
    u.search = "";

    // Convert root path '/' to empty string
    if (u.pathname === "/") u.pathname = "";

    // Remove trailing slash from pathname
    if (u.pathname.endsWith("/")) {
      u.pathname = u.pathname.slice(0, -1);
    }

    return u.href; // Return absolute normalized URL
  } catch {
    return url; // Return original URL if parsing fails
  }
}

/** Determines whether two URLs belong to the same domain, ignoring the 'www.' prefix. */
function sameDomain(urlA: string, urlB: string): boolean {
  try {
    const domainA = new URL(normalizeUrl(urlA)).hostname.replace(/^www\./, "").toLowerCase();
    const domainB = new URL(normalizeUrl(urlB)).hostname.replace(/^www\./, "").toLowerCase();
    return domainA === domainB;
  } catch {
    return false; // Treat invalid URLs as non-matching
  }
}

export { extendPageSelectors, normalizeUrl, sameDomain, StealthBrowser };
