/**
 * CEEBO — Skill Executor (Phase 2)
 *
 * Hard fail-safe for mutations. Route validation before navigation.
 * Never navigate to unknown route.
 */

import type { ActionPlan } from './types';
import { executeNavigation } from './navigationBridge';
import { validateRouteExists } from '../routeRegistry';

export type SkillExecutorResult =
  | { ok: true; executed: boolean }
  | { ok: false; reason: string };

/**
 * Execute an approved action plan.
 * - navigation: validates route, then triggers expo-router push (debounce + route guard)
 * - mutation: Phase 1 HARD BLOCK — never execute
 * - instruction: no-op for Phase 1
 */
export function executeActionPlan(plan: ActionPlan): SkillExecutorResult {
  switch (plan.type) {
    case 'navigation':
      if (!plan.targetRoute) return { ok: true, executed: false };
      if (!validateRouteExists(plan.targetRoute)) {
        if (__DEV__) console.warn('[CEEBO] Blocked navigation to unregistered route:', plan.targetRoute);
        return { ok: true, executed: false };
      }
      const navOk = executeNavigation(plan);
      return { ok: true, executed: navOk };

    case 'mutation':
      return { ok: true, executed: false };

    case 'instruction':
      return { ok: true, executed: true };

    default:
      return { ok: false, reason: `Unknown plan type: ${(plan as ActionPlan).type}` };
  }
}
