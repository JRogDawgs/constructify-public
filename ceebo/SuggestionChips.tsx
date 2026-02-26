/**
 * CEEBO — Suggestion chips (Phase 1.9 Launch Behavior Lock)
 *
 * Minimal, professional chips under CEEBO messages.
 * Triggers internal skill flow via onChipPress(query).
 * Memoized to prevent extra re-renders. Fixed minHeight to avoid layout shift.
 */

import React, { memo, useCallback } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { theme } from '@/theme';
import { ResponsiveText } from '@/components/ui/ResponsiveText';
import type { SuggestionChip as SuggestionChipType } from './ceebo.types';

const CHIP_MIN_HEIGHT = 32;

const Chip = memo(function Chip({
  label,
  query,
  onPress,
}: SuggestionChipType & { onPress: (query: string) => void }) {
  const handlePress = useCallback(() => {
    onPress(query);
  }, [onPress, query]);
  return (
    <Pressable
      style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
      onPress={handlePress}
    >
      <ResponsiveText size="xs" weight="bold" color={theme.colors.textMuted}>
        {label}
      </ResponsiveText>
    </Pressable>
  );
});

export interface SuggestionChipsProps {
  chips: SuggestionChipType[];
  onChipPress: (query: string) => void;
}

export const SuggestionChips = memo(function SuggestionChips({
  chips,
  onChipPress,
}: SuggestionChipsProps) {
  if (!chips?.length) return null;

  return (
    <View style={[styles.container, { minHeight: CHIP_MIN_HEIGHT }]}>
      {chips.map((chip, i) => (
        <Chip
          key={`${chip.query}-${i}`}
          label={chip.label}
          query={chip.query}
          onPress={onChipPress}
        />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.4)',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
  },
  chipPressed: {
    opacity: 0.85,
    borderColor: theme.colors.tan,
  },
});
