FROM oven/bun:1 as base
WORKDIR /app

# Install dependencies
COPY package.json bun.lockb ./
COPY apps/api/package.json ./apps/api/
COPY packages/*/package.json ./packages/

RUN bun install --frozen-lockfile

# Copy source
COPY . .

# Run API
WORKDIR /app/apps/api
CMD ["bun", "run", "src/index.ts"]

EXPOSE 3001
