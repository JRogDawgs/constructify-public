/**
 * CEEBO — Lightweight string similarity (Phase 1.5)
 *
 * Levenshtein-based. O(m*n) per pair. Threshold 0.82.
 */

export function levenshteinSimilarity(a: string, b: string): number {
  if (a === b) return 1;
  if (!a || !b) return 0;
  const lenA = a.length;
  const lenB = b.length;
  const maxLen = Math.max(lenA, lenB);
  const dist = levenshteinDistance(a, b);
  return 1 - dist / maxLen;
}

function levenshteinDistance(a: string, b: string): number {
  const lenA = a.length;
  const lenB = b.length;
  const dp: number[] = Array(lenB + 1);
  for (let j = 0; j <= lenB; j++) dp[j] = j;

  for (let i = 1; i <= lenA; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= lenB; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      const curr = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + cost);
      prev = dp[j];
      dp[j] = curr;
    }
  }
  return dp[lenB];
}
