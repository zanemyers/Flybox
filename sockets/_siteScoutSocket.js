import { BaseWebSocket } from "./_baseWebSocket.js";
import { mergeMissingUrls } from "../apps/site_scout/siteScout.js";

/**
 * WebSocket subclass specifically for handling site scout requests.
 */
class _siteScoutSocket extends BaseWebSocket {
  constructor(ws) {
    super(ws);

    // Store the current session's data until both JSON and file buffer are received
    this.currentSession = { shopReelFile: null, fishTalesFile: null };
  }

  /**
   * Accepts only binary file messages and waits for both files
   * before returning the payload.
   *
   * @param {Buffer} message - Incoming binary file
   * @returns {Object|null} Payload with both files, or null if waiting
   */
  formatPayload(message) {
    if (!this.currentSession.shopReelFile) {
      this.currentSession.shopReelFile = message;
      return null; // wait for second file
    }

    this.currentSession.fishTalesFile = message;

    // Both files received — return payload
    return {
      shopReelFile: this.currentSession.shopReelFile,
      fishTalesFile: this.currentSession.fishTalesFile,
    };
  }

  /**
   * Handles incoming payload from the WebSocket.
   * Delegates the scraping task to the mergeMissingUrls function.
   *
   * @param {Object} payload - JSON payload containing search parameters
   */
  async handleAction(payload) {
    await mergeMissingUrls({
      files: payload,
      progressUpdate: this.progressUpdate.bind(this), // Send progress updates over WebSocket
      returnFile: this.returnFile.bind(this), // Return resulting file over WebSocket
      cancelToken: this.cancelToken, // Supports cancellation of scraping
    });
  }
}

/**
 * Initialize a new WebSocket connection for shop scraping.
 *
 * @param {WebSocket} ws - The WebSocket connection
 */
export function siteScoutSocket(ws) {
  new _siteScoutSocket(ws);
}
