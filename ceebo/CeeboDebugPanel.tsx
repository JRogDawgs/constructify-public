/**
 * CEEBO — Debug panel (__DEV__ only)
 *
 * Shows: intent, skill match, action plan, retrieved docs, transcript.
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ResponsiveText } from '@/components/ui/ResponsiveText';
import { theme } from '@/theme';
import type { AIOrchestratorDebug } from './ceebo.types';

export interface CeeboDebugPanelProps {
  debug: AIOrchestratorDebug | null;
  visible: boolean;
}

export const CeeboDebugPanel = React.memo(function CeeboDebugPanel({
  debug,
  visible,
}: CeeboDebugPanelProps) {
  if (!__DEV__ || !visible || !debug) return null;

  return (
    <View style={styles.container}>
      <ResponsiveText size="xs" weight="bold" color={theme.colors.tan} style={styles.title}>
        CEEBO DEBUG
      </ResponsiveText>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {debug.detectedLanguage && (
          <View style={styles.section}>
            <ResponsiveText size="xs" weight="bold" color={theme.colors.textMuted}>
              Language:
            </ResponsiveText>
            <ResponsiveText size="xs" color={theme.colors.text}>
              {debug.detectedLanguage}
            </ResponsiveText>
          </View>
        )}
        {debug.matchedSkillId && (
          <View style={styles.section}>
            <ResponsiveText size="xs" weight="bold" color={theme.colors.textMuted}>
              Matched Skill:
            </ResponsiveText>
            <ResponsiveText size="xs" color={theme.colors.text}>
              {debug.matchedSkillId}
            </ResponsiveText>
            {debug.skillConfidence != null && (
              <ResponsiveText size="xs" color={theme.colors.text}>
                Confidence: {(debug.skillConfidence * 100).toFixed(0)}%
              </ResponsiveText>
            )}
            {debug.confirmationRequired != null && (
              <ResponsiveText size="xs" color={theme.colors.text}>
                Confirm required: {String(debug.confirmationRequired)}
              </ResponsiveText>
            )}
          </View>
        )}
        {debug.actionPlan && (
          <View style={styles.section}>
            <ResponsiveText size="xs" weight="bold" color={theme.colors.textMuted}>
              Action Plan:
            </ResponsiveText>
            <ResponsiveText size="xs" color={theme.colors.text} style={styles.code}>
              {JSON.stringify(debug.actionPlan, null, 2)}
            </ResponsiveText>
          </View>
        )}
        {debug.intent && (
          <View style={styles.section}>
            <ResponsiveText size="xs" weight="bold" color={theme.colors.textMuted}>
              Intent:
            </ResponsiveText>
            <ResponsiveText size="xs" color={theme.colors.text}>
              {debug.intent}
            </ResponsiveText>
          </View>
        )}
        {debug.rawTranscript != null && (
          <View style={styles.section}>
            <ResponsiveText size="xs" weight="bold" color={theme.colors.textMuted}>
              Raw:
            </ResponsiveText>
            <ResponsiveText size="xs" color={theme.colors.text}>
              {debug.rawTranscript}
            </ResponsiveText>
          </View>
        )}
        {debug.afterAccentRemoval != null && (
          <View style={styles.section}>
            <ResponsiveText size="xs" weight="bold" color={theme.colors.textMuted}>
              After accent removal:
            </ResponsiveText>
            <ResponsiveText size="xs" color={theme.colors.text}>
              {debug.afterAccentRemoval}
            </ResponsiveText>
          </View>
        )}
        {debug.afterSlangNormalization != null && (
          <View style={styles.section}>
            <ResponsiveText size="xs" weight="bold" color={theme.colors.textMuted}>
              After slang normalization:
            </ResponsiveText>
            <ResponsiveText size="xs" color={theme.colors.text}>
              {debug.afterSlangNormalization}
            </ResponsiveText>
          </View>
        )}
        {debug.finalNormalized != null && (
          <View style={styles.section}>
            <ResponsiveText size="xs" weight="bold" color={theme.colors.textMuted}>
              Final normalized:
            </ResponsiveText>
            <ResponsiveText size="xs" color={theme.colors.text}>
              {debug.finalNormalized}
            </ResponsiveText>
          </View>
        )}
        {debug.isFuzzyMatch != null && (
          <View style={styles.section}>
            <ResponsiveText size="xs" weight="bold" color={theme.colors.textMuted}>
              Fuzzy match:
            </ResponsiveText>
            <ResponsiveText size="xs" color={theme.colors.text}>
              {String(debug.isFuzzyMatch)}
              {debug.fuzzySimilarity != null &&
                ` (${(debug.fuzzySimilarity * 100).toFixed(0)}% similarity)`}
            </ResponsiveText>
          </View>
        )}
        {debug.executionBlockedReason && (
          <View style={styles.section}>
            <ResponsiveText size="xs" weight="bold" color="#94A3B8">
              {debug.executionBlockedReason}
            </ResponsiveText>
          </View>
        )}
        {debug.validationWarnings && debug.validationWarnings.length > 0 && (
          <View style={styles.section}>
            <ResponsiveText size="xs" weight="bold" color={theme.colors.warning}>
              Validation:
            </ResponsiveText>
            {debug.validationWarnings.map((w, i) => (
              <ResponsiveText key={i} size="xs" color={theme.colors.warning}>
                {w.code}: {w.detail}
              </ResponsiveText>
            ))}
          </View>
        )}
        {debug.normalizedTranscript != null && !debug.finalNormalized && (
          <View style={styles.section}>
            <ResponsiveText size="xs" weight="bold" color={theme.colors.textMuted}>
              Normalized:
            </ResponsiveText>
            <ResponsiveText size="xs" color={theme.colors.text}>
              {debug.normalizedTranscript}
            </ResponsiveText>
          </View>
        )}
        {debug.retrievedDocs && debug.retrievedDocs.length > 0 && (
          <View style={styles.section}>
            <ResponsiveText size="xs" weight="bold" color={theme.colors.textMuted}>
              Retrieved:
            </ResponsiveText>
            {debug.retrievedDocs.map((d, i) => (
              <ResponsiveText key={i} size="xs" color={theme.colors.text}>
                • {d.pageTitle} (score: {d.score})
              </ResponsiveText>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 8,
    maxHeight: 120,
  },
  title: {
    marginBottom: 4,
  },
  scroll: {
    maxHeight: 180,
  },
  code: {
    fontFamily: 'monospace',
  },
  section: {
    marginBottom: 4,
  },
});
