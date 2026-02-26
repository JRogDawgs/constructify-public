/**
 * CEEBO — Avatar using official Ceebo logo
 */

import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { theme } from '@/theme';

const CeeboLogo = require('../../../assets/Buttons/Ceebo.png');
const AVATAR_SIZE = 32;

export interface CeeboAvatarProps {
  size?: number;
}

export function CeeboAvatar({ size = AVATAR_SIZE }: CeeboAvatarProps) {
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      <Image
        source={CeeboLogo}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: theme.colors.navyDark,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
