FROM oven/bun:1 as base
WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./
COPY tsconfig.json ./
COPY packages ./packages
COPY apps/api ./apps/api

# Install dependencies
RUN bun install

# Run API
WORKDIR /app/apps/api
CMD ["bun", "run", "src/index.ts"]

EXPOSE 3001
