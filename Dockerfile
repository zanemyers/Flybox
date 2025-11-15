# Use Playwright base image with Node and browsers pre-installed
FROM mcr.microsoft.com/playwright:v1.56.1-noble

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Build frontend (Vite)
RUN npx vite build -c config/vite.config.ts

# Expose port for Render to detect
EXPOSE 3000

# Start the server
CMD ["bash", "./scripts/start.sh"]
