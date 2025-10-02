import { prisma } from "../../server/db.ts";
import { JobStatus } from "@prisma/client";
import { ERRORS } from "./constants.ts";

/** BaseApp provides utility methods for managing job records in the database. */
export class BaseApp {
  protected jobId: string = "";

  /** Checks whether the current job has been cancelled. */
  async throwIfJobCancelled() {
    const job = await prisma.job.findUnique({
      where: { id: this.jobId },
      select: { status: true },
    });

    if (job?.status === JobStatus.CANCELLED) throw new Error(ERRORS.CANCELLED);
  }

  /** Attaches a binary file to a job record. */
  async addJobFile(field: "primaryFile" | "secondaryFile", buffer: Buffer) {
    await prisma.job.update({
      where: { id: this.jobId },
      data: { [field]: buffer },
    });
  }

  /** Adds a new message to the job, or optionally updates the most recent message. */
  async addJobMessage(text: string, updateLast: boolean = false) {
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

  /** Updates the status of the job to a new JobStatus value. */
  async updateJobStatus(status: JobStatus) {
    await prisma.job.update({
      where: { id: this.jobId },
      data: { status },
    });
  }
}
