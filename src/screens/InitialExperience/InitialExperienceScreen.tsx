import "./InitialExperienceScreen.css";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useNavigate } from "react-router-dom";

import {
  applyDocumentLanguage,
  readLanguagePreference,
  writeLanguagePreference,
  type GvoLanguage,
} from "../../app/preferences/languagePreference";
import { coverIntroRoute } from "../../app/routes";
import {
  entryCoverBackdropAsset,
  entryCoverStationAssets,
} from "../../shared/assets/entryCoverAssets";
import {
  getFullscreenCapability,
  isFullscreenActive,
  requestFullscreenFromUserGesture,
  subscribeFullscreenEvents,
} from "../../shared/immersive";

type FullscreenEntryState =
  | "fallback"
  | "blocked"
  | "inactive"
  | "pending"
  | "active"
  | "error";

type PersistenceState = "idle" | "saved" | "memory-only";

const copy = {
  es: {
    title: "Elige cómo entrar",
    description:
      "Selecciona tu idioma preferido y continúa en el navegador. La pantalla completa es opcional.",
    languageLegend: "Idioma preferido",
    languageSaved: "Preferencia de idioma guardada en este dispositivo.",
    languageMemoryOnly:
      "La preferencia está activa para esta visita, pero no pudo guardarse.",
    fullscreen: "Activar pantalla completa",
    fullscreenActive: "Pantalla completa activa",
    fullscreenPending: "Activando pantalla completa…",
    browserOptimized:
      "La vista de navegador ya está optimizada para este dispositivo.",
    fullscreenBlocked:
      "Este contexto bloquea la pantalla completa. Abre GVO directamente en el navegador.",
    fullscreenError:
      "No fue posible activar pantalla completa. Puedes continuar normalmente.",
    fullscreenHelp:
      "Esta opción requiere tu gesto y nunca bloquea el recorrido.",
    start: "Iniciar recorrido",
    editorialNote:
      "El contenido editorial conserva su versión aprobada; este selector no lo reescribe.",
  },
  en: {
    title: "Choose how to enter",
    description:
      "Select your preferred language and continue in the browser. Fullscreen is optional.",
    languageLegend: "Preferred language",
    languageSaved: "Language preference saved on this device.",
    languageMemoryOnly:
      "The preference is active for this visit, but it could not be saved.",
    fullscreen: "Enter fullscreen",
    fullscreenActive: "Fullscreen active",
    fullscreenPending: "Entering fullscreen…",
    browserOptimized:
      "The browser view is already optimized for this device.",
    fullscreenBlocked:
      "This context blocks fullscreen. Open GVO directly in the browser.",
    fullscreenError:
      "Fullscreen could not be enabled. You can continue normally.",
    fullscreenHelp:
      "This option requires your gesture and never blocks the journey.",
    start: "Start journey",
    editorialNote:
      "Approved editorial content remains unchanged; this selector does not rewrite it.",
  },
} as const;

const neutralCopy = {
  title: "Selecciona tu idioma / Choose your language",
  description:
    "Elige una opción para continuar. / Choose one option to continue.",
  languageLegend: "Idioma / Language",
} as const;

const neutralBrowserOptimized =
  "La vista de navegador ya está optimizada para este dispositivo. / The browser view is already optimized for this device.";

function initialFullscreenState(): FullscreenEntryState {
  if (isFullscreenActive()) {
    return "active";
  }

  const capability = getFullscreenCapability();
  return capability === "supported"
    ? "inactive"
    : capability === "blocked-by-context"
      ? "blocked"
      : "fallback";
}

export function InitialExperienceScreen() {
  const navigate = useNavigate();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const storedLanguage = readLanguagePreference();
  const [language, setLanguage] = useState<GvoLanguage | null>(storedLanguage);
  const [persistenceState, setPersistenceState] = useState<PersistenceState>(
    storedLanguage ? "saved" : "idle",
  );
  const [fullscreenState, setFullscreenState] = useState<FullscreenEntryState>(
    initialFullscreenState,
  );
  const fullscreenCapability =
    fullscreenState === "blocked"
      ? "blocked-by-context"
      : fullscreenState === "fallback"
        ? "unavailable-on-platform"
        : "supported";
  const localizedCopy = language ? copy[language] : null;

  useEffect(() => {
    applyDocumentLanguage(language);
  }, [language]);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  useEffect(() => {
    const syncFullscreenState = () => {
      setFullscreenState(initialFullscreenState());
    };
    const handleFullscreenError = () => {
      setFullscreenState("error");
    };

    return subscribeFullscreenEvents(
      syncFullscreenState,
      handleFullscreenError,
    );
  }, []);

  const selectLanguage = (nextLanguage: GvoLanguage) => {
    setLanguage(nextLanguage);
    applyDocumentLanguage(nextLanguage);
    setPersistenceState(
      writeLanguagePreference(nextLanguage) ? "saved" : "memory-only",
    );
  };

  const requestFullscreen = async () => {
    if (
      fullscreenState === "pending" ||
      fullscreenState === "active" ||
      fullscreenState === "blocked" ||
      fullscreenState === "fallback"
    ) {
      return;
    }

    const activation = requestFullscreenFromUserGesture();
    setFullscreenState("pending");
    const succeeded = await activation;
    const capability = getFullscreenCapability();
    setFullscreenState(
      succeeded && isFullscreenActive()
        ? "active"
        : capability === "supported"
          ? "error"
          : capability === "blocked-by-context"
            ? "blocked"
            : "fallback",
    );
  };

  const fullscreenLabel = localizedCopy
    ? fullscreenState === "active"
      ? localizedCopy.fullscreenActive
      : fullscreenState === "pending"
        ? localizedCopy.fullscreenPending
        : localizedCopy.fullscreen
    : "Pantalla completa / Fullscreen";

  const fullscreenStatus = localizedCopy
    ? fullscreenState === "fallback"
      ? localizedCopy.browserOptimized
      : fullscreenState === "blocked"
        ? localizedCopy.fullscreenBlocked
        : fullscreenState === "error"
          ? localizedCopy.fullscreenError
          : fullscreenState === "active"
            ? localizedCopy.fullscreenActive
            : localizedCopy.fullscreenHelp
    : fullscreenState === "fallback"
      ? neutralBrowserOptimized
      : "Opcional y disponible sólo mediante tu gesto. / Optional and available only through your gesture.";
  const visualStyle = {
    "--initial-experience-backdrop": `url(${entryCoverBackdropAsset})`,
  } as CSSProperties;

  return (
    <main
      className="initial-experience"
      style={visualStyle}
      data-initial-experience="debt-012"
      data-initial-experience-visual="debt-013"
      data-initial-language={language ?? "unselected"}
      data-initial-language-persistence={persistenceState}
      data-initial-fullscreen-state={fullscreenState}
      data-gvo-fullscreen-capability={fullscreenCapability}
      aria-labelledby="initial-experience-title"
      aria-describedby="initial-experience-description"
    >
      <div
        className="initial-experience__backdrop"
        data-runtime-asset={entryCoverBackdropAsset}
        aria-hidden="true"
      />
      <div className="initial-experience__layout">
        <div className="initial-experience__journey-art" aria-hidden="true">
          <span className="initial-experience__journey-orbit" />
          {entryCoverStationAssets.map((asset) => (
            <img
              key={asset.id}
              className="initial-experience__station-asset"
              src={asset.src}
              alt=""
              decoding="async"
              data-entry-cover-station-asset={asset.id}
              data-runtime-asset={asset.src}
            />
          ))}
        </div>

        <section className="initial-experience__panel">
        <p className="initial-experience__eyebrow">GVO · GUÍA VIRTUAL OKÚA</p>
        <h1 id="initial-experience-title" ref={headingRef} tabIndex={-1}>
          {localizedCopy?.title ?? neutralCopy.title}
        </h1>
        <p id="initial-experience-description">
          {localizedCopy?.description ?? neutralCopy.description}
        </p>

        <fieldset className="initial-experience__languages">
          <legend>
            {localizedCopy?.languageLegend ?? neutralCopy.languageLegend}
          </legend>
          <div className="initial-experience__language-options">
            <button
              type="button"
              lang="es"
              aria-pressed={language === "es"}
              data-language-option="es"
              onClick={() => selectLanguage("es")}
            >
              Español
            </button>
            <button
              type="button"
              lang="en"
              aria-pressed={language === "en"}
              data-language-option="en"
              onClick={() => selectLanguage("en")}
            >
              English
            </button>
          </div>
        </fieldset>

        {language && persistenceState !== "idle" ? (
          <p
            className="initial-experience__status"
            data-language-persistence-status={persistenceState}
            role="status"
          >
            {persistenceState === "saved"
              ? copy[language].languageSaved
              : copy[language].languageMemoryOnly}
          </p>
        ) : null}

        <section
          className="initial-experience__immersive"
          aria-labelledby="initial-experience-immersive-title"
        >
          <h2 id="initial-experience-immersive-title">
            {language === "en" ? "Immersive entry" : "Entrada inmersiva"}
          </h2>
          {fullscreenState !== "fallback" ? (
            <button
              type="button"
              className="initial-experience__fullscreen"
              aria-label={fullscreenLabel}
              aria-pressed={fullscreenState === "active"}
              data-initial-fullscreen-action="request"
              data-gvo-fullscreen-capability={fullscreenCapability}
              disabled={
                fullscreenState === "blocked" ||
                fullscreenState === "pending" ||
                fullscreenState === "active"
              }
              onClick={requestFullscreen}
            >
              {fullscreenLabel}
            </button>
          ) : null}
          <p
            className="initial-experience__fullscreen-status"
            data-initial-fullscreen-status={fullscreenState}
            data-initial-immersive-fallback={
              fullscreenState === "fallback" ? "browser-optimized" : undefined
            }
            aria-live="polite"
          >
            {fullscreenStatus}
          </p>
        </section>

        {localizedCopy ? (
          <p className="initial-experience__editorial-note">
            {localizedCopy.editorialNote}
          </p>
        ) : null}

          <button
            type="button"
            className="initial-experience__start"
            data-initial-experience-action="start"
            disabled={!language}
            onClick={() => navigate(coverIntroRoute)}
          >
            {localizedCopy?.start ?? "Iniciar / Start"}
          </button>
        </section>
      </div>
    </main>
  );
}
