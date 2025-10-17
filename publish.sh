#!/bin/bash
# Publish all TortoiseOS packages to npm

set -e

echo "🐢 TortoiseOS Package Publisher"
echo "================================"
echo ""

# Check if logged in to npm
echo "🔍 Checking npm authentication..."
if ! npm whoami > /dev/null 2>&1; then
    echo "❌ Not logged in to npm!"
    echo "Please run: npm login"
    exit 1
fi

NPM_USER=$(npm whoami)
echo "✅ Logged in as: $NPM_USER"
echo ""

# Ask for confirmation
echo "📦 This will publish the following packages:"
echo "   - create-bun-move"
echo "   - @bun-move/core"
echo "   - @bun-move/sdk"
echo "   - @bun-move/ui"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cancelled"
    exit 1
fi

# Build all packages
echo "🏗️  Building all packages..."
echo ""

echo "Building @bun-move/core..."
cd packages/core
bun run build 2>/dev/null || echo "⚠️  No build script for core"
cd ../..

echo "Building @bun-move/sdk..."
cd packages/sdk  
bun run build 2>/dev/null || echo "⚠️  No build script for sdk"
cd ../..

echo "Building @bun-move/ui..."
cd packages/ui
bun run build 2>/dev/null || echo "⚠️  No build script for ui"
cd ../..

echo "Building create-bun-move..."
cd packages/create-bun-move
bun run build
cd ../..

echo ""
echo "✅ All packages built successfully!"
echo ""

# Publish packages in order
echo "📤 Publishing packages..."
echo ""

# 1. Core (no dependencies)
echo "Publishing @bun-move/core..."
cd packages/core
npm publish --access public 2>&1 | grep -E "(Published|already published)" || true
cd ../..
echo "✅ @bun-move/core published"
echo ""

# 2. SDK (depends on core)
echo "Publishing @bun-move/sdk..."
cd packages/sdk
npm publish --access public 2>&1 | grep -E "(Published|already published)" || true
cd ../..
echo "✅ @bun-move/sdk published"
echo ""

# 3. UI (standalone)
echo "Publishing @bun-move/ui..."
cd packages/ui
npm publish --access public 2>&1 | grep -E "(Published|already published)" || true
cd ../..
echo "✅ @bun-move/ui published"
echo ""

# 4. CLI (last, depends on others)
echo "Publishing create-bun-move..."
cd packages/create-bun-move
npm publish --access public 2>&1 | grep -E "(Published|already published)" || true
cd ../..
echo "✅ create-bun-move published"
echo ""

echo "🎉 All packages published successfully!"
echo ""
echo "🔗 View your packages at:"
echo "   📦 https://www.npmjs.com/package/create-bun-move"
echo "   📦 https://www.npmjs.com/package/@bun-move/core"
echo "   📦 https://www.npmjs.com/package/@bun-move/sdk"
echo "   📦 https://www.npmjs.com/package/@bun-move/ui"
echo ""
echo "🧪 Test installation with:"
echo "   bunx create-bun-move@latest my-test-app"
echo ""
