/**
 * CEEBO — Flow Continuation Handler (Phase 3.5)
 *
 * Handles short ambiguous queries when activeFlow exists.
 * Flow drift guard: if route not valid for flow → clarifying question.
 * No auto-navigation.
 */

import { getSessionState } from './ceeboContextEngine';
import {
  getStepForFlowAndRoute,
  getFlowById,
  isRouteValidForFlow,
  type FlowId,
} from './flowDefinitions';

const AMBIGUOUS_PATTERNS: { en: RegExp[]; es: RegExp[] } = {
  en: [
    /^(now what|what now|what next|and then|ok|next|continue|go on|what do i do)$/i,
    /^(what('s| is) next|what do i do now)$/i,
  ],
  es: [
    /^(ahora qué|qué ahora|qué sigue|y luego|ok|siguiente|continuar|adelante)$/i,
    /^(qué hago ahora|qué sigue|qué debo hacer)$/i,
  ],
};

export function isShortAmbiguousQuery(query: string, lang: 'en' | 'es'): boolean {
  const trimmed = query.trim();
  if (trimmed.length > 25) return false;
  const patterns = lang === 'es' ? AMBIGUOUS_PATTERNS.es : AMBIGUOUS_PATTERNS.en;
  return patterns.some((p) => p.test(trimmed));
}

export interface FlowContinuationResult {
  handled: boolean;
  response?: string;
  chips?: Array<{ label: string; query: string }>;
}

export function handleFlowContinuation(
  query: string,
  pathname: string,
  lang: 'en' | 'es'
): FlowContinuationResult {
  const state = getSessionState();
  if (!state.activeFlow) {
    return { handled: false };
  }

  if (!isShortAmbiguousQuery(query, lang)) {
    return { handled: false };
  }

  const flowId = state.activeFlow as FlowId;
  const flowStepIndex = state.flowStepIndex ?? 1;
  const flow = getFlowById(flowId);
  if (!flow) {
    return { handled: false };
  }

  if (!isRouteValidForFlow(flowId, pathname)) {
    const driftResponse =
      lang === 'es'
        ? 'Ya no estás en la página de proyecto. ¿Quieres seguir creando el proyecto?'
        : "You're no longer on the project page. Want to keep going?";
    const driftResponseTask =
      lang === 'es'
        ? 'Ya no estás en la página de tareas. ¿Quieres seguir creando la tarea?'
        : "You're no longer on the task page. Want to keep going?";
    const driftMsg = flowId === 'create_project' ? driftResponse : driftResponseTask;
    const backChips =
      flowId === 'create_project'
        ? lang === 'es'
          ? { label: 'Llévame de vuelta a Proyectos', query: 'Llévame a proyectos' }
          : { label: 'Take me back to Projects', query: 'Take me to projects' }
        : lang === 'es'
          ? { label: 'Llévame de vuelta a Tareas', query: 'Llévame a tareas' }
          : { label: 'Take me back to Tasks', query: 'Take me to tasks' };
    return {
      handled: true,
      response: driftMsg,
      chips: [
        backChips,
        lang === 'es'
          ? { label: 'Cancelar este flujo', query: 'Cancelar' }
          : { label: 'Cancel this flow', query: 'Cancel' },
      ],
    };
  }

  const step = getStepForFlowAndRoute(flowId, flowStepIndex, pathname);
  if (!step) {
    const routeMismatchResponse =
      lang === 'es'
        ? `Para seguir con ${flow.nameEs}, ve a la página correcta. ¿Dónde estás? Te guío al siguiente paso.`
        : `To continue with ${flow.nameEn}, go to the right page. Where are you now? I can guide you to the next step.`;
    return {
      handled: true,
      response: routeMismatchResponse,
      chips:
        lang === 'es'
          ? [
              { label: 'Llévame a Proyectos', query: 'Llévame a proyectos' },
              { label: 'Llévame a Tareas', query: 'Llévame a tareas' },
            ]
          : [
              { label: 'Take me to projects', query: 'Take me to projects' },
              { label: 'Take me to tasks', query: 'Take me to tasks' },
            ],
    };
  }

  const intro =
    lang === 'es'
      ? `Estás en ${flow.nameEs.toLowerCase()}. `
      : `You're on ${flow.nameEn.toLowerCase()}. `;

  const response = intro + (lang === 'es' ? step.instructionEs : step.instructionEn);

  return {
    handled: true,
    response,
  };
}
