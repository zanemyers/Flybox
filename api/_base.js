import { prisma } from "../db.js";

export class baseAPI {
  // GET updates
  async getJobUpdates(req, res) {
    const { id } = req.params;
    try {
      const job = await prisma.job.findUnique({ where: { id: parseInt(id) } });
      if (!job) return res.status(404).json({ error: "Job not found" });

      res.json({ status: job.status, message: job.message });
    } catch {
      res.status(500).json({ error: "Failed to fetch job updates" });
    }
  }

  // GET files
  async getJobFiles(req, res) {
    const { id } = req.params;
    try {
      const job = await prisma.job.findUnique({ where: { id: parseInt(id) } });
      if (!job) return res.status(404).json({ error: "Job not found" });

      res.json({ files: job.files || [] });
    } catch {
      res.status(500).json({ error: "Failed to fetch job files" });
    }
  }

  // Base POST create (Must be overridden!)
  async createJob(req, res) {
    res.status(501).json({ error: "createJob not implemented" });
  }
}
