/**
 * CEEBO — Dev-only concurrency simulation utilities (Phase 1.75)
 *
 * Simulate edge cases for reliability testing.
 * Only available in __DEV__.
 * Phase 3.8: Voice edge case simulation.
 */

/* eslint-disable no-console */

import { collapseRepeatedPhrase, normalizeTranscript } from './voiceTranscriptUtils';

export type SimScenario =
  | 'rapid_double_send'
  | 'rapid_nav_spam'
  | 'lang_switch_mid_stream'
  | 'slang_fuzzy_nav'
  | 'interrupt_skill_mid_exec';

/** Rapid double message send — tests sendingRef + executionId guard */
export function simulateRapidDoubleSend(
  sendFn: (text: string) => void,
  delayMs = 5
): void {
  if (!__DEV__) return;
  sendFn('show projects');
  setTimeout(() => sendFn('go to tasks'), delayMs);
  console.log('[CEEBO Dev] Simulating rapid double send');
}

/** Rapid navigation spam — tests debounce + route guard */
export function simulateRapidNavSpam(
  executeFn: (plan: { type: 'navigation'; targetRoute: string }) => void
): void {
  if (!__DEV__) return;
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      executeFn({ type: 'navigation', targetRoute: '/dashboard/projects' });
    }, i * 20);
  }
  console.log('[CEEBO Dev] Simulating rapid nav spam');
}

/** Language switch mid-stream — tests cancel flow */
export function simulateLangSwitchMidStream(
  sendFn: (text: string) => void,
  delayMs = 500
): void {
  if (!__DEV__) return;
  sendFn('quiero ver proyectos');
  setTimeout(() => sendFn('show tasks'), delayMs);
  console.log('[CEEBO Dev] Simulating language switch mid-stream');
}

/** Slang + fuzzy + navigation — combined stress */
export function simulateSlangFuzzyNav(sendFn: (text: string) => void): void {
  if (!__DEV__) return;
  sendFn('wanna see proyects');
  console.log('[CEEBO Dev] Simulating slang+fuzzy+nav');
}

/** Interrupt skill mid-execution — send new message while streaming */
export function simulateInterruptSkill(
  sendFn: (text: string) => void,
  interruptMs = 300
): void {
  if (!__DEV__) return;
  sendFn('go to projects');
  setTimeout(() => sendFn('actually show tasks'), interruptMs);
  console.log('[CEEBO Dev] Simulating interrupt skill mid-execution');
}

/** Phase 2: Heavy usage stress — 50 rapid queries, mixed EN/ES, fuzzy+slang, nav loops */
export interface StressMetrics {
  totalQueries: number;
  avgNormalizationMs: number;
  avgSkillMatchMs: number;
  avgExecutionMs: number;
  errors: number;
}

const STRESS_QUERIES = [
  'show projects',
  'quiero ver proyectos',
  'take me to tasks',
  'proyects',
  'wanna see proyects',
  'go to task builder',
  'crear proyecto',
  'asignar tarea',
  'where schedule',
  'ver tareas',
  'open projects',
  'navegar a proyectos',
  'projects list',
  'tasks',
  'task assign',
  'new project',
  'create task',
  'ir a proyectos',
  'show me tasks',
  'projects',
  'tareas',
  'asdfgh',
  'blah',
  'xyz',
  'schedule worker',
  'team members',
  'reportes',
  'ver reportes',
  'reports',
  'settings',
  'configuración',
  'clock in',
  'reloj',
  'how do i',
  'qué hacer',
  'explain',
  'explica',
  'projects please',
  'tareas por favor',
  'assign task',
  'asignar tarea',
  'go projects',
  'ir tareas',
  'open task builder',
  'task builder',
  'crear proyecto nuevo',
  'new task',
  'nueva tarea',
  'projects now',
  'tasks now',
  'quick projects',
  'rápido proyectos',
];

/** Phase 2: orchestrateFn = (query, pathname) => result — used to measure latency */
export function simulateHeavyUsage(
  orchestrateFn: (query: string, pathname: string) => unknown
): StressMetrics {
  if (!__DEV__) {
    return {
      totalQueries: 0,
      avgNormalizationMs: 0,
      avgSkillMatchMs: 0,
      avgExecutionMs: 0,
      errors: 0,
    };
  }

  const normTimes: number[] = [];
  const matchTimes: number[] = [];
  const execTimes: number[] = [];
  let errors = 0;
  const pathname = '/dashboard';

  const start = performance.now();
  for (const q of STRESS_QUERIES) {
    try {
      const t0 = performance.now();
      orchestrateFn(q, pathname);
      const t1 = performance.now();
      const elapsed = t1 - t0;
      execTimes.push(elapsed);
    } catch (e) {
      errors += 1;
    }
  }
  const totalElapsed = performance.now() - start;

  return {
    totalQueries: STRESS_QUERIES.length,
    avgNormalizationMs: normTimes.length ? normTimes.reduce((a, b) => a + b, 0) / normTimes.length : 0,
    avgSkillMatchMs: matchTimes.length ? matchTimes.reduce((a, b) => a + b, 0) / matchTimes.length : 0,
    avgExecutionMs: execTimes.length ? execTimes.reduce((a, b) => a + b, 0) / execTimes.length : totalElapsed / STRESS_QUERIES.length,
    errors,
  };
}

/** Phase 3.8: Voice edge case simulation. __DEV__ only. Tests transcript dedup + phrase collapse. */
export interface VoiceEdgeCaseResult {
  name: string;
  inputChunks: string[];
  accumulated: string;
  collapsed: string;
  normalized: string;
  collapseWorked: boolean;
  msToFinalize: number;
}

export function simulateVoiceEdgeCases(): VoiceEdgeCaseResult[] {
  if (!__DEV__) return [];

  const SILENCE_MS = 300;
  const results: VoiceEdgeCaseResult[] = [];
  const now = () => performance.now();

  const run = (
    name: string,
    chunks: string[],
    options?: { skipDedup?: boolean }
  ): VoiceEdgeCaseResult => {
    const start = now();
    let accumulated = '';
    let lastChunk = '';

    for (const chunk of chunks) {
      if (!options?.skipDedup && chunk === lastChunk) continue;
      lastChunk = chunk;
      accumulated += chunk;
    }

    const collapsed = collapseRepeatedPhrase(accumulated);
    const normalized = normalizeTranscript(collapsed);
    const collapseWorked = collapsed.length < accumulated.length;
    const msToFinalize = Math.round(now() - start + SILENCE_MS);

    return {
      name,
      inputChunks: chunks,
      accumulated: accumulated.trim(),
      collapsed,
      normalized,
      collapseWorked,
      msToFinalize,
    };
  };

  results.push(
    run('Rapid identical chunks', ['hello', 'hello', 'hello', ' world']),
    run('Rapid alternating chunks', ['how ', 'are ', 'you ', 'how ', 'are ', 'you']),
    run(
      'Long 20+ word sentence',
      [
        'The quick brown fox jumps over the lazy dog and then runs back again through the field.',
      ]
    ),
    run('Repeating phrase', ['can you tell me how ', 'can you tell me'])
  );

  console.log('[CEEBO Dev] simulateVoiceEdgeCases results:', results);
  return results;
}
