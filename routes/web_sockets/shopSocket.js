import { shopScraper } from "../../shop_scraper/shopScraper.js";

export default function shopSocket(ws) {
  let currentJob = null; // Store reference to the running job

  console.log("connected");
  let cancelled = false; // Flag to track cancellation

  const send = (msg) => {
    if (ws.readyState === ws.OPEN) {
      ws.send(msg);
    }
  };

  ws.on("message", async (message) => {
    console.log("Received", message);
    let payload = {};
    try {
      payload = JSON.parse(message);
    } catch {
      send("❌ Invalid message format.");
      ws.close();
      return;
    }

    // Handle cancel action
    if (payload.action === "cancel") {
      cancelled = true;
      send("❌ Search cancelled.");
      ws.close();
      return;
    }

    const { apiKey, query, lat, lng, maxResults } = payload;

    try {
      // Wrap progress sender to check for cancellation
      const progressUpdate = (msg) => {
        if (!cancelled) send(msg);
      };

      currentJob = shopScraper({
        apiKey,
        query,
        lat,
        lng,
        maxResults,
        progressUpdate,
        isCancelled: () => cancelled, // 👈 Add this if your scraper can check it
      });

      await currentJob; // Wait for it to finish

      if (!cancelled) {
        send("✅ Search complete.");
      }
    } catch (err) {
      console.log("error", err);
      if (!cancelled) {
        send(`❌ Error: ${err.message}`);
      }
    } finally {
      ws.close();
    }
  });

  ws.on("close", () => {
    cancelled = true; // Also cancel if socket disconnects unexpectedly
  });
}
