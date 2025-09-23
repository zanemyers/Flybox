import InstructionPanel from "../components/forms/components/instructionPanel";

const steps = [
  { icon: "🔐", text: "Enter your **Gemini API key**" },
  { icon: "️⏱️", text: "Set **Max Report Age** in days" },
  {
    icon: "🌊",
    text: "Optional: Turn on **Filter by Rivers** and list rivers",
  },
  {
    icon: "📁",
    text: "Import a **Starter File** or use the [**example file**](/example_files/fishTales_starter_file.xlsx)",
  },
  {
    icon: "⚙️",
    text: "Optional: Adjust **Advanced Settings** as needed",
  },
  { icon: "✅", text: "Click **Search & Summarize** to start" },
];

export default function FishTales() {
  return (
    <main className="container py-3">
      <div className="row d-flex align-items-stretch">
        {/* Instructions panel */}
        <InstructionPanel
          app="FishTales"
          description="FishTales helps you collect and summarize fly-fishing reports from different websites. It starts with a starter file to find the websites, gathers the report information, and then creates easy-to-read summaries using **Google's Gemini API**."
          steps={steps}
          defaultsDescription="By default, FishTales uses the **gemini-2.5-flash** model, looks at reports from the last **100 days**, follows up to **25 links per website**, and does not filter by rivers. These settings work well for most users, but you can change as needed."
        />

        {/* Form panel */}
        <div id="formContainer" className="col-lg-7 d-flex">
          <div>Hello Form</div>
        </div>
      </div>
    </main>
  );
}
