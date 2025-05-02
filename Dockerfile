FROM node:23.15.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .



