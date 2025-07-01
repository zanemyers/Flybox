import express from "express";

const router = express.Router();
router.get("/report", (req, res) => {
  res.render("report", {
    title: "Report Page",
    // Add any other context variables you want here
  });
});

export default router;
