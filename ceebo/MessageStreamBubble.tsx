/**
 * CEEBO — Streaming message bubble with cursor
 *
 * Renders streamed content. Shows blinking cursor while streaming.
 * Parses [text](url) links for clickable URLs. Preserves line breaks.
 */

import React, { useEffect, useRef, useMemo } from 'react';
import { View, StyleSheet, Animated, Text, Linking, Pressable } from 'react-native';
import { theme } from '@/theme';
import { ResponsiveText } from '@/components/ui/ResponsiveText';
import { CeeboAvatar } from './CeeboAvatar';
import type { PendingAction } from './ceebo.types';
import type { ActionPlan } from './skills';

const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

function parseContentWithLinks(content: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  const re = new RegExp(LINK_RE.source, 'g');
  while ((m = re.exec(content)) !== null) {
    if (m.index > lastIndex) {
      parts.push(content.slice(lastIndex, m.index));
    }
    const [, text, url] = m;
    parts.push(
      <Text
        key={`link-${m.index}`}
        onPress={() => Linking.openURL(url).catch(() => {})}
        style={styles.linkText}
      >
        {text}
      </Text>
    );
    lastIndex = re.lastIndex;
  }
  if (lastIndex < content.length) parts.push(content.slice(lastIndex));
  return parts;
}

export interface MessageStreamBubbleProps {
  content: string;
  isStreaming?: boolean;
  timestamp?: string;
  pendingAction?: PendingAction;
  actionPlan?: ActionPlan;
  detectedLanguage?: 'en' | 'es';
  onExecuteAction?: (plan: ActionPlan) => void;
}

export const MessageStreamBubble = React.memo(function MessageStreamBubble({
  content,
  isStreaming = false,
  timestamp,
  pendingAction,
  actionPlan,
  detectedLanguage,
  onExecuteAction,
}: MessageStreamBubbleProps) {
  const cursorOpacity = useRef(new Animated.Value(1)).current;
  const hasLinks = useMemo(() => /\[[^\]]+\]\([^)]+\)/.test(content), [content]);
  const parsedContent = useMemo(
    () => (hasLinks ? parseContentWithLinks(content) : content),
    [content, hasLinks]
  );

  useEffect(() => {
    if (!isStreaming) return;
    const blink = Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(cursorOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ])
    );
    blink.start();
    return () => blink.stop();
  }, [isStreaming, cursorOpacity]);

  return (
    <View style={styles.row}>
      <View style={styles.avatarWrap}>
        <CeeboAvatar size={24} />
      </View>
      <View style={styles.bubbleCol}>
        <View style={styles.bubble}>
          {hasLinks ? (
            <Text style={[styles.linkContainer, styles.text]}>
              {parsedContent}
            </Text>
          ) : (
            <ResponsiveText size="sm" weight="bold" color={theme.colors.text} style={styles.text}>
              {content}
            </ResponsiveText>
          )}
          {isStreaming && (
            <Animated.View style={[styles.cursor, { opacity: cursorOpacity }]} />
          )}
        </View>
        {!isStreaming && pendingAction?.requiresConfirmation && actionPlan && onExecuteAction && (
          <Pressable
            style={({ pressed }) => [styles.actionBtn, pressed && styles.actionBtnPressed]}
            onPress={() => onExecuteAction(actionPlan)}
          >
            <ResponsiveText size="xs" weight="bold" color={theme.colors.tan}>
              {detectedLanguage === 'es' ? 'Llevarme ahí' : 'Take me there'}
            </ResponsiveText>
          </Pressable>
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
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  avatarWrap: {
    marginRight: 8,
    marginBottom: 2,
  },
  bubbleCol: {
    maxWidth: '85%',
  },
  bubble: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(22, 37, 92, 0.9)',
    shadowColor: theme.colors.tan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  text: {
    lineHeight: 20,
  },
  linkContainer: {
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.bold as 'bold',
    color: theme.colors.text,
  },
  linkText: {
    color: theme.colors.tan,
    textDecorationLine: 'underline',
    lineHeight: 20,
  },
  cursor: {
    width: 2,
    height: 16,
    marginLeft: 2,
    backgroundColor: theme.colors.tan,
  },
  timestamp: {
    marginTop: 2,
    marginLeft: 2,
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
