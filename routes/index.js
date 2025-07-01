import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", { title: "RR Tacklebox" }); // Just the name without extension, Express uses the view engine
});

router.get("/about", (req, res) => {
  res.render("about"); // Render about.ejs instead of sending HTML file directly
});

export default router;
