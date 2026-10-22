# Stage 1: Build client frontend
FROM node:22-alpine AS client-builder
# The image has no .git: pass the version in (shown in Settings → 版本資訊)
ARG APP_COMMIT=unknown
ARG APP_BRANCH=unknown
ENV APP_COMMIT=$APP_COMMIT APP_BRANCH=$APP_BRANCH
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
COPY package.json /app/package.json
RUN npm run build

# Stage 2: Production server runtime
FROM node:22-alpine
ARG APP_COMMIT=unknown
ARG APP_BRANCH=unknown
ENV APP_COMMIT=$APP_COMMIT APP_BRANCH=$APP_BRANCH
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
