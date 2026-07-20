import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from 'expo-router';
import { fetchPostDetails, Post } from '../services/api';

export default function PostDetailsScreen() {
    const { postId } = useLocalSearchParams<{ postId: string }>();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!postId) {
            setError("No post ID provided.");
            setLoading(false);
            return;
        }

        const loadPostDetails = async () => {
            try {
                setLoading(true);
                const data = await fetchPostDetails(postId);
                setPost(data);
                setError(null);
            } catch (err) {
                console.error(err);
                setError("Failed to load post details. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        loadPostDetails();
    }, [postId]);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0066cc" />
            </View>
        );
    }

    if (error || !post) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>{error || "No post details available."}</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>{post.title}</Text>
                <Text style={styles.body}>{post.body}</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f7f9fc",
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f7f9fc",
    },
    errorText: {
        fontSize: 16,
        color: "#697386",
    },
    card: {
        backgroundColor: "#ffffff",
        margin: 16,
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#eef2f6",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1a1f36",
        marginBottom: 12,
        textTransform: "capitalize",
        lineHeight: 28,
    },
    body: {
        fontSize: 16,
        color: "#4f566b",
        lineHeight: 24,
    },
});
