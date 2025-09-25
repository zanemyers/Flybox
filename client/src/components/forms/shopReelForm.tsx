import React from "react";

import BaseForm, {
  type BaseProps,
  type BaseState,
  type Payload,
} from "./components/baseForm";
import FileInput from "./components/fileInput";
import FormInput, { FormInputGroup } from "./components/formInput";

interface FormState {
  file: File | null;
  apiKey: string;
  searchTerm: string;
  latitude: string;
  longitude: string;
  maxResults: string;
}

interface ErrorState {
  fileError?: string;
  apiKeyError?: string;
  searchTermError?: string;
  latitudeError?: string;
  longitudeError?: string;
  maxResultsError?: string;
}

interface State extends BaseState {
  activeTab: "manual" | "file";
  form: FormState;
  errors: ErrorState;
}

type NestedStateKeys = "form" | "errors";
const formErrors: {
  [K in keyof FormState]: {
    [E in keyof ErrorState]: string;
  };
} = {
  file: { fileError: "⚠ Please upload a file." },
  apiKey: { apiKeyError: "⚠ Please enter an API key." },
  searchTerm: { searchTermError: "⚠ Please enter a search term." },
  latitude: {
    latitudeError: "⚠ Please enter a latitude value between -90 and 90.",
  },
  longitude: {
    longitudeError: "⚠ Please enter a longitude value between -180 and 180.",
  },
  maxResults: {
    maxResultsError:
      "⚠ Please set a maximum number of results between 20 and 120.",
  },
};

export default class ShopReelForm extends BaseForm<BaseProps, State> {
  protected readonly defaultState: State = {
    jobId: null,
    activeTab: "manual",
    form: {
      file: null,
      apiKey: "",
      searchTerm: "Fly Fishing Shops",
      latitude: "44.427963",
      longitude: "-110.588455",
      maxResults: "100",
    },
    errors: {},
  };

  constructor(props: BaseProps) {
    super(props);

    // Preserve jobId from BaseForm
    this.state = {
      ...this.defaultState,
      jobId: this.state.jobId,
    };
  }

  // Validate input and return payload for API
  validateFormInput(): Payload | null {
    debugger;
    const activeTab = this.state.activeTab;
    let hasError = false;

    for (const [fieldKey, errorObj] of Object.entries(formErrors) as [
      keyof FormState,
      Record<keyof ErrorState, string>,
    ][]) {
      const errorKey = Object.keys(errorObj)[0] as keyof ErrorState;
      const error = errorObj[errorKey];
      // Skip file check if in manual tab, skip other fields if in file tab
      if (activeTab === "manual" && fieldKey === "file") continue;
      if (activeTab === "file" && fieldKey !== "file") continue;

      if (this.isFieldInvalid(fieldKey, this.state.form[fieldKey])) {
        hasError = true;
        this.updateState("errors", errorKey, error);
      } else {
        this.updateState("errors", errorKey, "");
      }
    }

    if (hasError) return null;

    const { file, ...fields } = this.state.form;
    return activeTab === "manual" ? fields : { file };
  }

  isFieldInvalid(fieldKey: keyof FormState, value: any): boolean {
    if (typeof value === "string") return !value;
    if (fieldKey === "file") return !value;

    // Validate number inputs
    if (fieldKey === "maxResults") {
      const val = parseInt(value, 10);
      return val < 20 || val > 120;
    }
    if (fieldKey === "latitude") {
      const val = parseFloat(value);
      return val < -90 || val > 90;
    }
    if (fieldKey === "longitude") {
      const val = parseFloat(value);
      return val < -180 || val > 180;
    }
    return false;
  }

  updateState<K extends keyof State[T], T extends NestedStateKeys>(
    stateKey: T,
    key: K,
    value: State[T][K],
  ) {
    this.setState((prevState) => ({
      ...prevState,
      [stateKey]: {
        ...prevState[stateKey],
        [key]: value,
      },
    }));
  }

  // Render the file inputs
  renderFormInput(): React.ReactNode {
    return (
      <div className="form-body">
        {/* Tab navigation */}
        <ul className="nav nav-tabs mb-3" role="tablist">
          <li className="nav-item">
            <button
              className={`nav-link ${this.state.activeTab === "manual" ? "active" : ""}`}
              type="button"
              onClick={() => this.setState({ activeTab: "manual" })}
            >
              Manual Input
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${this.state.activeTab === "file" ? "active" : ""}`}
              type="button"
              onClick={() => this.setState({ activeTab: "file" })}
            >
              File Import
            </button>
          </li>
        </ul>

        {/* Tab content */}
        <div className="tab-content">
          {/* Manual Input */}
          {this.state.activeTab === "manual" && (
            <div className="tab-pane show active" role="tabpanel">
              <FormInput
                type="password"
                label="SerpAPI Key"
                placeholder="API Key"
                title="Your private SerpAPI key"
                value={this.state.form.apiKey}
                onChange={(val) => this.updateState("form", "apiKey", val)}
                error={this.state.errors.apiKeyError}
              />

              <FormInput
                type="text"
                label="Search Term"
                placeholder="e.g. Fly Fishing Shops"
                title="Specify the business or shop typ"
                value={this.state.form.searchTerm}
                onChange={(val) => this.updateState("form", "searchTerm", val)}
                error={this.state.errors.searchTermError}
              />

              <FormInputGroup
                label="Location"
                errors={[
                  this.state.errors.latitudeError,
                  this.state.errors.longitudeError,
                ].filter(Boolean)}
              >
                <FormInput
                  type="number"
                  label="Latitude"
                  value={this.state.form.latitude}
                  placeholder="Latitude"
                  title="Latitude in decimal degrees"
                  step="0.000001"
                  onChange={(val) => this.updateState("form", "latitude", val)}
                  noWrapper
                />
                <FormInput
                  type="number"
                  label="Longitude"
                  placeholder="Longitude"
                  title="Longitude in decimal degrees"
                  step="0.000001"
                  value={this.state.form.longitude}
                  onChange={(val) => this.updateState("form", "longitude", val)}
                  noWrapper
                />
                {/*  TODO: Fix this for the location picker */}
                {/*<button*/}
                {/*  type="button"*/}
                {/*  className="input-group-text location-picker"*/}
                {/*  title="Open map to select location"*/}
                {/*  data-bs-placement="top"*/}
                {/*  data-bs-toggle="modal"*/}
                {/*  data-bs-target="#mapModal"*/}
                {/*>*/}
                {/*  <img*/}
                {/*    src="/assets/images/location_pin.png"*/}
                {/*    alt="Location Pin"*/}
                {/*    style={{ height: 1 }}*/}
                {/*  />*/}
                {/*</button>*/}
              </FormInputGroup>

              <FormInput
                type="number"
                label="Max Results"
                placeholder="e.g. 100"
                title="Maximum number of results"
                step="20"
                value={this.state.form.maxResults}
                onChange={(val) => this.updateState("form", "maxResults", val)}
                error={this.state.errors.maxResultsError}
              />
            </div>
          )}

          {/* File Import */}
          {this.state.activeTab === "file" && (
            <div className="tab-pane show active" role="tabpanel">
              <FileInput
                label="Import Excel File"
                acceptedTypes={[".xls", ".xlsx"]}
                error={this.state.errors.fileError}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}
