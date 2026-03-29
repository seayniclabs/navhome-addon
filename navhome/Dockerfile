# syntax=docker/dockerfile:1
# BUILD_FROM must be declared before any FROM (Docker scoping).
ARG BUILDPLATFORM
ARG BUILD_FROM=ghcr.io/home-assistant/amd64-base:3.19

# SPA build on runner arch so native npm deps (lightningcss) are linux/amd64.
FROM --platform=$BUILDPLATFORM node:22-alpine AS builder

WORKDIR /app
COPY app/ .
RUN npm ci && npm run build

FROM ${BUILD_FROM}

RUN apk add --no-cache nodejs

WORKDIR /opt/navhome

COPY server.js ./
COPY package.json ./

COPY --from=builder /app/build ./web/

CMD ["node", "server.js"]
