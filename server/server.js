import "dotenv/config"; // Load environment variables
import "./db.js"; // Initialize the database
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// Route handlers
import routes from "./api_routes/index.js";
import { errorHandler } from "./api_routes/error.js";

const app = express();
const port = process.env.PORT || 3000;

// Resolve __dirname in ES module context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve API routes first
app.use("/api", routes);

// Serve static files from React build
app.use(express.static(path.join(__dirname, "../client/dist")));

// Catch-all: serve React index.html for non-API routes
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// Generic error handler (must be last middleware)
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`🌐 Server running at http://localhost:${port}`);
});
