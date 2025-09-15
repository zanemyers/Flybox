/**
 * Initialize a single file input component
 * @param {HTMLElement} container - root element of the component
 */
function initSingleFileInput(container) {
  const fileInput = container.querySelector(".file-input");
  const fileWrapper = container.querySelector(".file-input-wrapper");
  const fileNameWrapper = container.querySelector(".selected-file-wrapper");
  const fileNameDisplay = container.querySelector(".selected-file-name");
  const clearButton = container.querySelector(".clear-file-button");

  // If a element is missing return early
  if (
    !fileInput ||
    !fileWrapper ||
    !fileNameWrapper ||
    !fileNameDisplay ||
    !clearButton
  )
    return;

  // Update the UI to show the selected file name,
  const updateDisplay = () => {
    const file = fileInput.files[0];
    if (file) {
      fileNameDisplay.textContent = file.name;
      fileNameWrapper.classList.remove("d-none");
      fileInput.disabled = true;
    } else {
      fileNameDisplay.textContent = "";
      fileNameWrapper.classList.add("d-none");
      fileInput.disabled = false;
    }
  };

  // Allow clicking the wrapper to open the file dialog (only if input is enabled)
  fileWrapper.addEventListener("click", () => {
    if (!fileInput.disabled) fileInput.click();
  });

  fileInput.addEventListener("change", updateDisplay);

  // Remove the file
  clearButton.addEventListener("click", (e) => {
    e.stopPropagation();
    fileInput.value = "";
    updateDisplay();
  });

  // =========================
  // Drag & Drop Support
  // =========================

  // Highlight drop zone on drag enter/over
  ["dragenter", "dragover"].forEach((event) => {
    fileWrapper.addEventListener(event, (e) => {
      if (fileInput.disabled) return; // Ignore if a file is already selected
      e.preventDefault();
      e.stopPropagation();
      fileWrapper.classList.add("border-primary", "bg-white");
    });
  });

  // Remove highlight on drag leave/drop
  ["dragleave", "drop"].forEach((event) => {
    fileWrapper.addEventListener(event, (e) => {
      e.preventDefault();
      e.stopPropagation();
      fileWrapper.classList.remove("border-primary", "bg-white");
    });
  });

  // Handle files dropped onto the file wrapper
  fileWrapper.addEventListener("drop", (e) => {
    if (fileInput.disabled) return;
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith(".xls") || file.name.endsWith(".xlsx"))) {
      fileInput.files = e.dataTransfer.files;
      updateDisplay();
    } else {
      alert("❌ Only .xls and .xlsx files are accepted.");
    }
  });
}

/**
 * Initialize all file input components on the page
 */
export function initFileInput() {
  document.querySelectorAll(".file-input-component").forEach((container) => {
    initSingleFileInput(container);
  });
}

window.initFileInput = initFileInput;
