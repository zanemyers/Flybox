#!/usr/bin/env bash
set -eux  # Exit on error, print commands, treat unset variables as errors

# Move to app root
SCRIPT_DIR=$(dirname "$0")
cd "$SCRIPT_DIR/.."

# Sync schema to database
npx prisma db push --schema=./server/db/schema.prisma

# Generate Prisma client
npx prisma generate --schema=./server/db/schema.prisma

# Start the server
node server/server.js