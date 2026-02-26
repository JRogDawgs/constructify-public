/**
 * CEEBO — Training Hub Index (Phase 2)
 *
 * Structured mapping of feature/route → doc reference.
 * Defensive guards prevent crash on malformed catalog entries.
 */

import { TRAINING_CATALOG } from '@/app/dashboard/admin/training/trainingCatalog';
import type { CategorizedTrainingEntry } from '@/app/dashboard/admin/training/types';

/** Map route (normalized) → pageKey */
const ROUTE_TO_PAGE_KEY = new Map<string, string>();

/** Map pageKey → entry (for validation) */
const PAGE_KEY_TO_ENTRY = new Map<string, CategorizedTrainingEntry>();

function normalizeRoute(r: string): string {
  return (r && typeof r === 'string' ? r : '').replace(/\/$/, '').toLowerCase() || '/';
}

function buildIndex(): void {
  const catalog = TRAINING_CATALOG;
  if (!catalog || !Array.isArray(catalog)) return;

  for (const entry of catalog) {
    if (!entry || typeof entry !== 'object') continue;
    const pageKey = entry.pageKey;
    if (!pageKey || typeof pageKey !== 'string') continue;
    PAGE_KEY_TO_ENTRY.set(pageKey, entry);
    const routes = entry.relatedRoutes;
    if (!Array.isArray(routes)) continue;
    for (const route of routes) {
      if (route == null || typeof route !== 'string') continue;
      const norm = normalizeRoute(route);
      if (norm && !ROUTE_TO_PAGE_KEY.has(norm)) {
        ROUTE_TO_PAGE_KEY.set(norm, pageKey);
      }
    }
  }
}

try {
  buildIndex();
} catch (err) {
  if (__DEV__) console.warn('[CEEBO][TrainingHub] Index build failed, using empty index:', err);
}

/**
 * Phase 2: Check if a route has Training Hub documentation.
 */
export function validateFeatureExists(route: string): boolean {
  if (!route || typeof route !== 'string') return false;
  const norm = normalizeRoute(route.split('?')[0]);
  if (ROUTE_TO_PAGE_KEY.has(norm)) return true;
  for (const [key] of ROUTE_TO_PAGE_KEY) {
    if (norm.startsWith(key) || key.startsWith(norm)) return true;
  }
  return false;
}

/**
 * Phase 2: Check if pageKey exists in Training Hub.
 */
export function validatePageKeyExists(pageKey: string): boolean {
  return !!pageKey && PAGE_KEY_TO_ENTRY.has(pageKey);
}

/** Get doc entry by pageKey. Safe — returns undefined if missing. */
export function getTrainingEntry(pageKey: string): CategorizedTrainingEntry | undefined {
  if (!pageKey || typeof pageKey !== 'string') return undefined;
  return PAGE_KEY_TO_ENTRY.get(pageKey);
}

/** Get pageKey for route (if any). Safe accessor — never throws. */
export function getPageKeyForRoute(route: string): string | null {
  if (!route || typeof route !== 'string') return null;
  try {
    const norm = normalizeRoute(route.split('?')[0]);
    const pageKey = ROUTE_TO_PAGE_KEY.get(norm);
    if (!pageKey || typeof pageKey !== 'string') {
      if (__DEV__) console.warn('[CEEBO][TrainingHub] Missing pageKey for route:', route);
      return null;
    }
    return pageKey;
  } catch {
    if (__DEV__) console.warn('[CEEBO][TrainingHub] getPageKeyForRoute failed for route:', route);
    return null;
  }
}
