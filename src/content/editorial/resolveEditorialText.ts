import {
  EDITORIAL_DEFAULT_LOCALE,
  normalizeEditorialLocale,
} from "./editorialLocales";
import { editorialRegistry } from "./editorialRegistry";
import type { EditorialSlotId } from "./editorialRegistry";
import type { ResolvedEditorialText } from "./editorialTypes";

type ResolveEditorialTextOptions = {
  locale?: string;
};

export function resolveEditorialText<SlotId extends EditorialSlotId>(
  slotId: SlotId,
  options: ResolveEditorialTextOptions = {},
): ResolvedEditorialText<SlotId> {
  const requestedLocale = normalizeEditorialLocale(options.locale);
  const localizedEntries = editorialRegistry[slotId];

  if (!localizedEntries) {
    throw new Error(`Editorial slot not registered: ${slotId}`);
  }

  const directEntry = localizedEntries[requestedLocale];

  if (directEntry) {
    return {
      ...directEntry,
      fallbackUsed: false,
      requestedLocale,
      resolvedLocale: requestedLocale,
    } as ResolvedEditorialText<SlotId>;
  }

  const fallbackEntry = localizedEntries[EDITORIAL_DEFAULT_LOCALE];

  if (!fallbackEntry) {
    throw new Error(
      `Editorial slot ${slotId} has no ${EDITORIAL_DEFAULT_LOCALE} fallback`,
    );
  }

  return {
    ...fallbackEntry,
    fallbackUsed: true,
    requestedLocale,
    resolvedLocale: EDITORIAL_DEFAULT_LOCALE,
  } as ResolvedEditorialText<SlotId>;
}
