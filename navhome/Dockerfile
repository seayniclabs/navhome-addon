ARG BUILD_FROM=ghcr.io/home-assistant/amd64-base:3.19
FROM node:22-alpine AS builder

WORKDIR /app
# Populated by CI (checkout of seayniclabs/navhome) or clone locally into ./app — see README
COPY app/ .
RUN npm ci && npm run build

FROM ${BUILD_FROM}

RUN apk add --no-cache nodejs

WORKDIR /opt/navhome

COPY server.js ./
COPY package.json ./

COPY --from=builder /app/build ./web/

CMD ["node", "server.js"]
