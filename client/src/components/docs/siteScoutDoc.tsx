import newStarterFile from "@assets/images/docs/site_scout/new_fish_tales_starter.png";
import siteScoutForm from "@assets/images/docs/site_scout/site_scout.png";

import ListBlock from "@components//ui/listBlock";
import { DocOverview, DocSection } from "@components//ui/sections";
import Image from "@components//ui/images";
import Link from "@components//ui/links";

/** Props for the SiteScout documentation component */
interface Props {
  setActiveTab: (tab: string) => void; // Callback to switch active tab in parent
}

/**
 * SiteScoutDoc Component
 *
 * Renders full documentation for the SiteScout tool, including:
 * - Overview
 * - Instructions for using the form
 * - Input/Output file explanations
 * - Additional notes
 *
 * Utilizes reusable components: DocOverview, DocSection, ListBlock, Image, and Link.
 */
export default function SiteScoutDoc(props: Props) {
  /** Table of contents items for the page */
  const tocItems = [
    {
      label: "Using the SiteScout Form",
      children: [{ label: "Inputs" }, { label: "Output Files" }],
    },
    { label: "Additional Notes" },
  ];

  /** Items describing the inputs required by the form */
  const inputListItems = [
    {
      label: "ShopReel File",
      main: "Import the final results file you got from ShopReel.",
    },
    {
      label: "FishTales Starter File",
      main: "Import your current starter file, or use the [**example file**](/example_files/fishTales_starter_file.xlsx)",
    },
  ];

  /** Items describing the output files generated */
  const outputListItems = [
    {
      label: "new_fishTales_starter.xlsx",
      main: "Includes all the original entries plus any new sites found in your ShopReel results.",
      noteLabel: "Note",
      note: (
        <>
          Only new URLs are added; the rest of your file stays the same. For full instructions on
          how to update your starter file, see the{" "}
          <Link
            variant="hash"
            target="update-your-starter-file"
            tab="FishTales"
            onActivateTab={props.setActiveTab}
          >
            Update Your Starter File
          </Link>{" "}
          guide.
        </>
      ),
    },
  ];

  /** Additional notes for the user */
  const notesListItems = [
    {
      main: "SiteScout works together with **FishTales** and **ShopReel** to keep your data up to date.",
    },
    {
      main: "Future updates may add better ways to detect duplicate entries.",
    },
  ];

  return (
    <>
      {/* Page Overview */}
      <DocOverview title="SiteScout" icon="🗺" items={tocItems}>
        <p>
          SiteScout helps keep your <strong>FishTales</strong> starter file up to date. It checks
          the latest <strong>ShopReel</strong> results and adds any new report sites automatically.
        </p>
      </DocOverview>

      <hr />

      {/* Main instructions section */}
      <DocSection
        title="Using the SiteScout Form"
        overview="Use the SiteScout form to update your FishTales starter file by importing two Excel files."
      >
        {/* Inputs subsection */}
        <DocSection
          subSection={true}
          title="Inputs"
          conclusion="After selecting the files, click **Compare**. You’ll see progress updates as SiteScout runs."
        >
          <ListBlock items={inputListItems} />
          <Image img={siteScoutForm} alt="SiteScout Form" />
        </DocSection>

        {/* Output files subsection */}
        <DocSection
          subSection={true}
          title="Output Files"
          overview="After running the comparison, SiteScout creates the following file:"
        >
          <ListBlock items={outputListItems} />
          <Image img={newStarterFile} alt="New FishTales starter file" />
        </DocSection>
      </DocSection>

      <hr />

      {/* Additional notes section */}
      <DocSection title="Additional Notes">
        <ListBlock items={notesListItems} />
      </DocSection>
    </>
  );
}
