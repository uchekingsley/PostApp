import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Category, CreatePostInput, CreatePostInputSchema } from '../types';

interface CreatePostModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePostInput) => Promise<void>;
  isLoading: boolean;
}

const CATEGORIES: Category[] = ['Engineering', 'Design', 'Product', 'General'];

export default function CreatePostModal({
  visible,
  onClose,
  onSubmit,
  isLoading,
}: CreatePostModalProps) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<Category>('Engineering');
  const [errors, setErrors] = useState<{ title?: string; body?: string }>({});

  const handleClose = () => {
    setTitle('');
    setBody('');
    setErrors({});
    onClose();
  };

  const handlePublish = async () => {
    // Validate with Zod
    const validationResult = CreatePostInputSchema.safeParse({
      title,
      body,
      category,
    });

    if (!validationResult.success) {
      const fieldErrors: { title?: string; body?: string } = {};
      validationResult.error.issues.forEach((err) => {
        if (err.path[0] === 'title') fieldErrors.title = err.message;
        if (err.path[0] === 'body') fieldErrors.body = err.message;
      });
      setErrors(fieldErrors);
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } catch {
        // noop
      }
      return;
    }

    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      // noop
    }

    setErrors({});
    await onSubmit(validationResult.data);
    handleClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent presentationStyle="overFullScreen">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} disabled={isLoading} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create New Post</Text>
            <TouchableOpacity
              onPress={handlePublish}
              disabled={isLoading || !title.trim() || !body.trim()}
              style={[
                styles.publishBtn,
                (!title.trim() || !body.trim() || isLoading) && styles.publishBtnDisabled,
              ]}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={styles.publishBtnText}>Publish</Text>
              )}
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.bodyScroll}>
            {/* Category Selector */}
            <Text style={styles.label}>Select Category</Text>
            <View style={styles.categoryRow}>
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setCategory(cat)}
                    style={[styles.catPill, isSelected && styles.catPillActive]}
                  >
                    <Text style={[styles.catPillText, isSelected && styles.catPillTextActive]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Title Input */}
            <Text style={styles.label}>Post Title</Text>
            <TextInput
              style={[styles.input, errors.title && styles.inputError]}
              placeholder="e.g. Scaling React Native Architecture..."
              placeholderTextColor="#94a3b8"
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              maxLength={100}
            />
            {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

            {/* Body Input */}
            <Text style={[styles.label, { marginTop: 16 }]}>Content Body</Text>
            <TextInput
              style={[styles.input, styles.textArea, errors.body && styles.inputError]}
              placeholder="Share insights, architectural lessons, or project highlights..."
              placeholderTextColor="#94a3b8"
              value={body}
              onChangeText={(text) => {
                setBody(text);
                if (errors.body) setErrors((prev) => ({ ...prev, body: undefined }));
              }}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              maxLength={2000}
            />
            {errors.body && <Text style={styles.errorText}>{errors.body}</Text>}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 34,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  closeBtn: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
  },
  publishBtn: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 18,
  },
  publishBtnDisabled: {
    backgroundColor: '#94a3b8',
  },
  publishBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  bodyScroll: {
    padding: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  catPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
  },
  catPillActive: {
    backgroundColor: '#0284c7',
  },
  catPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  catPillTextActive: {
    color: '#ffffff',
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0f172a',
  },
  textArea: {
    height: 120,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});
