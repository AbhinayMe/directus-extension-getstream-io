# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2025-10-29

### Added

- Initial release of Stream.io Token Extension for Directus
- User token generation endpoint (`POST /streamio-token/user`)
- Call token generation endpoint with role-based access (`POST /streamio-token/call`)
- Health check endpoint for configuration validation (`GET /streamio-token/health`)
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

- Directus >= 10.10.0
- Node.js >= 18.0.0
- Stream.io account with API credentials

[Unreleased]: https://github.com/AbhinayMe/directus-stream-io-token/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/AbhinayMe/directus-stream-io-token/releases/tag/v1.0.0
