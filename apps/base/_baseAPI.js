import { prisma } from "../../db.js";
import { JobStatus } from "@prisma/client";

/**
 * BaseAPI provides common job-related endpoints for polling, cancellation,
 * and job creation. Subclasses should extend this class to implement
 * application-specific job creation and file handling.
 */
export class BaseAPI {
  /**
   * Fetch updates for a job (status, progress messages, and any files).
   * Expected route: GET /api/:route/:id/updates
   *
   * @param {import("express").Request} req - Express request object
   * @param {import("express").Response} res - Express response object
   * @returns {Promise<*>} JSON with job status, concatenated messages, and files
   */
  async getJobUpdates(req, res) {
    try {
      const job = await prisma.job.findUnique({
        where: { id: req.params.id },
        include: { messages: { orderBy: { createdAt: "asc" } } },
      });
      if (!job) return res.status(404).json({ error: "Job not found" });

      res.json({
        status: job.status,
        message: job.messages.map((m) => m.message).join("\n"), // Concatenate all job messages into one string
        files: this.getFiles(job), // Delegate file retrieval to subclass
      });
    } catch {
      res.status(500).json({ error: "Failed to fetch job updates" });
    }
  }

  /**
   * Cancel a job by setting its status to CANCELLED and appending a "Cancelled" message.
   * Expected route: POST /api/:route/:id/cancel
   *
   * @param {import("express").Request} req - Express request object
   * @param {import("express").Response} res - Express response object
   * @returns {Promise<void>}
   */
  async cancelJob(req, res) {
    const { id } = req.params;

    try {
      await prisma.jobMessage.create({ data: { jobId: id, message: "❌ Cancelled" } }); // Log cancellation message

      // Update job status to CANCELLED
      await prisma.job.update({
        where: { id },
        data: { status: JobStatus.CANCELLED },
      });

      res.sendStatus(204); // No response body needed
    } catch {
      res.status(500).json({ error: "Failed to cancel job" });
    }
  }

  /**
   * Creates and starts a new job
   * Subclasses MUST override this with an actual implementation.
   * Expected route: POST /api/:route
   *
   * @throws {Error} If not implemented by subclass
   */
  createJob() {
    throw new Error("createJob must be implemented in subclass");
  }

  /**
   * Retrieve files associated with a job.
   * Subclasses MUST override this method to return an array of file objects:
   * e.g. [{ name: string, buffer: base64string }, ...]
   *
   * @throws {Error} If not implemented by subclass
   */
  getFiles() {
    throw new Error("getFiles must be implemented in subclass");
  }
}
