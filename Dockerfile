# Use Playwright base image with Node and browsers pre-installed
FROM mcr.microsoft.com/playwright:v1.50.0-noble

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest
COPY . .

# Build frontend (Vite)
RUN npx vite build -c config/vite.config.ts

# Start backend
CMD ["node", "server/server.js"]
