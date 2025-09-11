import "dotenv/config"; // Load environment variables from .env
import "./db.js"; // Initialize the database
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import expressLayouts from "express-ejs-layouts";

// Route handlers
import routes from "./routes/index.js";
import { errorHandler } from "./routes/error.js";

const app = express();
const port = process.env.PORT || 3000;

// Resolve __dirname in ES module context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up view engine with layouts
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layouts/base");

// Serve static files
app.use(express.static(path.join(__dirname, "static")));
app.use("/bootstrap", express.static(path.join(__dirname, "node_modules/bootstrap")));

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Attach application routes
app.use("/", routes);

// Generic error handler (must be last middleware)
app.use(errorHandler);

// Start HTTP server
app.listen(port, () => {
  console.log(`🌐 Server running at http://localhost:${port}`);
});
