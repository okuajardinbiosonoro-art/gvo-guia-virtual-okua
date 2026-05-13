import { MobileShell } from "../../components/layout/MobileShell";
import type { FlowStep } from "../../data/flow";

interface FinalPlaceholderProps {
  flowSteps: FlowStep[];
}

export function FinalPlaceholder({ flowSteps }: FinalPlaceholderProps) {
  return (
    <MobileShell eyebrow="Final placeholder">
      <p>Mirador final del jardín queda reservado para un ticket posterior.</p>
      <ol className="flow-list">
        {flowSteps.map((step) => (
          <li key={step.id}>{step.label}</li>
        ))}
      </ol>
    </MobileShell>
  );
}
