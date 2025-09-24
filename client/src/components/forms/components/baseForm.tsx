import React from "react";
// import { Tooltip } from "bootstrap";
import ProgressPanel from "./progressPanel";

export type Payload = Record<string, any> | string;

export interface BaseProps {
  route: string;
}

export interface BaseState {
  jobId: string | null;
  errorMessage?: string;
}

export default abstract class BaseForm<
  P extends BaseProps = BaseProps,
  S extends BaseState = BaseState,
> extends React.Component<P, S> {
  protected postRoute: string;
  protected storageKey: string;

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
    debugger;
    e.preventDefault();

    const payload = this.validateFormInput();
    if (!payload) return;

    // Clear any previous errors
    this.setState({ errorMessage: undefined });

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
  handleClose = () => {
    localStorage.removeItem(this.storageKey);
    this.setState({ jobId: null });
  };

  render() {
    if (this.state.jobId) {
      return (
        <ProgressPanel
          jobId={this.state.jobId}
          route={this.props.route}
          handleClose={this.handleClose}
        />
      );
    }

    return (
      <div className="col-lg-7 d-flex">
        <form
          className="p-4 border rounded bg-white shadow-sm flex-fill d-flex flex-column"
          onSubmit={this.handleSubmit}
        >
          {this.renderFormInput()}
          <button type="submit" className="btn btn-primary mt-auto mx-1">
            Compare
          </button>
        </form>
      </div>
    );
  }
}
