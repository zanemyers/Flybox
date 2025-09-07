#!/usr/bin/env just --justfile

# Define schema path
schema := "./db"

# Runs the setup script to prepare the .env file and install pacakges locally.
setup:
    #!/usr/bin/env sh
    if [ -f .env ]; then # Setup .env
        echo "✅ .env already exists, skipping setup.";
    elif docker compose ps &> /dev/null; then
        docker compose run --rm web-scraper node setup.js;
    else
        node setup.js;
    fi

    npm install # Install node packages locally

# Clean and rebuild docker
@clean_docker:
    docker compose down --volumes --remove-orphans # Remove orphaned containers and volumes
    docker ps -q | xargs -r docker kill # Stop all running containers
    docker ps -a -q | xargs -r docker rm # Remove all containers
    docker images -f "dangling=true" -q | xargs -r docker rmi # Remove dangling images
    docker compose build # Rebuild the container

# Update node packages
@update_dependencies:
    npm install -g npm-check-updates
    ncu -u
    rm -rf node_modules package-lock.json
    npm install

# Lint the code
@lint:
    eslint . --fix
    stylelint "static/scss/**/*.scss"

# Format the code
@format:
    prettier --write . --log-level silent

# Compiles scss into css
@build_styles:
    sass static/scss/style.scss static/public/style.css

# Starts the server with docker (pass the '-l' flag to run locally)
start *FLAGS:
    #!/usr/bin/env sh
    if [[ "{{FLAGS}}" == *"-l"* ]]; then  # check for -l (local) flag
        npx sass --watch static/scss/style.scss static/public/style.css & node --inspect=0.0.0.0:9229 server.js
    else
        docker compose up
    fi

# Create a new migration from schema changes and apply it
# 👉 Use after editing schema.prisma (like `makemigrations && migrate`)
migrate *FLAGS:
    #!/usr/bin/env sh
    if [[ "{{FLAGS}}" == *"-n"* ]]; then # Use -n flag to pass a name
        # Extract the name following -n
        NAME=$(echo "{{FLAGS}}" | sed -n 's/.*-n[= ]\([^ ]*\).*/\1/p')
        npx prisma migrate dev --name "$NAME" --schema={{schema}}
    else
        npx prisma migrate dev --schema={{schema}}
    fi

# Reset the db, reapply all migrations, and regenerate the client
# 👉 Use when you want a fresh start (like `django flush && migrate`)
reset_db:
    npx prisma migrate reset --schema={{schema}}

# Regenerate the Prisma Client without touching the DB
# 👉 Use after pulling schema, cloning repo, or changing generator settings
generate_db:
    npx prisma generate --schema={{schema}}

# Launch Prisma Studio (interactive DB viewer/editor)
studio_db:
    npx prisma studio --schema={{schema}}

# Introspect DB → update schema.prisma to match the database, then regenerate client
# 👉 Use when DB was changed outside Prisma (like `inspectdb` in Django)
pull_db:
    npx prisma db pull --schema={{schema}}
    just generate