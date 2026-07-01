import { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { fetchPosts } from "../services/api";
import PostItem from "../components/PostItems";

export default function HomeScreen({ navigation }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadPosts = async () => {
        try {
            setLoading(true);
            const data = await fetchPosts();
            setPosts(data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError("Failed to load posts. Please try again later.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadPosts();
    }, []);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0066cc" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <PostItem
                        post={item}
                        onPress={() => navigation.navigate("PostDetails", { postId: item.id })}
                    />
                )}
                contentContainerStyle={styles.listContainer}
            />
        </View>
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
        color: "#d93f21",
        textAlign: "center",
        paddingHorizontal: 20,
    },
    listContainer: {
        paddingVertical: 8,
    },
});
