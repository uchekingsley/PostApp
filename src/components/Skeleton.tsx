import React, { useEffect } from 'react';
import { View, StyleSheet, DimensionValue } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: object;
}

export function Skeleton({ width = '100%', height = 20, borderRadius = 6, style }: SkeletonProps) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.8, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

export function PostCardSkeleton() {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.headerRow}>
        <Skeleton width={38} height={38} borderRadius={19} />
        <View style={styles.headerText}>
          <Skeleton width="45%" height={14} borderRadius={4} style={{ marginBottom: 6 }} />
          <Skeleton width="25%" height={10} borderRadius={4} />
        </View>
        <Skeleton width={20} height={20} borderRadius={10} />
      </View>
      <Skeleton width="85%" height={16} borderRadius={4} style={{ marginTop: 14, marginBottom: 8 }} />
      <Skeleton width="98%" height={12} borderRadius={4} style={{ marginBottom: 6 }} />
      <Skeleton width="60%" height={12} borderRadius={4} style={{ marginBottom: 14 }} />
      <View style={styles.footerRow}>
        <Skeleton width={70} height={24} borderRadius={12} />
        <Skeleton width={50} height={16} borderRadius={4} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#e2e8f0',
  },
  cardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#eef2f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
    marginLeft: 12,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

