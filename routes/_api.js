import express from "express";
import { FishTalesAPI, ShopReelAPI, SiteScoutAPI } from "api/index.js";

const router = express.Router();

// Controllers
const fishTales = new FishTalesAPI();
const shopReel = new ShopReelAPI();
const siteScout = new SiteScoutAPI();

// FishTales endpoints
router.post("/fish-tales", fishTales.createJob.bind(fishTales));
router.get("/fish-tales/:id/updates", fishTales.getJobUpdates.bind(fishTales));
router.get("/fish-tales/:id/files", fishTales.getJobFiles.bind(fishTales));

// ShopReel endpoints
router.post("/shop-reel", shopReel.createJob.bind(shopReel));
router.get("/shop-reel/:id/updates", shopReel.getJobUpdates.bind(shopReel));
router.get("/shop-reel/:id/files", shopReel.getJobFiles.bind(shopReel));

// SiteScout endpoints
router.post("/site-scout", siteScout.createJob.bind(siteScout));
router.get("/site-scout/:id/updates", siteScout.getJobUpdates.bind(siteScout));
router.get("/site-scout/:id/files", siteScout.getJobFiles.bind(siteScout));

export default router;
