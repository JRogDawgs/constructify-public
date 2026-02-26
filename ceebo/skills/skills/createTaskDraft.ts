/**
 * CEEBO — Create Task Draft (Phase 1: scaffold only)
 *
 * Does NOT write to Firestore. Prepares draft, shows preview, asks confirmation.
 * Future: server-side skill execution with explicit user approval.
 */

import type { Skill, SkillExecutionContext, ActionPlan } from '../types';

export const createTaskDraft: Skill = {
  id: 'create_task_draft',
  description: 'Prepare a new task draft and navigate to task assignment',
  intentTriggers: {
    keywords: [
      'create task',
      'new task',
      'add task',
      'make a task',
    ],
    keywordsEs: [
      'crear tarea',
      'nueva tarea',
      'agregar tarea',
    ],
  },
  requiredPermissions: ['create_task'],
  requiredRoles: ['supervisor', 'admin'],
  requiredContext: {
    pathPatterns: ['/dashboard', '/dashboard/*', '/supervisor/dashboard', '/supervisor/dashboard/*'],
  },
  confirmRequired: true,
  execute(ctx: SkillExecutionContext): ActionPlan {
    const es = ctx.language === 'es';
    return {
      type: 'mutation',
      targetRoute: '/dashboard/tasks/assign',
      payload: {
        _phase1Draft: true,
        _source: 'ceebo',
      },
      requiresConfirmation: true,
      confirmationPrompt: es
        ? '¿Quieres que te lleve a crear una nueva tarea?'
        : 'Would you like me to take you to create a new task?',
      uiHints: ['Preparing task creation…', 'I’ll take you to the Task Builder.'],
    };
  },
};
