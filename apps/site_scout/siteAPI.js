import { BaseAPI } from "../base/_baseAPI.js";

// TODO: Set this up
export class SiteScoutAPI extends BaseAPI {
  async createJob(req, res) {
    res.sendStatus(204); // No response body needed
  }

  getFiles() {
    return [];
  }
}
