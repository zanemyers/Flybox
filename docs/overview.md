## 🎣 ShopReel

Scrapes business data from Google Maps using SerpAPI and individual shop websites, compiling the results into a structured Excel file.

### 🔍 Features

- Fetches local business listings via SerpAPI's Google Maps engine.
- Supports using cached Excel files of previously fetched shop data to reduce redundant API calls.
- Launches a Playwright browser to extract additional details from each shop's website:
  - Email address
  - Online store availability
  - Fishing report presence
  - Social media profiles
- Writes all collected data to an Excel (.xlsx) file for easy access and analysis.
- Displays progress indicators while scraping to monitor completion.
- Supports customizations through interactive form input.
- Handles errors and blocked sites gracefully by providing standardized fallback data.

### 📅 Future Plans

- Add support for selecting between SerpAPI and Google's new Places API (`places:searchText`).
  - Note: The new Places API currently limits results to 20 per query (see `google-places-api` branch). Pagination or limit increases will be required for full-scale scraping.

### 🐞 Known Issues

- Email scraping accuracy is approximately 70%.
- Some business pages may be blocked or fail to load.
- Playwright debugging is possible locally (headed), but not in Docker.

## 🐟 FishTales

Parses, summarizes, and consolidates reports from various websites into structured summaries.

### 🔍 Features

- Uses an **[Excel starter/config file](../client/static/example_files/fishTales_starter_file.xlsx)** to define site-specific extraction rules:
  - CSS selectors, keywords, and other metadata for each shop website.
- Filters reports based on **maximum age** (in days) to prioritize recent content.
- Supports **river-specific filtering**, allowing users to focus on particular rivers:
- Summarizes report content using **Gemini AI models**:
  - Model selection is customizable (e.g., `gemini-2.5-flash`).
  - Token limits can be configured per request.
  - Prompts for summarization and merging are customizable via form input.
- Configurable **crawl depth** to control how far the scraper follows links from the initial page.
- Provides progress feedback while parsing and summarizing reports.

### 🐞 Known Issues

- Requires running headless in Docker.
- Summarization may be inconsistent depending on the prompt or AI model.
- Summarization can be slow.

## 🗺️ SiteScout

Keeps your FishTales starter file up to date by comparing it with ShopReel results.

### 🔍 Features

- Supports using two Excel files as input.
- Compares websites collected from a ShopReel run with the FishTales starter file.
- Identifies new or missing sites.
- Appends new sites to the FishTales starter file to maintain an up-to-date configuration.
