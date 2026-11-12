# 📱 PostApp — MVP Mobile App

A clean, responsive mobile application built with **React Native**, **Expo Router**, and **TypeScript**. 

It demonstrates core mobile fundamentals: consuming a REST API, list rendering and virtualization, client-side sorting/pinning, pull-to-refresh, dynamic routing, and detailed view navigation.

---

## ✨ Features

- **Posts Feed**: Fetches and renders articles seamlessly in a virtualized `FlatList`.
- **Pin / Unpin Posts**: Pin important posts to the top of the feed with client-side sort ordering (tap the pin icon or long-press any card).
- **Pull-to-Refresh**: Easily reload the feed using native `RefreshControl`.
- **Detailed Article View**: Deep-linkable routing powered by Expo Router (`/post-details/[postId]`) displaying full article contents.
- **Loading & Error Handling**: Native loading indicators and responsive retry prompts on network failure.

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
└── tsconfig.json         # TypeScript configuration
```

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
