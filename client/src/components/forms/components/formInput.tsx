import React from "react";

/**
 * Wrapper for individual form inputs
 * Handles label positioning and error display
 */
interface WrapperProps {
  type: "text" | "textarea" | "password" | "number" | "checkbox"; // input type
  id: string; // input id
  label: string; // label text
  error?: string; // optional error message
  children: React.ReactNode; // input element(s)
}

function FormWrapper(props: WrapperProps) {
  const labelEl = <label htmlFor={props.id}>{props.label}</label>;
  return (
    <div className="form-input">
      {props.type !== "checkbox" && labelEl} {/* Label before input for non-checkbox */}
      {props.children}
      {props.type === "checkbox" && labelEl} {/* Label after input for checkbox */}
      {props.error && <div className="form-error">{props.error}</div>} {/* Error display */}
    </div>
  );
}

/**
 * Base properties shared by all inputs
 */
interface BaseInputProps {
  label: string; // label text
  title?: string; // optional tooltip/title
  error?: string; // optional error message
  noWrapper?: boolean; // if true, do not wrap in FormWrapper
}

/**
 * Props for text, password, number inputs
 */
interface TextProps extends BaseInputProps {
  type: "text" | "password" | "number"; // input type
  step?: string; // step attribute for number input
  value: string | number; // current value
  placeholder: string; // input placeholder
  onChange: (value: string) => void; // change handler
}

/**
 * TextInput Component
 */
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
    <FormWrapper type={props.type} id={id} label={props.label} error={props.error}>
      {inputEl}
    </FormWrapper>
  );
}

/**
 * Props for checkbox input
 */
interface CheckedBoxProps extends BaseInputProps {
  checked: boolean; // current checked state
  onChange: (value: boolean) => void; // change handler
}

/**
 * CheckBoxInput Component
 */
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
    <FormWrapper type="checkbox" id={id} label={props.label} error={props.error}>
      {inputEl}
    </FormWrapper>
  );
}

/**
 * Props for textarea input
 */
interface TextAreaProps extends BaseInputProps {
  rows: number; // number of rows for textarea
  value: string; // current value
  placeholder?: string; // optional placeholder
  onChange: (value: string) => void; // change handler
}

/**
 * TextAreaInput Component
 */
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
    <FormWrapper type="textarea" id={id} label={props.label} error={props.error}>
      {inputEl}
    </FormWrapper>
  );
}

/**
 * Props for input group wrapper
 */
interface InputGroupProps {
  label: string; // group label
  children: React.ReactNode; // input elements inside the group
  errors?: (string | undefined)[]; // array of error messages for the group
}

/**
 * FormInputGroup Component
 * Wraps multiple inputs with a shared label and displays multiple errors
 */
export function FormInputGroup(props: InputGroupProps) {
  return (
    <div className="form-input">
      <label className="form-label">{props.label}</label>
      <div className="input-group">{props.children}</div>
      {/* Render all errors below the group */}
      {props.errors?.map((error, i) => (
        <div key={`error-${i}`} className="form-error">
          {error}
        </div>
      ))}
    </div>
  );
}
