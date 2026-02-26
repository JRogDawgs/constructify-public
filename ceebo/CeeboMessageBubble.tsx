/**
 * CEEBO — Message bubble (Phase 1.9)
 *
 * AI left, user right. "Take me there" for confirmation. Suggestion chips when nav completes.
 */

import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { theme } from '@/theme';
import { ResponsiveText } from '@/components/ui/ResponsiveText';
import { CeeboAvatar } from './CeeboAvatar';
import { SuggestionChips } from './SuggestionChips';
import type { PendingAction, SuggestionChip } from './ceebo.types';
import type { ActionPlan } from './skills';

export type MessageRole = 'ceebo' | 'user';

const BUBBLE_RADIUS = 10;

export interface CeeboMessageBubbleProps {
  role: MessageRole;
  content: string;
  showAvatar?: boolean;
  timestamp?: string;
  pendingAction?: PendingAction;
  actionPlan?: ActionPlan;
  detectedLanguage?: 'en' | 'es';
  suggestionChips?: SuggestionChip[];
  onExecuteAction?: (plan: ActionPlan) => void;
  onSuggestionChipPress?: (query: string) => void;
}

export const CeeboMessageBubble = React.memo(function CeeboMessageBubble({
  role,
  content,
  showAvatar = role === 'ceebo',
  timestamp,
  pendingAction,
  actionPlan,
  detectedLanguage,
  suggestionChips,
  onExecuteAction,
  onSuggestionChipPress,
}: CeeboMessageBubbleProps) {
  const isCeebo = role === 'ceebo';
  const canExecute = isCeebo && pendingAction?.requiresConfirmation && actionPlan && onExecuteAction;
  const showChips = isCeebo && suggestionChips?.length && onSuggestionChipPress;

  return (
    <View style={[styles.row, isCeebo ? styles.rowCeebo : styles.rowUser]}>
      {isCeebo && showAvatar && (
        <View style={styles.avatarWrap}>
          <CeeboAvatar size={24} />
        </View>
      )}
      <View style={styles.bubbleCol}>
        <View style={[styles.bubble, isCeebo ? styles.bubbleCeebo : styles.bubbleUser]}>
          <ResponsiveText size="sm" weight="bold" color={theme.colors.text} style={styles.text}>
            {content}
          </ResponsiveText>
        </View>
        {canExecute && (
          <Pressable
            style={({ pressed }) => [styles.actionBtn, pressed && styles.actionBtnPressed]}
            onPress={() => onExecuteAction(actionPlan!)}
          >
            <ResponsiveText size="xs" weight="bold" color={theme.colors.tan}>
              {detectedLanguage === 'es' ? 'Llevarme ahí' : 'Take me there'}
            </ResponsiveText>
          </Pressable>
        )}
        {showChips && (
          <SuggestionChips chips={suggestionChips!} onChipPress={onSuggestionChipPress!} />
        )}
        {timestamp ? (
          <ResponsiveText size="xs" weight="bold" color={theme.colors.textMuted} style={styles.timestamp}>
            {timestamp}
          </ResponsiveText>
        ) : null}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
    alignItems: 'flex-end',
  },
  rowCeebo: {
    justifyContent: 'flex-start',
  },
  rowUser: {
    justifyContent: 'flex-end',
  },
  avatarWrap: {
    marginRight: theme.spacing.sm,
    marginBottom: 2,
  },
  bubbleCol: {
    maxWidth: '85%',
  },
  bubble: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: BUBBLE_RADIUS,
  },
  bubbleCeebo: {
    backgroundColor: 'rgba(22, 37, 92, 0.9)',
    shadowColor: theme.colors.tan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  bubbleUser: {
    backgroundColor: '#0D1B3D',
  },
  timestamp: {
    marginTop: 2,
    marginLeft: 2,
  },
  text: {
    lineHeight: 20,
  },
  actionBtn: {
    marginTop: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(210, 180, 140, 0.5)',
  },
  actionBtnPressed: { opacity: 0.8 },
});
