/**
 * CEEBO — Message list with streaming support (Phase 1.9)
 *
 * Memoized. Smooth auto-scroll. Suggestion chips under completed messages.
 */

import React, { useCallback, useEffect, useRef, memo } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { CeeboMessageBubble } from './CeeboMessageBubble';
import { MessageStreamBubble } from './MessageStreamBubble';
import { CeeboTypingIndicator } from './CeeboTypingIndicator';
import type { ChatMessage } from './ceebo.types';
import type { ActionPlan } from './skills';

export interface CeeboMessageListProps {
  messages: ChatMessage[];
  isTyping?: boolean;
  /** When set, this message ID is streaming; use streamingContent for display */
  streamingMessageId?: string | null;
  streamingContent?: string;
  /** Called when user confirms "Take me there" on a skill message */
  onExecuteAction?: (plan: ActionPlan, skillId?: string) => void;
  /** Phase 1.9: Called when user taps a suggestion chip */
  onSuggestionChipPress?: (query: string) => void;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

const UserMessage = memo(function UserMessage({
  id,
  content,
  timestamp,
}: ChatMessage) {
  const timeStr = timestamp ? formatTime(new Date(timestamp)) : '';
  return (
    <CeeboMessageBubble
      role="user"
      content={content}
      timestamp={timeStr}
      showAvatar={false}
    />
  );
});

const CeeboMessage = memo(function CeeboMessage({
  id,
  content,
  timestamp,
  isStreaming,
  streamingContent,
  streamingMessageId,
  pendingAction,
  actionPlan,
  detectedLanguage,
  suggestionChips,
  skillId,
  onExecuteAction,
  onSuggestionChipPress,
}: ChatMessage & {
  streamingContent?: string;
  streamingMessageId?: string | null;
  skillId?: string;
  onExecuteAction?: (plan: ActionPlan, skillId?: string) => void;
  onSuggestionChipPress?: (query: string) => void;
}) {
  const timeStr = timestamp ? formatTime(new Date(timestamp)) : '';
  const isThisStreaming = streamingMessageId === id;
  const display = isThisStreaming && streamingContent !== undefined ? streamingContent : content;
  const showChips = !isThisStreaming && !isStreaming && suggestionChips?.length;
  const executeWithSkill = onExecuteAction
    ? (plan: ActionPlan) => onExecuteAction(plan, skillId)
    : undefined;

  if (isThisStreaming || isStreaming) {
    return (
      <MessageStreamBubble
        content={display}
        isStreaming={isThisStreaming}
        timestamp={timeStr}
        pendingAction={pendingAction}
        actionPlan={actionPlan}
        detectedLanguage={detectedLanguage}
        onExecuteAction={executeWithSkill ?? onExecuteAction}
      />
    );
  }

  return (
    <CeeboMessageBubble
      role="ceebo"
      content={content}
      timestamp={timeStr}
      pendingAction={pendingAction}
      actionPlan={actionPlan}
      detectedLanguage={detectedLanguage}
      suggestionChips={showChips ? suggestionChips : undefined}
      onExecuteAction={executeWithSkill ?? onExecuteAction}
      onSuggestionChipPress={onSuggestionChipPress}
    />
  );
});

export const CeeboMessageList = memo(function CeeboMessageList({
  messages,
  isTyping = false,
  streamingMessageId = null,
  streamingContent = '',
  onExecuteAction,
  onSuggestionChipPress,
}: CeeboMessageListProps) {
  const scrollRef = useRef<ScrollView>(null);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(() => {
      scrollTimerRef.current = null;
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 50);
  }, []);

  useEffect(() => {
    scrollToBottom();
    return () => {
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
        scrollTimerRef.current = null;
      }
    };
  }, [messages, isTyping, streamingContent, scrollToBottom]);

  return (
    <ScrollView
      ref={scrollRef}
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {messages.map((msg) =>
        msg.role === 'user' ? (
          <UserMessage
            key={msg.id}
            id={msg.id}
            role={msg.role}
            content={msg.content}
            timestamp={msg.timestamp}
          />
        ) : (
          <CeeboMessage
            key={msg.id}
            id={msg.id}
            role={msg.role}
            content={msg.content}
            timestamp={msg.timestamp}
            isStreaming={msg.isStreaming}
            streamingContent={streamingContent}
            streamingMessageId={streamingMessageId}
            pendingAction={msg.pendingAction}
            actionPlan={msg.actionPlan}
            detectedLanguage={msg.detectedLanguage}
            suggestionChips={msg.suggestionChips}
            skillId={msg.skillId}
            onExecuteAction={onExecuteAction}
            onSuggestionChipPress={onSuggestionChipPress}
          />
        )
      )}
      {isTyping && (
        <View style={styles.typingWrap}>
          <CeeboTypingIndicator />
        </View>
      )}
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    paddingBottom: 8,
    flexGrow: 1,
  },
  typingWrap: {
    marginBottom: 12,
  },
});
