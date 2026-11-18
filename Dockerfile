FROM node:22-bookworm-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --include=dev
COPY . .
RUN npm run build
ENV NODE_ENV=production
ENV HOST=0.0.0.0
CMD ["npm","start"]
