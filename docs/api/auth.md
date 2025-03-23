# Authentication API

The authentication API provides endpoints for user registration, login, and account management.

## Register a New User

Creates a new user account and returns an authentication token.

**URL**: `/api/auth/register`

**Method**: `POST`

**Authentication**: None

**Request Body**:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "walletAddress": "5qWt2..."
}
```

**Successful Response** (Status 201):

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "john@example.com",
    "walletAddress": "5qWt2...",
    "skills": [],
    "reputation": 0,
    "createdAt": "2023-06-17T15:24:18.957Z"
  }
}
```

**Error Responses**:

- Status 400: Email already exists
- Status 400: Invalid input data

## Login

Authenticates a user and returns a token.

**URL**: `/api/auth/login`

**Method**: `POST`

**Authentication**: None

**Request Body**:

```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Successful Response** (Status 200):

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "john@example.com",
    "walletAddress": "5qWt2...",
    "skills": ["JavaScript", "React", "Solana"],
    "reputation": 75,
    "createdAt": "2023-06-17T15:24:18.957Z"
  }
}
```

**Error Responses**:

- Status 401: Invalid credentials
- Status 400: Invalid input data

## Wallet Login

Authenticates a user using their Solana wallet signature.

**URL**: `/api/auth/wallet-login`

**Method**: `POST`

**Authentication**: None

**Request Body**:

```json
{
  "walletAddress": "5qWt2...",
  "signature": "5Ko8BQ9QUKVw7CvK...",
  "message": "Login to CoAI Platform: 1686745458"
}
```

**Successful Response** (Status 200):

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "john@example.com", 
    "walletAddress": "5qWt2...",
    "skills": ["JavaScript", "React", "Solana"],
    "reputation": 75,
    "createdAt": "2023-06-17T15:24:18.957Z"
  }
}
```

**Error Responses**:

- Status 401: Invalid signature
- Status 404: Wallet not registered
- Status 400: Invalid input data

## Get Current User

Retrieves the current user's information.

**URL**: `/api/auth/me`

**Method**: `GET`

**Authentication**: Required

**Successful Response** (Status 200):

```json
{
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "john@example.com",
    "walletAddress": "5qWt2...",
    "skills": ["JavaScript", "React", "Solana"],
    "reputation": 75,
    "createdAt": "2023-06-17T15:24:18.957Z"
  }
}
```

**Error Responses**:

- Status 401: Not authenticated 