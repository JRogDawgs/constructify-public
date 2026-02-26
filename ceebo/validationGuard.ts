/**
 * CEEBO — Validation Guard (Phase 2)
 *
 * Anti-hallucination guards:
 * - validateRouteExists
 * - validateSkillExists
 * - validateResponseStructure
 *
 * All validation failures log to debug and trigger safe fallback.
 */

import { validateRouteExists } from './routeRegistry';
import { getSkill, listSkills } from './skills';
import { buildEmptyStateResponse } from './responseBuilder';
import type { RetrievedDoc } from './ceebo.types';

export type ValidationWarning = {
  code: 'route_not_registered' | 'skill_not_registered' | 'response_invalid';
  detail: string;
};

const UNCERTAINTY_PHRASES = [
  'maybe',
  'probably',
  'perhaps',
  'might',
  'could be',
  'i think',
  'i believe',
  'not sure',
  'uncertain',
  'tal vez',
  'quizás',
  'quizas',
  'posiblemente',
  'creo que',
  'no estoy seguro',
];

/**
 * Phase 2: Validate route exists in route registry.
 * Returns true if valid; otherwise logs warning.
 */
export function validateRoute(route: string): { valid: boolean; warning?: ValidationWarning } {
  if (!route || typeof route !== 'string') {
    return { valid: false, warning: { code: 'route_not_registered', detail: 'Empty or invalid route' } };
  }
  const valid = validateRouteExists(route);
  if (!valid) {
    return {
      valid: false,
      warning: { code: 'route_not_registered', detail: `Route not in registry: ${route}` },
    };
  }
  return { valid: true };
}

/**
 * Phase 2: Validate skill ID exists in skill registry.
 */
export function validateSkillExists(skillId: string): { valid: boolean; warning?: ValidationWarning } {
  if (!skillId || typeof skillId !== 'string') {
    return { valid: false, warning: { code: 'skill_not_registered', detail: 'Empty or invalid skillId' } };
  }
  const skill = getSkill(skillId);
  const valid = !!skill;
  if (!valid) {
    return {
      valid: false,
      warning: { code: 'skill_not_registered', detail: `Skill not registered: ${skillId}` },
    };
  }
  return { valid: true };
}

/**
 * Phase 2: Validate response structure before streaming.
 * Must: contain actionable step, no uncertainty phrasing, no undefined variables.
 */
export function validateResponseStructure(
  response: string,
  _docs?: RetrievedDoc[]
): { valid: boolean; warning?: ValidationWarning } {
  if (!response || typeof response !== 'string') {
    return { valid: false, warning: { code: 'response_invalid', detail: 'Empty response' } };
  }

  const lower = response.toLowerCase();

  if (lower.includes('undefined') || lower.includes('null') || lower.includes('{{') || lower.includes('}}')) {
    return {
      valid: false,
      warning: { code: 'response_invalid', detail: 'Response contains undefined/variable placeholders' },
    };
  }

  for (const phrase of UNCERTAINTY_PHRASES) {
    if (lower.includes(phrase)) {
      return {
        valid: false,
        warning: { code: 'response_invalid', detail: `Response contains uncertainty: "${phrase}"` },
      };
    }
  }

  const hasActionable =
    /\*\*[^*]+\*\*/.test(response) ||
    /•|bullet|step|click|navigate|go to|ir a|ve a|dónde|where/i.test(response) ||
    response.trim().length > 20;

  if (!hasActionable) {
    return {
      valid: false,
      warning: { code: 'response_invalid', detail: 'Response lacks actionable content' },
    };
  }

  return { valid: true };
}

/**
 * Get all registered skill IDs (for validation/debug).
 */
export function getRegisteredSkillIds(): string[] {
  return listSkills().map((s) => s.id);
}
