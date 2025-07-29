import { BaseFormApp } from "./baseFormApp.js";
import { initFileInput } from "./fileInput.js";

class ReportFormApp extends BaseFormApp {
  constructor() {
    super("report-form", "report");
  }

  // === Initialize any extra JS ===
  onFormLoad() {
    initFileInput();
    this.initRiverListToggle();
  }

  // === Cache frequently used DOM elements ===
  cacheElements() {
    this.elements.fileInputEl = document.getElementById("inputFile");
    this.elements.apiKeyEl = document.getElementById("apiKey");
    this.elements.modelEl = document.getElementById("model");
    this.elements.maxAgeEl = document.getElementById("maxAge");
    this.elements.filterRiversEl = document.getElementById("filterRivers");
    this.elements.riverListEl = document.getElementById("riverList");
    this.elements.crawlDepthEl = document.getElementById("crawlDepth");
    this.elements.tokenLimit = document.getElementById("tokenLimit");
  }

  // === Validate Input ===
  validateFormInput() {
    const apiKey = this.elements.apiKeyEl.value.trim();
    const model = this.elements.modelEl.value.trim();
    const maxAge = parseInt(this.elements.maxAgeEl.value, 10);
    const filterRivers = this.elements.filterRiversEl.checked;
    const riverList = this.elements.riverListEl.value.trim();
    const inputFile = this.elements.fileInputEl.files[0] || null;
    const crawlDepth = parseInt(this.elements.crawlDepthEl.value, 10);
    const tokenLimit = parseInt(this.elements.tokenLimit.value, 10);

    const validForm =
      apiKey &&
      model &&
      !isNaN(maxAge) &&
      (!filterRivers || riverList !== "") &&
      inputFile &&
      !isNaN(crawlDepth) &&
      !isNaN(tokenLimit);

    return validForm
      ? { apiKey, model, maxAge, crawlDepth, tokenLimit, filterRivers, riverList }
      : null;
  }

  initRiverListToggle() {
    const { filterRiversEl, riverListEl } = this.elements;
    const riverListWrapper = document.getElementById("riverListWrapper");

    if (!filterRiversEl || !riverListWrapper || !riverListEl) return;

    // Initial state
    riverListWrapper.classList.toggle("d-none", !filterRiversEl.checked);
    riverListEl.required = filterRiversEl.checked;

    // Listen for changes
    filterRiversEl.addEventListener("change", () => {
      riverListWrapper.classList.toggle("d-none", !filterRiversEl.checked);
      riverListEl.required = filterRiversEl.checked;
    });
  }
}

// Initialize the app
const app = new ReportFormApp();
document.addEventListener("DOMContentLoaded", () => app.showForm());
