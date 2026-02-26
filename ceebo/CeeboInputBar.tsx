/**
 * CEEBO — Chat Input Bar
 *
 * Text input + Send button.
 * Enter sends (web), disabled when empty.
 */

import React, { useCallback, useState } from 'react';
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import { theme } from '@/theme';
import { ResponsiveText } from '@/components/ui/ResponsiveText';

export interface CeeboInputBarProps {
  onSend: (text: string) => void;
  placeholder?: string;
}

export function CeeboInputBar({
  onSend,
  placeholder = 'Ask Ceebo anything...',
}: CeeboInputBarProps) {
  const [text, setText] = useState('');

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
  }, [text, onSend]);

  const handleKeyPress = useCallback(
    (e: any) => {
      if (Platform.OS === 'web' && e.nativeEvent?.key === 'Enter' && !e.nativeEvent?.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const canSend = text.trim().length > 0;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        multiline={false}
        returnKeyType="send"
        onSubmitEditing={handleSend}
        onKeyPress={handleKeyPress}
        editable
      />
      <Pressable
        style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
        onPress={handleSend}
        disabled={!canSend}
      >
        <ResponsiveText
          size="sm"
          weight="semibold"
          color={canSend ? theme.colors.tan : theme.colors.textMuted}
        >
          Send
        </ResponsiveText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
    backgroundColor: theme.colors.primaryNavy,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.navyDark,
    borderRadius: 10,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  sendButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: 10,
    backgroundColor: theme.colors.navyDark,
    borderWidth: 1,
    borderColor: theme.colors.tan,
  },
  sendButtonDisabled: {
    opacity: 0.5,
    borderColor: theme.colors.textMuted,
  },
});
