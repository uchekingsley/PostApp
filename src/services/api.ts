export interface Post {
    userId: number;
    id: number;
    title: string;
    body: string;
}

const BASE_URL = "https://jsonplaceholder.typicode.com";

export async function fetchPosts(): Promise<Post[]> {
    try {
        const response = await fetch(`${BASE_URL}/posts`);

        if (!response.ok) {
            throw new Error("Failed to fetch posts");
        }

        const data: Post[] = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function fetchPostDetails(postId: number | string): Promise<Post> {
    try {
        const response = await fetch(`${BASE_URL}/posts/${postId}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch post details for ID: ${postId}`);
        }

        const data: Post = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
