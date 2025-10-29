````instructions
# GitHub Copilot Instructions for Directus GetStream Extension

## Project Overview

This is a **published Directus custom endpoint extension** that generates Stream video authentication tokens (both user tokens and call tokens) using the official `@stream-io/node-sdk`.

**Package**: `directus-extension-getstream-io` (published on NPM)
**Status**: ✅ Production-ready and available on [Directus Marketplace](https://directus.io/extensions)

**CI/CD**: Fully automated publishing with GitHub Actions
- Auto-versioning with date-based format (`YYYY.M.D-NNN`)
- Automatic npm publishing on push to `publish` branch
- GitHub Releases with changelog integration
- Status badges in README

### Technology Stack

- **Runtime**: Node.js 22+
- **Language**: TypeScript (strict mode)
- **Framework**: Directus Extensions SDK v16.0.2
- **Package Manager**: Yarn v1.22.22
- **SDK**: @stream-io/node-sdk v0.7.15
- **Testing**: Jest with ESM support (17 tests)
- **Build Tool**: Directus Extension CLI (Rollup-based)
- **Code Formatter**: Prettier 3.6.2

## Code Style & Conventions

### TypeScript

- Use strict TypeScript with explicit types
- Prefer interfaces over types for object shapes
- Always export interfaces used in public APIs
- Use JSDoc comments for all public functions
- Include `@see` links to official Stream documentation
- Use async/await over promises `.then()`

### Naming Conventions

- **Files**: kebab-case (e.g., `streamio.ts`, `stream-token.ts`)
- **Functions**: camelCase (e.g., `generateUserToken`, `validateStreamConfig`)
- **Interfaces**: PascalCase with descriptive names (e.g., `StreamTokenConfig`, `StreamCallTokenConfig`)
- **Constants**: UPPER_SNAKE_CASE for environment variables
- **Types**: PascalCase (e.g., `StreamTokenResponse`)

### Code Formatting

- **Style Guide**: Prettier configuration enforced
- **Indentation**: 2 spaces
- **Quotes**: Single quotes
- **Line Length**: 80 characters
- **Semicolons**: Required
- **Format Command**: `yarn format` (formats all .ts, .js, .json, .md files)
- **Check Command**: `yarn format:check` (CI/CD validation)

### Code Organization

```
src/
  ├── index.ts          # Directus endpoint definitions (Express-like routes)
  └── streamio.ts       # Core Stream token generation logic
tests/
  └── streamio.test.ts  # Jest unit tests
scripts/
  ├── update-changelog.sh  # Automate CHANGELOG.md versioning
  └── README.md            # Scripts documentation
docs/
  ├── API.md               # Complete endpoint documentation
  ├── PUBLISHING.md        # CI/CD and publishing guide
  ├── TROUBLESHOOTING.md   # Common issues and solutions
  └── CHANGELOG.md         # Version history
```

### Automation Scripts

**`scripts/update-changelog.sh`** — Automates CHANGELOG.md updates

Usage:
```bash
yarn changelog  # Run the script
```

What it does:
- Generates next version based on date and git tags
- Moves `[Unreleased]` content to new version section
- Updates version comparison links
- Resets `[Unreleased]` with empty subsections

See `scripts/README.md` for detailed documentation.

## Directus Extension Guidelines

### Endpoint Definition Pattern

```typescript
import { defineEndpoint } from '@directus/extensions-sdk';
import { createError } from '@directus/errors';

export default defineEndpoint((router, context) => {
  const { env, logger } = context;

  router.get('/path', (req, res) => {
    // Handler logic with logger.info/error
  });

  router.post('/path', async (req, res, next) => {
    try {
      // Async handler with error handling
    } catch (error) {
      logger.error({ error }, 'Error message');
      next(error);
    }
  });
});
```

### Response Patterns

- **Success**: `res.json({ ...data })`
- **Client Error**: Throw Directus error: `throw new MissingFieldError()`
- **Server Error**: Throw Directus error: `throw new InternalServerError()`
- **Configuration Error**: Log and throw: `logger.error({...}); throw new ConfigurationError({...})`

### Environment Variables

- Use `context.env` from Directus instead of `process.env`
- Always check configuration with `validateStreamConfig(env)` before token generation
- Use `env.STREAMIO_API_KEY` and `env.STREAMIO_API_SECRET`
- Never log or expose secrets in responses

### Logging

- Use `context.logger` (Pino) instead of `console.log/error`
- Log with structured data: `logger.info({ userId, type: 'user' }, 'Message')`
- Log errors: `logger.error({ error, context }, 'Error message')`
- Never log tokens or secrets

### Error Handling

- Use `@directus/errors` package for consistent error responses
- Create custom errors with `createError(code, message, status)`
- Pass errors to Express middleware with `next(error)`
- Directus automatically formats error responses

## Stream API Integration

### Token Types

**User Tokens** - For user authentication:

```typescript
client.generateUserToken({
  user_id: string,
  validity_in_seconds: number, // Optional, default 1 hour
});
```

**Call Tokens** - For call-specific access:

```typescript
client.generateCallToken({
  user_id: string,
  call_cids: string[],          // Format: "type:id" e.g., "default:call1"
  role?: string,                // Optional: "admin", "moderator"
  validity_in_seconds?: number  // Optional, default 1 hour
});
```

### Important Notes

- Default token validity: 1 hour (Stream API default)
- Call tokens grant **additional** access, not restrictions
- Call IDs format: `{type}:{id}` (e.g., `default:call1`, `livestream:meeting123`)
- Valid roles: `admin`, `moderator`, `user` (default)

### Official Documentation

- User Tokens: https://getstream.io/video/docs/api/authentication/#user-tokens
- Call Tokens: https://getstream.io/video/docs/api/authentication/#call-tokens
- Node SDK: https://github.com/GetStream/stream-video-js/tree/main/packages/node-sdk

## Testing Guidelines

### Test Structure

- Use `describe` blocks to group related tests
- Test both success and error cases
- Mock environment variables with `beforeEach` and `afterAll`
- Use descriptive test names: `should [expected behavior] when [condition]`

### Running Tests

```bash
yarn test           # Run all tests
yarn test --watch   # Watch mode
yarn test --coverage # With coverage
```

### Key Test Patterns

```typescript
describe('functionName', () => {
  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  it('should return expected result when valid input', async () => {
    const result = await functionName(config);
    expect(result).toHaveProperty('expectedField');
  });

  it('should throw error when invalid input', async () => {
    await expect(functionName(badConfig)).rejects.toThrow('Expected error');
  });
});
```

## Build & Development

### Commands

```bash
yarn install        # Install dependencies
yarn build          # Build extension (production)
yarn dev            # Build with watch mode
yarn test           # Run tests
yarn lint           # Run ESLint
yarn validate       # Validate extension structure
yarn link           # Link to Directus instance
```

### Build Output

- Extension bundles to `dist/index.js`
- Uses Rollup (via Directus CLI)
- ESM format required

## Security Best Practices

### Environment Variables

- Never commit `.env` files
- Always use `.env.example` for templates
- Validate all credentials before use
- Use non-null assertion (`!`) only after validation

### Input Validation

- Always validate required fields in request body
- Check array lengths for `callIds`
- Sanitize user inputs
- Return appropriate HTTP status codes

### Error Handling

- Catch all errors in async handlers
- Log errors with `console.error` (goes to Directus logs)
- Never expose internal error details to clients
- Use generic error messages for security

### Token Security

- Tokens should only be generated server-side
- Use HTTPS in production
- Set appropriate token expiration times
- Never log tokens or secrets

## API Endpoint Standards

### Current Endpoints

1. **GET /getstream-io/health**
   - Purpose: Health check and configuration validation
   - Auth: None required
   - Response: Status, configuration state, available endpoints

2. **POST /getstream-io/userToken**
   - Purpose: Generate user authentication token
   - Body: `{ userId: string, expirationSeconds?: number }`
   - Response: Token with metadata

3. **POST /getstream-io/callToken**
   - Purpose: Generate call-specific token
   - Body: `{ userId: string, callIds: string[], role?: string, expirationSeconds?: number }`
   - Response: Token with call metadata

4. **POST /getstream-io/generate** (Deprecated)
   - Purpose: Legacy user token endpoint
   - Use `/userToken` instead

### Adding New Endpoints

- Follow RESTful conventions
- Use proper HTTP methods (GET for reads, POST for creates)
- Include JSDoc comments with request/response examples
- Add validation for all required fields
- Update health endpoint's `endpoints` array
- Write tests before implementation

## Common Tasks

### Adding a New Token Type

1. Create new config interface in `streamio.ts`
2. Implement generation function with full error handling
3. Add JSDoc with `@see` link to Stream docs
4. Create new endpoint in `index.ts`
5. Write comprehensive tests
6. Update README.md
7. Run `yarn build && yarn test && yarn validate`

### Updating Dependencies

```bash
yarn add <package>@<version>      # Add production dependency
yarn add -D <package>@<version>   # Add dev dependency
yarn upgrade <package>@<version>  # Upgrade existing package
```

### Debugging

- Check Directus logs for server-side errors
- Use `/health` endpoint to verify configuration
- Test with curl before client integration
- Enable Directus `EXTENSIONS_AUTO_RELOAD=true` for development

## Package.json Scripts

```json
{
  "build": "directus-extension build",
  "dev": "directus-extension build -w --no-minify",
  "link": "directus-extension link",
  "validate": "directus-extension validate",
  "test": "node --experimental-vm-modules $(yarn bin jest)",
  "lint": "eslint src --ext .ts",
  "format": "prettier --write \"**/*.{ts,js,json,md}\"",
  "format:check": "prettier --check \"**/*.{ts,js,json,md}\"",
  "changelog": "scripts/update-changelog.sh"
}
```

### Available Commands

```bash
yarn build           # Build extension (production)
yarn dev             # Build with watch mode
yarn test            # Run tests
yarn lint            # Run ESLint
yarn format          # Format all files with Prettier
yarn format:check    # Check formatting (CI/CD)
yarn validate        # Validate extension structure
yarn link            # Link to Directus instance
yarn changelog       # Update CHANGELOG.md with new version
```

## Key Dependencies

- `@stream-io/node-sdk`: ^0.7.15 - Official Stream Video SDK
- `@directus/extensions-sdk`: 16.0.2 - Directus extension framework
- `@directus/errors`: ^2.0.4 - Directus error handling
- `typescript`: ^5.9.3 - TypeScript compiler
- `jest`: ^29.7.0 - Testing framework
- `eslint`: ^8.57.0 - Linting
- `prettier`: 3.6.2 - Code formatting

## Error Handling Patterns

### Custom Directus Errors

```typescript
import { createError } from '@directus/errors';

const MissingUserIdError = createError(
  'MISSING_USER_ID',
  'userId is required in request body',
  400
);
```

### Validation Errors (400)

```typescript
if (!userId) {
  throw new MissingUserIdError();
}
```

### Configuration Errors (500)

```typescript
const config = validateStreamConfig(env);
if (!config.valid) {
  logger.error({ details: config.errors }, 'Configuration invalid');
  throw new ConfigurationError({ details: config.errors });
}
```

### Runtime Errors (500)

```typescript
try {
  const token = await generateUserToken(config);
  logger.info({ userId, type: 'user' }, 'Token generated');
  res.json(token);
} catch (error) {
  logger.error({ error, userId }, 'Token generation failed');
  next(error);
}
```

## Documentation Standards

### Function Documentation

```typescript
/**
 * Brief description of what the function does
 *
 * Detailed explanation of behavior, defaults, and important notes.
 *
 * @param config - Description of parameter
 * @returns Promise resolving to description of return value
 * @throws Error if description of error conditions
 *
 * @see https://link-to-relevant-documentation
 */
export async function functionName(config: ConfigType): Promise<ReturnType> {
  // Implementation
}
```

### README Updates

- Keep API examples current
- Include curl examples for all endpoints
- Document all request/response fields in tables
- Add TypeScript interface definitions
- Link to official Stream and Directus docs
- Keep documentation concise and focused on essentials

## Maintenance Checklist

Before committing code:

- [ ] Run `yarn build` - ensure no build errors
- [ ] Run `yarn test` - all tests pass
- [ ] Run `yarn lint` - no linting errors
- [ ] Run `yarn format` - code properly formatted
- [ ] Run `yarn validate` - extension structure valid
- [ ] Update `docs/API.md` if API changed
- [ ] Update `docs/CHANGELOG.md` with changes (in `[Unreleased]` section)
- [ ] Check `.env.example` is up to date
- [ ] Verify no secrets in code or commits

Before publishing:

- [ ] All maintenance checks above passed
- [ ] `docs/CHANGELOG.md` updated with changes in `[Unreleased]` section
- [ ] All documentation in `docs/` folder is up to date
- [ ] Push to `publish` branch or trigger manual workflow
- [ ] CI/CD workflow will automatically:
  - Generate version (`YYYY.M.D-NNN`)
  - Build, test, and lint
  - Publish to npm
  - Create git tag
  - Create GitHub Release with changelog

## Release Package Management

### Versioning Strategy

This project uses **automated date-based versioning** with sequential daily counters.

**Format:** `YYYY.M.D-NNN`

**Examples:**
- `2025.10.30-001` — First release on October 30, 2025
- `2025.10.30-002` — Second release on October 30, 2025
- `2025.12.1-001` — First release on December 1, 2025

**Benefits:**
- ✅ No manual version bumps needed
- ✅ Every publish gets a unique version
- ✅ Version indicates release date
- ✅ Sequential counter shows release order per day
- ✅ No version conflicts
- ✅ Leading zeros preserved in package.json and npm

**Version Generation Process:**
1. Queries npm registry for existing versions published today
2. Checks git tags for releases created today
3. Uses the higher count to avoid conflicts
4. Increments counter and formats with leading zeros (`001`, `002`, etc.)
5. Verifies the version doesn't exist on npm before publishing
6. Uses `jq` to update package.json (not `npm version`) to preserve leading zeros

### Automated Release Workflow

The project uses GitHub Actions for fully automated publishing:

**Workflow:** `.github/workflows/publish.yml`

**Triggers:**
1. **Automatic:** Push to `publish` branch
2. **Manual:** GitHub Actions UI → Run workflow button

**What the workflow does:**
1. Generates date-based version with sequential counter (queries npm and git tags)
2. Updates `package.json` automatically using `jq` to preserve leading zeros
3. Runs build, tests, and linting
4. Publishes to npm with Granular Access Token
5. Creates git tag (e.g., `v2025.10.30-001`)
6. Creates GitHub Release with:
   - Package info and install command
   - Changelog from `docs/CHANGELOG.md` (`[Unreleased]` section)
   - Auto-generated commit notes

**GitHub Actions Permissions:**
- `contents: write` — Allows pushing tags and creating releases
- `packages: write` — Allows publishing packages
- `fetch-depth: 0` — Fetches all git history for version counting

### Publishing Process

**Important:** Always update `docs/CHANGELOG.md` before publishing!

Add your changes to the `[Unreleased]` section with appropriate subsections:
- `### Added` — New features
- `### Changed` — Changes to existing functionality
- `### Fixed` — Bug fixes
- `### Improved` — Performance or documentation improvements

#### Updating CHANGELOG (Choose One)

**Option 1: Manual Script (Recommended)**

Use the provided script to automatically update CHANGELOG with versioning:

```bash
# Add changes to [Unreleased] section in docs/CHANGELOG.md
# Then run:
yarn changelog

# Review the changes
git diff docs/CHANGELOG.md

# Commit and push
git add docs/CHANGELOG.md package.json
git commit -m "chore: update changelog for v2025.10.30-001"
git push origin publish
```

The script (`scripts/update-changelog.sh`):
- Generates version number based on date and git tags
- Moves `[Unreleased]` content to new version section
- Updates version comparison links
- Resets `[Unreleased]` with empty subsections

**Option 2: Manual Update**

Manually edit `docs/CHANGELOG.md` before publishing:
- Move `[Unreleased]` content to new `[VERSION]` section
- Add release date
- Reset `[Unreleased]` with empty subsections
- Update comparison links at bottom

#### Method 1: Push to `publish` branch (Recommended)

```bash
# Ensure changes are committed and pushed to main
git checkout main
git pull origin main

# Update CHANGELOG.md (use yarn changelog or manual edit)
yarn changelog

# Commit changelog
git add docs/CHANGELOG.md package.json
git commit -m "chore: update changelog"

# Push to publish branch to trigger release
git checkout publish
git merge main
git push origin publish
```

The CI/CD workflow automatically handles versioning and publishing.

#### Method 2: Manual Trigger via GitHub Actions UI

1. Go to repository → **Actions** tab
2. Select **"Publish to npm on publish branch"** workflow
3. Click **"Run workflow"** button
4. Select branch (usually `main` or `publish`)
5. Optionally enter reason (e.g., "Hotfix for memory leak")
6. Click **"Run workflow"**

**Note:** Ensure `docs/CHANGELOG.md` is updated before triggering.

### Required GitHub Secrets

**`NPM_TOKEN`** — npm access token for publishing

**Recommended:** Granular Access Token
- More secure with scoped permissions
- Create at [npmjs.com](https://www.npmjs.com/) → Access Tokens → Granular Access Token
- Permissions: **Read and write** for packages
- Select package: `directus-extension-getstream-io`

**Alternative:** Classic Automation token (legacy, broader access)

Add to GitHub: Repository → Settings → Secrets and variables → Actions → New repository secret

### Version History & Releases

- **GitHub Releases:** Auto-created with changelog and install instructions
- **Git Tags:** Created automatically (e.g., `v2025.10.30-001`)
- **npm Package:** Published automatically at each release
- **Changelog:** Maintained in `docs/CHANGELOG.md`

### Updating Documentation

All documentation is in the `docs/` folder:

- `docs/API.md` — Endpoint documentation with examples
- `docs/PUBLISHING.md` — CI/CD and publishing guide
- `docs/TROUBLESHOOTING.md` — Common issues and solutions
- `docs/CHANGELOG.md` — Version history and release notes

**Before each release:**
1. Update `docs/CHANGELOG.md` in the `[Unreleased]` section
2. Document new features under `### Added`
3. Document changes under `### Changed`
4. Document fixes under `### Fixed`

The workflow automatically extracts `[Unreleased]` section and includes it in GitHub Releases.

### NPM Package Management

#### Package Metadata

Ensure `package.json` includes:

```json
{
  "name": "directus-extension-getstream-io",
  "version": "1.0.0",
  "description": "Generate Stream video authentication tokens in Directus",
  "keywords": [
    "directus",
    "directus-extension",
    "directus-custom-endpoint",
    "stream",
    "getstream",
    "video",
    "authentication",
    "token",
    "jwt",
    "video-call",
    "streaming",
    "real-time"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/AbhinayMe/directus-extension-getstream-io.git"
  },
  "bugs": {
    "url": "https://github.com/AbhinayMe/directus-extension-getstream-io/issues"
  },
  "homepage": "https://github.com/AbhinayMe/directus-extension-getstream-io#readme",
  "author": "Your Name",
  "license": "MIT"
}
```

#### NPM Commands Reference

```bash
# View package info
npm view directus-extension-getstream-io

# View specific version
npm view directus-extension-getstream-io@1.0.0

# View all versions
npm view directus-extension-getstream-io versions

# View download stats
npm view directus-extension-getstream-io

# Deprecate a version (if needed)
npm deprecate directus-extension-getstream-io@1.0.0 "Use version 1.0.1 instead"

# Unpublish (only within 72 hours, avoid if possible)
npm unpublish directus-extension-getstream-io@1.0.0
```

### GitHub Release Best Practices

#### Release Notes Template

```markdown
## What's Changed

### ✨ Features
- Add new endpoint for batch token generation (#123)
- Support custom token expiration limits (#124)

### 🐛 Bug Fixes
- Fix token validation for special characters (#125)
- Resolve memory leak in token generation (#126)

### 📚 Documentation
- Update API examples in README (#127)
- Add troubleshooting guide (#128)

### 🔧 Maintenance
- Upgrade @stream-io/node-sdk to v0.7.16 (#129)
- Update dependencies for security patches (#130)

**Full Changelog**: https://github.com/AbhinayMe/directus-extension-getstream-io/compare/v1.0.0...v1.1.0
```

#### Using GitHub Actions for Automated Releases

Create `.github/workflows/release.yml`:

```yaml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          registry-url: 'https://registry.npmjs.org'

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Build
        run: yarn build

      - name: Test
        run: yarn test

      - name: Publish to NPM
        run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

      - name: Create GitHub Release
        uses: softprops/action-gh-release@v1
        with:
          generate_release_notes: true
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Hotfix Release Process

For critical bug fixes that need immediate release:

```bash
# 1. Create hotfix branch
git checkout -b hotfix/1.0.1

# 2. Make fixes
# ... edit files ...

# 3. Test thoroughly
yarn build && yarn test

# 4. Version bump (patch)
npm version patch

# 5. Merge to main
git checkout main
git merge hotfix/1.0.1

# 6. Push and publish
git push origin main --tags
npm publish --access public

# 7. Create GitHub release
gh release create v1.0.1 --title "v1.0.1 - Hotfix" --notes "Critical bug fixes"
```

### Release Checklist Summary

Pre-Release:
- [ ] All tests passing
- [ ] Code formatted and linted
- [ ] CHANGELOG.md updated
- [ ] Version bumped in package.json
- [ ] Git tag created

Release:
- [ ] Code pushed to GitHub (main branch)
- [ ] Tags pushed to GitHub
- [ ] GitHub release created
- [ ] NPM package published
- [ ] Installation verified

Post-Release:
- [ ] Directus marketplace updated (wait 2-4 hours)
- [ ] Documentation reflects new version
- [ ] Announcement made (if significant)
- [ ] Issues/PRs closed and linked to release

## Performance Considerations

- Token generation is fast (<10ms typically)
- No caching needed - tokens should be generated fresh
- Rate limiting should be handled by Directus/proxy
- Each token generation creates a new JWT signature

## Future Enhancements to Consider

- Token refresh endpoint
- Bulk token generation
- Token validation endpoint
- Webhook support for token events
- Admin dashboard integration
- Token usage analytics

## Getting Help

- **Directus Docs**: <https://docs.directus.io/extensions/>
- **Directus Marketplace**: <https://directus.io/docs/guides/extensions/marketplace/publishing>
- **Stream Docs**: <https://getstream.io/video/docs/>
- **Node SDK**: <https://github.com/GetStream/stream-video-js>
- **Issues**: Create issue in repository
- **Directus Community**: <https://directus.chat/>

---

**Last Updated**: October 2025
**Extension Version**: 1.0.0
**Directus Compatibility**: ^10.10.0
**Node.js Required**: >=22.0.0

````
