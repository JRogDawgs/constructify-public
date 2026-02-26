/**
 * CEEBO — Shared types for AI copilot architecture
 */

/** Optional action plan attached to ceebo message (e.g. pending confirmation) */
export interface PendingAction {
  targetRoute?: string;
  requiresConfirmation: boolean;
  confirmationPrompt?: string;
}

/** Phase 1.9: Suggestion chip — user taps to send query (triggers skill flow) */
export interface SuggestionChip {
  /** Display label (EN or ES) */
  label: string;
  /** Query to send when chip pressed — goes through orchestrate */
  query: string;
}

export interface ChatMessage {
  id: string;
  role: 'ceebo' | 'user';
  content: string;
  timestamp?: number;
  /** When true, content is streaming; show cursor */
  isStreaming?: boolean;
  /** When set, message offers "Take me there" for skill confirmation */
  pendingAction?: PendingAction;
  /** Plan for execution when user confirms (navigation only in Phase 1) */
  actionPlan?: { type: 'navigation'; targetRoute?: string; requiresConfirmation: boolean };
  /** Detected language for this turn (en | es) */
  detectedLanguage?: 'en' | 'es';
  /** Phase 1.9: Chips shown under message when nav skill completes or unclear/blocked */
  suggestionChips?: SuggestionChip[];
  /** Phase 3: Skill ID for flow continuation when user confirms */
  skillId?: string;
}

export type SpeechState = 'idle' | 'listening' | 'processing';

export interface TranscriptPipelineResult {
  raw: string;
  normalized: string;
  final: string;
}

export type CeeboIntent =
  | 'navigate'
  | 'explain'
  | 'translate'
  | 'scheduling'
  | 'workers'
  | 'settings'
  | 'clock'
  | 'tasks'
  | 'reports'
  | 'unclear';

export interface RetrievedDoc {
  pageTitle: string;
  description: string;
  longFormGuidance: string;
  relatedRoutes: string[];
  score: number;
}

export interface AIOrchestratorDebug {
  intent?: CeeboIntent;
  retrievedDocs?: RetrievedDoc[];
  rawTranscript?: string;
  normalizedTranscript?: string;
  /** Phase 1.5 normalization trace */
  afterAccentRemoval?: string;
  afterSlangNormalization?: string;
  finalNormalized?: string;
  tokenTimings?: number[];
  /** Language detection (Phase 1) */
  detectedLanguage?: 'en' | 'es';
  /** Skill engine (Phase 1) */
  matchedSkillId?: string;
  skillConfidence?: number;
  actionPlan?: Record<string, unknown>;
  confirmationRequired?: boolean;
  /** Phase 1.5 fuzzy match */
  isFuzzyMatch?: boolean;
  fuzzySimilarity?: number;
  /** Phase 1.75 execution guard */
  executionBlockedReason?: string;
  /** Phase 2 validation warnings (route not registered, response invalid, etc.) */
  validationWarnings?: Array<{ code: string; detail: string }>;
  /** Phase 4.1: Skill blocked due to insufficient role */
  roleBlockedSkill?: string;
  roleBlockedReason?: 'INSUFFICIENT_ROLE';
  /** Phase 4.2: Response built from knowledge mode (informational question) */
  knowledgeMode?: boolean;
  /** Phase 4.3: Blocked due to out-of-scope question */
  domainBlocked?: boolean;
  domainBlockedReason?: 'OUT_OF_SCOPE';
  /** Phase 4.6: Ambiguous match — clarification shown */
  ambiguityClarification?: boolean;
  /** Phase 4.6: Routing confidence (0–1) */
  routingConfidence?: number;
}
