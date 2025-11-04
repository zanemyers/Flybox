FROM node:24.7.0-slim

WORKDIR /app

# Install system dependencies needed for Playwright and general libs
RUN apt-get update && \
    apt-get install -y \
        wget gnupg ca-certificates \
        libgtk-4-1 libgraphene-1.0-0 libgstgl-1.0-0 \
        libgstcodecparsers-1.0-0 libenchant-2-2 libsecret-1-0 \
        libmanette-0.2-0 libgles2-mesa \
    && rm -rf /var/lib/apt/lists/*

# Copy package.json for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Install Playwright browsers
RUN npx playwright install --with-deps

# Copy the rest of the project
COPY . .

# Build the frontend only
RUN npx vite build -c config/vite.config.ts

# Default command
CMD ["node", "server/server.js"]
