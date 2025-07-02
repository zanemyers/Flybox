import express from "express";

const router = express.Router();
router.get("/report-scraper", (req, res) => {
  res.render("forms/report_scraper", {
    title: "Report Scraper",
    // Add any other context variables you want here
  });
});
router.get("/shop-scraper", (req, res) => {
  res.render("forms/shop_scraper", {
    title: "Shop Scraper",
  });
});

export default router;
