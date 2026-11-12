import { useState } from "react";
import type { LiaReply } from "./client";
import { publicEvidence } from "./sources";

const label = "TARGET_SIMULATION · ejemplo local, sin IA generativa";
/** Entire module is dynamically imported only in DEV with explicit opt-in. */
export default function TargetReview({
  onChange,
}: {
  onChange: (reply: LiaReply | null, label: string) => void;
}) {
  const [mode, setMode] = useState("current");
  function choose(value: string) {
    setMode(value);
    const source = publicEvidence["GVO-INTRO-02"];
    const replies: Record<string, LiaReply> = {
      simple: {
        state: "supported",
        answer:
          "Visitaremos cinco salas para descubrir cómo se unen plantas, arte y tecnología. Nuestro viaje empieza en la raíz. ¿Quieres volver a esa sala?",
        citations: [source, publicEvidence["GVO-INTRO-03"]].map((s) => ({
          label: s.label,
          excerpt: s.text,
        })),
      },
      technical: {
        state: "supported",
        answer:
          "La introducción presenta plantas, arte y tecnología. El recorrido conserva las salas en orden y permite volver a ellas al final. Estos fragmentos no describen un mecanismo biológico; no tengo evidencia aquí para ampliarlo.",
        citations: [
          {
            label: publicEvidence["GVO-INTRO-04"].label,
            excerpt: publicEvidence["GVO-INTRO-04"].text,
          },
        ],
      },
      unknown: {
        state: "abstain",
        answer:
          "No tengo una identificación botánica aprobada para esa planta. Prefiero dejarlo como una pregunta pendiente.",
        citations: [],
      },
      refusal: {
        state: "refused",
        answer:
          "No puedo ejecutar acciones ni revelar información privada. Podemos volver a los contenidos públicos del recorrido.",
        citations: [],
      },
    };
    onChange(replies[value] ?? null, label);
  }
  return (
    <aside
      className="lia-preview__target-controls"
      aria-label="Laboratorio local de conversación"
    >
      <strong>{mode === "current" ? "CURRENT_SAFE_EXTRACTIVE" : label}</strong>
      <label>
        Ejemplo para revisar
        <select value={mode} onChange={(event) => choose(event.target.value)}>
          <option value="current">Extractos reales del Core</option>
          <option value="simple">TARGET · explicación sencilla</option>
          <option value="technical">TARGET · explicación técnica</option>
          <option value="unknown">TARGET · incertidumbre</option>
          <option value="refusal">TARGET · rechazo seguro</option>
        </select>
      </label>
      <p>
        En TARGET, cualquier pregunta muestra el ejemplo elegido. Son fixtures
        de diseño, sin red ni respuesta generada.
      </p>
    </aside>
  );
}
