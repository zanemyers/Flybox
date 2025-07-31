import { initCancellationToken } from "./_cancellationToken.js";

export class BaseWebSocket {
  constructor(ws) {
    this.ws = ws;
    this.cancelToken = initCancellationToken();

    this.ws.on("message", this.onMessage.bind(this));
    this.ws.on("close", this.onClose.bind(this));
  }

  async onMessage(message, isBinary) {
    let payload;
    try {
      payload = this.formatPayload(message, isBinary);
    } catch (err) {
      this.sendIfActive(err.message);
      this.ws.close();
      return;
    }
    if (!payload) return;

    try {
      await this.handleAction(payload);
      this.sendIfActive("✅ Search Complete.");
    } catch (err) {
      this.sendIfActive(`❌ Error: ${err.message || "Unknown error"}`);
    } finally {
      this.ws.close();
    }
  }

  onClose() {
    this.cancelToken.cancel();
  }

  formatPayload(message, isBinary) {
    if (isBinary) {
      return { fileBuffer: message };
    } else {
      const payload = JSON.parse(message);

      if (payload.action === "cancel") {
        this.cancelToken.cancel();
        return null;
      }
      return payload;
    }
  }

  async handleAction() {
    throw new Error("handleAction(payload) must be implemented in subclass.");
  }

  sendData(data) {
    if (this.ws.readyState === this.ws.OPEN) {
      this.ws.send(data);
    }
  }

  progressUpdate(msg) {
    this.sendData(msg);
    if (msg === "Cancelled") this.ws.close();
  }

  async returnFile(buffer) {
    this.sendIfActive(buffer);
  }

  sendIfActive(msg) {
    if (!this.cancelToken.isCancelled()) {
      this.sendData(msg);
    }
  }
}
