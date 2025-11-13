#!/usr/bin/env just --justfile

# Define schema path
schema := "./server/db"

# Runs the setup script to prepare the .env file and install pacakges locally.
setup:
    node scripts/setup.js # Run the setup script
    npm install # Install node packages locally

# Clean and rebuild docker
@clean_docker:
    docker ps -q | xargs -r docker kill # Stop all running containers
    docker ps -aq | xargs -r docker rm # Remove all containers
    docker images -aq | xargs -r docker rmi # Remove all images
    docker volume ls -q | xargs -r docker volume rm # Remove all volumes
    docker builder prune -f
    docker compose build --no-cache

# Update node packages
@update_dependencies:
    npm install -g npm-check-updates
    ncu -u
    rm -rf node_modules package-lock.json
    npm install

# Lint the code
@lint:
    eslint -c config/eslint.config.js .
    eslint -c config/eslint.config.js . --fix
    stylelint "client/src/assets/styles/**/*.scss" -c config/.stylelintrc
    stylelint "client/src/assets/styles/**/*.scss" -c config/.stylelintrc --fix

# Format the code
@format:
    prettier --write . --log-level silent

# Build React frontend
@build_frontend:
    npx vite build -c config/vite.config.ts

# Starts the server with docker (pass the '-l' flag to run locally)
start *FLAGS:
    #!/usr/bin/env sh
    if [[ "{{FLAGS}}" == *"-d"* ]]; then
      docker compose up -d db
      vite -c config/vite.config.ts & node --inspect=0.0.0.0:9229 server/server.js
    elif [[ "{{FLAGS}}" == *"-l"* ]]; then
      docker compose up -d db
      node server/server.js
    else
      docker compose up
    fi

# Create a new migration from schema changes and apply it
@migrate NAME="":
    npx prisma migrate dev {{ if NAME != "" { "--name " + NAME } else { "" } }} --schema={{schema}}

# Reset the db, reapply all migrations, and regenerate the client
reset_db:
    npx prisma migrate reset --schema={{schema}}

cleanup_db:
    node scripts/db_cleanup.js

# Regenerate the Prisma Client without touching the DB
generate_db:
    npx prisma generate --schema={{schema}}

push_db:
    npx prisma db push --schema={{schema}}

# Launch Prisma Studio (interactive DB viewer/editor)
studio_db:
    npx prisma studio --schema={{schema}}

# Update schema.prisma to match the database, then regenerate client
pull_db: && generate_db
    npx prisma db pull --schema={{schema}}