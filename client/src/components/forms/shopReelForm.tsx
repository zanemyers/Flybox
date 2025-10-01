import React from "react";

import BaseForm, {
  type BaseProps,
  type BaseState,
  type Payload,
} from "./components/baseForm";
import FileInput from "./components/fileInput";
import { TextInput, FormInputGroup } from "./components/formInput";
import MapInput from "./components/mapInput";
import Tabs from "../ui/tabs";

import Pin from "@images/location_pin.png";

/** Form field state */
interface FormState {
  file: File | null;
  apiKey: string;
  searchTerm: string;
  latitude: number;
  longitude: number;
  maxResults: number;
}

/** Validation errors */
interface ErrorState {
  fileError?: string;
  apiKeyError?: string;
  searchTermError?: string;
  latitudeError?: string;
  longitudeError?: string;
  maxResultsError?: string;
}

/** Component state */
interface State extends BaseState {
  activeTab: "manual" | "file";
  showMap: boolean;
  form: FormState;
  errors: ErrorState;
}

// Nested state keys helper
type NestedStateKeys = "form" | "errors";

// Validation messages per field
const formErrors: {
  [K in keyof FormState]: { [E in keyof ErrorState]: string };
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

// Tabs for switching between manual input and file import
const tabs = [
  { id: "manual", label: "Manual Input" },
  { id: "file", label: "File Import" },
];

/**
 * ShopReelForm
 *
 * Extends BaseForm to handle either a manual shop search or file upload input
 */
export default class ShopReelForm extends BaseForm<BaseProps, State> {
  /** Default component state */
  protected readonly defaultState: State = {
    jobId: null,
    activeTab: "manual",
    showMap: false,
    form: {
      file: null,
      apiKey: "",
      searchTerm: "Fly Fishing Shops",
      latitude: 44.427963,
      longitude: -110.588455,
      maxResults: 100,
    },
    errors: {},
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
   * Validate the form and return the payload for the API
   */
  validateFormInput(): Payload | null {
    const activeTab = this.state.activeTab;
    let hasError = false;

    for (const [fieldKey, errorObj] of Object.entries(formErrors) as [
      keyof FormState,
      Record<keyof ErrorState, string>,
    ][]) {
      const errorKey = Object.keys(errorObj)[0] as keyof ErrorState;
      const error = errorObj[errorKey];

      // Skip irrelevant fields based on active tab
      if (activeTab === "manual" && fieldKey === "file") continue;
      if (activeTab === "file" && fieldKey !== "file") continue;

      if (this.isFieldValid(fieldKey, this.state.form[fieldKey])) {
        this.updateState("errors", errorKey, "");
      } else {
        hasError = true;
        this.updateState("errors", errorKey, error);
      }
    }

    if (hasError) return null;

    const { file, ...manualFields } = this.state.form;
    return activeTab === "manual" ? manualFields : { file };
  }

  /**
   * Check if a field value is valid
   */
  isFieldValid(fieldKey: keyof FormState, value: any): boolean {
    if (typeof value === "string") return !!value; // Non-empty strings
    if (fieldKey === "file") return !!value; // File must exist

    // Validate number ranges
    if (fieldKey === "maxResults") return value >= 20 && value <= 120;
    if (fieldKey === "latitude") return value >= -90 && value <= 90;
    if (fieldKey === "longitude") return value >= -180 && value <= 180;

    return true;
  }

  /**
   *  Update nested state for 'form' or 'errors'
   */
  updateState<K extends keyof State[T], T extends NestedStateKeys>(
    stateKey: T,
    key: K,
    value: State[T][K],
  ) {
    this.setState((prevState) => ({
      ...prevState,
      [stateKey]: { ...prevState[stateKey], [key]: value },
    }));
  }

  /**
   * Render form input elements based on active tab
   */
  renderFormInput(): React.ReactNode {
    return (
      <div className="form-body">
        {/* Tab navigation */}
        <Tabs
          tabs={tabs}
          activeTab={this.state.activeTab}
          onChange={(tabId) =>
            this.setState({ activeTab: tabId as "manual" | "file" })
          }
        />

        {/* Tab content */}
        <div className="tab-content">
          {/* Manual Input */}
          {this.state.activeTab === "manual" && (
            <div className="tab-pane show active" role="tabpanel">
              <TextInput
                type="password"
                label="SerpAPI Key"
                placeholder="API Key"
                title="Your private SerpAPI key"
                value={this.state.form.apiKey}
                onChange={(val) => this.updateState("form", "apiKey", val)}
                error={this.state.errors.apiKeyError}
              />

              <TextInput
                type="text"
                label="Search Term"
                placeholder="e.g. Fly Fishing Shops"
                title="Specify the business or shop type"
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
                <TextInput
                  type="number"
                  label="Latitude"
                  value={this.state.form.latitude}
                  placeholder="Latitude"
                  title="Latitude in decimal degrees"
                  step="0.000001"
                  onChange={(val) =>
                    this.updateState("form", "latitude", parseFloat(val))
                  }
                  noWrapper
                />
                <TextInput
                  type="number"
                  label="Longitude"
                  placeholder="Longitude"
                  title="Longitude in decimal degrees"
                  step="0.000001"
                  value={this.state.form.longitude}
                  onChange={(val) =>
                    this.updateState("form", "longitude", parseFloat(val))
                  }
                  noWrapper
                />
                <button
                  type="button"
                  className="input-group-text"
                  onClick={() => this.setState({ showMap: true })}
                >
                  <img
                    src={Pin}
                    alt="location pin"
                    style={{ width: 20, height: 20 }}
                  />
                </button>

                <MapInput
                  show={this.state.showMap}
                  onClose={() => this.setState({ showMap: false })}
                  latitude={this.state.form.latitude}
                  longitude={this.state.form.longitude}
                  onChange={(newLat, newLng) => {
                    this.updateState("form", "latitude", newLat);
                    this.updateState("form", "longitude", newLng);
                  }}
                />
              </FormInputGroup>

              <TextInput
                type="number"
                label="Max Results"
                placeholder="e.g. 100"
                title="Maximum number of results"
                step="20"
                value={this.state.form.maxResults}
                onChange={(val) =>
                  this.updateState("form", "maxResults", parseInt(val, 10))
                }
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
                onSelect={(file) => this.updateState("form", "file", file)}
                error={this.state.errors.fileError}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}
