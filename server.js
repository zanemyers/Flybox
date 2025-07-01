import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import expressLayouts from "express-ejs-layouts";

// Route files
import indexRoutes from "./routes/index.js";
import reportRoutes from "./routes/report.js";
import runRoutes from "./routes/run.js";

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layouts/base");

// Static files
app.use("/static", express.static(path.join(__dirname, "static")));
app.use("/bootstrap", express.static(path.join(__dirname, "node_modules/bootstrap")));
app.use(express.urlencoded({ extended: true }));

// Mount route files
app.use("/", indexRoutes);
app.use("/", reportRoutes);
app.use("/", runRoutes);

// 404 fallback
app.use((req, res) => {
  res.status(404).send("🚫 Page not found");
});

// Error-handling middleware (must be last)
app.use((err, req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).send("💥 Internal Server Error");
});

// Start server
app.listen(port, () => {
  console.log(`🌐 Server running at http://localhost:${port}`);
});
