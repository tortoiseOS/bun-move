# NPM Publishing Audit - TortoiseOS Packages

## 📊 Package Readiness Status

### ✅ Ready to Publish

#### 1. **@tortoise-os/create-bun-move**
- **Location**: `packages/create-bun-move/`
- **Version**: 0.1.0
- **Scope**: ✅ @tortoise-os
- **Built**: ✅ dist/index.js (320 KB)
- **Repository**: ✅ https://github.com/tortoise-os/bun-move
- **PublishConfig**: ✅ access: public
- **README**: ✅ Complete
- **Status**: **READY** - Can publish now

#### 2. **@tortoiseos/terrapin** (sui-playwright)
- **Location**: `packages/sui-playwright/`
- **Version**: 0.2.0
- **Scope**: ⚠️ @tortoiseos (should be @tortoise-os)
- **Built**: ✅ dist/ (index.js, index.mjs, index.d.ts)
- **Repository**: ✅ Configured
- **README**: ✅ Complete
- **Status**: **NEEDS SCOPE UPDATE**

---

### ⚠️ Needs Updates Before Publishing

#### 3. **@bun-move/core**
- **Location**: `packages/core/`
- **Issues**:
  - ❌ Scope: `@bun-move` → needs `@tortoise-os`
  - ❌ No repository/homepage/bugs fields
  - ❌ No publishConfig
  - ❌ No README.md
  - ⚠️ Exports src/index.ts (no build step)
- **Fix needed**: Full npm metadata + README

#### 4. **@bun-move/sdk**
- **Location**: `packages/sdk/`
- **Issues**:
  - ❌ Scope: `@bun-move` → needs `@tortoise-os`
  - ❌ No repository/homepage/bugs fields
  - ❌ No publishConfig
  - ❌ No README.md
  - ⚠️ Exports src/index.ts
- **Fix needed**: Full npm metadata + README

#### 5. **@bun-move/hooks**
- **Location**: `packages/hooks/`
- **Issues**:
  - ❌ Scope: `@bun-move` → needs `@tortoise-os`
  - ❌ No repository/homepage/bugs fields
  - ❌ No publishConfig
  - ✅ Has README.md
  - ⚠️ Exports src/index.ts
- **Fix needed**: Scope + npm metadata

#### 6. **@bun-move/components**
- **Location**: `packages/components/`
- **Issues**:
  - ❌ Scope: `@bun-move` → needs `@tortoise-os`
  - ❌ No repository/homepage/bugs fields
  - ❌ No publishConfig
  - ✅ Has README.md
  - ⚠️ Exports src/index.ts
- **Fix needed**: Scope + npm metadata

#### 7. **@bun-move/ui**
- **Location**: `packages/ui/`
- **Issues**:
  - ❌ Scope: `@bun-move` → needs `@tortoise-os`
  - ❌ No repository/homepage/bugs fields
  - ❌ No publishConfig
  - ❌ No README.md
  - ❌ No keywords
  - ⚠️ Exports src/index.ts
- **Fix needed**: Full npm metadata + README

#### 8. **@bun-move/burner-wallet**
- **Location**: `packages/burner-wallet/`
- **Issues**:
  - ❌ Scope: `@bun-move` → needs `@tortoise-os`
  - ❌ No repository/homepage/bugs fields
  - ❌ No publishConfig
  - ✅ Has README.md
  - ⚠️ Exports src/index.ts
- **Fix needed**: Scope + npm metadata

#### 9. **@bun-move/ai-integration**
- **Location**: `packages/ai-integration/`
- **Issues**:
  - ❌ Scope: `@bun-move` → needs `@tortoise-os`
  - ❌ No repository/homepage/bugs fields
  - ❌ No publishConfig
  - ✅ Has README.md
  - ⚠️ Exports src/index.ts
- **Fix needed**: Scope + npm metadata

---

## 🔧 Required Updates for All Packages

### 1. **Scope Change**
Change from `@bun-move` to `@tortoise-os` for consistency with npm org:
```json
{
  "name": "@tortoise-os/package-name"
}
```

### 2. **Repository Metadata**
Add to all package.json files:
```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/tortoise-os/bun-move.git",
    "directory": "packages/package-name"
  },
  "homepage": "https://github.com/tortoise-os/bun-move/tree/main/packages/package-name",
  "bugs": {
    "url": "https://github.com/tortoise-os/bun-move/issues"
  },
  "author": "TortoiseOS Team",
  "publishConfig": {
    "access": "public"
  }
}
```

### 3. **Source vs Build Strategy**

**Current**: Most packages export `./src/index.ts` directly (Bun-first approach)
**For npm**: Need to decide:
- Option A: Build all packages with tsup/tsc to dist/
- Option B: Publish TypeScript source (less common, but works with Bun)
- Option C: **Hybrid**: Mark as bun-first with TypeScript source, but provide compiled versions

**Recommendation**: Option C
```json
{
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "bun": "./src/index.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    }
  },
  "files": [
    "dist",
    "src",
    "README.md"
  ]
}
```

---

## 📝 Publishing Priority Order

### Tier 1: Publish Immediately
1. ✅ **@tortoise-os/create-bun-move** - READY NOW

### Tier 2: Update & Publish Soon (Core Infrastructure)
2. **@tortoise-os/terrapin** - Just needs scope update
3. **@tortoise-os/core** - Foundation for all others
4. **@tortoise-os/sdk** - SDK depends on core

### Tier 3: After Core is Published
5. **@tortoise-os/hooks** - Depends on core + move
6. **@tortoise-os/components** - Depends on hooks + core
7. **@tortoise-os/ui** - UI library

### Tier 4: Specialized Packages
8. **@tortoise-os/burner-wallet** - Dev tool
9. **@tortoise-os/ai-integration** - AI utilities

---

## 🚀 Quick Fix Script

To update all packages at once:

```bash
# Update package scopes
for pkg in packages/*/package.json; do
  [ "$pkg" = "packages/create-bun-move/package.json" ] && continue
  [ "$pkg" = "packages/sui-playwright/package.json" ] && continue
  [ "$pkg" = "packages/move/package.json" ] && continue

  # Update scope
  sed -i '' 's/@bun-move\//@tortoise-os\//g' "$pkg"

  # Add repository field before license
  # (requires manual JSON editing per file)
done
```

---

## 📋 Checklist Before Publishing

For each package:
- [ ] Scope is `@tortoise-os`
- [ ] Repository, homepage, bugs fields added
- [ ] publishConfig.access = "public"
- [ ] README.md exists and is complete
- [ ] Version number is appropriate
- [ ] Build step completed (if applicable)
- [ ] Test locally: `npm publish --dry-run`
- [ ] Login to npm: `npm whoami` → decebal
- [ ] Publish: `npm publish --access public`

---

## 🎯 Current Status Summary

| Package | Scope | Metadata | README | Build | Status |
|---------|-------|----------|--------|-------|--------|
| create-bun-move | ✅ | ✅ | ✅ | ✅ | **READY** |
| terrapin | ⚠️ | ✅ | ✅ | ✅ | Needs scope |
| core | ❌ | ❌ | ❌ | N/A | Not ready |
| sdk | ❌ | ❌ | ❌ | N/A | Not ready |
| hooks | ❌ | ❌ | ✅ | N/A | Not ready |
| components | ❌ | ❌ | ✅ | N/A | Not ready |
| ui | ❌ | ❌ | ❌ | N/A | Not ready |
| burner-wallet | ❌ | ❌ | ✅ | N/A | Not ready |
| ai-integration | ❌ | ❌ | ✅ | N/A | Not ready |

---

**Next Step**: Publish `@tortoise-os/create-bun-move` immediately, then systematically update the other packages.
