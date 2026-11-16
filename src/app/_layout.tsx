import { Stack } from 'expo-router';
import React from 'react';
import { AuthProvider } from '../context/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#ffffff' },
          headerTintColor: '#0066cc',
          headerTitleStyle: { fontWeight: '700' },
        }}
      />
    </AuthProvider>
  );
}
