import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import enquirer from "enquirer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const questions = [
  {
    type: "confirm",
    name: "RUN_HEADLESS",
    message: "Run headless?",
    initial: true,
  },
  {
    type: "numeral",
    name: "CONCURRENCY",
    message: "Enter batch size:",
    float: false,
    min: 1,
    max: 10,
    initial: 5,
    validate: validateRange(1, 10, "Concurrency"),
  },
];

function validateRange(min = 0, max = 100, label = "Value") {
  return (value) => {
    if (value < min || value > max) return `${label} must be between ${min} and ${max}.`;
    return true;
  };
}

(async () => {
  try {
    const answers = await enquirer.prompt(questions);

    const envContent =
      `# General Scraper configuration\n` +
      `RUN_HEADLESS=${answers.RUN_HEADLESS}\n` +
      `CONCURRENCY=${answers.CONCURRENCY}\n\n`;

    const filePath = path.resolve(__dirname, ".env");
    fs.writeFileSync(filePath, envContent, "utf8");
    console.log(`✅ .env file created at ${filePath}`);
  } catch (error) {
    console.error("❌ Error during setup:", error);
  }
})();
