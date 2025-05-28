# RescueRiver

This repository contains work done for **Rescue River**, currently including:

- ✅ **Google Maps Shop Scraper** – Fully functional
- ⚠️ **Fishing Report Scraper** – In progress

These tools are designed to gather and summarize data from fishing-related sources online.  
They support both **local** and **Docker-based** development, with flexible configuration via environment variables

## Table of Contents

- [Setup](#setup)
- [Google Maps Shop Scraper](#google-maps-shop-scraper)
- [Fishing Report Scraper](#fishing-report-scraper-in-progress)
- [Known Issues](#known-issues)

## Setup

### VS Code Settings

#### Debugging

- On MacOS press `cmd + shift + p` to open the command palette
- Search `Debug: Toggle Auto Attach` and set it to `Only With Flag`

#### Recommended Extensions

- CSV by ReprEng
- Docker by Microsoft
- Docker DX by Docker
- GitHub Copilot by GitHub
- Prettier - Code formatter by Prettier

### Docker

- Install Docker Desktop from `https://docs.docker.com/get-started/get-docker/`
- In the terminal run `docker-compose build`

### Local (Recommended for development only)

- Install Node.js from `https://nodejs.org/en/download` (Recommend using LTS)
  - You can check if it's installed by running `node -v` and/or `npm -v` in the terminal
- In the terminal run `npm install` to install the necessary packages locally

### Environment

- In the terminal run `just setup_env` to setup your .env file
  - The .env file is essential for summarizing reports and making customizations
  - Follow the prompts in the terminal
  - You can always make changes manually or re-run the command to recreate your .env file

### Packages

- Chrono-Node
- Date-FNS
- Dotenv
- Enquirer
- Fast-CSV
- Google/Genai
- Playwright

## Google Maps Shop Scraper

This tool scrapes a Google Maps URL and returns a CSV with details on the listed items.
It should be double checked for data accuracy, but provides a good starting point.

### How it Works

- Takes a Google Maps URL
- Scrolls to the bottom of the list
- Pulls the individual URLs for each listed item
- Batches the found URLs
- Looks for details on list items (i.e. Name, Phone, Website, Ratings)
- Looks for more details on website (i.e. Email, Online Shop, Fishing Reports)
- Compiles found details into a CSV
- Prints a list of list items without a website to the console
- Prints a list of the errors that occurred in the process to the console

### Run with Docker

- In the terminal run `just gss`

### Run Locally

- In the terminal run `just gss -l`
- If you are in the GoogleMapsShopScraper directory you may also run `node main` in the terminal

### Debugging

- Docker debugging is currently unavailable
- In the terminal run `just gss -l -d` for local debugging
- If you are in the GoogleMapsShopScraper directory you may also run `node --inspect main` in the terminal

### Customizations

- In your .env file
  - Set `RUN_HEADLESS` to false to see the scraper run in a browser.
  - Adjust `BATCH_SIZE` to control how many URLs are processed at once.
    - NOTE: It’s recommended to batch only 3–5 URLs at a time.
    - WARNING: Larger batches may affect results due to rate limiting, blocking, resource contention, timeouts, session issues, or data inconsistencies.
  - Update `STARTING_URL` to change the starting point for scraping.
  - Modify `MAX_SCROLL_DURATION` to adjust how long the scraper waits for Google Maps to load.
    - NOTE: Value should be in milliseconds (e.g., 30000 = 30 seconds).

### Known Issues

- It can hang while looking for the URLs
  - `MAX_SCROLL_DURATION` causes timeout after 30s (default)
- Email doesn't always pull correctly
- Some pages fail to load
- Blocked or Forbidden pages
- Must run headless with Docker
- Cannot debug with Docker

## Fishing Report Scraper (In-Progress)

This tool takes a CSV that must have the following 3 headers, Name, Website and, Publishes Fishing Report (You can use the Google Maps Scraper to generate one). Then compiles and generates data based off of common patterns in the reports for a given river.

### How it Works

### Run with Docker

- In the terminal run `just frs`

### Run Locally

- In the terminal run `just frs -l`
- If you are in the FishingReportScraper directory you may also run `node main` in the terminal

### Debugging

- Docker debugging is currently unavailable
- In the terminal run `just frs -l -d` for local debugging
- If you are in the FishingReportScraper directory you may also run `node --inspect main` in the terminal

### Customizations

- In your .env file
  - Set `RUN_HEADLESS` to false to see the scraper run in a browser.
  - Adjust `BATCH_SIZE` to control how many URLs are processed at once.
    - NOTE: It’s recommended to batch only 3–5 URLs at a time.
    - WARNING: Larger batches may affect results due to rate limiting, blocking, resource contention, timeouts, session issues, or data inconsistencies.
  - Adjust `MAX_REPORT_AGE` to change the report age limit.
    - NOTE: Value should be in days
  - Toggle `FILTER_BY_RIVER` to enable or disable river filtering.
  - Update `IMPORTANT_RIVERS` to specify which rivers to filter by.

### Known Issues

- Must run headless with Docker
