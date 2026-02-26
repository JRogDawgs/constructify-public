/**
 * CEEBO — Conversational chat (Phase 1.75 Reliability Lock)
 *
 * Single-execution guarantee. Stream → skill coordination.
 * Navigation debounce + route guard.
 */

import React, { useCallback, useState, useRef, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { usePathname } from 'expo-router';
import { useCeeboContext } from './useCeeboContext';
import { useAuth } from '@/context/AuthProvider';
import type { OrchestratorUserContext } from './aiOrchestrator';
import { CeeboWelcome } from './CeeboWelcome';
import { CeeboMessageList } from './CeeboMessageList';
import { CeeboInput } from './CeeboInput';
import { CeeboDebugPanel } from './CeeboDebugPanel';
import { ResponsiveText } from '@/components/ui/ResponsiveText';
import { theme } from '@/theme';
import { useStreamingResponse } from './useStreamingResponse';
import { orchestrate } from './aiOrchestrator';
import { runRoutingTests } from './dev/ceeboRoutingTestHarness';
import { registerNavigationBridge, executeActionPlan } from './skills';
import { setFlowFromSkill, checkUnrelatedSkillReset } from './ceeboContextEngine';
import { simulateVoiceEdgeCases } from './devSimulations';
import type { ChatMessage } from './ceebo.types';
import type { AIOrchestratorDebug } from './ceebo.types';
import type { ActionPlan } from './skills';

/** Phase 1.75: Execution state machine */
type ExecutionState = 'idle' | 'streaming' | 'ready_for_execution' | 'executing' | 'completed';

export interface CeeboChatProps {
  onReset?: () => void;
}

export function CeeboChat({ onReset: _onReset }: CeeboChatProps) {
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const { systemPrompt } = useCeeboContext();
  const { user, roleResolution, companyId } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [streamingContent, setStreamingContent] = useState('');
  const [debugInfo, setDebugInfo] = useState<AIOrchestratorDebug | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const sendingRef = useRef(false);

  const streamingIdRef = useRef<string | null>(null);
  streamingIdRef.current = streamingId;

  const executionIdRef = useRef<string | null>(null);
  const pendingNavRef = useRef<{ plan: ActionPlan; executionId: string; skillId?: string } | null>(null);
  const executedForExecutionIdRef = useRef<string | null>(null);
  const microDelayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const cleanup = registerNavigationBridge(
      (path) => router.push(path as never),
      () => pathname
    );
    return () => {
      cleanup();
      if (microDelayTimerRef.current) {
        clearTimeout(microDelayTimerRef.current);
        microDelayTimerRef.current = null;
      }
    };
  }, [router, pathname]);

  useEffect(() => {
    if (__DEV__) {
      const results = simulateVoiceEdgeCases();
      if (results.length > 0) {
        console.log('[CEEBO Phase 3.8] Voice edge cases:', results.map((r) => ({ name: r.name, collapsed: r.collapsed, collapseWorked: r.collapseWorked })));
      }
    }
  }, []);

  const handleStreamComplete = useCallback(() => {
    const sid = streamingIdRef.current;
    if (sid) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === sid ? { ...m, content: streamingContent, isStreaming: false } : m
        )
      );
    }
    setStreamingId(null);
    setStreamingContent('');

    const pending = pendingNavRef.current;
    if (!pending) return;

    const { plan, executionId, skillId } = pending;
    if (executedForExecutionIdRef.current === executionId) return;

    pendingNavRef.current = null;
    executedForExecutionIdRef.current = executionId;
    executionIdRef.current = null;

    if (plan.type === 'navigation' && !plan.requiresConfirmation && plan.targetRoute) {
      if (skillId) checkUnrelatedSkillReset(skillId);
      executeActionPlan(plan);
      if (skillId) setFlowFromSkill(skillId, plan.targetRoute);
    }
  }, [streamingContent]);

  const { display } = useStreamingResponse({
    fullText: streamingContent || '',
    speedMs: 32,
    onComplete: handleStreamComplete,
    cancelled: streamingId === null && streamingContent !== '',
  });

  const handleExecuteAction = useCallback((plan: ActionPlan, skillId?: string) => {
    if (plan.type === 'navigation' && plan.targetRoute) {
      if (skillId) checkUnrelatedSkillReset(skillId);
      executeActionPlan(plan);
      if (skillId) setFlowFromSkill(skillId, plan.targetRoute);
    }
  }, []);

  const handleSend = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || sendingRef.current) return;

      if (streamingId) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === streamingId
              ? { ...m, content: streamingContent, isStreaming: false }
              : m
          )
        );
        setStreamingId(null);
        setStreamingContent('');
        pendingNavRef.current = null;
      }

      sendingRef.current = true;
      setInputValue('');

      const executionId = `exec-${Date.now()}`;
      executionIdRef.current = executionId;

      /* Phase 4.4: __DEV__ routing test trigger */
      if (__DEV__ && trimmed === '__test_ceebo__') {
        const summary = runRoutingTests();
        const userMsg: ChatMessage = {
          id: `user-${Date.now()}`,
          role: 'user',
          content: trimmed,
          timestamp: Date.now(),
        };
        const ceeboMsg: ChatMessage = {
          id: `ceebo-${Date.now()}`,
          role: 'ceebo',
          content: `[CEEBO_TEST] Routing validation complete. Passed: ${summary.passed}, Failed: ${summary.failed}. Check console for details.`,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, userMsg, ceeboMsg]);
        sendingRef.current = false;
        return;
      }

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: trimmed,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMsg]);

      const userContext: OrchestratorUserContext | undefined =
        user?.uid && roleResolution?.role && roleResolution.role !== null
          ? {
              userId: user.uid,
              role: roleResolution.role as 'worker' | 'supervisor' | 'admin',
              companyId: companyId ?? null,
            }
          : undefined;
      const result = orchestrate(trimmed, pathname, systemPrompt, userContext);
      setDebugInfo(result.debug);

      const { actionPlan, matchedSkill, suggestionChips, isCoachingResponse } = result;

      const delayMs =
        matchedSkill && !isCoachingResponse ? 100 + Math.floor(Math.random() * 41) : 0;

      if (actionPlan && matchedSkill?.actionPlan.requiresConfirmation) {
        pendingNavRef.current = null;
      } else if (actionPlan?.type === 'navigation' && !actionPlan.requiresConfirmation) {
        pendingNavRef.current = { plan: actionPlan, executionId, skillId: matchedSkill?.skill.id };
      } else {
        pendingNavRef.current = null;
      }

      const needsConfirmation = actionPlan?.requiresConfirmation && actionPlan.targetRoute;

      const detectedLang = result.debug.detectedLanguage ?? 'en';

      const ceeboMsg: ChatMessage = {
        id: `ceebo-${Date.now()}`,
        role: 'ceebo',
        content: '',
        timestamp: Date.now(),
        isStreaming: true,
        detectedLanguage: detectedLang,
        pendingAction: needsConfirmation
          ? {
              targetRoute: actionPlan!.targetRoute,
              requiresConfirmation: true,
              confirmationPrompt: actionPlan!.confirmationPrompt,
            }
          : undefined,
        actionPlan:
          needsConfirmation && actionPlan!.type === 'navigation'
            ? {
                type: 'navigation',
                targetRoute: actionPlan!.targetRoute,
                requiresConfirmation: false,
              }
            : undefined,
        suggestionChips: suggestionChips?.length ? suggestionChips : undefined,
        skillId: matchedSkill?.skill.id,
      };

      setMessages((prev) => [...prev, ceeboMsg]);
      setStreamingId(ceeboMsg.id);

      if (delayMs > 0) {
        microDelayTimerRef.current = setTimeout(() => {
          microDelayTimerRef.current = null;
          setStreamingContent(result.response);
        }, delayMs);
      } else {
        setStreamingContent(result.response);
      }

      sendingRef.current = false;
    },
    [pathname, systemPrompt, streamingId, streamingContent, user?.uid, roleResolution?.role, companyId]
  );

  const handleQuickAction = useCallback((prompt: string) => {
    setInputValue(prompt);
  }, []);

  const handleSuggestionChipPress = useCallback(
    (query: string) => {
      handleSend(query);
    },
    [handleSend]
  );

  const hasMessages = messages.length > 0;
  const isTyping = Boolean(streamingId);

  return (
    <View style={styles.container}>
      {!hasMessages ? (
        <ScrollView
          style={styles.welcomeScroll}
          contentContainerStyle={styles.welcomeScrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <CeeboWelcome onQuickAction={handleQuickAction} />
        </ScrollView>
      ) : (
        <CeeboMessageList
          messages={messages}
          isTyping={isTyping}
          streamingMessageId={streamingId}
          streamingContent={display}
          onExecuteAction={handleExecuteAction}
          onSuggestionChipPress={handleSuggestionChipPress}
        />
      )}
      <CeeboInput
        onSend={handleSend}
        value={inputValue}
        onChangeText={setInputValue}
      />
      {__DEV__ && (
        <View style={styles.debugRow}>
          <Pressable onPress={() => setShowDebug((p) => !p)} style={styles.debugBtn}>
            <ResponsiveText size="xs" color={theme.colors.textMuted}>
              {showDebug ? 'Hide' : 'Show'} Debug
            </ResponsiveText>
          </Pressable>
          <CeeboDebugPanel debug={debugInfo} visible={showDebug} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 0,
  },
  welcomeScroll: {
    flex: 1,
  },
  welcomeScrollContent: {
    flexGrow: 1,
  },
  debugRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  debugBtn: {
    padding: 4,
  },
});
