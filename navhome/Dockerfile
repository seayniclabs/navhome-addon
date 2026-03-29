# syntax=docker/dockerfile:1
# Build SPA on the host arch (amd64 on GitHub) so native deps (e.g. lightningcss) match;
# final image still matches HA arch via BUILD_FROM.
ARG BUILDPLATFORM
FROM --platform=$BUILDPLATFORM node:22-alpine AS builder

WORKDIR /app
COPY app/ .
RUN npm ci && npm run build

ARG BUILD_FROM=ghcr.io/home-assistant/amd64-base:3.19
FROM ${BUILD_FROM}

RUN apk add --no-cache nodejs

WORKDIR /opt/navhome

COPY server.js ./
COPY package.json ./

COPY --from=builder /app/build ./web/

CMD ["node", "server.js"]
