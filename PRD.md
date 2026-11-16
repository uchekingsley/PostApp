# 📄 Product Requirements Document (PRD) — PostApp

**Product Name:** PostApp (PulsePost)  
**Document Version:** 1.0.0 (MVP → Full-Stack Social)  
**Status:** In Progress / Active Development  
**Author / Lead:** Kingsley Uche  
**Target Platform:** Mobile (iOS & Android via React Native / Expo SDK 57)  
**Backend Architecture:** REST API (Python Flask + SQLite/PostgreSQL + JWT)

---

## 1. Executive Summary & Vision

PostApp is a modern, developer-focused **Social Media & Technical Publishing Platform** built for software engineers, product designers, and tech creators. 

Unlike bloated general-purpose social networks, PostApp provides a lightweight, focused feed for reading, sharing, discussing, and bookmarking high-impact engineering notes, architectural insights, and project updates.

---

## 2. Target Audience & Personas

| Persona | Role | Key Goal / Pain Point |
|---|---|---|
| **Alex, Senior Engineer** | Reader & Contributor | Wants a distraction-free feed of deep technical posts without algorithmic noise or ads. |
| **Maya, Mobile Designer** | Creator | Wants to share UI case studies, design system patterns, and receive constructive feedback. |
| **Jordan, Hiring Manager** | Evaluator | Evaluates PostApp as a portfolio project to inspect code quality, architecture, offline resilience, and SQL schema design. |

---

## 3. Core Problems & Value Proposition

1. **Problem**: Most tutorial mobile apps are toy projects with raw `useEffect` calls, no validation, and no offline handling.  
   **Solution**: PostApp demonstrates production-grade architecture (TanStack Query caching, Zod runtime validation, and optimistic updates).
2. **Problem**: Mobile reading apps often lose context on flaky networks.  
   **Solution**: Resilient caching with pull-to-refresh and persistent local pinning.
3. **Problem**: Developers want full ownership of their data rather than relying strictly on opaque third-party BaaS.  
   **Solution**: A custom Flask + SQLAlchemy + JWT backend with full relational integrity.

---

## 4. Feature Specifications & Requirements

### 4.1 Current MVP (Phase 0 — Complete)
* **Feed Display**: Virtualized `FlatList` fetching articles with clean loading spinners and empty states.
* **Pin / Unpin System**: Tap the pin button or long-press any card to pin items to the top of the feed with client-side sort ordering.
* **Pull-to-Refresh**: Native `RefreshControl` reloading latest posts on swipe-down.
* **Dynamic Article View**: Deep-linkable routing powered by Expo Router (`/post-details/[postId]`) displaying full article contents.
* **Network Error Recovery**: Responsive error cards with interactive retry prompts on failure.

### 4.2 Phase 1: Authentication & User Identity (In Progress)
* **User Registration & Login**: Email/Password authentication using secure password hashing (`werkzeug.security`) and JWT tokens (`flask-jwt-extended`).
* **Secure Storage**: JWTs stored securely on device using `expo-secure-store` (Keychain on iOS, Keystore on Android).
* **Protected Routes**: Root layout authentication guards redirecting unauthenticated users to `/login`.
* **User Profiles**: Profile screen displaying user avatar, handle, bio, and total post count.

### 4.3 Phase 2: Post Creation & Feed Authorization
* **Create Post Modal / Screen**: Text composer with title (min 5, max 100 chars), body (min 15, max 2000 chars), and category pills (`Engineering`, `Design`, `Product`, `General`).
* **Server-Side Ownership & Moderation**: Authenticated users can only edit or delete posts they authored (`user_id == current_user_id`), returning `403 Forbidden` on unauthorized attempts.
* **Optimistic Feed Updates**: Newly created posts appear on top of the feed instantly with zero perceived latency.

### 4.4 Phase 3: Social Interactions & Discussion Threads
* **Idempotent Like Toggle**: Heart button toggles like status with atomic server increments and a database-level `UNIQUE(user_id, post_id)` constraint.
* **Comments & Nested Discussions**: Interactive discussion section per article with avatar initials, author names, and timestamps.
* **Tactile Haptic Feedback**: Native vibration pulses (`expo-haptics`) on like, pin, and comment submissions.

### 4.5 Phase 4: Media Uploads & Cloud Deployment
* **Media Pipeline**: Attach photos to posts or profile avatars using `expo-image-picker` with progressive blurhash caching via `expo-image`.
* **Production Deployment**: Hosted Python WSGI server (Gunicorn) on Render/Railway connected to a managed PostgreSQL database.

---

## 5. Non-Functional Requirements (NFRs)

* **Performance**: 60 FPS scrolling on mobile devices via virtualized lists (`FlatList`).
* **Bundle Size & Startup**: Cold launch under 1.5 seconds on mid-range Android devices.
* **Type Safety**: 100% strict TypeScript coverage with zero compilation errors (`tsc --noEmit`).
* **Security**:
  * Passwords hashed using PBKDF2/scrypt before database storage.
  * JWT tokens transmitted exclusively in `Authorization: Bearer <token>` headers.
  * Protection against SQL Injection via SQLAlchemy ORM parameterized queries.
* **Resilience**: Graceful fallbacks when offline with cached local data.

---

## 6. Technical Stack Summary

| Layer | Technology |
|---|---|
| **Mobile Client** | React Native, Expo (SDK 57), Expo Router, TypeScript |
| **Client State & Cache** | TanStack React Query, SecureStore, AsyncStorage |
| **Validation** | Zod (Client-side schema contracts) |
| **Backend API** | Python, Flask, Flask-CORS, Flask-JWT-Extended |
| **Database & ORM** | SQLite (Dev) / PostgreSQL (Prod), Flask-SQLAlchemy |
| **Media & Storage** | Expo Image, Expo Image Picker, Cloudinary / S3 |

---

## 7. Success Metrics & Portfolio Signals

1. **Architecture Signal**: Clear separation of concerns between presentation, domain hooks, and API services.
2. **Full-Stack Signal**: Ability to explain the complete request lifecycle from React Native component → JWT Bearer Token → Flask Route → SQLAlchemy ORM → PostgreSQL.
3. **UX Signal**: Zero-lag optimistic updates, smooth haptics, and instant cache rehydration.
