#!/usr/bin/env bash
set -eux  # Exit on error, print commands, treat unset variables as errors

# Move to app root
SCRIPT_DIR=$(dirname "$0")
cd "$SCRIPT_DIR/.."

# Adjust DATABASE_URL for local Docker dev
if [ "$NODE_ENV" = "development" ]; then
  export DATABASE_URL="${DATABASE_URL//localhost/host.docker.internal}"
fi

# Run Prisma migrations
npx prisma migrate deploy --schema=./server/db/schema.prisma

# Generate Prisma client
npx prisma generate --schema=./server/db/schema.prisma

# Start the server
node server/server.js