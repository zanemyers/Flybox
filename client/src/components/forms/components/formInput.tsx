import React from "react";

interface InputProps {
  label: string;
  type: "number" | "text" | "password";
  value: string | number;
  placeholder?: string;
  title?: string;
  error?: string;
  onChange: (value: string) => void;
  noWrapper?: boolean; // new

  //extra number props
  step?: string;
}

export default function FormInput(props: InputProps) {
  const id = props.label.toLowerCase().replace(/\s+/g, "-");

  const inputEl = (
    <input
      id={id}
      type={props.type}
      className="form-control"
      value={props.value}
      placeholder={props.placeholder}
      title={props.title}
      onChange={(e) => props.onChange(e.target.value)}
      {...(props.type === "number" ? { step: props.step } : {})}
    ></input>
  );

  if (props.noWrapper) return inputEl;

  return (
    <div className="form-input">
      <label htmlFor={id} className="form-label">
        {props.label}
      </label>
      {inputEl}
      {props.error && <div className="form-error">{props.error}</div>}
    </div>
  );
}

interface InputGroupProps {
  label: string;
  children: React.ReactNode;
  errors?: (string | undefined)[]; // array of error messages
}

export function FormInputGroup(props: InputGroupProps) {
  return (
    <div className="form-input">
      <label className="form-label">{props.label}</label>
      <div className="input-group">{props.children}</div>
      {/* Render all errors below the group */}
      {props.errors?.map((error, idx) => (
        <div key={idx} className="form-error">
          {error}
        </div>
      ))}
    </div>
  );
}
