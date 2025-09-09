import { ExcelFileHandler, sameDomain } from "../base/index.js";

/**
 * Compares URLs between a fishTales starter file and a shopReel file,
 * identifies URLs present in the shopReel file but missing from the fishTales file,
 * and appends the missing URLs to the fishTales file.
 *
 * @param {Object} files - The two files to compare
 * @param {Function} progressUpdate - Optional callback function to receive progress/status updates.
 * @param {Function} returnFile - Optional callback to receive the final Excel file buffer.
 * @param {Object} cancelToken - Optional cancellation token with a `throwIfCancelled()` method to abort execution.
 *
 * @returns {Promise<void>} Resolves when scraping completes successfully, is cancelled, or encounters an error.
 */
export async function mergeMissingUrls({
  files,
  progressUpdate = () => {},
  returnFile = () => {},
  cancelToken = { throwIfCancelled: () => {} }, // default to no-op if not provided
}) {
  progressUpdate("Comparing report and site URLs...");

  try {
    cancelToken.throwIfCancelled();
    // Initialize Excel handlers for both files
    const shopReelHandler = new ExcelFileHandler();
    const fishTalesHandler = new ExcelFileHandler();

    // Load the buffers
    await shopReelHandler.loadBuffer(files["shopReelFile"]);
    await fishTalesHandler.loadBuffer(files["fishTalesFile"]);

    // Read URLs from both files:
    // - Report file: include all rows, map to the "url" field
    // - Site file: only include rows where "Has Report" is true, map to the "Website" field
    cancelToken.throwIfCancelled();
    const [rawReportUrls, rawSiteUrls] = await Promise.all([
      fishTalesHandler.read(
        [],
        () => true,
        (row) => row["url"]
      ),
      shopReelHandler.read(
        [],
        (row) => row["has_report"] === true,
        (row) => row["website"]
      ),
    ]);

    // Deduplicate URLs by converting to Sets and back to arrays
    const reportUrls = Array.from(new Set(rawReportUrls));
    const siteUrls = Array.from(new Set(rawSiteUrls));

    cancelToken.throwIfCancelled();
    // Identify URLs in the site file whose domain is not present in any report URL
    const missingUrls = siteUrls.filter(
      (siteUrl) => !reportUrls.some((reportUrl) => sameDomain(siteUrl, reportUrl))
    );

    if (missingUrls.length === 0) {
      progressUpdate("✅ No missing URLs found.");
      return;
    }

    progressUpdate(`Appending ${missingUrls.length} missing URLs to the report file...`);

    cancelToken.throwIfCancelled();

    const newFile = new ExcelFileHandler();
    await newFile.write(await fishTalesHandler.read());
    await newFile.write(
      missingUrls.map((url) => ({ url })),
      true
    );

    progressUpdate("DOWNLOAD:new_fishTales_starter.xlsx");
    progressUpdate("✅ FishTales start file updated.");
    returnFile(await newFile.getBuffer());
  } catch (err) {
    if (err.isCancelled) {
      progressUpdate(err.message);
    } else {
      progressUpdate(`❌ Error: ${err.message || err}`);
    }
  }
}
