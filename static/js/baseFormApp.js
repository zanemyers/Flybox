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
    this.jobId = null;
    this.files = new Set();
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

      // Send the payload to create the job
      const data = await this.handlePayload(payload);
      if (!data) return;

      // set the job id in local storage & track its progress
      this.jobId = data.jobId;
      localStorage.setItem(`${this.route}-jobId`, this.jobId);
      await this.trackProgress(data.status);
    });
  }

  /**
   * Sends a payload to the create endpoint using multipart/form-data.
   * allowing support for both File objects and standard fields.
   *
   * @param {Object} payload - An object containing form fields and/or File objects.
   * @returns {Promise<Object>} The parsed JSON response from the server.
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
   * Loads the progress partial into the container and sets up
   * the cancel button to allow aborting the current WebSocket task.
   */
  async trackProgress(status) {
    const res = await fetch("/partials/progress");
    document.getElementById("formContainer").innerHTML = await res.text();

    const progressArea = document.getElementById("progressArea");
    const progressButton = document.getElementById("progressButton");

    progressButton.onclick = async () => {
      progressButton.disabled = true;
      this.cleanLocalStorage();
      await fetch(`/api/${this.route}/${this.jobId}/cancel`, { method: "POST" });
    };

    do {
      const res = await fetch(`/api/${this.route}/${this.jobId}/updates`);
      const data = await res.json();

      progressArea.textContent = data.message; // Update the progress
      status = data.status; // Update the status
      this.addDownloadLink(data.files); // if a file is returned auto download it, and add a link if you need to download again
      if (status === "IN_PROGRESS") await new Promise((r) => setTimeout(r, 1000)); // wait 1 sec before trying again
    } while (status === "IN_PROGRESS");

    // Once complete, update button
    progressButton.textContent = "Close";
    progressButton.classList.remove("btn-danger");
    progressButton.classList.add("btn-secondary");
    progressButton.disabled = false;
    progressButton.onclick = () => {
      this.cleanLocalStorage();
      this.showForm();
    };
  }

  addDownloadLink(files) {
    const fileLinksContainer = document.getElementById("fileLinks");

    files.forEach(({ name, buffer }) => {
      // Always create the blob & link
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
        link.click(); // auto download
        this.files.add(name);

        localStorage.setItem(`${this.route}-${this.jobId}-files`, JSON.stringify([...this.files]));
      }
    });
  }

  cleanLocalStorage() {
    localStorage.removeItem(`${this.route}-jobId`);
    localStorage.removeItem(`${this.route}-${this.jobId}-files`);
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
}
