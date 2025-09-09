import { prisma } from "../../db.js";
import { BaseAPI } from "../base/index.js";
import { JobType, JobStatus } from "@prisma/client";
import { ShopReel } from "./shopReel.js";

export class ShopReelAPI extends BaseAPI {
  async createJob(req, res) {
    try {
      const job = await prisma.job.create({
        data: { type: JobType.SHOP_REEL, status: JobStatus.IN_PROGRESS },
      });

      const file = req.files?.[0];
      const payload = file
        ? { file }
        : {
            apiKey: req.body.apiKey,
            query: req.body.query,
            lat: parseFloat(req.body.lat),
            lng: parseFloat(req.body.lng),
            maxResults: parseInt(req.body.maxResults, 10),
          };

      const scraper = new ShopReel(job.id, payload);
      scraper.shopScraper().catch((err) => {
        console.error(`ShopScraper failed for job ${job.id}:`, err);
      });

      res.status(201).json({ jobId: job.id, status: job.status });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create ShopReel job" });
    }
  }

  /**
   * Returns a list of files available for the given job, along with
   * their custom download names.
   *
   * @param {object} job - The job object containing file buffers (primaryFile, secondaryFile, etc.)
   * @returns {Array<Object>} Array of objects mapping internal keys to download filenames
   */
  getFiles(job) {
    const files = [];
    if (job) {
      if (job.primaryFile)
        files.push({
          name: "shop_details.xlsx",
          buffer: Buffer.from(job.primaryFile).toString("base64"),
        });
      if (job.secondaryFile)
        files.push({
          name: "simple_shop_details.xlsx",
          buffer: Buffer.from(job.secondaryFile).toString("base64"),
        });
    }
    return files;
  }
}
