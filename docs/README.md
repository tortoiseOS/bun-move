# TortoiseOS Documentation

Complete documentation for the bun-move project.

## 📚 Documentation Index

### Getting Started
- **[Quick Start Guide](./QUICK-START.md)** - Fast reference for common tasks
- **[Project Status](./PROJECT-STATUS.md)** - Comprehensive project overview and current status

### CLI Tool
- **[CLI Testing Guide](./CLI-TESTING-GUIDE.md)** - How to test `create-bun-move` locally
- **[CLI README](../packages/create-bun-move/README.md)** - Usage documentation for the CLI

### Publishing
- **[Publishing Guide](./PUBLISHING.md)** - Complete guide for publishing to npm

## 🎯 Quick Links

### For Developers
- [Development Workflow](./PROJECT-STATUS.md#-development-workflow)
- [Project Structure](./PROJECT-STATUS.md#-project-structure)
- [Troubleshooting](./PROJECT-STATUS.md#-troubleshooting)

### For Publishing
- [Pre-Publishing Checklist](./PUBLISHING.md#-checklist-before-publishing)
- [Publishing Workflow](./PUBLISHING.md#-publishing-to-npm)
- [After Publishing](./PUBLISHING.md#-after-publishing)

### For Testing
- [Local CLI Testing](./CLI-TESTING-GUIDE.md#-local-testing-methods)
- [Test Checklist](./CLI-TESTING-GUIDE.md#-test-checklist)
- [E2E Tests](./PROJECT-STATUS.md#-testing-the-cli-locally)

## 📦 What's Ready

### Completed ✅
- CLI tool (`create-bun-move`)
- UI component library (24 Magic UI components)
- Web application with E2E tests
- API server
- Publishing scripts
- Complete documentation

### In Progress ⚠️
- Move contract fixes (compilation errors)
- npm package publication

## 🚀 Quick Commands

```bash
# Test CLI locally
cd packages/create-bun-move
bun run build
bun run dist/index.js my-test-app

# Publish to npm
./publish.sh

# Start development
bun run dev:web
```

## 📖 Document Descriptions

### PROJECT-STATUS.md
The main status document containing:
- Current project status
- Known issues
- CLI tool details
- Testing procedures
- Publishing instructions
- Magic UI integration
- Development workflow
- Troubleshooting guide

**When to use**: Need comprehensive overview or specific technical details

### PUBLISHING.md
Deep dive into npm publishing:
- Prerequisites and setup
- Step-by-step publishing
- Version management
- Common issues
- Best practices
- Post-publishing verification

**When to use**: Preparing to publish packages to npm

### CLI-TESTING-GUIDE.md
Focused guide for CLI testing:
- 3 testing methods
- Test scenarios
- Verification steps
- Cleanup procedures
- Pre-publish checklist

**When to use**: Before publishing CLI tool or after making changes

### QUICK-START.md
Fast reference card:
- Common commands
- Quick troubleshooting
- Package locations
- Important links

**When to use**: Quick daily reference for common tasks

## 🏗️ Project Architecture

```
bun-move/
├── docs/                    # You are here
│   ├── README.md           # This file
│   ├── QUICK-START.md      # Quick reference
│   ├── PROJECT-STATUS.md   # Complete status
│   ├── PUBLISHING.md       # Publishing guide
│   └── CLI-TESTING-GUIDE.md # CLI testing
├── apps/
│   ├── web/                # Next.js app
│   └── api/                # Express API
├── packages/
│   ├── ui/                 # Magic UI components
│   ├── create-bun-move/    # CLI tool
│   ├── core/               # Core utilities
│   └── sdk/                # Sui SDK wrapper
└── move/                   # Sui Move contracts
```

## 🔗 External Resources

- [Bun Documentation](https://bun.sh/docs)
- [Sui Documentation](https://docs.sui.io)
- [Magic UI](https://magicui.design)
- [npm CLI Reference](https://docs.npmjs.com/cli/v10/commands/npm-publish)
- [Semantic Versioning](https://semver.org/)

## 🤝 Contributing

See the main [Contributing Guide](../CONTRIBUTING.md) for details on how to contribute.

## 📝 Documentation Updates

When updating documentation:
1. Update the relevant file(s)
2. Update this README if structure changes
3. Update PROJECT-STATUS.md for status changes
4. Keep QUICK-START.md in sync for common commands

---

**Last Updated**: October 17, 2025  
**Maintained by**: TortoiseOS Team
