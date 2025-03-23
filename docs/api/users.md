# Users API

The Users API provides endpoints for retrieving and managing user information on the CoAI platform, including profile data, skills, and statistics.

## Get User Profile

Retrieves detailed information about a specific user.

**URL**: `/api/users/:id`

**Method**: `GET`

**Authentication**: Required

**URL Parameters**:

- `id`: User ID

**Successful Response** (Status 200):

```json
{
  "user": {
    "id": "60d21b4667d0d8992e610c88",
    "name": "John Doe",
    "email": "john@example.com",
    "walletAddress": "5qWt2...",
    "bio": "Experienced blockchain developer with a focus on Solana and Ethereum.",
    "skills": [
      {
        "name": "Solana",
        "level": 4.8
      },
      {
        "name": "React",
        "level": 4.6
      },
      {
        "name": "JavaScript",
        "level": 4.5
      }
    ],
    "reputation": 95,
    "tasksCompleted": 12,
    "tasksCreated": 4,
    "joinedAt": "2023-01-15T10:30:15.426Z"
  }
}
```

**Error Responses**:

- Status 401: Not authenticated
- Status 404: User not found

## Update User Profile

Updates the profile information for the authenticated user.

**URL**: `/api/users/profile`

**Method**: `PATCH`

**Authentication**: Required

**Request Body** (all fields optional):

```json
{
  "name": "John A. Doe",
  "bio": "Senior blockchain developer specializing in Solana dApps and smart contracts.",
  "email": "johndoe@newmail.com"
}
```

**Successful Response** (Status 200):

```json
{
  "user": {
    "id": "60d21b4667d0d8992e610c88",
    "name": "John A. Doe",
    "email": "johndoe@newmail.com",
    "walletAddress": "5qWt2...",
    "bio": "Senior blockchain developer specializing in Solana dApps and smart contracts.",
    "skills": [
      {
        "name": "Solana",
        "level": 4.8
      },
      {
        "name": "React",
        "level": 4.6
      },
      {
        "name": "JavaScript",
        "level": 4.5
      }
    ],
    "updatedAt": "2023-06-25T14:20:35.426Z"
  },
  "message": "Profile updated successfully"
}
```

**Error Responses**:

- Status 401: Not authenticated
- Status 400: Invalid input data

## Add User Skill

Adds a new skill to the authenticated user's profile.

**URL**: `/api/users/skills`

**Method**: `POST`

**Authentication**: Required

**Request Body**:

```json
{
  "name": "TypeScript",
  "level": 4.2
}
```

**Successful Response** (Status 201):

```json
{
  "skill": {
    "name": "TypeScript",
    "level": 4.2
  },
  "message": "Skill added successfully"
}
```

**Error Responses**:

- Status 401: Not authenticated
- Status 400: Invalid input data
- Status 400: Skill already exists

## Update User Skill

Updates an existing skill in the authenticated user's profile.

**URL**: `/api/users/skills/:skillName`

**Method**: `PATCH`

**Authentication**: Required

**URL Parameters**:

- `skillName`: Name of the skill to update

**Request Body**:

```json
{
  "level": 4.5
}
```

**Successful Response** (Status 200):

```json
{
  "skill": {
    "name": "TypeScript",
    "level": 4.5
  },
  "message": "Skill updated successfully"
}
```

**Error Responses**:

- Status 401: Not authenticated
- Status 404: Skill not found
- Status 400: Invalid input data

## Remove User Skill

Removes a skill from the authenticated user's profile.

**URL**: `/api/users/skills/:skillName`

**Method**: `DELETE`

**Authentication**: Required

**URL Parameters**:

- `skillName`: Name of the skill to remove

**Successful Response** (Status 200):

```json
{
  "message": "Skill removed successfully"
}
```

**Error Responses**:

- Status 401: Not authenticated
- Status 404: Skill not found

## Get User Task History

Retrieves the task history for a specific user.

**URL**: `/api/users/:id/tasks`

**Method**: `GET`

**Authentication**: Required

**URL Parameters**:

- `id`: User ID

**Query Parameters**:

- `role` (optional): Filter by role (creator, worker)
- `status` (optional): Filter by task status (open, in_progress, completed, cancelled)
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of tasks per page (default: 10)
- `sortBy` (optional): Field to sort by (default: createdAt)
- `order` (optional): Sort order (asc or desc, default: desc)

**Successful Response** (Status 200):

```json
{
  "tasks": [
    {
      "id": "60d21b4667d0d8992e610c85",
      "title": "Build a Solana dApp",
      "description": "Create a simple dApp that interacts with Solana blockchain",
      "category": "Development",
      "requiredSkills": ["Solana", "React", "JavaScript"],
      "price": 2.5,
      "deadline": "2023-08-15T00:00:00.000Z",
      "status": "completed",
      "creator": {
        "id": "60d21b4667d0d8992e610c86",
        "name": "Jane Smith"
      },
      "assignedTo": {
        "id": "60d21b4667d0d8992e610c88",
        "name": "John Doe"
      },
      "createdAt": "2023-06-17T15:24:18.957Z",
      "completedAt": "2023-06-21T09:15:35.426Z",
      "role": "worker"
    },
    // More tasks...
  ],
  "totalTasks": 12,
  "totalPages": 2,
  "currentPage": 1,
  "user": {
    "id": "60d21b4667d0d8992e610c88",
    "name": "John Doe"
  }
}
```

**Error Responses**:

- Status 401: Not authenticated
- Status 404: User not found

## Get User Statistics

Retrieves statistics and analytics for a specific user.

**URL**: `/api/users/:id/statistics`

**Method**: `GET`

**Authentication**: Required

**URL Parameters**:

- `id`: User ID

**Successful Response** (Status 200):

```json
{
  "statistics": {
    "tasksCompleted": 12,
    "tasksCreated": 4,
    "totalEarned": 28.5,
    "totalSpent": 10.25,
    "averageRating": 4.7,
    "completionRate": 92,
    "averageCompletionTime": 5.2, // in days
    "mostUsedSkills": [
      {
        "name": "Solana",
        "count": 8
      },
      {
        "name": "React",
        "count": 10
      },
      {
        "name": "JavaScript",
        "count": 12
      }
    ],
    "tasksByCategory": {
      "Development": 8,
      "Design": 2,
      "Writing": 1,
      "Marketing": 1
    },
    "earningsByMonth": {
      "2023-01": 0,
      "2023-02": 2.5,
      "2023-03": 5.0,
      "2023-04": 7.5,
      "2023-05": 5.0,
      "2023-06": 8.5
    },
    "reputationHistory": {
      "2023-01": 50,
      "2023-02": 60,
      "2023-03": 70,
      "2023-04": 80,
      "2023-05": 85,
      "2023-06": 95
    }
  }
}
```

**Error Responses**:

- Status 401: Not authenticated
- Status 404: User not found

## Search Users

Searches for users by name, skills, or wallet address.

**URL**: `/api/users/search`

**Method**: `GET`

**Authentication**: Required

**Query Parameters**:

- `query`: Search term (minimum 3 characters)
- `searchBy` (optional): Field to search by (name, skills, walletAddress, all). Default: all
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of users per page (default: 10)
- `sortBy` (optional): Field to sort by (default: reputation)
- `order` (optional): Sort order (asc or desc, default: desc)

**Successful Response** (Status 200):

```json
{
  "users": [
    {
      "id": "60d21b4667d0d8992e610c88",
      "name": "John Doe",
      "walletAddress": "5qWt2...",
      "skills": [
        {
          "name": "Solana",
          "level": 4.8
        },
        {
          "name": "React",
          "level": 4.6
        },
        {
          "name": "JavaScript",
          "level": 4.5
        }
      ],
      "reputation": 95,
      "tasksCompleted": 12
    },
    // More users...
  ],
  "totalUsers": 25,
  "totalPages": 3,
  "currentPage": 1
}
```

**Error Responses**:

- Status 401: Not authenticated
- Status 400: Search query too short 