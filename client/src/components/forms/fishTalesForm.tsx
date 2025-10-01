import React from "react";

import BaseForm, {
  type BaseProps,
  type BaseState,
  type Payload,
} from "./components/baseForm";
import FileInput from "./components/fileInput";
import {
  CheckBoxInput,
  TextInput,
  TextAreaInput,
} from "./components/formInput";

// Prompt template for summarizing fishing reports by body of water.
const SUMMARY_PROMPT = `
  For each river or body of water mentioned, create a bulleted list that follows the template below.
  - If you cannot find information for a bullet, leave it blank.
  - If the body of water is mentioned more than once, summarize the info into a single entry, with each of the 3 most recent dates broken out separately.
  - If a date is in the body of the text and not in the date field, move it to the date field.
  - If an article contains reports for multiple bodies of water, break them into separate entries based on the body of water.
  - If a river has multiple water types, list all of them next to the body of water's name.
  - Include the list of sources used for the summary

  # 1. Madison River (Water Type/s, e.g., river, lake, reservoir, creek, fork)
    * Date: June 19, 2025
      * Fly Patterns: ...
      * Colors: ...
      * Hook Sizes: ...
    * Date: June 13, 2025
      * Fly Patterns: ...
      * Colors: ...
      * Hook Sizes: ...
    * Date: June 12, 2025
      * Fly Patterns: ...
      * Colors: ...
      * Hook Sizes: ...
    * Sources: www.mdriv.org
  # 2. Snake River (river)
    * Date:...
      * Fly Patterns: ...
      * Colors: ...
      * Hook Sizes: ...
    * Sources: www.snakeriver.com, www.snriver.gov
  `.trim();

// Prompt template for merging multiple fishing report summaries into a single consolidated summary.
const MERGE_PROMPT = `
The following are summaries of fishing reports broken into sections. Please consolidate the information into a single 
summary using the same format, listing up to the 3 most recent dates separately for each body of water:
`.trim();

/** State of the form fields */
interface FormState {
  apiKey: string; // Gemini API key
  maxAge: number; // Maximum report age in days
  filterByRivers: boolean; // Whether to filter by rivers
  riverList: string; // Comma-separated rivers to filter
  file: File | null; // Uploaded starter file
  includeSiteList: boolean; // Include site list in output
  tokenLimit: number; // Token limit for API requests
  crawlDepth: number; // Depth to crawl links
  model: string; // Gemini model to use
  summaryPrompt: string; // Prompt template for summary
  mergePrompt: string; // Prompt template for merge
}

/** State of validation errors */
interface ErrorState {
  apiKeyError?: string;
  maxAgeError?: string;
  filterByRiversError?: string;
  riverListError?: string;
  fileError?: string;
  includeSiteListError?: string;
  tokenLimitError?: string;
  crawlDepthError?: string;
  modelError?: string;
  summaryPromptError?: string;
  mergePromptError?: string;
}

/** Component state */
interface State extends BaseState {
  form: FormState; // form field values
  errors: ErrorState; // validation errors
}

// Keys for nested state updates
type NestedStateKeys = "form" | "errors";

// Validation error messages mapped to form fields
const formErrors: {
  [K in keyof FormState]: {
    [E in keyof ErrorState]: string;
  };
} = {
  apiKey: { apiKeyError: "⚠ Please enter an API key." },
  maxAge: { maxAgeError: "⚠ Please enter a maximum age for reports." },
  filterByRivers: { filterByRiversError: "" },
  riverList: {
    filterByRiversError: "⚠ Please enter a list of comma separate rivers.",
  },
  file: { fileError: "⚠ Please upload a file." },
  includeSiteList: { includeSiteListError: "" },
  tokenLimit: {
    tokenLimitError:
      "⚠ Please enter a token limit between 10,000 and 100,000.",
  },
  crawlDepth: {
    crawlDepthError: "⚠ Please enter a token limit between 5 and 25.",
  },
  model: { modelError: "⚠ Please enter a Google Gemini model." },
  summaryPrompt: {
    summaryPromptError:
      "⚠ Please enter a prompt for Gemini to summarize reports.",
  },
  mergePrompt: {
    mergePromptError: "⚠ Please enter a prompt for combining the summaries.",
  },
};

/**
 * FishTalesForm
 *
 * Extends BaseForm to handle uploading a starter file, filtering reports,
 * and configuring advanced API settings for Gemini.
 */
export default class FishTalesForm extends BaseForm<BaseProps, State> {
  /** Default component state */
  protected readonly defaultState: State = {
    jobId: null,
    form: {
      apiKey: "",
      maxAge: 100,
      filterByRivers: false,
      riverList: "",
      file: null,
      includeSiteList: false,
      tokenLimit: 50000,
      crawlDepth: 15,
      model: "gemini-2.5-flash",
      summaryPrompt: SUMMARY_PROMPT,
      mergePrompt: MERGE_PROMPT,
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
   * Validate form input and return payload for API
   */
  validateFormInput(): Payload | null {
    let hasError = false;

    for (const [fieldKey, errorObj] of Object.entries(formErrors) as [
      keyof FormState,
      Record<keyof ErrorState, string>,
    ][]) {
      const errorKey = Object.keys(errorObj)[0] as keyof ErrorState;
      const error = errorObj[errorKey];

      if (this.isFieldValid(fieldKey, this.state.form[fieldKey])) {
        this.updateState("errors", errorKey, "");
      } else {
        hasError = true;
        this.updateState("errors", errorKey, error);
      }
    }

    if (hasError) return null;
    return { ...this.state.form };
  }

  /**
   * Check if a single field is valid
   */
  isFieldValid(
    fieldKey: keyof FormState,
    value: File | string | number | boolean | null,
  ): boolean {
    if (typeof value === "string") return !!value; // non-empty string
    if (fieldKey === "file") return !!value; // file must exist

    if (typeof value === "number") {
      if (fieldKey === "maxAge") return value >= 10;
      if (fieldKey === "tokenLimit") return value >= 10000 && value <= 100000;
      if (fieldKey === "crawlDepth") return value >= 5 && value <= 25;
    }

    return true;
  }

  /**
   * Update nested state (form or errors)
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
   * Render form inputs
   */
  renderFormInput(): React.ReactNode {
    return (
      <>
        {/* API Key */}
        <TextInput
          type="password"
          label="Gemini API Key"
          placeholder="API Key"
          title="Your private Gemini API key"
          value={this.state.form.apiKey}
          onChange={(val) => this.updateState("form", "apiKey", val)}
          error={this.state.errors.apiKeyError}
        />

        {/* Maximum report age */}
        <TextInput
          type="number"
          label="Max Report Age"
          placeholder="e.g. 100"
          title="Filter reports by maximum age in days (min: 10)"
          step="10"
          value={this.state.form.maxAge}
          onChange={(val) =>
            this.updateState("form", "maxAge", parseInt(val, 10))
          }
          error={this.state.errors.maxAgeError}
        />

        {/* Filter by rivers */}
        <CheckBoxInput
          label="Filter by Rivers"
          title="Enable filtering of reports by river names"
          checked={this.state.form.filterByRivers}
          onChange={(val) => this.updateState("form", "filterByRivers", val)}
        />

        {/* River list input, conditional */}
        {this.state.form.filterByRivers && (
          <TextInput
            type="text"
            label="River Names"
            placeholder="e.g. Madison, Snake, Yellowstone"
            title="Enter river names separated by commas to filter reports"
            value={this.state.form.riverList}
            onChange={(val) => this.updateState("form", "riverList", val)}
            error={this.state.errors.riverListError}
          />
        )}

        {/* Starter file */}
        <FileInput
          label="Import Starter File"
          acceptedTypes={[".xls", ".xlsx"]}
          onSelect={(file) => this.updateState("form", "file", file)}
          error={this.state.errors.fileError}
        />

        {/* Advanced settings */}
        <details className="form-input">
          <summary className="form-label mb-2">Advanced Settings</summary>

          <CheckBoxInput
            label="Include Site ListBlock"
            title="Output a text file listing all scraped sites"
            checked={this.state.form.includeSiteList}
            onChange={(val) => this.updateState("form", "includeSiteList", val)}
          />

          <TextInput
            type="number"
            label="Token Limit"
            placeholder="e.g. 50,000"
            title="Maximum number of tokens per request (min: 10,000, max: 100,000)"
            step="1000"
            value={this.state.form.tokenLimit}
            onChange={(val) =>
              this.updateState("form", "tokenLimit", parseInt(val, 10))
            }
            error={this.state.errors.tokenLimitError}
          />

          <TextInput
            type="number"
            label="Crawl Depth"
            placeholder="e.g. 25"
            title="Set how deep the scraper follows links (min: 5, max: 25)"
            step="5"
            value={this.state.form.crawlDepth}
            onChange={(val) =>
              this.updateState("form", "crawlDepth", parseInt(val, 10))
            }
            error={this.state.errors.crawlDepthError}
          />

          <TextInput
            type="text"
            label="Gemini Model"
            placeholder="e.g. gemini-1.5-pro or gemini-2.5-flash"
            title="Specify the Gemini model to use for summarization"
            value={this.state.form.model}
            onChange={(val) => this.updateState("form", "model", val)}
            error={this.state.errors.modelError}
          />

          <TextAreaInput
            label="Summary Prompt"
            title="Enter the summary prompt"
            placeholder="Enter summary prompt here..."
            rows={10}
            value={this.state.form.summaryPrompt}
            onChange={(val) => this.updateState("form", "summaryPrompt", val)}
          />

          <TextAreaInput
            label="Merge Prompt"
            title="Enter the merge prompt"
            placeholder="Enter merge prompt here..."
            rows={4}
            value={this.state.form.mergePrompt}
            onChange={(val) => this.updateState("form", "mergePrompt", val)}
          />
        </details>
      </>
    );
  }
}
