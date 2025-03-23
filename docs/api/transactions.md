# Transactions API

The Transactions API provides endpoints for retrieving transaction history and details related to payments, escrow deposits, and other financial activities on the CoAI platform.

## Get All Transactions

Retrieves a list of all transactions for the authenticated user with optional filtering.

**URL**: `/api/transactions`

**Method**: `GET`

**Authentication**: Required

**Query Parameters**:

- `type` (optional): Filter transactions by type (payment, escrow, platform_fee, ai_contribution_fee)
- `status` (optional): Filter transactions by status (pending, completed, failed)
- `from` (optional): Filter transactions by sender
- `to` (optional): Filter transactions by receiver
- `task` (optional): Filter transactions by associated task ID
- `startDate` (optional): Filter transactions after this date (ISO format)
- `endDate` (optional): Filter transactions before this date (ISO format)
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of transactions per page (default: 10)
- `sortBy` (optional): Field to sort by (default: createdAt)
- `order` (optional): Sort order (asc or desc, default: desc)

**Successful Response** (Status 200):

```json
{
  "transactions": [
    {
      "id": "60d21b4667d0d8992e610c95",
      "from": "60d21b4667d0d8992e610c86",
      "to": "system",
      "amount": 2.5,
      "task": {
        "id": "60d21b4667d0d8992e610c85",
        "title": "Build a Solana dApp"
      },
      "type": "escrow",
      "status": "completed",
      "createdAt": "2023-06-18T11:30:25.426Z"
    },
    {
      "id": "60d21b4667d0d8992e610c96",
      "from": "system",
      "to": "60d21b4667d0d8992e610c88",
      "amount": 2.375,
      "task": {
        "id": "60d21b4667d0d8992e610c85",
        "title": "Build a Solana dApp"
      },
      "type": "payment",
      "status": "completed",
      "createdAt": "2023-06-21T09:15:35.426Z"
    },
    // More transactions...
  ],
  "totalTransactions": 25,
  "totalPages": 3,
  "currentPage": 1
}
```

**Error Responses**:

- Status 401: Not authenticated

## Get Transaction by ID

Retrieves detailed information about a specific transaction.

**URL**: `/api/transactions/:id`

**Method**: `GET`

**Authentication**: Required (must be sender or receiver)

**URL Parameters**:

- `id`: Transaction ID

**Successful Response** (Status 200):

```json
{
  "transaction": {
    "id": "60d21b4667d0d8992e610c95",
    "from": {
      "id": "60d21b4667d0d8992e610c86",
      "name": "Jane Smith",
      "walletAddress": "5qWt2..."
    },
    "to": "system",
    "amount": 2.5,
    "task": {
      "id": "60d21b4667d0d8992e610c85",
      "title": "Build a Solana dApp",
      "description": "Create a simple dApp that interacts with Solana blockchain",
      "status": "funded"
    },
    "type": "escrow",
    "status": "completed",
    "createdAt": "2023-06-18T11:30:25.426Z",
    "transactionHash": "2ZGGGDKnhnvS6Jx8zFkFEUzx2t2mFafbVN9fUk4TLDeM",
    "currency": "SOL"
  }
}
```

**Error Responses**:

- Status 401: Not authenticated
- Status 403: Not authorized (not sender or receiver)
- Status 404: Transaction not found

## Get Transaction Statistics

Retrieves statistical information about the user's transactions.

**URL**: `/api/transactions/statistics`

**Method**: `GET`

**Authentication**: Required

**Successful Response** (Status 200):

```json
{
  "statistics": {
    "totalTransactions": 25,
    "totalSpent": 7.5,
    "totalReceived": 15.25,
    "totalEscrow": 2.5,
    "totalPlatformFees": 0.75,
    "totalAiContributionFees": 0.25,
    "incomeByMonth": {
      "2023-01": 0,
      "2023-02": 0,
      "2023-03": 0,
      "2023-04": 0,
      "2023-05": 2.5,
      "2023-06": 12.75
    },
    "spendingByMonth": {
      "2023-01": 0,
      "2023-02": 0,
      "2023-03": 0,
      "2023-04": 0,
      "2023-05": 2.5,
      "2023-06": 5.0
    },
    "transactionsByType": {
      "payment": 10,
      "escrow": 8,
      "platform_fee": 5,
      "ai_contribution_fee": 2
    }
  }
}
```

**Error Responses**:

- Status 401: Not authenticated 