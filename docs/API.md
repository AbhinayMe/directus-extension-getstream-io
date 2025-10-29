# API Documentation

Complete endpoint documentation for the Directus GetStream extension.

## Base URL

All endpoints are prefixed with `/getstream-io` (e.g., `http://localhost:8055/getstream-io/health`).

## Endpoints

### Health Check

Check extension status and validate configuration.

**Request:**

```http
GET /getstream-io/health
```

**Response:**

```json
{
  "status": "ok",
  "configured": true,
  "endpoints": [
    "/getstream-io/health",
    "/getstream-io/userToken",
    "/getstream-io/callToken"
  ],
  "message": "GetStream extension is ready"
}
```

**Status Codes:**

- `200` — Extension configured and ready
- `500` — Configuration invalid (check `STREAMIO_API_KEY` and `STREAMIO_API_SECRET`)

---

### User Token

Generate an authentication token for a user. Use this token to authenticate users with Stream Video.

**Request:**

```http
POST /getstream-io/userToken
Content-Type: application/json

{
  "userId": "user123",
  "expirationSeconds": 3600
}
```

**Parameters:**

| Field             | Type   | Required | Description                                        |
| ----------------- | ------ | -------- | -------------------------------------------------- |
| userId            | string | Yes      | Unique user identifier                             |
| expirationSeconds | number | No       | Token lifetime in seconds (default: 3600 = 1 hour) |

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "user123",
  "type": "user",
  "expiresAt": "2025-10-30T15:30:00.000Z"
}
```

**Status Codes:**

- `200` — Token generated successfully
- `400` — Missing or invalid `userId`
- `500` — Configuration error or token generation failed

**Example:**

```bash
curl -X POST http://localhost:8055/getstream-io/userToken \
  -H "Content-Type: application/json" \
  -d '{"userId": "user123", "expirationSeconds": 7200}'
```

---

### Call Token

Generate a call-specific token with role-based access. This grants additional permissions for specific calls.

**Request:**

```http
POST /getstream-io/callToken
Content-Type: application/json

{
  "userId": "user123",
  "callIds": ["default:call1", "livestream:meeting123"],
  "role": "admin",
  "expirationSeconds": 3600
}
```

**Parameters:**

| Field             | Type     | Required | Description                                        |
| ----------------- | -------- | -------- | -------------------------------------------------- |
| userId            | string   | Yes      | Unique user identifier                             |
| callIds           | string[] | Yes      | Array of call IDs (format: `type:id`)              |
| role              | string   | No       | User role: `admin`, `moderator`, `user` (default)  |
| expirationSeconds | number   | No       | Token lifetime in seconds (default: 3600 = 1 hour) |

**Call ID Format:**

Call IDs must follow the format `{type}:{id}`:

- `default:call1` — Default call type
- `livestream:meeting123` — Livestream call type
- `audio_room:room456` — Audio room call type

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "user123",
  "type": "call",
  "callIds": ["default:call1", "livestream:meeting123"],
  "role": "admin",
  "expiresAt": "2025-10-30T15:30:00.000Z"
}
```

**Status Codes:**

- `200` — Token generated successfully
- `400` — Missing/invalid `userId`, empty `callIds`, or invalid `role`
- `500` — Configuration error or token generation failed

**Example:**

```bash
curl -X POST http://localhost:8055/getstream-io/callToken \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "callIds": ["default:call1"],
    "role": "moderator",
    "expirationSeconds": 7200
  }'
```

---

## Token Usage

### Using User Tokens

Use the user token to authenticate with the Stream Video SDK:

```javascript
import { StreamVideoClient } from '@stream-io/video-react-sdk';

const client = new StreamVideoClient({
  apiKey: 'YOUR_API_KEY',
  user: { id: 'user123' },
  token: 'USER_TOKEN_FROM_API',
});
```

### Using Call Tokens

Call tokens grant additional access to specific calls. Users need both a user token and a call token:

```javascript
// First, authenticate with user token
const client = new StreamVideoClient({
  apiKey: 'YOUR_API_KEY',
  user: { id: 'user123' },
  token: 'USER_TOKEN',
});

// Then join call using call token
const call = client.call('default', 'call1');
await call.join({ token: 'CALL_TOKEN_FROM_API' });
```

---

## Security Best Practices

- **Never expose tokens** — Generate tokens server-side only
- **Use HTTPS** — Always use HTTPS in production
- **Set expiration** — Use appropriate token expiration times
- **Validate users** — Verify user identity before generating tokens
- **Monitor usage** — Track token generation for abuse patterns

---

## Additional Resources

- [Stream Video Authentication Docs](https://getstream.io/video/docs/api/authentication/)
- [Stream Video JavaScript SDK](https://getstream.io/video/docs/javascript/)
- [Stream Dashboard](https://getstream.io/dashboard/)
