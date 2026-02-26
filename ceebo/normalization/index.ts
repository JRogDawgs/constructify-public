/**
 * CEEBO — Input normalization (Phase 1.5)
 *
 * Accent removal, slang, voice corrections.
 */

export { removeDiacritics } from './removeDiacritics';
export { normalizeSlang } from './normalizeSlang';
export { applyCorrectionPatterns } from './correctionPatterns';
export { SLANG_EN, SLANG_ES } from './slangDictionary';
export { normalizeInput } from './pipeline';
export type { NormalizationTrace } from './pipeline';
