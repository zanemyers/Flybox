import { BaseWebSocket } from "./_baseWebSocket.js";
import { reportScraper } from "../apps/report_scraper/reportScraper.js";

class _ReportSocket extends BaseWebSocket {
  constructor(ws) {
    super(ws);
    this.currentSession = { jsonData: null, fileBuffer: null };
  }

  formatPayload(message, isBinary) {
    if (isBinary) {
      // Received file buffer
      this.currentSession.fileBuffer = message;
      if (this.currentSession.jsonData) {
        return {
          ...this.currentSession.jsonData,
          fileBuffer: this.currentSession.fileBuffer,
        };
      } else {
        throw new Error("❌ Missing JSON data.");
      }
    } else {
      this.currentSession.jsonData = JSON.parse(message).data;
      return null; // Wait for file to arrive
    }
  }

  async handleAction(payload) {
    await reportScraper({
      searchParams: payload,
      progressUpdate: this.progressUpdate.bind(this),
      returnFile: this.returnFile.bind(this),
      cancelToken: this.cancelToken,
    });
  }
}

export function reportSocket(ws) {
  new _ReportSocket(ws);
}
