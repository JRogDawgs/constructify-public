/**
 * CEEBO — Skill Matcher (Phase 1.5 + Phase 4.0)
 *
 * Exact keyword match first. Fuzzy fallback (≥0.82) only if no exact match.
 * Never fuzzy for mutation skills.
 * Phase 4.0: Tier priority (2 > 3), routing score (+3 explicit, +2 verb, +1 contextual, -2 contradicting).
 */

import type { Skill, SkillExecutionContext, SkillMatchResult, AmbiguousMatchResult } from './types';
import { getSkillsForContext } from './skillRegistry';
import { levenshteinSimilarity } from './stringSimilarity';
import {
  getSkillTier,
  computeRoutingScore,
  hasStrongVerbMatch,
  hasExplicitCommandPhrase,
} from '../intentRouter';

const FUZZY_THRESHOLD = 0.82;
/** Phase 1.75: Fuzzy matches below this do not execute; fall back to Training Hub */
const FUZZY_EXECUTION_MIN = 0.85;
const MUTATION_SKILL_IDS = new Set(['create_project_draft', 'create_task_draft']);

function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function exactMatch(qt: string, kw: string): boolean {
  return qt === kw || kw.includes(qt) || qt.includes(kw);
}

function scoreExact(queryTokens: string[], keywords: string[]): number {
  if (keywords.length === 0) return 0;
  let hits = 0;
  const kwLower = keywords.map((k) => k.toLowerCase());
  for (const qt of queryTokens) {
    for (const kw of kwLower) {
      if (exactMatch(qt, kw)) {
        hits += 1;
        break;
      }
    }
  }
  const coverage = hits / keywords.length;
  const queryCoverage = hits / Math.max(1, queryTokens.length);
  return (coverage + queryCoverage) / 2;
}

function scoreFuzzy(
  queryTokens: string[],
  keywords: string[]
): { score: number; minSim: number } {
  if (keywords.length === 0) return { score: 0, minSim: 0 };
  let hits = 0;
  let minSim = 1;
  const kwLower = keywords.map((k) => k.toLowerCase());

  for (const qt of queryTokens) {
    if (qt.length < 2) continue;
    for (const kw of kwLower) {
      if (kw.length < 3) continue;
      const sim = levenshteinSimilarity(qt, kw);
      if (sim >= FUZZY_THRESHOLD) {
        hits += 1;
        minSim = Math.min(minSim, sim);
        break;
      }
    }
  }

  const coverage = hits / keywords.length;
  const queryCoverage = hits / Math.max(1, queryTokens.length);
  const score = (coverage + queryCoverage) / 2;
  return { score: Math.min(1, score * 0.95), minSim: hits > 0 ? minSim : 0 };
}

/** Phase 1.75: Set when fuzzy match blocked due to low confidence */
let lastBlockedReason: string | null = null;
/** Phase 1.9: Best blocked skill for clarifying question */
let lastBlockedSkill: Skill | null = null;

export function getLastBlockedReason(): string | null {
  const r = lastBlockedReason;
  lastBlockedReason = null;
  return r;
}

export function getLastBlockedSkill(): Skill | null {
  const s = lastBlockedSkill;
  lastBlockedSkill = null;
  return s;
}

function getRoutingScore(
  query: string,
  skillId: string,
  keywords: string[],
  lang: 'en' | 'es',
  pathname: string
): number {
  const tier = getSkillTier(skillId);
  const pathMatches = pathname.length > 0;
  return computeRoutingScore({
    query,
    skillId,
    hasExplicitCommandPhrase: hasExplicitCommandPhrase(query, keywords, lang),
    hasStrongVerbMatch: hasStrongVerbMatch(query, lang),
    hasContextualRelevance: pathMatches,
    lang,
  });
}

/** Phase 4.6: Skill labels for clarification options */
const SKILL_LABELS: Record<string, { en: string; es: string }> = {
  create_task_draft: { en: 'Create task', es: 'Crear tarea' },
  create_project_draft: { en: 'Create project', es: 'Crear proyecto' },
  navigate_to_tasks: { en: 'View tasks', es: 'Ver tareas' },
  navigate_to_projects: { en: 'View projects', es: 'Ver proyectos' },
  open_task_builder: { en: 'Open Task Builder', es: 'Abrir Task Builder' },
};

function selectBest(
  candidates: Array<{
    skill: Skill;
    baseScore: number;
    actionPlan: ReturnType<Skill['execute']>;
    routingScore: number;
    isFuzzy?: boolean;
    fuzzySim?: number;
  }>,
  lang: 'en' | 'es'
): SkillMatchResult | AmbiguousMatchResult | null {
  if (candidates.length === 0) return null;

  candidates.sort((a, b) => {
    const tierA = getSkillTier(a.skill.id);
    const tierB = getSkillTier(b.skill.id);
    if (tierA !== tierB) return tierA - tierB;
    const scoreA = a.baseScore * 10 + a.routingScore;
    const scoreB = b.baseScore * 10 + b.routingScore;
    return scoreB - scoreA;
  });

  /* Phase 4.6: Ambiguity detection — top 2 within 1 point */
  if (candidates.length >= 2) {
    const combined = (c: (typeof candidates)[0]) => c.baseScore * 10 + c.routingScore;
    const score0 = combined(candidates[0]);
    const score1 = combined(candidates[1]);
    if (Math.abs(score0 - score1) <= 1) {
      const options = candidates.slice(0, 3).map((c) => {
        const lbl = SKILL_LABELS[c.skill.id];
        return lbl ? (lang === 'es' ? lbl.es : lbl.en) : c.skill.id;
      });
      return { needsClarification: true, clarificationOptions: options };
    }
  }

  const c = candidates[0];
  return {
    skill: c.skill,
    confidence: Math.min(1, c.baseScore + c.routingScore / 10),
    actionPlan: c.actionPlan,
    isFuzzyMatch: c.isFuzzy,
    fuzzySimilarity: c.fuzzySim,
  };
}

/** Match skills. Phase 4.0: Tier priority, routing score. */
export function matchSkill(
  query: string,
  ctx: SkillExecutionContext,
  minConfidence = 0.35
): SkillMatchResult | AmbiguousMatchResult | null {
  lastBlockedReason = null;
  const normalized = query.trim();
  if (!normalized) return null;

  const tokens = tokenize(normalized);
  const candidates = getSkillsForContext(ctx);
  const lang = (ctx.language ?? 'en') as 'en' | 'es';
  const pathname = ctx.pathname ?? '';

  const exactMatches: Array<{
    skill: Skill;
    baseScore: number;
    actionPlan: ReturnType<Skill['execute']>;
    routingScore: number;
  }> = [];

  for (const skill of candidates) {
    const kw =
      lang === 'es' && skill.intentTriggers.keywordsEs?.length
        ? skill.intentTriggers.keywordsEs
        : skill.intentTriggers.keywords;

    const exactScore = scoreExact(tokens, kw);
    if (exactScore >= minConfidence) {
      const actionPlan = skill.execute(ctx);
      const routingScore = getRoutingScore(normalized, skill.id, kw, lang, pathname);
      exactMatches.push({
        skill,
        baseScore: exactScore,
        actionPlan,
        routingScore,
      });
    }
  }

  const bestExact = selectBest(exactMatches, lang);
  if (bestExact) {
    if ('needsClarification' in bestExact) {
      if (__DEV__) console.log('[CEEBO_ROUTER] ambiguous — needs clarification:', bestExact.clarificationOptions);
      return bestExact;
    }
    if (__DEV__) {
      console.log('[CEEBO_ROUTER] selected skill:', bestExact.skill.id);
    }
    return bestExact;
  }

  let bestBlocked: { skill: Skill; score: number } | null = null;

  const fuzzyMatches: Array<{
    skill: Skill;
    baseScore: number;
    actionPlan: ReturnType<Skill['execute']>;
    routingScore: number;
    isFuzzy?: boolean;
    fuzzySim?: number;
  }> = [];

  for (const skill of candidates) {
    if (MUTATION_SKILL_IDS.has(skill.id)) continue;

    const kw =
      lang === 'es' && skill.intentTriggers.keywordsEs?.length
        ? skill.intentTriggers.keywordsEs
        : skill.intentTriggers.keywords;

    const { score, minSim } = scoreFuzzy(tokens, kw);
    if (score < minConfidence || minSim < FUZZY_THRESHOLD) continue;
    if (score < FUZZY_EXECUTION_MIN) {
      lastBlockedReason = `Execution blocked — low confidence (${(score * 100).toFixed(0)}% < 85%)`;
      if (!bestBlocked || score > bestBlocked.score) {
        bestBlocked = { skill, score };
      }
      continue;
    }

    const actionPlan = skill.execute(ctx);
    const routingScore = getRoutingScore(normalized, skill.id, kw, lang, pathname);
    fuzzyMatches.push({
      skill,
      baseScore: score,
      actionPlan,
      routingScore,
      isFuzzy: true,
      fuzzySim: minSim,
    });
  }

  const best = selectBest(fuzzyMatches, lang);
  if (best !== null) {
    if ('needsClarification' in best) {
      lastBlockedReason = null;
      lastBlockedSkill = null;
      if (__DEV__) console.log('[CEEBO_ROUTER] ambiguous — needs clarification:', best.clarificationOptions);
      return best;
    }
    lastBlockedReason = null;
    lastBlockedSkill = null;
    if (__DEV__) {
      console.log('[CEEBO_ROUTER] selected skill:', best.skill.id, '(fuzzy)');
    }
    return best;
  }
  lastBlockedSkill = bestBlocked?.skill ?? null;
  return best;
}
