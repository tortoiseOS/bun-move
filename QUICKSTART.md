# 🚀 TortoiseOS Quick Start

## Choose Your Platform

### 🐧 Linux / AMD64
```bash
# One command to rule them all
task dev:full

# Or manually
docker compose -f docker/docker-compose.yml up -d
```

### 🍎 Apple Silicon (ARM64)
```bash
# Terminal 1: Start Sui locally
./scripts/start-sui-local.sh

# Terminal 2: Start services
docker compose -f docker/docker-compose.yml up api web postgres redis -d
```

## First Time Setup

```bash
# 1. Install dependencies
bun install

# 2. Copy environment
cp .env.example .env

# 3. Run setup
task setup

# 4. Build Move contracts
task move:build
```

## Access Your Stack

| Service | URL | Description |
|---------|-----|-------------|
| 🌐 Web | http://localhost:3000 | Next.js frontend |
| 🔌 API | http://localhost:3001 | Elysia backend |
| ⛓️ Sui RPC | http://localhost:9000 | Sui local network |
| 💧 Faucet | http://localhost:9123 | Test tokens |
| 🐘 Postgres | localhost:5432 | Database |
| 🔴 Redis | localhost:6379 | Cache |

## Common Commands

### Development
```bash
task dev:api       # API with hot reload
task dev:web       # Web with hot reload
task dev:sui       # Sui node only
```

### Move Contracts
```bash
task move:build    # Build all packages
task move:test     # Run Move tests
task move:deploy   # Deploy to local network
task move:watch    # Auto-rebuild on changes
```

### Testing
```bash
task test          # Run all tests
task test:move     # Move tests only
task test:ts       # TypeScript tests only
```

### Cleanup
```bash
task clean:all     # Clean everything
task clean:move    # Clean Move builds
task clean:docker  # Stop and remove containers
```

## Troubleshooting

### Port Already in Use

```bash
# Kill process on specific port
lsof -ti:9000 | xargs kill -9  # Sui
lsof -ti:3000 | xargs kill -9  # Web
lsof -ti:3001 | xargs kill -9  # API
```

### Docker Issues

```bash
# Clean restart
docker compose -f docker/docker-compose.yml down -v
docker compose -f docker/docker-compose.yml up --build -d
```

### Sui Network Won't Start

```bash
# Use the helper script
./scripts/start-sui-local.sh

# It handles:
# - Checking if Sui is installed
# - Killing existing processes
# - Cleaning old state
# - Starting fresh network
```

### Move Build Fails

```bash
# Clean and rebuild
task clean:move
task move:build

# Or manually
find packages/move -name "build" -type d -exec rm -rf {} +
cd packages/move/core && sui move build
```

## Development Workflow

### 1. Start Your Stack

**Apple Silicon:**
```bash
# Terminal 1
./scripts/start-sui-local.sh

# Terminal 2
docker compose -f docker/docker-compose.yml up api web postgres redis -d
```

**Linux/AMD64:**
```bash
task dev:full
```

### 2. Build & Deploy Contracts

```bash
# Build all Move packages
task move:build

# Deploy to local network
task move:deploy

# Watch for changes
task move:watch
```

### 3. Develop Frontend

```bash
# Hot reload is already enabled!
# Edit files in apps/web/src
# Browser auto-refreshes
```

### 4. Test Everything

```bash
# Run all tests
task test

# Or separately
task test:move    # Move contract tests
task test:ts      # TypeScript tests
```

## Get $LAB Tokens

```bash
# Get your address
sui client active-address

# Request tokens from faucet
curl -X POST http://localhost:9123/gas \
  -H "Content-Type: application/json" \
  -d '{"recipient": "YOUR_ADDRESS"}'
```

## Deploy Your First Contract

```bash
# 1. Create new Move package
mkdir -p packages/move/my-dapp
cd packages/move/my-dapp
sui move new my-dapp

# 2. Write your contract
# Edit sources/my-dapp.move

# 3. Build
sui move build

# 4. Deploy
sui client publish --gas-budget 100000000
```

## Next Steps

- 📖 Read the [Development Guide](./docs/DEVELOPMENT.md)
- 🏗️ Check out [example contracts](./packages/move)
- 🤖 Explore [AI integration](./packages/ai-integration)
- 🎨 Browse [UI components](./packages/components)

## Need Help?

- 📚 [Full Documentation](./docs/DEVELOPMENT.md)
- 🐛 [Report Issues](https://github.com/your-org/bun-move/issues)
- 💬 [Join Discord](#)
- 🐦 [Follow on Twitter](#)

---

🐢 **Happy Building!** - The TortoiseOS Team
