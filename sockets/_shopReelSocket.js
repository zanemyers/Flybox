// import { BaseWebSocket } from "./_baseWebSocket.js";
// // import { shopScraper } from "../apps/shop_reel/shopReel.js";
//
// /**
//  * WebSocket subclass specifically for handling shop scraping requests.
//  */
// class _shopReelSocket extends BaseWebSocket {
//   /**
//    * Handles incoming payload from the WebSocket.
//    * Delegates the scraping task to the shopScraper function.
//    *
//    * @param {Object} payload - JSON payload containing search parameters
//    */
//   async handleAction(payload) {
//     await shopScraper({
//       searchParams: payload,
//       progressUpdate: this.progressUpdate.bind(this), // Send progress updates over WebSocket
//       returnFile: this.returnFile.bind(this), // Return resulting file over WebSocket
//       cancelToken: this.cancelToken, // Supports cancellation of scraping
//     });
//   }
// }
//
// /**
//  * Initialize a new WebSocket connection for shop scraping.
//  *
//  * @param {WebSocket} ws - The WebSocket connection
//  */
// export function shopReelSocket(ws) {
//   new _shopReelSocket(ws);
// }
