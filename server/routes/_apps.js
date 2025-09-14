import express from "express";
import { MERGE_PROMPT, SUMMARY_PROMPT } from "../../apps/base/constants/index.js";

/**
 * Defines application routes for rendering scraper pages.
 * - /fishTales: Report scraping and summarization interface
 * - /shopReel: Shop data scraping interface
 * - /siteScout: Compare shop websites to your current report websites
 * - /docs: Documentation regarding the use of the apps
 */
const router = express.Router();
router.get("/fishTales", (req, res) => {
  res.render("apps/fish_tales", {
    title: "FishTales",
    summaryPrompt: SUMMARY_PROMPT,
    mergePrompt: MERGE_PROMPT,
  });
});
router.get("/shopReel", (req, res) => {
  res.render("apps/shop_reel", {
    title: "ShopReel",
  });
});
router.get("/siteScout", (req, res) => {
  res.render("apps/site_scout", {
    title: "SiteScout",
  });
});
router.get("/docs", (req, res) => {
  res.render("apps/docs", {
    title: "Docs",
  });
});

export default router;
