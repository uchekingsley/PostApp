# 🗺️ PostApp — Full-Stack Social Media MVP Roadmap

> **Goal**: Build a production-grade **full-stack social media MVP** using **React Native (Expo)** on the frontend and **Python (Flask + SQLAlchemy + JWT)** on the backend. Designed to showcase true full-stack engineering (SQL modeling, REST API design, JWT auth, and mobile UX) to interviewers.

---

## 📐 Stack Selection & Why

### Backend Options Compared

| Stack | Pros | Cons | Verdict |
|---|---|---|---|
| **Flask + SQLAlchemy + PostgreSQL/SQLite** ⭐ | Full ownership of REST API, SQL schema design, JWT auth, and business logic; minimal boilerplate | You manage auth, hosting, and API contracts yourself | **Best for Full-Stack Roles** |
| **Django / DRF** | Built-in admin, ORM, auth out of the box | Heavy boilerplate, steep structure for a lean MVP | Better for large monoliths |
| **FastAPI** | Async, auto Swagger docs, Pydantic validation | Async SQLAlchemy adds setup complexity for learners | Great alternative once you know Flask |
| **Firebase / Supabase** | Very fast shipping, real-time built in | Abstracts away SQL, auth, and backend logic interviewers test | Better for frontend-only portfolios |

### ⭐ Recommended Full-Stack Architecture

```text
Mobile Frontend: React Native + Expo + Expo Router + TypeScript
Client State:    TanStack React Query (caching + optimistic UI) + SecureStore (JWT tokens)
Validation:      Zod (frontend) + Marshmallow/Pydantic or manual schema checks (backend)
Backend API:     Python + Flask + Flask-CORS + Flask-JWT-Extended
Database ORM:    Flask-SQLAlchemy (SQLite locally → PostgreSQL in production)
Media Uploads:   Expo Image Picker → Cloudinary (or Flask /uploads static endpoint)
Deployment:      Render / Railway (Gunicorn WSGI + managed PostgreSQL)
```

---

## 🗄️ Relational Database Schema (SQL)

Designing normalized SQL tables with foreign keys and constraints is one of the strongest signals in a full-stack interview.

```sql
-- 1. Users Table
CREATE TABLE users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    username      VARCHAR(50) UNIQUE NOT NULL,
    email         VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    bio           TEXT DEFAULT '',
    avatar_url    TEXT DEFAULT '',
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Posts Table (1-to-Many: User -> Posts)
CREATE TABLE posts (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title         VARCHAR(150) NOT NULL,
    body          TEXT NOT NULL,
    category      VARCHAR(30) DEFAULT 'General',
    image_url     TEXT DEFAULT '',
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Likes Table (Many-to-Many: Users <-> Posts)
CREATE TABLE likes (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id       INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, post_id) -- Prevents duplicate likes at the database level
);

-- 4. Comments Table (1-to-Many: Post -> Comments & User -> Comments)
CREATE TABLE comments (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id       INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    body          TEXT NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🏗️ Implementation Phases

### Phase 1: Authentication & User Profiles (JWT + SQLAlchemy)
> **Goal**: Users can register, log in securely with JWT tokens, and manage their profile.

**Backend (`backend/`):**
- [ ] Set up `Flask-SQLAlchemy` models (`User`) and database initialization
- [ ] Hash passwords using `werkzeug.security.generate_password_hash` / `check_password_hash`
- [ ] Configure `Flask-JWT-Extended` for access tokens
- [ ] Build auth endpoints:
  - `POST /api/auth/register` — Validate fields, check unique email/username, hash password, return JWT
  - `POST /api/auth/login` — Verify credentials, return JWT + user profile
  - `GET /api/auth/me` — `@jwt_required()` endpoint returning current user
  - `PATCH /api/users/me` — Update bio, username, or avatar URL

**Mobile (`PostApp/`):**
- [ ] Store JWT securely using `expo-secure-store` (never plain `AsyncStorage` for auth tokens)
- [ ] Build `(auth)/login.tsx` and `(auth)/register.tsx` screens
- [ ] Add `useAuth` hook + Auth Context to track logged-in user and protect routes
- [ ] Build `(tabs)/profile.tsx` showing user info, post count, and Logout button

**Interviewer Talking Points:**
- *"Passwords are never stored in plain text — we hash them with Werkzeug (PBKDF2/scrypt) before persisting to SQL."*
- *"JWTs are stored in `expo-secure-store` (encrypted Keychain on iOS / Keystore on Android) rather than unencrypted AsyncStorage, and sent in the `Authorization: Bearer <token>` header."*

---

### Phase 2: Post Creation, Feed & Authorization
> **Goal**: Authenticated users can create, view, and delete their own posts in a shared feed.

**Backend (`backend/`):**
- [ ] Add `Post` SQLAlchemy model linked to `User` via `user_id` foreign key
- [ ] Build post endpoints:
  - `GET /api/posts` — Return paginated feed (`?page=1&limit=20&category=...&search=...`) joined with author info, `likes_count`, `comments_count`, and `is_liked` for current user
  - `POST /api/posts` — `@jwt_required()` create post bound to `get_jwt_identity()`
  - `GET /api/posts/<id>` — Single post details
  - `DELETE /api/posts/<id>` — Ownership check (`if post.user_id != current_user_id: return 403`)

**Mobile (`PostApp/`):**
- [ ] Add Tab Navigation `(tabs)`: **Feed**, **Create**, **Profile**
- [ ] Integrate **TanStack React Query** for feed caching and pull-to-refresh
- [ ] Build **Create Post** screen with Zod validation and optimistic UI insertion
- [ ] Display author username, avatar, timestamp, and category badge on each `PostCard`
- [ ] Show Delete option only on posts owned by the logged-in user

**Interviewer Talking Points:**
- *"Every mutation checks ownership server-side (`post.user_id == current_user_id`), returning `403 Forbidden` if someone tampers with a request to delete another user's post."*
- *"We use SQLAlchemy eager loading (`joinedload`) and aggregate counts to avoid the N+1 query problem when rendering the feed."*

---

### Phase 3: Likes & Comments (Social Engagement)
> **Goal**: Users can like/unlike posts and participate in discussions.

**Backend (`backend/`):**
- [ ] Add `Like` and `Comment` SQLAlchemy models
- [ ] Build engagement endpoints:
  - `POST /api/posts/<id>/like` — `@jwt_required()` toggle: if row exists in `likes` delete it, else insert it; return updated `is_liked` and `likes_count`
  - `GET /api/posts/<id>/comments` — Return comments ordered chronologically with author details
  - `POST /api/posts/<id>/comments` — `@jwt_required()` create comment and return `201 Created`

**Mobile (`PostApp/`):**
- [ ] Add interactive Like button with optimistic toggle (heart turns red + count updates immediately, rolls back if API fails)
- [ ] Build Comments list and sticky composer input inside `PostDetailsScreen` with `KeyboardAvoidingView`
- [ ] Add haptic feedback (`expo-haptics`) on like and comment submit

**Interviewer Talking Points:**
- *"Duplicate likes are prevented both at the API layer and at the database layer via a `UNIQUE(user_id, post_id)` constraint."*
- *"On mobile, liking uses optimistic updates via TanStack Query so the interaction feels instant even on slow 3G connections."*

---

### Phase 4: Media Uploads, Production Polish & Deployment
> **Goal**: Users can attach photos to posts/avatars, and the full stack is deployed live.

**Backend (`backend/`):**
- [ ] Add `POST /api/upload` endpoint (or upload directly to Cloudinary/S3 and save the returned URL)
- [ ] Switch database URI config to read `DATABASE_URL` from environment variables (SQLite locally, PostgreSQL in production)
- [ ] Add `gunicorn` to `requirements.txt` and deploy to **Render** or **Railway**
- [ ] Add `GET /api/health` + structured JSON error handlers (`400`, `401`, `404`, `500`)

**Mobile (`PostApp/`):**
- [ ] Add `expo-image-picker` to pick photos from camera or gallery on Create Post & Edit Profile
- [ ] Render images cleanly using `expo-image` (built-in disk/memory caching)
- [ ] Add skeleton loading states and empty state views ("No posts yet")
- [ ] Centralize API base URL via `.env` (`EXPO_PUBLIC_API_URL`)

**Interviewer Talking Points:**
- *"The backend follows 12-Factor App principles: secrets (`JWT_SECRET_KEY`, `DATABASE_URL`) are injected via environment variables, allowing seamless promotion from local SQLite to production PostgreSQL."*

---

## 📁 Target Full-Stack Monorepo Structure

```text
Post App/
├── backend/                     # Python + Flask REST API
│   ├── app.py                   # Flask app factory & blueprints registration
│   ├── config.py                # Dev/Prod configuration (env vars)
│   ├── models.py                # SQLAlchemy models (User, Post, Like, Comment)
│   ├── routes/
│   │   ├── auth.py              # /api/auth/*
│   │   ├── posts.py             # /api/posts/* (CRUD + Like + Comments)
│   │   └── users.py             # /api/users/*
│   ├── requirements.txt         # Flask, Flask-SQLAlchemy, Flask-JWT-Extended, gunicorn
│   └── .env.example
│
└── PostApp/                     # React Native + Expo Mobile App
    ├── src/
    │   ├── app/
    │   │   ├── (auth)/          # login.tsx, register.tsx
    │   │   ├── (tabs)/          # index.tsx (Feed), create.tsx, profile.tsx
    │   │   ├── post-details/
    │   │   │   └── [postId].tsx # Post details + comment thread
    │   │   └── _layout.tsx      # Auth guard + QueryClientProvider
    │   ├── components/          # PostCard, CommentItem, Avatar, Skeleton
    │   ├── hooks/               # useAuth, usePosts, usePostDetails
    │   ├── services/            # api.ts (Axios/fetch with Bearer token interceptor)
    │   └── types/               # Zod schemas & TypeScript types
    ├── ROADMAP.md
    └── README.md
```

---

## ✅ Full-Stack Interview Readiness Checklist

- [ ] **Auth**: Explained password hashing + JWT lifecycle + `expo-secure-store`
- [ ] **SQL**: Explained 1-to-Many (`User -> Posts`), Many-to-Many (`Likes`), and `UNIQUE` constraints
- [ ] **Security**: Server-side ownership checks (`403 Forbidden`) + SQL injection prevention via ORM
- [ ] **Performance**: Avoiding N+1 queries on backend + TanStack Query caching & optimistic UI on frontend
- [ ] **Deployment**: Live hosted Flask + PostgreSQL API URL connected to Expo app
