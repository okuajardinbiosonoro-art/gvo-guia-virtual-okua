import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import * as ts from "typescript";
import { describe, expect, it } from "vitest";
import { resolveEditorialText, type EditorialTextEntry } from "./editorial";
import { getFinalEditorialSlots, type FinalEditorialSlotId } from "./finalEditorialSlots";

const documents = resolve(process.cwd(), "docs/narrative/integracion_autonoma_2026-10-23/revision-observaciones-03");
const translationRaw = readFileSync(resolve(documents, "exchanges/OBS03_MIRADOR_EN_TRANSLATION.json"), "utf8");
const authority = JSON.parse(translationRaw) as {
  translations: Record<string, { en: EditorialTextEntry; sourceEsUtf8Sha256: string; sourceShortTextUtf8Sha256: string }>;
};
const brief = JSON.parse(readFileSync(resolve(documents, "exchanges/23_final-en-source-and-brief.json"), "utf8")) as {
  slots: { id: FinalEditorialSlotId; es: string; esUtf8Sha256: string; shortText: string | null; emitter: string }[];
};
const implementation = JSON.parse(readFileSync(resolve(documents, "entry-transitions/MIRADOR_EN_IMPLEMENTATION.json"), "utf8")) as {
  esBlocks: { id: string; esBlockSha256: string }[];
};
const registryRaw = readFileSync(resolve(process.cwd(), "src/content/editorial/editorialRegistry.ts"), "utf8");
const digest = (text: string) => createHash("sha256").update(text, "utf8").digest("hex");

describe("Mirador ES/EN — conciliación OBS03 D16", () => {
  it("conserva los 35 literales/shortText ES y sus bloques de metadata íntegros", () => {
    expect(digest(translationRaw)).toBe("59701f3480d3ead7a7bcb9e0ff4439d12ccb92f032939bdfe4d20fe8afe5b1c5");
    const es = getFinalEditorialSlots("es");
    expect(Object.keys(es)).toHaveLength(35);
    expect(Object.keys(authority.translations)).toEqual(brief.slots.map((slot) => slot.id));
    for (const source of brief.slots) {
      expect(es[source.id].text).toBe(source.es);
      expect(digest(es[source.id].text)).toBe(source.esUtf8Sha256);
      expect(es[source.id].shortText ?? null).toBe(source.shortText);
      expect(es[source.id].emitter).toBe(source.emitter);
      expect(digest(es[source.id].text)).toBe(authority.translations[source.id].sourceEsUtf8Sha256);
      expect(digest(es[source.id].shortText ?? "")).toBe(authority.translations[source.id].sourceShortTextUtf8Sha256);
    }
    const sourceFile = ts.createSourceFile("registry.ts", registryRaw, ts.ScriptTarget.Latest, true);
    const esBlockHashes = new Map<string, string>();
    function visit(node: ts.Node) {
      if (ts.isPropertyAssignment(node) && ts.isIdentifier(node.name) && node.name.text.startsWith("FINAL_") && ts.isObjectLiteralExpression(node.initializer)) {
        const esProperty = node.initializer.properties.find((property) => ts.isPropertyAssignment(property) && property.name.getText(sourceFile) === "es");
        if (esProperty) esBlockHashes.set(node.name.text, digest(registryRaw.slice(esProperty.getStart(sourceFile), esProperty.end)));
      }
      ts.forEachChild(node, visit);
    }
    visit(sourceFile);
    expect(implementation.esBlocks).toHaveLength(35);
    for (const original of implementation.esBlocks) expect(esBlockHashes.get(original.id)).toBe(original.esBlockSha256);
  });

  it("resuelve todos los EN conciliados sin fallback, incluso la marca idéntica", () => {
    const en = getFinalEditorialSlots("en");
    expect(Object.keys(en)).toEqual(Object.keys(getFinalEditorialSlots("es")));
    for (const id of Object.keys(en) as FinalEditorialSlotId[]) {
      expect(en[id]).toEqual(authority.translations[id].en);
      expect(en[id].shortText?.trim()).toBeTruthy();
      expect(en[id]).toMatchObject({ locale: "en", status: "REVIEW", source: "temporary" });
      expect(resolveEditorialText(id, { locale: "en" })).toMatchObject({ resolvedLocale: "en", requestedLocale: "en", fallbackUsed: false });
    }
    expect(en.FINAL_TITLE_01.text).toBe(getFinalEditorialSlots("es").FINAL_TITLE_01.text);
  });

  it("rechaza claves duplicadas ocultables por JSON.parse o por el registro TS", () => {
    for (const [name, raw, kind] of [["translation.json", translationRaw, ts.ScriptKind.JSON], ["registry.ts", registryRaw, ts.ScriptKind.TS]] as const) {
      const source = ts.createSourceFile(name, raw, ts.ScriptTarget.Latest, true, kind);
      const duplicates: string[] = [];
      function visit(node: ts.Node) {
        if (ts.isObjectLiteralExpression(node)) {
          const keys = node.properties.filter(ts.isPropertyAssignment).map((property) => property.name.getText(source).replace(/^"|"$/g, ""));
          duplicates.push(...keys.filter((key, index) => keys.indexOf(key) !== index));
        }
        ts.forEachChild(node, visit);
      }
      visit(source);
      expect(duplicates, name).toEqual([]);
    }
  });
});
