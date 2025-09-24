import React from "react";

import BaseForm, {
  type BaseProps,
  type BaseState,
  type Payload,
} from "./components/baseForm";
import FileInput from "./components/fileInput";

interface State extends BaseState {
  activeTab: "manual" | "file";
  file: File | null;
  apiKey: string;
  searchTerm: string;
  latitude: number;
  longitude: number;
  maxResults: number;

  fileError?: string;
  apiKeyError?: string;
  searchTermError?: string;
  latitudeError?: string;
  longitudeError?: string;
  maxResultsError?: string;
}

const errorMap = {
  file: { fileError: "" },
  apiKey: { apiKeyError: "" },
  searchTerm: { searchTermError: "" },
  latitude: { latitudeError: "" },
  longitude: { longitudeError: "" },
  maxResults: { maxResultsError: "" },
};

export default class ShopReelForm extends BaseForm<BaseProps, State> {
  constructor(props: BaseProps) {
    super(props);

    // Preserve jobId from BaseForm
    this.state = {
      ...this.state,
      activeTab: "manual",
      file: null,
      apiKey: "",
      searchTerm: "Fly Fishing Shops",
      latitude: 44.427963,
      longitude: -110.588455,
      maxResults: 100,
    };
  }

  // Validate input and return payload for API
  validateFormInput(): Payload | null {
    const {
      activeTab,
      file,
      apiKey,
      searchTerm,
      latitude,
      longitude,
      maxResults,
    } = this.state;

    const newErrors: Pick<
      State,
      | "fileError"
      | "apiKeyError"
      | "searchTermError"
      | "latitudeError"
      | "longitudeError"
      | "maxResultsError"
    > = {
      fileError: "",
      apiKeyError: "",
      searchTermError: "",
      latitudeError: "",
      longitudeError: "",
      maxResultsError: "",
    };

    let hasError = false;

    if (activeTab === "manual") {
      if (!apiKey) {
        hasError = true;
        newErrors.apiKeyError = "⚠ Please enter an API key.";
      }
      if (!searchTerm) {
        hasError = true;
        newErrors.searchTermError = "⚠ Please enter a search term.";
      }
      if (!latitude) {
        hasError = true;
        newErrors.latitudeError = "⚠ Please enter a latitude.";
      }
      if (!longitude) {
        hasError = true;
        newErrors.longitudeError = "⚠ Please enter a longitude.";
      }
      if (!maxResults) {
        hasError = true;
        newErrors.maxResultsError =
          "⚠ Please set a maximum number of results.";
      }
    } else {
      if (!file) {
        hasError = true;
        newErrors.fileError = "⚠ Please upload a file.";
      }
    }

    if (hasError) {
      this.setState(newErrors);
      return null;
    }

    return activeTab === "manual"
      ? { apiKey, searchTerm, latitude, longitude, maxResults }
      : { file };
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
              <div className="form-input">
                <label htmlFor="apiKey" className="form-label">
                  SerpAPI Key
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="apiKey"
                  placeholder="API key"
                  title="Your private SerpAPI key"
                  value={this.state.apiKey}
                  onChange={(e) => this.setState({ apiKey: e.target.value })}
                />
                {this.state.apiKeyError && (
                  <div className="form-error">{this.state.apiKeyError}</div>
                )}
              </div>

              {/* Search Term */}
              <div className="form-input">
                <label htmlFor="query" className="form-label">
                  Search Term
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="query"
                  placeholder="e.g. Fly Fishing Shops"
                  title="Specify the business or shop type"
                  value={this.state.searchTerm}
                  onChange={(e) =>
                    this.setState({ searchTerm: e.target.value })
                  }
                />
                {this.state.searchTermError && (
                  <div className="form-error">{this.state.searchTermError}</div>
                )}
              </div>

              {/* Location */}
              <div className="form-input">
                <label className="form-label">Location</label>
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control"
                    id="latitude"
                    step="0.000001"
                    min="-90"
                    max="90"
                    placeholder="Latitude"
                    title="Latitude in decimal degrees"
                    value={this.state.latitude}
                    onChange={(e) =>
                      this.setState({ latitude: parseFloat(e.target.value) })
                    }
                  />
                  <input
                    type="number"
                    className="form-control"
                    id="longitude"
                    step="0.000001"
                    min="-180"
                    max="180"
                    placeholder="Longitude"
                    title="Longitude in decimal degrees"
                    value={this.state.longitude}
                    onChange={(e) =>
                      this.setState({ longitude: parseFloat(e.target.value) })
                    }
                  />
                </div>
                {this.state.latitudeError && (
                  <div className="form-error">{this.state.latitudeError}</div>
                )}
                {this.state.longitudeError && (
                  <div className="form-error">{this.state.longitudeError}</div>
                )}
              </div>

              {/* Max Results */}
              <div className="form-input">
                <label htmlFor="maxResults" className="form-label">
                  Max Results
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="maxResults"
                  step="20"
                  min="20"
                  max="120"
                  placeholder="e.g. 100"
                  title="Maximum number of results"
                  value={this.state.maxResults}
                  onChange={(e) =>
                    this.setState({ maxResults: parseInt(e.target.value, 10) })
                  }
                />
                {this.state.maxResultsError && (
                  <div className="form-error">{this.state.maxResultsError}</div>
                )}
              </div>
            </div>
          )}

          {/* File Import */}
          {this.state.activeTab === "file" && (
            <div className="tab-pane show active" role="tabpanel">
              <FileInput
                label="Import Excel File"
                acceptedTypes={[".xls", ".xlsx"]}
              >
                {this.state.fileError && (
                  <div className="form-error">{this.state.fileError}</div>
                )}
              </FileInput>
            </div>
          )}
        </div>
      </div>
    );
  }
}
