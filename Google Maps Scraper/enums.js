const EmailRegEx = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i;
const PhoneRegEx = /\+[\d]+/;
const StarsRegEx = /^[0-5]\.\d$/;
const ReviewCountRegEx = /(\d+)/;

const ShopKeywords = ["shop", "store", "buy", "products", "cart", "checkout"];

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

const SocialMediaMap = [
  { domain: "facebook.com", name: SocialMedia.FACEBOOK },
  { domain: "instagram.com", name: SocialMedia.INSTAGRAM },
  { domain: "linkedin.com", name: SocialMedia.LINKEDIN },
  { domain: "tiktok.com", name: SocialMedia.TIKTOK },
  { domain: "vimeo.com", name: SocialMedia.VIMEO },
  { domain: "whatsapp.com", name: SocialMedia.WHATSAPP },
  { domain: "wa.me", name: SocialMedia.WHATSAPP }, // optional alias
  { domain: "wa.me", name: SocialMedia.WHATSAPP },
  { domain: "x.com", name: SocialMedia.X },
  { domain: "twitter.com", name: SocialMedia.X }, // optional alias
  { domain: "youtube.com", name: SocialMedia.YOUTUBE },
];

const Messages = {
  // ERROR MESSAGES
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
