#!/usr/bin/env just --justfile

# Runs the Google Maps shop scraper
@gss:
    docker-compose run --rm web-scraper node GoogleMapsShopScraper/main.js

# Runs the fishing report scraper
@frs:
    docker-compose run --rm web-scraper node FishingReportScraper/main.js

