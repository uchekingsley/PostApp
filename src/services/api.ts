import { Post, Comment, CreatePostInput, PostSchema } from '../types';

export * from '../types';

// Points to our Flask Python backend if running, with JSONPlaceholder as instant fallback
const FLASK_URL = 'http://127.0.0.1:5000/api';
const FALLBACK_URL = 'https://jsonplaceholder.typicode.com';

const CATEGORIES: Array<'Engineering' | 'Design' | 'Product' | 'General'> = [
  'Engineering',
  'Design',
  'Product',
  'General',
];

export function enrichPost(post: Omit<Post, 'category' | 'readTime' | 'likesCount'>): Post {
  const wordCount = post.body.split(/\s+/).length + post.title.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 40));
  const category = CATEGORIES[post.id % CATEGORIES.length];
  const likesCount = (post.id * 7) % 43 + 3;

  return {
    ...post,
    category,
    readTime: `${minutes} min read`,
    likesCount,
  };
}

async function requestWithFallback<T>(
  flaskEndpoint: string,
  fallbackEndpoint: string,
  options?: RequestInit
): Promise<{ data: T; isFlask: boolean }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);

    const res = await fetch(`${FLASK_URL}${flaskEndpoint}`, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      return { data: json, isFlask: true };
    }
  } catch {
    // Flask not running or timed out; fall back to cloud API
  }

  const fallbackRes = await fetch(`${FALLBACK_URL}${fallbackEndpoint}`, options);
  if (!fallbackRes.ok) {
    throw new Error(`Failed to fetch from fallback: HTTP ${fallbackRes.status}`);
  }
  const fallbackJson = await fallbackRes.json();
  return { data: fallbackJson, isFlask: false };
}

export async function fetchPosts(): Promise<Post[]> {
  const { data: raw, isFlask } = await requestWithFallback<unknown[]>('/posts', '/posts');
  if (!Array.isArray(raw)) {
    throw new Error('Malformed API response: expected array of posts');
  }

  return raw.map((item) => {
    const validated = PostSchema.partial({ category: true, readTime: true, likesCount: true }).parse(item);
    return isFlask ? (validated as Post) : enrichPost(validated);
  });
}

export async function fetchPostDetails(postId: number | string): Promise<Post> {
  const { data: raw, isFlask } = await requestWithFallback<unknown>(
    `/posts/${postId}`,
    `/posts/${postId}`
  );
  const validated = PostSchema.partial({ category: true, readTime: true, likesCount: true }).parse(raw);
  return isFlask ? (validated as Post) : enrichPost(validated);
}

export async function fetchComments(postId: number | string): Promise<Comment[]> {
  const { data } = await requestWithFallback<Comment[]>(
    `/posts/${postId}/comments`,
    `/posts/${postId}/comments`
  );
  return data;
}

export async function createPostApi(input: CreatePostInput): Promise<Post> {
  try {
    const { data } = await requestWithFallback<Post>('/posts', '/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: input.title,
        body: input.body,
        category: input.category,
        userId: 1,
      }),
    });
    return data;
  } catch {
    return {
      userId: 1,
      id: Date.now(),
      title: input.title,
      body: input.body,
      category: input.category,
      readTime: '2 min read',
      likesCount: 0,
    };
  }
}
