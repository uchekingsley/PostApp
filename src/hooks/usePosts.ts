import { useState, useCallback, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { fetchPosts, createPostApi } from '../services/api';
import { StorageService } from '../services/storage';
import { Post, CategoryFilter, CreatePostInput } from '../types';

export const POSTS_QUERY_KEY = ['posts'] as const;

export function usePosts() {
  const queryClient = useQueryClient();

  // Local persistent state
  const [pinnedPostIds, setPinnedPostIds] = useState<number[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');

  // Load persisted user preferences on mount
  useEffect(() => {
    async function loadPersistedState() {
      const [pinned, bookmarked] = await Promise.all([
        StorageService.getPinnedPostIds(),
        StorageService.getBookmarkedPostIds(),
      ]);
      setPinnedPostIds(pinned);
      setBookmarkedIds(bookmarked);
    }
    loadPersistedState();
  }, []);

  // TanStack Query for server state
  const {
    data: rawPosts = [],
    isLoading,
    isRefetching,
    error,
    refetch,
  } = useQuery({
    queryKey: POSTS_QUERY_KEY,
    queryFn: fetchPosts,
  });

  // TanStack Mutation for creating posts with optimistic updates
  const createPostMutation = useMutation({
    mutationFn: (input: CreatePostInput) => createPostApi(input),
    onMutate: async (newPostInput) => {
      await queryClient.cancelQueries({ queryKey: POSTS_QUERY_KEY });
      const previousPosts = queryClient.getQueryData<Post[]>(POSTS_QUERY_KEY) || [];

      const optimisticPost: Post = {
        userId: 1,
        id: Date.now(),
        title: newPostInput.title,
        body: newPostInput.body,
        category: newPostInput.category,
        readTime: '2 min read',
        likesCount: 0,
      };

      queryClient.setQueryData<Post[]>(POSTS_QUERY_KEY, [optimisticPost, ...previousPosts]);
      return { previousPosts };
    },
    onError: (_err, _newPost, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(POSTS_QUERY_KEY, context.previousPosts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
    },
  });

  const handleRefresh = useCallback(async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // noop
    }
    await refetch();
  }, [refetch]);

  const togglePinPost = useCallback((id: number) => {
    setPinnedPostIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      StorageService.setPinnedPostIds(next);
      return next;
    });
  }, []);

  const toggleBookmark = useCallback((id: number) => {
    setBookmarkedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      StorageService.setBookmarkedPostIds(next);
      return next;
    });
  }, []);

  const selectCategory = useCallback((cat: CategoryFilter) => {
    try {
      Haptics.selectionAsync();
    } catch {
      // noop
    }
    setSelectedCategory(cat);
  }, []);

  // Filtered and sorted memoized posts list
  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return rawPosts
      .filter((post) => {
        const matchesSearch =
          !query ||
          post.title.toLowerCase().includes(query) ||
          post.body.toLowerCase().includes(query);

        if (!matchesSearch) return false;

        if (selectedCategory === 'All') return true;
        if (selectedCategory === 'Pinned') return pinnedPostIds.includes(post.id);
        return post.category === selectedCategory;
      })
      .sort((a, b) => {
        const aPinned = pinnedPostIds.includes(a.id);
        const bPinned = pinnedPostIds.includes(b.id);
        if (aPinned && !bPinned) return -1;
        if (!aPinned && bPinned) return 1;
        return 0;
      });
  }, [rawPosts, searchQuery, selectedCategory, pinnedPostIds]);

  return {
    posts: filteredPosts,
    pinnedPostIds,
    bookmarkedIds,
    loading: isLoading,
    refreshing: isRefetching,
    error: error instanceof Error ? error.message : null,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    selectCategory,
    handleRefresh,
    refetch,
    togglePinPost,
    toggleBookmark,
    createPost: createPostMutation.mutateAsync,
    isCreatingPost: createPostMutation.isPending,
  };
}
