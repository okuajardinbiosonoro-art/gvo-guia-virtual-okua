import { MobileShell } from "../../components/layout/MobileShell";
import type { FlowStep } from "../../data/flow";

interface LoadingInitialPlaceholderProps {
  flowSteps: FlowStep[];
}

export function LoadingInitialPlaceholder({
  flowSteps,
}: LoadingInitialPlaceholderProps) {
  return (
    <MobileShell eyebrow="Repositorio base técnico">
      <p>
        Esta pantalla solo confirma la arquitectura inicial. La carga real y la
        portada quedan fuera de este ticket.
      </p>
      <ol className="flow-list">
        {flowSteps.map((step) => (
          <li key={step.id}>{step.label}</li>
        ))}
      </ol>
    </MobileShell>
  );
}
