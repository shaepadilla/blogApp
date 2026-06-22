# MEVN Full Stack Blog App

A full-stack blog application built with the MEVN stack (MongoDB, Express, Vue.js, Node.js) featuring user authentication, blog post CRUD, comments, and admin controls.

## App Description

Users can register and log in to create, read, update, and delete their own blog posts. Any logged-in user can add comments to any post. Only the author of a post can update or delete their post — except admin users, who can delete any post.

## Tech Stack

- **Backend (server)**: Node.js, Express.js, MongoDB (Mongoose), JWT, bcryptjs
- **Frontend (client)**: Vue.js 3, Vue Router, Axios

## Test Credentials

| Role  | Email             | Username  | Password  |
|-------|-------------------|-----------|-----------|
| User  | test@blog.com     | testuser  | test1234  |
| Admin | admin@blog.com    | admin     | admin1234 |

> To make a user admin, set `isAdmin: true` directly in the MongoDB document.

## API Endpoints

### User Routes — `/api/users`
| Method | Endpoint    | Description                        | Auth Required |
|--------|-------------|------------------------------------|---------------|
| POST   | `/register` | Register with username, email, password | No       |
| POST   | `/login`    | Log in, returns JWT token          | No            |

### Post Routes — `/api/posts`
| Method | Endpoint          | Description                          | Auth Required |
|--------|-------------------|--------------------------------------|---------------|
| GET    | `/`               | Get all posts (public)               | No            |
| GET    | `/:id`            | Get a single post with comments      | No            |
| POST   | `/`               | Create a new post                    | Yes           |
| PUT    | `/:id`            | Update own post only                 | Yes (owner)   |
| DELETE | `/:id`            | Delete own post or any post (admin)  | Yes           |
| POST   | `/:id/comments`   | Add a comment to any post            | Yes           |

## Setup Instructions

### Backend (server)
```bash
cd server
npm install
# Create a .env file (see .env.example)
npm run dev
```

Server runs on `http://localhost:4000`
