# Directus Extension [GetStream.io](https://getstream.io)

[![Publish to npm](https://github.com/AbhinayMe/directus-extension-getstream-io/actions/workflows/publish.yml/badge.svg)](https://github.com/AbhinayMe/directus-extension-getstream-io/actions/workflows/publish.yml)
[![npm version](https://img.shields.io/npm/v/directus-extension-getstream-io.svg)](https://www.npmjs.com/package/directus-extension-getstream-io)
[![npm downloads](https://img.shields.io/npm/dm/directus-extension-getstream-io.svg)](https://www.npmjs.com/package/directus-extension-getstream-io)

Generate authentication tokens for Stream (https://getstream.io) video calls in
Directus.

## Quick start

Install the package and set the required environment variables in
Directus:

```bash
# Install
npm install directus-extension-getstream-io

# .env
STREAMIO_API_KEY=your_api_key
STREAMIO_API_SECRET=your_api_secret
```

## Development

```bash
yarn install
yarn build
yarn test
```

## Documentation

- [API Reference](docs/API.md) — Complete endpoint documentation with examples
- [Troubleshooting Guide](docs/TROUBLESHOOTING.md) — Common issues and solutions
- [Publishing Guide](docs/PUBLISHING.md) — CI/CD and npm publishing instructions
- [Changelog](docs/CHANGELOG.md) — Version history and release notes

## Publishing (CI)

This repo contains a GitHub Actions workflow that publishes to npm when
code is pushed to the `publish` branch. See [docs/PUBLISHING.md](docs/PUBLISHING.md) for the full
CI and publishing instructions (secrets, local checks, versioning).

## Links

- Repository: [github.com/AbhinayMe/directus-extension-getstream-io](https://github.com/AbhinayMe/directus-extension-getstream-io)
- Package: [npmjs.com/package/directus-extension-getstream-io](https://www.npmjs.com/package/directus-extension-getstream-io)

## License

MIT
