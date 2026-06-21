# Social Media Platform

## Overview

The Social Media Platform is a full-stack web application that enables users to connect, communicate, and share content online. Users can create profiles, publish posts, interact through likes and comments, follow other users, and exchange messages in real time. The platform is designed to provide a secure, scalable, and engaging social networking experience.

---

## Features

### User Features

* User Registration and Login
* Profile Management
* Create, Edit, and Delete Posts
* Upload Images and Videos
* Like, Comment, and Share Posts
* Follow/Unfollow Users
* Real-Time Messaging
* Search Users and Posts
* Notifications and Activity Updates

### Admin Features

* User Management
* Content Moderation
* Report Management
* Platform Monitoring
* Analytics Dashboard

### Security Features

* JWT Authentication
* Password Encryption using Bcrypt
* Role-Based Access Control
* Secure API Endpoints

---

## Technologies Used

### Frontend

* React.js
* HTML5
* CSS3
* JavaScript
* Bootstrap / Tailwind CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### Real-Time Communication

* Socket.IO

### Authentication

* JWT
* Bcrypt

---

## Program Structure

```text
social-media-platform/
│
├── client/                        # Frontend Application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── PostCard.js
│   │   │   ├── CommentSection.js
│   │   │   └── MessageBox.js
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Profile.js
│   │   │   └── Messages.js
│   │   │
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── authService.js
│   │   │
│   │   ├── App.js
│   │   └── index.js
│   │
│   └── package.json
│
├── server/                        # Backend Application
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── postController.js
│   │   └── messageController.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Post.js
│   │   ├── Comment.js
│   │   └── Message.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── postRoutes.js
│   │   └── messageRoutes.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   │
│   ├── socket/
│   │   └── socketServer.js
│   │
│   ├── server.js
│   └── package.json
│
├── .env
├── README.md
└── package.json
```

---

## Installation

### Prerequisites

* Node.js (v16+)
* MongoDB
* Git

### Clone Repository

```bash
git clone https://github.com/yourusername/social-media-platform.git
cd social-media-platform
```

### Install Dependencies

```bash
npm install
cd client
npm install
```

### Environment Variables

Create a `.env` file in the server directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### Run Backend

```bash
npm run server
```

### Run Frontend

```bash
npm start
```

---

## Database Collections

### Users

```json
{
  "_id": "ObjectId",
  "username": "john_doe",
  "email": "john@example.com",
  "password": "hashed_password",
  "followers": [],
  "following": []
}
```

### Posts

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "content": "My first post",
  "image": "image_url",
  "likes": [],
  "comments": [],
  "createdAt": "Date"
}
```

### Messages

```json
{
  "_id": "ObjectId",
  "senderId": "ObjectId",
  "receiverId": "ObjectId",
  "message": "Hello",
  "timestamp": "Date"
}
```

---

## Future Enhancements

* Live Video Streaming
* Story/Status Feature
* Voice and Video Calls
* AI Content Recommendations
* Multi-Language Support
* Mobile Application
* Dark Mode
* Advanced Analytics Dashboard

The Social Media Platform is a scalable and feature-rich web application that combines social networking, content sharing, and real-time communication. Its modular architecture, secure authentication system, and organized program structure make it easy to develop, maintain, and extend with new features in the future.
