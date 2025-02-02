# Stage 1: Build Stage (Install dev dependencies)
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY . .

RUN yarn install

ENV NODE_ENV=production

RUN yarn prisma:prod:generate

RUN yarn build

# Stage 2: Prune Stage (Remove dev dependencies)
FROM node:18-alpine AS pruner

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app ./

ENV NODE_ENV=production

RUN yarn install

# Stage 3: Runtime Stage (Final image)
FROM node:18-alpine

WORKDIR /usr/src/app

RUN apk add --no-cache openssl

COPY --from=pruner /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/public ./public

ENV NODE_ENV=production
