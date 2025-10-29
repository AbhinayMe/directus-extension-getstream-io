````instructions
# GitHub Copilot Instructions for Directus GetStream Extension

## Project Overview

This is a **published Directus custom endpoint extension** that generates Stream video authentication tokens (both user tokens and call tokens) using the official `@stream-io/node-sdk`.

**Package**: `directus-extension-getstream-io` (published on NPM)
**Status**: ✅ Production-ready and available on [Directus Marketplace](https://directus.io/extensions)

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
```

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
  "format:check": "prettier --check \"**/*.{ts,js,json,md}\""
}
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
- [ ] Update README.md if API changed
- [ ] Check `.env.example` is up to date
- [ ] Verify no secrets in code or commits
- [ ] Update version in package.json if needed

Before publishing to marketplace:

- [ ] All maintenance checks above passed
- [ ] CHANGELOG.md updated with version changes
- [ ] Git tag created: `git tag v1.x.x`
- [ ] Tag pushed: `git push origin --tags`
- [ ] README.md includes all necessary documentation
- [ ] package.json includes `directus-extension` keyword
- [ ] Test installation locally: `yarn link`
- [ ] NPM publish succeeds: `npm publish --access public`
- [ ] Wait 2-4 hours for marketplace indexing
- [ ] Verify listing at <https://directus.io/extensions>

## Release Package Management

### Versioning Strategy

Follow [Semantic Versioning](https://semver.org/) (SemVer): `MAJOR.MINOR.PATCH`

- **PATCH** (1.0.x): Bug fixes, documentation updates, internal refactoring
- **MINOR** (1.x.0): New features, backward-compatible functionality
- **MAJOR** (x.0.0): Breaking changes, major rewrites

### Release Workflow

#### 1. Pre-Release Preparation

```bash
# Ensure working directory is clean
git status

# Pull latest changes
git pull origin main

# Run full test suite
yarn build && yarn test && yarn lint && yarn format:check && yarn validate

# Verify all tests pass
```

#### 2. Update Version and Changelog

```bash
# Update version (choose one)
npm version patch   # 1.0.0 → 1.0.1 (bug fixes)
npm version minor   # 1.0.0 → 1.1.0 (new features)
npm version major   # 1.0.0 → 2.0.0 (breaking changes)

# This automatically:
# - Updates package.json version
# - Creates git commit with message "1.x.x"
# - Creates git tag "v1.x.x"
```

**Manually update CHANGELOG.md:**

```markdown
## [1.1.0] - 2025-10-30

### Added
- New feature description
- Another feature

### Changed
- Modified behavior description

### Fixed
- Bug fix description

### Security
- Security update description
```

#### 3. Commit and Tag

```bash
# If you updated CHANGELOG manually (after npm version)
git add CHANGELOG.md
git commit --amend --no-edit

# Push commits and tags
git push origin main
git push origin --tags
```

#### 4. Create GitHub Release

**Option A: GitHub CLI (Recommended)**

```bash
# Install GitHub CLI if needed
brew install gh

# Authenticate (first time only)
gh auth login

# Create release with auto-generated notes
gh release create v1.1.0 \
  --title "v1.1.0 - Feature Release" \
  --notes "Release notes here" \
  --generate-notes

# Or with changelog file
gh release create v1.1.0 \
  --title "v1.1.0" \
  --notes-file CHANGELOG.md
```

**Option B: GitHub Web UI**

1. Go to <https://github.com/AbhinayMe/directus-extension-getstream-io/releases>
2. Click "Draft a new release"
3. Select tag: `v1.1.0`
4. Release title: `v1.1.0 - Feature Release`
5. Description: Copy from CHANGELOG.md or use auto-generate
6. Check "Set as the latest release"
7. Click "Publish release"

#### 5. Publish to NPM

```bash
# Ensure you're logged in to NPM
npm whoami

# If not logged in
npm login

# Build the extension
yarn build

# Publish to NPM (public access required for scoped packages)
npm publish --access public

# Verify publication
npm view directus-extension-getstream-io
```

#### 6. Verify Release

```bash
# Check NPM package
npm view directus-extension-getstream-io version
npm view directus-extension-getstream-io

# Check GitHub release
gh release view v1.1.0

# Test installation
cd /tmp
mkdir test-install
cd test-install
npm init -y
npm install directus-extension-getstream-io
```

#### 7. Marketplace Verification

- Wait 2-4 hours for Directus marketplace indexing
- Visit <https://directus.io/extensions>
- Search for "getstream" or "directus-extension-getstream-io"
- Verify version number matches
- Check extension details are correct

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
