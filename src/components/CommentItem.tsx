import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Comment } from '../types';

interface CommentItemProps {
  comment: Comment;
}

export default function CommentItem({ comment }: CommentItemProps) {
  const initials = comment.name ? comment.name.slice(0, 2).toUpperCase() : 'U';

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.author} numberOfLines={1}>
            {comment.name}
          </Text>
        </View>
        <Text style={styles.email} numberOfLines={1}>
          {comment.email}
        </Text>
        <Text style={styles.body}>{comment.body}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  author: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    textTransform: 'capitalize',
  },
  email: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 6,
    marginTop: 1,
  },
  body: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
  },
});

