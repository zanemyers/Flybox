import InstructionPanel from "../components/forms/components/instructionPanel";

const steps = [
  { icon: "🔐", text: "Enter your **SerpAPI key**" },
  { icon: "🔎", text: "Enter a search term" },
  {
    icon: "📍",
    text: "Pick a location or enter **latitude** and **longitude**",
  },
  { icon: "🔢", text: "Set the maximum number of results" },
  { icon: "✅", text: "Click **Search** to start" },
];

export default function ShopReel() {
  return (
    <main className="container py-3">
      <div className="row d-flex align-items-stretch">
        {/* Instructions panel */}
        <InstructionPanel
          app="ShopReel"
          description="ShopReel helps you find businesses near a location using **SerpAPI** and **Google Maps**, and puts the information into an easy-to-read Excel file."
          steps={steps}
          defaultsDescription="By default, ShopReel searches for **Fly Fishing Shops** near **Yellowstone National Park** and shows the first **100** results. You can change these settings to search any location or business type."
        />

        {/* Form panel */}
        <div id="formContainer" className="col-lg-7 d-flex">
          <div>Hello Form</div>
        </div>
      </div>
    </main>
  );
}
