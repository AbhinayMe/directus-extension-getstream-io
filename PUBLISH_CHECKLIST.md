# Publishing Checklist

Use this checklist before publishing to NPM and Directus Marketplace.

## Pre-Publication Checks

### Code Quality

- [ ] All tests pass: `yarn test`
- [ ] Build succeeds: `yarn build`
- [ ] Linting passes: `yarn lint`
- [ ] Extension validates: `yarn validate`
- [ ] Security audit clean: `npm audit`
- [ ] No console.log statements in production code
- [ ] No commented-out code

### Documentation

- [ ] README.md is complete with:
  - [ ] Clear description
  - [ ] Installation instructions
  - [ ] API reference
  - [ ] Usage examples
  - [ ] Configuration steps
  - [ ] Troubleshooting section
- [ ] CHANGELOG.md is updated with version changes
- [ ] LICENSE file exists (MIT)
- [ ] .env.example shows all required variables
- [ ] Code comments are clear and helpful
- [ ] JSDoc comments for public functions

### Package Configuration (package.json)

- [ ] `name` follows convention: `directus-extension-*`
- [ ] `version` is updated (follow semver)
- [ ] `description` is clear and concise
- [ ] `keywords` include relevant search terms
- [ ] `icon` is set (Directus Material icon)
- [ ] `author` information is complete
- [ ] `license` is specified (MIT)
- [ ] `repository` URL is correct
- [ ] `homepage` URL is correct
- [ ] `bugs` URL is correct
- [ ] `engines.node` specifies minimum version
- [ ] `files` includes only `dist` folder
- [ ] `main` points to `dist/index.js`
- [ ] `directus:extension` metadata is correct
- [ ] `peerDependencies` specified if needed
- [ ] `prepublishOnly` script runs tests

### Files & Security

- [ ] .npmignore excludes:
  - [ ] Source files (src/)
  - [ ] Tests (tests/)
  - [ ] .env files
  - [ ] Development configs
  - [ ] node_modules
- [ ] No sensitive data in code:
  - [ ] No API keys
  - [ ] No secrets
  - [ ] No credentials
  - [ ] No private tokens
- [ ] .gitignore is comprehensive
- [ ] Git working directory is clean

### Testing

- [ ] Tested in actual Directus instance
- [ ] Health endpoint works
- [ ] Token generation endpoints work
- [ ] Error handling works correctly
- [ ] Environment variable validation works
- [ ] Works with Directus >= 10.10.0

## NPM Publication

### Setup

- [ ] NPM account created and verified
- [ ] Logged in: `npm login` or `npm login --auth-type=web`
- [ ] Verified identity: `npm whoami`

### Pre-Publish

- [ ] Dry run completed: `npm publish --dry-run`
- [ ] Reviewed files to be published
- [ ] Version number is correct
- [ ] Package name is available/unique

### Publish

- [ ] Built extension: `yarn build`
- [ ] Published to npm: `npm publish` or `npm publish --access public`
- [ ] Verified on npmjs.com
- [ ] Test installation: `npm install directus-extension-stream-token`

### Post-Publish

- [ ] Created git tag: `git tag v1.0.0`
- [ ] Pushed tags: `git push origin --tags`
- [ ] Created GitHub release with notes
- [ ] Updated CHANGELOG.md if needed

## Directus Marketplace Submission

### Prerequisites

- [ ] Package published to npm
- [ ] GitHub repository is public
- [ ] README is comprehensive
- [ ] Extension works correctly

### Submission

- [ ] Account created at marketplace.directus.io
- [ ] Clicked "Submit Extension"
- [ ] Filled all required fields:
  - [ ] Extension name
  - [ ] NPM package name
  - [ ] Short description
  - [ ] Full description
  - [ ] Category selected
  - [ ] Tags added
- [ ] Added links:
  - [ ] GitHub repository
  - [ ] NPM package
  - [ ] Documentation
- [ ] Added metadata:
  - [ ] License
  - [ ] Directus version compatibility
  - [ ] Node.js version requirement
- [ ] Uploaded screenshots (optional but recommended)
- [ ] Reviewed all information
- [ ] Agreed to terms
- [ ] Submitted for review

### After Approval

- [ ] Verified listing appears in marketplace
- [ ] Tested installation from marketplace
- [ ] Added marketplace badge to README
- [ ] Announced in community channels

## Post-Publication Tasks

### Documentation Updates

- [ ] Added "Available on Directus Marketplace" badge to README
- [ ] Updated installation instructions to include marketplace
- [ ] Added marketplace link to documentation

### Community

- [ ] Announced on Twitter/LinkedIn
- [ ] Posted in Directus Discord #extensions channel
- [ ] Created demo video (optional)
- [ ] Wrote blog post about use cases (optional)

### Monitoring

- [ ] Watch GitHub issues for bug reports
- [ ] Monitor npm downloads
- [ ] Check marketplace reviews/feedback
- [ ] Respond to questions promptly

## Version Update Checklist

For future updates, use this abbreviated checklist:

### Before Update

- [ ] Update version in package.json: `npm version [patch|minor|major]`
- [ ] Update CHANGELOG.md with changes
- [ ] All checks from "Pre-Publication Checks" section pass
- [ ] Test thoroughly in Directus instance

### Publish Update

- [ ] Build: `yarn build`
- [ ] Test: `yarn test && yarn validate`
- [ ] Publish: `npm publish`
- [ ] Tag: `git tag v1.x.x && git push --tags`
- [ ] Create GitHub release with changelog

### Update Marketplace

- [ ] Login to marketplace.directus.io
- [ ] Navigate to extension
- [ ] Click "Update"
- [ ] Add release notes
- [ ] Save changes

## Quick Commands

```bash
# Complete publish workflow
yarn test && \
yarn build && \
yarn validate && \
npm publish --dry-run && \
npm publish && \
git tag v1.0.0 && \
git push origin --tags

# Version bumps
npm version patch  # 1.0.0 → 1.0.1 (bug fix)
npm version minor  # 1.0.0 → 1.1.0 (new feature)
npm version major  # 1.0.0 → 2.0.0 (breaking change)

# Check what will be published
npm publish --dry-run

# Verify after publish
npm info directus-extension-stream-token
```

## Common Issues

### NPM Publish Fails

- **403 Forbidden**: Check you're logged in with correct account
- **Name taken**: Choose different name or use scoped package
- **Validation error**: Review package.json for required fields

### Marketplace Rejection

- **Security concerns**: Run npm audit and fix vulnerabilities
- **Missing docs**: Complete README with all sections
- **Quality issues**: Add tests, improve code quality
- **License issues**: Ensure proper open source license

### Installation Issues

- **Extension not found**: Check name matches exactly
- **Version conflicts**: Check Directus version compatibility
- **Environment errors**: Verify required env vars documented

---

**Ready to publish?** Work through this checklist and you'll have a successful release! ✅
