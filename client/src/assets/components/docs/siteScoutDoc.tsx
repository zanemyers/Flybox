import newFishTalesStarter from "@images/docs/site_scout/new_fish_tales_starter.png";
import siteScout from "@images/docs/site_scout/site_scout.png";
import HashLink from "../ui/hashLink";

const contents = [""];

export default function SiteScoutDoc() {
  return (
    <>
      <h1>🗺️ SiteScout Documentation</h1>
      <p>
        {/*Overview */}
        SiteScout helps keep your <strong>FishTales</strong> starter file up to
        date. It checks the latest <strong>ShopReel</strong> results and adds
        any new report sites automatically.
      </p>

      <hr />

      {/*Table of contents*/}
      <h3>Contents</h3>
      <ul>
        <li>
          <HashLink id="using-the-sitescout-form">
            Using the ShopReel Form
          </HashLink>
          <ul>
            <li>
              <HashLink id="inputs">Manual Input</HashLink>
            </li>
            <li>
              <HashLink id="output-files">Output Files</HashLink>
            </li>
          </ul>
        </li>
        <li>
          <HashLink id="additional-notes">✏ Additional Notes</HashLink>
        </li>
      </ul>

      <hr />

      {/* Using the form section */}
      <h3 id="using-the-sitescout-form">Using the SiteScout Form</h3>
      <p>
        Use the SiteScout form to update your FishTales starter file by
        importing two Excel files.
      </p>

      {/* Inputs section */}
      <h5 id="inputs">Inputs</h5>
      <ul>
        <li>
          <strong>ShopReel File:</strong> Import the results file you got from
          ShopReel.
        </li>
        <li>
          <strong>FishTales Starter File:</strong> Import your current starter
          file, or use the{" "}
          <a href="/example_files/fishTales_starter_file.xlsx" download>
            <strong>example file</strong>
          </a>
          .
        </li>
      </ul>
      <div className="d-flex justify-content-center pb-3">
        <img src={siteScout} alt="SiteScout Form" className="img-fluid w-75" />
      </div>
      <p>
        After selecting the files, click <strong>Compare</strong>. You’ll see
        progress updates as SiteScout runs.
      </p>

      {/* Output files section */}
      <h5 id="output-files">Output Files</h5>
      <p className="mb-0">
        After running the comparison, SiteScout creates the following file:
      </p>
      <ul>
        <li>
          <strong>new_fishTales_starter.xlsx:</strong>
          Includes all the original entries plus any new sites found in your
          ShopReel results.
          <br />
          <em>Note:</em> Only new URLs are added; the rest of your file stays
          the same. For full instructions on how to update your starter file,
          see the{" "}
          <a href="/docs?tab=FishTales#update-your-starter-file">
            Update Your Starter File
          </a>{" "}
          guide.
        </li>
      </ul>

      <div className="d-flex justify-content-center pb-3">
        <img
          src={newFishTalesStarter}
          alt="New FishTales starter file"
          className="img-fluid w-75"
        />
      </div>

      <hr />

      {/* Additional notes section */}
      <h3 id="additional-notes">✏ Additional Notes</h3>
      <ul>
        <li>
          SiteScout works together with <strong>FishTales</strong> and{" "}
          <strong>ShopReel</strong> to keep your data up to date.
        </li>
        <li>Future updates may add better ways to detect duplicate entries.</li>
      </ul>
    </>
  );
}
