import React, { useRef, useState } from "react";

import fileInput from "@images/upload.png";

interface Props {
  label: string;
  acceptedTypes: string[];
  children?: React.ReactNode;
  onSelect?: (file: File | null) => void; // callback to parent
}

export default function FileInput(props: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Format accepted types with "and"
  function formatAcceptedTypes(types: [string, ...string[]]) {
    if (!types || types.length === 0)
      throw new Error("You must pass at least one file type");
    if (types.length === 1) return types[0];
    return types.slice(0, -1).join(", ") + " and " + types[types.length - 1];
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selected = event.target.files[0];
      setFile(selected);
      props.onSelect?.(selected);
    }
  };

  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent wrapper click
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = ""; // reset input
      inputRef.current.disabled = false;
    }
    props.onSelect?.(null);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    switch (e.type) {
      case "dragenter":
      case "dragover":
        setIsDragging(true);
        break;

      case "dragleave":
        setIsDragging(false);
        break;

      case "drop":
        setIsDragging(false);
        if (e.dataTransfer?.files?.length) {
          const droppedFile = e.dataTransfer.files[0];
          const isValid = props.acceptedTypes.some((type) =>
            droppedFile.name.toLowerCase().endsWith(type.toLowerCase()),
          );
          if (isValid) {
            setFile(droppedFile);
            props.onSelect?.(droppedFile); // notify parent
          } else {
            alert(
              `❌ Only these file types are accepted: ${props.acceptedTypes.join(
                ", ",
              )}`,
            );
          }
        }
        break;
    }
  };

  return (
    <div className="form-input file-input-component">
      {/* Label */}
      <label className="form-label">{props.label}</label>

      {/* File drop / click wrapper */}
      <div
        className={`file-input-wrapper border rounded bg-light py-3 flex-fill ${
          isDragging ? "border-primary bg-white" : ""
        }`}
        onClick={() => {
          if (!file) inputRef.current?.click();
        }}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrag}
        style={{ transition: "all 0.2s ease" }} // optional smooth highlight
      >
        <img src={fileInput} alt="Upload Icon" />
        <p className="mb-2">Drag & Drop or Click to Select File</p>

        {/* Selected file display */}
        {file && (
          <div className="selected-file-wrapper mb-2 fw-bold g-2">
            <button
              type="button"
              className="clear-file-button btn btn-outline-danger"
              aria-label="Remove File"
              onClick={handleClear}
            >
              &times;
            </button>
            <span className="selected-file-name ms-2">{file.name}</span>
          </div>
        )}

        {/* Accepted types note */}
        <p className="text-muted small">
          Accepted file types:{" "}
          {formatAcceptedTypes(props.acceptedTypes as [string, ...string[]])}.
        </p>
      </div>
      {props.children}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        className="form-control d-none file-input"
        type="file"
        accept={props.acceptedTypes.join(",")}
        onChange={handleFileChange}
        disabled={!!file}
      />
    </div>
  );
}
