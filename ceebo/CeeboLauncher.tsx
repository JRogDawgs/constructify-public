/**
 * CEEBO — Floating launcher button + modal
 *
 * Optional: use when you want a standalone floating FAB.
 * Footer uses CeeboModal directly for its own trigger.
 */

import React, { useState, useCallback } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { CeeboAvatar } from './CeeboAvatar';
import { CeeboModal } from './CeeboModal';

const LAUNCHER_SIZE = 56;
const LAUNCHER_MARGIN = 24;

export interface CeeboLauncherProps {
  /** Custom trigger element. Default: floating FAB */
  children?: React.ReactNode;
}

export function CeeboLauncher({ children }: CeeboLauncherProps) {
  const [visible, setVisible] = useState(false);

  const open = useCallback(() => setVisible(true), []);
  const close = useCallback(() => setVisible(false), []);

  if (children) {
    return (
      <>
        <Pressable onPress={open}>{children}</Pressable>
        <CeeboModal visible={visible} onDismiss={close} />
      </>
    );
  }

  return (
    <>
      <Pressable
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
        onPress={open}
        accessibilityRole="button"
        accessibilityLabel="Open Ceebo Assistant"
      >
        <CeeboAvatar size={32} />
      </Pressable>
      <CeeboModal visible={visible} onDismiss={close} />
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 100,
    right: LAUNCHER_MARGIN,
    width: LAUNCHER_SIZE,
    height: LAUNCHER_SIZE,
    borderRadius: LAUNCHER_SIZE / 2,
    backgroundColor: '#16255C',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: 'rgba(210, 180, 140, 0.4)',
  },
  fabPressed: {
    opacity: 0.9,
  },
});
