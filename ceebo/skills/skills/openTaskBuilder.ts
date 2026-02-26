/**
 * CEEBO — Open Task Builder
 */

import type { Skill, SkillExecutionContext, ActionPlan } from '../types';

export const openTaskBuilder: Skill = {
  id: 'open_task_builder',
  description: 'Navigate to the Task Builder / assignment flow',
  intentTriggers: {
    keywords: [
      'task builder',
      'task assign',
      'assign a task',
      'assign task',
      'build task',
      'create a task',
    ],
    keywordsEs: [
      'task builder',
      'asignar tarea',
      'crear tarea',
      'construir tarea',
    ],
  },
  requiredPermissions: ['navigate'],
  requiredRoles: ['supervisor', 'admin'],
  requiredContext: {
    pathPatterns: ['/dashboard', '/dashboard/*', '/supervisor/dashboard', '/supervisor/dashboard/*'],
  },
  confirmRequired: false,
  execute(ctx: SkillExecutionContext): ActionPlan {
    const es = ctx.language === 'es';
    return {
      type: 'navigation',
      targetRoute: '/dashboard/tasks/assign',
      requiresConfirmation: false,
      uiHints: [es ? 'Abriendo Task Builder…' : 'Opening Task Builder…'],
    };
  },
};
