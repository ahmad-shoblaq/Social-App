# Social App

A backend API for a social networking app, built with Express, TypeScript, MongoDB, GraphQL, and Socket.io. Users can register, verify their account, create posts, comment and reply, react to posts/comments, and chat with friends in real time.

## Features

- Register with email verification via OTP, plus resend-OTP support
- Login with JWT access tokens
- Posts: create, read, update, delete, and react (like, love, care, sad, angry)
- Comments: top-level comments and threaded replies, with the same update/delete/react support as posts
- Real-time one-to-one chat over Socket.io, with messages persisted to the database
- A GraphQL endpoint for read queries (users, posts, comments) alongside the REST API
- Role-based structure ready for admin/user separation

## Tech Stack

- **Runtime:** Node.js (TypeScript, compiled with `tsc`)
- **Framework:** Express 5
- **Database:** MongoDB with Mongoose
- **Real-time:** Socket.io
- **API:** REST + GraphQL (`graphql-http`)
- **Auth:** JSON Web Tokens, bcrypt password hashing
- **Validation:** Zod
- **Email:** Nodemailer

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- A running MongoDB instance (local or Atlas)
- A Gmail account with an [App Password](https://myaccount.google.com/apppasswords) for sending OTP emails

### Installation

```bash
git clone <this-repo-url>
cd social-app
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
DB_URL=mongodb://127.0.0.1:27017/social-App

JWT_SECRET=your-long-random-secret-string

EMAIL=your-gmail@gmail.com
PASSWORD=your-gmail-app-password

CLOUDINARY_API_KEY=your-cloudinary-api-key
API_SECRET=your-cloudinary-api-secret
CLOUD_NAME=your-cloudinary-cloud-name
```

> `.env` and `node_modules/` are git-ignored — never commit real credentials.

### Running the app

```bash
npm run start:dev
```

This compiles TypeScript in watch mode and runs the server with `node --watch`, auto-restarting on every change.

The server runs on `http://localhost:3000` by default (or whatever `PORT` you set). The GraphQL endpoint is available at `http://localhost:3000/graphql`, and Socket.io connects over the same port.

### Building for production

```bash
npm run build
node dist/index.js
```

## API Endpoints

All responses follow the shape:
```json
{ "message": "...", "success": true, "data": { ... } }
```
Protected routes require an `Authorization` header with a raw JWT access token (no `Bearer` prefix).

### Auth — `/auth`

| Method | Endpoint | Description |
|--------|----------|--------------|
| POST | `/auth/register` | Register a new account |
| POST | `/auth/verifyEmail` | Confirm an account using the emailed OTP |
| POST | `/auth/resendOtp` | Resend a new OTP |
| POST | `/auth/login` | Log in with email + password |

### User — `/user`

| Method | Endpoint | Description |
|--------|----------|--------------|
| GET | `/user/profile` | Get the logged-in user's profile (friends populated) |

### Post — `/post`

| Method | Endpoint | Description |
|--------|----------|--------------|
| GET | `/post` | Get all posts (feed) |
| POST | `/post` | Create a post |
| GET | `/post/:id` | Get a single post (with top-level comments) |
| PUT | `/post/:id` | Update a post's content (author only) |
| PATCH | `/post/:id` | Add/remove a reaction on a post (toggle) |
| DELETE | `/post/:id` | Delete a post (author only; cascades to its comments) |

### Comment — `/post/:postId/comment`

| Method | Endpoint | Description |
|--------|----------|--------------|
| POST | `/post/:postId/comment` | Create a top-level comment |
| POST | `/post/:postId/comment/:id` | Reply to the comment `:id` |
| GET | `/post/:postId/comment/:id` | Get a single comment (with its replies) |
| PUT | `/post/:postId/comment/:id` | Update a comment's content (author only) |
| PATCH | `/post/:postId/comment/:id` | Add/remove a reaction on a comment (toggle) |
| DELETE | `/post/:postId/comment/:id` | Delete a comment (comment or post author) |

### Chat — `/chat`

| Method | Endpoint | Description |
|--------|----------|--------------|
| GET | `/chat/:userId` | Get the conversation between you and `:userId` |

### GraphQL — `/graphql`

Single POST endpoint. Available queries:

| Query | Description |
|-------|--------------|
| `getUser(id)` | Get a single user |
| `getAllUser` | Get all users |
| `getPost(id)` | Get a single post |
| `getUserPosts(userId)` | Get all posts by a user |
| `getComment(id)` | Get a single comment |
| `getPostComments(postId)` | Get all top-level comments on a post |

### Socket.io

Connect to the same host/port as the REST API, authenticating via the handshake:
```json
{ "auth": { "authorization": "<access-token>" } }
```

| Event (client → server) | Payload | Description |
|---------------------------|---------|--------------|
| `sendMessage` | `{ message: string, destid: string }` | Send a message to another user |

| Event (server → client) | Description |
|----------------------------|--------------|
| `successMessage` | Confirms your own message was processed |
| `receiveMessage` | Delivered to the recipient, if currently connected |

## Project Structure

```
src/
├── DB/
│   ├── abstract.repository.ts
│   ├── connection.ts
│   └── model/              # Mongoose schemas + repositories (user, post, comment, chat, message)
├── env/
│   └── dev.config.ts
├── middleware/              # REST + GraphQL auth and validation middleware
├── module/
│   ├── auth/
│   ├── user/
│   ├── post/                # Each module: controller, service, dto, entity, factory, graphql
│   ├── comment/
│   └── chat/
├── socket-io/                # Socket.io server setup and chat event handlers
├── utils/                    # Shared helpers (hash, token, OTP, email, enums)
├── app.controller.ts         # Express app bootstrap (middleware, routes, error handler)
├── app.schema.ts              # GraphQL root schema
└── index.ts                   # Entry point
```

## Notes

- Reactions are a toggle: sending the same reaction twice removes it; sending a different reaction updates it.
- A user must be verified (`isVerified: true`) before they can log in.
- A chat conversation is created automatically on the first message sent between two users — `GET /chat/:userId` returns 404 until that happens.
