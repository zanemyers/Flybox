import { shopScraper } from "../../shop_scraper/shopScraper.js";
import { initCancellationToken } from "./cancellationToken.js";

export default function shopSocket(ws) {
  const cancelToken = initCancellationToken();

  console.log("🟢 WebSocket connected");

  const sendText = (msg) => {
    if (ws.readyState === ws.OPEN) {
      ws.send(msg);
    }
  };

  const sendBinary = (buffer) => {
    if (ws.readyState === ws.OPEN) {
      ws.send(buffer);
    }
  };

  ws.on("message", async (message) => {
    console.log("📨 Received:", message);
    let payload = {};
    try {
      payload = JSON.parse(message);
    } catch {
      sendText("❌ Invalid message format.");
      ws.close();
      return;
    }

    // Handle cancellation
    if (payload.action === "cancel") {
      cancelToken.cancel();
      sendText("❌ Search cancelled.");
      ws.close();
      return;
    }

    try {
      const progressUpdate = (msg) => {
        if (!cancelToken.isCancelled()) sendText(msg);
      };

      const returnFile = async (buffer) => {
        if (!cancelToken.isCancelled()) {
          // Send the Excel file buffer as binary over WS
          sendBinary(buffer);
        }
      };

      await shopScraper({
        searchParams: payload, // 👈 Pass whole payload
        progressUpdate,
        returnFile,
        cancelToken: cancelToken,
      });

      if (!cancelToken.isCancelled()) {
        sendText("✅ Search complete.");
      }
    } catch (err) {
      console.error("❌ Scraper error:", err);
      if (!cancelToken.isCancelled()) {
        sendText(`❌ Error: ${err.message || "Unknown error"}`);
      }
    } finally {
      ws.close();
    }
  });

  ws.on("close", () => {
    cancelToken.cancel();
    console.log("🔴 WebSocket closed");
  });
}
