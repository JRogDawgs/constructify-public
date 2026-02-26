/**
 * CEEBO — Skill Engine Type Definitions
 *
 * Phase 1: Navigation + mutation scaffolds (no Firestore execution).
 */

/** Action plan returned by skill execution */
export interface ActionPlan {
  type: 'navigation' | 'mutation' | 'instruction';
  targetRoute?: string;
  payload?: Record<string, unknown>;
  uiHints?: string[];
  requiresConfirmation: boolean;
  /** Human-readable summary for confirmation dialog */
  confirmationPrompt?: string;
}

/** Supported response languages (Phase 1) */
export type ResponseLanguage = 'en' | 'es';

/** Context passed to skill execute() */
export interface SkillExecutionContext {
  pathname: string;
  normalizedQuery: string;
  /** Detected from user input; responses follow this language */
  language: ResponseLanguage;
  role?: 'owner' | 'supervisor' | 'worker';
  /** Optional route params (e.g. projectId) when on a specific page */
  routeParams?: Record<string, string>;
}

/** Intent triggers for keyword-based matching (Phase 1). Bilingual. */
export interface IntentTriggers {
  /** English keywords */
  keywords: string[];
  /** Spanish keywords (optional) */
  keywordsEs?: string[];
  /** Future: embedding vector for semantic match */
  embedding?: number[];
}

/** Permissions required (future enforcement) */
export type SkillPermission = 'navigate' | 'create_project' | 'create_task' | 'edit_settings';

/** Context requirements for skill availability */
export interface RequiredContext {
  /** Path patterns where skill is valid (e.g. /dashboard/*) */
  pathPatterns?: string[];
  /** Minimum role */
  minRole?: 'owner' | 'supervisor' | 'worker';
}

/** Role required for skill execution (Phase 4.1). If undefined → allow all. */
export type SkillRequiredRole = 'worker' | 'supervisor' | 'admin';

export interface Skill {
  id: string;
  description: string;
  intentTriggers: IntentTriggers;
  requiredPermissions: SkillPermission[];
  requiredContext?: RequiredContext;
  /** Phase 4.1: Roles that may execute this skill. Undefined = allow all. */
  requiredRoles?: SkillRequiredRole[];
  /** Returns action plan. Does NOT execute. */
  execute(context: SkillExecutionContext): ActionPlan;
  confirmRequired: boolean;
}

/** Result from skill match */
export interface SkillMatchResult {
  skill: Skill;
  confidence: number;
  actionPlan: ActionPlan;
  /** True if matched via fuzzy similarity (not exact keyword) */
  isFuzzyMatch?: boolean;
  /** Similarity score when fuzzy (0–1) */
  fuzzySimilarity?: number;
}

/** Phase 4.6: Returned when multiple skills score within 1 point — needs clarification */
export interface AmbiguousMatchResult {
  needsClarification: true;
  clarificationOptions: string[];
}
