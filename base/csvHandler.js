const fs = require("fs");
const path = require("path");
const { writeToPath } = require("@fast-csv/format");
const { getUTCTimeStamp, getUTCYearMonth } = require("./timeHelpers.js");

class CSVFileWriter {
  constructor(filePath, archiveFolderName) {
    this.filePath = filePath;
    this.archiveFolderName = archiveFolderName;
    this.dirPath = path.dirname(filePath);

    // Ensure the directory exists
    this.ensureDirectoryExists();

    // Archive the file if it exists
    this.archiveFile();
  }

  // Ensure the directory exists
  ensureDirectoryExists() {
    if (!fs.existsSync(this.dirPath)) {
      fs.mkdirSync(this.dirPath, { recursive: true });
    }
  }

  // Archive the file if it exists (called during initialization)
  archiveFile() {
    if (fs.existsSync(this.filePath)) {
      const stats = fs.statSync(this.filePath);
      const createdDate = stats.birthtime;
      const timestamp = getUTCTimeStamp(createdDate);
      const [year, month] = getUTCYearMonth(createdDate);

      const archiveDir = path.join(
        "resources",
        "csv",
        this.archiveFolderName,
        `${year}`,
        `${month}`
      );

      fs.mkdirSync(archiveDir, { recursive: true });

      const baseName = path.basename(this.filePath, ".csv");
      const archivedFile = path.join(
        archiveDir,
        `${baseName}_${timestamp}.csv`
      );

      fs.renameSync(this.filePath, archivedFile);
    }
  }

  // Function to write all records at once
  async bulkWriteCSVData(data) {
    return new Promise((resolve, reject) => {
      writeToPath(this.filePath, data, { headers: true })
        .on("error", reject)
        .on("finish", () => {
          resolve();
        });
    });
  }
}

module.exports = CSVFileWriter;
// const fileHandler = new CSVFileHandler("resources/csv/shop_details.csv", "shopDetails");
