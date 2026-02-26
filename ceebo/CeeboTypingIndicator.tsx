/**
 * CEEBO — 3-dot bounce typing indicator
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { CeeboAvatar } from './CeeboAvatar';
import { theme } from '@/theme';

const DOT_COUNT = 3;

export const CeeboTypingIndicator = React.memo(function CeeboTypingIndicator() {
  const translateY = useRef(
    Array.from({ length: DOT_COUNT }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    const anims = translateY.map((anim, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 100),
          Animated.timing(anim, {
            toValue: -6,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
        ])
      )
    );
    anims.forEach((a) => a.start());
    return () => anims.forEach((a) => a.stop());
  }, [translateY]);

  return (
    <View style={styles.row}>
      <View style={styles.avatarWrap}>
        <CeeboAvatar size={24} />
      </View>
      <View style={styles.bubble}>
        <View style={styles.dots}>
          {translateY.map((anim, i) => (
            <Animated.View
              key={i}
              style={[styles.dot, { transform: [{ translateY: anim }] }]}
            />
          ))}
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  avatarWrap: {
    marginRight: 8,
    marginBottom: 2,
  },
  bubble: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: 'rgba(22, 37, 92, 0.9)',
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.textMuted,
  },
});
