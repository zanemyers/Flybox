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

# Generate Prisma client
RUN npx prisma generate --schema=./server/db/schema.prisma

# Build frontend (Vite)
RUN npx vite build -c config/vite.config.ts

# Expose port for Render to detect
EXPOSE 3000

# Run migrations & Start backend
CMD npx prisma migrate deploy --schema=./server/db/schema.prisma && node server/server.js
