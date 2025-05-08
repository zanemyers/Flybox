# RescueRiver

This is a repository containg work done for Rescue River, it currently includes 1 functional app, and 1 in progress app.

## SETUP

### VS Code Settings

#### Debugging

- On MacOS press `cmd + shift +p` to open the command palette
- Search `Debug: Toggle Auto Attach` and set it to `Only With Flag`

#### Recommended Extensions

- CSV by ReprEng
- Docker by Microsoft
- Docker DX by Docker
- GitHub Copilot by GitHub
- Prettier - Code formatter by Prettier

### Docker

- Install Docker Desktop
- In the terminal run `docker-compose build`

### Local

- Install node.js `https://nodejs.org/en/download` (Recommend using LTS)
  - You can check if it's installed by running `node -v` and/or `npm -v` in the terminal
- In the terminal run `npm install` to install the necessary packages locally

### Packages

- (Possibly) Cheerio
- Dotenv
- Fast-CSV
- Playwright

## Google Maps Shop Scraper (Functional)

This tool scapes a Google Maps URL and returns a csv with details on the listed items.
It should be double checked for data accuracy, but provides a good starting point.

### How it Works

- Takes a Google Maps URL
- Scrolls to the bottom of the list
- Pulls the individual URLs for each listed item
- Batches the found URLs
- Looks for details on list items (i.e. Name, Phone, Website, Ratings)
- Looks for more details on website (i.e. Email, Online Shop, Fishing Reports)
- Compiles found details into a csv
- Prints a list of list items without a website to the console
- Prints a list of the errors that occurred in the process to the console

### Run with Docker

- In the terminal run `just gss`

### Run Locally

- In the terminal run `just gss -l`
- If you are in the GoogleMapsShopScraper directory you may also run `node main` in the terminal

### Debugging

- Docker debuggin is currently unavailable
- In the terminal run `just gss -l -d` for local debugging
- If you are in the GoogleMapsShopScraper directory you may also run `node --inspect main` in the terminal

### Customizations

- If you want to see the run update main.js
  - const browser = await chromium.launch({ headless: false });
- If you want to run a different Google Maps URL update main.js
  - const startingUrl = ....
- If you want to increase or decrease batch size update shopScraper.js/scrapeGoogleShopDetails
  - const BATCH_SIZE = ...
- IF you need to increase the timeout to find the URLs update shopScraper.js/scrapeGoogleShopUrl
  - const maxScrollDuration = (time in ms);

### Known Issues

- It can hang while looking for the URLs (now fails after 30 seconds)
- Email doesn't always pull correctly
- Some pages fail to load
- Blocked or Forbidden pages
- Must run headless with Docker
- Cannot debug with Docker

## Fishing Report Scraper (In-Progress)

This tool takes takes a csv that must have the following 3 headers, Name, Website and, Publishes Fishing Report (You can use the Google Maps Scraper to generate one). Then compiles and generates data based off of common patterns in the reports for a given river.

### How it Works

### Run with Docker

- In the terminal run `just frs`

### Run Locally

- In the terminal run `just frs -l`
- If you are in the FishingReportScraper directory you may also run `node main` in the terminal

### Debugging

- Docker debuggin is currently unavailable
- In the terminal run `just frs -l -d` for local debugging
- If you are in the FishingReportScraper directory you may also run `node --inspect main` in the terminal

### Customizations

### Known Issues

- Must run headless with docker
