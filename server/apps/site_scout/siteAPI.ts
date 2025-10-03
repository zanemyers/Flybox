import { prisma } from "../../db";
import { BaseAPI } from "../base";
import { JobType, JobStatus } from "@prisma/client";
import { SiteScout } from "./siteScout";
import type { Request, Response } from "express";

/**
 * SiteScoutAPI handles creating and tracking SiteScout jobs.
 */
export class SiteScoutAPI extends BaseAPI {
  protected primaryFileName = "report_summary.txt";

  /**
   * Creates a new SiteScout job.
   */
  async createJob(req: Request, res: Response): Promise<void> {
    try {
      const job = await prisma.job.create({
        data: { type: JobType.SITE_SCOUT, status: JobStatus.IN_PROGRESS },
      });

      const files = Array.isArray(req.files) ? req.files : [];

      const scout = new SiteScout(
        job.id || "",
        Object.fromEntries(files.map((f: any) => [f.fieldname, f.buffer]))
      );

      scout.mergeMissingUrls().catch((err: Error) => {
        console.error(`SiteScout failed for job ${job.id}:`, err);
      });

      res.status(201).json({ jobId: job.id, status: job.status });
    } catch {
      res.status(500).json({ error: "Failed to create SiteScout job" });
    }
  }
}
