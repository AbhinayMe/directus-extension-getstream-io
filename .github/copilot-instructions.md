# GitHub Copilot Instructions for Directus Stream.io Token Extension

## Project Overview

This is a **Directus custom endpoint extension** that generates Stream.io video authentication tokens (both user tokens and call tokens) using the official `@stream-io/node-sdk`.

### Technology Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript (strict mode)
- **Framework**: Directus Extensions SDK v16.0.2
- **Package Manager**: Yarn v1.22.22
- **SDK**: @stream-io/node-sdk v0.7.15
- **Testing**: Jest with ESM support
- **Build Tool**: Directus Extension CLI (Rollup-based)

## Code Style & Conventions

### TypeScript

- Use strict TypeScript with explicit types
- Prefer interfaces over types for object shapes
- Always export interfaces used in public APIs
- Use JSDoc comments for all public functions
- Include `@see` links to official Stream.io documentation
- Use async/await over promises `.then()`

### Naming Conventions

- **Files**: kebab-case (e.g., `streamio.ts`, `stream-token.ts`)
- **Functions**: camelCase (e.g., `generateUserToken`, `validateStreamConfig`)
- **Interfaces**: PascalCase with descriptive names (e.g., `StreamTokenConfig`, `StreamCallTokenConfig`)
- **Constants**: UPPER_SNAKE_CASE for environment variables
- **Types**: PascalCase (e.g., `StreamTokenResponse`)

### Code Organization

```
src/
  ├── index.ts          # Directus endpoint definitions (Express-like routes)
  └── streamio.ts       # Core Stream.io token generation logic
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

## Stream.io API Integration

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

- Default token validity: 1 hour (Stream.io API default)
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

1. **GET /streamio-token/health**

   - Purpose: Health check and configuration validation
   - Auth: None required
   - Response: Status, configuration state, available endpoints

2. **POST /streamio-token/user**

   - Purpose: Generate user authentication token
   - Body: `{ userId: string, expirationSeconds?: number }`
   - Response: Token with metadata

3. **POST /streamio-token/call**

   - Purpose: Generate call-specific token
   - Body: `{ userId: string, callIds: string[], role?: string, expirationSeconds?: number }`
   - Response: Token with call metadata

4. **POST /streamio-token/generate** (Deprecated)
   - Purpose: Legacy user token endpoint
   - Use `/user` instead

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
3. Add JSDoc with `@see` link to Stream.io docs
4. Create new endpoint in `index.ts`
5. Write comprehensive tests
6. Update README.md and QUICKSTART.md
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
  "lint": "eslint src --ext .ts"
}
```

## Key Dependencies

- `@stream-io/node-sdk`: ^0.7.15 - Official Stream.io Video SDK
- `@directus/extensions-sdk`: 16.0.2 - Directus extension framework
- `@directus/errors`: ^2.0.4 - Directus error handling
- `typescript`: ^5.9.3 - TypeScript compiler
- `jest`: ^29.7.0 - Testing framework
- `eslint`: ^8.57.0 - Linting

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
- Link to official Stream.io and Directus docs

## Maintenance Checklist

Before committing code:

- [ ] Run `yarn build` - ensure no build errors
- [ ] Run `yarn test` - all tests pass
- [ ] Run `yarn lint` - no linting errors
- [ ] Run `yarn validate` - extension structure valid
- [ ] Update README.md if API changed
- [ ] Update QUICKSTART.md if usage changed
- [ ] Check `.env.example` is up to date
- [ ] Verify no secrets in code or commits
- [ ] Update version in package.json if needed

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

- **Directus Docs**: https://docs.directus.io/extensions/
- **Stream.io Docs**: https://getstream.io/video/docs/
- **Node SDK**: https://github.com/GetStream/stream-video-js
- **Issues**: Create issue in repository
- **Directus Community**: https://directus.chat/

---

**Last Updated**: October 28, 2025
**Extension Version**: 1.0.0
**Directus Compatibility**: ^10.10.0
