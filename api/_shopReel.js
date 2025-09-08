import { prisma } from "../db.js";
import { baseAPI } from "./_base.js";
import { JobType, JobStatus } from "@prisma/client";
// import { shopScraper } from "./shopScraper.js";

export class ShopReelAPI extends baseAPI {
  async createJob(req, res) {
    const { shopUrl } = req.body;
    try {
      // Create the job
      const job = await prisma.job.create({
        data: {
          type: JobType.SHOP_REEL, // Set the job type
          status: JobStatus.IN_PROGRESS, // Always start as in progress
          message: `ShopReel job started for ${shopUrl}`,
        },
      });

      // shopScraper()

      res.status(201).json({ jobId: job.id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create ShopReel job" });
    }
  }
}
