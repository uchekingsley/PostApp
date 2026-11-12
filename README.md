# 📱 PostApp — MVP Mobile App

A clean, responsive mobile application built with **React Native**, **Expo Router**, and **TypeScript**. 

It demonstrates core mobile fundamentals: consuming a REST API, list rendering and virtualization, client-side sorting/pinning, pull-to-refresh, dynamic routing, and detailed view navigation.

---

## ✨ Features

- **Posts Feed**: Fetches and renders articles seamlessly in a virtualized `FlatList`.
- **Pin / Unpin Posts**: Pin important posts to the top of the feed with client-side sort ordering (tap the pin icon or long-press any card), highlighted with a pinned card state.
- **Pull-to-Refresh**: Reload the feed anytime using native `RefreshControl`.
- **Detailed Article View**: Deep-linkable routing powered by Expo Router (`/post-details/[postId]`) displaying full article contents.
- **Loading & Error Retry States**: Native loading indicators and interactive retry buttons on both feed and details screens when network requests fail.

---

## 🏗️ Project Architecture

```text
PostApp/
├── assets/               # App icons, splash screens, and images
├── src/
│   ├── app/              # Expo Router filesystem navigation
│   │   ├── _layout.tsx   # Stack navigator configuration & header styling
│   │   ├── index.tsx     # Home entry route
│   │   └── post-details/
│   │       └── [postId].tsx # Dynamic post details route
│   ├── components/       # Reusable UI components
│   │   └── PostItems.tsx # Individual post card with pin action
│   ├── screens/          # Main screen views
│   │   ├── HomeScreen.tsx        # Feed list, pull-to-refresh & pin logic
│   │   └── PostDetailsScreen.tsx # Full post details view
│   └── services/         # API integration layer
│       └── api.ts        # Pure fetch functions (fetchPosts, fetchPostDetails)
├── app.json              # Expo application configuration
├── package.json          # Dependencies & scripts
├── ROADMAP.md            # Full-stack social media roadmap (Flask + SQL + JWT)
└── tsconfig.json         # TypeScript configuration
```

---

## 🗺️ Roadmap (Full-Stack Social Media Evolution)

This project is actively evolving from an MVP reader into a full-stack social media platform powered by a **Python Flask + SQLAlchemy + JWT** backend.

See the full architecture, SQL schemas, and 4 implementation phases in [`ROADMAP.md`](./ROADMAP.md):
1. **Phase 1**: JWT Authentication & User Profiles (`POST /api/auth/register`, `POST /api/auth/login`, `expo-secure-store`)
2. **Phase 2**: Post Creation, Shared Feed & Server-Side Ownership Checks
3. **Phase 3**: Social Engagement (Idempotent Likes & Comment Threads)
4. **Phase 4**: Media Uploads (`expo-image-picker`), PostgreSQL & Production Deployment

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Expo Go](https://expo.dev/go) app on your mobile device (iOS / Android)

### Installation & Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/uchekingsley/PostApp.git
   cd PostApp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the Expo development server:**
   ```bash
   npm start
   ```

4. **Run on your device:**
   - Scan the QR code in the terminal using the **Expo Go** app (Android) or native **Camera** app (iOS).
   - Or press `a` for Android Emulator / `i` for iOS Simulator / `w` for Web.

---

## 🛠️ Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/) (SDK 54)
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Icons**: [@expo/vector-icons](https://icons.expo.fyi/)
