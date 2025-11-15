import { BaseApp, ExcelFileHandler, sameDomain } from "../base/index.js";
import { ERRORS } from "../base/constants.js";
import pkg from "@prisma/client";
const { JobStatus } = pkg;

/**
 * SiteScout class merges URLs between a ShopReel report file and a
 * FishTales starter Excel file and saves the results to a new Excel file.
 *
 * Extends BaseApp to integrate with the job system (progress tracking,
 * cancellation, messages, and file attachments).
 */
export class SiteScout extends BaseApp {
  /**
   * @param {string|null} jobId - Optional Job ID for tracking progress and associated files.
   * @param {Object} files - An object containing the two Excel files:
   */
  constructor(jobId, files) {
    super(jobId);
    this.files = files;

    // Excel file handlers for reading/writing
    this.shopReelHandler = new ExcelFileHandler();
    this.fishTalesHandler = new ExcelFileHandler();
    this.updatedFile = new ExcelFileHandler();
  }

  /**
   * Compares URLs between the ShopReel and FishTales files, identifies URLs
   * present in the ShopReel file but missing from the FishTales file, and
   * appends any missing URLs to the FishTales file.
   */
  async mergeMissingUrls() {
    await this.addJobMessage("Comparing report and site URLs...");

    try {
      // Load the Excel file buffers into their respective handlers
      await this.shopReelHandler.loadBuffer(this.files["shopReelFile"]);
      await this.fishTalesHandler.loadBuffer(this.files["fishTalesFile"]);

      await this.throwIfJobCancelled();

      // Extract URLs:
      // - Report URLs: all rows, using the "url" column
      // - Site URLs: only rows where "has_report" is true, using the "website" column
      const [rawReportUrls, rawSiteUrls] = await Promise.all([
        this.fishTalesHandler.read(
          [],
          () => true,
          (row) => row["url"]
        ),
        this.shopReelHandler.read(
          [],
          (row) => row["has_report"] === true,
          (row) => row["website"]
        ),
      ]);

      // Deduplicate URLs
      const reportUrls = Array.from(new Set(rawReportUrls));
      const siteUrls = Array.from(new Set(rawSiteUrls));

      await this.throwIfJobCancelled();

      // Determine which site URLs are missing from the report file based on domain
      const missingUrls = siteUrls.filter(
        (siteUrl) => !reportUrls.some((reportUrl) => sameDomain(siteUrl, reportUrl))
      );

      if (missingUrls.length === 0) {
        await this.addJobMessage("✅ No missing URLs found.");
        await this.updateJobStatus(JobStatus.COMPLETED);
        return;
      }

      await this.addJobMessage(
        `Appending ${missingUrls.length} missing URLs to the report file...`
      );
      await this.throwIfJobCancelled();

      // Write existing report rows to the updated file
      await this.updatedFile.write(await this.fishTalesHandler.read());

      // Append missing URLs as new rows
      await this.updatedFile.write(
        missingUrls.map((url) => ({ url })),
        true
      );

      await this.addJobMessage("✅ FishTales starter file updated.");
      await this.addJobFile("primaryFile", await this.updatedFile.getBuffer()); // Save the updated file in the job system
      await this.updateJobStatus(JobStatus.COMPLETED);
    } catch (err) {
      // Handle errors (except job cancellation) and mark job as failed
      if (err.message !== ERRORS.CANCELLED) {
        await this.addJobMessage(`❌ Error: ${err.message || err}`);
        await this.updateJobStatus(JobStatus.FAILED);
      }
    }
  }
}
