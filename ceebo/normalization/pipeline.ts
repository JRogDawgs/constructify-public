/**
 * CEEBO — Normalization pipeline
 *
 * Order: trim → accents → corrections → lang detection → slang → final
 */

import { removeDiacritics } from './removeDiacritics';
import { applyCorrectionPatterns } from './correctionPatterns';
import { normalizeSlang } from './normalizeSlang';
import { detectLanguage } from '../language';

export interface NormalizationTrace {
  raw: string;
  afterAccentRemoval: string;
  afterSlangNormalization: string;
  finalNormalized: string;
  detectedLanguage: 'en' | 'es';
}

export function normalizeInput(raw: string): { normalized: string; trace: NormalizationTrace } {
  const trimmed = raw.trim().replace(/\s+/g, ' ');
  const afterAccentRemoval = removeDiacritics(trimmed);
  const afterCorrections = applyCorrectionPatterns(afterAccentRemoval);
  const { language: detectedLang } = detectLanguage(afterCorrections);
  const afterSlang = normalizeSlang(afterCorrections, detectedLang);
  const finalNormalized = afterSlang.toLowerCase();

  return {
    normalized: finalNormalized,
    trace: {
      raw: trimmed,
      afterAccentRemoval: afterAccentRemoval.toLowerCase(),
      afterSlangNormalization: afterSlang,
      finalNormalized,
      detectedLanguage: detectedLang,
    },
  };
}
