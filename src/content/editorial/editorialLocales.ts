import type { EditorialLocale } from "./editorialTypes";

export const EDITORIAL_DEFAULT_LOCALE = "es" satisfies EditorialLocale;

export const EDITORIAL_SUPPORTED_LOCALES = ["es", "en"] as const satisfies
  ReadonlyArray<EditorialLocale>;

export function normalizeEditorialLocale(
  locale?: string,
): EditorialLocale {
  return locale === "en" ? "en" : EDITORIAL_DEFAULT_LOCALE;
}
