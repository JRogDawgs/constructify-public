/**
 * CEEBO — Quick action buttons (Admin Quick Access style)
 *
 * Silver gradient border, white text, #0D1B3D fill.
 * 14px radius, hover scale, subtle glow.
 */

import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { theme } from '@/theme';
import { ResponsiveText } from '@/components/ui/ResponsiveText';

const TILE_BG = '#0D1B3D';
const SILVER_BORDER = {
  borderWidth: 2,
  borderTopColor: '#F8FAFC',
  borderLeftColor: '#F1F5F9',
  borderRightColor: '#CBD5E1',
  borderBottomColor: '#94A3B8',
} as const;

export const QUICK_ACTIONS = [
  { id: 'navigate', label: 'Navigate Help', prompt: 'Where do I find navigation and go to different pages?' },
  { id: 'explain', label: 'Explain This Page', prompt: 'Explain what this page does and how to use it.' },
  { id: 'translate', label: 'Translate Text', prompt: 'Translate: ' },
  { id: 'scheduling', label: 'Scheduling Help', prompt: 'How do I schedule a worker?' },
] as const;

export interface CeeboQuickActionsProps {
  onSelect: (prompt: string) => void;
}

export const CeeboQuickActions = React.memo(function CeeboQuickActions({ onSelect }: CeeboQuickActionsProps) {
  return (
    <View style={styles.container}>
      {QUICK_ACTIONS.map((action) => (
          <Pressable
            key={action.id}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonHovered,
            ]}
            onPress={() => onSelect(action.prompt)}
          >
            <ResponsiveText size="xs" weight="bold" color={theme.colors.white}>
              {action.label}
            </ResponsiveText>
          </Pressable>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    justifyContent: 'center',
  },
  button: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 14,
    backgroundColor: TILE_BG,
    ...SILVER_BORDER,
  },
  buttonHovered: {
    transform: [{ scale: 1.03 }],
    shadowColor: theme.colors.tan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
});
