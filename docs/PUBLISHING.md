# Publishing and CI/CD

This document explains the automated publishing workflow, version management, and how to publish releases.

## Overview

**Workflow:** `.github/workflows/publish.yml`

**Triggers:**

- **Automatic:** Push to `publish` branch
- **Manual:** GitHub Actions UI with `workflow_dispatch`

**What happens on publish:**

1. Generates date-based version (`YYYY.M.D-NNN`)
2. Updates `package.json` with new version
3. Builds, tests, and lints the code
4. Publishes to npm registry
5. Creates git tag (e.g., `v2025.10.30-001`)
6. Creates GitHub Release with auto-generated notes

## Automatic Versioning

Versions are generated automatically using date-based format with sequential counters.

**Format:** `YYYY.M.D-NNN`

**Examples:**

- `2025.10.30-001` — First release on Oct 30, 2025
- `2025.10.30-002` — Second release on Oct 30, 2025
- `2025.12.1-001` — First release on Dec 1, 2025

**Benefits:**

- ✅ No manual version bumps needed
- ✅ Every publish gets a unique version
- ✅ Version indicates release date
- ✅ Sequential counter shows release order
- ✅ No version conflicts
- ✅ Leading zeros preserved (`001`, `002`, `003`)

**How it works:**

1. Queries npm registry for today's published versions
2. Checks git tags for today's releases
3. Uses the higher count to avoid conflicts
4. Increments counter with leading zeros
5. Verifies version doesn't exist before publishing
6. Updates `package.json` using `jq` (preserves leading zeros)

## How to Publish

### Before Publishing

1. **Update CHANGELOG** — Add changes to `[Unreleased]` section in `docs/CHANGELOG.md`
2. **Run changelog script** — Execute `yarn changelog` to version the changelog
3. **Commit changes** — Commit the updated CHANGELOG and package.json
4. **Verify locally** — Run `yarn build && yarn test && yarn lint`

### Method 1: Push to `publish` Branch (Recommended)

```bash
# Update CHANGELOG first
yarn changelog

# Review and commit
git add docs/CHANGELOG.md package.json
git commit -m "chore: update changelog for release"

# Merge to publish branch
git checkout publish
git merge main
git push origin publish
```

The workflow automatically handles versioning and publishing.

### Method 2: Manual Trigger via GitHub Actions

1. Go to repository → **Actions** tab
2. Select **"Publish to npm on publish branch"** workflow
3. Click **"Run workflow"** button
4. Select branch (usually `main` or `publish`)
5. Optionally enter reason (e.g., "Hotfix release")
6. Click **"Run workflow"**

## Required Secrets

**`NPM_TOKEN`** — npm access token with publish permissions

Add to GitHub: Repository → Settings → Secrets and variables → Actions → New repository secret

### Creating npm Access Token

**Option 1: Granular Access Token (Recommended ✅)**

More secure with scoped permissions.

1. Go to [npmjs.com](https://www.npmjs.com/) → Sign in
2. Profile icon → **Access Tokens** → **Generate New Token**
3. Select **Granular Access Token**
4. Configure:
   - **Token name:** `directus-extension-getstream-io-publish`
   - **Expiration:** Choose duration or "No expiration"
   - **Packages and scopes:** **Read and write**
   - **Select packages:** `directus-extension-getstream-io`
5. Click **Generate Token** and copy immediately
6. Add to GitHub as `NPM_TOKEN` secret

**Option 2: Classic Automation Token**

Simpler but has broader access to all your packages.

1. Go to [npmjs.com](https://www.npmjs.com/) → Sign in
2. Profile icon → **Access Tokens** → **Generate New Token**
3. Select **Automation**
4. Copy token and add to GitHub as `NPM_TOKEN` secret

## Local Verification

Test locally before pushing to `publish` branch:

```bash
# Install dependencies
yarn install --frozen-lockfile

# Run all checks
yarn build
yarn test
yarn lint
```

## Notes and Best Practices

- ✅ Always update CHANGELOG before publishing (`yarn changelog`)
- ✅ Verify tests pass locally before pushing
- ✅ Use Granular Access Tokens for better security
- ⚠️ Never commit `.npmrc` or tokens to the repository
- ⚠️ The workflow aborts if `NPM_TOKEN` is not set
- 💡 CI auto-generates versions - no manual version bumps needed
- 💡 GitHub Releases are created automatically with each publish
