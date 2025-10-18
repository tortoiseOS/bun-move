# @tortoise-os/create-bun-move

🐢 CLI tool to create new TortoiseOS DeFi projects on Sui blockchain.

## 🚀 Quick Start

```bash
# Using bunx (recommended)
bunx @tortoise-os/create-bun-move my-tortoise-app

# Or using npm
npx @tortoise-os/create-bun-move my-tortoise-app

# With options
bunx @tortoise-os/create-bun-move my-app -t minimal --no-docker
```

## 📖 Usage

### Interactive Mode

```bash
bunx @tortoise-os/create-bun-move
```

You'll be prompted for:
- Project name
- Template (Full Stack or Minimal)
- Sui Move contracts (Yes/No)
- Docker configuration (Yes/No)
- Magic UI components (Yes/No)

### Command Line Options

```bash
create-bun-move [project-name] [options]

Arguments:
  project-name           Name of your project

Options:
  -V, --version          output the version number
  -t, --template <type>  Project template (minimal|full) (default: "full")
  --no-sui               Skip Sui Move contracts
  --no-docker            Skip Docker setup
  -h, --help             display help for command
```

### Examples

```bash
# Full stack project with all features
bunx @tortoise-os/create-bun-move my-defi-app

# Minimal project without Docker
bunx @tortoise-os/create-bun-move simple-app -t minimal --no-docker

# Web-only project without Move contracts
bunx @tortoise-os/create-bun-move frontend-app --no-sui
```

## 🎯 Templates

### Full Stack Template
Includes:
- ✅ Next.js 14 Web App
- ✅ Express API Server  
- ✅ Sui Move Smart Contracts
- ✅ Magic UI Components
- ✅ Docker Configuration
- ✅ AI Integration Ready

### Minimal Template
Includes:
- ✅ Next.js 14 Web App
- ✅ Sui Move Smart Contracts
- ✅ Basic UI Components

## 📦 What Gets Created

```
my-tortoise-app/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # Express API (full template)
├── packages/
│   ├── core/         # Core utilities
│   ├── sdk/          # Sui SDK wrapper
│   └── ui/           # Magic UI components
├── move/             # Sui Move contracts
├── docker/           # Docker configs (if enabled)
├── .clauderc         # AI assistant instructions (Bun-first!)
├── .cursorrules      # Cursor IDE rules
├── package.json
├── .gitignore
└── README.md
```

### 🤖 AI Assistant Support

Every project includes `.clauderc` and `.cursorrules` files that instruct Claude, Cursor, and other AI coding assistants to:
- ✅ Always use `bun` instead of npm/yarn/pnpm
- ✅ Use `bunx` instead of npx
- ✅ Follow TortoiseOS best practices
- ✅ Use proper Sui Move commands

This ensures AI assistants give you bun-first suggestions automatically!

## 🛠️ After Creation

```bash
cd my-tortoise-app

# Install dependencies
bun install

# Start Docker services (if enabled)
docker compose up -d

# Initialize Sui (if included)
task sui:init

# Start development server
bun run dev
```

The app will be running at http://localhost:3000

## 🔧 Development

```bash
# Start web app
bun run dev

# Build for production
bun run build

# Run tests
bun test

# Lint code
bun run lint
```

## 🌐 Features

### DeFi Products Included
- 🔄 TortoiseSwap - AI-powered AMM
- 💰 TortoiseVault - Auto-compounding yield
- 💵 TortoiseUSD - NFT-backed stablecoin
- 📊 And 7 more DeFi protocols!

### Tech Stack
- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI, Magic UI
- **Blockchain**: Sui, Move Language
- **Package Manager**: Bun
- **Containerization**: Docker (optional)

## 🎨 Magic UI Components

If you enable Magic UI, you get:
- ✨ Animated backgrounds (RetroGrid, Particles)
- 🎯 Text animations (SparklesText, HyperText)
- 🎨 Interactive components (BorderBeam, BlurFade)
- 🌈 Beautiful buttons (RainbowButton, ShimmerButton)

## 📚 Documentation

- [TortoiseOS Documentation](https://github.com/tortoise-os/bun-move)
- [Sui Documentation](https://docs.sui.io)
- [Move Language Guide](https://move-book.com)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](../../CONTRIBUTING.md).

## 📄 License

MIT © TortoiseOS Team

## 🐢 About TortoiseOS

TortoiseOS is an AI-Native DeFi Operating System built on Sui blockchain. It provides a complete suite of DeFi products powered by machine learning and artificial intelligence.

---

**Created with 🐢 by the TortoiseOS team**
