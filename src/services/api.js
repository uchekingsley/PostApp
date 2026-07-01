const BASE_URL = "https://jsonplaceholder.typicode.com";

export async function fetchPosts() {
    try {
        const response = await fetch(`${BASE_URL}/posts`);

        if (!response.ok) {
            throw new Error("Failed to fetch posts");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function fetchPostDetails(postId) {
    try {
        const response = await fetch(`${BASE_URL}/posts/${postId}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch post details for ID: ${postId}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}