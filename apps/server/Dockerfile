FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Prune dev dependencies after build
RUN npm prune --production

CMD ["npm", "start"]
