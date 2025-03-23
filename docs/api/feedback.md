# Feedback API

The Feedback API provides endpoints for submitting, retrieving, and managing feedback between users after task completion on the CoAI platform.

## Submit Feedback

Submits feedback for a user after task completion.

**URL**: `/api/feedback`

**Method**: `POST`

**Authentication**: Required

**Request Body**:

```json
{
  "taskId": "60d21b4667d0d8992e610c85",
  "receiverId": "60d21b4667d0d8992e610c88",
  "rating": 4.5,
  "comment": "Excellent work on the Solana dApp. The code was well-structured and the documentation was very thorough. Communication was also great throughout the project.",
  "skillRatings": [
    {
      "skill": "Solana",
      "rating": 5
    },
    {
      "skill": "React",
      "rating": 4.5
    },
    {
      "skill": "JavaScript",
      "rating": 4
    }
  ]
}
```

**Successful Response** (Status 201):

```json
{
  "feedback": {
    "id": "60d21b4667d0d8992e610c97",
    "task": "60d21b4667d0d8992e610c85",
    "sender": "60d21b4667d0d8992e610c86",
    "receiver": "60d21b4667d0d8992e610c88",
    "rating": 4.5,
    "comment": "Excellent work on the Solana dApp. The code was well-structured and the documentation was very thorough. Communication was also great throughout the project.",
    "skillRatings": [
      {
        "skill": "Solana",
        "rating": 5
      },
      {
        "skill": "React",
        "rating": 4.5
      },
      {
        "skill": "JavaScript",
        "rating": 4
      }
    ],
    "createdAt": "2023-06-21T10:15:35.426Z"
  },
  "message": "Feedback submitted successfully"
}
```

**Error Responses**:

- Status 401: Not authenticated
- Status 400: Invalid input data
- Status 404: Task or user not found
- Status 400: Task not completed
- Status 400: Feedback already submitted
- Status 403: Not authorized to submit feedback for this task

## Get Feedback by Task ID

Retrieves all feedback associated with a specific task.

**URL**: `/api/feedback/task/:taskId`

**Method**: `GET`

**Authentication**: Required

**URL Parameters**:

- `taskId`: Task ID

**Successful Response** (Status 200):

```json
{
  "feedback": [
    {
      "id": "60d21b4667d0d8992e610c97",
      "task": {
        "id": "60d21b4667d0d8992e610c85",
        "title": "Build a Solana dApp"
      },
      "sender": {
        "id": "60d21b4667d0d8992e610c86",
        "name": "Jane Smith"
      },
      "receiver": {
        "id": "60d21b4667d0d8992e610c88",
        "name": "John Doe"
      },
      "rating": 4.5,
      "comment": "Excellent work on the Solana dApp. The code was well-structured and the documentation was very thorough. Communication was also great throughout the project.",
      "skillRatings": [
        {
          "skill": "Solana",
          "rating": 5
        },
        {
          "skill": "React",
          "rating": 4.5
        },
        {
          "skill": "JavaScript",
          "rating": 4
        }
      ],
      "createdAt": "2023-06-21T10:15:35.426Z"
    },
    {
      "id": "60d21b4667d0d8992e610c98",
      "task": {
        "id": "60d21b4667d0d8992e610c85",
        "title": "Build a Solana dApp"
      },
      "sender": {
        "id": "60d21b4667d0d8992e610c88",
        "name": "John Doe"
      },
      "receiver": {
        "id": "60d21b4667d0d8992e610c86",
        "name": "Jane Smith"
      },
      "rating": 5,
      "comment": "Great client! Clear requirements and prompt payment. Would definitely work with again.",
      "skillRatings": [],
      "createdAt": "2023-06-21T11:20:45.426Z"
    }
  ]
}
```

**Error Responses**:

- Status 401: Not authenticated
- Status 404: Task not found

## Get Feedback for User

Retrieves all feedback received by a specific user.

**URL**: `/api/feedback/user/:userId`

**Method**: `GET`

**Authentication**: Required

**URL Parameters**:

- `userId`: User ID

**Query Parameters**:

- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of feedback items per page (default: 10)
- `sortBy` (optional): Field to sort by (default: createdAt)
- `order` (optional): Sort order (asc or desc, default: desc)

**Successful Response** (Status 200):

```json
{
  "feedback": [
    {
      "id": "60d21b4667d0d8992e610c97",
      "task": {
        "id": "60d21b4667d0d8992e610c85",
        "title": "Build a Solana dApp"
      },
      "sender": {
        "id": "60d21b4667d0d8992e610c86",
        "name": "Jane Smith"
      },
      "rating": 4.5,
      "comment": "Excellent work on the Solana dApp. The code was well-structured and the documentation was very thorough. Communication was also great throughout the project.",
      "skillRatings": [
        {
          "skill": "Solana",
          "rating": 5
        },
        {
          "skill": "React",
          "rating": 4.5
        },
        {
          "skill": "JavaScript",
          "rating": 4
        }
      ],
      "createdAt": "2023-06-21T10:15:35.426Z"
    },
    // More feedback...
  ],
  "totalFeedback": 15,
  "totalPages": 2,
  "currentPage": 1,
  "averageRating": 4.7,
  "skillRatingsSummary": [
    {
      "skill": "Solana",
      "averageRating": 4.8,
      "count": 10
    },
    {
      "skill": "React",
      "averageRating": 4.6,
      "count": 12
    },
    {
      "skill": "JavaScript",
      "averageRating": 4.5,
      "count": 15
    }
  ]
}
```

**Error Responses**:

- Status 401: Not authenticated
- Status 404: User not found

## Update Feedback

Updates an existing feedback submission.

**URL**: `/api/feedback/:id`

**Method**: `PATCH`

**Authentication**: Required (must be the feedback sender)

**URL Parameters**:

- `id`: Feedback ID

**Request Body** (all fields optional):

```json
{
  "rating": 5,
  "comment": "Updated feedback: Truly outstanding work on the Solana dApp. Exceeded all expectations!",
  "skillRatings": [
    {
      "skill": "Solana",
      "rating": 5
    },
    {
      "skill": "React",
      "rating": 5
    },
    {
      "skill": "JavaScript",
      "rating": 4.5
    }
  ]
}
```

**Successful Response** (Status 200):

```json
{
  "feedback": {
    "id": "60d21b4667d0d8992e610c97",
    "task": "60d21b4667d0d8992e610c85",
    "sender": "60d21b4667d0d8992e610c86",
    "receiver": "60d21b4667d0d8992e610c88",
    "rating": 5,
    "comment": "Updated feedback: Truly outstanding work on the Solana dApp. Exceeded all expectations!",
    "skillRatings": [
      {
        "skill": "Solana",
        "rating": 5
      },
      {
        "skill": "React",
        "rating": 5
      },
      {
        "skill": "JavaScript",
        "rating": 4.5
      }
    ],
    "createdAt": "2023-06-21T10:15:35.426Z",
    "updatedAt": "2023-06-21T15:30:20.426Z"
  },
  "message": "Feedback updated successfully"
}
```

**Error Responses**:

- Status 401: Not authenticated
- Status 403: Not authorized (not the feedback sender)
- Status 404: Feedback not found
- Status 400: Invalid input data 