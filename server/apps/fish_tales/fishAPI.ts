import type { Request, Response } from "express";

import { BaseAPI } from "../base";
import { prisma } from "../../server/db.ts";
import { JobStatus, JobType } from "@prisma/client";
import { FishTales } from "./fishTales";

/**
 * FishTalesAPI handles creating and tracking FishTales scraping jobs.
 */
export class FishTalesAPI extends BaseAPI {
  protected primaryFileName = "report_summary.txt";
  protected secondaryFileName = "site_list.txt";

  /**
   * Creates a new FishTales scraping job.
   */
  async createJob(req: Request, res: Response): Promise<void> {
    try {
      // Create a new job in the database
      const job = await prisma.job.create({
        data: { type: JobType.FISH_TALES, status: JobStatus.IN_PROGRESS },
      });

      // Determine payload: either a file upload or query parameters
      const files = Array.isArray(req.files) ? req.files : [];
      const payload = {
        apiKey: req.body.apiKey,
        maxAge: parseInt(req.body.maxAge, 10),
        filterByRivers: req.body.filterByRivers === "true",
        riverList: req.body.riverList.split(",").map((s: string) => s.trim()),
        file: files?.[0],
        includeSiteList: req.body.includeSiteList === "true",
        tokenLimit: parseInt(req.body.tokenLimit, 10),
        crawlDepth: parseInt(req.body.crawlDepth, 10),
        model: req.body.model,
        summaryPrompt: req.body.summaryPrompt,
        mergePrompt: req.body.mergePrompt,
      };

      // Start the scraper asynchronously
      const scraper = new FishTales(job.id, payload);
      scraper.reportScraper().catch((err: Error) => {
        console.error(`ShopScraper failed for job ${job.id}:`, err);
      });

      // Respond with the job ID and initial status
      res.status(201).json({ jobId: job.id, status: job.status });
    } catch {
      res.status(500).json({ error: "Failed to create ShopReel job" });
    }
  }
}
