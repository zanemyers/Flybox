## ⚙️ Configuration

Set these in your `.env` file.

### 🛠️ Shared Settings

| Variable       | Description                                            |
| -------------- | ------------------------------------------------------ |
| `RUN_HEADLESS` | Run browser headless or visibly (`true` or `false`)    |
| `BATCH_SIZE`   | Number of URLs to process per batch (recommended: 3–5) |

### 🛒 Shop Scraper

| Variable              | Description                                               |
| --------------------- | --------------------------------------------------------- |
| `STARTING_URL`        | Google Maps list URL to begin scraping                    |
| `MAX_SCROLL_DURATION` | Time to scroll and load results (ms, e.g., `30000` = 30s) |

### 📈 Report Scraper

| Variable               | Description                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| `GOOGLE_GENAI_API_KEY` | [API key](https://aistudio.google.com/app/apikey) for accessing Google's GenAI              |
| `GOOGLE_GENAI_MODEL`   | The [GenAI model](https://ai.google.dev/gemini-api/docs/models) to use (e.g., `gemini-pro`) |
| `MAX_TOKENS_PER_CHUNK` | Token limit per chunk when summarizing reports                                              |
| `MAX_REPORT_AGE`       | Max age of reports to include (in days)                                                     |
| `FILTER_BY_RIVER`      | Enable or disable river filtering (`true` or `false`)                                       |
| `IMPORTANT_RIVERS`     | Comma-separated list of river names to prioritize (e.g. `'Snake','Colorado'`)               |
