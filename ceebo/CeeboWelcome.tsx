/**
 * CEEBO — Welcome state with typewriter + centered layout
 *
 * Typewriter for greeting, then fade in capability text.
 * Centered avatar, dividers above quick actions and examples.
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { theme } from '@/theme';
import { ResponsiveText } from '@/components/ui/ResponsiveText';
import { CeeboAvatar } from './CeeboAvatar';
import { CeeboQuickActions } from './CeeboQuickActions';
import { useTypewriter } from './useTypewriter';

const GREETING_TEXT = "Hi, I'm Ceebo — your Constructify Assistant.";
const CAPABILITY_TEXT = "I can help you navigate pages, explain features, answer project questions, and translate languages.";

const EXAMPLE_PROMPTS = [
  'How do I schedule a worker?',
  'Where do I edit company settings?',
  "Why can't this employee clock in?",
  'Translate this message to Spanish.',
  'Explain this dashboard.',
];

export interface CeeboWelcomeProps {
  onQuickAction: (prompt: string) => void;
}

export const CeeboWelcome = React.memo(function CeeboWelcome({ onQuickAction }: CeeboWelcomeProps) {
  const { display, isComplete } = useTypewriter({
    text: GREETING_TEXT,
    speedMs: 28,
    enabled: true,
  });
  const capOpacity = useRef(new Animated.Value(0)).current;
  const cursorOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isComplete) {
      Animated.timing(capOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isComplete, capOpacity]);

  useEffect(() => {
    if (isComplete) return;
    const blink = Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(cursorOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ])
    );
    blink.start();
    return () => blink.stop();
  }, [isComplete, cursorOpacity]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <CeeboAvatar size={48} />
        <View style={styles.greetingWrap}>
          <View style={styles.greetingRow}>
            <ResponsiveText size="lg" weight="bold" color={theme.colors.tan} style={styles.greeting}>
              {display}
            </ResponsiveText>
            {!isComplete && (
              <Animated.View style={[styles.cursor, { opacity: cursorOpacity }]} />
            )}
          </View>
        </View>
      </View>

      <Animated.View style={[styles.capabilityWrap, { opacity: capOpacity }]}>
        <ResponsiveText size="sm" weight="bold" color={theme.colors.white} style={styles.capability} align="center">
          {CAPABILITY_TEXT}
        </ResponsiveText>
      </Animated.View>

      {/* Divider above examples */}
      <View style={styles.divider} />
      <View style={styles.examplesSection}>
        <ResponsiveText size="xs" weight="bold" color={theme.colors.tan} style={styles.examplesSectionLabel}>
          WHAT YOU CAN ASK
        </ResponsiveText>
        <View style={styles.examples}>
          {EXAMPLE_PROMPTS.map((prompt, i) => (
            <View key={i} style={styles.exampleRow}>
              <ResponsiveText size="xs" weight="bold" color={theme.colors.textMuted}>•</ResponsiveText>
              <ResponsiveText size="xs" weight="bold" color={theme.colors.text} style={styles.exampleText}>
                &quot;{prompt}&quot;
              </ResponsiveText>
            </View>
          ))}
        </View>
      </View>

      {/* Divider above quick actions */}
      <View style={styles.divider} />
      <ResponsiveText size="xs" weight="bold" color={theme.colors.tan} style={styles.quickActionsLabel}>
        QUICK ACTIONS
      </ResponsiveText>
      <CeeboQuickActions onSelect={onQuickAction} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  greetingWrap: {
    marginTop: theme.spacing.md,
    alignItems: 'center',
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeting: {
    textAlign: 'center',
  },
  cursor: {
    width: 2,
    height: 18,
    backgroundColor: theme.colors.tan,
    marginLeft: 3,
  },
  capabilityWrap: {
    marginBottom: theme.spacing.lg,
  },
  capability: {
    lineHeight: 20,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignSelf: 'stretch',
    marginVertical: theme.spacing.md,
  },
  sectionLabel: {
    marginBottom: theme.spacing.sm,
    letterSpacing: 0.5,
    alignSelf: 'flex-start',
  },
  quickActionsLabel: {
    marginBottom: theme.spacing.sm,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  examplesSection: {
    alignItems: 'center',
    alignSelf: 'stretch',
    marginBottom: 0,
  },
  examplesSectionLabel: {
    marginBottom: theme.spacing.sm,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  examples: {
    alignSelf: 'center',
    maxWidth: 340,
  },
  exampleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
    gap: 6,
  },
  exampleText: {
    flex: 1,
    lineHeight: 18,
  },
});
