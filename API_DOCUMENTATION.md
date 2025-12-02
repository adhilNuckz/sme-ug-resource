# Campus Resource Platform - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All authenticated requests require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_access_token>
```

## Response Format

All API responses follow this structure:

### Success Response
```json
{
  "success": true,
  "message": "Success message",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Error details"
}
```

---

## Authentication Endpoints

### POST /auth/register
Register a new user (student or admin).

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student",
  "yearOfStudy": 2,
  "department": "Computer Science",
  "preferredLanguage": "english"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { /* user object */ },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

### POST /auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { /* user object */ },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

### POST /auth/refresh
Refresh the access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "your_refresh_token"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Access token refreshed successfully",
  "data": {
    "accessToken": "new_access_token"
  }
}
```

### POST /auth/logout
Logout the current user. (Requires authentication)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### GET /auth/profile
Get current user profile. (Requires authentication)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "yearOfStudy": 2,
      "department": "Computer Science",
      "preferredLanguage": "english"
    }
  }
}
```

---

## Video Endpoints

### GET /videos
Get all videos with optional filtering.

**Query Parameters:**
- `category` (optional): Filter by category
- `language` (optional): Filter by language (tamil, sinhala, english)
- `difficulty` (optional): Filter by difficulty (beginner, intermediate, advanced)
- `search` (optional): Search in title, description, topics
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Example:**
```
GET /videos?category=DSA&language=english&page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": {
    "videos": [ /* array of video objects */ ],
    "totalPages": 5,
    "currentPage": 1,
    "totalVideos": 50
  }
}
```

### GET /videos/:id
Get a single video by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "video": {
      "_id": "...",
      "title": "Introduction to DSA",
      "description": "...",
      "category": "DSA",
      "language": "english",
      "videoUrl": "https://youtube.com/...",
      "difficulty": "beginner",
      "views": 150,
      "topics": ["Arrays", "Sorting"],
      "downloadableFiles": [],
      "externalLinks": []
    }
  }
}
```

### GET /videos/recommendations
Get personalized video recommendations. (Requires authentication)

**Query Parameters:**
- `limit` (optional): Number of recommendations (default: 6)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "recommendations": [ /* array of video objects */ ]
  }
}
```

### POST /videos
Create a new video. (Admin only)

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

**Request Body:**
```json
{
  "title": "Advanced Algorithms",
  "description": "Deep dive into advanced algorithms",
  "category": "DSA",
  "language": "english",
  "videoUrl": "https://youtube.com/watch?v=...",
  "thumbnailUrl": "https://...",
  "duration": 3600,
  "difficulty": "advanced",
  "topics": ["Dynamic Programming", "Graph Algorithms"],
  "downloadableFiles": [
    {
      "fileName": "notes.pdf",
      "fileUrl": "/downloads/notes.pdf",
      "fileType": "pdf"
    }
  ]
}
```

### PUT /videos/:id
Update an existing video. (Admin only)

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

### DELETE /videos/:id
Delete a video. (Admin only)

**Headers:**
```
Authorization: Bearer <admin_access_token>
```

---

## Coding Module Endpoints

### GET /coding-modules
Get all coding modules with optional filtering.

**Query Parameters:**
- `category` (optional)
- `type` (optional): coding, simulation, visualization
- `language` (optional)
- `difficulty` (optional)
- `search` (optional)
- `page` (optional)
- `limit` (optional)

### GET /coding-modules/:id
Get a single coding module by ID.

### POST /coding-modules
Create a new coding module. (Admin only)

**Request Body:**
```json
{
  "title": "Binary Search",
  "description": "Implement binary search algorithm",
  "category": "DSA",
  "type": "coding",
  "language": "english",
  "programmingLanguage": "javascript",
  "defaultCode": "function binarySearch() { ... }",
  "difficulty": "intermediate",
  "sampleInputs": [
    {
      "input": "[1,2,3,4,5]",
      "expectedOutput": "3",
      "description": "Find element at index 3"
    }
  ]
}
```

### PUT /coding-modules/:id
Update a coding module. (Admin only)

### DELETE /coding-modules/:id
Delete a coding module. (Admin only)

### POST /coding-modules/:id/complete
Increment completion count for a module. (Requires authentication)

---

## Resource Link Endpoints

### GET /resource-links
Get all resource links with optional filtering.

**Query Parameters:**
- `category` (optional)
- `type` (optional): youtube, pdf, website, documentation, tutorial, github, other
- `language` (optional)
- `search` (optional)
- `page` (optional)
- `limit` (optional)

### GET /resource-links/:id
Get a single resource link by ID.

### POST /resource-links
Create a new resource link. (Admin only)

**Request Body:**
```json
{
  "title": "GeeksforGeeks DSA",
  "description": "Comprehensive DSA resources",
  "url": "https://www.geeksforgeeks.org/data-structures/",
  "type": "website",
  "category": "DSA",
  "language": "english",
  "topics": ["Algorithms", "Data Structures"]
}
```

### PUT /resource-links/:id
Update a resource link. (Admin only)

### DELETE /resource-links/:id
Delete a resource link. (Admin only)

---

## Student Management Endpoints (Admin Only)

### GET /students/dashboard
Get dashboard statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalStudents": 100,
    "totalVideos": 50,
    "totalModules": 30,
    "totalLinks": 25,
    "recentStudents": [ /* array of recent students */ ]
  }
}
```

### GET /students
Get all students with optional filtering.

**Query Parameters:**
- `department` (optional)
- `yearOfStudy` (optional)
- `search` (optional)
- `page` (optional)
- `limit` (optional)

### GET /students/:id
Get a single student by ID.

### PUT /students/:id
Update student information.

### DELETE /students/:id
Delete a student.

---

## Error Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict (e.g., duplicate email)
- `500`: Internal Server Error

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting for production.

## CORS

CORS is enabled for the frontend origin specified in the environment variables.

---

**Note:** All timestamps are in ISO 8601 format.
