import ExcelJS from "exceljs";

/** This class provides simple methods to store, read, and retrieve text file data */
class TXTFileHandler {
  private content: string = ""; // The current text content held in memory.

  /** Returns the current text content. */
  read(): string {
    return this.content;
  }

  /** Stores text content in memory. Optionally appends or replaces the content */
  async write(data: string, append: boolean = true): Promise<void> {
    this.content = append ? this.content + data : data;
  }

  /** Returns the current content as a UTF-8 encoded Buffer. */
  getBuffer(): Buffer {
    return Buffer.from(this.content, "utf-8");
  }
}

/** This class provides simple methods to store, read/write, and retrieve/export xlsx file data */
class ExcelFileHandler {
  protected workbook: ExcelJS.Workbook = new ExcelJS.Workbook();
  protected worksheet: ExcelJS.Worksheet = this.workbook.addWorksheet("Sheet1");

  /** Reads worksheet data into an array of objects. */
  async read<T = Record<string, any>>(
    listCols: string[] = [],
    filter: (row: Record<string, any>) => boolean = () => true,
    rowMap?: (row: Record<string, any>) => any
  ): Promise<T[]> {
    const headers = (this.worksheet.getRow(1).values as any[]).slice(1); // Uses the first worksheet row as headers.
    const data: T[] = [];

    this.worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber === 1) return; // skip header

      const rowData: Record<string, any> = {};

      headers.forEach((h, i) => {
        const cellValue = row.getCell(i + 1).value ?? null;
        const key = this.toCamelCase(String(h));

        rowData[key] =
          typeof cellValue === "string" && listCols.includes(key)
            ? cellValue
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            : cellValue;
      });

      // Applies an optional transform function (`rowMap`) to each included row.
      if (filter(rowData)) data.push(rowMap ? rowMap(rowData) : rowData);
    });

    return data;
  }

  /** Add or overwrite worksheet rows from an array of objects. */
  async write(data: Record<string, any | number>[], append: boolean = true) {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Data must be a non-empty array.");
    }

    const headers = Object.keys(data[0]);
    if (headers.length === 0) {
      throw new Error("Data objects must have at least one key.");
    }

    if (!append) {
      this.workbook = new ExcelJS.Workbook();
      this.worksheet = this.workbook.addWorksheet("Sheet1");
      this.worksheet.addRow(headers);
    } else if (this.worksheet.rowCount === 0) {
      this.worksheet.addRow(headers);
    }

    data.forEach((item) => {
      this.worksheet.addRow(headers.map((key) => item[key]));
    });
  }

  /** Load an existing Excel file into memory from a buffer. */
  async loadBuffer(buffer: Buffer): Promise<this> {
    await this.workbook.xlsx.load(buffer as any); // works fine
    this.worksheet = this.workbook.worksheets[0] || this.worksheet;
    return this;
  }

  /** Export the workbook as a buffer for sending or saving. */
  async getBuffer(): Promise<Buffer> {
    return Buffer.from(await this.workbook.xlsx.writeBuffer());
  }

  toCamelCase(str: string): string {
    return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
  }
}

export { TXTFileHandler, ExcelFileHandler };
