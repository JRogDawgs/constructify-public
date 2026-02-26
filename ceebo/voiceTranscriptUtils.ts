/**
 * CEEBO — Voice transcript utilities (Phase 3.9)
 *
 * Shared logic for transcript processing. Used by useCeeboSpeech and dev simulations.
 */

/** Collapse repeated 3–6 word phrase blocks. O(n). */
export function collapseRepeatedPhrase(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length < 6) return text;
  for (let w = 6; w >= 3; w -= 1) {
    if (words.length < w * 2) continue;
    const tail = words.slice(-w).join(' ').toLowerCase();
    const rest = words.slice(0, -w).join(' ').toLowerCase();
    if (rest.endsWith(tail)) {
      return words.slice(0, -w).join(' ');
    }
  }
  return text;
}

/**
 * Phase 3.9.1: Normalize transcript — trim, collapse spaces, remove word repetition, stutter, trailing fragment.
 * O(n).
 * Example: "can can you you tell tell" → "can you tell"
 */
const PUNCTUATION_END = /[.!?,\-:;]$/;

export function normalizeTranscript(raw: string): string {
  let s = raw.trim().replace(/\s+/g, ' ').trim();
  if (!s) return '';

  const words = s.split(' ').filter(Boolean);
  const out: string[] = [];

  for (let i = 0; i < words.length; i += 1) {
    const w = words[i];
    if (!w) continue;
    const wLower = w.toLowerCase();

    if (i > 0 && wLower === words[i - 1]?.toLowerCase()) continue;

    if (i >= 2 && i + 1 < words.length && wLower === words[i - 2]?.toLowerCase() && words[i + 1]?.toLowerCase() === words[i - 1]?.toLowerCase()) continue;

    if (i > 2 && wLower === words[i - 2]?.toLowerCase() && words[i - 1]?.toLowerCase() === words[i - 3]?.toLowerCase()) continue;

    out.push(w);
  }

  s = out.join(' ').trim();

  if (s.length > 2 && !PUNCTUATION_END.test(s)) {
    const last = out[out.length - 1] ?? '';
    if (last.length === 1 && /^[a-z]$/i.test(last) && last.toLowerCase() !== 'i' && last.toLowerCase() !== 'a') {
      out.pop();
      s = out.join(' ').trim();
    }
  }

  if (s.length > 0) s = s[0].toUpperCase() + s.slice(1);
  return s;
}
