import { BaseWebSocket } from "./_baseWebSocket.js";
import { shopScraper } from "../apps/shop_scraper/shopScraper.js";

class _ShopSocket extends BaseWebSocket {
  async handleAction(payload) {
    await shopScraper({
      searchParams: payload,
      progressUpdate: this.progressUpdate.bind(this),
      returnFile: this.returnFile.bind(this),
      cancelToken: this.cancelToken,
    });
  }
}

export function shopSocket(ws) {
  new _ShopSocket(ws);
}
