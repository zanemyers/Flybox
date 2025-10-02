import { prisma } from "../../server/db.ts";
import { JobStatus, type Job } from "@prisma/client";
import type { Request, Response } from "express";

/**
 * BaseAPI provides common job-related endpoints for polling, cancellation,
 * and job creation. Subclasses should extend this class to implement
 * application-specific job creation and file handling.
 */
export abstract class BaseAPI {
  protected primaryFileName: string = "primary.txt";
  protected secondaryFileName: string = "secondary.txt";

  /** Fetch updates for a job. */
  async getJobUpdates(req: Request, res: Response): Promise<void> {
    try {
      const job = await prisma.job.findUnique({
        where: { id: req.params.id },
        include: { messages: { orderBy: { createdAt: "asc" } } },
      });

      if (!job) {
        res.status(404).json({ error: "Job not found" });
        return;
      }

      res.json({
        status: job.status,
        message: job.messages.map((m) => m.message).join("\n"),
        files: this.getFiles(job),
      });
    } catch {
      res.status(500).json({ error: "Failed to fetch job updates" });
    }
  }

  /** Cancel a job by and update its status */
  async cancelJob(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      await prisma.jobMessage.create({ data: { jobId: id, message: "❌ Cancelled" } });

      await prisma.job.update({
        where: { id },
        data: { status: JobStatus.CANCELLED },
      });

      res.sendStatus(204);
    } catch {
      res.status(500).json({ error: "Failed to cancel job" });
    }
  }

  /** Must be implemented in the child class */
  abstract createJob(req: Request, res: Response): Promise<void>;

  /** Returns a list of files available for download. */
  getFiles(job: Job): { name: string; buffer: string }[] {
    const files = [];

    if (job.primaryFile) {
      files.push({
        name: this.primaryFileName,
        buffer: Buffer.from(job.primaryFile).toString("base64"),
      });
    }

    if (job.secondaryFile) {
      files.push({
        name: this.secondaryFileName,
        buffer: Buffer.from(job.secondaryFile).toString("base64"),
      });
    }

    return files;
  }
}
