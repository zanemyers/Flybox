import newStarterFile from "@images/docs/site_scout/new_fish_tales_starter.png";
import siteScoutForm from "@images/docs/site_scout/site_scout.png";

import ListBlock from "../ui/listBlock";
import { DocOverview, DocSection } from "../ui/sections";
import { DocImage } from "../ui/images";
import Link from "../ui/links";

interface Props {
  setActiveTab: (tab: string) => void;
}

export default function SiteScoutDoc(props: Props) {
  const tocItems = [
    {
      label: "Using the SiteScout Form",
      children: [{ label: "Inputs" }, { label: "Output Files" }],
    },
    { label: "Additional Notes" },
  ];

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

  const outputListItems = [
    {
      label: "new_fishTales_starter.xlsx",
      main: "Includes all the original entries plus any new sites found in your ShopReel results.",
      noteLabel: "Note",
      note: (
        <>
          Only new URLs are added; the rest of your file stays the same. For
          full instructions on how to update your starter file, see the{" "}
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
      {/*Overview */}
      <DocOverview title="SiteScout" icon="🗺" items={tocItems}>
        <p>
          SiteScout helps keep your <strong>FishTales</strong> starter file up
          to date. It checks the latest <strong>ShopReel</strong> results and
          adds any new report sites automatically.
        </p>
      </DocOverview>

      <hr />

      {/* Using the form section */}
      <DocSection
        title="Using the SiteScout Form"
        p1="Use the SiteScout form to update your FishTales starter file by importing two Excel files."
      >
        {/* Inputs section */}
        <DocSection
          subSection={true}
          title="Inputs"
          p2="After selecting the files, click **Compare**. You’ll see progress updates as SiteScout runs."
        >
          <ListBlock items={inputListItems} />
          <DocImage img={siteScoutForm} alt="SiteScout Form" />
        </DocSection>

        {/* Output files section */}
        <DocSection
          subSection={true}
          title="Output Files"
          p1=" After running the comparison, SiteScout creates the following file:"
        >
          <ListBlock items={outputListItems} />
          <DocImage img={newStarterFile} alt="New FishTales starter file" />
        </DocSection>
      </DocSection>

      <hr />

      {/* Additional Notes */}
      <DocSection title="Additional Notes">
        <ListBlock items={notesListItems} />
      </DocSection>
    </>
  );
}
