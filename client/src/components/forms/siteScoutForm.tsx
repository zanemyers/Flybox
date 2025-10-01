import React from "react";
import BaseForm, {
  type BaseProps,
  type BaseState,
  type Payload,
} from "./components/baseForm";
import FileInput from "./components/fileInput";

/** Component state */
interface State extends BaseState {
  shopReelFile: File | null; // The uploaded ShopReel Excel file
  fishTalesFile: File | null; // The uploaded FishTales starter Excel file
  shopReelError?: string; // Validation error message for ShopReel file input
  fishTalesError?: string; // Validation error message for FishTales file input
}
export default class SiteScoutForm extends BaseForm<BaseProps, State> {
  private readonly fileTypes = [".xls", ".xlsx"];

  /** Default component state */
  protected readonly defaultState: State = {
    jobId: null,
    shopReelFile: null,
    fishTalesFile: null,
    shopReelError: "",
    fishTalesError: "",
  };

  constructor(props: BaseProps) {
    super(props);

    // Preserve jobId from BaseForm and initialize form state
    this.state = {
      ...this.defaultState,
      jobId: this.state.jobId,
    };
  }

  /**
   * Validate input and return payload for API
   */
  validateFormInput(): Payload | null {
    const { shopReelFile, fishTalesFile } = this.state;

    const errors = {
      shopReelError: shopReelFile ? "" : "⚠ Please upload your ShopReel file.",
      fishTalesError: fishTalesFile
        ? ""
        : "⚠ Please upload your FishTales starter file or use the example file.",
    };

    const hasError = Object.values(errors).some((e) => e !== "");

    this.setState(errors);
    if (hasError) return null;

    return { shopReelFile, fishTalesFile };
  }

  // Render the file inputs
  renderFormInput(): React.ReactNode {
    return (
      <>
        <FileInput
          label="Import ShopReel File"
          acceptedTypes={this.fileTypes}
          onSelect={(file) => this.setState({ shopReelFile: file })}
          error={this.state.shopReelError}
        />

        <FileInput
          label="Import FishTales Starter File"
          acceptedTypes={this.fileTypes}
          onSelect={(file) => this.setState({ fishTalesFile: file })}
          error={this.state.fishTalesError}
        />
      </>
    );
  }
}
