# Directus GetStream Extension

Generate authentication tokens for Stream (GetStream) video calls in your Directus instance.

## Quick Start

```bash
# Install
npm install directus-extension-getstream-io
```

**Configure** in your Directus `.env`:

```bash
STREAMIO_API_KEY=your_api_key
STREAMIO_API_SECRET=your_api_secret
```

Get credentials from [Stream Dashboard](https://getstream.io/dashboard/)

**Use** the API:

```bash
# Generate user token
curl -X POST http://localhost:8055/getstream-io/userToken \
  -H "Content-Type: application/json" \
  -d '{"userId": "user123"}'

# Generate call token
curl -X POST http://localhost:8055/getstream-io/callToken \
  -H "Content-Type: application/json" \
  -d '{"userId": "user123", "callIds": ["default:call1"]}'
```

## Features

- 🔐 User token generation for authentication
- 📞 Call token generation with role-based access
- ✅ Health check endpoint with validation
- 🔧 Full TypeScript support
- 🧪 Comprehensive test coverage

## Prerequisites

- Directus 10.10+
- Node.js 22+
- Stream account ([Sign up free](https://getstream.io/))

## API Endpoints

### Health Check

```http
GET /getstream-io/health
```

Returns extension status and configuration validation.

### User Token

```http
POST /getstream-io/userToken
```

**Body:**

```json
{
  "userId": "user123",
  "expirationSeconds": 3600
}
```

| Field             | Type   | Required | Description                      |
| ----------------- | ------ | -------- | -------------------------------- |
| userId            | string | Yes      | User identifier                  |
| expirationSeconds | number | No       | Token lifetime (default: 1 hour) |

### Call Token

```http
POST /getstream-io/callToken
```

**Body:**

```json
{
  "userId": "user123",
  "callIds": ["default:call1", "livestream:call2"],
  "role": "admin",
  "expirationSeconds": 3600
}
```

| Field             | Type     | Required | Description                        |
| ----------------- | -------- | -------- | ---------------------------------- |
| userId            | string   | Yes      | User identifier                    |
| callIds           | string[] | Yes      | Call IDs (format: `type:id`)       |
| role              | string   | No       | Role: `admin`, `moderator`, `user` |
| expirationSeconds | number   | No       | Token lifetime (default: 1 hour)   |

## Development

```bash
# Setup
git clone https://github.com/AbhinayMe/directus-extension-getstream-io.git
cd directus-extension-getstream-io
yarn install

# Build
yarn build          # Production build
yarn dev            # Watch mode

# Test
yarn test           # Run tests
yarn lint           # Check code style
yarn format         # Format code
yarn validate       # Validate extension
```

## Publishing to NPM

```bash
# Update version
npm version patch   # or minor, major

# Publish
npm publish --access public

# Extension appears at https://directus.io/extensions (2-4 hours)
```

## Troubleshooting

**Extension not loading?**

- Check Directus logs: `docker-compose logs directus`
- Verify extension directory: `extensions/endpoints/`
- Run health check: `curl http://localhost:8055/getstream-io/health`

**Token generation fails?**

- Verify credentials in `.env`
- Check API key/secret in [Stream Dashboard](https://getstream.io/dashboard/)
- Review Directus logs for detailed errors

## Project Structure

```
src/
  ├── index.ts          # Endpoint definitions
  └── streamio.ts       # Token generation logic
tests/
  └── streamio.test.ts  # Unit tests (17 tests)
```

## Security

- ✅ Store credentials in environment variables only
- ✅ Use HTTPS in production
- ✅ Set appropriate token expiration times
- ✅ Monitor token generation for abuse

## License

MIT

## Links

- [GitHub Repository](https://github.com/AbhinayMe/directus-extension-getstream-io)
- [NPM Package](https://www.npmjs.com/package/directus-extension-getstream-io)
- [Directus Marketplace](https://directus.io/extensions)
- [Stream Documentation](https://getstream.io/video/docs/)

## Support

- 🐛 [Report Issues](https://github.com/AbhinayMe/directus-extension-getstream-io/issues)
- 💬 [Directus Community](https://directus.chat/)
- 📧 [Stream Support](https://getstream.io/support/)
