import { describe, expect, it } from "vitest";
import { parseReply } from "./client";
import { publicEvidence } from "./sources";

function supported(ids = ["GVO-INTRO-01"]) {
  return {
    answer: ids.map((id) => publicEvidence[id].text).join("\n"),
    citations: ids.map((id) => ({ chunk_id: id, ...publicEvidence[id] })),
    policy_result: "ALLOW_RESPONSE",
    grounding_status: "SUPPORTED",
    model_adapter: "DeterministicGroundedAdapter",
    knowledge_bundle_version: "0.1.0",
    trace_id: "12345678-1234-1234-1234-123456789abc",
    error_category: null,
  };
}
describe("visitor response validation", () => {
  it("exposes only approved labels and literal extracts for one or several sources", () => {
    const reply = parseReply(supported(["GVO-INTRO-01", "GVO-MIRADOR-02"]));
    expect(reply.state).toBe("supported");
    expect(reply.citations).toHaveLength(2);
    expect(Object.keys(reply.citations[0])).toEqual(["label", "excerpt"]);
    expect(reply.citations[0].label).toBe(
      "Lía y la introducción al Archivo Vivo",
    );
  });
  it.each([
    null,
    {},
    { ...supported(), answer: "<img src=x onerror=alert(1)>" },
    { ...supported(), citations: [] },
    { ...supported(), model_adapter: "other" },
    { ...supported(), knowledge_bundle_version: "future" },
    {
      ...supported(),
      citations: [{ ...supported().citations[0], source_digest: "changed" }],
    },
    supported(["GVO-INTRO-01", "GVO-INTRO-01"]),
    { ...supported(), error_category: "BUSY" },
  ])("fails closed on malformed or ungrounded replies %#", (value) => {
    expect(() => parseReply(value)).toThrow();
  });
  it("accepts an exact safe abstention without sources", () => {
    const reply = parseReply({
      ...supported(),
      policy_result: "ABSTAIN_UNSUPPORTED",
      grounding_status: "UNSUPPORTED",
      answer:
        "No tengo evidencia suficiente en el conocimiento público aprobado para responder esa consulta.",
      citations: [],
    });
    expect(reply.state).toBe("abstain");
  });
});
