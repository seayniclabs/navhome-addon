ARG BUILD_FROM=ghcr.io/home-assistant/amd64-base:3.19
FROM node:22-alpine AS builder

WORKDIR /app
COPY navhome-app/package*.json ./
RUN npm ci
COPY navhome-app/ .
RUN npm run build

FROM ${BUILD_FROM}

RUN apk add --no-cache nodejs npm

WORKDIR /opt/navhome

# Copy the add-on server
COPY server.js ./
COPY package.json ./

# Copy the built SvelteKit static files
COPY --from=builder /app/build ./web/

CMD ["node", "server.js"]
