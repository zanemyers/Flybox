import { initTooltips } from "./tooltip.js";

export class BaseFormApp {
  constructor(formPartial, socketName) {
    this.socket = null;
    this.elements = {};
    this.formPartial = formPartial;
    this.socketName = socketName;
  }

  async showForm() {
    const res = await fetch(`partials/${this.formPartial}`);
    document.getElementById("formContainer").innerHTML = await res.text();
    initTooltips();
    this.cacheElements(); // common elements used in multiple class methods
    this.onFormLoad(); // any extra elements to load when the form is initialized.
    this.handleFormSubmit();
  }

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

      if (this.socket && this.socket.readyState === WebSocket.OPEN) this.socket.close();
      this.socket = new WebSocket(`ws://localhost:3000/ws/${this.socketName}`);

      this.socket.onopen = () => {
        if (payload instanceof File) {
          const reader = new FileReader();
          reader.onload = () => this.socket.send(reader.result);
          reader.readAsArrayBuffer(payload);
        } else {
          this.socket.send(JSON.stringify(payload));
        }
      };

      let pendingFilename = "download.xlsx";
      this.socket.binaryType = "arraybuffer";
      this.socket.onmessage = (event) => {
        if (typeof event.data === "string") {
          const progressArea = document.getElementById("progressArea");
          if (!progressArea) return;

          const message = event.data;
          if (message === "Cancelled") {
            this.updateProgress(progressArea, "❌Search Cancelled.");
            this.socket.close();
            return;
          }

          if (message.startsWith("DOWNLOAD:")) {
            // Save the filename for the upcoming file
            pendingFilename = message.replace("DOWNLOAD:", "").trim();
            return;
          }

          message.startsWith("STATUS:")
            ? this.updateProgress(progressArea, message.replace("STATUS:", "").trim())
            : this.appendProgress(progressArea, message.trim());
        } else {
          // Binary message — Excel file buffer
          const blob = new Blob([event.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          const url = URL.createObjectURL(blob);

          const a = document.createElement("a");
          a.href = url;
          a.download = pendingFilename;
          a.click();
          URL.revokeObjectURL(url);
        }
      };

      this.socket.onclose = () => {
        this.socket = null;

        const progressButton = document.getElementById("progressButton");
        if (!progressButton) return;

        progressButton.textContent = "Close";
        progressButton.classList.remove("btn-danger");
        progressButton.classList.add("btn-secondary");
        progressButton.disabled = false;

        progressButton.onclick = () => {
          this.showForm();
        };
      };

      this.socket.onerror = () => {
        alert("❌ WebSocket error.");
        this.socket.close();
      };
    });
  }

  updateProgress(area, text) {
    const lines = area.textContent.trim().split("\n");
    const lastLine = lines[lines.length - 1];

    if (lastLine === "Cancelling...." && text !== "Cancelled") return;

    lines[lines.length - 1] = text;
    area.textContent = lines.join("\n");
  }

  appendProgress(area, text) {
    area.textContent += (area.textContent ? "\n" : "") + text;
  }

  onFormLoad() {} // override
  cacheElements() {} // override
  validateFormInput() {} // override
}
