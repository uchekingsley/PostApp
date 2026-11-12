# 📱 PulsePost — Production-Grade React Native & Expo Showcase

A production-ready mobile application built with **React Native**, **Expo Router**, **TypeScript**, and **TanStack Query**. Designed to showcase senior-level mobile architecture, resilient offline state, optimistic updates, and fluid micro-interactions.

---

## 🌟 Key Highlights & Portfolio Capabilities

* **Modern Stack Architecture**: Strict separation of concerns with Custom Hooks (`usePosts`, `usePostDetails`, `useNetworkStatus`), pure API clients, typed storage services, and declarative components.
* **Declarative Server State with TanStack Query**: Intelligent query caching (5-minute stale-time windows), automatic refetching, and graceful error handling.
* **Optimistic UI Updates**: Instant publication of new posts and instant comments insertion with rollback recovery on network failure.
* **Offline-First & Network Awareness**: Built-in connectivity listener via `@react-native-community/netinfo` with a top-level offline status indicator banner.
* **Runtime Defense & Schema Validation**: **Zod** schema parsing on incoming network payloads and form submission inputs with granular field-level errors.
* **Persistent Local Preferences**: Saved bookmarks and pinned articles using `@react-native-async-storage/async-storage`.
* **Micro-interactions & Tactile Polish**: Haptic vibrations via `expo-haptics` and pulsing skeleton shimmer loaders powered by `react-native-reanimated`.
* **Crash Resilience**: Production React `ErrorBoundary` capturing unhandled tree exceptions with graceful recovery UI.

---

## 🏗️ Architecture Overview

```text
src/
├── app/                  # Expo Router file-system routing & global providers
│   ├── _layout.tsx       # Root layout: ErrorBoundary + QueryClientProvider + OfflineBanner
│   ├── index.tsx         # Feed screen entry
│   └── post-details/
│       └── [postId].tsx  # Dynamic article & discussion route
├── types/                # Zod schemas & TypeScript type inferences
│   └── index.ts          # Post, Comment, Category, CreatePostInput
├── services/             # Pure external integration layer
│   ├── api.ts            # Network client with Zod runtime validation
│   └── storage.ts        # Type-safe AsyncStorage adapter
├── hooks/                # Headless domain state & business logic
│   ├── usePosts.ts       # TanStack Query + optimistic mutations + filtering/search
│   ├── usePostDetails.ts # Concurrent post & comments fetch + likes/sharing
│   └── useNetworkStatus.ts # NetInfo subscription
├── components/           # Presentational design system
│   ├── CreatePostModal.tsx # BottomSheet form with Zod validation
│   ├── PostItems.tsx     # Card with avatars, tags, pins & bookmarks
│   ├── CommentItem.tsx   # Discussion comment bubble
│   ├── OfflineBanner.tsx # Dynamic connectivity strip
│   ├── ErrorBoundary.tsx # Catch-all crash recovery UI
│   └── Skeleton.tsx      # Reanimated shimmer pulse skeleton
└── screens/              # Screen containers
    ├── HomeScreen.tsx    # Feed, Search, Filter pills & FAB
    └── PostDetailsScreen.tsx # Full article view & comment stream
```

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18 or higher recommended)
* Expo CLI & Expo Go (or iOS Simulator / Android Emulator)

### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd PostApp

# Install dependencies
npm install

# Run TypeScript type check
npx tsc --noEmit

# Start the Expo development server
npm start
```

---

## 💡 Engineering Decisions & Trade-offs

1. **Why TanStack Query over Redux Toolkit?**  
   Server-state (caching, deduplication, retry, background refresh) is distinct from local client state. TanStack Query eliminates hundreds of lines of boilerplate reducers while offering native mutation lifecycle hooks (`onMutate`, `onError`, `onSettled`).

2. **Why Zod for Schema Validation?**  
   TypeScript types only exist at compile time. In production, third-party APIs can alter contracts without warning. Zod ensures runtime type safety and guarantees that unexpected responses are caught before they reach UI components.

3. **Why Headless Hooks?**  
   By delegating state logic to `usePosts` and `usePostDetails`, components remain clean, declarative, and easily testable without mocking deep UI structures.
