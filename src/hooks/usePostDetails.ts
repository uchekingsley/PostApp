import { useState, useEffect, useCallback } from 'react';
import { Share, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import { fetchPostDetails, fetchComments } from '../services/api';
import { Post, Comment } from '../types';

export function usePostDetails(postId?: string) {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Social interactions
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const loadDetails = useCallback(async () => {
    if (!postId) {
      setError('No post ID provided.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const [postData, commentsData] = await Promise.all([
        fetchPostDetails(postId),
        fetchComments(postId),
      ]);
      setPost(postData);
      setComments(commentsData);
      setLikesCount(postData.likesCount || 12);
    } catch (err) {
      console.error(err);
      setError('Failed to load post details. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    loadDetails();
  }, [loadDetails]);

  const toggleLike = useCallback(async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // noop
    }
    setIsLiked((prev) => {
      const next = !prev;
      setLikesCount((count) => (next ? count + 1 : count - 1));
      return next;
    });
  }, []);

  const toggleBookmark = useCallback(async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // noop
    }
    setIsBookmarked((prev) => !prev);
  }, []);

  const handleShare = useCallback(async () => {
    if (!post) return;
    try {
      await Haptics.selectionAsync();
    } catch {
      // noop
    }

    try {
      await Share.share({
        title: post.title,
        message: `Check out this article: "${post.title}"\n\n${post.body.slice(0, 120)}...`,
      });
    } catch (err) {
      console.error('Error sharing post:', err);
    }
  }, [post]);

  const addComment = useCallback(
    async (authorName: string, commentBody: string) => {
      if (!commentBody.trim()) return false;
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {
        // noop
      }

      // Optimistic comment insert
      const newComment: Comment = {
        postId: Number(postId),
        id: Date.now(),
        name: authorName.trim() || 'You',
        email: 'you@example.com',
        body: commentBody.trim(),
      };

      setComments((prev) => [newComment, ...prev]);
      return true;
    },
    [postId]
  );

  return {
    post,
    comments,
    loading,
    error,
    isLiked,
    likesCount,
    isBookmarked,
    toggleLike,
    toggleBookmark,
    handleShare,
    addComment,
    refetch: loadDetails,
  };
}

