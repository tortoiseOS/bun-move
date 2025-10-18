# 🚀 Publishing Guide - TortoiseOS Packages

## Using Changesets (Recommended)

We use Changesets to manage versioning and publishing from the monorepo root.

### Quick Start

```bash
# 1. Publish all packages at once
bun run release

# That's it! This will:
# - Build all packages
# - Publish to npm with the @tortoise-os scope
# - Update package versions
# - Create git tags
```

### Manual Steps (if needed)

```bash
# 1. Create a changeset (if you made changes)
bun run changeset

# 2. Version packages (updates package.json versions)
bun run version

# 3. Build all packages
bun run build

# 4. Publish to npm
bun run release
```

## How Changesets Work

### Creating a Changeset

When you make changes:

```bash
bun run changeset
```

This will ask:
1. Which packages changed?
2. What type of change? (major/minor/patch)
3. Description of the change

### Publishing Flow

```bash
# Update versions based on changesets
bun run version

# Build and publish
bun run release
```

## Publishing Individual Packages

If you need to publish a single package:

```bash
cd packages/PACKAGE_NAME
npm publish --access public
```

## First Time Setup

Already done! ✅

- Changesets installed
- Config set to `"access": "public"`
- Initial changeset created
- All packages ready

## Current Packages

All packages are configured with:
- ✅ Scope: `@tortoise-os`
- ✅ Repository metadata
- ✅ `publishConfig.access = "public"`
- ✅ Awesome READMEs

### Package List

1. `@tortoise-os/create-bun-move` - CLI tool
2. `@tortoise-os/terrapin` - Playwright testing
3. `@tortoise-os/core` - Core utilities
4. `@tortoise-os/sdk` - TypeScript SDK
5. `@tortoise-os/hooks` - React hooks
6. `@tortoise-os/components` - UI components
7. `@tortoise-os/ui` - Magic UI
8. `@tortoise-os/burner-wallet` - Dev wallet
9. `@tortoise-os/ai-integration` - AI utilities
10. `@tortoise-os/move` - Move contracts
11. `@tortoise-os/move-deployer` - Move deployer

## Scripts Available

```json
{
  "changeset": "changeset",          // Create new changeset
  "version": "changeset version",    // Update package versions
  "release": "bun run build && changeset publish"  // Build & publish
}
```

## Troubleshooting

### "Package is private"
Make sure you're running from the package directory, not root. Or use `bun run release`.

### "Not authorized"
Login to npm: `npm login`

### "Package already exists"
Version conflict - run `bun run version` to bump versions.

## Best Practices

1. **Always create changesets** for user-facing changes
2. **Test locally** before publishing (`npm pack`)
3. **Use semantic versioning** (major.minor.patch)
4. **Document breaking changes** in changeset descriptions
5. **Publish from main branch** for stability

## Example Workflow

```bash
# After making changes to packages

# 1. Create changeset
bun run changeset
# Select: @tortoise-os/sdk
# Type: patch (bug fix) / minor (feature) / major (breaking)
# Describe: "Add new method for pool queries"

# 2. Commit changeset
git add .changeset/
git commit -m "Add changeset for SDK pool query"

# 3. When ready to release
bun run version        # Updates versions
git add .
git commit -m "Version packages"

# 4. Publish
bun run release        # Publishes to npm

# 5. Push changes
git push --follow-tags
```

---

**Now you can publish from the root just like bun-eth!** 🐢🚀
