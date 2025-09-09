import { prisma } from "../../db.js";
import { JobStatus } from "@prisma/client";
import { ERRORS } from "./constants/index.js";

export class BaseApp {
  constructor(jobId) {
    this.jobId = jobId;
  }

  /**
   * Checks whether the job is cancelled.
   * Throws an error if so, which you can catch to stop processing.
   */
  async throwIfJobCancelled() {
    const job = await prisma.job.findUnique({
      where: { id: this.jobId },
      select: { status: true },
    });

    if (job.status === JobStatus.CANCELLED) throw new Error(ERRORS.CANCELLED);
  }

  /**
   * Attaches a file (Buffer) to a job.
   *
   * @param {"primaryFile" | "secondaryFile"} field - Which file slot to use
   * @param {Buffer} buffer - The binary file contents
   */
  async addJobFile(field, buffer) {
    await prisma.job.update({
      where: { id: this.jobId },
      data: { [field]: buffer },
    });
  }

  /**
   * Add a new message to a job, or updates the most recent one.
   *
   * @param {string} text - The message text
   * @param {boolean}  updateLast - Whether to update the latest message instead of creating a new one
   */
  async addJobMessage(text, updateLast = false) {
    if (updateLast) {
      const lastMessage = await prisma.jobMessage.findFirst({
        where: { jobId: this.jobId },
        orderBy: { createdAt: "desc" },
      });

      if (lastMessage) {
        await prisma.jobMessage.update({
          where: { id: lastMessage.id },
          data: { message: text },
        });
        return;
      }
    }

    await prisma.jobMessage.create({
      data: { jobId: this.jobId, message: text },
    });
  }

  /**
   * Updates the status of a job do a predefined option
   *
   * @param {JobStatus} status - The message text
   */
  async updateJobStatus(status) {
    await prisma.job.update({
      where: { id: this.jobId },
      data: { status },
    });
  }
}
