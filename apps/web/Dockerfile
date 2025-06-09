FROM node:22-alpine AS base

# This Dockerfile is copy-pasted into our main docs at /docs/handbook/deploying-with-docker.
# Make sure you update both files!

FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk update
RUN apk add --no-cache libc6-compat
# Set working directory
WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune web --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app

# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
RUN yarn install

# Build the project
COPY --from=builder /app/out/full/ .
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Set environment variables on build
ENV NODE_ENV=production

ARG VITE_DEFAULT_EMAIL
ENV VITE_DEFAULT_EMAIL=${VITE_DEFAULT_EMAIL}

ARG VITE_HELP_EMAIL
ENV VITE_HELP_EMAIL=${VITE_HELP_EMAIL}

RUN yarn turbo build

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 react7-app
USER react7-app

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer /app/apps/web/package.json ./package.json
COPY --from=installer /app/package.json ./package.json
COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/apps/web/build ./build

CMD ["yarn", "start"]