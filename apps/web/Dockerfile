FROM oven/bun:1 as base
WORKDIR /app

# Install dependencies
COPY package.json bun.lockb ./
COPY apps/web/package.json ./apps/web/
COPY packages/*/package.json ./packages/

RUN bun install --frozen-lockfile

# Copy source
COPY . .

# Build Next.js app
WORKDIR /app/apps/web
RUN bun run build

# Production
FROM oven/bun:1-slim
WORKDIR /app

COPY --from=base /app/apps/web/.next ./.next
COPY --from=base /app/apps/web/public ./public
COPY --from=base /app/apps/web/package.json ./

RUN bun install --production --frozen-lockfile

CMD ["bun", "run", "start"]

EXPOSE 3000
