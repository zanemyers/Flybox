import express from "express";
const router = express.Router();

// Example async function to run your script
async function runScript() {
  console.log("Script started...");
}

router.post("/run", async (req, res) => {
  try {
    runScript(); // trigger your script (without awaiting if you want it background)
    // Render an EJS template called 'run-result.ejs' with a message
    res.render("run-result", { message: "✅ Script started..." });
  } catch (err) {
    console.error("Error starting script:", err);
    res.status(500).render("run-result", { message: "❌ Failed to start script" });
  }
});

export default router;
