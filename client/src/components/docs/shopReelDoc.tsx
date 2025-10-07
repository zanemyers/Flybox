import manualForm from "@assets/images/docs/shop_reel/shop_reel_m-form.png";
import fileImport from "@assets/images/docs/shop_reel/shop_reel_f-form.png";
import simpleDetails from "@assets/images/docs/shop_reel/simple_shop_details.png";
import details from "@assets/images/docs/shop_reel/shop_details.png";
import serpDashboard from "@assets/images/docs/shop_reel/serp/serp_dashboard.png";
import serpHome from "@assets/images/docs/shop_reel/serp/serp_home.png";
import serpSub from "@assets/images/docs/shop_reel/serp/serp_sub.png";

import ListBlock from "@components//ui/listBlock";
import { DocOverview, DocSection } from "@components//ui/sections";
import Image from "@components//ui/images";

/**
 * ShopReelDoc Component
 *
 * Renders full documentation for the ShopReel tool, including:
 * - Overview
 * - Instructions for using the form (Manual Input & File Import)
 * - Output files explanation
 * - How to get a SerpAPI key
 * - Disclaimers
 * - Additional notes
 *
 * Utilizes reusable components: DocOverview, DocSection, ListBlock, Image.
 */
export default function ShopReelDoc() {
  /** Table of contents for the page */
  const tocItems = [
    {
      label: "Using the ShopReel Form",
      children: [{ label: "Manual Input" }, { label: "File Import" }, { label: "Output Files" }],
    },
    { label: "Get Your SerpAPI Key" },
    { label: "Disclaimers" },
    { label: "Additional Notes" },
  ];

  /** Manual Input tab fields and notes */
  const manualInputListItems = [
    {
      label: "SerpAPI Key",
      main: "Enter your private API key to allow ShopReel to access Google Maps data.",
      noteLabel: "Note",
      note: "Required for the tool to work.",
    },
    {
      label: "Search Term",
      main: 'Type of business you want to find (e.g., "Fly Fishing Shops").',
      noteLabel: "Default",
      note: "`Fly Fishing Shops`",
    },
    {
      label: "Location",
      main: "Latitude and longitude for the search. You can also click the map to pick a spot.",
      noteLabel: "Default",
      note: "Yellowstone National Park (*Latitude:* `44.427963`, *Longitude:* `-110.588455`)",
    },
    {
      label: "Max Results",
      main: "How many results to retrieve. ShopReel fetches in batches of 20.",
      noteLabel: "Default",
      note: "`100` (*Max:* `120`, *Min:* `20`)",
    },
  ];

  /** File Import tab fields and notes */
  const fileImportListItems = [
    {
      label: "simple_shop_details.xlsx",
      main: "Import the simple details from a previous run to reuse shop data.",
      noteLabel: "Note",
      note: "This helps ShopReel run faster by avoiding repeated requests to SerpAPI.",
    },
  ];

  /** Output files depending on search type */
  const outputListItems = [
    {
      label: "Manual Input",
      children: [
        {
          label: "simple_shop_details.xlsx",
          main: "Created immediately. Contains basic shop info and can be reused.",
          img: simpleDetails,
          alt: "Simple Shop Details",
        },
        {
          label: "shop_details.xlsx",
          main: "Contains detailed info from shop websites (emails, online stores, social links).",
          img: details,
          alt: "Shop Details",
        },
      ],
    },
    {
      label: "File Import",
      children: [
        {
          label: "shop_details.xlsx",
          main: "Since **simple_shop_details.xlsx** was provided, it will not be downloaded again.",
        },
      ],
    },
  ];

  /** Steps for obtaining a SerpAPI key */
  const serpListItems = [
    {
      main: "Go to [SerpAPI](https://serpapi.com/) and create an account.",
      img: serpHome,
      alt: "SerpAPI App",
    },
    {
      main: "Verify your email and phone number to set up a free account.",
      img: serpSub,
      alt: "SerpAPI Subscription",
    },
    {
      main: "Your API key is automatically generated. Copy the section called `Your Private API Key` to use in ShopReel.",
      img: serpDashboard,
      alt: "Your Private API Key",
    },
  ];

  /** Disclaimers about tool limitations */
  const disclaimersListItems = [
    {
      label: "Email scraping",
      main: "Some emails may be missing or outdated. Results are not guaranteed to be 100% accurate.",
    },
    {
      label: "Blocked pages",
      main: "Some websites may prevent ShopReel from accessing them. Fallback data will be used in these cases.",
    },
  ];

  /** Additional notes for users */
  const notesListItems = [
    {
      main: "Future updates may add support for other APIs and extra filtering options to refine searches.",
    },
  ];

  return (
    <>
      {/* Page Overview */}
      <DocOverview title="ShopReel" icon="🎣" items={tocItems}>
        <p>
          ShopReel gathers business information from <strong>Google Maps</strong> using{" "}
          <strong>SerpAPI</strong> and from each shop’s website, then puts everything into an
          easy-to-read Excel file.
        </p>
      </DocOverview>

      <hr />

      {/* Using the ShopReel form section */}
      <DocSection
        title="Using the ShopReel Form"
        overview="The ShopReel form lets you run searches in two ways: by entering your search settings manually, or by uploading an Excel file to reuse data from a previous search."
      >
        {/* Manual Input subsection */}
        <DocSection
          subSection={true}
          title="Manual Input"
          overview="Use this tab to enter your own search settings for a custom ShopReel run. Default values are provided, but you can change them."
          conclusion="After filling in the fields, click **Search**. Progress updates will appear on the page."
        >
          <ListBlock items={manualInputListItems} />
          <Image img={manualForm} alt="ShopReel Manual Input Form" />
        </DocSection>

        {/* File Import subsection */}
        <DocSection
          subSection={true}
          title="File Import"
          conclusion="Once you select the file, click **Search**. Progress updates will appear as ShopReel runs."
        >
          <ListBlock items={fileImportListItems} />
          <Image img={fileImport} alt="ShopReel File Import Form" />
        </DocSection>

        {/* Output Files subsection */}
        <DocSection
          subSection={true}
          title="Output Files"
          overview="After running a search, ShopReel creates Excel files with shop data. The files returned depend on the type of search:"
        >
          <ListBlock items={outputListItems} />
        </DocSection>
      </DocSection>

      <hr />

      {/* SerpAPI Key instructions */}
      <DocSection title="Get Your SerpAPI Key">
        <ListBlock items={serpListItems} ordered={true} />
      </DocSection>

      <hr />

      {/* Disclaimers section */}
      <DocSection title="Disclaimers">
        <ListBlock items={disclaimersListItems} />
      </DocSection>

      <hr />

      {/* Additional Notes section */}
      <DocSection title="Additional Notes">
        <ListBlock items={notesListItems} />
      </DocSection>
    </>
  );
}
