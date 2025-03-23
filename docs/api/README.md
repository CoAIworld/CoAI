# CoAI Platform API Documentation

This documentation provides details about the CoAI Platform API endpoints, request/response formats, and authentication requirements.

## Base URL

All API endpoints are relative to the base URL:

```
http://localhost:5000/api (Development)
https://api.coai.world/api (Production)
```

## Authentication

Most endpoints require authentication using JSON Web Tokens (JWT). Include the token in the request header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

To obtain a token, use the login or register endpoints.

## Endpoints

The API is organized around the following resources:

- [Authentication](/api/auth.md)
- [Users](/api/users.md)
- [Tasks](/api/tasks.md)
- [Transactions](/api/transactions.md)
- [Wallet](/api/wallet.md)
- [AI Services](/api/ai.md)
- [Feedback](/api/feedback.md)

## Error Handling

The API uses standard HTTP status codes to indicate the success or failure of requests. In case of an error, the response body will include an error message:

```json
{
  "status": "error",
  "message": "Description of the error"
}
```

Common error codes:

- `400` - Bad Request (invalid input)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

## Rate Limiting

The API implements rate limiting to prevent abuse. Each IP address is limited to 100 requests per 15-minute window. Rate limit headers are included in API responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1605027542
```

## Versioning

The API currently doesn't use versioning in the URL path. Future versions may be implemented as needed. 