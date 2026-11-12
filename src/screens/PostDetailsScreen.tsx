import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePostDetails } from '../hooks/usePostDetails';
import CommentItem from '../components/CommentItem';
import { Skeleton } from '../components/Skeleton';

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Engineering: { bg: '#e0f2fe', text: '#0284c7' },
  Design: { bg: '#fce7f3', text: '#db2777' },
  Product: { bg: '#fef3c7', text: '#d97706' },
  General: { bg: '#f1f5f9', text: '#475569' },
};

export default function PostDetailsScreen() {
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const {
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
    refetch,
  } = usePostDetails(postId);

  const [commentText, setCommentText] = useState('');

  const handlePostComment = async () => {
    if (!commentText.trim()) return;
    const success = await addComment('Portfolio Reviewer', commentText);
    if (success) {
      setCommentText('');
    }
  };

  const categoryTheme =
    CATEGORY_COLORS[post?.category || 'General'] || CATEGORY_COLORS.General;

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      <Stack.Screen
        options={{
          title: 'Article',
          headerBackTitle: 'Feed',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#ffffff' },
          headerRight: () => (
            <View style={styles.headerActions}>
              <TouchableOpacity
                onPress={toggleBookmark}
                style={styles.headerButton}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                  size={20}
                  color={isBookmarked ? '#0284c7' : '#475569'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleShare}
                style={styles.headerButton}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="share-outline" size={20} color="#475569" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      {loading ? (
        <ScrollView style={styles.container} contentContainerStyle={styles.loadingPadding}>
          <Skeleton width="40%" height={24} borderRadius={12} style={{ marginBottom: 16 }} />
          <Skeleton width="90%" height={26} borderRadius={6} style={{ marginBottom: 8 }} />
          <Skeleton width="75%" height={26} borderRadius={6} style={{ marginBottom: 20 }} />
          <Skeleton width="100%" height={16} borderRadius={4} style={{ marginBottom: 8 }} />
          <Skeleton width="100%" height={16} borderRadius={4} style={{ marginBottom: 8 }} />
          <Skeleton width="65%" height={16} borderRadius={4} style={{ marginBottom: 24 }} />
        </ScrollView>
      ) : error || !post ? (
        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
          <Text style={styles.errorText}>{error || 'Post not found.'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refetch}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
          {/* Article Header & Badges */}
          <View style={styles.metaRow}>
            {post.category && (
              <View
                style={[
                  styles.categoryBadge,
                  { backgroundColor: categoryTheme.bg },
                ]}
              >
                <Text style={[styles.categoryText, { color: categoryTheme.text }]}>
                  {post.category}
                </Text>
              </View>
            )}
            <Text style={styles.readTimeText}>{post.readTime || '3 min read'}</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>{post.title}</Text>

          {/* Author info pill */}
          <View style={styles.authorCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>U{post.userId}</Text>
            </View>
            <View>
              <Text style={styles.authorName}>Author #{post.userId}</Text>
              <Text style={styles.authorSub}>Staff Contributor</Text>
            </View>
          </View>

          {/* Post Body */}
          <Text style={styles.body}>{post.body}</Text>

          {/* Social Interaction Bar */}
          <View style={styles.interactionBar}>
            <TouchableOpacity
              onPress={toggleLike}
              style={[styles.likeButton, isLiked && styles.likedButton]}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isLiked ? 'heart' : 'heart-outline'}
                size={18}
                color={isLiked ? '#ef4444' : '#475569'}
              />
              <Text
                style={[
                  styles.likeCount,
                  isLiked && { color: '#ef4444', fontWeight: '700' },
                ]}
              >
                {likesCount} {likesCount === 1 ? 'like' : 'likes'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleShare} style={styles.shareTextButton}>
              <Ionicons name="paper-plane-outline" size={16} color="#64748b" />
              <Text style={styles.shareText}>Share Article</Text>
            </TouchableOpacity>
          </View>

          {/* Comments Section */}
          <View style={styles.commentsSection}>
            <View style={styles.commentsHeader}>
              <Text style={styles.commentsTitle}>Discussion</Text>
              <View style={styles.commentCountBadge}>
                <Text style={styles.commentCountText}>{comments.length}</Text>
              </View>
            </View>

            {/* Comment Input */}
            <View style={styles.commentInputWrapper}>
              <TextInput
                style={styles.commentInput}
                placeholder="Share your thoughts or feedback..."
                placeholderTextColor="#94a3b8"
                value={commentText}
                onChangeText={setCommentText}
                multiline
              />
              <TouchableOpacity
                onPress={handlePostComment}
                style={[
                  styles.commentSubmitButton,
                  !commentText.trim() && styles.commentSubmitDisabled,
                ]}
                disabled={!commentText.trim()}
              >
                <Ionicons name="arrow-up" size={18} color="#ffffff" />
              </TouchableOpacity>
            </View>

            {/* Comments List */}
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </View>
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingPadding: {
    padding: 20,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerButton: {
    padding: 6,
    borderRadius: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
  },
  readTimeText: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 32,
    textTransform: 'capitalize',
    marginBottom: 16,
  },
  authorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#0284c7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  authorName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },
  authorSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 1,
  },
  body: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 26,
    letterSpacing: 0.2,
    marginBottom: 24,
  },
  interactionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 24,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  likedButton: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  likeCount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginLeft: 6,
  },
  shareTextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  shareText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  commentsSection: {
    marginTop: 8,
  },
  commentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  commentCountBadge: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  commentCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  commentInputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  commentInput: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
    maxHeight: 100,
    paddingRight: 8,
  },
  commentSubmitButton: {
    backgroundColor: '#0284c7',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentSubmitDisabled: {
    backgroundColor: '#cbd5e1',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
