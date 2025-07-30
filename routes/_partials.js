import express from "express";
import { MERGE_PROMPT, SUMMARY_PROMPT } from "../constants/index.js";

const router = express.Router();

// Serve the shop form partial
router.get("/shop-form", (req, res) => {
  res.render("partials/shop_form", { layout: false });
});

//Serve the report form partial
router.get("/report-form", (req, res) => {
  res.render("partials/report_form", {
    layout: false,
    summaryPrompt: SUMMARY_PROMPT,
    mergePrompt: MERGE_PROMPT,
  });
});

// Serve the progress partial
router.get("/progress", (req, res) => {
  res.render("partials/progress", { layout: false });
});

export default router;
