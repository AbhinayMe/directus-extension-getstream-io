# Publishing and CI

This document contains the full instructions for CI publishing, the
GitHub Actions workflow, required repository secrets, and local
verification steps.

## Workflow

- Path: `.github/workflows/publish.yml`
- Triggers:
  - **Automatic:** `push` to the `publish` branch
  - **Manual:** `workflow_dispatch` (manual trigger from GitHub Actions UI)
- Steps run by CI: install deps, **auto-generate version**, build, run tests, lint, `npm publish`, and **create GitHub Release**.

## What Happens When You Publish

Each publish automatically:

1. **Generates version** — Creates unique date-based version with counter (e.g., `2025.10.30-001`)
2. **Updates package.json** — Sets the new version
3. **Builds & tests** — Runs full build, test suite, and linting
4. **Publishes to npm** — Uploads package to npmjs.com
5. **Creates git tag** — Tags the release (e.g., `v2025.10.30-001`)
6. **Creates GitHub Release** — Generates release page with notes and install instructions

## Automatic Versioning

The workflow automatically generates version numbers based on the current date with a sequential counter:

**Format:** `YYYY.M.D-NNN`

**Examples:**

- `2025.10.30-001` — First release on Oct 30, 2025
- `2025.10.30-002` — Second release on Oct 30, 2025
- `2025.12.1-001` — First release on Dec 1, 2025

**Why date-based versioning with counters?**

- ✅ No manual version bumps needed
- ✅ Every publish gets a unique version
- ✅ Version indicates when it was published
- ✅ Sequential counter shows release order for the day
- ✅ No version conflicts

The workflow automatically updates `package.json` before publishing, so you don't need to manually bump versions.

## Required secret

- `NPM_TOKEN` — an npm access token with publish rights.

**Recommended:** Use a **Granular Access Token** (more secure, scoped permissions).

**Alternative:** Classic "Automation" token (legacy, broader permissions).

Add the token to the repository: GitHub → Settings → Secrets and
variables → Actions → New repository secret. Name: `NPM_TOKEN`.

## Local verification

Run the commands CI runs to catch issues before pushing to `publish`:

```bash
# Install dependencies
yarn install --frozen-lockfile

# Build, test and lint
yarn build
yarn test
yarn lint
```

## Versioning and safe publishes

The CI workflow automatically generates and sets the version - **you don't need to manually bump versions**.

If you prefer manual versioning, you can still bump versions before pushing:

```bash
npm version patch   # or minor, major
git push origin publish --follow-tags
```

However, the CI will override this with the auto-generated date-based version.

## Notes and safety

- The workflow is designed to abort when `NPM_TOKEN` is not present to
  avoid accidental public publish.
- Do not commit `.npmrc` or tokens to the repository. Use GitHub Secrets
  for credentials instead.

## How to Trigger Publishing

### Method 1: Automatic (Push to `publish` branch)

Merge a PR into the `publish` branch or push directly:

```bash
git checkout publish
git merge main
git push origin publish
```

The workflow will automatically trigger and publish.

### Method 2: Manual (workflow_dispatch)

Trigger a publish manually from the GitHub Actions UI:

1. Go to your repository on GitHub
2. Click **Actions** tab
3. Select **Publish to npm on publish branch** workflow (left sidebar)
4. Click **Run workflow** button (top right)
5. Select branch (usually `main` or `publish`)
6. Optionally enter a reason (e.g., "Hotfix release")
7. Click **Run workflow**

The workflow will run with the code from the selected branch and publish
whatever version is in `package.json`.

**⚠️ Note:** The workflow will auto-generate a date-based version, so you
don't need to manually bump the version before publishing.

## Creating an npm Access Token

### Option 1: Granular Access Token (Recommended ✅)

Granular tokens provide scoped, fine-grained permissions for better security.

**Steps:**

1. Go to [npmjs.com](https://www.npmjs.com/) and sign in
2. Click your profile icon → **Access Tokens**
3. Click **Generate New Token** → Select **Granular Access Token**
4. Configure the token:
   - **Token name:** `directus-extension-getstream-io-publish` (or any name)
   - **Expiration:** Choose duration or "No expiration"
   - **Packages and scopes:** Select **Read and write**
   - **Select packages:** Choose `directus-extension-getstream-io`
   - **Organizations:** (leave default unless publishing under org)
5. Click **Generate Token**
6. Copy the token immediately (you won't see it again)
7. Add to GitHub: Repository → Settings → Secrets and variables → Actions →
   New repository secret → Name: `NPM_TOKEN`, Value: (paste token)

**Permissions needed:**

- Packages and scopes: **Read and write**
- Specific package: `directus-extension-getstream-io`

### Option 2: Classic Automation Token (Legacy)

Classic tokens have broader access to all your packages but are simpler to set up.

**Steps:**

1. Go to [npmjs.com](https://www.npmjs.com/) and sign in
2. Click your profile icon → **Access Tokens**
3. Click **Generate New Token** → Select **Automation**
4. Copy the token
5. Add to GitHub: Repository → Settings → Secrets and variables → Actions →
   New repository secret → Name: `NPM_TOKEN`, Value: (paste token)

**Note:** Automation tokens can publish to all packages in your account.

## Version Management
