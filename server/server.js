import "dotenv/config"; // Load environment variables from .env
import "./db.js"; // Initialize the database
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// Route handlers
import routes from "./routes/index.js";
import { errorHandler } from "./routes/error.js";

const app = express();
const port = process.env.PORT || 3000;

// Resolve __dirname in ES module context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Attach application routes (API)
app.use("/api", routes);

// Serve static files (React build output)
app.use(express.static(path.join(__dirname, "../client/dist")));

// For all other routes, send React index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// Generic error handler (must be last middleware)
app.use(errorHandler);

// Start HTTP server
app.listen(port, () => {
  console.log(`🌐 Server running at http://localhost:${port}`);
});
