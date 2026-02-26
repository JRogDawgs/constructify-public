/**
 * CEEBO — Response translation wrapper (Phase 1)
 *
 * Phrase-level mapping for known CEEBO responses.
 * NOT full i18n. Wrapper only. Add phrases as needed.
 */

import type { DetectedLanguage } from './detectLanguage';

const ES_MAP: Record<string, string> = {
  "Got it — you want to see your projects. I'll take you there.": "Entendido — quieres ver tus proyectos. Te llevo ahí.",
  "Got it — you want to see your projects. Going to Projects…": "Entendido — quieres ver tus proyectos. Yendo a Proyectos…",
  "Got it — you want to work on tasks. I'll take you there.": "Entendido — quieres trabajar en tareas. Te llevo ahí.",
  "Got it — you want to work on tasks. Going to Tasks…": "Entendido — quieres trabajar en tareas. Yendo a Tareas…",
  "Got it — I'll take you to the Task Builder. I'll take you there.": "Entendido — te llevo al Task Builder. Te llevo ahí.",
  "Got it — I'll take you to the Task Builder. Opening Task Builder…": "Entendido — te llevo al Task Builder. Abriendo Task Builder…",
  "Would you like me to take you to create a new project?": "¿Quieres que te lleve a crear un nuevo proyecto?",
  "Would you like me to take you to create a new task?": "¿Quieres que te lleve a crear una nueva tarea?",
  "Got it — you want to create a new project.": "Entendido — quieres crear un nuevo proyecto.",
  "Got it — you want to create a new task.": "Entendido — quieres crear una nueva tarea.",
  "I'll take you there.": "Te llevo ahí.",
};

/**
 * Translate known CEEBO phrases to Spanish.
 * Returns original if no mapping. No LLM, no external calls.
 */
export function translateResponse(text: string, lang: DetectedLanguage): string {
  if (lang !== 'es') return text;
  return ES_MAP[text] ?? text;
}
