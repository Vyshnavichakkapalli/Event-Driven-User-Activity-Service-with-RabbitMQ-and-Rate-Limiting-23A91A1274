# REST API Documentation

## Base URL
`http://localhost:3000/api/v1`

## Endpoints

### Ingest Activity
**POST `/activities`**

Ingests a new user activity and queues it for processing.

**Headers:**
- `Content-Type: application/json`

**Rate Limiting:**
- 50 requests per 60 seconds per unique IP address.
- Exceeding the limit results in a `429 Too Many Requests` with a `Retry-After` header.

**Request Body:**
```json
{
    "userId": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "eventType": "user_login",
    "timestamp": "2023-10-27T10:00:00Z",
    "payload": {
        "ipAddress": "192.168.1.1",
        "device": "desktop",
        "browser": "Chrome"
    }
}
```

**Responses:**
- `202 Accepted`
  ```json
  {
      "message": "Accepted",
      "id": "e4f8d221-1b07-4e09-9fb7-bf6cc7e1fc23"
  }
  ```
- `400 Bad Request`
  ```json
  {
      "error": "\"userId\" is required"
  }
  ```
- `429 Too Many Requests`
  ```json
  {
      "error": "Too Many Requests"
  }
  ```

### Health Check
**GET `/health`**
Returns `200 OK` for docker-compose load balancing.
