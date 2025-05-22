#!/usr/bin/env just --justfile

# Runs docker-compose with provided arguments.
@dcrr *ARGS:
    docker-compose run --rm {{ARGS}}

# Runs the Google Maps Shop Scraper, either locally or inside Docker.
gss *FLAGS:
    #!/usr/bin/env sh
    if [[ "{{FLAGS}}" == *"-l"* ]]; then  # Check for local flag (-l)
        if [[ "{{FLAGS}}" == *"-d"* ]]; then  # Check for debug flag (-d)
            node --inspect GoogleMapsShopScraper/main.js
        else
            node GoogleMapsShopScraper/main.js
        fi
    else
        just dcrr web-scraper node GoogleMapsShopScraper/main.js
    fi


# Runs the Fishing Report Scraper, either locally or inside Docker.
frs *FLAGS:
    #!/usr/bin/env sh
    if [[ "{{FLAGS}}" == *"-l"* ]]; then  # Check for local flag (-l)
        if [[ "{{FLAGS}}" == *"-d"* ]]; then  # Check for debug flag (-d)
            node --inspect FishingReportScraper/main.js
        else
            node FishingReportScraper/main.js
        fi
    else
        just dcrr web-scraper node FishingReportScraper/main.js
    fi