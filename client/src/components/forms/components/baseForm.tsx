import React from "react";
import { Form, Button, Col } from "react-bootstrap";
import ProgressPanel from "./progressPanel";

/**
 * Payload type
 * Can be either a generic key-value object or a string
 */
export type Payload = Record<string, any> | string;

/**
 * Props for BaseForm
 */
export interface BaseProps {
  route: string; // route name used for API endpoint and localStorage key
}

/**
 * State for BaseForm
 */
export interface BaseState {
  jobId: string | null; // current job ID if a task is in progress
}

/**
 * Abstract BaseForm Component
 *
 * Provides shared functionality for forms that submit data to an API
 * and track job progress. Handles:
 * - Job submission via POST request
 * - Storing/retrieving jobId from localStorage
 * - Rendering either the progress panel or the form inputs
 *
 * Subclasses must implement:
 * - `renderFormInput()` to provide form JSX
 * - `validateFormInput()` to validate inputs and return the payload
 */
export default abstract class BaseForm<
  P extends BaseProps = BaseProps,
  S extends BaseState = BaseState,
> extends React.Component<P, S> {
  protected postRoute: string; // API endpoint to submit form data
  protected storageKey: string; // localStorage key for storing jobId
  protected abstract readonly defaultState: S; // Default form state for resetting

  protected constructor(props: P) {
    super(props);

    this.postRoute = `/api/${props.route}`;
    this.storageKey = `${props.route}-jobId`;

    // Initialize jobId from localStorage if available
    this.state = { jobId: localStorage.getItem(this.storageKey) } as S;
  }

  // initTooltips() {
  //   const tooltipList = document.querySelectorAll<HTMLElement>("[title]");
  //
  //   tooltipList.forEach((el) => {
  //     // Clean up old tooltip instance if it exists
  //     const existing = Tooltip.getInstance(el);
  //     if (existing) existing.dispose();
  //
  //     new Tooltip(el);
  //   });
  // }

  /**
   * Subclass must implement this to provide the form JSX
   * @returns React.ReactNode representing form inputs
   */
  abstract renderFormInput(): React.ReactNode;

  /**
   * Subclass must implement this to validate form input
   * @returns Payload object or string to send, or null if validation fails
   */
  abstract validateFormInput(): Payload | null;

  /**
   * Handles form submission
   * Validates input, sends POST request, and stores the jobId
   */
  handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = this.validateFormInput();
    if (!payload) return;

    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) =>
      formData.append(key, value),
    );

    const res = await fetch(this.postRoute, { method: "POST", body: formData });
    const data = await res.json();

    localStorage.setItem(this.storageKey, data.jobId);
    this.setState({ jobId: data.jobId });
  };

  /**
   * Handles closing or resetting the form
   * Removes jobId from localStorage and resets state to default
   */
  handleClose() {
    localStorage.removeItem(this.storageKey);
    this.setState(this.defaultState as S);
  }

  render() {
    // If a job is in progress, show the ProgressPanel
    if (this.state.jobId) {
      return (
        <Col lg={7} className="d-flex">
          <ProgressPanel
            jobId={this.state.jobId}
            route={this.props.route}
            handleClose={this.handleClose.bind(this)}
          />
        </Col>
      );
    }

    // Otherwise, render the form
    return (
      <Col lg={7} className="d-flex">
        <Form
          className="p-4 border rounded bg-white shadow-sm flex-fill d-flex flex-column"
          onSubmit={this.handleSubmit}
        >
          {/* Render subclass-provided form inputs */}
          {this.renderFormInput()}

          {/* Submit button */}
          <Button type="submit" variant="primary" className="mt-auto mx-1">
            Compare
          </Button>
        </Form>
      </Col>
    );
  }
}
