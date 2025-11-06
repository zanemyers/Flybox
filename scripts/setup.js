import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Resolve __filename and __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Parse a .env file into an object.
 */
function parseEnvFile(content) {
  const keysToPreserve = ["DATABASE_URL", "SERP_API_KEY", "GEMINI_API_KEY"];
  const env = {};

  // Split the file content into lines and iterate over each line
  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim(); // Remove leading/trailing whitespace from the line

    if (!trimmed || trimmed.startsWith("#")) return; // Skip this line if it is empty or starts with '#' (a comment)

    const [key, ...rest] = trimmed.split("="); // Split the line at the first '='
    const value = rest.join("=").replace(/^'|'$/g, ""); // Join & remove surrounding single quotes

    if (keysToPreserve.includes(key)) {
      env[key] = value; // Only keep keys we care about
    }
  });

  return env; // Return the object containing all parsed key-value pairs
}

/**
 * Main script:
 */
(async () => {
  try {
    const filePath = path.resolve(__dirname, ".env");

    // Load existing .env API key values if available
    let preserved = {};
    if (fs.existsSync(filePath)) {
      const existingContent = fs.readFileSync(filePath, "utf8");
      preserved = parseEnvFile(existingContent);
    }

    // Build the new .env content
    const envContent =
      "# Local Environment Config\n" +
      "NODE_ENV=development\n" +
      "PORT=3000\n\n" +
      "# Database Config\n" +
      `DATABASE_URL='${preserved.DATABASE_URL || ""}'\n` +
      "# Scraper configuration\n" +
      "RUN_HEADLESS=true\n" +
      "CONCURRENCY=5\n\n" +
      "# API keys for development\n" +
      "# - Place actual keys here. Use 'test' during development to avoid re-entering.\n" +
      `SERP_API_KEY='${preserved.SERP_API_KEY || ""}'\n` +
      `GEMINI_API_KEY='${preserved.GEMINI_API_KEY || ""}'`;

    // Write (overwrite) the .env file
    fs.writeFileSync(filePath, envContent, "utf8");

    console.log(`✅ .env file created/updated at ${filePath}`);
  } catch (error) {
    console.error("❌ Error during setup:", error);
  }
})();
