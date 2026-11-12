import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Post } from '../services/api';

interface PostItemProps {
  post: Post;
  onPress: () => void;
  isPinned: boolean;
  onPinPress: () => void;
  isBookmarked?: boolean;
  onBookmarkPress?: () => void;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Engineering: { bg: '#e0f2fe', text: '#0284c7' },
  Design: { bg: '#fce7f3', text: '#db2777' },
  Product: { bg: '#fef3c7', text: '#d97706' },
  General: { bg: '#f1f5f9', text: '#475569' },
};

export default function PostItem({
  post,
  onPress,
  isPinned,
  onPinPress,
  isBookmarked = false,
  onBookmarkPress,
}: PostItemProps) {
  const categoryTheme =
    CATEGORY_COLORS[post.category || 'General'] || CATEGORY_COLORS.General;

  const handlePin = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // Haptics fallback on web/unsupported platforms
    }
    onPinPress();
  };

  const handleBookmark = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Haptics fallback
    }
    if (onBookmarkPress) {
      onBookmarkPress();
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, isPinned && styles.pinnedCard]}
      onPress={onPress}
      onLongPress={handlePin}
      activeOpacity={0.8}
    >
      {/* Header: User avatar, category badge, and pin button */}
      <View style={styles.header}>
        <View style={styles.authorSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>U{post.userId}</Text>
          </View>
          <View>
            <Text style={styles.authorName}>Author #{post.userId}</Text>
            <Text style={styles.readTime}>{post.readTime || '3 min read'}</Text>
          </View>
        </View>

        <View style={styles.actionPills}>
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

          <TouchableOpacity
            onPress={handlePin}
            style={[styles.iconButton, isPinned && styles.pinnedButton]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={isPinned ? 'pin' : 'pin-outline'}
              size={17}
              color={isPinned ? '#0284c7' : '#94a3b8'}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title} numberOfLines={2}>
        {post.title}
      </Text>

      {/* Body preview */}
      <Text style={styles.bodyPreview} numberOfLines={2}>
        {post.body}
      </Text>

      {/* Footer / Meta stats */}
      <View style={styles.footer}>
        <View style={styles.statGroup}>
          <Ionicons name="heart-outline" size={15} color="#64748b" />
          <Text style={styles.statText}>{post.likesCount || 12}</Text>

          <Ionicons
            name="chatbubble-outline"
            size={14}
            color="#64748b"
            style={{ marginLeft: 12 }}
          />
          <Text style={styles.statText}>5</Text>
        </View>

        <TouchableOpacity
          onPress={handleBookmark}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={18}
            color={isBookmarked ? '#0284c7' : '#94a3b8'}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    padding: 16,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  pinnedCard: {
    borderColor: '#bae6fd',
    backgroundColor: '#fafcff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  authorSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#0284c7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  authorName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e293b',
  },
  readTime: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 1,
  },
  actionPills: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  iconButton: {
    padding: 6,
    borderRadius: 8,
  },
  pinnedButton: {
    backgroundColor: '#e0f2fe',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    textTransform: 'capitalize',
    lineHeight: 22,
    marginBottom: 6,
  },
  bodyPreview: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f8fafc',
  },
  statGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 4,
    fontWeight: '500',
  },
});
