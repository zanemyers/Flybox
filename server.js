import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files like CSS
app.use(express.static(path.join(__dirname, "static")));

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Serve the HTML page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.listen(port, () => {
  console.log(`🌐 Server running at http://localhost:${port}`);
});
