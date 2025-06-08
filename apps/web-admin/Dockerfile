FROM oven/bun:1 AS base

FROM base AS builder
WORKDIR /app
RUN bun add --global turbo@2.5.4
COPY . .

# Prune monorepo for target app
RUN turbo prune web-admin --docker

FROM base AS installer
WORKDIR /app

# Install deps with pruned package.json/bun.lock
COPY --from=builder /app/out/json/ .
RUN bun i

# Set environment variables on build
ENV NODE_ENV=production

ARG VITE_DEFAULT_EMAIL
ENV VITE_DEFAULT_EMAIL=${VITE_DEFAULT_EMAIL}

ARG VITE_HELP_EMAIL
ENV VITE_HELP_EMAIL=${VITE_HELP_EMAIL}

# Build the project
COPY --from=builder /app/out/full/ .
COPY --from=builder /app/tsconfig.json ./tsconfig.json
RUN bun turbo run build

FROM base AS runner
WORKDIR /app/apps/web-admin

# Don't run as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 rr7-app
USER rr7-app

COPY --from=installer /app/apps/web-admin/package.json ./package.json
COPY --from=installer /app/bun.lock ./bun.lock
COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/apps/web-admin/build ./build

CMD ["bun", "run", "start"]
