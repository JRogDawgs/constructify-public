/**
 * CEEBO — Skill Registry
 *
 * Central registry of executable skills. Phase 1: keyword-based.
 * No skill executes without orchestrator approval.
 */

import type { Skill, SkillExecutionContext, ActionPlan } from './types';
import { navigateToProjects } from './skills/navigateToProjects';
import { navigateToTasks } from './skills/navigateToTasks';
import { openTaskBuilder } from './skills/openTaskBuilder';
import { createProjectDraft } from './skills/createProjectDraft';
import { createTaskDraft } from './skills/createTaskDraft';

const SKILLS: Skill[] = [
  navigateToProjects,
  navigateToTasks,
  openTaskBuilder,
  createProjectDraft,
  createTaskDraft,
];

const byId = new Map<string, Skill>();
for (const s of SKILLS) {
  byId.set(s.id, s);
}

/** Get skill by ID */
export function getSkill(id: string): Skill | undefined {
  return byId.get(id);
}

/** List all registered skills */
export function listSkills(): Skill[] {
  return [...SKILLS];
}

/** Check if pathname matches any required path pattern */
function matchesContext(skill: Skill, ctx: SkillExecutionContext): boolean {
  const req = skill.requiredContext;
  if (!req?.pathPatterns?.length) return true;

  const path = ctx.pathname.toLowerCase().replace(/\/$/, '') || '/';
  return req.pathPatterns.some((p) => {
    const norm = p.toLowerCase().replace(/\/$/, '') || '/';
    if (norm.endsWith('/*')) {
      const prefix = norm.slice(0, -2);
      return path === prefix || path.startsWith(prefix + '/');
    }
    if (norm.endsWith('*')) {
      const prefix = norm.slice(0, -1);
      return path.startsWith(prefix);
    }
    return path === norm || path.startsWith(norm + '/');
  });
}

/** Get skills that match context. Does NOT score intent. */
export function getSkillsForContext(ctx: SkillExecutionContext): Skill[] {
  return SKILLS.filter((s) => matchesContext(s, ctx));
}
