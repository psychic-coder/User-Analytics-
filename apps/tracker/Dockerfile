FROM node:18-alpine

WORKDIR /app

COPY tracker.js .
COPY package.json .

# Simple HTTP server to serve tracker
RUN npm install -g serve

CMD ["serve", "-p", "3000", "."]
