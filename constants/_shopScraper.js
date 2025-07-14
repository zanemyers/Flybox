import { MESSAGES } from "./_messages.js";

// Regex pattern to match email addresses
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i;

// Common e-commerce-related keywords used to detect if a website is a shop
const SHOP_KEYWORDS = ["shop", "store", "buy", "products", "cart", "checkout"];

// Mapping of domain names to social media platform names
// Includes aliases (e.g., wa.me → WhatsApp, twitter.com → X)
const SOCIAL_MEDIA_MAP = [
  { domain: "facebook.com", name: "Facebook" },
  { domain: "instagram.com", name: "Instagram" },
  { domain: "linkedin.com", name: "LinkedIn" },
  { domain: "tiktok.com", name: "TikTok" },
  { domain: "vimeo.com", name: "Vimeo" },
  { domain: "whatsapp.com", name: "WhatsApp" },
  { domain: "wa.me", name: "WhatsApp" },
  { domain: "x.com", name: "X (Twitter)" },
  { domain: "twitter.com", name: "X (Twitter)" },
  { domain: "youtube.com", name: "YouTube" },
];

// Fallback details object for shops that do not have any information
const FALLBACK_DETAILS = {
  BLOCKED: (status) => ({
    email: MESSAGES.ERROR_BLOCKED_FORBIDDEN(status),
    sellsOnline: MESSAGES.ERROR_BLOCKED_FORBIDDEN(status),
    fishingReport: MESSAGES.ERROR_BLOCKED_FORBIDDEN(status),
    socialMedia: MESSAGES.ERROR_BLOCKED_FORBIDDEN(status),
  }),
  ERROR: {
    email: MESSAGES.ERROR_EMAIL,
    sellsOnline: MESSAGES.ERROR_SHOP,
    fishingReport: MESSAGES.ERROR_REPORT,
    socialMedia: MESSAGES.ERROR_SOCIAL,
  },
  NONE: {
    email: "",
    sellsOnline: false,
    fishingReport: false,
    socialMedia: "",
  },
  TIMEOUT: {
    email: MESSAGES.ERROR_LOAD_FAILED,
    sellsOnline: MESSAGES.ERROR_LOAD_FAILED,
    fishingReport: MESSAGES.ERROR_LOAD_FAILED,
    socialMedia: MESSAGES.ERROR_LOAD_FAILED,
  },
};

export { EMAIL_REGEX, FALLBACK_DETAILS, SHOP_KEYWORDS, SOCIAL_MEDIA_MAP };
