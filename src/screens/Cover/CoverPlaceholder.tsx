import { LiaPlaceholder } from "../../components/lia/LiaPlaceholder";
import { MobileShell } from "../../components/layout/MobileShell";
import type { FlowStep } from "../../data/flow";

interface CoverPlaceholderProps {
  flowSteps: FlowStep[];
}

export function CoverPlaceholder({ flowSteps }: CoverPlaceholderProps) {
  return (
    <MobileShell eyebrow="Portada placeholder">
      <p>La portada visual queda pendiente para TICKET_001 o posterior.</p>
      <LiaPlaceholder />
      <ol className="flow-list">
        {flowSteps.map((step) => (
          <li key={step.id}>{step.label}</li>
        ))}
      </ol>
    </MobileShell>
  );
}
