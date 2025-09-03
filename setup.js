import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Resolve __filename and __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generates a `.env` file in the project directory with the provided values.
 */
(async () => {
  try {
    // Build .env file content
    const envContent =
      "# Local Environment Config\n" +
      "NODE_ENV=development\n" +
      "PORT=3000\n\n" +
      "# Scraper configuration\n" +
      "RUN_HEADLESS=true\n" +
      "CONCURRENCY=5";

    // Write the .env file
    const filePath = path.resolve(__dirname, ".env");
    fs.writeFileSync(filePath, envContent, "utf8");

    console.log(`✅ .env file created at ${filePath}`);
  } catch (error) {
    console.error("❌ Error during setup:", error);
  }
})();
