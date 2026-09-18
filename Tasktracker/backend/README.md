# Task Tracker API

A RESTful Task Tracker backend built with Node.js, Express.js, and MongoDB.

This project provides secure user authentication and task management APIs with JWT authentication, task ownership protection, filtering, searching, sorting, pagination, Swagger documentation, and automated API testing.

---

## Features

### Authentication

- User registration
- User login
- JWT authentication
- Protected user profile
- Change password
- Forgot password
- Reset password
- Password hashing using bcryptjs

### Task Management

- Create tasks
- Get all tasks
- Get task by ID
- Update tasks
- Delete tasks
- Task status management
- Task priority management
- Due dates
- Overdue task detection
- Search tasks by title
- Filter tasks by status
- Filter tasks by priority
- Sort tasks
- Pagination
- Pagination metadata
- User task ownership protection

### Security

- JWT authentication
- Protected routes
- Helmet security headers
- CORS
- Password hashing
- User-based task authorization

### API Development

- RESTful API
- Swagger API documentation
- Postman API testing
- Automated API testing with Jest and Supertest

---

## Tech Stack

- **Node.js** – Runtime environment
- **Express.js** – Backend framework
- **MongoDB** – Database
- **Mongoose** – MongoDB ODM
- **JWT** – Authentication
- **bcryptjs** – Password hashing
- **Helmet** – HTTP security
- **CORS** – Cross-Origin Resource Sharing
- **Swagger** – API documentation
- **Jest** – Testing framework
- **Supertest** – API testing

---

## Project Structure

```text
backend/
│
├── src/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── db/
│   └── app.js
│
├── tests/
│   ├── auth.test.js
│   └── task.test.js
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── server.js
├── swagger.js
└── README.md
```

---

## Installation

Clone the repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Go into the project directory:

```bash
cd Tasktracker
```

Install dependencies:

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the project root.

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Example:

```env
MONGO_URI=mongodb://127.0.0.1:27017/tasktracker
JWT_SECRET=your_secret_key
```

> Never commit your real `.env` file or secret values to GitHub.

An `.env.example` file is included as a template:

```env
MONGO_URI=
JWT_SECRET=
```

---

## Run the Server

Start the backend server:

```bash
npm start
```

The server will run on:

```text
http://localhost:3000
```

---

## API Documentation

Swagger UI is available at:

```text
http://localhost:3000/api-docs
```

Swagger provides an interactive interface for viewing and testing the API endpoints.

---

# API Endpoints

## Authentication APIs

### Register User

```http
POST /api/auth/register
```

Request body:

```json
{
  "username": "John",
  "email": "john@example.com",
  "password": "password123"
}
```

---

### Login User

```http
POST /api/auth/login
```

Request body:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

The login response returns a JWT token.

---

### Get Profile

```http
GET /api/auth/profile
```

Authentication required.

Header:

```text
Authorization: Bearer YOUR_TOKEN
```

---

### Change Password

```http
PUT /api/auth/change-password
```

Authentication required.

---

### Forgot Password

```http
POST /api/auth/forgot-password
```

---

### Reset Password

```http
POST /api/auth/reset-password
```

---

# Task APIs

All task APIs require JWT authentication.

Use the following header:

```text
Authorization: Bearer YOUR_TOKEN
```

---

### Create Task

```http
POST /api/task/create
```

Example request:

```json
{
  "title": "Learn Backend",
  "description": "Complete Node.js and Express practice",
  "status": "pending",
  "priority": "high",
  "dueDate": "2026-10-01"
}
```

---

### Get All Tasks

```http
GET /api/task/getTask
```

#### Filter by status

```http
GET /api/task/getTask?status=pending
```

#### Filter by priority

```http
GET /api/task/getTask?priority=high
```

#### Search by title

```http
GET /api/task/getTask?search=backend
```

#### Pagination

```http
GET /api/task/getTask?page=1&limit=10
```

#### Sorting

```http
GET /api/task/getTask?sort=dueDate
```

Supported sorting options:

```text
dueDate
createdAt
priority
```

---

### Get Task by ID

```http
GET /api/task/getTask/:id
```

Example:

```text
GET /api/task/getTask/64abc123...
```

---

### Update Task

```http
PUT /api/task/getTask/:id
```

Example request:

```json
{
  "title": "Updated Task",
  "status": "completed",
  "priority": "high"
}
```

---

### Delete Task

```http
DELETE /api/task/getTask/:id
```

---

### Get Overdue Tasks

```http
GET /api/task/overdue
```

Returns tasks whose due date has passed and which are not completed.

---

# Authentication

The application uses **JWT (JSON Web Token)** for authentication.

After successful login, the API returns a token:

```json
{
  "message": "User login successfully",
  "token": "YOUR_JWT_TOKEN"
}
```

For protected APIs, send the token using:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

The authentication middleware verifies the token and identifies the logged-in user.

---

# Task Ownership

Each task belongs to a specific user.

Users can:

- Create their own tasks
- View their own tasks
- Update their own tasks
- Delete their own tasks

A user cannot access another user's task.

This provides user-level authorization for task operations.

---

# Task Status

Supported task statuses:

```text
pending
in-progress
completed
```

Default status:

```text
pending
```

---

# Task Priority

Supported priorities:

```text
low
medium
high
```

Default priority:

```text
medium
```

---

# Pagination

The task listing API supports pagination.

Example:

```http
GET /api/task/getTask?page=2&limit=10
```

The response includes pagination information such as:

```json
{
  "pagination": {
    "currentPage": 2,
    "limit": 10,
    "totalTasks": 25,
    "totalPages": 3
  }
}
```

---

# Security

The project includes several security measures:

### Helmet

Helmet adds security-related HTTP headers.

### CORS

CORS is configured to allow requests from frontend applications.

### Password Hashing

Passwords are hashed using `bcryptjs` before being stored in MongoDB.

### JWT Authentication

Protected APIs require a valid JWT token.

### Task Authorization

Users can access only their own tasks.

---

# Database Indexes

MongoDB indexes are used to improve frequently used task queries.

Indexes include:

```js
taskSchema.index({ user: 1 });
taskSchema.index({ user: 1, dueDate: 1 });
```

These indexes help optimize user-based task queries and overdue-task queries.

---

# Testing

The project uses:

- Jest
- Supertest

Run automated tests using:

```bash
npm test
```

The automated tests cover:

- User registration
- Successful login
- Failed login
- Profile authentication
- Protected profile access
- Task creation
- Getting all tasks
- Getting task by ID
- Updating tasks
- Deleting tasks
- Task ownership protection
- Overdue tasks

Current test suite:

```text
12 tests passed
```

---

# API Testing

The APIs can also be tested manually using:

- Swagger UI
- Postman

Swagger:

```text
http://localhost:3000/api-docs
```

---

# Future Improvements

Possible future improvements include:

- Rate limiting
- Centralized error handling
- Advanced request validation
- Refresh tokens
- Email service for password reset
- Role-based authorization
- More automated tests
- API performance optimization
- Docker deployment
- Cloud deployment
- CI/CD pipeline

---

# Author

**Soni Yadav**

B.Tech Information Technology

---

# License

This project is created for learning, portfolio, and educational purposes.
