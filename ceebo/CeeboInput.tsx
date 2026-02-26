/**
 * CEEBO — Chat input with voice, auto-grow textarea
 *
 * Enter=Send, Shift+Enter=newline. Max 220px. Phase 3.9.
 * useCeeboSpeech: silence detection, idle/listening/processing states.
 */

import React, { useCallback, useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  Platform,
  Animated,
  LayoutAnimation,
  type NativeSyntheticEvent,
  type TextInputContentSizeChangeEventData,
  type TextInputKeyPressEventData,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/theme';
import { ResponsiveText } from '@/components/ui/ResponsiveText';
import { useCeeboSpeech } from './useCeeboSpeech';

const SMART_PLACEHOLDER = 'Ask about this page, scheduling, workers, or translations…';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'zh', label: 'Chinese' },
  { code: 'pt', label: 'Portuguese' },
] as const;

const TILE_BG = '#0D1B3D';
const INPUT_MAX_HEIGHT = 220;
const INPUT_MIN_HEIGHT = 48;

const SILVER_BORDER = {
  borderWidth: 2,
  borderTopColor: '#F8FAFC',
  borderLeftColor: '#F1F5F9',
  borderRightColor: '#CBD5E1',
  borderBottomColor: '#94A3B8',
} as const;

export interface CeeboInputProps {
  onSend: (text: string) => void;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
}

export const CeeboInput = React.memo(function CeeboInput({
  onSend,
  placeholder = SMART_PLACEHOLDER,
  value: controlledValue,
  onChangeText: onControlledChange,
}: CeeboInputProps) {
  const [internalText, setInternalText] = useState('');
  const [inputHeight, setInputHeight] = useState(INPUT_MIN_HEIGHT);
  const isControlled = controlledValue !== undefined;
  const text = isControlled ? controlledValue : internalText;
  const setText = useCallback(
    (v: string) => {
      if (isControlled) onControlledChange?.(v);
      else setInternalText(v);
    },
    [isControlled, onControlledChange]
  );
  const [translatorMode, setTranslatorMode] = useState(false);
  const [fromLang, setFromLang] = useState('en');
  const [toLang, setToLang] = useState('es');

  const handleFinalTranscript = useCallback(
    (result: { normalized: string }) => {
      if (result.normalized) {
        const lower = result.normalized.toLowerCase();
        if (lower.includes('translate') && lower.includes('to')) setTranslatorMode(true);
        setText(result.normalized);
      }
    },
    [setText]
  );

  const {
    state: speechState,
    isSupported,
    transcript,
    startListening,
    stopListening,
  } = useCeeboSpeech({ onFinalTranscript: handleFinalTranscript });

  useEffect(() => {
    if (transcript) setText(transcript);
  }, [transcript, setText]);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const ringOpacity = useRef(new Animated.Value(0.6)).current;
  useEffect(() => {
    if (speechState === 'listening') {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(pulseAnim, { toValue: 1.12, duration: 500, useNativeDriver: true }),
            Animated.timing(ringOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
          ]),
          Animated.parallel([
            Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.timing(ringOpacity, { toValue: 0.5, duration: 500, useNativeDriver: true }),
          ]),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
    pulseAnim.setValue(1);
    ringOpacity.setValue(0.6);
    return;
  }, [speechState, pulseAnim, ringOpacity]);

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (translatorMode) {
      const toLabel = LANGUAGES.find((l) => l.code === toLang)?.label ?? toLang;
      onSend(`Translate: ${trimmed} to ${toLabel}`);
    } else {
      onSend(trimmed);
    }
    setText('');
    if (Platform.OS !== 'web') {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    setInputHeight(INPUT_MIN_HEIGHT);
  }, [text, onSend, translatorMode, toLang, setText]);

  const handleContentSizeChange = useCallback(
    (e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
      const { height } = e.nativeEvent.contentSize;
      const next = Math.max(INPUT_MIN_HEIGHT, Math.min(height + 28, INPUT_MAX_HEIGHT));
      if (Platform.OS !== 'web') {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      }
      setInputHeight(next);
    },
    []
  );

  const handleKeyPress = useCallback(
    (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      const ev = e as NativeSyntheticEvent<TextInputKeyPressEventData> & { preventDefault?: () => void; nativeEvent?: { key?: string; shiftKey?: boolean } };
      const native = ev.nativeEvent as { key?: string; shiftKey?: boolean } | undefined;
      if (Platform.OS === 'web' && native?.key === 'Enter') {
        if (!native?.shiftKey) {
          if (typeof ev.preventDefault === 'function') ev.preventDefault();
          handleSend();
        }
      }
    },
    [handleSend]
  );

  const canSend = text.trim().length > 0;
  const isListening = speechState === 'listening';

  const toggleVoice = useCallback(() => {
    if (isListening) stopListening();
    else startListening();
  }, [isListening, startListening, stopListening]);

  const micColor =
    speechState === 'listening'
      ? theme.colors.success
      : speechState === 'processing'
        ? theme.colors.tan
        : theme.colors.textMuted;

  return (
    <View style={styles.container}>
      <View style={styles.divider} />
      <View style={styles.toolbar}>
        <Pressable
          style={[styles.toggleBtn, translatorMode && styles.toggleBtnActive]}
          onPress={() => setTranslatorMode((p) => !p)}
        >
          <ResponsiveText size="xs" weight="bold" color={translatorMode ? theme.colors.tan : theme.colors.textMuted}>
            Translate
          </ResponsiveText>
        </Pressable>
      </View>
      {translatorMode && (
        <View style={styles.langSelectors}>
          <View style={styles.langRow}>
            <ResponsiveText size="xs" weight="bold" color={theme.colors.textMuted} style={styles.langLabel}>
              From:
            </ResponsiveText>
            <View style={styles.langChips}>
              {LANGUAGES.map((lang) => (
                <Pressable
                  key={lang.code}
                  style={[styles.langChip, fromLang === lang.code && styles.langChipActive]}
                  onPress={() => setFromLang(lang.code)}
                >
                  <ResponsiveText size="xs" weight="bold" color={fromLang === lang.code ? theme.colors.tan : theme.colors.textMuted}>
                    {lang.label}
                  </ResponsiveText>
                </Pressable>
              ))}
            </View>
          </View>
          <View style={styles.langRow}>
            <ResponsiveText size="xs" weight="bold" color={theme.colors.textMuted} style={styles.langLabel}>
              To:
            </ResponsiveText>
            <View style={styles.langChips}>
              {LANGUAGES.map((lang) => (
                <Pressable
                  key={lang.code}
                  style={[styles.langChip, toLang === lang.code && styles.langChipActive]}
                  onPress={() => setToLang(lang.code)}
                >
                  <ResponsiveText size="xs" weight="bold" color={toLang === lang.code ? theme.colors.tan : theme.colors.textMuted}>
                    {lang.label}
                  </ResponsiveText>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      )}
      <View style={styles.inputRow}>
        <View
          style={[
            styles.inputWrap,
            isListening && styles.inputWrapListening,
            { minHeight: inputHeight },
          ]}
        >
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={(v) => {
              setText(v);
              if (v.toLowerCase().startsWith('translate:')) setTranslatorMode(true);
            }}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.textMuted}
            multiline
            maxLength={2000}
            returnKeyType="default"
            onKeyPress={handleKeyPress}
            editable
            blurOnSubmit={false}
            scrollEnabled={false}
            onContentSizeChange={handleContentSizeChange}
          />
          {isSupported && (
            <View style={styles.micWrap}>
              {isListening && (
                <ResponsiveText size="xs" color={theme.colors.success} style={styles.listeningLabel}>
                  Listening…
                </ResponsiveText>
              )}
              <Animated.View
                style={[
                  styles.micBtn,
                  isListening && styles.micRingOuter,
                  isListening && { opacity: ringOpacity },
                ]}
              >
                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                  <Pressable onPress={toggleVoice}>
                    <Ionicons
                      name={isListening ? 'mic' : 'mic-outline'}
                      size={22}
                      color={micColor}
                    />
                  </Pressable>
                </Animated.View>
              </Animated.View>
            </View>
          )}
        </View>
        <Pressable
          style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!canSend}
        >
          <ResponsiveText size="sm" weight="bold" color={canSend ? theme.colors.white : theme.colors.textMuted}>
            Send
          </ResponsiveText>
        </Pressable>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    paddingBottom: theme.spacing.lg,
    backgroundColor: theme.colors.primaryNavy,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: theme.spacing.sm,
  },
  toolbar: { flexDirection: 'row', marginBottom: theme.spacing.sm },
  toggleBtn: { paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.xs },
  toggleBtnActive: {},
  langSelectors: { marginBottom: theme.spacing.sm },
  langRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  langLabel: { width: 40 },
  langChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, flex: 1 },
  langChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: TILE_BG,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  langChipActive: { borderColor: 'rgba(210, 180, 140, 0.5)' },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: TILE_BG,
    borderRadius: 16,
    ...SILVER_BORDER,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 12,
    minHeight: INPUT_MIN_HEIGHT,
    maxHeight: INPUT_MAX_HEIGHT,
    overflow: 'hidden',
  },
  inputWrapListening: {
    shadowColor: theme.colors.success,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  /* Phase 3.9.1: No maxHeight — scrollEnabled=false. Wrapper caps at 220px. */
  input: {
    flex: 1,
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.text,
    paddingVertical: 10,
    paddingRight: theme.spacing.sm,
    minHeight: 24,
  },
  micWrap: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-end' },
  listeningLabel: { marginRight: 2 },
  micBtn: { padding: 4 },
  micRingOuter: {
    borderRadius: 20,
    borderWidth: 2,
    borderColor: theme.colors.success,
    padding: 2,
  },
  sendButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: TILE_BG,
    ...SILVER_BORDER,
  },
  sendButtonDisabled: { opacity: 0.4 },
});
