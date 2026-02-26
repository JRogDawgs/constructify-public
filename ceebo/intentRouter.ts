/**
 * CEEBO — Intent Router (Phase 4.0)
 *
 * Skill priority hierarchy + payload isolation.
 * Tier 1 (transformation) > Tier 2 (action) > Tier 3 (navigation).
 * Phase 4.2: Informational question detection → knowledge mode.
 * Phase 4.6: Synonym expansion, confidence score, intent hardening.
 */

/** Phase 4.6: Synonym → canonical keyword. Expands recognition without changing routing logic. */
const SYNONYM_MAP: Record<string, string[]> = {
  profile: ['profile', 'account info', 'my info', 'my details', 'perfil'],
  task: ['task', 'job', 'assignment', 'work item', 'tarea', 'assignments', 'work'],
  schedule: ['schedule', 'calendar', 'shift', 'work time', 'horario', 'programar'],
  clock: ['clock in', 'clock out', 'start work', 'end shift', 'start shift', 'punch in', 'punch out'],
  project: ['project', 'jobsite', 'build', 'site', 'proyecto', 'obra'],
};

/** Phase 4.6: Expand query with canonical keywords for better matching. Does not replace, appends. */
export function expandSynonyms(query: string): string {
  const lower = query.toLowerCase().trim();
  if (!lower) return query;

  const extraTerms: string[] = [];
  for (const [canonical, synonyms] of Object.entries(SYNONYM_MAP)) {
    const hasSynonym = synonyms.some((s) => lower.includes(s.toLowerCase()));
    if (hasSynonym && !lower.includes(canonical)) {
      extraTerms.push(canonical);
    }
  }
  if (extraTerms.length === 0) return query;
  return query + ' ' + extraTerms.join(' ');
}

/** Tier 1: Explicit transformation commands — lock immediately, extract payload */
const TIER1_COMMANDS: { en: RegExp[]; es: RegExp[] } = {
  en: [
    /^translate(?:[^.!?]*\.)?\s*/i,
    /^summarize(?:[^.!?]*\.)?\s*/i,
    /^rewrite(?:[^.!?]*\.)?\s*/i,
    /^explain(?:[^.!?]*\.)?\s*/i,
    /^convert(?:[^.!?]*\.)?\s*/i,
    /^generate(?:[^.!?]*\.)?\s*/i,
    /^translate:\s*/i,
  ],
  es: [
    /^traducir(?:[^.!?]*\.)?\s*/i,
    /^resumir(?:[^.!?]*\.)?\s*/i,
    /^reescribir(?:[^.!?]*\.)?\s*/i,
    /^explicar(?:[^.!?]*\.)?\s*/i,
    /^convertir(?:[^.!?]*\.)?\s*/i,
    /^generar(?:[^.!?]*\.)?\s*/i,
  ],
};

/** Tier 2: Explicit action commands — create, assign, schedule, clock */
const TIER2_SKILL_IDS = new Set([
  'create_task_draft',
  'create_project_draft',
]);

/** Tier 3: Navigation / page helpers */
const TIER3_SKILL_IDS = new Set([
  'navigate_to_tasks',
  'navigate_to_projects',
  'open_task_builder',
]);

/** Strong verb phrases for +2 score */
const STRONG_VERBS: { en: string[]; es: string[] } = {
  en: ['create', 'assign', 'schedule', 'clock in', 'clock out', 'open', 'go to', 'show'],
  es: ['crear', 'asignar', 'programar', 'abrir', 'ir a', 'ver', 'mostrar'],
};

/** Contradicting prefixes for -2 score */
const CONTRADICTING = /\b(?:don't|dont|do not|no |nunca|no )/i;

export interface IntentRouteResult {
  /** True when Tier 1 transformation command detected — skip skill match */
  tier1Locked: boolean;
  /** Extracted payload (text after command phrase). Use for Training Hub, not skill match */
  payload?: string;
  /** Detected transformation command type */
  command?: 'translate' | 'summarize' | 'rewrite' | 'explain' | 'convert' | 'generate';
  /** Normalized query (synonym-expanded for downstream matching) */
  query: string;
  /** For scoring: detected intents from keywords */
  detectedIntents: string[];
  /** Phase 4.2: True when informational question detected — use knowledge mode */
  mode?: 'knowledge';
  /** Phase 4.6: Routing confidence 0–1. Used for clarification trigger when < 0.4. */
  routingConfidence?: number;
}

/** Phase 4.2: Question-like prefixes (EN) */
const INFORMATIONAL_PREFIXES_EN = [
  'do i ', 'do we ', 'does it ', 'how do i ', 'what is ', "what's ", 'why ', 'should i ',
  'can i ', 'am i ', 'is it ', 'do you ', 'would i ', 'do i need', 'should we ',
];
/** Phase 4.2: Question-like prefixes (ES) */
const INFORMATIONAL_PREFIXES_ES = [
  '¿necesito ', '¿debo ', '¿puedo ', '¿qué es ', '¿cómo ', '¿por qué ', 'necesito ',
  'debo ', 'puedo ', 'qué es ', 'cómo ', 'por qué ', '¿tengo que ', 'tengo que ',
];

/** Phase 4.2: Strong Tier 2 action phrases — if these are the main intent, not informational */
const TIER2_ACTION_PHRASES = [
  'create task', 'create a task', 'new task', 'assign task', 'create project',
  'create a project', 'new project', 'clock in', 'clock out', 'go to tasks',
  'open tasks', 'go to projects', 'open projects',
];

/** Phase 4.2: True if query is an informational question, not a Tier 1/2 action command */
export function isInformationalQuestion(query: string, lang: 'en' | 'es' = 'en'): boolean {
  const q = query.trim();
  if (!q || q.length < 10) return false;

  const lower = q.toLowerCase();

  /* Must NOT strongly match Tier 2 action */
  const isTier2Action = TIER2_ACTION_PHRASES.some((p) => lower.includes(p));
  if (isTier2Action && q.length < 50) return false; /* Short + action phrase = likely command */

  const prefixes = lang === 'es' ? INFORMATIONAL_PREFIXES_ES : INFORMATIONAL_PREFIXES_EN;
  const hasQuestionPrefix = prefixes.some((p) => lower.startsWith(p) || lower.includes(' ' + p));
  const hasQuestionMark = q.includes('?');

  return (hasQuestionPrefix || hasQuestionMark) && !isTier2Action;
}

function detectTier1AndPayload(query: string, lang: 'en' | 'es'): { locked: boolean; payload?: string; command?: IntentRouteResult['command'] } {
  const q = query.trim();
  if (!q) return { locked: false };

  const patterns = lang === 'es' ? TIER1_COMMANDS.es : TIER1_COMMANDS.en;

  for (const re of patterns) {
    const m = q.match(re);
    if (m) {
      const prefix = m[0];
      const payload = q.slice(prefix.length).trim();
      let command: IntentRouteResult['command'] = 'translate';
      if (/^summarize|^resumir/i.test(prefix)) command = 'summarize';
      else if (/^rewrite|^reescribir/i.test(prefix)) command = 'rewrite';
      else if (/^explain|^explicar/i.test(prefix)) command = 'explain';
      else if (/^convert|^convertir/i.test(prefix)) command = 'convert';
      else if (/^generate|^generar/i.test(prefix)) command = 'generate';

      if (__DEV__) {
        console.log('[CEEBO_ROUTER] tier1 locked', { command, payloadLength: payload.length });
      }

      return { locked: true, payload: payload || undefined, command };
    }
  }

  return { locked: false };
}

export function routeIntent(query: string, lang: 'en' | 'es' = 'en'): IntentRouteResult {
  const q = query.trim();
  const expanded = expandSynonyms(q);
  const detectedIntents: string[] = [];

  const tier1 = detectTier1AndPayload(expanded, lang);
  if (tier1.locked) {
    if (__DEV__) {
      console.log('[CEEBO_ROUTER] detected intents: [tier1_transform]');
      console.log('[CEEBO_ROUTER] selected skill: (payload only — no nav match)');
      console.log('[CEEBO_ROUTER] payload extracted:', tier1.payload?.slice(0, 60) ?? '(empty)');
    }
    return {
      tier1Locked: true,
      payload: tier1.payload,
      command: tier1.command,
      query: q,
      detectedIntents: ['tier1_transform'],
    };
  }

  /* Phase 4.2: Informational question → knowledge mode */
  if (isInformationalQuestion(q, lang)) {
    if (__DEV__) {
      console.log('[CEEBO_ROUTER] detected intents: [informational_question]');
      console.log('[CEEBO_ROUTER] mode: knowledge');
    }
    return {
      tier1Locked: false,
      query: expanded,
      detectedIntents: ['informational'],
      mode: 'knowledge',
      routingConfidence: 0.85,
    };
  }

  const lower = expanded.toLowerCase();
  if (lower.includes('translate') || lower.includes('traducir')) detectedIntents.push('translate');
  if (lower.includes('task') || lower.includes('tarea')) detectedIntents.push('tasks');
  if (lower.includes('project') || lower.includes('proyecto')) detectedIntents.push('projects');
  if (lower.includes('create') || lower.includes('crear')) detectedIntents.push('create');
  if (lower.includes('assign') || lower.includes('asignar')) detectedIntents.push('assign');
  if (lower.includes('schedule') || lower.includes('programar')) detectedIntents.push('schedule');
  if (lower.includes('go') || lower.includes('ir') || lower.includes('open') || lower.includes('abrir')) detectedIntents.push('navigate');

  if (__DEV__) {
    console.log('[CEEBO_ROUTER] detected intents:', detectedIntents);
  }

  /* Phase 4.6: Routing confidence based on intent strength */
  const confidence =
    detectedIntents.length === 0 ? 0.35 : Math.min(1, 0.5 + 0.15 * Math.min(3, detectedIntents.length));

  if (__DEV__) {
    console.log('[CEEBO_CONFIDENCE] score:', confidence.toFixed(2));
  }

  return {
    tier1Locked: false,
    query: expanded,
    detectedIntents,
    routingConfidence: confidence,
  };
}

/** Get skill tier for scoring. 1 = highest priority. */
export function getSkillTier(skillId: string): number {
  if (TIER2_SKILL_IDS.has(skillId)) return 2;
  if (TIER3_SKILL_IDS.has(skillId)) return 3;
  return 3;
}

/** Compute confidence adjustment for routing. Applied by skill matcher. */
export function computeRoutingScore(params: {
  query: string;
  skillId: string;
  hasExplicitCommandPhrase: boolean;
  hasStrongVerbMatch: boolean;
  hasContextualRelevance: boolean;
  lang: 'en' | 'es';
}): number {
  let score = 0;
  const { query, skillId, hasExplicitCommandPhrase, hasStrongVerbMatch, hasContextualRelevance } = params;

  if (hasExplicitCommandPhrase) score += 3;
  if (hasStrongVerbMatch) score += 2;
  if (hasContextualRelevance) score += 1;
  if (CONTRADICTING.test(query)) score -= 2;

  return Math.max(0, score);
}

export function hasStrongVerbMatch(query: string, lang: 'en' | 'es'): boolean {
  const verbs = lang === 'es' ? STRONG_VERBS.es : STRONG_VERBS.en;
  const lower = query.toLowerCase();
  return verbs.some((v) => lower.includes(v));
}

export function hasExplicitCommandPhrase(query: string, skillKeywords: string[], _lang: 'en' | 'es'): boolean {
  const lower = query.toLowerCase().trim();
  for (const kw of skillKeywords) {
    const k = kw.toLowerCase().trim();
    if (!k) continue;
    if (lower === k) return true;
    if (lower.startsWith(k + ' ')) return true;
  }
  return false;
}
