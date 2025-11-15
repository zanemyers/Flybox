import { BaseAPI } from "../base/_baseAPI.js";
import { prisma } from "../../server/db.js";
import { FishTales } from "./fishTales.js";
import pkg from "@prisma/client";
const { JobType, JobStatus } = pkg;

/**
 * FishTalesAPI handles creating and tracking FishTales scraping jobs.
 */
export class FishTalesAPI extends BaseAPI {
  /**
   * Creates a new FishTales scraping job.
   *
   * @param {import("express").Request} req - Express request object (may include files or query parameters)
   * @param {import("express").Response} res - Express response object
   * @returns {Promise<void>} Responds with the new job ID and status
   */
  async createJob(req, res) {
    try {
      // Create a new job in the database
      const job = await prisma.job.create({
        data: { type: JobType.FISH_TALES, status: JobStatus.IN_PROGRESS },
      });

      // Determine payload: either a file upload or query parameters
      const payload = {
        apiKey: req.body.apiKey,
        maxAge: parseInt(req.body.maxAge, 10),
        filterByRivers: req.body.filterByRivers === "true",
        riverList: req.body.riverList.split(",").map((s) => s.trim()),
        file: req.files?.[0],
        includeSiteList: req.body.includeSiteList === "true",
        tokenLimit: parseInt(req.body.tokenLimit, 10),
        crawlDepth: parseInt(req.body.crawlDepth, 10),
        model: req.body.model,
        summaryPrompt: req.body.summaryPrompt,
        mergePrompt: req.body.mergePrompt,
      };

      // Start the scraper asynchronously
      const scraper = new FishTales(job.id, payload);
      scraper.reportScraper().catch((err) => {
        console.error(`ShopScraper failed for job ${job.id}:`, err);
      });

      // Respond with the job ID and initial status
      res.status(201).json({ jobId: job.id, status: job.status });
    } catch (error) {
      res.status(500).json({ error: `Failed to create ShopReel job: ${error}` });
    }
  }

  /**
   * Returns a list of files available for download for a given FishTales job.
   *
   * @param {object} job - The job object containing file buffers (primaryFile, secondaryFile, etc.)
   * @returns {Array<{name: string, buffer: string}>} Array of downloadable files
   */
  getFiles(job) {
    const files = [];

    if (job) {
      if (job.primaryFile) {
        files.push({
          name: "report_summary.txt",
          buffer: Buffer.from(job.primaryFile).toString("base64"),
        });
      }

      if (job.secondaryFile) {
        files.push({
          name: "site_list.txt",
          buffer: Buffer.from(job.secondaryFile).toString("base64"),
        });
      }
    }

    return files;
  }
}
