/**
 * CEEBO — Navigation Bridge (Phase 1.75)
 *
 * Route guard + 250ms debounce. No double push.
 */

import type { ActionPlan } from './types';

export type NavigateFn = (path: string) => void;
export type GetCurrentPathFn = () => string;

const NAV_DEBOUNCE_MS = 250;

let navigateRef: NavigateFn | null = null;
let getCurrentPathRef: GetCurrentPathFn | null = null;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let pendingTarget: string | null = null;

function normalizePath(p: string): string {
  return p.replace(/\/$/, '') || '/';
}

/** Register router push and path getter. Call from CeeboChat/Provider. */
export function registerNavigationBridge(
  fn: NavigateFn,
  getPath?: GetCurrentPathFn
): () => void {
  navigateRef = fn;
  getCurrentPathRef = getPath ?? (() => '/');
  return () => {
    navigateRef = null;
    getCurrentPathRef = null;
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }
    pendingTarget = null;
  };
}

/** Execute navigation. Called by SkillExecutor only. Debounced 250ms. */
export function executeNavigation(plan: ActionPlan): boolean {
  if (plan.type !== 'navigation' || !plan.targetRoute) return false;

  const fn = navigateRef;
  if (!fn) {
    if (__DEV__) console.warn('[CEEBO] NavigationBridge not registered');
    return false;
  }

  const target = normalizePath(plan.targetRoute);
  const current = normalizePath(getCurrentPathRef?.() ?? '/');

  if (current === target) return false;

  pendingTarget = plan.targetRoute;

  if (debounceTimer) return true;

  debounceTimer = setTimeout(() => {
    debounceTimer = null;
    const toNav = pendingTarget;
    pendingTarget = null;
    if (!toNav) return;
    const cur = normalizePath(getCurrentPathRef?.() ?? '/');
    if (cur === normalizePath(toNav)) return;
    try {
      fn(toNav);
    } catch (e) {
      if (__DEV__) console.error('[CEEBO] Navigation failed:', e);
    }
  }, NAV_DEBOUNCE_MS);

  return true;
}
