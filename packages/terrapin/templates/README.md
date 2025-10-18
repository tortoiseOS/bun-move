# CI/CD Templates for @tortoiseos/terrapin

Ready-to-use CI/CD configurations for running Sui dApp E2E tests.

## Available Templates

### 1. GitHub Actions (`github-actions.yml`)

**Usage:**
```bash
# Copy to your repository
cp node_modules/@tortoiseos/terrapin/templates/github-actions.yml .github/workflows/e2e.yml

# Commit and push
git add .github/workflows/e2e.yml
git commit -m "Add E2E testing workflow"
git push
```

**Features:**
- ✅ Runs on push and PR
- ✅ Matrix testing (multiple browsers)
- ✅ Uploads test reports
- ✅ Comments on PRs with results
- ✅ Publishes reports to GitHub Pages
- ✅ Sui localnet setup included

### 2. GitLab CI (`gitlab-ci.yml`)

**Usage:**
```bash
# Copy to your repository
cp node_modules/@tortoiseos/terrapin/templates/gitlab-ci.yml .gitlab-ci.yml

# Commit and push
git add .gitlab-ci.yml
git commit -m "Add E2E testing pipeline"
git push
```

**Features:**
- ✅ Multi-stage pipeline
- ✅ Caching for faster runs
- ✅ Artifact uploads
- ✅ Pages deployment
- ✅ JUnit reports

## Customization

### Change Test Command

Both templates use `bun run test:e2e` by default (recommended). Update if you're using a different package manager:

```yaml
# Bun (default - recommended)
- bun run test:e2e

# npm
- npm run test:e2e

# pnpm
- pnpm test:e2e

# Yarn
- yarn test:e2e
```

### Add Multiple Browsers

GitHub Actions:
```yaml
matrix:
  browser: [chromium, firefox, webkit]
```

### Change Runtime Version

Templates use Bun by default. To switch to Node.js:

```yaml
# GitHub Actions - Switch to Node.js
- uses: actions/setup-node@v4
  with:
    node-version: '20'

# GitLab CI - Switch to Node.js
image: node:20

# Or use specific Bun version
# GitHub Actions
- uses: oven-sh/setup-bun@v1
  with:
    bun-version: '1.1.29'

# GitLab CI
image: oven/bun:1.1.29
```

### Run on Schedule

GitHub Actions - add to `on:` section:
```yaml
on:
  schedule:
    - cron: '0 2 * * *'  # Run at 2 AM daily
```

## Secrets Configuration

If you need environment secrets:

### GitHub Actions
1. Go to Settings → Secrets and variables → Actions
2. Add secrets (e.g., `SUI_PRIVATE_KEY`)
3. Use in workflow:
```yaml
env:
  SUI_PRIVATE_KEY: ${{ secrets.SUI_PRIVATE_KEY }}
```

### GitLab CI
1. Go to Settings → CI/CD → Variables
2. Add variables
3. They're automatically available

## Viewing Test Results

### GitHub Actions
- View in Actions tab
- Download artifacts from workflow run
- View Pages deployment (if enabled)

### GitLab CI
- View in CI/CD → Pipelines
- Browse artifacts
- Visit Pages URL (Settings → Pages)

## Troubleshooting

### Tests timeout
Increase timeout in workflow:
```yaml
timeout-minutes: 30  # Default is 15
```

### Sui localnet fails to start
Add debug output:
```yaml
- name: Debug Sui
  run: |
    sui client --help
    sui genesis --help
```

### Out of disk space
Clean cache between runs:
```yaml
- name: Clean cache
  run: rm -rf node_modules/.cache
```

## Need Help?

- [Playwright CI Documentation](https://playwright.dev/docs/ci)
- [GitHub Actions Documentation](https://docs.github.com/actions)
- [GitLab CI Documentation](https://docs.gitlab.com/ee/ci/)
- [Report Issues](https://github.com/yourusername/bun-move/issues)
