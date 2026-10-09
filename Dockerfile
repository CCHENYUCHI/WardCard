FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY server/ ./server/

# Copy the pre-built client/dist directly
COPY client/dist /app/client/dist

# Expose port and start
EXPOSE 3000
CMD ["node", "server/index.js"]
