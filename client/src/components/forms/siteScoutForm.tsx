import React from "react";

import BaseForm, {
  type BaseProps,
  type BaseState,
  type Payload,
} from "./components/baseForm";
import FileInput from "./components/fileInput";

interface State extends BaseState {
  shopReelFile: File | null;
  fishTalesFile: File | null;
  shopReelError?: string;
  fishTalesError?: string;
}

export default class SiteScoutForm extends BaseForm<BaseProps, State> {
  private readonly fileTypes = [".xls", ".xlsx"];

  constructor(props: BaseProps) {
    super(props);

    // Preserve jobId from BaseForm
    this.state = {
      ...this.state,
      shopReelFile: null,
      fishTalesFile: null,
    };
  }

  // Validate input and return payload for API
  validateFormInput(): Payload | string | null {
    let hasError = false;
    const { shopReelFile, fishTalesFile } = this.state;

    if (!shopReelFile) {
      hasError = true;
      this.setState({ shopReelError: "⚠ Please upload your ShopReel file." });
    }
    if (!fishTalesFile) {
      hasError = true;
      this.setState({
        fishTalesError:
          "⚠ Please upload your FishTales starter file or use the example file.",
      });
    }

    if (hasError) return null;

    return { shopReelFile, fishTalesFile };
  }

  // Extend handleClose to clear child-specific state
  handleClose = () => {
    super.cleanJob();
    this.setState({ shopReelFile: null, fishTalesFile: null });
  };

  // Render the file inputs
  renderFormInput(): React.ReactNode {
    return (
      <>
        <FileInput
          label="Import ShopReel File"
          acceptedTypes={this.fileTypes}
          onSelect={(file) => this.setState({ shopReelFile: file })}
        >
          {this.state.shopReelError && (
            <div className="form-error">{this.state.shopReelError}</div>
          )}
        </FileInput>

        <FileInput
          label="Import FishTales Starter File"
          acceptedTypes={this.fileTypes}
          onSelect={(file) => this.setState({ fishTalesFile: file })}
        >
          {this.state.fishTalesError && (
            <div className="form-error">{this.state.fishTalesError}</div>
          )}
        </FileInput>
      </>
    );
  }
}
