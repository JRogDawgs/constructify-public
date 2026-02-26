/**
 * CEEBO — Modal header with official logo
 *
 * Uses same Ceebo logo as admin/footer. Silver divider below.
 */

import React from 'react';
import { View, Pressable, Text, Image, StyleSheet } from 'react-native';
import { theme } from '@/theme';
import { ResponsiveText } from '@/components/ui/ResponsiveText';

// Same asset as Footer admin button
const CeeboLogo = require('../../../assets/Buttons/Ceebo.png');

const SILVER_BORDER = {
  borderWidth: 2,
  borderTopColor: '#F8FAFC',
  borderLeftColor: '#F1F5F9',
  borderRightColor: '#CBD5E1',
  borderBottomColor: '#94A3B8',
} as const;

export interface CeeboHeaderProps {
  onClose: () => void;
}

export const CeeboHeader = React.memo(function CeeboHeader({ onClose }: CeeboHeaderProps) {
  return (
    <>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={CeeboLogo}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.headerTitles}>
            <ResponsiveText size="md" weight="bold" color={theme.colors.white}>
              Ceebo
            </ResponsiveText>
            <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <ResponsiveText size="xs" weight="bold" color={theme.colors.success}>
                Online
              </ResponsiveText>
            </View>
          </View>
        </View>
        <Pressable
          onPress={onClose}
          style={({ pressed }) => [styles.closeButton, pressed && styles.closeButtonPressed]}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Close"
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </Pressable>
      </View>
      <View style={styles.divider} />
    </>
  );
});

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    width: 36,
    height: 36,
  },
  headerTitles: {
    marginLeft: theme.spacing.md,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.success,
  },
  closeButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    backgroundColor: '#0D1B3D',
    borderRadius: theme.spacing.md,
    ...SILVER_BORDER,
  },
  closeButtonPressed: {
    opacity: 0.85,
  },
  closeButtonText: {
    fontSize: theme.fontSizes.base,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.white,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});
