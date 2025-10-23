FROM node:24.7.0-slim

WORKDIR /app

# Install system deps (for Playwright and Postgres client if needed)
RUN apt-get update && \
    apt-get install -y wget gnupg ca-certificates && \
    rm -rf /var/lib/apt/lists/*

COPY package*.json ./

# Build argument to control dev vs prod deps
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Install dependencies
RUN if [ "$NODE_ENV" = "production" ]; then npm install --omit=dev; else npm install; fi

# Install Playwright (if you need it in prod, otherwise move to dev Dockerfile)
RUN npx playwright install --with-deps

# Copy everything
COPY . .

# Build frontend + compile TypeScript
RUN npx tsc -p config/tsconfig.json && npx vite build -c config/vite.config.ts

# Default to backend
CMD ["node", "--inspect=0.0.0.0:9229", "server/server.js"]
