# Wallet API

The Wallet API provides endpoints for managing Solana wallet interactions, checking balances, and handling payments on the CoAI platform.

## Get Wallet Balance

Retrieves the SOL balance for a specified wallet address.

**URL**: `/api/wallet/balance/:walletAddress`

**Method**: `GET`

**Authentication**: Required

**URL Parameters**:

- `walletAddress`: Solana wallet address

**Successful Response** (Status 200):

```json
{
  "balance": 5.42,
  "currency": "SOL"
}
```

**Error Responses**:

- Status 401: Not authenticated
- Status 400: Invalid wallet address
- Status 500: Error fetching wallet balance

## Get Token Balance

Retrieves the $CoAI token balance for a specified wallet address.

**URL**: `/api/wallet/token-balance/:walletAddress`

**Method**: `GET`

**Authentication**: Required

**URL Parameters**:

- `walletAddress`: Solana wallet address

**Successful Response** (Status 200):

```json
{
  "balance": 1250.75,
  "currency": "CoAI"
}
```

**Error Responses**:

- Status 401: Not authenticated
- Status 400: Invalid wallet address
- Status 500: Error fetching token balance

## Create Escrow

Creates an escrow deposit for a task payment.

**URL**: `/api/wallet/escrow/:taskId`

**Method**: `POST`

**Authentication**: Required (must be the task creator)

**URL Parameters**:

- `taskId`: Task ID

**Successful Response** (Status 200):

```json
{
  "message": "Escrow created successfully",
  "transaction": {
    "id": "60d21b4667d0d8992e610c91",
    "from": "60d21b4667d0d8992e610c86",
    "to": "system",
    "amount": 2.5,
    "task": "60d21b4667d0d8992e610c85",
    "type": "escrow",
    "status": "completed", 
    "createdAt": "2023-06-18T11:30:25.426Z"
  },
  "task": {
    "id": "60d21b4667d0d8992e610c85",
    "title": "Build a Solana dApp",
    "status": "funded",
    "updatedAt": "2023-06-18T11:30:25.426Z"
  }
}
```

**Error Responses**:

- Status 401: Not authenticated
- Status 403: Not authorized (not the task creator)
- Status 404: Task not found
- Status 400: Task is not in 'open' status
- Status 400: Insufficient funds
- Status 500: Error creating escrow

## Release Payment

Releases payment from escrow to the task assignee.

**URL**: `/api/wallet/release-payment/:taskId`

**Method**: `POST`

**Authentication**: Required (must be the task creator)

**URL Parameters**:

- `taskId`: Task ID

**Successful Response** (Status 200):

```json
{
  "message": "Payment released successfully",
  "transaction": {
    "id": "60d21b4667d0d8992e610c92",
    "from": "system",
    "to": "60d21b4667d0d8992e610c88",
    "amount": 2.375, 
    "task": "60d21b4667d0d8992e610c85",
    "type": "payment",
    "status": "completed",
    "createdAt": "2023-06-21T09:15:35.426Z"
  },
  "platformFee": {
    "id": "60d21b4667d0d8992e610c93",
    "from": "system",
    "to": "platform",
    "amount": 0.125,
    "task": "60d21b4667d0d8992e610c85",
    "type": "platform_fee",
    "status": "completed",
    "createdAt": "2023-06-21T09:15:35.426Z"
  }
}
```

**Error Responses**:

- Status 401: Not authenticated
- Status 403: Not authorized (not the task creator)
- Status 404: Task not found
- Status 400: Task is not in correct status
- Status 400: No escrow found for this task
- Status 500: Error releasing payment 