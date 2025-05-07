/**
 * Constants and utilities used across scraping logic, including patterns for matching data,
 * standardized messages, keyword lists, and known social media mappings.
 */

// Regex pattern to match email addresses
const EmailRegEx = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i;

// Regex pattern to match phone numbers in international format (e.g., +1234567890)
const PhoneRegEx = /\+[\d]+/;

// Regex pattern to match star ratings formatted as a decimal between 0.0 and 5.9 (e.g., "4.8")
const StarsRegEx = /^[0-5]\.\d$/;

// Regex pattern to extract a number (used for review counts)
const ReviewCountRegEx = /(\d+)/;

// Common e-commerce-related keywords used to detect if a website is a shop
const ShopKeywords = ["shop", "store", "buy", "products", "cart", "checkout"];

// Canonical names for known social media platforms
const SocialMedia = {
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
const SocialMediaMap = [
  { domain: "facebook.com", name: SocialMedia.FACEBOOK },
  { domain: "instagram.com", name: SocialMedia.INSTAGRAM },
  { domain: "linkedin.com", name: SocialMedia.LINKEDIN },
  { domain: "tiktok.com", name: SocialMedia.TIKTOK },
  { domain: "vimeo.com", name: SocialMedia.VIMEO },
  { domain: "whatsapp.com", name: SocialMedia.WHATSAPP },
  { domain: "wa.me", name: SocialMedia.WHATSAPP },
  { domain: "x.com", name: SocialMedia.X },
  { domain: "twitter.com", name: SocialMedia.X },
  { domain: "youtube.com", name: SocialMedia.YOUTUBE },
];

// Standardized error and not-found messages for consistency in logging and reporting
const Messages = {
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

// Export all constants for use in other modules
module.exports = {
  Messages,
  EmailRegEx,
  PhoneRegEx,
  ReviewCountRegEx,
  ShopKeywords,
  SocialMedia,
  SocialMediaMap,
  StarsRegEx,
};
