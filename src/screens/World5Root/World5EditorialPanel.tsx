import type { ReactNode, RefObject } from "react";

import { station5Header } from "./station5Content";

export type World5LiaRole = "explain" | "attend" | "lead" | "greeting";

type World5EditorialPanelProps = {
  action?: ReactNode;
  areaLabel: string;
  headingRef?: RefObject<HTMLHeadingElement | null>;
  lead: string;
  liaAsset: string;
  liaRole: World5LiaRole;
  status?: string;
  support?: string;
  title: string;
};

export function World5EditorialPanel({
  action,
  areaLabel,
  headingRef,
  lead,
  liaAsset,
  liaRole,
  status,
  support,
  title,
}: World5EditorialPanelProps) {
  return (
    <aside className="s5-editorial" aria-label="Orientación de Lía para Estación V">
      <header className="s5-title">
        <p>{station5Header.eyebrow}</p>
        <h1 id="station5-title">{station5Header.title}</h1>
      </header>

      <article className="s5-editorial-card">
        <div className="s5-editorial-copy">
          <p className="s5-kicker">{areaLabel}</p>
          <h2 ref={headingRef} tabIndex={headingRef ? -1 : undefined}>{title}</h2>
          <p className="s5-lead">{lead}</p>
          {support ? <p className="s5-support">{support}</p> : null}
          {status ? <p className="s5-status-copy">{status}</p> : null}
          {action ? <div className="s5-editorial-action">{action}</div> : null}
        </div>

        <figure
          className={`s5-lia s5-lia--${liaRole}`}
          data-station5-lia={liaRole}
          aria-hidden="true"
          style={{ pointerEvents: "none" }}
        >
          <img src={liaAsset} alt="" draggable="false" data-runtime-asset={liaAsset} />
        </figure>
      </article>
    </aside>
  );
}
