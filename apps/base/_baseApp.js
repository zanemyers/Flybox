import { prisma } from "../../server/db.js";
import { JobStatus } from "@prisma/client";
import { ERRORS } from "./constants/index.js";

/**
 * BaseApp provides utility methods for managing job records in the database.
 * Includes checking status, attaching files, adding/updating messages, and updating job status.
 */
export class BaseApp {
  /**
   * @param {string} jobId - The ID of the job to manage
   */
  constructor(jobId) {
    this.jobId = jobId;
  }

  /**
   * Checks whether the current job has been cancelled.
   * If cancelled, throws an Error with a predefined message from ERRORS.CANCELLED.
   * Useful for stopping long-running or asynchronous processes early.
   *
   * @throws {Error} If the job status is CANCELLED
   */
  async throwIfJobCancelled() {
    const job = await prisma.job.findUnique({
      where: { id: this.jobId },
      select: { status: true },
    });

    if (job.status === JobStatus.CANCELLED) throw new Error(ERRORS.CANCELLED);
  }

  /**
   * Attaches a binary file (Buffer) to a job record.
   *
   * @param {"primaryFile" | "secondaryFile"} field - Which file slot to use
   * @param {Buffer} buffer - The binary contents of the file
   */
  async addJobFile(field, buffer) {
    await prisma.job.update({
      where: { id: this.jobId },
      data: { [field]: buffer },
    });
  }

  /**
   * Adds a new message to the job, or optionally updates the most recent message.
   *
   * @param {string} text - The message text to add or update
   * @param {boolean} [updateLast=false] - If true, updates the most recent message instead of creating a new one
   */
  async addJobMessage(text, updateLast = false) {
    const lastMessage = await prisma.jobMessage.findFirst({
      where: { jobId: this.jobId },
      orderBy: { createdAt: "desc" },
    });

    if (lastMessage && updateLast) {
      await prisma.jobMessage.update({
        where: { id: lastMessage.id },
        data: { message: text },
      });
    } else {
      await prisma.jobMessage.create({
        data: { jobId: this.jobId, message: text },
      });
    }
  }

  /**
   * Updates the status of the job to a new JobStatus value.
   *
   * @param {JobStatus} status - The new status to set on the job
   */
  async updateJobStatus(status) {
    await prisma.job.update({
      where: { id: this.jobId },
      data: { status },
    });
  }
}
