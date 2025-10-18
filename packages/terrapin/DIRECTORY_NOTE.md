# 📁 Directory Name Note

## Current State

**Physical Directory**: `packages/sui-playwright/`
**Package Name**: `@tortoiseos/terrapin`
**Documentation**: All references updated to `packages/terrapin`

---

## Why the Discrepancy?

The physical directory is still named `sui-playwright` but all **user-facing** references use `terrapin`:

✅ `package.json` → `@tortoiseos/terrapin`
✅ `repository.directory` → `packages/terrapin`
✅ `homepage` → `.../packages/terrapin`
✅ All documentation → `cd packages/terrapin`
✅ All imports → `from '@tortoiseos/terrapin'`

---

## To Rename Physical Directory (Optional)

If you want to rename the actual folder:

```bash
cd /Users/decebaldobrica/Projects/blockchain/bun-move/packages
mv sui-playwright terrapin
```

Then update:
1. Root `package.json` workspace paths (if any)
2. Any local import paths in other packages
3. CI/CD scripts that reference the path

---

## Current Approach: Documentation-First

**Pros:**
- ✅ No risk of breaking imports
- ✅ Package works perfectly as `@tortoiseos/terrapin`
- ✅ All user-facing content is correct
- ✅ npm publishes with correct name

**Cons:**
- ⚠️ Local developers see `sui-playwright` folder
- ⚠️ Git history shows old name

---

## Recommendation

For now, the documentation-first approach is **safe and functional**. The physical directory name is internal and doesn't affect:
- Package installation (`bun add @tortoiseos/terrapin`)
- Package imports (`from '@tortoiseos/terrapin'`)
- Published package name
- User documentation

You can rename the physical directory later when convenient, or keep it as-is since it's just an internal detail.

---

**Current Status**: ✅ **Fully functional** as `@tortoiseos/terrapin`

The terrapin swims smoothly! 🐢💧
