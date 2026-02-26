/**
 * CEEBO — Lightweight language detection (Phase 1)
 *
 * Heuristic: Spanish stopwords + character patterns.
 * No LLM. No external APIs. Launch-safe.
 */

export type DetectedLanguage = 'en' | 'es';

/** Common Spanish words (unaccented for post-removeDiacritics input) */
const SPANISH_INDICATORS = [
  'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas',
  'de', 'del', 'al', 'a', 'en', 'con', 'por', 'para',
  'que', 'como', 'donde', 'cuando', 'cual', 'cuales',
  'quiero', 'necesito', 'puedo', 'pa', 'q',
  'proyectos', 'proyecto', 'tareas', 'tarea', 'crear',
  'nuevo', 'nueva', 'ir', 'ver', 'mostrar', 'abrir',
  'asignar', 'trabajador', 'trabajadores', 'empleado',
  'configuracion', 'ajustes', 'empresa', 'horario',
  'informe', 'informes', 'reporte', 'reportes',
];

/** Spanish-specific chars (optional boost; may be removed by removeDiacritics) */
const SPANISH_CHARS = /[áéíóúñü¿¡]/;

export interface LanguageDetectionResult {
  language: DetectedLanguage;
  confidence: number;
}

/**
 * Detect language from normalized user input.
 * Returns 'es' only when Spanish indicators outweigh default.
 */
export function detectLanguage(input: string): LanguageDetectionResult {
  const trimmed = input.trim();
  if (!trimmed) return { language: 'en', confidence: 0 };

  const lower = trimmed.toLowerCase();
  const tokens = lower.replace(/[^\w\sáéíóúñü]/g, ' ').split(/\s+/).filter(Boolean);

  let spanishScore = 0;
  let totalScore = 0;

  for (const token of tokens) {
    totalScore += 1;
    if (SPANISH_INDICATORS.includes(token)) spanishScore += 1;
    if (SPANISH_CHARS.test(token)) spanishScore += 0.5;
  }

  const ratio = totalScore > 0 ? spanishScore / totalScore : 0;
  const hasSpanishChars = SPANISH_CHARS.test(trimmed);

  if (ratio >= 0.25 || (hasSpanishChars && ratio >= 0.15)) {
    return {
      language: 'es',
      confidence: Math.min(1, ratio + (hasSpanishChars ? 0.2 : 0)),
    };
  }

  return { language: 'en', confidence: 1 - ratio };
}
