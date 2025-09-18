import basicForm from "@images/docs/fish_tales/fish_tales_b-form.png";
import advancedForm from "@images/docs/fish_tales/fish_tales_a-form.png";
import gaiApi from "@images/docs/fish_tales/gemini/gai_api.png";
import gaiHome from "@images/docs/fish_tales/gemini/gai_home.png";
import gaiKey from "@images/docs/fish_tales/gemini/gai_key.png";
import gaiLogin from "@images/docs/fish_tales/gemini/gai_login.png";
import gaiTerms from "@images/docs/fish_tales/gemini/gai_terms.png";
import arHome from "@images/docs/fish_tales/starter_file/arricks_home.png";
import arReport from "@images/docs/fish_tales/starter_file/arricks_report.png";
import arReportList from "@images/docs/fish_tales/starter_file/arricks_report_list.png";
import newSite from "@images/docs/fish_tales/starter_file/new_site.png";
import siteList from "@images/docs/fish_tales/starter_file/site_list.png";
import updatedFile from "@images/docs/fish_tales/starter_file/updated_starter_file.png";

import DocOverview from "../layout/docOverview";
import ListBlock from "../ui/listBlock";
import ExternalLink from "../ui/externalLink";
import DocSection from "../layout/DocSection";

const tocItems = [
  {
    label: "Using the FishTales Form",
    children: [
      { label: "Basic Inputs" },
      { label: "Advanced Inputs" },
      { label: "Output Files" },
    ],
  },
  { label: "Get Your Gemini API Key" },
  {
    label: "Update Your Starter File",
    children: [{ label: "Advanced Selectors" }],
  },
  { label: "Disclaimers" },
  { label: "Additional Notes" },
];

const disclaimersListItems = [
  {
    label: "Summarization accuracy",
    main: "The summaries may not always be perfect. Results can vary depending on the AI model and instructions used.",
  },
  {
    label: "Blocked pages",
    main: " Some websites may prevent FishTales from accessing their pages.",
  },
];

const notesListItems = [
  {
    main: "Future versions will include a file listing all the websites FishTales looked at. This can help improve the starter file.",
  },
  {
    main: "Future updates may add support for more AI models and extra filtering options to give you better control over results.",
  },
];

export default function FishTalesDoc() {
  return (
    <>
      {/* Overview */}
      <DocOverview title="FishTales" icon="🐟" items={tocItems}>
        <p>
          FishTales gathers fly-fishing reports from different websites and
          creates easy-to-read summaries using{" "}
          <strong>Google’s Gemini API</strong>.
        </p>
      </DocOverview>

      <hr />

      {/* Using the form section */}
      <h3 id="using-the-fishtales-form">Using the FishTales Form</h3>
      <p>
        FishTales lets you set up how reports are collected and summarized.
        Default settings are provided to make it easy, but you can change them
        if you want.
      </p>

      {/*asic Inputs*/}
      <h5 id="basic-inputs">Basic Inputs</h5>
      <ul>
        <li>
          <strong>Gemini API Key:</strong> Enter your private API key here. This
          lets FishTales use the Gemini AI to read and summarize reports.
          <br />
          <em>Note:</em> This is required for the tool to work.
        </li>
        <li>
          <strong>Max Report Age:</strong> Choose how old the reports can be.
          FishTales will ignore anything older than this.
          <br />
          <em>Default:</em> <code>100</code> (<em>Min:</em> <code>10</code>)
        </li>
        <li>
          <strong>Filter by Rivers:</strong> Turn this on if you only want
          reports from certain rivers.
          <br />
          <em>Default:</em> <code>false</code> (includes all rivers)
        </li>
        <li>
          <strong>River Names</strong> (<em>Optional</em>)<strong>:</strong>{" "}
          ListBlock the rivers you want, separated by commas.
        </li>
        <li>
          <strong>Starter File:</strong> Upload your current dataset, or use the{" "}
          <a href="/example_files/fishTales_starter_file.xlsx" download>
            <strong>example file</strong>
          </a>{" "}
          to get started.
        </li>
      </ul>
      <div className="d-flex justify-content-center pb-3">
        <img src={basicForm} alt="FishTales Basic Input Form" />
      </div>

      {/*dvanced Inputs*/}
      <h5 id="advanced-inputs" className="mt-3">
        Advanced Inputs
      </h5>
      <p className="mb-0">
        These settings are optional. You can change them to control how
        FishTales finds reports and summarizes them.
      </p>
      <ul>
        <li>
          <strong>Include Site ListBlock:</strong> When enabled, a{" "}
          <code className="text-black">site_list.txt</code> file will be
          generated containing all scraped sites. This can help refine or update
          your starter file.
          <br />
          <em>Default:</em> <code>false</code>
        </li>
        <li>
          <strong>Token Limit:</strong> Maximum text the model can read at once.
          Too high can cause errors; too low may miss details.
          <br />
          <em>Default:</em> <code>50,000</code> (<em>Max:</em>{" "}
          <code>100,000</code>, <em>Min:</em> <code>10,000</code>)
        </li>
        <li>
          <strong>Crawl Depth:</strong> How many links the scraper follows to
          find reports. Higher numbers may find more reports but take longer.
          <br />
          <em>Default:</em> <code>25</code> (<em>Max:</em> <code>25</code>,{" "}
          <em>Min:</em> <code>5</code>)
        </li>
        <li>
          <strong>Model:</strong> Pick which Gemini AI model you want to use.
          Different models may give slightly different results. See available
          models at{" "}
          <ExternalLink url="https://ai.google.dev/models/gemini">
            ai.google.dev
          </ExternalLink>
          .<br />
          <em>Default:</em> <code>gemini-2.5-flash</code>
        </li>
        <li>
          <strong>Summary Prompt:</strong> Instructions for the AI on
          summarizing each report.
          <br />
          <em>Optional:</em> Leave as default if unsure.
        </li>
        <li>
          <strong>Merge Prompt:</strong> Instructions for combining multiple
          summaries into one final report.
          <br />
          <em>Optional:</em> Leave as default if unsure.
        </li>
      </ul>
      <div className="d-flex justify-content-center pb-3">
        <img src={advancedForm} alt="FishTales Advanced Input Form" />
      </div>
      <p>
        Once you’ve updated the inputs you want, click{" "}
        <strong>Search & Summarize</strong> to start. Progress updates will
        appear as FishTales works.
      </p>

      {/*utput Files*/}
      <h5 id="output-files" className="mt-3 pt-3">
        Output Files
      </h5>
      <p className="mb-0">
        When FishTales finishes, it will create a file for you to view the
        results:
      </p>
      <ul>
        <li>
          <strong>report_summary.txt:</strong> Contains all summarized report
          information. Open this to read a simple summary of everything
          FishTales found.
        </li>
        <li>
          <strong>site_list.txt</strong> (<em>optional</em>): A text file
          containing all scraped websites. Useful for identifying keywords and
          filtering out junk terms in the URL to refine your starter file.
        </li>
      </ul>

      <hr />

      {/* Getting your Gemini API Key */}
      <h3 id="get-your-gemini-api-key">Get Your Gemini API Key</h3>
      <div className="text-center">
        <ol className="text-start d-inline-block">
          <li className="mb-4">
            Go to{" "}
            <ExternalLink url="https://ai.google.dev/aistudio">
              ai.google.dev
            </ExternalLink>{" "}
            and sign in with your Google account.
            <img src={gaiLogin} alt="Google AI Studio Login" />
          </li>
          <li className="mb-4">
            If first-time user, see welcome message; otherwise, click{" "}
            <code>Get API key</code>.
            <img src={gaiHome} alt="Google AI Studio Dashboard" />
          </li>
          <li className="mb-4">
            Accept terms and conditions (first-time users only), then click{" "}
            <code>I accept</code>.
            <img src={gaiTerms} alt="Google AI Studio Terms & Conditions" />
          </li>
          <li className="mb-4">
            Click <code>+ Create API key</code> or select an existing key.
            <img src={gaiApi} alt="Google AI Studio API Keys" />
          </li>
          <li>
            Copy your API key and keep it safe.
            <img src={gaiKey} alt="Google AI Studio API Key" />
          </li>
        </ol>
      </div>

      <hr />

      {/*pdating your starter file*/}
      <h3 id="update-your-starter-file">Update Your Starter File</h3>
      <p>
        Keeping the starter file accurate ensures FishTales can scrape and
        summarize reports correctly.
      </p>
      <div className="text-center">
        <ol className="text-start d-inline-block">
          <li className="mb-4">
            Run <strong>SiteScout</strong> to see if your starter file is
            missing any report sites.
            <img src={newSite} alt="New Report Sites" />
          </li>
          <li className="mb-4">
            Open each new site in your browser. Look for sections like{" "}
            <em>Reports</em>, <em>Blog</em>, or <em>Fishing Updates</em>.
            <img src={arHome} alt="Arricks App Page" />
          </li>
          <li className="mb-4">
            Pay attention to date, keywords, junk words, and click-phrases to
            determine if a site is actively updated.
            <img src={arReportList} alt="Arricks Report ListBlock" />
          </li>
          <li className="mb-4">
            Use the browser inspector to find the HTML element containing the
            report:
            <ul className="mb-0">
              <li>Right-click {">"} Inspect (or Inspect Element)</li>
              <li>
                Keyboard shortcuts for opening inspector:
                <ul>
                  <li>
                    Windows/Linux: <code>Ctrl + Shift + I</code> or{" "}
                    <code>F12</code>
                  </li>
                  <li>
                    Mac: <code>Cmd + Option + I</code> or <code>F12</code>
                  </li>
                </ul>
              </li>
              <li>
                Hover over elements or use the <strong>element picker</strong>{" "}
                to locate the report text.
              </li>
              <li>
                Look for a container element, e.g., <code>&lt;article&gt;</code>{" "}
                or <code>&lt;div class="post"&gt;</code>.
              </li>
            </ul>
            <img src={arReport} alt="Arricks Report" />
          </li>
          <li className="mb-4">
            Add keywords, junk-words, click-phrases, selector, and optionally
            last report date.
            <img src={updatedFile} alt="Updated Starter File" />
          </li>
          <li className="mb-4">
            Run FishTales with the updated starter file and enable{" "}
            <strong>Include Site ListBlock</strong> under advanced settings.
            Then, use the generated site list to review and refine your keywords
            and junk-words for more accurate scraping and summaries.
            <br />
            <img src={siteList} alt="Site ListBlock File" />
          </li>
        </ol>
      </div>

      {/* Advanced Selectors */}
      <h5 id="advanced-selectors">Advanced Selectors</h5>
      <p>
        Most of the time, you can use a simple selector like{" "}
        <code>&lt;article&gt;</code> or <code>div.post</code> to capture the
        report content. These are easier to maintain and less likely to break if
        the website changes.
      </p>
      <p>
        Sometimes a site doesn’t use clear containers, and you’ll need a more{" "}
        <strong>advanced selector</strong> to target the report. For example:
      </p>
      <pre>
        <code>
          div.entry-content:has(p:text-matches("Fishing Report", "i"))
        </code>
      </pre>
      <p>
        This means: “look for a <code>div</code> with the class{" "}
        <code>entry-content</code> that contains a paragraph mentioning ‘Fishing
        Report’ (ignoring upper/lower case).”
      </p>
      <p>
        Advanced selectors can feel complicated, but don’t worry — you don’t
        need to start from scratch. Check the
        <a href="/example_files/fishTales_starter_file.xlsx" download>
          example starter file
        </a>{" "}
        included with FishTales for working examples you can build on.
      </p>
      <p>Tips for advanced selectors:</p>
      <ul>
        <li>
          Try simple selectors first. Only use advanced ones if you can’t
          capture the report otherwise.
        </li>
        <li>
          Test your selector in the browser console to make sure it highlights
          only the report text.
        </li>
        <li>
          If you get stuck, tools like <strong>GPT</strong> or{" "}
          <strong>Gemini</strong> can help you write or debug a selector.
        </li>
        <li>
          Keep notes in your starter file so you remember why you used a
          particular selector.
        </li>
      </ul>
      <p>
        Used carefully, advanced selectors let FishTales capture reports even
        from tricky websites.
      </p>

      <hr />

      {/* Disclaimers */}
      <DocSection title="Disclaimers">
        <ListBlock items={disclaimersListItems} />
      </DocSection>

      <hr />

      {/* Additional Notes*/}
      <DocSection title="Additional Notes">
        <ListBlock items={notesListItems} />
      </DocSection>
    </>
  );
}
