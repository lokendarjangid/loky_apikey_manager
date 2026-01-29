# 🔌 API Documentation - KeyFlow

## Base URL
```
Production: https://your-domain.com/api
Development: http://localhost:3000/api
```

## Authentication

Most endpoints require Clerk authentication. Include the Clerk session token in your requests:

```bash
Authorization: Bearer <clerk_session_token>
```

For API key verification (public endpoint), use:
```bash
X-API-Key: sk_live_abc123...
```

---

## Public Endpoints

### Verify API Key

Verify an API key and track usage. This is the main endpoint your users will call to authenticate with their API keys.

**Endpoint:** `POST /api/v1/verify`

**Headers:**
```
X-API-Key: sk_live_abc123...
```

**Response (200 OK):**
```json
{
  "valid": true,
  "keyId": "clx123abc",
  "userId": "user_abc123",
  "projectId": "proj_xyz789",
  "rateLimit": {
    "limit": 1000,
    "remaining": 999,
    "reset": "2024-01-29T12:00:00Z"
  }
}
```

**Response (401 Unauthorized):**
```json
{
  "valid": false,
  "error": "API key not found"
}
```

**Response (429 Rate Limited):**
```json
{
  "valid": false,
  "error": "Rate limit exceeded",
  "rateLimit": {
    "limit": 1000,
    "remaining": 0,
    "reset": "2024-01-29T12:00:00Z"
  }
}
```

**Example:**
```bash
curl -X POST https://your-domain.com/api/v1/verify \
  -H "X-API-Key: sk_live_abc123def456"
```

---

## Protected Endpoints (Require Auth)

### List API Keys

Get all API keys for the authenticated user.

**Endpoint:** `GET /api/keys`

**Headers:**
```
Authorization: Bearer <clerk_token>
```

**Response (200 OK):**
```json
{
  "keys": [
    {
      "id": "key_123",
      "name": "Production API",
      "prefix": "sk_live_abc123",
      "status": "active",
      "rateLimit": 5000,
      "lastUsedAt": "2024-01-29T10:30:00Z",
      "createdAt": "2024-01-15T08:00:00Z",
      "project": {
        "id": "proj_xyz",
        "name": "Mobile App"
      }
    }
  ]
}
```

**Example:**
```bash
curl https://your-domain.com/api/keys \
  -H "Authorization: Bearer <clerk_token>"
```

---

### Create API Key

Generate a new API key.

**Endpoint:** `POST /api/keys`

**Headers:**
```
Authorization: Bearer <clerk_token>
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Production API",
  "projectId": "proj_xyz789",  // optional
  "rateLimit": 5000,           // optional, default: 1000
  "expiresAt": "2025-12-31"    // optional
}
```

**Response (201 Created):**
```json
{
  "apiKey": {
    "id": "key_123",
    "name": "Production API",
    "key": "sk_live_abc123def456...",  // ⚠️ ONLY SHOWN ONCE!
    "prefix": "sk_live_abc123",
    "status": "active",
    "rateLimit": 5000,
    "createdAt": "2024-01-29T10:30:00Z"
  }
}
```

**Important:** The full API key is only returned once during creation. Store it securely!

**Example:**
```bash
curl -X POST https://your-domain.com/api/keys \
  -H "Authorization: Bearer <clerk_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Production API",
    "rateLimit": 5000
  }'
```

---

### Get API Key Details

Get detailed information about a specific API key including usage statistics.

**Endpoint:** `GET /api/keys/[id]`

**Headers:**
```
Authorization: Bearer <clerk_token>
```

**Response (200 OK):**
```json
{
  "apiKey": {
    "id": "key_123",
    "name": "Production API",
    "prefix": "sk_live_abc123",
    "status": "active",
    "rateLimit": 5000,
    "lastUsedAt": "2024-01-29T10:30:00Z",
    "createdAt": "2024-01-15T08:00:00Z",
    "project": {
      "id": "proj_xyz",
      "name": "Mobile App"
    },
    "usage": [
      {
        "date": "2024-01-29",
        "requestCount": 1234,
        "successCount": 1200,
        "errorCount": 34
      }
    ]
  }
}
```

**Example:**
```bash
curl https://your-domain.com/api/keys/key_123 \
  -H "Authorization: Bearer <clerk_token>"
```

---

### Revoke API Key

Revoke (deactivate) an API key. This action cannot be undone.

**Endpoint:** `DELETE /api/keys/[id]`

**Headers:**
```
Authorization: Bearer <clerk_token>
```

**Response (200 OK):**
```json
{
  "message": "API key revoked successfully"
}
```

**Example:**
```bash
curl -X DELETE https://your-domain.com/api/keys/key_123 \
  -H "Authorization: Bearer <clerk_token>"
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "error": "API key not found"
}
```

### 403 Forbidden
```json
{
  "error": "Free plan limited to 5 API keys. Upgrade to create more."
}
```

### 429 Rate Limited
```json
{
  "error": "Rate limit exceeded",
  "rateLimit": {
    "limit": 1000,
    "remaining": 0,
    "reset": "2024-01-29T12:00:00Z"
  }
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

### Per-Key Rate Limits
- Each API key has its own rate limit (default: 1000 requests/hour)
- Configurable when creating the key
- Automatically reset every hour

### Plan Limits
- **Free**: 5 API keys, 10,000 requests/month
- **Pro**: Unlimited keys, 1M requests/month
- **Enterprise**: Custom limits

### Rate Limit Headers
When calling `/api/v1/verify`, check these fields in the response:
```json
{
  "rateLimit": {
    "limit": 1000,        // Max requests per hour
    "remaining": 999,     // Requests left this hour
    "reset": "..."        // When the limit resets
  }
}
```

---

## Best Practices

### 1. Store API Keys Securely
- Never commit API keys to version control
- Use environment variables
- Rotate keys regularly

### 2. Handle Rate Limits
```javascript
const response = await fetch('/api/v1/verify', {
  headers: { 'X-API-Key': apiKey }
})

if (response.status === 429) {
  const data = await response.json()
  // Wait until rate limit resets
  const resetTime = new Date(data.rateLimit.reset)
  // Implement exponential backoff
}
```

### 3. Error Handling
```javascript
try {
  const response = await fetch('/api/v1/verify', {
    headers: { 'X-API-Key': apiKey }
  })
  
  const data = await response.json()
  
  if (!data.valid) {
    // Key is invalid or revoked
    console.error('API key error:', data.error)
  }
} catch (error) {
  // Network or server error
  console.error('Request failed:', error)
}
```

### 4. Monitor Usage
- Check the dashboard regularly
- Set up alerts for unusual activity
- Review error rates

---

## SDKs (Coming Soon)

We're working on official SDKs for:
- Node.js
- Python
- Go
- Ruby

For now, use the REST API directly.

---

## Webhooks (Coming Soon)

Subscribe to events:
- `key.created` - New API key created
- `key.revoked` - API key revoked
- `usage.limit` - Usage limit reached
- `usage.alert` - High error rate detected

---

## Support

- GitHub Issues: https://github.com/lokendarjangid/loky_apikey_manager/issues
- Email: support@keyflow.dev
- Documentation: https://docs.keyflow.dev

---

## Changelog

### v1.0.0 (2024-01-29)
- Initial release
- API key generation and management
- Usage tracking
- Rate limiting
- Analytics dashboard
