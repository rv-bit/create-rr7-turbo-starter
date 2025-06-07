FROM oven/bun:1 AS base
RUN bun i -g cross-env
WORKDIR /app

FROM base AS deps
# Copy dependency files separately — better caching
COPY package.json bun.lock ./
RUN bun i --frozen-lockfile

FROM base AS production-deps
COPY package.json bun.lock ./
RUN bun i --production --frozen-lockfile

FROM base AS build
# Copy dependencies first to leverage cache

ENV NODE_ENV=production

ARG VITE_DEFAULT_EMAIL
ARG VITE_HELP_EMAIL
ENV VITE_DEFAULT_EMAIL=${VITE_DEFAULT_EMAIL}
ENV VITE_HELP_EMAIL=${VITE_HELP_EMAIL}

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

FROM base AS final

# Copy package.json and bun.lock so bun can read scripts and lockfile
COPY package.json bun.lock ./

# Copy production deps
COPY --from=production-deps /app/node_modules ./node_modules
# Copy built app
COPY --from=build /app/build ./build

EXPOSE 8080
CMD ["bun", "run", "start"]
