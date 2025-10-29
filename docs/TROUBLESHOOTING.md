# Troubleshooting Guide

Common issues and solutions for the Directus GetStream extension.

## Extension Not Loading

### Symptom

Extension endpoints return `404 Not Found` or are not accessible.

#### Check extension directory

Ensure the extension is installed in the correct location:

```bash
# Directus extensions should be in:
extensions/endpoints/directus-extension-getstream-io/
```

#### Verify Directus logs

Check logs for extension loading errors:

```bash
# Docker
docker-compose logs directus

# PM2
pm2 logs directus

# Direct logs
tail -f /path/to/directus/logs/directus.log
```

#### Restart Directus

Extensions are loaded at startup:

```bash
# Docker
docker-compose restart directus

# PM2
pm2 restart directus

# Direct
# Stop and start your Directus process
```

#### Check Directus version

Ensure you're running Directus 10.10 or higher:

```bash
# Check package.json in your Directus installation
cat package.json | grep "directus"
```

#### Verify extension build

The extension must be built before use:

```bash
cd extensions/endpoints/directus-extension-getstream-io
yarn build
# or
npm run build
```

---

## Token Generation Fails

### Symptom

API returns `500 Internal Server Error` when generating tokens.

### Solutions

**1. Verify environment variables**

Check that Stream credentials are set in `.env`:

```bash
# Required variables
STREAMIO_API_KEY=your_api_key_here
STREAMIO_API_SECRET=your_api_secret_here
```

**2. Validate credentials**

Use the health check endpoint to verify configuration:

```bash
curl http://localhost:8055/getstream-io/health
```

Expected response when configured:

```json
{
  "status": "ok",
  "configured": true,
  "message": "GetStream extension is ready"
}
```

**3. Check API key format**

- API keys should be alphanumeric strings
- Ensure no extra spaces or quotes in `.env` file
- Get fresh credentials from [Stream Dashboard](https://getstream.io/dashboard/)

**4. Review Directus logs**

Look for detailed error messages:

```bash
docker-compose logs directus | grep -i "stream\|token\|error"
```

---

## Invalid userId Error

### Symptom

`400 Bad Request` with message: `userId is required in request body`

### Solution

Ensure the `userId` field is included in your request body:

```bash
# Correct
curl -X POST http://localhost:8055/getstream-io/userToken \
  -H "Content-Type: application/json" \
  -d '{"userId": "user123"}'

# Incorrect (missing userId)
curl -X POST http://localhost:8055/getstream-io/userToken \
  -H "Content-Type: application/json" \
  -d '{}'
```

---

## Empty callIds Error

### Symptom

`400 Bad Request` with message: `callIds array cannot be empty`

### Solution

Provide at least one call ID in the correct format (`type:id`):

```bash
# Correct
curl -X POST http://localhost:8055/getstream-io/callToken \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "callIds": ["default:call1"]
  }'

# Incorrect (empty array)
curl -X POST http://localhost:8055/getstream-io/callToken \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "callIds": []
  }'
```

---

## CORS Issues

### Symptom

Browser console shows CORS errors when calling endpoints from frontend.

### Solution

Configure CORS in Directus `.env`:

```bash
# Allow your frontend origin
CORS_ENABLED=true
CORS_ORIGIN=http://localhost:3000,https://yourdomain.com
CORS_METHODS=GET,POST,PATCH,DELETE
CORS_ALLOWED_HEADERS=Content-Type,Authorization
```

For development, you can allow all origins (not recommended for production):

```bash
CORS_ORIGIN=*
```

---

## Token Expired Error

### Symptom

Stream SDK returns "token expired" error.

### Solution

**1. Generate a new token**

Tokens expire after the specified duration (default: 1 hour).

```bash
curl -X POST http://localhost:8055/getstream-io/userToken \
  -H "Content-Type: application/json" \
  -d '{"userId": "user123", "expirationSeconds": 7200}'
```

**2. Implement token refresh**

In your application, implement automatic token refresh before expiration:

```javascript
async function refreshToken(userId) {
  const response = await fetch('http://localhost:8055/getstream-io/userToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, expirationSeconds: 3600 }),
  });
  return response.json();
}
```

---

## Extension Auto-Reload Not Working

### Symptom

Changes to extension code not reflected after editing.

### Solution

**1. Enable auto-reload in development**

Set in Directus `.env`:

```bash
EXTENSIONS_AUTO_RELOAD=true
```

**2. Manual rebuild**

Rebuild the extension after code changes:

```bash
cd extensions/endpoints/directus-extension-getstream-io
yarn build
```

**3. Restart Directus**

Auto-reload may not work for all changes:

```bash
docker-compose restart directus
```

---

## Performance Issues

### Symptom

Token generation is slow or times out.

### Solutions

**1. Check network connectivity**

Ensure your Directus instance can reach Stream's API:

```bash
curl -I https://api.stream-io-api.com
```

**2. Review logs for bottlenecks**

```bash
docker-compose logs directus | grep -i "stream\|slow\|timeout"
```

**3. Consider caching (if appropriate)**

Note: Token caching is generally not recommended as tokens should be fresh, but you can implement rate limiting if needed.

---

## Debugging Steps

### Enable verbose logging

Add logging to the extension (for development):

```typescript
// In src/index.ts
logger.info({ userId, type: 'user' }, 'Generating user token');
```

### Test with curl

Isolate issues by testing endpoints directly:

```bash
# Test health check
curl -v http://localhost:8055/getstream-io/health

# Test user token
curl -v -X POST http://localhost:8055/getstream-io/userToken \
  -H "Content-Type: application/json" \
  -d '{"userId": "test123"}'
```

### Check environment

Verify all required environment variables:

```bash
# In Directus container
docker-compose exec directus env | grep STREAMIO
```

---

## Getting Help

If you're still experiencing issues:

1. **Check GitHub Issues**: [github.com/AbhinayMe/directus-extension-getstream-io/issues](https://github.com/AbhinayMe/directus-extension-getstream-io/issues)
2. **Create an Issue**: Include error logs, Directus version, and steps to reproduce
3. **Directus Community**: [directus.chat](https://directus.chat/)
4. **Stream Support**: [getstream.io/support](https://getstream.io/support/)

### Information to Include

When reporting issues, provide:

- Directus version
- Node.js version
- Extension version
- Error logs (redact sensitive data)
- Steps to reproduce
- Environment (Docker, PM2, direct, etc.)
