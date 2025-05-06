const fs = require("fs");
const path = require("path");
const { writeToPath } = require("@fast-csv/format");
const { parse } = require("@fast-csv/parse");

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

class CSVFileReader {
  constructor(filePath, filter = () => true, rowMap = null) {
    this.filePath = filePath;
    this.filter = filter;
    this.rowMap = rowMap;
  }

  async read() {
    const results = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(this.filePath)
        .pipe(parse({ headers: true }))
        .on("error", reject)
        .on("data", (row) => {
          // Apply filter function (defaults to always true if empty)
          if (this.filter(row)) {
            // Apply rowMap if provided, else just return the row as-is
            results.push(this.rowMap ? this.rowMap(row) : row);
          }
        })
        .on("end", () => {
          resolve(results);
        });
    });
  }
}

module.exports = {
  CSVFileWriter,
  CSVFileReader,
};
// const fileHandler = new CSVFileHandler("resources/csv/shop_details.csv", "shopDetails");
