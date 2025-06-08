# FROM oven/bun:1 AS base

# FROM base AS builder
# WORKDIR /app
# RUN yarn global add turbo@^2.5.4
# COPY . .

# # Prune monorepo for target app
# RUN turbo prune web-admin --docker

# FROM base AS installer
# WORKDIR /app

# # Install deps with pruned package.json/bun.lock
# COPY --from=builder /app/out/json/ .
# RUN bun i

# # Set environment variables on build
# ENV NODE_ENV=production

# ARG VITE_DEFAULT_EMAIL
# ENV VITE_DEFAULT_EMAIL=${VITE_DEFAULT_EMAIL}

# ARG VITE_HELP_EMAIL
# ENV VITE_HELP_EMAIL=${VITE_HELP_EMAIL}

# # Build the project
# COPY --from=builder /app/out/full/ .
# COPY --from=builder /app/tsconfig.json ./tsconfig.json
# RUN bun turbo run build

# FROM base AS runner
# WORKDIR /app/apps/web-admin

# # Don't run as root
# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 rr7-app
# USER rr7-app

# COPY --from=installer /app/apps/web-admin/package.json ./package.json
# COPY --from=installer /app/bun.lock ./bun.lock
# COPY --from=installer /app/node_modules ./node_modules
# COPY --from=installer /app/apps/web-admin/build ./build

# CMD ["bun", "run", "start"]

FROM node:18-alpine AS base

FROM base AS builder
RUN apk update
RUN apk add --no-cache libc6-compat
# Set working directory
WORKDIR /app
# Replace <your-major-version> with the major version installed in your repository. For example:
# RUN yarn global add turbo@^2
RUN yarn global add turbo@^2.5.4
COPY . .

# Generate a partial monorepo with a pruned lockfile for a target workspace.
# Assuming "web" is the name entered in the project's package.json: { name: "web" }
RUN turbo prune web-admin --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app

# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
RUN yarn install --frozen-lockfile

# Build the project
COPY --from=builder /app/out/full/ .
RUN yarn turbo run build

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 rr7-app
USER rr7-app

COPY --from=installer /app/apps/web-admin/package.json ./package.json
COPY --from=installer /app/package.lock ./package.lock
COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/apps/web-admin/build ./build

CMD ["yarn", "start"]