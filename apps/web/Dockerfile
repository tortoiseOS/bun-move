FROM oven/bun:1 as base
WORKDIR /app

# Copy all packages and app
COPY package.json bun.lockb ./
COPY tsconfig.json ./
COPY packages ./packages
COPY apps/web ./apps/web

# Install dependencies
RUN bun install

# Build Next.js app
WORKDIR /app/apps/web
RUN bun run build

# Production
FROM oven/bun:1 as runner
WORKDIR /app

# Copy built files and dependencies
COPY --from=base /app/packages ./packages
COPY --from=base /app/apps/web/.next ./apps/web/.next
COPY --from=base /app/apps/web/public ./apps/web/public
COPY --from=base /app/apps/web/package.json ./apps/web/
COPY --from=base /app/apps/web/next.config.mjs ./apps/web/
COPY --from=base /app/package.json ./
COPY --from=base /app/node_modules ./node_modules

WORKDIR /app/apps/web
CMD ["bun", "run", "start"]

EXPOSE 3000
