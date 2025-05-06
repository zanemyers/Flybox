#!/usr/bin/env just --justfile
set shell := ["bash", "-c"]

@dcrr *ARGS:
    docker-compose run --rm {{ARGS}}

# Runs the Google Maps shop scraper with docker-compose
@gss *FLAGS:
    #!/usr/bin/env sh
    if [[ "{{FLAGS}}" == *"-l"* ]]; then  # check for -l (local) flag
        node GoogleMapsShopScraper/main.js
    else
        dcrr web-scraper node GoogleMapsShopScraper/main.js
    fi


@frs *FLAGS:
    #!/usr/bin/env sh
    if [[ "{{FLAGS}}" == *"-l"* ]]; then  # check for -l (local) flag
        node FishingReportScraper/main.js
    else
        just dcrr web-scraper node FishingReportScraper/main.js
    fi