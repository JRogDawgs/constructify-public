/**
 * CEEBO — Accent/diacritic removal
 *
 * NFD Unicode normalization + strip combining marks.
 * "proyéctos" → "proyectos", "niño" → "nino"
 */

export function removeDiacritics(text: string): string {
  if (!text) return text;
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}
