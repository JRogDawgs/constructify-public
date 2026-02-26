/**
 * CEEBO — Routing Validation Test Harness (Phase 4.4 + 4.6)
 *
 * Internal test infrastructure. __DEV__ only.
 * Validates: Tier 1 lock, Tier 2/3 skills, Knowledge mode, Role gating, Domain boundary.
 * Phase 4.6: Synonyms, ambiguous phrasing, low confidence, mixed phrasing.
 */

import { orchestrate } from '../aiOrchestrator';
import type { OrchestratorUserContext } from '../aiOrchestrator';

const PATHNAME = '/dashboard';
const SYSTEM_PROMPT = '';

interface TestCase {
  role: 'worker' | 'supervisor' | 'admin';
  query: string;
  /** Expect Tier 1 transformation or knowledge mode */
  expectedMode?: 'tier1' | 'knowledge';
  /** Expect specific skill matched */
  expectedSkill?: string;
  /** Expect blocked with reason */
  expectedBlocked?: 'INSUFFICIENT_ROLE' | 'OUT_OF_SCOPE';
  /** Expect Training Hub fallback (no skill, not blocked) */
  expectedTrainingHub?: boolean;
}

const TEST_CASES: TestCase[] = [
  /* Original 6 */
  { role: 'worker', query: 'Translate this to Spanish: hello', expectedMode: 'tier1' },
  { role: 'worker', query: 'Create a task', expectedBlocked: 'INSUFFICIENT_ROLE' },
  { role: 'admin', query: 'Create a task', expectedSkill: 'create_task_draft' },
  { role: 'worker', query: 'Do I need to complete my profile?', expectedMode: 'knowledge' },
  { role: 'worker', query: 'What is the capital of France?', expectedBlocked: 'OUT_OF_SCOPE' },
  { role: 'worker', query: 'Go to tasks', expectedSkill: 'navigate_to_tasks' },
  /* Phase 4.6: Synonyms */
  { role: 'worker', query: 'Show my assignments', expectedSkill: 'navigate_to_tasks' },
  { role: 'worker', query: 'View my work items', expectedSkill: 'navigate_to_tasks' },
  { role: 'admin', query: 'I want to add work', expectedSkill: 'create_task_draft' },
  { role: 'worker', query: 'Take me to jobsite', expectedSkill: 'navigate_to_projects' },
  { role: 'admin', query: 'Create a new job', expectedSkill: 'create_task_draft' },
  { role: 'worker', query: 'Open the build', expectedSkill: 'navigate_to_projects' },
  /* Phase 4.6: Mixed / partial phrasing */
  { role: 'worker', query: 'How do I update my account info?', expectedMode: 'knowledge' },
  { role: 'worker', query: 'assignments for today', expectedSkill: 'navigate_to_tasks' },
  { role: 'worker', query: 'My calendar', expectedTrainingHub: true },
  { role: 'worker', query: 'Start my shift', expectedTrainingHub: true },
  /* Phase B: Mixed intent, ambiguous, role edge, out-of-scope disguised, long instruction */
  { role: 'worker', query: 'Create a task and translate this', expectedMode: 'tier1' },
  { role: 'worker', query: 'What about tasks?', expectedMode: 'knowledge' },
  { role: 'worker', query: 'Assign a task to John', expectedBlocked: 'INSUFFICIENT_ROLE' },
  { role: 'worker', query: 'What is the total market share of construction management software?', expectedBlocked: 'OUT_OF_SCOPE' },
  {
    role: 'admin',
    query: 'I need to create a new task for the roofing project, assign it to the foreman, set it as high priority, and make sure it shows up on the schedule',
    expectedSkill: 'create_task_draft',
  },
];

/** Phase 4.4: Run routing test harness. __DEV__ only. */
export function runRoutingTests(): { passed: number; failed: number; results: Array<{ query: string; role: string; pass: boolean; detail: string }> } {
  const results: Array<{ query: string; role: string; pass: boolean; detail: string }> = [];
  let passed = 0;
  let failed = 0;

  for (const test of TEST_CASES) {
    const userContext: OrchestratorUserContext = {
      userId: 'dev-test',
      role: test.role,
      companyId: 'dev-company',
    };

    const result = orchestrate(test.query, PATHNAME, SYSTEM_PROMPT, userContext);

    const actualSkill = result.matchedSkill?.skill.id;
    const actualBlocked = result.blocked;
    const actualReason = result.reason;
    const isKnowledgeMode = result.debug?.knowledgeMode === true;
    const isTier1 = result.debug?.intent === 'translate' && result.debug?.retrievedDocs && !result.matchedSkill;
    const isTrainingHub = !result.matchedSkill && !actualBlocked && Boolean(result.response);

    let pass = false;
    let detail = '';

    if (test.expectedMode === 'tier1') {
      pass = Boolean(isTier1);
      detail = pass ? 'Tier 1 locked' : `Expected tier1, got skill=${actualSkill ?? 'none'} blocked=${actualBlocked}`;
    } else if (test.expectedMode === 'knowledge') {
      pass = isKnowledgeMode && !actualBlocked;
      detail = pass ? 'Knowledge mode' : `Expected knowledge, got skill=${actualSkill ?? 'none'} blocked=${actualBlocked}`;
    } else if (test.expectedBlocked) {
      pass = actualBlocked === true && actualReason === test.expectedBlocked;
      detail = pass ? `Blocked: ${actualReason}` : `Expected blocked ${test.expectedBlocked}, got blocked=${actualBlocked} reason=${actualReason}`;
    } else if (test.expectedSkill) {
      pass = actualSkill === test.expectedSkill;
      detail = pass ? `Skill: ${actualSkill}` : `Expected skill ${test.expectedSkill}, got ${actualSkill ?? 'none'}`;
    } else if (test.expectedTrainingHub) {
      pass = isTrainingHub;
      detail = pass ? 'Training Hub fallback' : `Expected Training Hub, got skill=${actualSkill ?? 'none'} blocked=${actualBlocked}`;
    }

    if (pass) passed++;
    else failed++;

    results.push({ query: test.query, role: test.role, pass, detail });

    if (__DEV__) {
      console.log('[CEEBO_TEST] query:', test.query);
      console.log('[CEEBO_TEST] role:', test.role);
      console.log('[CEEBO_TEST] result:', { actualSkill, actualBlocked, actualReason, isKnowledgeMode, isTier1 });
      console.log('[CEEBO_TEST]', pass ? 'PASS' : 'FAIL', '-', detail);
    }
  }

  /* Phase 4.6: Regression summary + Phase B final audit */
  if (__DEV__) {
    console.log('[CEEBO_TEST] ——— SUMMARY ———');
    console.log('[CEEBO_TEST] passed:', passed);
    console.log('[CEEBO_TEST] failed:', failed);
    if (failed > 0) {
      console.error('[CEEBO_REGRESSION] FAILURES DETECTED');
    } else {
      console.log('[CEEBO_REGRESSION] ALL TESTS PASS');
      console.log('[CEEBO_FINAL_AUDIT] all tests passed');
    }
  }

  return { passed, failed, results };
}
