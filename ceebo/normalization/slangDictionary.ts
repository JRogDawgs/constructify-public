/**
 * CEEBO — Lightweight slang normalization (Phase 1.5)
 *
 * Token-aware. Keep small + extensible.
 */

/** English slang → canonical form */
export const SLANG_EN: Record<string, string> = {
  wanna: 'want to',
  gonna: 'going to',
  proj: 'project',
  projs: 'projects',
  proyects: 'projects',
  pls: 'please',
  'task thing': 'task builder',
  thx: 'thanks',
  u: 'you',
  r: 'are',
  ur: 'your',
};

/** Spanish slang → canonical form */
export const SLANG_ES: Record<string, string> = {
  proyec: 'proyecto',
  proyects: 'proyectos',
  proj: 'proyecto',
  pa: 'para',
  q: 'que',
  'hacer un proj': 'crear proyecto',
  pls: 'por favor',
};

export function getSlangDictionary(lang: 'en' | 'es'): Record<string, string> {
  return lang === 'es' ? SLANG_ES : SLANG_EN;
}
