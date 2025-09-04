#!/usr/bin/env just --justfile

# Runs the setup script to prepare the .env file.
setup:
    #!/usr/bin/env sh
    if [ -f .env ]; then
        echo "✅ .env already exists, skipping setup.";
    elif docker compose ps &> /dev/null; then
        docker compose run --rm web-scraper node setup.js;
    else
        node setup.js;
    fi

@clean_docker:
    docker compose down --volumes --remove-orphans # Remove orphaned containers and volumes
    docker ps -q | xargs -r docker kill # Stop all running containers
    docker ps -a -q | xargs -r docker rm # Remove all containers
    docker images -f "dangling=true" -q | xargs -r docker rmi # Remove dangling images
    docker compose build # Rebuild the container


@update_dependencies:
    npm install -g npm-check-updates
    ncu -u
    rm -rf node_modules package-lock.json
    npm install

@lint:
    eslint . --fix
    stylelint "static/scss/**/*.scss"

@format:
    prettier --write . --log-level silent

@build_styles:
    sass static/scss/style.scss static/public/style.css

start *FLAGS:
    #!/usr/bin/env sh
    if [[ "{{FLAGS}}" == *"-l"* ]]; then  # check for -l (local) flag
        npx sass --watch static/scss/style.scss static/public/style.css & node --inspect=0.0.0.0:9229 server.js
    else
        docker compose up
    fi