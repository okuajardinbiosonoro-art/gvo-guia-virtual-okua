import { describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

import { publicEvidence } from "./sources";
import { parseReply } from "./client";

describe("candidate knowledge reconciliation", () => {
  it("keeps the disabled preview catalogue aligned with its own historical editorial revision", () => {
    const path = "docs/narrative/integracion_autonoma_2026-10-23/revision-observaciones-03/entry-transitions/lia-catalog-obs03/manifest.json";
    const manifest = JSON.parse(readFileSync(path, "utf8")) as {
      provenance: Array<{ chunk: string; consumerTextSha256: string }>;
    };
    expect(Object.keys(publicEvidence)).toEqual(manifest.provenance.map(({ chunk }) => chunk));
    for (const { chunk, consumerTextSha256 } of manifest.provenance) {
      expect(createHash("sha256").update(publicEvidence[chunk].text, "utf8").digest("hex")).toBe(consumerTextSha256);
    }
    expect(publicEvidence["GVO-APRENDIZAJE-03"].section).toBe("functional_physical_practice_optional");
    expect(Object.values(publicEvidence).map((source) => source.text).join("\n")).not.toMatch(/Respira a tu ritmo|Respira inalhando|accidentes cardiovasculares|Regulación del sistema nervioso|Terminaste tu práctica/);
  });

  it("verifies ordered group digests and identifies the reconciled local candidate without approval", () => {
    expect(Object.keys(publicEvidence)).toHaveLength(21);
    for (const id of new Set(Object.values(publicEvidence).map((source) => source.source_id))) {
      const group = Object.values(publicEvidence).filter((source) => source.source_id === id);
      const digest = createHash("sha256").update(group.map((source) => source.text).join("\n"), "utf8").digest("hex");
      for (const source of group) expect(source).toMatchObject({ source_digest: digest, source_version: "gvo-obs03.2-editorial-candidate-2026-10-24", freshness: "REVIEW" });
    }
  });

  it.each(["gvo-1251a4fd789193e51183a03e29cbb8971d50302d", "gvo-editorial-candidate-2026-10-23"])("rejects the previous service source version %s", (version) => {
    const source = publicEvidence["GVO-INTRO-01"];
    expect(source.freshness).toBe("REVIEW");
    expect(() => parseReply({
      answer: source.text,
      citations: [{ chunk_id: "GVO-INTRO-01", ...source, source_version: version }],
      model_adapter: "DeterministicGroundedAdapter",
      knowledge_bundle_version: "0.1.0",
      trace_id: "00000000-0000-4000-8000-000000000000",
      error_category: null,
      policy_result: "ALLOW_RESPONSE",
      grounding_status: "SUPPORTED",
    })).toThrow("unavailable");
  });
});
