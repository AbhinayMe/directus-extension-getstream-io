# Publishing to Directus Marketplace

This guide covers how to publish your Stream.io Token Extension to the Directus Marketplace so users can easily install it in their Directus instances (including CapRover deployments).

## Table of Contents

- [Prerequisites](#prerequisites)
- [Prepare Your Extension](#prepare-your-extension)
- [Publish to NPM](#publish-to-npm)
- [Submit to Directus Marketplace](#submit-to-directus-marketplace)
- [Installation for End Users](#installation-for-end-users)
- [Updating Your Extension](#updating-your-extension)
- [Best Practices](#best-practices)

---

## Prerequisites

### Required Accounts

1. **NPM Account** (npmjs.com)
   - Extensions must be published to npm first
   - Create account at: https://www.npmjs.com/signup
   - Verify your email address

2. **GitHub Account** (github.com)
   - Directus Marketplace pulls from GitHub
   - Your repository should be public

3. **Directus Marketplace Account**
   - Register at: https://marketplace.directus.io

### Required in package.json

Your extension must have proper metadata. Let's verify:

```json
{
  "name": "directus-extension-streamio-token",
  "version": "1.0.0",
  "description": "Generate Stream.io video authentication tokens in Directus",
  "keywords": [
    "directus",
    "directus-extension",
    "directus-custom-endpoint",
    "stream-io",
    "video",
    "authentication",
    "token"
  ],
  "type": "module",
  "directus:extension": {
    "type": "endpoint",
    "path": "dist/index.js",
    "source": "src/index.ts",
    "host": "^10.10.0"
  },
  "author": {
    "name": "Your Name",
    "email": "your.email@example.com"
  },
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/AbhinayMe/directus-stream-io-token.git"
  },
  "bugs": {
    "url": "https://github.com/AbhinayMe/directus-stream-io-token/issues"
  },
  "homepage": "https://github.com/AbhinayMe/directus-stream-io-token#readme"
}
```

---

## Prepare Your Extension

### Step 1: Update package.json

Ensure your `package.json` has all required fields:

```bash
# Check current package.json
cat package.json
```

Update if needed:

```json
{
  "name": "directus-extension-streamio-token",
  "version": "1.0.0",
  "description": "Generate Stream.io video authentication tokens for video calls. Provides secure JWT token generation with user and call-specific access control.",
  "keywords": [
    "directus",
    "directus-extension",
    "directus-custom-endpoint",
    "stream-io",
    "stream",
    "video",
    "video-call",
    "authentication",
    "token",
    "jwt"
  ],
  "icon": "extension",
  "type": "module",
  "files": [
    "dist"
  ],
  "main": "dist/index.js",
  "directus:extension": {
    "type": "endpoint",
    "path": "dist/index.js",
    "source": "src/index.ts",
    "host": "^10.10.0"
  },
  "scripts": {
    "build": "directus-extension build",
    "dev": "directus-extension build -w --no-minify",
    "link": "directus-extension link",
    "validate": "directus-extension validate",
    "test": "node --experimental-vm-modules $(yarn bin jest)",
    "lint": "eslint src --ext .ts",
    "prepublishOnly": "yarn build && yarn test && yarn validate"
  },
  "dependencies": {
    "@stream-io/node-sdk": "^0.7.15"
  },
  "devDependencies": {
    "@directus/extensions-sdk": "12.0.2",
    "@directus/errors": "^2.0.4",
    "@types/jest": "^29.5.14",
    "@types/node": "^22.10.2",
    "@typescript-eslint/eslint-plugin": "^8.18.0",
    "@typescript-eslint/parser": "^8.18.0",
    "eslint": "^8.57.0",
    "jest": "^29.7.0",
    "ts-jest": "^29.2.5",
    "ts-node": "^10.9.2",
    "typescript": "^5.6.3"
  },
  "peerDependencies": {
    "@directus/extensions-sdk": "^12.0.0"
  },
  "author": {
    "name": "Your Name",
    "email": "your.email@example.com",
    "url": "https://github.com/AbhinayMe"
  },
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/AbhinayMe/directus-stream-io-token.git"
  },
  "bugs": {
    "url": "https://github.com/AbhinayMe/directus-stream-io-token/issues"
  },
  "homepage": "https://github.com/AbhinayMe/directus-stream-io-token#readme",
  "engines": {
    "node": ">=18.0.0"
  }
}
```

**Key fields for Marketplace:**
- `name`: Must start with `directus-extension-` or be scoped like `@your-org/directus-extension-*`
- `description`: Clear, concise description (used in marketplace listing)
- `keywords`: Include `directus`, `directus-extension`, and relevant terms
- `icon`: Directus Material icon name (optional but recommended)
- `files`: Ensure only `dist` folder is published (not `src`)
- `repository`: Public GitHub repository URL
- `license`: Open source license (MIT, Apache, etc.)
- `engines.node`: Specify required Node.js version

### Step 2: Add .npmignore

Create `.npmignore` to exclude unnecessary files from npm package:

```
# Source files
src/
tests/
*.test.ts
*.spec.ts

# Development files
.env
.env.*
!.env.example
*.md
!README.md

# Build artifacts
coverage/
.nyc_output/

# Dependencies
node_modules/

# Git
.git/
.gitignore
.github/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Config files
tsconfig.json
jest.config.js
.eslintrc.json
.prettierrc
yarn.lock
package-lock.json

# CI/CD
.travis.yml
.gitlab-ci.yml
azure-pipelines.yml
```

### Step 3: Verify Build Output

```bash
# Clean build
rm -rf dist/
yarn build

# Verify dist contains only necessary files
ls -la dist/

# Should see:
# dist/index.js (your compiled extension)
```

### Step 4: Test the Extension

```bash
# Run all tests
yarn test

# Validate extension structure
yarn validate

# Test in a real Directus instance if possible
```

---

## Publish to NPM

### Step 1: Login to NPM

```bash
npm login
# Enter your npm username, password, and email
```

Or if using 2FA:

```bash
npm login --auth-type=web
```

### Step 2: Check Package Before Publishing

```bash
# Dry run - see what will be published
npm publish --dry-run

# Should show:
# - package.json
# - README.md
# - LICENSE
# - dist/index.js
# - .env.example
```

**⚠️ Important:** Ensure NO sensitive files are included (no `.env`, no secrets)

### Step 3: Publish to NPM

**For first release:**

```bash
# Build and publish
yarn build
npm publish

# If scoped package (recommended for organizations)
npm publish --access public
```

**The package will be available at:**
- https://www.npmjs.com/package/directus-extension-streamio-token

### Step 4: Verify Publication

```bash
# Check package info
npm info directus-extension-streamio-token

# Install in a test project
npm install directus-extension-streamio-token
```

---

## Submit to Directus Marketplace

### Step 1: Access Marketplace Submission

1. Go to: https://marketplace.directus.io
2. Click **"Submit Extension"** or **"Add Extension"**
3. Login with your Directus account

### Step 2: Fill Extension Details

**Basic Information:**

```
Extension Name: Stream.io Token Generator
NPM Package Name: directus-extension-streamio-token
Short Description: Generate Stream.io video authentication tokens
Category: Custom Endpoints
```

**Detailed Information:**

```
Full Description:
A Directus custom endpoint extension that generates authentication tokens 
for Stream.io video calls using the official @stream-io/node-sdk.

Features:
• User token generation for authentication
• Call token generation with role-based access
• Configuration validation via health endpoint
• Full TypeScript support
• Production-ready with comprehensive tests

Perfect for applications that need secure video calling capabilities 
integrated with Directus.

Documentation:
See GitHub repository for complete API reference and examples.

Required Environment Variables:
• STREAMIO_API_KEY - Your Stream.io API key
• STREAMIO_API_SECRET - Your Stream.io API secret
```

**Links:**

```
GitHub Repository: https://github.com/AbhinayMe/directus-stream-io-token
Documentation: https://github.com/AbhinayMe/directus-stream-io-token#readme
NPM Package: https://www.npmjs.com/package/directus-extension-streamio-token
Demo/Screenshot: (Optional - upload screenshots of extension in use)
```

**Metadata:**

```
License: MIT
Directus Version: >= 10.10.0
Node Version: >= 18.0.0

Tags:
• video
• authentication
• stream-io
• token
• jwt
• endpoints
• api
```

### Step 3: Submit for Review

1. Review all information
2. Agree to terms and conditions
3. Click **"Submit Extension"**
4. Wait for Directus team approval (usually 1-5 business days)

### Step 4: Approval Process

**What Directus Reviews:**
- ✅ Package is published to npm
- ✅ Code quality and security
- ✅ Documentation completeness
- ✅ License compliance
- ✅ No malicious code
- ✅ Follows Directus extension standards

**Timeline:**
- Initial review: 1-3 days
- Revisions (if needed): 1-2 days
- Final approval: 1 day

---

## Installation for End Users

Once published to marketplace, users can install your extension in **3 ways**:

### Option 1: Via Directus Marketplace (Easiest)

Users with Directus Admin access:

1. Login to Directus Admin panel
2. Go to **Settings** → **Marketplace**
3. Search for "Stream.io Token" or "streamio-token"
4. Click **"Install"**
5. Add environment variables:
   ```
   STREAMIO_API_KEY=their_api_key
   STREAMIO_API_SECRET=their_api_secret
   ```
6. Restart Directus

### Option 2: Via NPM (For Self-Hosted)

For CapRover and Docker deployments:

**Method A: Install in Existing Instance**

```bash
# SSH into server or container
docker exec -it directus-container sh

# Install extension
cd /directus
npm install directus-extension-streamio-token

# Extension installs to: /directus/node_modules/directus-extension-streamio-token
# Directus auto-discovers it on restart
```

**Method B: Add to Dockerfile**

```dockerfile
FROM directus/directus:11

# Install extension during build
RUN npm install -g directus-extension-streamio-token

USER node
```

**Method C: Add to package.json**

```json
{
  "dependencies": {
    "directus": "^10.10.0",
    "directus-extension-streamio-token": "^1.0.0"
  }
}
```

### Option 3: Via Directus CLI (Programmatic)

```bash
# Using Directus CLI
npx directus extensions install directus-extension-streamio-token

# Or with specific version
npx directus extensions install directus-extension-streamio-token@1.0.0
```

### CapRover-Specific Installation

**Option A: Environment Variables in CapRover UI**

1. Add extension to Dockerfile:
```dockerfile
FROM directus/directus:11
RUN npm install directus-extension-streamio-token
USER node
```

2. Build and deploy:
```bash
docker build -t directus-with-streamio .
caprover deploy --imageName directus-with-streamio
```

3. Set env vars in CapRover → Apps → Environment Variables:
```
STREAMIO_API_KEY=xxx
STREAMIO_API_SECRET=xxx
```

**Option B: Captain Definition**

Create `captain-definition`:

```json
{
  "schemaVersion": 2,
  "dockerfileLines": [
    "FROM directus/directus:11",
    "RUN npm install directus-extension-streamio-token",
    "USER node"
  ]
}
```

Push to deploy:
```bash
git add captain-definition
git commit -m "Add Stream.io extension"
git push caprover main
```

---

## Updating Your Extension

### Semantic Versioning

Follow semver (semantic versioning):

```
1.0.0 → Initial release
1.0.1 → Bug fixes
1.1.0 → New features (backward compatible)
2.0.0 → Breaking changes
```

### Update Process

**Step 1: Update Version**

```bash
# Update package.json version
npm version patch  # 1.0.0 → 1.0.1 (bug fix)
npm version minor  # 1.0.0 → 1.1.0 (new feature)
npm version major  # 1.0.0 → 2.0.0 (breaking change)
```

**Step 2: Update Changelog**

Create/update `CHANGELOG.md`:

```markdown
# Changelog

## [1.1.0] - 2025-10-29

### Added
- New endpoint for batch token generation
- Support for custom token expiration

### Fixed
- Token validation error handling
- CORS configuration issues

### Changed
- Improved error messages
- Updated Stream.io SDK to v0.8.0
```

**Step 3: Build and Test**

```bash
yarn build
yarn test
yarn validate
```

**Step 4: Publish Update**

```bash
# Commit version bump
git add package.json CHANGELOG.md
git commit -m "Release v1.1.0"
git tag v1.1.0
git push origin main --tags

# Publish to npm
npm publish
```

**Step 5: Update Marketplace Listing**

1. Go to https://marketplace.directus.io
2. Navigate to your extension
3. Click **"Update"**
4. Add release notes
5. Save changes

### Users Auto-Update

Once published, users can update with:

```bash
# Update to latest
npm update directus-extension-streamio-token

# Or specific version
npm install directus-extension-streamio-token@1.1.0
```

---

## Best Practices

### Documentation

**Essential docs to maintain:**

1. **README.md** - Overview, installation, API reference
2. **CHANGELOG.md** - Version history
3. **LICENSE** - MIT or other open source license
4. **.env.example** - Required environment variables
5. **API docs** - Complete endpoint documentation

### Security

```bash
# Run security audit before publishing
npm audit

# Fix vulnerabilities
npm audit fix

# Never include in package:
# - .env files
# - API keys or secrets
# - Private credentials
# - Development-only files
```

### Testing

```bash
# Always run before publishing
yarn test          # Unit tests pass
yarn lint          # No linting errors
yarn validate      # Extension structure valid
yarn build         # Build succeeds
npm publish --dry-run  # Check what will be published
```

### Versioning Strategy

**When to bump versions:**

- **Patch (1.0.x)**: Bug fixes, documentation updates
- **Minor (1.x.0)**: New features, backward compatible
- **Major (x.0.0)**: Breaking changes, API changes

### Support & Maintenance

**Provide support via:**

1. **GitHub Issues** - Bug reports and feature requests
2. **GitHub Discussions** - Questions and community support
3. **README** - FAQs and troubleshooting section
4. **Examples** - Usage examples in documentation

**Respond to:**
- Security issues: Within 24 hours
- Bug reports: Within 1 week
- Feature requests: Review monthly

### Marketing Your Extension

**After marketplace approval:**

1. **GitHub README** - Add "Available on Directus Marketplace" badge
2. **Social Media** - Share on Twitter, LinkedIn
3. **Directus Discord** - Announce in #extensions channel
4. **Blog Post** - Write about use cases
5. **Demo Video** - Create quick demo (optional)

---

## Complete Publication Checklist

### Pre-Publication

- [ ] `package.json` has all required fields
- [ ] Version number is correct
- [ ] README.md is complete and clear
- [ ] LICENSE file exists (MIT recommended)
- [ ] .env.example shows required variables
- [ ] .npmignore excludes sensitive/unnecessary files
- [ ] All tests pass (`yarn test`)
- [ ] Extension validates (`yarn validate`)
- [ ] Build succeeds (`yarn build`)
- [ ] Linting passes (`yarn lint`)
- [ ] Security audit clean (`npm audit`)

### NPM Publication

- [ ] Logged into npm (`npm login`)
- [ ] Dry run checked (`npm publish --dry-run`)
- [ ] Published to npm (`npm publish`)
- [ ] Verified on npmjs.com
- [ ] Test installation in clean project

### Marketplace Submission

- [ ] Account created on marketplace.directus.io
- [ ] Extension details filled completely
- [ ] Screenshots/demo uploaded (optional)
- [ ] Links verified (GitHub, npm, docs)
- [ ] Tags and categories selected
- [ ] Submitted for review
- [ ] Approval received

### Post-Publication

- [ ] GitHub release created with tag
- [ ] CHANGELOG.md updated
- [ ] README.md shows installation from marketplace
- [ ] Announced in community channels
- [ ] Monitor for issues/questions

---

## Example: Complete Release Process

Here's a complete workflow for releasing version 1.0.0:

```bash
# 1. Ensure everything is ready
git status  # Clean working directory
yarn test   # All tests pass
yarn build  # Build succeeds

# 2. Update version
npm version 1.0.0

# 3. Build for production
yarn build

# 4. Test the package
npm publish --dry-run

# 5. Publish to npm
npm publish

# 6. Create git release
git add .
git commit -m "Release v1.0.0"
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin main --tags

# 7. Verify publication
npm info directus-extension-streamio-token

# 8. Submit to Directus Marketplace
# (Via web interface at marketplace.directus.io)

# 9. Announce
echo "🎉 Extension published!"
echo "NPM: https://www.npmjs.com/package/directus-extension-streamio-token"
echo "Marketplace: (Pending approval)"
```

---

## Troubleshooting Publication

### NPM Publish Fails

**Error: "You need to authorize this machine"**
```bash
npm login
npm publish
```

**Error: "Package name already exists"**
```bash
# Use a unique name or scope it
npm publish --access public
```

**Error: "403 Forbidden"**
```bash
# Check package name doesn't conflict
# Ensure you're logged in as correct user
npm whoami
```

### Marketplace Rejection Reasons

1. **Security issues** - Fix code vulnerabilities
2. **Missing documentation** - Complete README
3. **License issues** - Add proper open source license
4. **Name conflicts** - Choose unique name
5. **Quality standards** - Improve code quality, add tests

### Installation Issues

**Extension not appearing after install:**
```bash
# Check extension was installed
ls -la node_modules/directus-extension-*

# Check Directus logs
# Extension should appear in startup logs

# Restart Directus
docker-compose restart directus
```

**Environment variables not working:**
```bash
# Verify vars are set correctly
env | grep STREAMIO

# Check health endpoint
curl https://your-domain.com/streamio-token/health
```

---

## Resources

- **Directus Marketplace**: https://marketplace.directus.io
- **Directus Extensions Docs**: https://docs.directus.io/extensions/
- **NPM Publishing Guide**: https://docs.npmjs.com/cli/v9/commands/npm-publish
- **Semantic Versioning**: https://semver.org
- **Extension Examples**: https://github.com/directus-community/extensions

---

## Support

Need help publishing? 

- **Directus Discord**: https://directus.chat (ask in #extensions)
- **GitHub Issues**: https://github.com/directus/directus/issues
- **Marketplace Help**: support@directus.io

---

**Ready to publish?** Follow the checklist above and you'll have your extension in the marketplace in no time! 🚀
