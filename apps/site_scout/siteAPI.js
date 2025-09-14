import { prisma } from "../../server/db.js";
import { BaseAPI } from "../base/_baseAPI.js";
import { JobType, JobStatus } from "@prisma/client";
import { SiteScout } from "./siteScout.js";

/**
 * SiteScoutAPI handles creating and tracking SiteScout jobs.
 */
export class SiteScoutAPI extends BaseAPI {
  /**
   * Creates a new SiteScout job.
   *
   * @param {import("express").Request} req - Express request object (may include files or query parameters)
   * @param {import("express").Response} res - Express response object
   * @returns {Promise<void>} Responds with the new job ID and status
   */
  async createJob(req, res) {
    try {
      // Create a new job in the database
      const job = await prisma.job.create({
        data: { type: JobType.SITE_SCOUT, status: JobStatus.IN_PROGRESS },
      });

      // Start the job asynchronously
      const scout = new SiteScout(
        job.id,
        Object.fromEntries(req.files.map((f) => [f.fieldname, f.buffer])) // map the files to {name: buffer}
      );
      scout.mergeMissingUrls().catch((err) => {
        console.error(`SiteScout failed for job ${job.id}:`, err);
      });

      // Respond with the job ID and initial status
      res.status(201).json({ jobId: job.id, status: job.status });
    } catch {
      res.status(500).json({ error: "Failed to create ShopReel job" });
    }
  }

  /**
   * Returns a list of files available for download for a given SiteScout job.
   *
   * @param {object} job - The job object containing file buffers (primaryFile, secondaryFile, etc.)
   * @returns {Array<{name: string, buffer: string}>} Array of downloadable files
   */
  getFiles(job) {
    const files = [];

    if (job && job.primaryFile) {
      files.push({
        name: "new_fishTales_starter.xlsx",
        buffer: Buffer.from(job.primaryFile).toString("base64"),
      });
    }

    return files;
  }
}
