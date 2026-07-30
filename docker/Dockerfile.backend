FROM node:20-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci
COPY backend/ .
RUN npm run build
EXPOSE 4000
CMD ["node", "dist/index.js"]
