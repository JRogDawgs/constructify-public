/**
 * CEEBO — Response Builder (Phase 1.9 Launch Behavior Lock)
 *
 * Structure: Acknowledge intent → Confirm action → Execute statement → Offer next suggestion.
 * Bilingual (EN/ES). No robotic phrasing. Suggestion chip mappings.
 */

import type { SkillMatchResult, ActionPlan, Skill } from './skills';
import type { SuggestionChip } from './ceebo.types';

/** Skill ID → next-suggestion chips (EN label, query). Max 28 chars, verb-led, no trailing punctuation. */
const SKILL_NEXT_SUGGESTIONS: Record<
  string,
  { en: { label: string; query: string }[]; es: { label: string; query: string }[] }
> = {
  navigate_to_projects: {
    en: [
      { label: 'Create new project', query: 'Create a new project' },
      { label: 'View reports', query: 'Where do I view reports?' },
      { label: 'Assign team members', query: 'How do I assign team members?' },
    ],
    es: [
      { label: 'Crear proyecto nuevo', query: 'Crear proyecto nuevo' },
      { label: 'Ver reportes', query: '¿Dónde veo los reportes?' },
      { label: 'Asignar equipo', query: '¿Cómo asigno miembros del equipo?' },
    ],
  },
  navigate_to_tasks: {
    en: [
      { label: 'Create new task', query: 'Create a new task' },
      { label: 'View projects', query: 'Take me to projects' },
      { label: 'Assign task', query: 'Assign a task' },
    ],
    es: [
      { label: 'Crear tarea nueva', query: 'Crear tarea nueva' },
      { label: 'Ver proyectos', query: 'Llévame a proyectos' },
      { label: 'Asignar tarea', query: 'Asignar tarea' },
    ],
  },
  open_task_builder: {
    en: [
      { label: 'View projects', query: 'Take me to projects' },
      { label: 'Create new task', query: 'Create a new task' },
      { label: 'View reports', query: 'Where do I view reports?' },
    ],
    es: [
      { label: 'Ver proyectos', query: 'Llévame a proyectos' },
      { label: 'Crear tarea nueva', query: 'Crear tarea nueva' },
      { label: 'Ver reportes', query: '¿Dónde veo los reportes?' },
    ],
  },
  create_project_draft: {
    en: [
      { label: 'View projects', query: 'Take me to projects' },
      { label: 'Create new task', query: 'Create a new task' },
    ],
    es: [
      { label: 'Ver proyectos', query: 'Llévame a proyectos' },
      { label: 'Crear tarea nueva', query: 'Crear tarea nueva' },
    ],
  },
  create_task_draft: {
    en: [
      { label: 'View tasks', query: 'Take me to tasks' },
      { label: 'View projects', query: 'Take me to projects' },
    ],
    es: [
      { label: 'Ver tareas', query: 'Llévame a tareas' },
      { label: 'Ver proyectos', query: 'Llévame a proyectos' },
    ],
  },
};

/** Default suggestion chips when unclear / empty-state. Max 28 chars, verb-led. */
const EMPTY_STATE_CHIPS = {
  en: [
    { label: 'Take me to projects', query: 'Take me to projects' },
    { label: 'Take me to tasks', query: 'Take me to tasks' },
    { label: 'How do I schedule', query: 'How do I schedule a worker?' },
  ],
  es: [
    { label: 'Llévame a proyectos', query: 'Llévame a proyectos' },
    { label: 'Llévame a tareas', query: 'Llévame a tareas' },
    { label: '¿Cómo programo', query: '¿Cómo programo un trabajador?' },
  ],
};

/** Skill → clarifying chip when blocked (low confidence) */
function getClarifyingChipForSkill(skill: Skill, lang: 'en' | 'es'): SuggestionChip {
  const id = skill.id;
  const m: Record<string, { en: SuggestionChip; es: SuggestionChip }> = {
    navigate_to_projects: {
      en: { label: 'Yes, take me to Projects', query: 'Take me to projects' },
      es: { label: 'Sí, llévame a Proyectos', query: 'Llévame a proyectos' },
    },
    navigate_to_tasks: {
      en: { label: 'Yes, take me to Tasks', query: 'Take me to tasks' },
      es: { label: 'Sí, llévame a Tareas', query: 'Llévame a tareas' },
    },
    open_task_builder: {
      en: { label: 'Yes, open Task Builder', query: 'Open task builder' },
      es: { label: 'Sí, abrir Task Builder', query: 'Abrir task builder' },
    },
  };
  const entry = m[id];
  if (entry) return lang === 'es' ? entry.es : entry.en;
  return lang === 'es'
    ? { label: 'Sí, continuar', query: skill.intentTriggers.keywordsEs?.[0] ?? skill.intentTriggers.keywords[0] ?? '' }
    : { label: 'Yes, continue', query: skill.intentTriggers.keywords[0] ?? '' };
}

/** Skill → human-readable destination for clarifying question */
function getDestinationLabel(skill: Skill, lang: 'en' | 'es'): string {
  const m: Record<string, { en: string; es: string }> = {
    navigate_to_projects: { en: 'Projects', es: 'Proyectos' },
    navigate_to_tasks: { en: 'Tasks', es: 'Tareas' },
    open_task_builder: { en: 'Task Builder', es: 'Task Builder' },
  };
  const entry = m[skill.id];
  return entry ? (lang === 'es' ? entry.es : entry.en) : skill.id;
}

export function buildSkillResponse(match: SkillMatchResult, lang: 'en' | 'es'): {
  response: string;
  chips: SuggestionChip[];
} {
  const { skill, actionPlan } = match;
  const chips = getChipsForSkill(skill.id, lang);

  if (actionPlan.requiresConfirmation && actionPlan.confirmationPrompt) {
    return { response: actionPlan.confirmationPrompt, chips: [] };
  }

  const hint = actionPlan.uiHints?.[0];
  const destLabel = getDestinationLabel(skill, lang);

  const templates: Record<string, { en: string; es: string }> = {
    navigate_to_projects: {
      en: `Alright, let's take a look at your projects. I'll take you there now. Click the "New Project" button in the top right to create one.`,
      es: `Bien, vamos a ver tus proyectos. Te llevo ahora. Haz clic en el botón "New Project" arriba a la derecha para crear uno.`,
    },
    navigate_to_tasks: {
      en: `Alright, let's work on tasks. I'll take you to the Tasks page now. Assign tasks or create new ones from there.`,
      es: `Bien, vamos a las tareas. Te llevo ahora. Asigna tareas o crea nuevas desde ahí.`,
    },
    open_task_builder: {
      en: `Alright, I'll take you to the Task Builder now. Assign tasks to your team from there.`,
      es: `Bien, te llevo al Task Builder ahora. Asigna tareas a tu equipo desde ahí.`,
    },
    create_project_draft: {
      en: `Alright, let's create a new project. I'll take you to project creation.`,
      es: `Bien, vamos a crear un proyecto. Te llevo a la creación.`,
    },
    create_task_draft: {
      en: `Alright, let's create a new task. I'll take you to task creation.`,
      es: `Bien, vamos a crear una tarea. Te llevo a la creación.`,
    },
  };

  const t = templates[skill.id];
  const response = t
    ? lang === 'es'
      ? t.es
      : t.en
    : lang === 'es'
      ? `${hint ?? 'Te llevo ahí.'}`
      : `${hint ?? "I'll take you there."}`;

  return { response, chips };
}

function getChipsForSkill(skillId: string, lang: 'en' | 'es'): SuggestionChip[] {
  const def = SKILL_NEXT_SUGGESTIONS[skillId];
  if (!def) return [];
  const arr = lang === 'es' ? def.es : def.en;
  return arr.slice(0, 3).map(({ label, query }) => ({ label, query }));
}

/** Empty-state coaching when unclear */
export function buildEmptyStateResponse(lang: 'en' | 'es'): {
  response: string;
  chips: SuggestionChip[];
} {
  const response =
    lang === 'es'
      ? '¿En qué puedo ayudarte? Aquí hay algunas opciones:'
      : "What would you like to do? Here are a few options:";
  const chips = EMPTY_STATE_CHIPS[lang];
  return { response, chips };
}

/** Low-confidence clarifying. Tone: calm, confident. */
export function buildClarifyingResponse(blockedSkill: Skill, lang: 'en' | 'es'): {
  response: string;
  chips: SuggestionChip[];
} {
  const dest = getDestinationLabel(blockedSkill, lang);
  const response =
    lang === 'es'
      ? `Solo para confirmar — ¿quieres ir a ${dest}?`
      : `Just to confirm — did you mean you want to go to ${dest}?`;
  const chips = [getClarifyingChipForSkill(blockedSkill, lang)];
  return { response, chips };
}
