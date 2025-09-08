import { initTooltips } from "./tooltip.js";

/**
 * Base class for client-side form applications that interact with
 * WebSocket endpoints and show progress for long-running tasks.
 */
export class BaseFormApp {
  /**
   * @param {string} formPartial - Name of the EJS partial to load for the form
   * @param {string} route - The api route to hit
   */
  constructor(formPartial, route) {
    this.elements = {}; // Cached DOM elements used across methods
    this.formPartial = formPartial;
    this.route = route;
  }

  /**
   * Loads the form partial into the container, initializes tooltips,
   * caches commonly used elements, and sets up submit handling.
   */
  async showForm() {
    const res = await fetch(`partials/${this.formPartial}`);
    document.getElementById("formContainer").innerHTML = await res.text();
    initTooltips();
    this.cacheElements();
    this.onFormLoad(); // Additional form setup defined in subclass
    this.handleFormSubmit();
  }

  /**
   * Loads the progress partial into the container and sets up
   * the cancel button to allow aborting the current WebSocket task.
   */
  async showProgress() {
    const res = await fetch("/partials/progress");
    document.getElementById("formContainer").innerHTML = await res.text();

    document.getElementById("progressButton").addEventListener("click", (event) => {
      event.currentTarget.disabled = true;

      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ action: "cancel" }));
        this.appendProgress(document.getElementById("progressArea"), "Cancelling....");
      }
    });
  }

  /**
   * Sets up the form submission listener:
   */
  handleFormSubmit() {
    const form = document.getElementById("form");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      form.classList.add("was-validated");

      const payload = this.validateFormInput();
      if (!payload) {
        const errorArea = document.getElementById("formError");
        if (errorArea) errorArea.textContent = "❗ Please fill out all required fields.";
        return;
      }

      await this.showProgress();

      // Send the payload to create the job
      await this.handlePayload(payload);

      if (!this.jobId) return;

      const progressArea = document.getElementById("progressArea");

      // Poll for updates every 1-2 seconds
      const pollInterval = 1500;
      let jobStatus = "IN_PROGRESS";

      while (jobStatus === "IN_PROGRESS") {
        try {
          const res = await fetch(`/api/jobs/${this.socketName}/${this.jobId}/updates`);
          const data = await res.json();

          jobStatus = data.status;
          progressArea.textContent = data.message || progressArea.textContent;

          // If files are ready, automatically download
          if (data.fileA) this.downloadFile(data.fileA, "fileA.xlsx");
          if (data.fileB) this.downloadFile(data.fileB, "fileB.xlsx");
        } catch (err) {
          console.error("Polling error:", err);
        }

        if (jobStatus === "IN_PROGRESS") await new Promise((r) => setTimeout(r, pollInterval));
      }

      // Once complete, update button
      const progressButton = document.getElementById("progressButton");
      progressButton.textContent = "Close";
      progressButton.classList.remove("btn-danger");
      progressButton.classList.add("btn-secondary");
      progressButton.disabled = false;

      progressButton.onclick = () => this.showForm();
    });
  }

  /**
   * Updates the last line in the progress area with new text.
   * Prevents overwriting "Cancelling...." message with unrelated updates.
   *
   * @param {HTMLElement} area - Progress display area
   * @param {string} text - New text to show
   */
  updateProgress(area, text) {
    const lines = area.textContent.trim().split("\n");
    const lastLine = lines[lines.length - 1];

    if (lastLine === "Cancelling...." && text !== "❌ Search Cancelled.") return;

    lines[lines.length - 1] = text;
    area.textContent = lines.join("\n");
  }

  /**
   * Appends a new line of progress to the progress area.
   *
   * @param {HTMLElement} area - Progress display area
   * @param {string} text - Text to append
   */
  appendProgress(area, text) {
    area.textContent += (area.textContent ? "\n" : "") + text;
  }

  // Subclass must implement: additional setup after form load
  onFormLoad() {
    throw new Error("onFormLoad() must be implemented in subclass.");
  }

  // Subclass must implement: cache frequently used form elements
  cacheElements() {
    throw new Error("cacheElements() must be implemented in subclass.");
  }

  // Subclass must implement: validate and return form input as payload
  validateFormInput() {
    throw new Error("validateFormInput() must be implemented in subclass.");
  }

  /**
   * Sends the payload to the WebSocket.
   * Supports sending either File objects (converted to ArrayBuffer)
   * or regular JSON payloads.
   *
   * @param {Object|File} payload
   */
  async handlePayload(payload) {
    debugger;
    const formData = new FormData();

    for (const [key, value] of Object.entries(payload)) {
      formData.append(key, value);
    }

    const res = await fetch(`/api/${this.route}`, {
      method: "POST",
      body: formData,
    });

    return res.json();
  }
}
