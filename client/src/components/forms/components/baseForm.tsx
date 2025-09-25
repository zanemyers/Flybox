import React from "react";
import { Form, Button, Col } from "react-bootstrap";

// import { Tooltip } from "bootstrap";
import ProgressPanel from "./progressPanel";

export type Payload = Record<string, any> | string;

export interface BaseProps {
  route: string;
}

export interface BaseState {
  jobId: string | null;
}

export default abstract class BaseForm<
  P extends BaseProps = BaseProps,
  S extends BaseState = BaseState,
> extends React.Component<P, S> {
  protected postRoute: string;
  protected storageKey: string;
  protected abstract readonly defaultState: S;

  protected constructor(props: P) {
    super(props);
    this.postRoute = `/api/${props.route}`;
    this.storageKey = `${props.route}-jobId`;

    this.state = { jobId: localStorage.getItem(this.storageKey) } as S;
    // this.initTooltips();
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

  // Subclass must implement the actual form input JSX
  abstract renderFormInput(): React.ReactNode;

  // Subclass must validate and return payload or null
  abstract validateFormInput(): Payload | null;

  // Arrow function ensures 'this' binding
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

  // Arrow function ensures 'this' binding
  handleClose() {
    localStorage.removeItem(this.storageKey);
    this.setState(this.defaultState as S);
  }

  render() {
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

    return (
      <Col lg={7} className="d-flex">
        <Form
          className="p-4 border rounded bg-white shadow-sm flex-fill d-flex flex-column"
          onSubmit={this.handleSubmit}
        >
          {this.renderFormInput()}
          <Button type="submit" variant="primary" className="mt-auto mx-1">
            Compare
          </Button>
        </Form>
      </Col>
    );
  }
}
