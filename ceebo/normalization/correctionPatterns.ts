/**
 * CEEBO — Voice transcription error recovery (Phase 1.5)
 *
 * Common speech recognition fixes.
 * Order matters: longer phrases first.
 */

export interface CorrectionPattern {
  pattern: RegExp | string;
  replacement: string;
}

/** English voice errors */
const CORRECTIONS_EN: CorrectionPattern[] = [
  { pattern: /\bclock me in\b/i, replacement: 'clock in' },
  { pattern: /\bbuild me a project\b/i, replacement: 'create project' },
  { pattern: /\bclock me out\b/i, replacement: 'clock out' },
  { pattern: /\bgo to the projects\b/i, replacement: 'go to projects' },
  { pattern: /\bshow the projects\b/i, replacement: 'show projects' },
  { pattern: /\btask builder\b/i, replacement: 'task builder' },
];

/** Spanish voice errors */
const CORRECTIONS_ES: CorrectionPattern[] = [
  { pattern: /\basignar un proyesto\b/i, replacement: 'asignar un proyecto' },
  { pattern: /\bproyesto\b/gi, replacement: 'proyecto' },
  { pattern: /\bproyestos\b/gi, replacement: 'proyectos' },
  { pattern: /\breloj en\b/i, replacement: 'clock in' },
  { pattern: /\breloj\b/i, replacement: 'clock' },
  { pattern: /\bcrear proyec\b/i, replacement: 'crear proyecto' },
];

/** Apply both EN and ES patterns (non-overlapping; safe pre-lang) */
export function applyCorrectionPatterns(text: string): string {
  if (!text.trim()) return text;
  let result = text;
  for (const { pattern, replacement } of [...CORRECTIONS_EN, ...CORRECTIONS_ES]) {
    result = result.replace(pattern, replacement);
  }
  return result;
}
