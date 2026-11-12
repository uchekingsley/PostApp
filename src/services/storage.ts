import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  PINNED_POSTS: '@post_app_pinned_post_ids',
  BOOKMARKED_POSTS: '@post_app_bookmarked_post_ids',
  LIKED_POSTS: '@post_app_liked_post_ids',
  OFFLINE_POSTS: '@post_app_offline_posts_cache',
} as const;

export const StorageService = {
  async getPinnedPostIds(): Promise<number[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PINNED_POSTS);
      return data ? JSON.parse(data) : [];
    } catch (err) {
      console.warn('StorageService: failed to read pinned posts', err);
      return [];
    }
  },

  async setPinnedPostIds(ids: number[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PINNED_POSTS, JSON.stringify(ids));
    } catch (err) {
      console.warn('StorageService: failed to save pinned posts', err);
    }
  },

  async getBookmarkedPostIds(): Promise<number[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.BOOKMARKED_POSTS);
      return data ? JSON.parse(data) : [];
    } catch (err) {
      console.warn('StorageService: failed to read bookmarks', err);
      return [];
    }
  },

  async setBookmarkedPostIds(ids: number[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.BOOKMARKED_POSTS, JSON.stringify(ids));
    } catch (err) {
      console.warn('StorageService: failed to save bookmarks', err);
    }
  },

  async getLikedPostIds(): Promise<number[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.LIKED_POSTS);
      return data ? JSON.parse(data) : [];
    } catch (err) {
      console.warn('StorageService: failed to read likes', err);
      return [];
    }
  },

  async setLikedPostIds(ids: number[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LIKED_POSTS, JSON.stringify(ids));
    } catch (err) {
      console.warn('StorageService: failed to save likes', err);
    }
  },
};

