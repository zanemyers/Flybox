## 🛒 Shop Scraper

Pulls business data from Google Maps and associated websites, compiling the results into a structured CSV.

### 🔍 Features

- Scrolls and collects all visible shops from a given Google Maps URL
- Extracts contact info, links, and ratings from the Google listing
- Follows websites to gather additional data (email, fishing reports, shop links)
- Exports structured data to a CSV
- Logs missing websites and failed loads

### 🐞 Known Issues

- May hang while scrolling (controlled by `MAX_SCROLL_DURATION`)
- Email scraping is unreliable
- Some business pages are blocked or fail to load
- Requires headless mode in Docker
- Cannot be debugged in Docker

## 📈 Report Scraper (In-Progress)

Analyzes fishing reports from websites. Uses a CSV with these headers:

- `URL`
- `Last Updated`
- `Selector`
- `Keywords`
- `Junk Words`
- `Click Phrases`

### 🧠 Intended Features

- Detect and summarize river conditions and activity from fishing reports
- Filter by river name
- Track report freshness based on publication dates

### 🐞 Known Issues

- Must run headless in Docker
- Still under development
