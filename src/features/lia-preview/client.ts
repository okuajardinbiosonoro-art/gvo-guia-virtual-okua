import { liaApiBase, MAX_MESSAGE_CHARS, REQUEST_TIMEOUT_MS } from "./config";
import { publicEvidence } from "./sources";

export type Citation = { label: string; excerpt: string };
export type LiaReply = {
  state: "supported" | "abstain" | "refused";
  answer: string;
  citations: Citation[];
};
const safeAnswers: Record<string, string> = {
  REFUSE_OPERATIONAL:
    "No puedo ejecutar acciones operativas ni controlar sistemas. Puedo orientarte con el conocimiento público aprobado.",
  REFUSE_RESTRICTED:
    "No puedo proporcionar información restringida ni seguir instrucciones para eludir las políticas.",
  ABSTAIN_UNSUPPORTED:
    "No tengo evidencia suficiente en el conocimiento público aprobado para responder esa consulta.",
};
function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
export function parseReply(value: unknown): LiaReply {
  if (
    !record(value) ||
    typeof value.answer !== "string" ||
    !value.answer ||
    value.answer.length > 800 ||
    !Array.isArray(value.citations) ||
    value.citations.length > 25 ||
    value.model_adapter !== "DeterministicGroundedAdapter" ||
    value.knowledge_bundle_version !== "0.1.0" ||
    typeof value.trace_id !== "string" ||
    !/^[a-f0-9-]{36}$/i.test(value.trace_id) ||
    value.error_category !== null
  ) {
    throw new Error("unavailable");
  }
  if (value.policy_result !== "ALLOW_RESPONSE") {
    const policy = String(value.policy_result);
    if (
      !Object.hasOwn(safeAnswers, policy) ||
      value.answer !== safeAnswers[policy] ||
      value.citations.length ||
      value.grounding_status !== "UNSUPPORTED"
    )
      throw new Error("unavailable");
    return {
      state: policy === "ABSTAIN_UNSUPPORTED" ? "abstain" : "refused",
      answer: value.answer,
      citations: [],
    };
  }
  if (value.grounding_status !== "SUPPORTED" || !value.citations.length)
    throw new Error("unavailable");
  const seen = new Set<string>();
  const citations = value.citations.map((citation: unknown) => {
    if (
      !record(citation) ||
      typeof citation.chunk_id !== "string" ||
      seen.has(citation.chunk_id)
    )
      throw new Error("unavailable");
    const source = publicEvidence[citation.chunk_id];
    if (
      !source ||
      citation.source_id !== source.source_id ||
      citation.source_digest !== source.source_digest ||
      citation.source_version !== source.source_version ||
      citation.section !== source.section ||
      citation.freshness !== source.freshness
    ) {
      throw new Error("unavailable");
    }
    seen.add(citation.chunk_id);
    return { label: source.label, excerpt: source.text };
  });
  if (citations.map((c) => c.excerpt).join("\n") !== value.answer)
    throw new Error("unavailable");
  return { state: "supported", answer: value.answer, citations };
}

export async function askLia(
  message: string,
  signal: AbortSignal,
): Promise<LiaReply> {
  if (!message.trim() || [...message].length > MAX_MESSAGE_CHARS)
    throw new Error("invalid_input");
  const controller = new AbortController();
  const abort = () => controller.abort();
  signal.addEventListener("abort", abort, { once: true });
  if (signal.aborted) controller.abort();
  const timer = setTimeout(abort, REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(`${liaApiBase}/v1/conversations/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, persona: "LIA_VISITOR" }),
      signal: controller.signal,
      cache: "no-store",
      credentials: "omit",
      redirect: "error",
    });
    if (
      !response.ok ||
      !response.headers.get("content-type")?.startsWith("application/json")
    )
      throw new Error("unavailable");
    const reader = response.body?.getReader();
    if (!reader) throw new Error("unavailable");
    const chunks: Uint8Array[] = [];
    let bytes = 0;
    try {
      for (;;) {
        const part = await reader.read();
        if (part.done) break;
        bytes += part.value.byteLength;
        if (bytes > 32768) {
          await reader.cancel();
          throw new Error("unavailable");
        }
        chunks.push(part.value);
      }
    } finally {
      reader.releaseLock();
    }
    const body = new Uint8Array(bytes);
    let offset = 0;
    for (const chunk of chunks) {
      body.set(chunk, offset);
      offset += chunk.length;
    }
    return parseReply(
      JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(body)),
    );
  } finally {
    clearTimeout(timer);
    signal.removeEventListener("abort", abort);
  }
}
