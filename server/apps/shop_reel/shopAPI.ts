import { prisma } from "../../db/client";
import { BaseAPI } from "../base";
import { JobType, JobStatus } from "@prisma/client";
import { ShopReel } from "./shopReel";
import type { Request, Response } from "express";

/**
 * ShopReelAPI handles creating and tracking ShopReel scraping jobs.
 */
export class ShopReelAPI extends BaseAPI {
  protected primaryFileName = "shop_details.xlsx";
  protected secondaryFileName = "simple_shop_details.xlsx";

  /**
   * Creates a new ShopReel scraping job.
   */
  async createJob(req: Request, res: Response): Promise<void> {
    try {
      // Create a new job in the database
      const job = await prisma.job.create({
        data: { type: JobType.SHOP_REEL, status: JobStatus.IN_PROGRESS },
      });

      // Determine payload: either a file upload or query parameters
      const file = Array.isArray(req.files) ? req.files?.[0] : undefined;
      const payload = file
        ? { file }
        : {
            apiKey: req.body.apiKey,
            query: req.body.searchTerm,
            lat: parseFloat(req.body.latitude),
            lng: parseFloat(req.body.longitude),
            maxResults: parseInt(req.body.maxResults, 10),
          };

      // Start the scraper asynchronously
      const scraper = new ShopReel(job.id, payload);
      scraper.shopScraper().catch((err: Error) => {
        console.error(`ShopScraper failed for job ${job.id}:`, err);
      });

      // Respond with the job ID and initial status
      res.status(201).json({ jobId: job.id, status: job.status });
    } catch {
      res.status(500).json({ error: "Failed to create ShopReel job" });
    }
  }
}
