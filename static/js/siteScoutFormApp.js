import { initFileInput } from "./fileInput.js";
import { BaseFormApp } from "./baseFormApp.js";

/**
 * Handles the UI logic for the shop scraper form.
 */
class SiteScoutFormApp extends BaseFormApp {
  constructor() {
    super("site-scout-form", "site-scout");
  }

  /**
   * Initializes file inputs.
   */
  onFormLoad() {
    initFileInput();
  }

  /**
   * Cache frequently accessed DOM elements to avoid repeated DOM lookups.
   */
  cacheElements() {
    this.elements.shopReelFileEl = document
      .getElementById("shop-reel-file-input")
      .querySelector("input");
    this.elements.fishTalesFileEl = document
      .getElementById("fish-tales-file-input")
      .querySelector("input");
  }

  /**
   * Validate the user's form input depending on the active tab.
   *
   * @returns {object|null|File} payload object
   */
  validateFormInput() {
    // Read and sanitize input values
    const shopReelFile = this.elements.shopReelFileEl.files[0] || null;
    const fishTalesFile = this.elements.fishTalesFileEl.files[0] || null;

    const isValid = shopReelFile && fishTalesFile;

    return isValid ? { shopReelFile, fishTalesFile } : null;
  }

  /**
   * Sends the both files in the payload to the WebSocket
   *
   * @param {Object|File} payload
   */
  handlePayload(payload) {
    // payload is expected to be an object with File values
    for (const key in payload) {
      const file = payload[key];
      if (file instanceof File) {
        const reader = new FileReader();
        reader.onload = () => this.socket.send(reader.result);
        reader.readAsArrayBuffer(file);
      }
    }
  }
}

// === Initialize the app ===
const app = new SiteScoutFormApp();
document.addEventListener("DOMContentLoaded", () => app.showForm());
