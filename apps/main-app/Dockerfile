FROM oven/bun:1 AS base
RUN bun i -g cross-env
WORKDIR /app

FROM base AS deps
# Copy the entire monorepo for workspace resolution
COPY . .
RUN bun i --frozen-lockfile

FROM base AS production-deps  
COPY . .
RUN bun i --production --frozen-lockfile

FROM base AS build
ENV NODE_ENV=production

# Build args
ARG VITE_DEFAULT_EMAIL
ARG VITE_HELP_EMAIL
ENV VITE_DEFAULT_EMAIL=${VITE_DEFAULT_EMAIL}
ENV VITE_HELP_EMAIL=${VITE_HELP_EMAIL}

# Copy everything with dependencies
COPY --from=deps /app .

# Build the specific app
WORKDIR /app/apps/main-app
RUN bun run build

FROM base AS final
WORKDIR /app

# Copy package.json from the app
COPY --from=build /app/apps/main-app/package.json ./

# Copy production node_modules from root (includes workspace packages)
COPY --from=production-deps /app/node_modules ./node_modules

# Copy built app
COPY --from=build /app/apps/main-app/build ./build

EXPOSE 8080
CMD ["bun", "run", "start"]