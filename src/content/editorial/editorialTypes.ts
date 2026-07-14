export type EditorialLocale = "es" | "en";

export type EditorialStatus = "TEMP" | "DRAFT" | "REVIEW" | "APPROVED" | "FINAL";

export type EditorialSource =
  | "temporary"
  | "editorial_excel"
  | "human_approved"
  | "fallback";

export type EditorialEmitter = "ambiente" | "interfaz" | "lia" | "sistema";

export type EditorialTextEntry<SlotId extends string = string> = {
  emitter: EditorialEmitter;
  locale: EditorialLocale;
  notes: string;
  shortText?: string;
  slotId: SlotId;
  source: EditorialSource;
  status: EditorialStatus;
  text: string;
};

export type EditorialRegistry = Record<
  string,
  Partial<Record<EditorialLocale, EditorialTextEntry>>
>;

export type ResolvedEditorialText<SlotId extends string = string> =
  EditorialTextEntry<SlotId> & {
    fallbackUsed: boolean;
    requestedLocale: EditorialLocale;
    resolvedLocale: EditorialLocale;
  };
