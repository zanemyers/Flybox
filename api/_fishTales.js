import { baseAPI } from "./_base.js";
import { prisma } from "../db.js";

export class FishTalesAPI extends baseAPI {
  async createJob(req, res) {
    const { payload } = req.body;
    try {
      // Custom logic for FishTales
      const job = await prisma.job.create({
        data: { status: "pending", message: "FishTales job started", payload },
      });
      res.status(201).json({ jobId: job.id });
    } catch {
      res.status(500).json({ error: "Failed to create FishTales job" });
    }
  }
}
