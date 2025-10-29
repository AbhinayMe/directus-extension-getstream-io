# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to date-based versioning (`YYYY.M.D-NNN` format).

**Version Format:** `YYYY.M.D-NNN` where NNN is a sequential counter for releases on that day.
**Example:** `2025.10.30-001` (first release on October 30, 2025)

## [Unreleased]

### Added

- Automatic date-based versioning with sequential daily counters (`YYYY.M.D-NNN`)
- GitHub Release creation with auto-generated tags for every publish
- Manual workflow trigger via GitHub Actions UI with optional reason input
- Changelog entries automatically included in GitHub Releases
- Comprehensive documentation reorganized in `docs/` folder:
  - `docs/API.md` — Complete endpoint documentation
  - `docs/PUBLISHING.md` — CI/CD and publishing guide
  - `docs/TROUBLESHOOTING.md` — Common issues and solutions
  - `docs/CHANGELOG.md` — Version history
- GitHub Actions workflow (`publish.yml`) for automated publishing

### Changed

- Moved all documentation files to `docs/` directory for better organization
- Updated npm token instructions to recommend Granular Access Tokens over Classic tokens
- Simplified README with links to detailed documentation
- CI/CD workflow now automatically generates version numbers (no manual bumps needed)
- Release tags created automatically on every publish
- Publishing workflow enhanced with build, test, lint, and release steps

### Improved

- Better security with Granular Access Token recommendations
- Cleaner version numbers with daily sequential counters
- Enhanced GitHub Releases with changelog, package info, and install commands

## [1.0.0] - 2025-10-29

### Added

- Initial release of GetStream Extension for Directus (formerly Stream Token Extension)
- Generate user authentication tokens for Stream video
- Call token generation endpoint with role-based access (`POST /getstream-io/callTokenToken`)
- Health check endpoint for configuration validation (`GET /getstream-io/health`)
- Full TypeScript support with strict typing
- Integration with `@directus/errors` for consistent error handling
- Integration with `context.env` and `context.logger` for Directus-native patterns
- Comprehensive test suite with 17 tests
- Complete API documentation
- Environment variable validation
- Support for custom token expiration

### Dependencies

- @stream-io/node-sdk: 0.7.15
- @directus/errors: ^2.0.4
- @directus/extensions-sdk: 16.0.2

### Requirements

- Directus 10.10.0 or higher
- Node.js 22 or higher
- Stream account with API credentials

[Unreleased]: https://github.com/AbhinayMe/directus-extension-getstream-io/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/AbhinayMe/directus-extension-getstream-io/releases/tag/v1.0.0
