## ⚙️ Configuration

Set these in your `.env` file.

### 🛠️ Shared Settings

| Variable       | Description                                            |
| -------------- | ------------------------------------------------------ |
| `RUN_HEADLESS` | Run browser headless or visibly (`true` or `false`)    |
| `CONCURRENCY`  | Number of URLs to process at a time (recommended: 3–5) |

### 🛒 Shop Scraper

| Variable             | Description                                                   |
| -------------------- | ------------------------------------------------------------- |
| `SERP_API_KEY`       | SerpAPI key for Google Maps search                            |
| `SEARCH_QUERY`       | Search query term (e.g., "Fly Fishing Shops")                 |
| `SEARCH_COORDINATES` | Latitude and longitude for search (e.g., "44.4280,-110.5885") |
| `MAX_RESULTS`        | Maximum number of results to retrieve                         |

### 📈 Report Scraper

| Variable               | Description                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| `GOOGLE_GENAI_API_KEY` | [API key](https://aistudio.google.com/app/apikey) for accessing Google's GenAI              |
| `GOOGLE_GENAI_MODEL`   | The [GenAI model](https://ai.google.dev/gemini-api/docs/models) to use (e.g., `gemini-pro`) |
| `MAX_TOKENS_PER_CHUNK` | Token limit per chunk when summarizing reports                                              |
| `MAX_REPORT_AGE`       | Max age of reports to include (in days)                                                     |
| `FILTER_BY_RIVER`      | Enable or disable river filtering (`true` or `false`)                                       |
| `IMPORTANT_RIVERS`     | Comma-separated list of river names to prioritize (e.g. `'Snake','Colorado'`)               |
