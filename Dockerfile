# Stage 1: Build client frontend
FROM node:22-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Production server runtime
FROM node:22-alpine
WORKDIR /app
# tzdata: alpine has no zone files, SQLite 'localtime' would silently stay on UTC
RUN apk add --no-cache tzdata
COPY package*.json ./
RUN npm install --omit=dev
COPY server/ ./server/

# Copy built frontend from client-builder stage
COPY --from=client-builder /app/client/dist /app/client/dist

ENV NODE_ENV=production
ENV PORT=3000
# Study day resets at local midnight of this time zone
ENV TZ=Asia/Taipei

EXPOSE 3000
CMD ["node", "server/index.js"]
