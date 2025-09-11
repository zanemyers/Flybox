import { initTooltips } from "./tooltip.js";

/**
 * Base class for client-side form applications that handle:
 * - Form rendering and validation
 * - Long-running jobs via API endpoints
 * - Progress tracking and file downloads
 *
 * Subclasses must implement methods for form-specific behavior:
 * - onFormLoad()
 * - cacheElements()
 * - validateFormInput()
 */
export class BaseFormApp {
  /**
   * @param {string} formPartial - The EJS partial to load for the form
   * @param {string} route - The API route to hit for job creation and updates
   */
  constructor(formPartial, route) {
    this.elements = {}; // Cached DOM elements for efficiency
    this.formPartial = formPartial;
    this.route = route;
    this.jobId = null; // Current job ID being tracked
    this.files = new Set(); // Tracks already auto-downloaded files
  }

  /**
   * Loads the form partial into the container, initializes tooltips,
   * caches commonly used elements, and sets up form submission handling.
   */
  async showForm() {
    const res = await fetch(`partials/${this.formPartial}`);
    document.getElementById("formContainer").innerHTML = await res.text();
    initTooltips();
    this.cacheElements();
    this.onFormLoad(); // Subclass-specific form setup
    this.handleFormSubmit();
  }

  /**
   * Sets up the form submission listener.
   * - Validates input
   * - Sends payload to server
   * - Tracks job progress if successful
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

      // Send payload to API and get job info
      const data = await this.handlePayload(payload);
      if (!data) return;

      // Track job progress and store jobId locally
      this.jobId = data.jobId;
      localStorage.setItem(`${this.route}-jobId`, this.jobId);
      await this.trackProgress(data.status);
    });
  }

  /**
   * Sends a payload to the create endpoint using multipart/form-data.
   * Supports both File objects and standard form fields.
   *
   * @param {Object} payload - Object containing form fields and/or File objects
   * @returns {Promise<Object>} Parsed JSON response from the server
   */
  async handlePayload(payload) {
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

  /**
   * Displays job progress in the UI and handles auto-downloading of returned files.
   * Updates the cancel/close button behavior based on job status.
   *
   * @param {string} status - Initial status of the job ("IN_PROGRESS" or "COMPLETED")
   */
  async trackProgress(status) {
    const res = await fetch("/partials/progress");
    document.getElementById("formContainer").innerHTML = await res.text();

    const progressArea = document.getElementById("progressArea");
    const progressButton = document.getElementById("progressButton");

    // Handle cancel button click
    progressButton.onclick = async () => {
      progressButton.disabled = true;
      this.cleanLocalStorage();
      await fetch(`/api/${this.route}/${this.jobId}/cancel`, { method: "POST" });
    };

    // Poll the server until job completes
    do {
      const res = await fetch(`/api/${this.route}/${this.jobId}/updates`);
      const data = await res.json();

      progressArea.textContent = data.message; // Update progress messages
      status = data.status; // Update job status
      this.addDownloadLink(data.files); // Download new files, add links

      if (status === "IN_PROGRESS") {
        await new Promise((r) => setTimeout(r, 1000)); // Wait 1 second before next poll
      }
    } while (status === "IN_PROGRESS");

    // Update button to allow closing the progress view
    progressButton.textContent = "Close";
    progressButton.classList.remove("btn-danger");
    progressButton.classList.add("btn-secondary");
    progressButton.disabled = false;
    progressButton.onclick = () => {
      this.cleanLocalStorage();
      this.showForm();
    };
  }

  /**
   * Adds links for downloaded files to the DOM and auto-downloads
   * files that haven’t already been processed.
   *
   * @param {Array<{name: string, buffer: string}>} files - Array of files returned from server
   */
  addDownloadLink(files) {
    const fileLinksContainer = document.getElementById("fileLinks");

    files.forEach(({ name, buffer }) => {
      // Always create the blob and link
      const blob = new Blob([Uint8Array.from(atob(buffer), (c) => c.charCodeAt(0))]);
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = name;
      link.textContent = name;
      link.classList.add("d-block", "mb-2");

      fileLinksContainer.appendChild(link);

      // Auto-download only if not already processed
      if (!this.files.has(name)) {
        link.click();
        this.files.add(name);

        // Persist downloaded file names in localStorage
        localStorage.setItem(`${this.route}-${this.jobId}-files`, JSON.stringify([...this.files]));
      }
    });
  }

  /**
   * Clears stored jobId and downloaded file information from localStorage.
   */
  cleanLocalStorage() {
    localStorage.removeItem(`${this.route}-jobId`);
    localStorage.removeItem(`${this.route}-${this.jobId}-files`);
  }

  // ------------------------------
  // Subclass must implement these
  // ------------------------------

  /**
   * Additional form setup after the partial is loaded.
   * e.g., attach extra event listeners, populate selects.
   */
  onFormLoad() {
    throw new Error("onFormLoad() must be implemented in subclass.");
  }

  /**
   * Cache frequently accessed form elements to avoid repeated DOM queries.
   * e.g., this.elements.submitButton = document.getElementById("submit");
   */
  cacheElements() {
    throw new Error("cacheElements() must be implemented in subclass.");
  }

  /**
   * Validate form input and return a payload object for submission.
   * Return null/false if validation fails.
   *
   * @returns {Object|null} Validated payload
   */
  validateFormInput() {
    throw new Error("validateFormInput() must be implemented in subclass.");
  }
}
