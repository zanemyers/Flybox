# Google Maps Scraper

This tool scapes a Google Maps URL and returns a csv with details on the listed items.
It should be double checked for data accuracy, but provides a good starting point.

## How it Works

- Takes a Google Maps URL
- Scrolls to the bottom of the list
- Pulls the individual URLs for each listed item
- Batches the found URLs
- Looks for details on list items (i.e. Name, Phone, Website, Ratings)
- Looks for more details on website (i.e. Email, Online Shop, Fishing Reports)
- Compiles found details into a csv
- Prints a list of list items without a website to the console
- Prints a list of the errors that occurred in the process to the console

## How to run locally

- node main

## Packages

- Playwright
- CSV-Writer

## Customizations

- If you want to see the run update main.js
  - const browser = await chromium.launch({ headless: false });
- If you want to run a different Google Maps URL update main.js
  - const startingUrl = ....
- If you want to increase or decrease batch size update scrapers.js/scrapeGoogleShopDetails
  - const BATCH_SIZE = ...
- IF you need to increase the timeout to find the URLs update scrapers.js/scrapeGoogleShopUrl
  - const maxScrollDuration = (time in ms);

## Known Issues

- It can hang while looking for the URLs
- Email doesn't always pull correctly
- Some pages fail to load
- Blocked or Forbidden pages
