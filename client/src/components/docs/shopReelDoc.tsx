import manualForm from "@images/docs/shop_reel/shop_reel_m-form.png";
import fileImport from "@images/docs/shop_reel/shop_reel_f-form.png";
import simpleDetails from "@images/docs/shop_reel/simple_shop_details.png";
import details from "@images/docs/shop_reel/shop_details.png";
import serpDashboard from "@images/docs/shop_reel/serp/serp_dashboard.png";
import serpHome from "@images/docs/shop_reel/serp/serp_home.png";
import serpSub from "@images/docs/shop_reel/serp/serp_sub.png";

import TableOfContents from "../ui/tableOfContents";

const tocItems = [
  {
    label: "Using the ShopReel Form",
    children: [
      { label: "Manual Input" },
      { label: "File Import" },
      { label: "Output Files" },
    ],
  },
  { label: "Get Your SerpAPI Key" },
  { label: "Disclaimers" },
  { label: "Additional Notes" },
];

export default function ShopReelDoc() {
  return (
    <>
      <h1>🎣 ShopReel Documentation</h1>
      <p>
        {/* Overview */}
        ShopReel gathers business information from <strong>
          Google Maps
        </strong>{" "}
        using <strong>SerpAPI</strong>
        and from each shop’s website, then puts everything into an easy-to-read
        Excel file.
      </p>

      <hr />

      {/* Table of contents */}
      <TableOfContents items={tocItems} />

      <hr />

      {/*Using the form section*/}
      <h3 id="using-the-shopreel-form">Using the ShopReel Form</h3>
      <p>
        The ShopReel form lets you run searches in two ways: by entering your
        search settings manually, or by uploading an Excel file to reuse data
        from a previous search.
      </p>

      {/* Manual Input*/}
      <h5 id="manual-input">Manual Input</h5>
      <p className="mb-0">
        Use this tab to enter your own search settings for a custom ShopReel
        run. Default values are provided, but you can change them.
      </p>
      <ul>
        <li>
          <strong>SerpAPI Key:</strong> Enter your private API key to allow
          ShopReel to access Google Maps data.
          <br />
          <em>Note:</em> Required for the tool to work.
        </li>
        <li>
          <strong>Search Term:</strong> Type of business you want to find (e.g.,
          "Fly Fishing Shops").
          <br />
          <em>Default:</em> <code>Fly Fishing Shops</code>
        </li>
        <li>
          <strong>Location:</strong> Latitude and longitude for the search. You
          can also click the map to pick a spot.
          <br />
          <em>Default:</em> Yellowstone National Park:{" "}
          <code>Latitude: 44.427963</code>, <code>Longitude: -110.588455</code>
        </li>
        <li>
          <strong>Max Results:</strong> How many results to retrieve. ShopReel
          fetches in batches of 20.
          <br />
          <em>Default:</em> <code>100</code> (<em>Max:</em> <code>120</code>,{" "}
          <em>Min:</em> <code>20</code>)
        </li>
      </ul>
      <div className="d-flex justify-content-center pb-3">
        <img
          src={manualForm}
          alt="ShopReel Manual Input Form"
          className="img-fluid w-75"
        />
      </div>
      <p>
        After filling in the fields, click <strong>Search</strong>. Progress
        updates will appear on the page.
      </p>

      {/*File Import */}
      <h5 id="file-import" className="pt-2">
        File Import
      </h5>
      <ul>
        <li>
          Import a previous <strong>simple_shop_details.xlsx</strong> to reuse
          shop data.
        </li>
        <li>
          This helps ShopReel run faster by avoiding repeated requests to
          SerpAPI.
        </li>
      </ul>
      <div className="d-flex justify-content-center pb-3">
        <img
          src={fileImport}
          alt="ShopReel File Import Form"
          className="img-fluid w-75"
        />
      </div>
      <p>
        Once you select the file, click <strong>Search</strong>. Progress
        updates will appear as ShopReel runs.
      </p>

      {/* Output Files */}
      <h5 id="output-files" className="pt-2">
        Output Files
      </h5>
      <p className="mb-0">
        After running a search, ShopReel creates Excel files with shop data. The
        files depend on the type of search:
      </p>
      <div className="text-center">
        <ul className="text-start d-inline-block">
          <li>
            <strong>Manual Input:</strong>
            <ul>
              <li className="mb-4">
                <strong>simple_shop_details.xlsx:</strong> Created immediately.
                Contains basic shop info and can be reused.
                <br />
                <img
                  src={simpleDetails}
                  alt="Simple Shop Details"
                  className="img-fluid w-75 mx-auto d-block"
                />
              </li>
              <li className="mb-4">
                <strong>shop_details.xlsx:</strong> Contains detailed info from
                shop websites (emails, online stores, social links).
                <br />
                <img
                  src={details}
                  alt="Shop Details"
                  className="img-fluid w-75 mx-auto d-block"
                />
              </li>
            </ul>
          </li>
          <li>
            <strong>File Import:</strong>
            <ul>
              <li>
                Only <strong>shop_details.xlsx</strong> is downloaded, since the
                basic <strong>simple_shop_details.xlsx</strong> is already
                provided.
              </li>
            </ul>
          </li>
        </ul>
      </div>

      <hr />

      {/* How to get your SerpAPI api key */}
      <h3 id="get-your-serpapi-key">Get Your SerpAPI Key</h3>
      <div className="text-center">
        <ol className="text-start d-inline-block">
          <li className="mb-4">
            Go to{" "}
            <a href="https://serpapi.com/" target="_blank">
              SerpAPI
            </a>{" "}
            and create an account.
            <br />
            <img
              src={serpHome}
              alt="SerpAPI App"
              className="img-fluid w-75 mx-auto d-block"
            />
          </li>
          <li className="mb-4">
            Verify your email and phone number to set up a free account.
            <br />
            <img
              src={serpSub}
              alt="SerpAPI Subscription"
              className="img-fluid w-75 mx-auto d-block"
            />
          </li>
          <li>
            Your API key is automatically generated. Copy the section called{" "}
            <code>Your Private API Key</code> to use in ShopReel.
            <br />
            <img
              src={serpDashboard}
              alt="Your Private API Key"
              className="img-fluid w-75 mx-auto d-block"
            />
          </li>
        </ol>
      </div>

      <hr />

      {/* Disclaimers */}
      <h3 id="disclaimers">⚠ Disclaimers</h3>
      <ul>
        {/* Warn users about limitations */}
        <li>
          <strong>Email scraping:</strong> Some emails may be missing or
          outdated. Results are not guaranteed to be 100% accurate.
        </li>
        <li>
          <strong>Blocked pages:</strong> Some websites may prevent ShopReel
          from accessing them. Fallback data will be used in these cases.
        </li>
      </ul>

      <hr />

      {/* Additional notes section*/}
      <h3 id="additional-notes">✏ Additional Notes</h3>
      <ul>
        <li>
          Future updates may add support for other APIs and extra filtering
          options to refine searches.
        </li>
      </ul>
    </>
  );
}
