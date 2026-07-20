import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Post } from '../services/api';

interface PostItemProps {
  post: Post;
  onPress: () => void;
  isPinned: boolean;
  onPinPress: () => void;
}

export default function PostItem({ post, onPress, isPinned, onPinPress }: PostItemProps) {
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress} 
      onLongPress={onPinPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {post.title}
        </Text>
        {isPinned && (
          <Ionicons 
            name="pin" 
            size={18} 
            color="#0066cc" 
            style={styles.pinIcon}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginVertical: 6,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#eef2f6',
  },
  content: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1f36',
    textTransform: 'capitalize',
    flex: 1,
    marginRight: 8,
  },
  pinIcon: {
    marginLeft: 8,
  },
});
