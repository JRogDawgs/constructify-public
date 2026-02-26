/**
 * CEEBO — Token-aware slang normalization
 *
 * Replaces slang tokens via dictionary. Does not naive global replace.
 */

import { SLANG_EN, SLANG_ES } from './slangDictionary';

function tokenize(text: string): string[] {
  return text.toLowerCase().split(/\s+/).filter(Boolean);
}

/** Check for multi-word phrases (longest first) */
function getPhraseReplacements(lang: 'en' | 'es'): Array<{ from: string; to: string }> {
  const dict = lang === 'es' ? SLANG_ES : SLANG_EN;
  return Object.entries(dict)
    .filter(([k]) => k.includes(' '))
    .sort((a, b) => b[0].length - a[0].length)
    .map(([from, to]) => ({ from: from.toLowerCase(), to }));
}

/** Single-word replacements */
function getWordReplacements(lang: 'en' | 'es'): Record<string, string> {
  const dict = lang === 'es' ? SLANG_ES : SLANG_EN;
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(dict)) {
    if (!k.includes(' ')) out[k.toLowerCase()] = v.toLowerCase();
  }
  return out;
}

/**
 * Normalize slang. Token-aware.
 * Lang hint: use 'en' when unknown (can run pre-detection).
 */
export function normalizeSlang(text: string, lang: 'en' | 'es' = 'en'): string {
  if (!text.trim()) return text;
  let result = text.toLowerCase();

  const phrases = getPhraseReplacements(lang);
  for (const { from, to } of phrases) {
    result = result.replace(new RegExp(`\\b${from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi'), to);
  }

  const words = getWordReplacements(lang);
  const tokens = tokenize(result);
  const out = tokens.map((t) => words[t] ?? t);
  return out.join(' ');
}
