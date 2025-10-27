# Directus Stream.io Token Extension

A Directus custom endpoint extension that generates authentication tokens for Stream.io video calls using the official `@stream-io/node-sdk`.

## Features

- 🔐 Secure token generation using Stream.io Video API credentials
- ⚡ Simple REST API endpoint integration
- 🛡️ Built-in validation and error handling
- 🔧 Configurable token expiration
- 📊 Health check endpoint for monitoring
- ✅ TypeScript support with full type safety
- 🎥 Uses official Stream.io Video Node SDK (v0.7.15)

## Prerequisites

- Directus 10.10.0 or higher
- Node.js 18 or higher
- Stream.io account with API credentials

## Installation

### 1. Get Stream.io Credentials

Sign up for a [Stream.io account](https://getstream.io/) and obtain your:
- API Key
- API Secret

### 2. Install the Extension

#### Option A: Install from npm (if published)

```bash
yarn add directus-extension-stream-token
```

#### Option B: Build and Link Locally

Clone this repository and build the extension:

```bash
# Install dependencies
yarn install

# Build the extension
yarn build

# Link to your Directus instance
yarn link
```

When prompted, provide the path to your Directus project's `extensions` folder (e.g., `./directus/extensions`).

### 3. Configure Environment Variables

Add the following environment variables to your Directus `.env` file:

```bash
STREAMIO_API_KEY=your_streamio_api_key_here
STREAMIO_API_SECRET=your_streamio_api_secret_here
```

### 4. Restart Directus

Restart your Directus instance to load the extension:

```bash
# If using Docker
docker-compose restart

# If running directly
yarn start
```

## Usage

The extension adds two endpoints to your Directus instance:

### Health Check

Check if the extension is loaded and properly configured:

```bash
GET http://your-directus-url/streamio-token/health
```

**Example Response:**

```json
{
  "status": "ok",
  "extension": "directus-extension-stream-token",
  "configured": true,
  "errors": []
}
```

### Generate Token

Generate a Stream.io video token for a user:

```bash
POST http://your-directus-url/streamio-token/generate
Content-Type: application/json

{
  "userId": "user-123",
  "expirationSeconds": 3600
}
```

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | string | Yes | Unique identifier for the user |
| `expirationSeconds` | number | No | Token expiration time in seconds (default: no expiration) |

### Example Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "user-123",
  "apiKey": "your-api-key",
  "expiresAt": "2025-10-28T12:00:00.000Z"
}
```

**Note:** If `expirationSeconds` is not provided, the token will be valid for 1 hour by default (Stream.io API default).

### Example cURL Commands

```bash
# Health check
curl http://localhost:8055/streamio-token/health

# Generate user token
curl -X POST http://localhost:8055/streamio-token/user \
  -H "Content-Type: application/json" \
  -d '{"userId": "user-123", "expirationSeconds": 3600}'

# Generate call token
curl -X POST http://localhost:8055/streamio-token/call \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "callIds": ["default:call1", "livestream:call2"],
    "role": "admin",
    "expirationSeconds": 3600
  }'

# With Directus authentication
curl -X POST http://localhost:8055/streamio-token/user \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_DIRECTUS_TOKEN" \
  -d '{"userId": "user-123"}'
```

## Development

### Setup

```bash
# Install dependencies
yarn install

# Copy environment example
cp .env.example .env

# Edit .env with your Stream.io credentials
```

### Build

```bash
# Build once
yarn build

# Build and watch for changes
yarn dev
```

### Testing

```bash
# Run tests
yarn test

# Run linter
yarn lint
```

### Validate Extension

```bash
# Validate extension structure and configuration
yarn validate
```

## Project Structure

```
directus-extension-stream-token/
├── src/
│   ├── index.ts          # Main endpoint definition
│   └── streamio.ts       # Token generation logic
├── tests/
│   └── streamio.test.ts  # Unit tests
├── dist/                 # Build output (generated)
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## API Reference

### `generateUserToken(config: StreamTokenConfig): Promise<StreamTokenResponse>`

Generates a Stream.io user authentication token.

**Parameters:**

```typescript
interface StreamTokenConfig {
  apiKey: string;
  apiSecret: string;
  userId: string;
  expirationSeconds?: number;
}
```

**Returns:**

```typescript
interface StreamTokenResponse {
  token: string;
  userId: string;
  apiKey: string;
  type: 'user' | 'call';
  expiresAt?: Date;
  callIds?: string[];
  role?: string;
}
```

### `generateCallToken(config: StreamCallTokenConfig): Promise<StreamTokenResponse>`

Generates a Stream.io call token with access to specific calls.

**Parameters:**

```typescript
interface StreamCallTokenConfig {
  apiKey: string;
  apiSecret: string;
  userId: string;
  callIds: string[];
  role?: string;
  expirationSeconds?: number;
}
```

**Returns:**

```typescript
interface StreamTokenResponse {
  token: string;
  userId: string;
  apiKey: string;
  type: 'user' | 'call';
  callIds?: string[];
  role?: string;
  expiresAt?: Date;
}
```

### `validateStreamConfig(): { valid: boolean; errors: string[] }`

Validates that required Stream.io environment variables are configured.

## Error Handling

The extension handles common errors gracefully:

| Status Code | Error | Description |
|-------------|-------|-------------|
| 400 | Bad Request | Missing or invalid `userId` in request body |
| 500 | Configuration Error | Stream.io credentials not configured |
| 500 | Internal Server Error | Token generation failed |

## Security Considerations

- **Never expose API secrets**: Store credentials in environment variables only
- **Use HTTPS**: Always use HTTPS in production to protect tokens in transit
- **Set token expiration**: Use `expirationSeconds` to limit token lifetime
- **Validate users**: Implement additional authentication/authorization as needed
- **Monitor usage**: Track token generation for abuse detection

## Troubleshooting

### Extension not loading

1. Verify the extension is in the correct directory (`extensions` folder)
2. Check Directus logs for errors during startup
3. Run `yarn validate` to check extension structure
4. Ensure Directus version is 10.10.0 or higher

### Token generation fails

1. Verify Stream.io credentials are set correctly in `.env`
2. Check the health endpoint: `GET /streamio-token/health`
3. Ensure the API key and secret are valid in your Stream.io dashboard
4. Check Directus server logs for detailed error messages

### TypeScript errors during build

1. Run `yarn install` to ensure all dependencies are installed
2. Check that Node.js version is 18 or higher: `node --version`
3. Delete `node_modules` and `yarn.lock`, then reinstall with `yarn install`

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass: `yarn test`
5. Submit a pull request

## License

MIT

## Resources

- [Directus Extensions Documentation](https://docs.directus.io/extensions/)
- [Stream.io Video Documentation](https://getstream.io/video/docs/)
- [Stream.io Node SDK](https://github.com/GetStream/stream-video-js/tree/main/packages/node-sdk)
- [Directus Extensions SDK](https://www.npmjs.com/package/@directus/extensions-sdk)

## Support

For issues and questions:
- Create an issue in the GitHub repository
- Check [Directus Community](https://directus.chat/)
- Consult [Stream.io Support](https://getstream.io/support/)
