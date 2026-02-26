/**
 * CEEBO — Navigate to Tasks
 */

import type { Skill, SkillExecutionContext, ActionPlan } from '../types';

export const navigateToTasks: Skill = {
  id: 'navigate_to_tasks',
  description: 'Navigate user to task assignment or task list',
  intentTriggers: {
    keywords: [
      'tasks',
      'task',
      'assign task',
      'task assignment',
      'go to tasks',
      'open tasks',
      'create task',
      'new task',
    ],
    keywordsEs: [
      'tareas',
      'tarea',
      'asignar tarea',
      'asignación de tareas',
      'ir a tareas',
      'abrir tareas',
      'crear tarea',
      'nueva tarea',
    ],
  },
  requiredPermissions: ['navigate'],
  requiredRoles: ['worker', 'supervisor', 'admin'],
  requiredContext: {
    pathPatterns: ['/dashboard', '/dashboard/*', '/worker/dashboard', '/worker/dashboard/*', '/supervisor/dashboard', '/supervisor/dashboard/*'],
  },
  confirmRequired: false,
  execute(ctx: SkillExecutionContext): ActionPlan {
    const lower = ctx.normalizedQuery.toLowerCase();
    const isAssign = lower.includes('assign') || lower.includes('asignar');
    const es = ctx.language === 'es';
    return {
      type: 'navigation',
      targetRoute: isAssign ? '/dashboard/tasks/assign' : '/dashboard',
      requiresConfirmation: false,
      uiHints: [
        isAssign
          ? es
            ? 'Abriendo asignación de tareas…'
            : 'Opening Task Assignment…'
          : es
            ? 'Yendo a Tareas…'
            : 'Going to Tasks…',
      ],
    };
  },
};
