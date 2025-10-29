# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Package name changed from `directus-extension-stream-token` to `directus-extension-getstream-io`
- Repository name changed from `directus-stream-io-token` to `directus-extension-getstream-io`
- Repository URL: https://github.com/AbhinayMe/directus-extension-getstream-io

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
