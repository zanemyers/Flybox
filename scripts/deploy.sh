#!/bin/sh
set -eux  # Exit on error, print commands, treat unset variables as errors

# Move to app root
SCRIPT_DIR=$(dirname "$0")
cd "$SCRIPT_DIR/.."

# Debug info
echo "Current directory: $(pwd)"
echo "DATABASE_URL: ${DATABASE_URL:?DATABASE_URL not set!}"

# Run Prisma migrations
echo "Running database migrations..."
npx prisma migrate deploy --schema=./server/db/schema.prisma

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate --schema=./server/db/schema.prisma

# Start the server
echo "Starting server..."
node server/server.js