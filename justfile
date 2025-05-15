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
frs *FLAGS: ollama_start && ollama_stop
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

# OLLAMA COMMANDS

# Updates Ollama and pulls the latest Llama3 model. (MacOS/Linux)
@ollama_update:
    brew upgrade ollama
    ollama pull llama3

# Starts the Ollama server in the background.
@ollama_start:
    ollama serve &>/dev/null &

# Stops the Ollama server if it's running.
ollama_stop:
    #!/usr/bin/env sh
    pid=$(ps aux | grep '[o]llama serve' | awk '{print $2}')
    if test -n "$pid"; then
        kill $pid
    else
        echo "Ollama process not found."
    fi

# Tests the Ollama server by sending a request to it.
@ollama_test: ollama_start && ollama_stop
    node LLM/testOllama.js