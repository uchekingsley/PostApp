import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import OfflineBanner from '../components/OfflineBanner';
import { ErrorBoundary } from '../components/ErrorBoundary';

export default function RootLayout() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes fresh cache
            retry: 2,
          },
        },
      })
  );

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <View style={styles.root}>
          <OfflineBanner />
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: '#ffffff' },
              headerTintColor: '#0f172a',
              headerTitleStyle: { fontWeight: '700' },
              contentStyle: { backgroundColor: '#f8fafc' },
            }}
          />
        </View>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
