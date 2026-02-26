/**
 * CEEBO — Session Context Engine (Phase 3.5)
 *
 * Session-scoped conversational memory. Resets on logout.
 * Flow expiration + unrelated skill reset.
 */

export type SessionLanguage = 'en' | 'es';

/** Phase 3.5: Expiration window (10 min) */
const FLOW_EXPIRATION_MS = 600_000;

/** Skills that belong to each flow. Unrelated skill = reset flow. */
const FLOW_SKILL_IDS: Record<string, Set<string>> = {
  create_project: new Set(['create_project_draft', 'navigate_to_projects']),
  create_task: new Set(['create_task_draft', 'navigate_to_tasks', 'open_task_builder']),
};

export interface CeeboSessionState {
  activeTask: string | null;
  activeFlow: string | null;
  activeRoute: string | null;
  lastSkillExecuted: string | null;
  flowStepIndex: number | null;
  flowStartedAt: number | null;
  languagePreference: SessionLanguage;
  conversationId: string;
}

const DEFAULT_STATE: CeeboSessionState = {
  activeTask: null,
  activeFlow: null,
  activeRoute: null,
  lastSkillExecuted: null,
  flowStepIndex: null,
  flowStartedAt: null,
  languagePreference: 'en',
  conversationId: `conv-${Date.now()}`,
};

let state: CeeboSessionState = { ...DEFAULT_STATE };

function generateConversationId(): string {
  return `conv-${Date.now()}`;
}

export function getSessionState(): CeeboSessionState {
  return { ...state };
}

export function updateActiveRoute(pathname: string): void {
  state.activeRoute = pathname || null;
}

export function updateLanguagePreference(lang: SessionLanguage): void {
  state.languagePreference = lang;
}

export function setFlowFromSkill(skillId: string, targetRoute?: string): void {
  const flow = skillIdToFlow(skillId);
  if (!flow) return;
  state.activeFlow = flow.flowId;
  state.flowStepIndex = flow.stepIndex;
  state.lastSkillExecuted = skillId;
  state.flowStartedAt = Date.now();
  if (targetRoute) state.activeRoute = targetRoute;
}

/** Phase 3.5: Expired after 10 min. */
export function isFlowExpired(): boolean {
  if (!state.activeFlow || state.flowStartedAt == null) return false;
  return Date.now() - state.flowStartedAt > FLOW_EXPIRATION_MS;
}

/** Phase 3.5: Clear flow, keep conversationId. */
export function resetFlow(): void {
  state.activeFlow = null;
  state.flowStepIndex = null;
  state.flowStartedAt = null;
  state.activeTask = null;
}

/** Phase 3.5: Reset flow if executed skill is unrelated. */
export function checkUnrelatedSkillReset(skillId: string): void {
  if (!state.activeFlow) return;
  const related = FLOW_SKILL_IDS[state.activeFlow];
  if (related?.has(skillId)) return;
  if (__DEV__) console.log('[CEEBO] Flow reset due to unrelated skill:', skillId);
  resetFlow();
}

function skillIdToFlow(skillId: string): { flowId: string; stepIndex: number } | null {
  const map: Record<string, { flowId: string; stepIndex: number }> = {
    create_project_draft: { flowId: 'create_project', stepIndex: 3 },
    navigate_to_projects: { flowId: 'create_project', stepIndex: 2 },
    create_task_draft: { flowId: 'create_task', stepIndex: 2 },
    navigate_to_tasks: { flowId: 'create_task', stepIndex: 2 },
    open_task_builder: { flowId: 'create_task', stepIndex: 2 },
  };
  return map[skillId] ?? null;
}

export function advanceFlowStep(): void {
  if (state.flowStepIndex != null) {
    state.flowStepIndex = state.flowStepIndex + 1;
  }
}

export function clearFlow(): void {
  state.activeFlow = null;
  state.flowStepIndex = null;
  state.flowStartedAt = null;
  state.activeTask = null;
}

export function resetCeeboContext(): void {
  state = {
    activeTask: null,
    activeFlow: null,
    activeRoute: null,
    lastSkillExecuted: null,
    flowStepIndex: null,
    flowStartedAt: null,
    languagePreference: 'en',
    conversationId: generateConversationId(),
  };
  if (__DEV__) console.log('[CEEBO] Session context reset on logout');
}
