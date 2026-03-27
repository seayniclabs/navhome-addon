ARG BUILD_FROM=ghcr.io/home-assistant/amd64-base:3.19
FROM node:22-alpine AS builder

# Clone and build the NavHome SvelteKit app
RUN apk add --no-cache git
WORKDIR /app
RUN git clone --depth 1 https://github.com/seayniclabs/navhome.git .
RUN npm ci && npm run build

FROM ${BUILD_FROM}

RUN apk add --no-cache nodejs

WORKDIR /opt/navhome

# Copy the add-on server
COPY server.js ./
COPY package.json ./

# Copy the built SvelteKit static files
COPY --from=builder /app/build ./web/

CMD ["node", "server.js"]
