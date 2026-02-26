/**
 * CEEBO — Premium AI copilot modal
 *
 * Centered, silver gradient border, backdrop blur.
 * 520px max width, 75vh max height.
 */

import React, { useCallback, useEffect } from 'react';
import {
  Modal,
  View,
  Pressable,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/theme';
import { CeeboHeader } from './CeeboHeader';
import { CeeboChat } from './CeeboChat';

const MODAL_MAX_WIDTH = 520;
const MODAL_MAX_HEIGHT_RATIO = 0.75;
const MODAL_BORDER_RADIUS = 20;
const SILVER_BORDER_WIDTH = 1.5;

// Silver gradient: #C0C0C0 → #E8E8E8 → #AFAFAF
const SILVER_GRADIENT = ['#C0C0C0', '#E8E8E8', '#AFAFAF'] as const;

export interface CeeboModalProps {
  visible: boolean;
  onDismiss: () => void;
}

export function CeeboModal({ visible, onDismiss }: CeeboModalProps) {
  const handleClose = useCallback(() => {
    onDismiss();
  }, [onDismiss]);

  useEffect(() => {
    if (!visible || Platform.OS !== 'web') return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [visible, handleClose]);

  if (!visible) return null;

  const { width: screenW, height: screenH } = Dimensions.get('window');
  const modalWidth = Math.min(MODAL_MAX_WIDTH, screenW - 48);
  const modalHeight = Math.min(
    Math.floor(screenH * MODAL_MAX_HEIGHT_RATIO),
    screenH - 48
  );

  const backdropStyle = Platform.OS === 'web'
    ? [styles.backdrop, { backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' } as object]
    : styles.backdrop;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <Pressable style={backdropStyle} onPress={handleClose} accessible={false}>
        <LinearGradient
          colors={[SILVER_GRADIENT[0], SILVER_GRADIENT[1], SILVER_GRADIENT[2]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.modalBorder,
            {
              width: modalWidth,
              height: modalHeight,
              maxHeight: modalHeight,
              borderRadius: MODAL_BORDER_RADIUS + SILVER_BORDER_WIDTH,
            },
          ]}
        >
          <Pressable
            style={styles.modal}
            onPress={(e) => e.stopPropagation()}
          >
            <CeeboHeader onClose={handleClose} />
            <View style={styles.chatArea}>
              <CeeboChat />
            </View>
          </Pressable>
        </LinearGradient>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalBorder: {
    padding: SILVER_BORDER_WIDTH,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 16,
  },
  modal: {
    flex: 1,
    backgroundColor: theme.colors.primaryNavy,
    borderRadius: MODAL_BORDER_RADIUS,
    overflow: 'hidden',
    minHeight: 300,
  },
  chatArea: {
    flex: 1,
    minHeight: 0,
  },
});
