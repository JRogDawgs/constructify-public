/**
 * CEEBO — AI Orchestrator (Phase 3)
 *
 * Pipeline: Normalize → (Flow Continuation?) → Intent → Skill Match → Validation → Response
 * Phase 3: Session context, flow awareness, route awareness.
 * Phase 4.1: Role-aware execution — permission gating before skill execution.
 * Phase 4.2: Knowledge mode — contextual answers for informational questions.
 * Phase 4.3: Domain boundary — only answer Constructify-related questions.
 * Phase 4.5: Contextual suggestion engine — role + module aware action chips.
 */

import { searchTrainingHub } from './trainingHubRetriever';
import { getPageKeyForRoute } from './trainingHubIndex';
import { routeIntent } from './intentRouter';
import { matchSkill, getLastBlockedReason, getLastBlockedSkill } from './skills';
import { normalizeInput } from './normalization';
import {
  buildSkillResponse,
  buildEmptyStateResponse,
  buildClarifyingResponse,
} from './responseBuilder';
import { validateRoute, validateSkillExists, validateResponseStructure } from './validationGuard';
import { validateRouteExists } from './routeRegistry';
import {
  updateActiveRoute,
  updateLanguagePreference,
  isFlowExpired,
  resetFlow,
  getSessionState,
} from './ceeboContextEngine';
import { handleFlowContinuation } from './flowContinuationHandler';
import type { SkillExecutionContext, ActionPlan, SkillMatchResult, AmbiguousMatchResult } from './skills';
import type { CeeboIntent, RetrievedDoc, AIOrchestratorDebug, SuggestionChip } from './ceebo.types';

/** Phase 4.3: Domain boundary — check if question is Constructify-related */
function isConstructifyDomainQuestion(_query: string, _pathname: string): boolean {
  return true;
}

/** Phase 4.3: Response when question is out of Constructify domain */
function constructifyOnlyResponse(lang: 'en' | 'es'): string {
  return lang === 'es'
    ? 'Solo puedo responder preguntas sobre Constructify.'
    : 'I can only answer questions about Constructify.';
}

/** Phase 4.1: User context for role-aware skill gating */
export interface OrchestratorUserContext {
  userId: string;
  role: 'worker' | 'supervisor' | 'admin';
  companyId: string | null;
}

/** Phase 4.5: Generate role + module aware suggestion chips */
function generateContextualSuggestions(params: {
  role: 'worker' | 'supervisor' | 'admin';
  module: string;
  skill?: string;
  knowledgeMode: boolean;
  query: string;
  domainBlocked?: boolean;
  lang: 'en' | 'es';
}): SuggestionChip[] {
  const { role, module, knowledgeMode, query, domainBlocked, lang } = params;

  if (domainBlocked) return [];

  const lower = query.toLowerCase();

  /* Profile-related knowledge question */
  if (knowledgeMode && (lower.includes('profile') || lower.includes('perfil') || lower.includes('information') || lower.includes('información'))) {
    if (role === 'worker') {
      return lang === 'es'
        ? [
            { label: 'Actualizar mi perfil', query: 'Take me to my profile' },
            { label: 'Ver certificaciones', query: 'Where do I view certifications?' },
            { label: 'Ir a mi horario', query: 'Go to my schedule' },
          ]
        : [
            { label: 'Update my profile', query: 'Take me to my profile' },
            { label: 'View certifications', query: 'Where do I view certifications?' },
            { label: 'Go to schedule', query: 'Go to my schedule' },
          ];
    }
    if (role === 'admin' || role === 'supervisor') {
      return lang === 'es'
        ? [
            { label: 'Revisar perfiles', query: 'Take me to team' },
            { label: 'Ver certificaciones', query: 'Where do I check certifications?' },
            { label: 'Gestión de usuarios', query: 'Open user management' },
          ]
        : [
            { label: 'Review worker profiles', query: 'Take me to team' },
            { label: 'Check certifications', query: 'Where do I check certifications?' },
            { label: 'Open user management', query: 'Open user management' },
          ];
    }
  }

  /* Task-related question (knowledge or skill) */
  if (lower.includes('task') || lower.includes('tarea') || params.skill?.includes('task')) {
    if (role === 'worker') {
      return lang === 'es'
        ? [
            { label: 'Ver mis tareas', query: 'Go to tasks' },
            { label: 'Registrar entrada', query: 'Clock in' },
          ]
        : [
            { label: 'View my tasks', query: 'Go to tasks' },
            { label: 'Clock in', query: 'Clock in' },
          ];
    }
    if (role === 'admin' || role === 'supervisor') {
      return lang === 'es'
        ? [
            { label: 'Crear tarea', query: 'Create a task' },
            { label: 'Asignar tarea', query: 'Assign a task' },
          ]
        : [
            { label: 'Create new task', query: 'Create a task' },
            { label: 'Assign task', query: 'Assign a task' },
          ];
    }
  }

  /* Project-related */
  if (lower.includes('project') || lower.includes('proyecto') || params.skill?.includes('project')) {
    return lang === 'es'
      ? [
          { label: 'Ver proyectos', query: 'Take me to projects' },
          { label: 'Crear proyecto', query: 'Create a project' },
        ]
      : [
          { label: 'View projects', query: 'Take me to projects' },
          { label: 'Create project', query: 'Create a project' },
        ];
  }

  /* Schedule-related */
  if (lower.includes('schedule') || lower.includes('programar') || module === 'schedule') {
    return lang === 'es'
      ? [
          { label: 'Ver horario', query: 'Go to schedule' },
          { label: 'Asignar turnos', query: 'How do I assign shifts?' },
        ]
      : [
          { label: 'View schedule', query: 'Go to schedule' },
          { label: 'Assign shifts', query: 'How do I assign shifts?' },
        ];
  }

  /* Generic knowledge fallback */
  if (knowledgeMode) {
    return lang === 'es'
      ? [
          { label: 'Ir a tareas', query: 'Go to tasks' },
          { label: 'Ir a proyectos', query: 'Take me to projects' },
          { label: 'Ver reportes', query: 'Where do I view reports?' },
        ]
      : [
          { label: 'Go to tasks', query: 'Go to tasks' },
          { label: 'Take me to projects', query: 'Take me to projects' },
          { label: 'View reports', query: 'Where do I view reports?' },
        ];
  }

  return [];
}

/** Phase 4.2: Derive current module from pathname */
function getModuleFromPathname(pathname: string): string {
  const p = (pathname || '').toLowerCase().replace(/\/$/, '') || '/';
  if (p.includes('/admin') || p.startsWith('/dashboard/admin')) return 'admin';
  if (p.includes('/worker') || p.startsWith('/worker')) return 'worker';
  if (p.includes('/profile')) return 'profile';
  if (p.includes('/tasks')) return 'tasks';
  if (p.includes('/projects')) return 'projects';
  if (p.includes('/schedule')) return 'schedule';
  if (p.includes('/reports')) return 'reports';
  if (p.includes('/supervisor')) return 'supervisor';
  if (p.includes('/settings') || p.includes('/training')) return 'settings';
  return 'general';
}

/** Phase 4.2: Build contextual answer for informational questions */
function buildContextualAnswer(
  query: string,
  userContext: { role: 'worker' | 'supervisor' | 'admin'; companyId: string | null } | undefined,
  pathname: string,
  lang: 'en' | 'es'
): string {
  const lower = query.toLowerCase();
  const role = userContext?.role ?? 'worker';
  const module = getModuleFromPathname(pathname);

  if (__DEV__) {
    console.log('[CEEBO_KNOWLEDGE] detected informational question');
    console.log('[CEEBO_KNOWLEDGE] module:', module);
    console.log('[CEEBO_KNOWLEDGE] role:', role);
  }

  /* Profile-related: "do I need to put information in my profile" */
  if (lower.includes('profile') || lower.includes('perfil') || lower.includes('información') || lower.includes('information')) {
    if (role === 'worker') {
      return lang === 'es'
        ? 'Sí, completar tu perfil ayuda a los supervisores a asignarte trabajo, hacer seguimiento de certificaciones y gestionar tu horario. La información que pongas hace que las asignaciones sean más precisas.'
        : 'Yes, completing your profile helps supervisors assign you work, track certifications, and manage scheduling. The information you add makes work assignments more accurate.';
    }
    if (role === 'admin' || role === 'supervisor') {
      return lang === 'es'
        ? 'Sí, un perfil completo asegura permisos correctos, reportes precisos y visibilidad del personal. Los datos del perfil se usan para asignaciones, reportes de tiempo y cumplimiento.'
        : 'Yes, profile completion ensures accurate permissions, reporting, and staffing visibility. Profile data is used for assignments, time tracking, and compliance.';
    }
  }

  /* Tasks-related */
  if (lower.includes('task') || lower.includes('tarea')) {
    if (role === 'worker') {
      return lang === 'es'
        ? 'Las tareas te indican qué trabajo realizar y en qué proyecto. Tu supervisor las asigna y puedes ver el detalle, las horas y el estado en tu dashboard.'
        : 'Tasks tell you what work to do and on which project. Your supervisor assigns them, and you can view details, hours, and status on your dashboard.';
    }
    return lang === 'es'
      ? 'Las tareas organizan el trabajo por proyecto. Puedes crear y asignar tareas desde el Task Builder. Son útiles para seguimiento de horas y avance.'
      : 'Tasks organize work by project. You can create and assign them from the Task Builder. They help with hour tracking and progress.';
  }

  /* Projects-related */
  if (lower.includes('project') || lower.includes('proyecto')) {
    return lang === 'es'
      ? 'Los proyectos agrupan trabajos, tareas y reportes. Un proyecto completo facilita la programación, el seguimiento de horas y la facturación.'
      : 'Projects group jobs, tasks, and reports. A complete project makes scheduling, hour tracking, and billing easier.';
  }

  /* Schedule-related */
  if (lower.includes('schedule') || lower.includes('programar') || lower.includes('horario')) {
    return lang === 'es'
      ? 'La programación define quién trabaja cuándo y en qué proyecto. Los supervisores asignan turnos; los trabajadores ven sus horarios en su dashboard.'
      : 'Scheduling defines who works when and on which project. Supervisors assign shifts; workers see their schedule in the dashboard.';
  }

  /* General fallback */
  return lang === 'es'
    ? 'En Constructify, la información que ingresas se usa para asignaciones, reportes y cumplimiento. Completar los datos en cada módulo mejora la precisión y la visibilidad del equipo.'
    : 'In Constructify, the information you enter is used for assignments, reports, and compliance. Filling in data in each module improves accuracy and team visibility.';
}

/** Phase 4.1: Contextual fallback when user lacks permission */
function intelligentFallback(role: 'worker' | 'supervisor' | 'admin', skillName: string, lang: 'en' | 'es'): string {
  const workerCreateSkills = ['create_task_draft', 'create_project_draft', 'open_task_builder', 'assign_task'];
  const isWorkerBlocked = role === 'worker' && workerCreateSkills.includes(skillName);

  if (isWorkerBlocked) {
    return lang === 'es'
      ? 'No tienes permiso para crear o asignar tareas. ¿Quieres que notifique a tu supervisor?'
      : "You don't have permission to create or assign tasks. Would you like me to notify your supervisor?";
  }

  if (role === 'supervisor' && skillName.includes('admin')) {
    return lang === 'es'
      ? 'Esta acción requiere acceso de administrador.'
      : 'This action requires admin access.';
  }

  return lang === 'es'
    ? 'No tienes permiso para ejecutar esta acción. Contacta a tu administrador si necesitas acceso.'
    : "You don't have permission for this action. Contact your administrator if you need access.";
}

const INTENT_KEYWORDS: Record<CeeboIntent, string[]> = {
  navigate: ['where', 'find', 'go', 'navigate', 'location', 'page'],
  explain: ['explain', 'what', 'how', 'understand', 'mean'],
  translate: ['translate', 'spanish', 'french', 'german', 'language'],
  scheduling: ['schedule', 'scheduling', 'shift', 'assign worker'],
  workers: ['worker', 'workers', 'employee', 'team member'],
  settings: ['settings', 'company', 'edit', 'configure'],
  clock: ['clock', 'clock in', 'clock out', 'time', 'break'],
  tasks: ['task', 'tasks', 'assign', 'complete'],
  reports: ['report', 'reports'],
  unclear: [],
};

function classifyIntent(query: string): CeeboIntent {
  const lower = query.toLowerCase();
  for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
    if (intent === 'unclear') continue;
    if (keywords.some((k) => lower.includes(k))) return intent as CeeboIntent;
  }
  return 'unclear';
}

function buildGroundedResponse(
  query: string,
  intent: CeeboIntent,
  docs: RetrievedDoc[],
  pathname: string,
  lang: 'en' | 'es'
): string {
  if (intent === 'unclear') {
    return lang === 'es'
      ? `No estoy seguro de qué buscas. ¿Puedes aclarar? Por ejemplo:\n• "¿Cómo programo un trabajador?"\n• "¿Dónde edito la configuración de la empresa?"\n• "Explica la página de programación"`
      : `I'm not sure what you're looking for. Could you clarify? For example:\n• "How do I schedule a worker?"\n• "Where do I edit company settings?"\n• "Explain the scheduling page"`;
  }

  const top = docs[0];
  if (!top) {
    return lang === 'es'
      ? `Para "${query}", ve a **Projects** → **Schedule** en el menú izquierdo. Estás en ${pathname || 'el dashboard'}.`
      : `For "${query}", check **Projects** → **Schedule** in the left navigation. You're currently on ${pathname || 'the dashboard'}.`;
  }

  const lines: string[] = [];
  lines.push(`**${top.pageTitle ?? ''}**`);
  lines.push('');
  lines.push(top.longFormGuidance ?? top.description ?? '');
  const relatedRoutes = Array.isArray(top.relatedRoutes) ? top.relatedRoutes : [];
  const validRoutes = relatedRoutes.filter((r) => r && validateRouteExists(r));
  if (validRoutes.length > 0) {
    lines.push('');
    lines.push(lang === 'es' ? '**Dónde ir:**' : '**Where to go:**');
    validRoutes.slice(0, 3).forEach((r) => lines.push(`• ${r}`));
  }
  return lines.join('\n');
}

export interface OrchestrateResult {
  response: string;
  debug: AIOrchestratorDebug;
  actionPlan?: ActionPlan;
  matchedSkill?: SkillMatchResult;
  /** Phase 1.9: Suggestion chips (empty-state, clarifying, or post-nav) */
  suggestionChips?: SuggestionChip[];
  /** Phase 1.9: True when response is blocked/clarifying/unclear — do NOT apply micro-delay */
  isCoachingResponse?: boolean;
  /** Phase 4.1: True when skill was blocked due to insufficient role */
  blocked?: boolean;
  /** Phase 4.1/4.3: Reason when blocked */
  reason?: 'INSUFFICIENT_ROLE' | 'OUT_OF_SCOPE';
}

export function orchestrate(
  query: string,
  pathname: string,
  _systemPrompt?: string,
  userContext?: OrchestratorUserContext
): OrchestrateResult {
  if (query.length > 2000) {
    return {
      response: 'Input too long. Please shorten your request.',
      debug: { rawTranscript: query, normalizedTranscript: query.slice(0, 100), detectedLanguage: 'en' },
      isCoachingResponse: true,
    };
  }
  const { normalized, trace } = normalizeInput(query);
  const { detectedLanguage: detectedLang } = trace;

  updateActiveRoute(pathname);
  updateLanguagePreference(detectedLang);

  if (getSessionState().activeFlow && isFlowExpired()) {
    if (__DEV__) console.log('[CEEBO] Flow expired');
    resetFlow();
  }

  const isCancelQuery = /^(cancel|cancelar)$/i.test(normalized.trim());
  if (isCancelQuery && getSessionState().activeFlow) {
    resetFlow();
    const { chips } = buildEmptyStateResponse(detectedLang);
    return {
      response: detectedLang === 'es' ? 'Flujo cancelado.' : 'Flow cancelled.',
      debug: { rawTranscript: query, normalizedTranscript: normalized, detectedLanguage: detectedLang },
      suggestionChips: chips,
      isCoachingResponse: true,
    };
  }

  const flowResult = handleFlowContinuation(normalized, pathname, detectedLang);
  if (flowResult.handled) {
    const debug: AIOrchestratorDebug = {
      rawTranscript: query,
      normalizedTranscript: normalized,
      detectedLanguage: detectedLang,
    };
    return {
      response: flowResult.response!,
      debug,
      suggestionChips: flowResult.chips,
      isCoachingResponse: true,
    };
  }

  const routerResult = routeIntent(normalized, detectedLang);

  /* Phase 4.2: Knowledge mode — informational questions get contextual answers */
  if (routerResult.mode === 'knowledge') {
    /* Phase 4.3: Domain boundary — block out-of-scope questions */
    if (!isConstructifyDomainQuestion(routerResult.query, pathname)) {
      if (__DEV__) {
        console.log('[CEEBO_DOMAIN] out-of-scope question blocked');
      }
      const message = constructifyOnlyResponse(detectedLang);
      return {
        response: message,
        debug: {
          intent: 'explain',
          rawTranscript: query,
          normalizedTranscript: normalized,
          detectedLanguage: detectedLang,
          domainBlocked: true,
          domainBlockedReason: 'OUT_OF_SCOPE',
        },
        suggestionChips: [], /* Phase 4.5: Out-of-scope returns empty suggestions */
        isCoachingResponse: true,
        blocked: true,
        reason: 'OUT_OF_SCOPE',
      };
    }

    const response = buildContextualAnswer(routerResult.query, userContext, pathname, detectedLang);
    const module = getModuleFromPathname(pathname);
    const chips = generateContextualSuggestions({
      role: userContext?.role ?? 'worker',
      module,
      knowledgeMode: true,
      query: routerResult.query,
      domainBlocked: false,
      lang: detectedLang,
    });
    const suggestionChips = chips.length > 0 ? chips : buildEmptyStateResponse(detectedLang).chips;
    if (__DEV__) {
      console.log('[CEEBO_SUGGEST] generated suggestions:', chips.map((c) => c.label));
    }
    return {
      response,
      debug: {
        intent: 'explain',
        rawTranscript: query,
        normalizedTranscript: normalized,
        detectedLanguage: detectedLang,
        knowledgeMode: true,
      },
      suggestionChips,
      isCoachingResponse: true,
    };
  }

  if (routerResult.tier1Locked && routerResult.payload !== undefined) {
    const payloadQuery = routerResult.payload.trim() || normalized;
    const docs = searchTrainingHub(payloadQuery, 3);
    const response = buildGroundedResponse(payloadQuery, 'explain', docs, pathname, detectedLang);
    const respCheck = validateResponseStructure(response, docs);
    const warnings: Array<{ code: string; detail: string }> = [];
    let finalResponse = response;
    let coachingChips: SuggestionChip[] | undefined;
    if (!respCheck.valid && respCheck.warning) {
      warnings.push(respCheck.warning);
      const fallback = buildEmptyStateResponse(detectedLang);
      finalResponse = fallback.response;
      coachingChips = fallback.chips;
    }
    return {
      response: finalResponse,
      debug: {
        intent: 'translate',
        rawTranscript: query,
        normalizedTranscript: normalized,
        detectedLanguage: detectedLang,
        retrievedDocs: docs,
        validationWarnings: warnings.length > 0 ? warnings : undefined,
      },
      suggestionChips: coachingChips,
      isCoachingResponse: true,
    };
  }

  const intent = classifyIntent(normalized);
  const ctx: SkillExecutionContext = {
    pathname,
    normalizedQuery: normalized,
    language: detectedLang,
  };

  if (__DEV__ && userContext?.role) {
    console.log('[CEEBO_ROLE] role:', userContext.role);
  }

  const skillMatch = matchSkill(routerResult.query, ctx);

  if (skillMatch && !('needsClarification' in skillMatch)) {
    /* Phase 4.1: Permission gating — block if user lacks required role */
    const userRole = userContext?.role;
    const requiredRoles = skillMatch.skill.requiredRoles;
    if (requiredRoles?.length && userRole && !requiredRoles.includes(userRole)) {
      const fallbackMsg = intelligentFallback(userRole, skillMatch.skill.id, detectedLang);
      if (__DEV__) {
        console.log('[CEEBO_ROLE] role:', userRole);
        console.log('[CEEBO_ROLE] blocked skill:', skillMatch.skill.id);
        console.log('[CEEBO_ROLE] reason: insufficient_role');
      }
      const { chips } = buildEmptyStateResponse(detectedLang);
      return {
        response: fallbackMsg,
        debug: {
          intent,
          rawTranscript: query,
          normalizedTranscript: normalized,
          detectedLanguage: detectedLang,
          roleBlockedSkill: skillMatch.skill.id,
          roleBlockedReason: 'INSUFFICIENT_ROLE',
        },
        suggestionChips: chips,
        isCoachingResponse: true,
        blocked: true,
        reason: 'INSUFFICIENT_ROLE',
      };
    }

    const warnings: Array<{ code: string; detail: string }> = [];
    const routeCheck =
      skillMatch.actionPlan.type === 'navigation' && skillMatch.actionPlan.targetRoute
        ? validateRoute(skillMatch.actionPlan.targetRoute)
        : { valid: true };
    if (!routeCheck.valid && routeCheck.warning) {
      warnings.push(routeCheck.warning);
    }
    const skillCheck = validateSkillExists(skillMatch.skill.id);
    if (!skillCheck.valid && skillCheck.warning) {
      warnings.push(skillCheck.warning);
    }
    if (warnings.length > 0) {
      const { response, chips } = buildEmptyStateResponse(detectedLang);
      return {
        response,
        debug: {
          intent,
          rawTranscript: query,
          normalizedTranscript: normalized,
          detectedLanguage: detectedLang,
          validationWarnings: warnings,
        },
        suggestionChips: chips,
        isCoachingResponse: true,
      };
    }

    const { response, chips } = buildSkillResponse(skillMatch, detectedLang);
    const respCheck = validateResponseStructure(response);
    if (!respCheck.valid && respCheck.warning) {
      warnings.push(respCheck.warning);
      const { response: fallback, chips: fallbackChips } = buildEmptyStateResponse(detectedLang);
      return {
        response: fallback,
        debug: {
          intent,
          rawTranscript: query,
          normalizedTranscript: normalized,
          detectedLanguage: detectedLang,
          validationWarnings: warnings,
        },
        suggestionChips: fallbackChips,
        isCoachingResponse: true,
      };
    }

    /* Phase 4.5: Role-aware contextual suggestions for skill response */
    const module = getModuleFromPathname(pathname);
    const contextualChips = generateContextualSuggestions({
      role: userContext?.role ?? 'worker',
      module,
      skill: skillMatch.skill.id,
      knowledgeMode: false,
      query: normalized,
      domainBlocked: false,
      lang: detectedLang,
    });
    const finalChips = contextualChips.length > 0 ? contextualChips : chips;
    if (__DEV__ && contextualChips.length > 0) {
      console.log('[CEEBO_SUGGEST] generated suggestions:', contextualChips.map((c) => c.label));
    }

    const debug: AIOrchestratorDebug = {
      intent,
      rawTranscript: query,
      normalizedTranscript: normalized,
      afterAccentRemoval: trace.afterAccentRemoval,
      afterSlangNormalization: trace.afterSlangNormalization,
      finalNormalized: trace.finalNormalized,
      detectedLanguage: detectedLang,
      matchedSkillId: skillMatch.skill.id,
      skillConfidence: skillMatch.confidence,
      actionPlan: skillMatch.actionPlan as unknown as Record<string, unknown>,
      confirmationRequired: skillMatch.actionPlan.requiresConfirmation,
      isFuzzyMatch: skillMatch.isFuzzyMatch,
      fuzzySimilarity: skillMatch.fuzzySimilarity,
    };

    return {
      response,
      debug,
      actionPlan: skillMatch.actionPlan,
      matchedSkill: skillMatch,
      suggestionChips: finalChips,
    };
  }

  /* Phase 4.6: Low routing confidence — no skill match, trigger clarification */
  const routingConfidence = routerResult.routingConfidence ?? 0.5;
  if (!skillMatch && routingConfidence < 0.4) {
    if (__DEV__) {
      console.log('[CEEBO_CONFIDENCE] score:', routingConfidence.toFixed(2), '— routing unclear');
    }
    const { response, chips } = buildEmptyStateResponse(detectedLang);
    return {
      response,
      debug: {
        intent,
        rawTranscript: query,
        normalizedTranscript: normalized,
        detectedLanguage: detectedLang,
        routingConfidence,
      },
      suggestionChips: chips,
      isCoachingResponse: true,
    };
  }

  const executionBlockedReason = getLastBlockedReason();
  const blockedSkill = getLastBlockedSkill();

  if (blockedSkill && executionBlockedReason) {
    const { response, chips } = buildClarifyingResponse(blockedSkill, detectedLang);
    const debug: AIOrchestratorDebug = {
      intent,
      rawTranscript: query,
      normalizedTranscript: normalized,
      afterAccentRemoval: trace.afterAccentRemoval,
      afterSlangNormalization: trace.afterSlangNormalization,
      finalNormalized: trace.finalNormalized,
      detectedLanguage: detectedLang,
      executionBlockedReason,
    };
    return {
      response,
      debug,
      suggestionChips: chips,
      isCoachingResponse: true,
    };
  }

  if (intent === 'unclear') {
    const { response, chips } = buildEmptyStateResponse(detectedLang);
    const debug: AIOrchestratorDebug = {
      intent,
      rawTranscript: query,
      normalizedTranscript: normalized,
      afterAccentRemoval: trace.afterAccentRemoval,
      afterSlangNormalization: trace.afterSlangNormalization,
      finalNormalized: trace.finalNormalized,
      detectedLanguage: detectedLang,
    };
    return {
      response,
      debug,
      suggestionChips: chips,
      isCoachingResponse: true,
    };
  }

  const warnings: Array<{ code: string; detail: string }> = [];

  if (pathname && getPageKeyForRoute(pathname) === null) {
    warnings.push({ code: 'missingPageKey', detail: `Missing pageKey for route: ${pathname}` });
  }

  let docs: RetrievedDoc[];
  let response: string;
  let coachingChips: SuggestionChip[] | undefined;

  try {
    docs = searchTrainingHub(normalized, 3);
    response = buildGroundedResponse(normalized, intent, docs, pathname, detectedLang);
  } catch (err) {
    const fallback = buildEmptyStateResponse(detectedLang);
    return {
      response: fallback.response,
      debug: {
        intent,
        rawTranscript: query,
        retrievedDocs: [],
        finalNormalized: trace.finalNormalized,
        detectedLanguage: detectedLang,
        validationWarnings: [...warnings, { code: 'lookupFailed', detail: 'Training Hub lookup failed' }],
      },
      suggestionChips: fallback.chips,
      isCoachingResponse: true,
    };
  }

  const respCheck = validateResponseStructure(response, docs);
  if (!respCheck.valid && respCheck.warning) {
    warnings.push(respCheck.warning);
    const fallback = buildEmptyStateResponse(detectedLang);
    response = fallback.response;
    coachingChips = fallback.chips;
  }

  const debug: AIOrchestratorDebug = {
    intent,
    retrievedDocs: docs,
    rawTranscript: query,
    normalizedTranscript: normalized,
    afterAccentRemoval: trace.afterAccentRemoval,
    afterSlangNormalization: trace.afterSlangNormalization,
    finalNormalized: trace.finalNormalized,
    detectedLanguage: detectedLang,
    executionBlockedReason: executionBlockedReason ?? undefined,
    validationWarnings: warnings.length > 0 ? warnings : undefined,
  };

  return {
    response,
    debug,
    suggestionChips: coachingChips,
    isCoachingResponse: true,
  };
}

