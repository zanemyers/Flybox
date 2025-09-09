import { BaseAPI } from "../base/_baseAPI.js";
import { prisma } from "../../db.js";

export class SiteScoutAPI extends BaseAPI {
  async createJob(req, res) {
    const { site } = req.body;
    try {
      const job = await prisma.job.create({
        data: { status: "pending", message: `SiteScout job started for ${site}`, site },
      });
      res.status(201).json({ jobId: job.id });
    } catch {
      res.status(500).json({ error: "Failed to create SiteScout job" });
    }
  }
}
