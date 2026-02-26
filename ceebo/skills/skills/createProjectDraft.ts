/**
 * CEEBO — Create Project Draft (Phase 1: scaffold only)
 *
 * Does NOT write to Firestore. Prepares draft, shows preview, asks confirmation.
 * Future: server-side skill execution with explicit user approval.
 */

import type { Skill, SkillExecutionContext, ActionPlan } from '../types';

export const createProjectDraft: Skill = {
  id: 'create_project_draft',
  description: 'Prepare a new project draft and navigate to creation flow',
  intentTriggers: {
    keywords: [
      'create project',
      'new project',
      'start project',
      'add project',
      'make a project',
    ],
    keywordsEs: [
      'crear proyecto',
      'nuevo proyecto',
      'empezar proyecto',
      'agregar proyecto',
    ],
  },
  requiredPermissions: ['create_project'],
  requiredRoles: ['supervisor', 'admin'],
  requiredContext: {
    pathPatterns: ['/dashboard', '/dashboard/*', '/supervisor/dashboard', '/supervisor/dashboard/*'],
  },
  confirmRequired: true,
  execute(ctx: SkillExecutionContext): ActionPlan {
    const es = ctx.language === 'es';
    return {
      type: 'mutation',
      targetRoute: '/dashboard/projects/create',
      payload: {
        _phase1Draft: true,
        _source: 'ceebo',
        name: null,
        description: null,
      },
      requiresConfirmation: true,
      confirmationPrompt: es
        ? '¿Quieres que te lleve a crear un nuevo proyecto?'
        : 'Would you like me to take you to create a new project?',
      uiHints: es
        ? ['Preparando creación de proyecto…', 'Te llevo al formulario de creación.']
        : ['Preparing project creation…', 'I’ll take you to the project creation form.'],
    };
  },
};
