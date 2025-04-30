#!/usr/bin/env just --justfile

# Runs the google maps scraper
@gss:
    node GoogleMapsScraper/main.js

# Runs the fishing report scraper
@frs:
    node FishingReportScraper/main.js