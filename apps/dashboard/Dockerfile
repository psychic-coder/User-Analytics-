FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

ARG VITE_API_URL=http://localhost:5001/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build
RUN npm install -g serve

CMD ["serve", "-s", "dist", "-p", "3000"]
