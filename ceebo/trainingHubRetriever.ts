/**
 * CEEBO — Training Hub document retrieval
 *
 * Searches TRAINING_CATALOG by query. Used to ground AI responses.
 */

import { TRAINING_CATALOG } from '@/app/dashboard/admin/training/trainingCatalog';
import type { CategorizedTrainingEntry } from '@/app/dashboard/admin/training/types';
import type { RetrievedDoc } from './ceebo.types';

const SEARCHABLE_FIELDS = ['pageTitle', 'description', 'longFormGuidance'] as const;

function tokenize(text: string): string[] {
  return text.toLowerCase().split(/\s+/).filter(Boolean);
}

function scoreEntry(entry: CategorizedTrainingEntry, queryTokens: string[]): number {
  if (queryTokens.length === 0) return 0;
  let score = 0;
  for (const field of SEARCHABLE_FIELDS) {
    const value = (entry[field] ?? '').toLowerCase();
    const tokens = tokenize(value);
    for (const qt of queryTokens) {
      if (tokens.some((t) => t.includes(qt) || qt.includes(t))) score += 1;
      if (value.includes(qt)) score += 2;
    }
  }
  return score;
}

export function searchTrainingHub(query: string, limit = 5): RetrievedDoc[] {
  const trimmed = query.trim();
  if (!trimmed) return [];
  const tokens = tokenize(trimmed);
  const catalog = Array.isArray(TRAINING_CATALOG) ? TRAINING_CATALOG : [];
  const scored = catalog
    .filter((entry): entry is CategorizedTrainingEntry => !!entry && typeof entry === 'object')
    .map((entry) => ({
      entry,
      score: scoreEntry(entry, tokens),
    }));
  const filtered = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score);
  return filtered.slice(0, limit).map(({ entry, score }) => ({
    pageTitle: entry.pageTitle ?? '',
    description: entry.description ?? '',
    longFormGuidance: entry.longFormGuidance,
    relatedRoutes: Array.isArray(entry.relatedRoutes) ? entry.relatedRoutes : [],
    score,
  }));
}
