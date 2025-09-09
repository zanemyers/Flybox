import { prisma } from "../../db.js";
import { JobStatus } from "@prisma/client";

export class BaseAPI {
  // GET job status & messages
  async getJobUpdates(req, res) {
    try {
      const job = await prisma.job.findUnique({
        where: { id: req.params.id },
        include: { messages: { orderBy: { createdAt: "asc" } } },
      });

      if (!job) return res.status(404).json({ error: "Job not found" });

      res.json({
        status: job.status,
        message: job.messages.map((m) => m.message).join("\n"),
        files: this.getFiles(job),
      });
    } catch (err) {
      console.error("Error fetching job updates:", err);
      res.status(500).json({ error: "Failed to fetch job updates" });
    }
  }

  async cancelJob(req, res) {
    const { id } = req.params;

    try {
      // Add a cancelled message
      await prisma.jobMessage.create({
        data: { jobId: id, message: "❌ Cancelled" },
      });

      // cancel the job
      await prisma.job.update({
        where: { id: id },
        data: { status: JobStatus.CANCELLED },
      });
      res.sendStatus(204); // No Content
    } catch {
      res.status(500).json({ error: "Failed to cancel job" });
    }
  }

  // Base POST create (Must be overridden!)
  async createJob(req, res) {
    res.status(501).json({ error: "createJob not implemented" });
  }

  /**
   * Return an array of file names.
   * Subclasses should override this method to provide custom file names.
   */
  getFiles(_job) {
    throw new Error("getFileNames(job) must be implemented in the subclass");
  }
}
