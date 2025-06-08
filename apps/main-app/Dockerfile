FROM oven/bun:1 AS base
RUN bun i -g cross-env
WORKDIR /app

# Copy everything to preserve workspace structure
COPY . .

FROM base AS deps
# Install all dependencies
RUN bun i --frozen-lockfile

FROM base AS production-deps  
# Install production dependencies
RUN bun i --production --frozen-lockfile

FROM base AS build
ENV NODE_ENV=production

# Build args
ARG VITE_DEFAULT_EMAIL
ARG VITE_HELP_EMAIL
ENV VITE_DEFAULT_EMAIL=${VITE_DEFAULT_EMAIL}
ENV VITE_HELP_EMAIL=${VITE_HELP_EMAIL}

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules

# Build the specific app
WORKDIR /app/apps/main-app
RUN bun run build

FROM base AS final
WORKDIR /app

# Copy the built app
COPY --from=build /app/apps/main-app/build ./build

# Copy package.json from the app
COPY --from=build /app/apps/main-app/package.json ./package.json

# Copy production dependencies
COPY --from=production-deps /app/node_modules ./node_modules

# Copy workspace packages
COPY --from=production-deps /app/packages ./packages

EXPOSE 8080
CMD ["bun", "run", "start"]