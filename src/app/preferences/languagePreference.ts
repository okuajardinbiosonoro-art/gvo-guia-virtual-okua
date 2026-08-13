export const GVO_LANGUAGE_STORAGE_KEY = "gvo.language.v1";

export type GvoLanguage = "es" | "en";

const supportedLanguages = new Set<GvoLanguage>(["es", "en"]);

function getLocalStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function isGvoLanguage(value: unknown): value is GvoLanguage {
  return (
    typeof value === "string" && supportedLanguages.has(value as GvoLanguage)
  );
}

export function readLanguagePreference(): GvoLanguage | null {
  const storage = getLocalStorage();
  if (!storage) {
    return null;
  }

  try {
    const value = storage.getItem(GVO_LANGUAGE_STORAGE_KEY);
    return isGvoLanguage(value) ? value : null;
  } catch {
    return null;
  }
}

export function writeLanguagePreference(language: GvoLanguage): boolean {
  const storage = getLocalStorage();
  if (!storage) {
    return false;
  }

  try {
    storage.setItem(GVO_LANGUAGE_STORAGE_KEY, language);
    return true;
  } catch {
    return false;
  }
}

export function applyDocumentLanguage(
  language: GvoLanguage | null = readLanguagePreference(),
): GvoLanguage {
  const resolvedLanguage = language ?? "es";

  if (typeof document !== "undefined") {
    document.documentElement.lang = resolvedLanguage;
  }

  return resolvedLanguage;
}
