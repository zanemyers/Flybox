FROM node:24.7.0-slim

WORKDIR /app

# Install deps for SQLite
RUN apt-get update && \
    apt-get install -y libsqlite3-dev && \
    rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install

# Install Playwright (if you need it in prod, otherwise move to dev Dockerfile)
RUN npx playwright install --with-deps

# Copy everything
COPY . .

# Default to backend
CMD ["node", "--inspect=0.0.0.0:9229", "server/server.js"]
