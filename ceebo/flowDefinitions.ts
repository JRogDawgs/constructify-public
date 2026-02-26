/**
 * CEEBO — Flow Definitions (Phase 3.5)
 *
 * Instructional step sequences + valid route map for drift guard.
 * No auto-execution.
 */

export type FlowId = 'create_project' | 'create_task';

/** Phase 3.5: Routes valid for each flow. User must be on one of these to continue. */
export const FLOW_ROUTE_MAP: Record<FlowId, string[]> = {
  create_project: [
    '/dashboard/projects',
    '/dashboard/projects/create',
    '/dashboard/projects/', // [projectId] detail
  ],
  create_task: [
    '/dashboard/tasks',
    '/dashboard/tasks/assign',
    '/dashboard/tasks/create',
    '/dashboard/tasks/', // [taskId] detail
  ],
};

/** Phase 3.5: Check if current route is valid for the given flow. */
export function isRouteValidForFlow(
  activeFlow: string | null,
  currentRoute: string
): boolean {
  if (!activeFlow || !(activeFlow in FLOW_ROUTE_MAP)) return false;
  const valid = FLOW_ROUTE_MAP[activeFlow as FlowId];
  if (!valid?.length) return false;
  const routeNorm = (currentRoute || '').toLowerCase().replace(/\/$/, '') || '/';
  for (const pattern of valid) {
    const p = pattern.toLowerCase().replace(/\/$/, '');
    if (routeNorm === p) return true;
    if (p.endsWith('/') && routeNorm.startsWith(p)) return true;
    if (routeNorm.startsWith(p + '/')) return true;
  }
  return false;
}

export interface FlowStep {
  index: number;
  /** Route where this step is relevant (prefix match) */
  routePattern: string;
  instructionEn: string;
  instructionEs: string;
}

export interface FlowDefinition {
  id: FlowId;
  nameEn: string;
  nameEs: string;
  steps: FlowStep[];
}

export const FLOW_DEFINITIONS: Record<FlowId, FlowDefinition> = {
  create_project: {
    id: 'create_project',
    nameEn: 'Create a new project',
    nameEs: 'Crear un proyecto nuevo',
    steps: [
      { index: 1, routePattern: '/dashboard/projects', instructionEn: 'Click the "New Project" button in the top right.', instructionEs: 'Haz clic en el botón "New Project" arriba a la derecha.' },
      { index: 2, routePattern: '/dashboard/projects/create', instructionEn: 'Enter the project name in the field at the top.', instructionEs: 'Ingresa el nombre del proyecto en el campo superior.' },
      { index: 3, routePattern: '/dashboard/projects/create', instructionEn: 'Add the required address: street, city, state, zip.', instructionEs: 'Agrega la dirección: calle, ciudad, estado, código postal.' },
      { index: 4, routePattern: '/dashboard/projects/', instructionEn: 'Open the "Team" tab. Assign team members.', instructionEs: 'Abre la pestaña "Team". Asigna miembros del equipo.' },
      { index: 5, routePattern: '/dashboard/projects/', instructionEn: 'Click "Save" or "Create Project" to finish.', instructionEs: 'Haz clic en "Save" o "Create Project" para terminar.' },
    ],
  },
  create_task: {
    id: 'create_task',
    nameEn: 'Create a new task',
    nameEs: 'Crear una tarea nueva',
    steps: [
      { index: 1, routePattern: '/dashboard/tasks', instructionEn: 'Click "Assign Task" or open the Task Builder.', instructionEs: 'Haz clic en "Assign Task" o abre el Task Builder.' },
      { index: 2, routePattern: '/dashboard/tasks/assign', instructionEn: 'Select a project from the dropdown. Enter task name and description.', instructionEs: 'Selecciona un proyecto del menú. Ingresa nombre y descripción.' },
      { index: 3, routePattern: '/dashboard/tasks/assign', instructionEn: 'Assign workers. Click "Save" to create the task.', instructionEs: 'Asigna trabajadores. Haz clic en "Save" para crear.' },
      { index: 4, routePattern: '/dashboard/tasks/', instructionEn: 'View the task in the list or assign it to more workers.', instructionEs: 'Ver la tarea en la lista o asignarla a más trabajadores.' },
    ],
  },
};

export function getStepForFlowAndRoute(
  flowId: FlowId,
  flowStepIndex: number,
  currentRoute: string
): FlowStep | null {
  const flow = FLOW_DEFINITIONS[flowId];
  if (!flow) return null;
  const step = flow.steps.find((s) => s.index === flowStepIndex);
  if (!step) return null;
  const routeNorm = (currentRoute || '').toLowerCase().replace(/\/$/, '') || '/';
  const patternNorm = step.routePattern.toLowerCase().replace(/\/$/, '') || '/';
  if (routeNorm === patternNorm || routeNorm.startsWith(patternNorm + '/')) {
    return step;
  }
  if (patternNorm.endsWith('/') && routeNorm.startsWith(patternNorm)) return step;
  return null;
}

export function getFlowById(flowId: FlowId): FlowDefinition | null {
  return FLOW_DEFINITIONS[flowId] ?? null;
}
