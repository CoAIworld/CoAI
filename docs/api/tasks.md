# Tasks API

The Tasks API provides endpoints for creating, retrieving, updating, and managing tasks on the CoAI platform.

## Get All Tasks

Retrieves a list of all tasks with optional filtering.

**URL**: `/api/tasks`

**Method**: `GET`

**Authentication**: Required

**Query Parameters**:

- `status` (optional): Filter tasks by status (open, in_progress, completed, cancelled)
- `category` (optional): Filter tasks by category
- `creator` (optional): Filter tasks by creator ID
- `assignedTo` (optional): Filter tasks by assigned user ID
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
      "status": "open",
      "creator": {
        "id": "60d21b4667d0d8992e610c86",
        "name": "Jane Smith"
      },
      "assignedTo": null,
      "createdAt": "2023-06-17T15:24:18.957Z",
      "updatedAt": "2023-06-17T15:24:18.957Z"
    },
    // More tasks...
  ],
  "totalTasks": 45,
  "totalPages": 5,
  "currentPage": 1
}
```

**Error Responses**:

- Status 401: Not authenticated

## Get Task by ID

Retrieves detailed information about a specific task.

**URL**: `/api/tasks/:id`

**Method**: `GET`

**Authentication**: Required

**URL Parameters**:

- `id`: Task ID

**Successful Response** (Status 200):

```json
{
  "task": {
    "id": "60d21b4667d0d8992e610c85",
    "title": "Build a Solana dApp",
    "description": "Create a simple dApp that interacts with Solana blockchain",
    "category": "Development",
    "requiredSkills": ["Solana", "React", "JavaScript"],
    "price": 2.5,
    "deadline": "2023-08-15T00:00:00.000Z",
    "status": "open",
    "creator": {
      "id": "60d21b4667d0d8992e610c86",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "reputation": 85
    },
    "assignedTo": null,
    "submissions": [],
    "aiContributions": [],
    "createdAt": "2023-06-17T15:24:18.957Z",
    "updatedAt": "2023-06-17T15:24:18.957Z"
  }
}
```

**Error Responses**:

- Status 401: Not authenticated
- Status 404: Task not found

## Create Task

Creates a new task.

**URL**: `/api/tasks`

**Method**: `POST`

**Authentication**: Required

**Request Body**:

```json
{
  "title": "Build a Solana dApp",
  "description": "Create a simple dApp that interacts with Solana blockchain",
  "category": "Development",
  "requiredSkills": ["Solana", "React", "JavaScript"],
  "price": 2.5,
  "deadline": "2023-08-15T00:00:00.000Z"
}
```

**Successful Response** (Status 201):

```json
{
  "task": {
    "id": "60d21b4667d0d8992e610c85",
    "title": "Build a Solana dApp",
    "description": "Create a simple dApp that interacts with Solana blockchain",
    "category": "Development",
    "requiredSkills": ["Solana", "React", "JavaScript"],
    "price": 2.5,
    "deadline": "2023-08-15T00:00:00.000Z",
    "status": "open",
    "creator": "60d21b4667d0d8992e610c86",
    "assignedTo": null,
    "createdAt": "2023-06-17T15:24:18.957Z",
    "updatedAt": "2023-06-17T15:24:18.957Z"
  }
}
```

**Error Responses**:

- Status 401: Not authenticated
- Status 400: Invalid input data

## Update Task

Updates an existing task.

**URL**: `/api/tasks/:id`

**Method**: `PATCH`

**Authentication**: Required (must be the task creator)

**URL Parameters**:

- `id`: Task ID

**Request Body** (all fields optional):

```json
{
  "title": "Updated Solana dApp Task",
  "description": "Updated description for the task",
  "category": "Blockchain",
  "requiredSkills": ["Solana", "React", "TypeScript"],
  "price": 3.0,
  "deadline": "2023-09-01T00:00:00.000Z"
}
```

**Successful Response** (Status 200):

```json
{
  "task": {
    "id": "60d21b4667d0d8992e610c85",
    "title": "Updated Solana dApp Task",
    "description": "Updated description for the task",
    "category": "Blockchain",
    "requiredSkills": ["Solana", "React", "TypeScript"],
    "price": 3.0,
    "deadline": "2023-09-01T00:00:00.000Z",
    "status": "open",
    "creator": "60d21b4667d0d8992e610c86",
    "assignedTo": null,
    "createdAt": "2023-06-17T15:24:18.957Z",
    "updatedAt": "2023-06-18T10:12:35.426Z"
  }
}
```

**Error Responses**:

- Status 401: Not authenticated
- Status 403: Not authorized (not the task creator)
- Status 404: Task not found
- Status 400: Invalid input data

## Apply for Task

Applies to work on a task.

**URL**: `/api/tasks/:id/apply`

**Method**: `POST`

**Authentication**: Required

**URL Parameters**:

- `id`: Task ID

**Request Body**:

```json
{
  "proposal": "I'm experienced with Solana development and can complete this task efficiently."
}
```

**Successful Response** (Status 200):

```json
{
  "message": "Successfully applied for task",
  "application": {
    "id": "60d21b4667d0d8992e610c87",
    "user": "60d21b4667d0d8992e610c88",
    "task": "60d21b4667d0d8992e610c85",
    "proposal": "I'm experienced with Solana development and can complete this task efficiently.",
    "status": "pending",
    "createdAt": "2023-06-18T10:15:35.426Z"
  }
}
```

**Error Responses**:

- Status 401: Not authenticated
- Status 404: Task not found
- Status 400: Already applied to this task
- Status 400: Cannot apply to your own task
- Status 400: Task is not open for applications

## Assign Task

Assigns a task to a specific user who applied.

**URL**: `/api/tasks/:id/assign/:userId`

**Method**: `POST`

**Authentication**: Required (must be the task creator)

**URL Parameters**:

- `id`: Task ID
- `userId`: User ID to assign

**Successful Response** (Status 200):

```json
{
  "message": "Task successfully assigned",
  "task": {
    "id": "60d21b4667d0d8992e610c85",
    "title": "Build a Solana dApp",
    "status": "in_progress",
    "assignedTo": "60d21b4667d0d8992e610c88",
    "updatedAt": "2023-06-18T11:20:15.426Z"
  }
}
```

**Error Responses**:

- Status 401: Not authenticated
- Status 403: Not authorized (not the task creator)
- Status 404: Task not found
- Status 404: User not found
- Status 400: User has not applied for this task
- Status 400: Task is not in 'open' status

## Submit Task

Submits work for a task.

**URL**: `/api/tasks/:id/submit`

**Method**: `POST`

**Authentication**: Required (must be the assigned user)

**URL Parameters**:

- `id`: Task ID

**Request Body**:

```json
{
  "submissionText": "I've completed the dApp. The code repository is available at: https://github.com/user/solana-dapp",
  "submissionLinks": ["https://github.com/user/solana-dapp", "https://solana-dapp.example.com"]
}
```

**Successful Response** (Status 200):

```json
{
  "message": "Task submission successful",
  "submission": {
    "id": "60d21b4667d0d8992e610c89",
    "task": "60d21b4667d0d8992e610c85",
    "user": "60d21b4667d0d8992e610c88",
    "submissionText": "I've completed the dApp. The code repository is available at: https://github.com/user/solana-dapp",
    "submissionLinks": ["https://github.com/user/solana-dapp", "https://solana-dapp.example.com"],
    "createdAt": "2023-06-20T14:30:25.426Z"
  }
}
```

**Error Responses**:

- Status 401: Not authenticated
- Status 403: Not authorized (not the assigned user)
- Status 404: Task not found
- Status 400: Task is not in 'in_progress' status

## Complete Task

Marks a task as completed and releases payment.

**URL**: `/api/tasks/:id/complete`

**Method**: `POST`

**Authentication**: Required (must be the task creator)

**URL Parameters**:

- `id`: Task ID

**Successful Response** (Status 200):

```json
{
  "message": "Task completed successfully",
  "task": {
    "id": "60d21b4667d0d8992e610c85",
    "title": "Build a Solana dApp",
    "status": "completed",
    "completedAt": "2023-06-21T09:15:35.426Z",
    "updatedAt": "2023-06-21T09:15:35.426Z"
  },
  "transaction": {
    "id": "60d21b4667d0d8992e610c90",
    "from": "60d21b4667d0d8992e610c86",
    "to": "60d21b4667d0d8992e610c88",
    "amount": 2.5,
    "task": "60d21b4667d0d8992e610c85",
    "type": "payment",
    "status": "completed",
    "createdAt": "2023-06-21T09:15:35.426Z"
  }
}
```

**Error Responses**:

- Status 401: Not authenticated
- Status 403: Not authorized (not the task creator)
- Status 404: Task not found
- Status 400: Task is not in 'in_progress' status
- Status 400: No submission found for this task 