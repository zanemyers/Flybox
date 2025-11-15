-- DropForeignKey
ALTER TABLE "JobMessage" DROP CONSTRAINT "JobMessage_jobId_fkey";

-- AddForeignKey
ALTER TABLE "JobMessage" ADD CONSTRAINT "JobMessage_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
