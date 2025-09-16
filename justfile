#!/usr/bin/env just --justfile

# Define schema path
schema := "./server/db"

# Runs the setup script to prepare the .env file and install pacakges locally.
setup:
    node setup.js # Run the setup script
    npm install # Install node packages locally
    just migrate -n init # Initialize the database

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
    eslint -c config/eslint.config.js .
    eslint -c config/eslint.config.js . --fix
    stylelint "client/src/styles/**/*.scss" -c config/.stylelintrc
    stylelint "client/src/styles/**/*.scss" -c config/.stylelintrc --fix

# Format the code
@format:
    prettier --write . --log-level silent

# Build typescript
@build:
    tsc -p config/tsconfig.json && vite build -c config/vite.config.ts

@debug:
    node -p "process.env.SASS_QUIET_DEPS"

# Starts the server with docker (pass the '-l' flag to run locally)
start *FLAGS:
    #!/usr/bin/env sh
    if [[ "{{FLAGS}}" == *"-l"* ]]; then  # check for -l (local) flag
        vite -c config/vite.config.ts & node --inspect=0.0.0.0:9229 server/server.js
    elif [[ "{{FLAGS}}" == *"-p"* ]]; then # check for -p (preview) flag
        node server/server.js
    else
        docker compose up
    fi

# Create a new migration from schema changes and apply it
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
reset_db:
    npx prisma migrate reset --schema={{schema}}

# Regenerate the Prisma Client without touching the DB
generate_db:
    npx prisma generate --schema={{schema}}

# Launch Prisma Studio (interactive DB viewer/editor)
studio_db:
    npx prisma studio --schema={{schema}}

# Update schema.prisma to match the database, then regenerate client
pull_db:
    npx prisma db pull --schema={{schema}}
    just generate