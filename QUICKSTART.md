# Quick Start Guide

## Development Setup

```bash
# Install dependencies
yarn install

# Build the extension
yarn build

# Run tests
yarn test

# Run linter
yarn lint

# Validate extension structure
yarn validate
```

## Development Workflow

```bash
# Watch mode - auto-rebuild on changes
yarn dev
```

## Install into Directus

### Option 1: Link for Development

```bash
# Link to your Directus instance
yarn link
# When prompted, enter: /path/to/your/directus/extensions
```

### Option 2: Manual Copy

```bash
# After building, copy dist folder to Directus
cp -r dist /path/to/your/directus/extensions/endpoints/stream-token
```

## Configure Environment

In your Directus `.env` file, add:

```bash
STREAMIO_API_KEY=your_api_key_here
STREAMIO_API_SECRET=your_api_secret_here
```

## Test the Extension

```bash
# Health check
curl http://localhost:8055/streamio-token/health

# Generate user token
curl -X POST http://localhost:8055/streamio-token/user \
  -H "Content-Type: application/json" \
  -d '{"userId": "test-user-123", "expirationSeconds": 3600}'

# Generate call token
curl -X POST http://localhost:8055/streamio-token/call \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-123",
    "callIds": ["default:call1"],
    "role": "admin",
    "expirationSeconds": 3600
  }'
```

## API Endpoints

- `GET /streamio-token/health` - Check extension status and configuration
- `POST /streamio-token/user` - Generate a Stream.io user token
- `POST /streamio-token/call` - Generate a Stream.io call token with access to specific calls
- `POST /streamio-token/generate` - (Deprecated) Generate user token (use `/user` instead)

## Project Structure

```
├── src/
│   ├── index.ts          # Main endpoint definition
│   └── streamio.ts       # Token generation logic
├── tests/
│   └── streamio.test.ts  # Unit tests
├── dist/                 # Build output (generated)
├── package.json
├── tsconfig.json
├── .env.example
├── .eslintrc.json
├── jest.config.js
├── LICENSE
└── README.md
```

## Build Output

After running `yarn build`, the extension is bundled to:
- `dist/index.js` - Main entry point
- `dist/index.d.ts` - TypeScript declarations

## Next Steps

1. Get Stream.io API credentials from https://getstream.io/
2. Configure your Directus `.env` with the credentials
3. Build and link the extension with `yarn build && yarn link`
4. Restart Directus
5. Test the endpoints

For detailed documentation, see [README.md](./README.md)
