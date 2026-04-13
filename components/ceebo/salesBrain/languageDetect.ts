/** Lightweight hint for future Spanish copy — no API translation. */
export type ChatLangHint = "en" | "es"

const SPANISH_HINT =
  /\b(como|trabajo|equipo|empleados|proyecto|horas|cuanto|cuánto|donde|dónde|necesito|ayuda|obreros|nómina|reloj|jornada|español|espanol|spanish)\b/i

export function detectChatLanguage(raw: string): ChatLangHint {
  if (SPANISH_HINT.test(raw)) return "es"
  return "en"
}

/** Shown once per session when Spanish-like input is detected; replies stay English for now. */
export function spanishFoundationLine(): string {
  return `\n\n🚀 Want this walkthrough in Spanish? Say "español"—English answers for now.`
}
