import React from "react";
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
  }

  // Subclass must implement the actual form input JSX
  abstract renderFormInput(): React.ReactNode;

  // Subclass must validate and return payload or null
  abstract validateFormInput(): Payload | null;

  // Arrow function ensures 'this' binding
  handleSubmit = async (e: React.FormEvent) => {
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

  protected cleanJob() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(`${this.storageKey}-files`);
    this.setState({ jobId: null });
  }

  // Arrow function ensures 'this' binding
  // Subclass should override this to clean additional state
  handleClose = () => {
    this.cleanJob();
  };

  render() {
    if (this.state.jobId) {
      return (
        <ProgressPanel
          jobId={this.state.jobId}
          route={this.props.route}
          close={this.handleClose}
        />
      );
    }

    return (
      <form
        className="p-4 border rounded bg-white shadow-sm flex-fill d-flex flex-column"
        onSubmit={this.handleSubmit}
      >
        {this.renderFormInput()}
        <button type="submit" className="btn btn-primary mt-auto mx-1">
          Compare
        </button>
      </form>
    );
  }
}
