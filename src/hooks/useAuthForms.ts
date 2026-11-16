import { useState, useCallback } from 'react';
import { router } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export function useLoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = useCallback(async () => {
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      await login(email, password);
      router.replace('/');
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  }, [email, password, login]);

  const updateEmail = useCallback((text: string) => {
    setEmail(text);
    setErrorMessage(null);
  }, []);

  const updatePassword = useCallback((text: string) => {
    setPassword(text);
    setErrorMessage(null);
  }, []);

  return {
    email,
    password,
    isSubmitting,
    errorMessage,
    updateEmail,
    updatePassword,
    handleLogin,
  };
}

export function useRegisterForm() {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRegister = useCallback(async () => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    if (username.trim().length < 3) {
      setErrorMessage('Username must be at least 3 characters long.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      await register(username, email, password);
      router.replace('/');
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [username, email, password, register]);

  const updateUsername = useCallback((text: string) => {
    setUsername(text);
    setErrorMessage(null);
  }, []);

  const updateEmail = useCallback((text: string) => {
    setEmail(text);
    setErrorMessage(null);
  }, []);

  const updatePassword = useCallback((text: string) => {
    setPassword(text);
    setErrorMessage(null);
  }, []);

  return {
    username,
    email,
    password,
    isSubmitting,
    errorMessage,
    updateUsername,
    updateEmail,
    updatePassword,
    handleRegister,
  };
}
