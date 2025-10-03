import express from "express";
import { ShopReelAPI } from "../apps/shop_reel/shopAPI.js";
import { FishTalesAPI } from "../apps/fish_tales/fishAPI";
import { SiteScoutAPI } from "../apps/site_scout/siteAPI.js";

import multer from "multer";

const storage = multer.memoryStorage(); // store files in memory
const upload = multer({ storage });

const router = express.Router();

// Controllers
const fishTales = new FishTalesAPI();
const shopReel = new ShopReelAPI();
const siteScout = new SiteScoutAPI();

// FishTales endpoints
router.post("/fish-tales", upload.any(), fishTales.createJob.bind(fishTales));
router.get("/fish-tales/:id/updates", fishTales.getJobUpdates.bind(fishTales));
router.post("/fish-tales/:id/cancel", fishTales.cancelJob.bind(fishTales));

// ShopReel endpoints
router.post("/shop-reel", upload.any(), shopReel.createJob.bind(shopReel));
router.get("/shop-reel/:id/updates", shopReel.getJobUpdates.bind(shopReel));
router.post("/shop-reel/:id/cancel", shopReel.cancelJob.bind(shopReel));

// SiteScout endpoints
router.post("/site-scout", upload.any(), siteScout.createJob.bind(siteScout));
router.get("/site-scout/:id/updates", siteScout.getJobUpdates.bind(siteScout));
router.post("/site-scout/:id/cancel", siteScout.cancelJob.bind(siteScout));

export default router;
