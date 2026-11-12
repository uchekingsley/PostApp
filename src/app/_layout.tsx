import { Stack } from 'expo-router';
import React from 'react';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#ffffff' },
        headerTintColor: '#0066cc',
        headerTitleStyle: { fontWeight: '700' },
      }}
    />
  );
}
