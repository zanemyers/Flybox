import { initFileInput } from "./fileInput.js";
import { BaseFormApp } from "./baseFormApp.js";

class ShopFormApp extends BaseFormApp {
  constructor() {
    super("shop-form", "shop");
  }

  onFormLoad() {
    this.setupTabs();
    initFileInput();
  }

  // === Cache frequently used DOM elements ===
  cacheElements() {
    this.elements.fileInputEl = document.getElementById("inputFile");
    this.elements.apiKeyEl = document.getElementById("apiKey");
    this.elements.queryEl = document.getElementById("query");
    this.elements.latEl = document.getElementById("latitude");
    this.elements.lngEl = document.getElementById("longitude");
    this.elements.maxResultsEl = document.getElementById("maxResults");
    this.elements.manualTab = document.getElementById("manual-tab");
    this.elements.fileTab = document.getElementById("file-tab");
  }

  // === Validate Inputs ===
  validateFormInput() {
    const manualTabActive = document.getElementById("manualInputs").classList.contains("show");

    if (manualTabActive) {
      const apiKey = this.elements.apiKeyEl.value.trim();
      const query = this.elements.queryEl.value.trim();
      const lat = parseFloat(this.elements.latEl.value);
      const lng = parseFloat(this.elements.lngEl.value);
      const maxResults = parseInt(this.elements.maxResultsEl.value, 10);

      const hasManualInputs = apiKey && query && !isNaN(lat) && !isNaN(lng) && !isNaN(maxResults);

      return hasManualInputs ? { apiKey, query, lat, lng, maxResults } : null;
    } else {
      return this.elements.fileInputEl.files[0] || null;
    }
  }

  // === Tab Logic ===
  setupTabs() {
    const manualFields = [
      this.elements.apiKeyEl,
      this.elements.queryEl,
      this.elements.latEl,
      this.elements.lngEl,
      this.elements.maxResultsEl,
    ];

    manualFields.forEach((f) => f.setAttribute("required", "required"));
    this.elements.fileInputEl.removeAttribute("required");

    this.elements.manualTab.addEventListener("click", () => {
      manualFields.forEach((f) => f.setAttribute("required", "required"));
      this.elements.fileInputEl.removeAttribute("required");
    });

    this.elements.fileTab.addEventListener("click", () => {
      manualFields.forEach((f) => f.removeAttribute("required"));
      this.elements.fileInputEl.setAttribute("required", "required");
    });
  }
}

// Initialize the app
const app = new ShopFormApp();
document.addEventListener("DOMContentLoaded", () => app.showForm());
