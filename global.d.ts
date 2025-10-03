// Images
declare module "*.png" {
  const value: string;
  export default value;
}
declare module "*.jpg" {
  const value: string;
  export default value;
}
declare module "*.svg" {
  const value: string;
  export default value;
}
declare module "*.gif" {
  const value: string;
  export default value;
}

// bootstrap
declare module "bootstrap";

// Styles
declare module "*.scss";
declare module "*.css";

/** Declare custom methods on top of the default Playwright Page */
import "playwright";
declare module "playwright" {
  interface Page {
    // Common helpers (used everywhere)
    simulateUserInteraction(): Promise<void>;
    load(url: string, retries?: number): Promise<Response | null>;
    getAttByLocator(locator: string, attribute: string, filter: object): Promise<string | null>;
    getAttByLabel(label: string, attribute: string, filter: object): Promise<string | null>;
    getTextContent(locator: string, filter: object): Promise<string | null>;
    hasElementWithKeyword(element: string, keyword: string): Promise<boolean>;

    // Optional scraper-specific helpers (if you want them global)
    publishesFishingReport?(): Promise<boolean | string>;
    getSocialMedia?(): Promise<string>;
    getContactLink?(): Promise<string | null>;
    getEmailFromHref?(): Promise<string | null>;
    getEmailFromText?(): Promise<string | null>;
    getEmail?(onContactPage?: boolean): Promise<string>;
    hasOnlineShop?(): Promise<boolean | string>;
  }
}
