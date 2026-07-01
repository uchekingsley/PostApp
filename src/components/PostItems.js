import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PostItem({ post, onPress, isPinned, onPinPress }) {
  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.content} onPress={onPress} activeOpacity={0.7}>
        <Text style={styles.title} numberOfLines={2}>
          {post.title}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.pinButton} 
        onPress={onPinPress}
        activeOpacity={0.5}
      >
        <Ionicons 
          name={isPinned ? "pin" : "pin-outline"} 
          size={20} 
          color={isPinned ? "#ff9500" : "#a9abb0"} 
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginVertical: 6,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#eef2f6',
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1f36',
    textTransform: 'capitalize',
  },
  pinButton: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

