import "./CoverIntroScreen.css";

import type { CSSProperties } from "react";

import { coverIntroAssets } from "./coverIntroAssets";
import { coverIntroPortals, coverIntroText } from "./coverIntroContent";

function handleIntroPlaceholder() {
  // TODO 002E: iniciar diálogos introductorios de Lía.
}

export function CoverIntroScreen() {
  const stageStyle = {
    "--cover-background-image": `url(${coverIntroAssets.background})`,
  } as CSSProperties;

  return (
    <main
      className="cover-intro"
      aria-labelledby="cover-intro-title"
      style={stageStyle}
    >
      <div className="cover-intro__scrim" aria-hidden="true" />
      <div className="cover-intro__stage" data-cover-intro-version="002D">
        <header className="cover-intro__header">
          <p className="cover-intro__brand">{coverIntroText.logo}</p>
          <p className="cover-intro__subtitle">{coverIntroText.subtitle}</p>
        </header>

        <section className="cover-intro__scene" aria-label="Archivo Vivo OKÚA">
          <img
            className="cover-intro__lia"
            src={coverIntroAssets.liaIdle}
            alt="Lía, guía visual de OKÚA."
            data-runtime-asset={coverIntroAssets.liaIdle}
          />

          <div
            className="cover-intro__portals"
            aria-label="Portales del recorrido"
          >
            {coverIntroPortals.map((portal) => {
              const available = portal.state === "available";
              const frameSrc = available
                ? coverIntroAssets.portal1Frame
                : coverIntroAssets.lockedFrame;

              return (
                <button
                  key={portal.id}
                  type="button"
                  className={`cover-intro__portal cover-intro__portal--${portal.state}`}
                  aria-label={portal.ariaLabel}
                  aria-disabled={available ? undefined : "true"}
                  data-portal-id={portal.id}
                  data-portal-state={portal.state}
                  onClick={available ? handleIntroPlaceholder : undefined}
                >
                  {available ? (
                    <img
                      className="cover-intro__portal-glow"
                      src={coverIntroAssets.portal1Glow}
                      alt=""
                      aria-hidden="true"
                      data-runtime-asset={coverIntroAssets.portal1Glow}
                    />
                  ) : null}
                  <img
                    className="cover-intro__portal-frame"
                    src={frameSrc}
                    alt=""
                    aria-hidden="true"
                    data-runtime-asset={frameSrc}
                  />
                  <span
                    className="cover-intro__portal-roman"
                    aria-hidden="true"
                  >
                    {portal.roman}
                  </span>
                  {available ? null : (
                    <img
                      className="cover-intro__portal-lock"
                      src={coverIntroAssets.lock}
                      alt=""
                      aria-hidden="true"
                      data-runtime-asset={coverIntroAssets.lock}
                    />
                  )}
                  <span className="cover-intro__portal-title">
                    {portal.title}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <footer className="cover-intro__footer">
          <h1 id="cover-intro-title" className="cover-intro__title">
            {coverIntroText.archiveTitle}
          </h1>
          <button
            type="button"
            className="cover-intro__cta"
            aria-label={coverIntroText.cta}
            onClick={handleIntroPlaceholder}
          >
            {coverIntroText.cta}
          </button>
        </footer>
      </div>
    </main>
  );
}
