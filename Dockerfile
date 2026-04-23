FROM node:25-slim

# Install Chromium system dependencies for Playwright
RUN apt-get update && apt-get install -y \
    libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 \
    libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 \
    libgbm1 libasound2 libpango-1.0-0 libpangocairo-1.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files and npm config
COPY package*.json .npmrc ./

# Install dependencies and Chromium only
RUN npm install && npx playwright install chromium

# Copy the rest of the app
COPY . .

# Build frontend (Vite)
RUN npx vite build -c config/vite.config.ts

# Expose port for Render to detect
EXPOSE 3000

# Start the server
CMD ["bash", "./scripts/start.sh"]