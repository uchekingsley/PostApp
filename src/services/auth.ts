import * as SecureStore from 'expo-secure-store';

export interface User {
  id: number;
  username: string;
  email: string;
  bio?: string;
  avatar_url?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

const TOKEN_KEY = 'postapp_user_jwt_token';
const USER_KEY = 'postapp_user_data';

// Points to our Flask server; can be adjusted via environment
const API_BASE_URL = 'http://127.0.0.1:5000/api';

export const AuthService = {
  async saveToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch (err) {
      console.warn('Failed to save auth token to SecureStore:', err);
    }
  },

  async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (err) {
      console.warn('Failed to read auth token from SecureStore:', err);
      return null;
    }
  },

  async saveUser(user: User): Promise<void> {
    try {
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    } catch (err) {
      console.warn('Failed to save user data to SecureStore:', err);
    }
  },

  async getUser(): Promise<User | null> {
    try {
      const data = await SecureStore.getItemAsync(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.warn('Failed to read user data from SecureStore:', err);
      return null;
    }
  },

  async clearAuth(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
    } catch (err) {
      console.warn('Failed to clear auth from SecureStore:', err);
    }
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to log in. Please check your credentials.');
    }

    const data: AuthResponse = await response.json();
    await AuthService.saveToken(data.token);
    await AuthService.saveUser(data.user);
    return data;
  },

  async register(username: string, email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Registration failed. Please try a different email/username.');
    }

    const data: AuthResponse = await response.json();
    await AuthService.saveToken(data.token);
    await AuthService.saveUser(data.user);
    return data;
  },
};

