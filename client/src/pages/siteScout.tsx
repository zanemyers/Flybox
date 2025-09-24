import InstructionPanel from "../components/forms/components/instructionPanel";
import SiteScoutForm from "../components/forms/siteScoutForm";

const steps = [
  { icon: "🎣", text: "Import your **ShopReel** results file." },
  {
    icon: "📂",
    text: "Import your **FishTales** starter file, or use the [**example file**](/example_files/fishTales_starter_file.xlsx).",
  },
  { icon: "✅", text: "Click **Compare** to start." },
];

export default function SiteScout() {
  return (
    <main className="container py-3">
      <div className="row d-flex align-items-stretch">
        {/* Instructions panel */}
        <InstructionPanel
          app="SiteScout"
          description="SiteScout keeps your **FishTales** starter file up to date by checking it against your
                  **ShopReel** results. Any new report sites are added automatically, so your dataset stays accurate and complete."
          steps={steps}
        />

        {/* Form panel */}
        <SiteScoutForm route="site-scout" />
      </div>
    </main>
  );
}
