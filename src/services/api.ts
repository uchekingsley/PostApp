export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export async function fetchPosts(): Promise<Post[]> {
  const response = await fetch(`${BASE_URL}/posts`);
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  return await response.json();
}

export async function fetchPostDetails(postId: number | string): Promise<Post> {
  const response = await fetch(`${BASE_URL}/posts/${postId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch post details for ID: ${postId}`);
  }
  return await response.json();
}
