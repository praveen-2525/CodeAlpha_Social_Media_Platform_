# API Documentation - Socialize API

This document details the RESTful API endpoints available in the Socialize application. All requests and responses are in JSON format.

## Base URL
- **Local Development**: `http://localhost:5000/api`
- **Health Check Route**: `GET /api/health`

---

## Authentication Endpoints (`/api/auth`)

### 1. Register User
Creates a new user account.
- **URL**: `/auth/register`
- **Method**: `POST`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "_id": "603d65f57ff8a93a1010372f",
    "username": "johndoe",
    "email": "john@example.com",
    "bio": "",
    "profilePic": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
    "token": "eyJhbGciOiJIUzI1NiIsInR5..."
  }
  ```

### 2. Login User
Authenticates a user and issues a JWT token.
- **URL**: `/auth/login`
- **Method**: `POST`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "_id": "603d65f57ff8a93a1010372f",
    "username": "johndoe",
    "email": "john@example.com",
    "bio": "",
    "profilePic": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
    "token": "eyJhbGciOiJIUzI1NiIsInR5..."
  }
  ```

### 3. Logout User
Clears auth status message (token cleared on client side).
- **URL**: `/auth/logout`
- **Method**: `POST`
- **Access**: Public

---

## User Profile Endpoints (`/api/users`)

*Note: All endpoints below require a valid JWT token passed in the header as: `Authorization: Bearer <token>`.*

### 1. Get User Profile
Retrieves detailed profile statistics and followers list.
- **URL**: `/users/profile/:username`
- **Method**: `GET`
- **Access**: Protected
- **Success Response (200 OK)**:
  ```json
  {
    "_id": "603d65f57ff8a93a1010372f",
    "username": "johndoe",
    "email": "john@example.com",
    "bio": "MERN Stack Developer",
    "profilePic": "https://res.cloudinary.com/...",
    "followers": [
      {
        "_id": "603d66217ff8a93a10103734",
        "username": "janedoe",
        "profilePic": "https://...",
        "bio": "Photographer"
      }
    ],
    "following": [],
    "createdAt": "2026-06-12T13:00:00.000Z"
  }
  ```

### 2. Update User Profile
Updates user credentials, bio information, and profile image.
- **URL**: `/users/profile`
- **Method**: `PUT`
- **Access**: Protected
- **Content-Type**: `multipart/form-data`
- **Form Data Fields**:
  - `username` (optional)
  - `email` (optional)
  - `bio` (optional)
  - `password` (optional)
  - `profilePic` (File, optional)
- **Success Response (200 OK)**:
  ```json
  {
    "_id": "603d65f57ff8a93a1010372f",
    "username": "johndoe_updated",
    "email": "john@example.com",
    "bio": "Senior MERN Stack Dev",
    "profilePic": "https://res.cloudinary.com/..."
  }
  ```

### 3. Follow User
Follows another user by their ID.
- **URL**: `/users/follow/:id`
- **Method**: `POST`
- **Access**: Protected
- **Success Response (200 OK)**:
  ```json
  { "message": "User followed successfully" }
  ```

### 4. Unfollow User
Unfollows a user by their ID.
- **URL**: `/users/unfollow/:id`
- **Method**: `POST`
- **Access**: Protected

### 5. Search Users
Performs a case-insensitive partial match search for users.
- **URL**: `/users/search?query=jane`
- **Method**: `GET`
- **Access**: Protected
- **Success Response (200 OK)**:
  ```json
  [
    {
      "_id": "603d66217ff8a93a10103734",
      "username": "janedoe",
      "profilePic": "https://...",
      "bio": "Photographer"
    }
  ]
  ```

### 6. Get Suggested Users
Fetches list of profiles the current user doesn't follow.
- **URL**: `/users/suggestions`
- **Method**: `GET`
- **Access**: Protected

---

## Post Endpoints (`/api/posts`)

### 1. Create Post
- **URL**: `/posts`
- **Method**: `POST`
- **Access**: Protected
- **Content-Type**: `multipart/form-data`
- **Form Data Fields**:
  - `caption` (Required)
  - `image` (File, Optional)
- **Success Response (210 Created)**: Returns populated post object.

### 2. Get Feed
Fetches social posts from self and followed accounts with paginated skip metrics.
- **URL**: `/posts/feed?page=1&limit=5`
- **Method**: `GET`
- **Access**: Protected
- **Success Response (200 OK)**:
  ```json
  {
    "posts": [ ... ],
    "currentPage": 1,
    "totalPages": 3,
    "hasMore": true
  }
  ```

### 3. Get User Posts
Fetches posts authored by a specific user.
- **URL**: `/posts/user/:username`
- **Method**: `GET`
- **Access**: Protected

### 4. Update Post
Updates a post's text caption.
- **URL**: `/posts/:id`
- **Method**: `PUT`
- **Access**: Protected
- **Request Body**:
  ```json
  { "caption": "Updated caption description text" }
  ```

### 5. Delete Post
Deletes a post and its associated comments.
- **URL**: `/posts/:id`
- **Method**: `DELETE`
- **Access**: Protected

### 6. Like Post
Likes a post.
- **URL**: `/posts/:id/like`
- **Method**: `POST`
- **Access**: Protected
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Post liked successfully",
    "likes": ["603d65f57ff8a93a1010372f"]
  }
  ```

### 7. Unlike Post
Removes user like from post.
- **URL**: `/posts/:id/unlike`
- **Method**: `POST`
- **Access**: Protected

---

## Comment Endpoints (`/api/comments`)

### 1. Add Comment
Adds a comment to a post.
- **URL**: `/comments/:postId`
- **Method**: `POST`
- **Access**: Protected
- **Request Body**:
  ```json
  { "text": "This is a great post!" }
  ```

### 2. Get Post Comments
Retrieves all comments for a post, sorted chronologically.
- **URL**: `/comments/:postId`
- **Method**: `GET`
- **Access**: Protected

### 3. Delete Comment
Deletes a comment. (Author of comment or owner of post can delete).
- **URL**: `/comments/:id`
- **Method**: `DELETE`
- **Access**: Protected
