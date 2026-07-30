import type { ReactNode, RefObject } from "react";

export type World5LiaRole = "explain" | "attend" | "lead";

type World5EditorialPanelProps = {
  action?: ReactNode;
  context?: string;
  headingRef?: RefObject<HTMLHeadingElement | null>;
  lead: string;
  liaAsset: string;
  liaRole: World5LiaRole;
  status?: string;
  support?: string;
  title?: string;
  titleAs?: "h1" | "h2";
};

export function World5EditorialPanel({
  action,
  context,
  headingRef,
  lead,
  liaAsset,
  liaRole,
  status,
  support,
  title,
  titleAs = "h1",
}: World5EditorialPanelProps) {
  const Title = titleAs;
  return (
    <aside
      className="s5-editorial"
      aria-label="Orientación de Lía para Estación V"
    >
      <article className="s5-story-card" aria-atomic="true" aria-live="polite">
        <div className="s5-editorial-copy">
          {context ? <p className="s5-kicker">{context}</p> : null}
          {title ? (
            <Title
              id={titleAs === "h1" ? "station5-title" : undefined}
              ref={titleAs === "h1" ? headingRef : undefined}
              tabIndex={titleAs === "h1" && headingRef ? -1 : undefined}
            >
              {title}
            </Title>
          ) : null}
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
          <img
            src={liaAsset}
            alt=""
            draggable="false"
            data-runtime-asset={liaAsset}
          />
        </figure>
      </article>
    </aside>
  );
}
