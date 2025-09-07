# Use a lightweight Node image
FROM node:24.7.0-slim

# Set working directory
WORKDIR /app

# Install system dependencies for SQLite
RUN apt-get update && \
    apt-get install -y libsqlite3-dev && \
    rm -rf /var/lib/apt/lists/*

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Install Playwright browsers and dependencies
RUN npx playwright install --with-deps

# Copy the rest of the app
COPY . .

# Optional: expose a port if using Express
EXPOSE 3000

# Default command for development (Sass watcher + Node server)
CMD sh -c "npx sass --watch --poll static/scss/style.scss:static/public/style.css 2>/dev/null & node --inspect=0.0.0.0:9229 server.js"