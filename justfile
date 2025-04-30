#!/usr/bin/env just --justfile

@gss:
    node GoogleMapsScraper/main.js

@frs:
    node FishingReportScraper/main.js