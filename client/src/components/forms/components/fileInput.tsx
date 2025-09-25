import React, { useRef, useState } from "react";
import { Form, Button } from "react-bootstrap";

import fileInput from "@images/upload.png";

interface Props {
  label: string;
  acceptedTypes: string[];
  error?: string;
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
    <Form.Group className="form-input file-input-component">
      <Form.Label>{props.label}</Form.Label>

      {/* File drop / click wrapper */}
      <div
        className={`file-input-wrapper border rounded bg-light py-3 flex-fill ${
          isDragging ? "border-primary bg-white" : ""
        }`}
        onClick={() => !file && inputRef.current?.click()}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrag}
        style={{ transition: "all 0.2s ease" }}
      >
        <img src={fileInput} alt="Upload Icon" />
        <p className="mb-2">Drag & Drop or Click to Select File</p>

        {/* Selected file display */}
        {file && (
          <div className="selected-file-wrapper mb-2 fw-bold g-2">
            <Button
              size="sm"
              variant="outline-danger"
              className="clear-file-button"
              aria-label="Remove File"
              onClick={handleClear}
            >
              &times;
            </Button>
            <span className="selected-file-name ms-2">{file.name}</span>
          </div>
        )}

        {/* Accepted types note */}
        <p className="text-muted small">
          Accepted file types:{" "}
          {formatAcceptedTypes(props.acceptedTypes as [string, ...string[]])}.
        </p>
      </div>

      {/* Hidden file input */}
      <Form.Control
        ref={inputRef}
        type="file"
        className="d-none"
        accept={props.acceptedTypes.join(",")}
        onChange={handleFileChange}
        disabled={!!file}
        isInvalid={!!props.error}
      />

      <Form.Control.Feedback type="invalid">
        {props.error}
      </Form.Control.Feedback>
    </Form.Group>
  );
}
