/**
 * Constants and utilities used across scraping logic, including patterns for matching data,
 * standardized messages, keyword lists, and known social media mappings.
 */

// Regex pattern to match email addresses
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i;

// Regex pattern to match phone numbers in international format (e.g., +1234567890)
const PHONE_REGEX = /\+[\d]+/;

// Regex pattern to match star ratings formatted as a decimal between 0.0 and 5.9 (e.g., "4.8")
const STARS_REGEX = /^[0-5]\.\d$/;

// Regex pattern to extract a number (used for review counts)
const REVIEW_COUNT_REGEX = /(\d+)/;

// Common e-commerce-related keywords used to detect if a website is a shop
const SHOP_KEYWORDS = ["shop", "store", "buy", "products", "cart", "checkout"];

// Two years in Milliseconds for filtering out old reports
const TWO_YEARS_MS = 2 * 365 * 24 * 60 * 60 * 1000;

// Common date patterns for filtering
const DATE_REGEX_PATTERNS = [
  // 1. "May 25, 2020" or "May 25th, 2020"
  /\b([A-Za-z]+)\s(\d{1,2})(?:st|nd|rd|th)?,?\s(\d{4})\b/i,
  // 2. "25 May 2020" or "25th May 2020"
  /\b(\d{1,2})(?:st|nd|rd|th)?\s([A-Za-z]+),?\s(\d{4})\b/i,
  // 3. ISO "2020-05-25"
  /\b(\d{4})-(\d{2})-(\d{2})\b/,
  // 4. US style "05/25/2020" (MM/DD/YYYY)
  /\b(\d{1,2})\/(\d{1,2})\/(\d{4})\b/,
  // 5. US style with dashes "05-25-2020" (MM-DD-YYYY)
  /\b(\d{1,2})-(\d{1,2})-(\d{4})\b/,
  // 6. "25-May-2020"
  /\b(\d{1,2})-([A-Za-z]+)-(\d{4})\b/i,
  // 7. "Tue, May 25, 2020"
  /\b[A-Za-z]{3},\s([A-Za-z]+)\s(\d{1,2}),\s(\d{4})\b/i,
  // 8. "Jan, 2, 2020"
  /\b([A-Za-z]{3}),\s(\d{1,2}),\s(\d{4})\b/,
];

const MONTHS = {
  january: 0,
  jan: 0,
  february: 1,
  feb: 1,
  march: 2,
  mar: 2,
  april: 3,
  apr: 3,
  may: 4,
  june: 5,
  jun: 5,
  july: 6,
  jul: 6,
  august: 7,
  aug: 7,
  september: 8,
  sep: 8,
  october: 9,
  oct: 9,
  november: 10,
  nov: 10,
  december: 11,
  dec: 11,
};

// Canonical names for known social media platforms
const SOCIAL_MEDIA = {
  FACEBOOK: "Facebook",
  INSTAGRAM: "Instagram",
  LINKEDIN: "LinkedIn",
  TIKTOK: "TikTok",
  VIMEO: "Vimeo",
  WHATSAPP: "WhatsApp",
  X: "X (Twitter)",
  YOUTUBE: "YouTube",
};

// Mapping of domain names to social media platform names
// Includes aliases (e.g., wa.me → WhatsApp, twitter.com → X)
const SOCIAL_MEDIA_MAP = [
  { domain: "facebook.com", name: SOCIAL_MEDIA.FACEBOOK },
  { domain: "instagram.com", name: SOCIAL_MEDIA.INSTAGRAM },
  { domain: "linkedin.com", name: SOCIAL_MEDIA.LINKEDIN },
  { domain: "tiktok.com", name: SOCIAL_MEDIA.TIKTOK },
  { domain: "vimeo.com", name: SOCIAL_MEDIA.VIMEO },
  { domain: "whatsapp.com", name: SOCIAL_MEDIA.WHATSAPP },
  { domain: "wa.me", name: SOCIAL_MEDIA.WHATSAPP },
  { domain: "x.com", name: SOCIAL_MEDIA.X },
  { domain: "twitter.com", name: SOCIAL_MEDIA.X },
  { domain: "youtube.com", name: SOCIAL_MEDIA.YOUTUBE },
];

// Standardized error and not-found messages for consistency in logging and reporting
const MESSAGES = {
  // ERROR MESSAGES
  ERROR_SCROLL_TIMEOUT: (time) =>
    `Scroll Timeout: Reached ${
      time / 1000
    } seconds without seeing end-of-list message.`,
  ERROR_BLOCKED_FORBIDDEN: (status) => `BLOCKED_OR_FORBIDDEN (HTTP ${status})`,
  ERROR_EMAIL: "ERROR_CHECKING_EMAIL",
  ERROR_LOAD_FAILED: "PAGE_LOAD_FAILED",
  ERROR_NAME: "ERROR_CHECKING_NAME",
  ERROR_REPORT: "ERROR_CHECKING_REPORT",
  ERROR_SHOP: "ERROR_CHECKING_SHOP",
  ERROR_SOCIAL: "ERROR_CHECKING_SOCIAL",

  // NOT FOUND MESSAGES
  NO_CATEGORY: "NO_CATEGORY_FOUND",
  NO_EMAIL: "NO_EMAIL_FOUND",
  NO_PHONE: "NO_PHONE_NUMBER_FOUND",
  NO_REVIEWS: "NO_REVIEWS_FOUND",
  NO_STARS: "NO_STARS_FOUND",
  NO_WEB: "NO_WEBSITE",
};

// IMPORTANT - Order Matters! Priority is based on list index
const REPORT_URL_KEYWORDS = [
  "fishing-reports",
  "fishing_reports",
  "fishing-report",
  "fishing_report",
  "river-reports",
  "river-report",
  "stream-reports",
  "report",
  "post",
];

// Url keywords to de-prioritize
const LOW_PRIORITY_URL_KEYWORDS = [
  "tag",
  "tags",
  "tagged",
  "hashtags",
  "categories",
  "collections",
  "page",
  "trip-report", // world cast angler goes all over the place
];

// Export all constants for use in other modules
export {
  DATE_REGEX_PATTERNS,
  EMAIL_REGEX,
  LOW_PRIORITY_URL_KEYWORDS,
  MESSAGES,
  MONTHS,
  PHONE_REGEX,
  REPORT_URL_KEYWORDS,
  REVIEW_COUNT_REGEX,
  SHOP_KEYWORDS,
  SOCIAL_MEDIA,
  SOCIAL_MEDIA_MAP,
  STARS_REGEX,
  TWO_YEARS_MS,
};
