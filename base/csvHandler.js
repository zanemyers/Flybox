const fs = require("fs");
const path = require("path");
const { writeToPath } = require("@fast-csv/format");
const { parse } = require("@fast-csv/parse");

const { getUTCTimeStamp, getUTCYearMonth } = require("./dateUtils.js");

/**
 * Utility class to handle CSV file writing and reading.
 * It provides methods to write data to a CSV file and read data from a CSV file.
 * The CSVFileWriter class ensures that the output directory exists and archives existing files with timestamps.
 * The CSVFileReader class allows filtering and transforming rows while reading.
 */

class CSVFileWriter {
  /**
   * Utility class to write data to a CSV file.
   * Ensures the output directory exists and archives existing files with timestamps.
   *
   * @param {string} filePath - Path to the CSV file to write to.
   * @param {string} archiveFolderName - Folder name (inside resources/csv/) where old versions will be archived.
   */
  constructor(filePath, archiveFolderName) {
    this.filePath = filePath; // Path to the CSV file
    this.archiveFolderName = archiveFolderName; // Name of the folder to store archived files

    // Ensure the directory exists before writing
    const dirPath = path.dirname(this.filePath); // Get the directory path of the file
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Archive the file if it already exists
    if (fs.existsSync(this.filePath)) {
      this.archiveFile();
    }
  }

  /**
   * Archives the current file by moving it to an archive folder with a timestamped filename.
   *
   * Folder structure: resources/csv/{archiveFolderName}/{year}/{month}
   */
  archiveFile() {
    const stats = fs.statSync(this.filePath); // Get file stats to access creation time
    const createdDate = stats.birthtime; // The timestamp of when the file was created
    const timestamp = getUTCTimeStamp(createdDate); // Get UTC timestamp of file creation date
    const [year, month] = getUTCYearMonth(createdDate); // Extract year and month from the creation date

    // Create the archive directory structure (resources/csv/{archiveFolderName}/{year}/{month})
    const archiveDir = path.join(
      "resources",
      "csv",
      this.archiveFolderName,
      `${year}`,
      `${month}`
    );

    fs.mkdirSync(archiveDir, { recursive: true }); // Create the archive folder if it doesn't exist

    const baseName = path.basename(this.filePath, ".csv"); // Get the base name of the file (without extension)
    const archivedFile = path.join(
      archiveDir,
      `${baseName}_${timestamp}.csv` // Rename the file with a timestamp
    );

    fs.renameSync(this.filePath, archivedFile); // Move and rename the original file
  }

  /**
   * Writes an array of data objects to the CSV file.
   *
   * @param {Array<Object>} data - An array of objects representing CSV rows.
   * @returns {Promise<void>} - A promise that resolves when the write is complete.
   */
  async bulkWriteCSVData(data) {
    return new Promise((resolve, reject) => {
      // Use the writeToPath function to write data to the file
      writeToPath(this.filePath, data, { headers: true })
        .on("error", reject) // Reject the promise if there is an error
        .on("finish", () => {
          resolve(); // Resolve the promise once writing is finished
        });
    });
  }
}

class CSVFileReader {
  /**
   * Utility class to read and process data from a CSV file.
   * Allows applying an optional row filter and row transformation.
   *
   * @param {string} filePath - The path to the CSV file to read.
   * @param {function(Object): boolean} [filter] - Optional function to determine whether to include a row (defaults to always true).
   * @param {function(Object): any} [rowMap] - Optional function to transform each included row before returning.
   */
  constructor(filePath, filter = () => true, rowMap = null) {
    this.filePath = filePath;
    this.filter = filter;
    this.rowMap = rowMap;
  }

  /**
   * Reads the CSV file, applying the optional filter and rowMap functions.
   *
   * @returns {Promise<Array>} - A promise that resolves to an array of processed rows.
   */
  async read() {
    const results = []; // Array to store the filtered and mapped rows

    return new Promise((resolve, reject) => {
      // Create a read stream and pipe it to the CSV parser
      fs.createReadStream(this.filePath)
        .pipe(parse({ headers: true })) // Parse the CSV with headers
        .on("error", reject) // Reject the promise if there's an error
        .on("data", (row) => {
          // Apply the filter function to each row (defaults to true, i.e., include every row)
          if (this.filter(row)) {
            // If a rowMap function is provided, apply it, otherwise return the row as-is
            results.push(this.rowMap ? this.rowMap(row) : row);
          }
        })
        .on("end", () => {
          resolve(results); // Resolve the promise once all rows have been processed
        });
    });
  }
}

module.exports = {
  CSVFileWriter,
  CSVFileReader,
};
// const fileHandler = new CSVFileHandler("resources/csv/shop_details.csv", "shopDetails");
