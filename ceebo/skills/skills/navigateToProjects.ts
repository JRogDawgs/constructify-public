/**
 * CEEBO — Navigate to Projects
 */

import type { Skill, SkillExecutionContext, ActionPlan } from '../types';

export const navigateToProjects: Skill = {
  id: 'navigate_to_projects',
  description: 'Navigate user to the Projects list or project creation flow',
  intentTriggers: {
    keywords: [
      'projects',
      'project',
      'show projects',
      'go to projects',
      'open projects',
      'projects list',
      'create project',
      'new project',
    ],
    keywordsEs: [
      'proyectos',
      'proyecto',
      'ver proyectos',
      'ir a proyectos',
      'abrir proyectos',
      'lista de proyectos',
      'crear proyecto',
      'nuevo proyecto',
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
    const isCreate =
      lower.includes('create') ||
      lower.includes('new') ||
      lower.includes('crear') ||
      lower.includes('nuevo');
    const es = ctx.language === 'es';
    return {
      type: 'navigation',
      targetRoute: isCreate ? '/dashboard/projects/create' : '/dashboard/projects',
      requiresConfirmation: false,
      uiHints: [
        isCreate
          ? es
            ? 'Abriendo creación de proyecto…'
            : 'Opening project creation…'
          : es
            ? 'Yendo a Proyectos…'
            : 'Going to Projects…',
      ],
    };
  },
};
