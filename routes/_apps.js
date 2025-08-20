import express from "express";
import { MERGE_PROMPT, SUMMARY_PROMPT } from "../apps/base/constants/index.js";

/**
 * Defines application routes for rendering scraper pages.
 * - /report-scraper: Report scraping and summarization interface
 * - /shop-scraper: Shop data scraping interface
 */
const router = express.Router();
router.get("/fishTales", (req, res) => {
  res.render("report_scraper", {
    title: "FishTales",
    summaryPrompt: SUMMARY_PROMPT,
    mergePrompt: MERGE_PROMPT,
  });
});
router.get("/shopReel", (req, res) => {
  res.render("shop_scraper", {
    title: "ShopReel",
  });
});
router.get("/siteScout", (req, res) => {
  res.render("error", {
    title: "SiteScout",
  });
});
router.get("/docs", (req, res) => {
  res.render("error", {
    title: "Docs",
  });
});

export default router;
