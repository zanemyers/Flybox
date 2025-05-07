#!/usr/bin/env just --justfile

# Runs docker-compose with provided arguments.
@dcrr *ARGS:
    docker-compose run --rm {{ARGS}}

# Runs the Google Maps Shop Scraper, either locally or inside Docker.
gss *FLAGS:
    #!/usr/bin/env sh
    if [[ "{{FLAGS}}" == *"-l"* ]]; then  # Check for local flag (-l)
        node GoogleMapsShopScraper/main.js
    else
        just dcrr web-scraper node GoogleMapsShopScraper/main.js
    fi


# Runs the Fishing Report Scraper, either locally or inside Docker.
frs *FLAGS:
    #!/usr/bin/env sh
    if [[ "{{FLAGS}}" == *"-l"* ]]; then  # Check for local flag (-l)
        node FishingReportScraper/main.js
    else
        just dcrr web-scraper node FishingReportScraper/main.js
    fi