import React from "react";

interface WrapperProps {
  type: "text" | "textarea" | "password" | "number" | "checkbox";
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}

function FormWrapper(props: WrapperProps) {
  const labelEl = <label htmlFor={props.id}>{props.label}</label>;
  return (
    <div className="form-input">
      {props.type !== "checkbox" && labelEl}
      {props.children}
      {props.type === "checkbox" && labelEl}
      {props.error && <div className="form-error">{props.error}</div>}
    </div>
  );
}

interface BaseInputProps {
  label: string;
  title?: string;
  error?: string;
  noWrapper?: boolean;
}

interface TextProps extends BaseInputProps {
  type: "text" | "password" | "number";
  step?: string;
  value: string | number;
  placeholder: string;
  onChange: (value: string) => void;
}

export function TextInput(props: TextProps) {
  const id = props.label.toLowerCase().replace(/\s+/g, "-");

  const inputEl = (
    <input
      id={id}
      type={props.type}
      className="form-control"
      placeholder={props.placeholder}
      title={props.title}
      step={props.type === "number" ? props.step : undefined}
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
    />
  );

  if (props.noWrapper) return inputEl;
  return (
    <FormWrapper
      type={props.type}
      id={id}
      label={props.label}
      error={props.error}
    >
      {inputEl}
    </FormWrapper>
  );
}

interface CheckedBoxProps extends BaseInputProps {
  checked: boolean;
  onChange: (value: boolean) => void;
}

export function CheckBoxInput(props: CheckedBoxProps) {
  const id = props.label.toLowerCase().replace(/\s+/g, "-");

  const inputEl = (
    <input
      id={id}
      type="checkbox"
      className="form-check-input"
      title={props.title}
      checked={props.checked}
      onChange={(e) => props.onChange(e.target.checked)}
    />
  );

  if (props.noWrapper) return inputEl;
  return (
    <FormWrapper
      type="checkbox"
      id={id}
      label={props.label}
      error={props.error}
    >
      {inputEl}
    </FormWrapper>
  );
}

interface TextAreaProps extends BaseInputProps {
  rows: number;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export function TextAreaInput(props: TextAreaProps) {
  const id = props.label.toLowerCase().replace(/\s+/g, "-");

  const inputEl = (
    <textarea
      className="form-control"
      id={id}
      placeholder={props.placeholder}
      title={props.title}
      rows={props.rows}
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
    />
  );

  if (props.noWrapper) return inputEl;
  return (
    <FormWrapper
      type="textarea"
      id={id}
      label={props.label}
      error={props.error}
    >
      {inputEl}
    </FormWrapper>
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
