FROM node:22-alpine AS builder

WORKDIR /app

# Install client dependencies & build frontend
COPY client/package*.json ./client/
RUN cd client && npm install

COPY client/ ./client/
RUN cd client && npm run build

# Production runtime stage
FROM node:22-alpine

WORKDIR /app

# Copy root package.json & install production backend dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy server code
COPY server/ ./server/
# Copy prebuilt frontend static files
COPY --from=builder /app/client/dist ./client/dist

# Create persistent data directory for SQLite
RUN mkdir -p /app/data

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Volume for persistent SQLite database
VOLUME ["/app/data"]

CMD ["node", "server/index.js"]
