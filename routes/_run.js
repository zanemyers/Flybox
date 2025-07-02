import express from "express";
const router = express.Router();

let sseClients = []; // track connected SSE clients

// SSE endpoint
router.get("/progress", (req, res) => {
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  res.flushHeaders();
  sseClients.push(res);

  req.on("close", () => {
    sseClients = sseClients.filter((client) => client !== res);
  });
});

// Helper to broadcast messages
function sendProgressUpdate(message) {
  sseClients.forEach((res) => {
    res.write(`data: ${message}\n\n`);
  });
}

// Run route
router.post("/run", async (req, res) => {
  try {
    runScript(); // non-blocking background task
    res.render("partials/progress", { layout: false, message: "✅ Script started..." });
  } catch (err) {
    console.error("Error:", err);
    res
      .status(500)
      .render("partials/progress", { layout: false, message: "❌ Script failed to start." });
  }
});

// Example long-running background task
function runScript() {
  let step = 0;
  const interval = setInterval(() => {
    step++;
    sendProgressUpdate(`Running... step ${step}`);

    if (step >= 5) {
      clearInterval(interval);
      sendProgressUpdate("✅ Script complete.");
    }
  }, 1000);
}

export default router;
