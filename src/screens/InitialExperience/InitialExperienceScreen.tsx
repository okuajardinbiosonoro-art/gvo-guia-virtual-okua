import "./InitialExperienceScreen.css";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  applyDocumentLanguage,
  readLanguagePreference,
  writeLanguagePreference,
  type GvoLanguage,
} from "../../app/preferences/languagePreference";
import { coverIntroRoute } from "../../app/routes";
import {
  isFullscreenAvailable,
  isImmersiveMode,
  requestImmersiveMode,
} from "../../shared/immersive";

type FullscreenEntryState =
  | "unsupported"
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
    fullscreenUnsupported:
      "Pantalla completa no está disponible. Puedes continuar normalmente.",
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
    fullscreenUnsupported:
      "Fullscreen is unavailable. You can continue normally.",
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

function initialFullscreenState(): FullscreenEntryState {
  if (isImmersiveMode()) {
    return "active";
  }

  return isFullscreenAvailable() ? "inactive" : "unsupported";
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

    document.addEventListener("fullscreenchange", syncFullscreenState);
    document.addEventListener("fullscreenerror", handleFullscreenError);

    return () => {
      document.removeEventListener("fullscreenchange", syncFullscreenState);
      document.removeEventListener("fullscreenerror", handleFullscreenError);
    };
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
      fullscreenState === "unsupported"
    ) {
      return;
    }

    setFullscreenState("pending");
    const succeeded = await requestImmersiveMode();
    setFullscreenState(
      succeeded && isImmersiveMode()
        ? "active"
        : isFullscreenAvailable()
          ? "error"
          : "unsupported",
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
    ? fullscreenState === "unsupported"
      ? localizedCopy.fullscreenUnsupported
      : fullscreenState === "error"
        ? localizedCopy.fullscreenError
        : fullscreenState === "active"
          ? localizedCopy.fullscreenActive
          : localizedCopy.fullscreenHelp
    : "Opcional y disponible sólo mediante tu gesto. / Optional and available only through your gesture.";

  return (
    <main
      className="initial-experience"
      data-initial-experience="debt-012"
      data-initial-language={language ?? "unselected"}
      data-initial-language-persistence={persistenceState}
      data-initial-fullscreen-state={fullscreenState}
      aria-labelledby="initial-experience-title"
      aria-describedby="initial-experience-description"
    >
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
          <button
            type="button"
            className="initial-experience__fullscreen"
            aria-label={fullscreenLabel}
            aria-pressed={fullscreenState === "active"}
            data-initial-fullscreen-action="request"
            disabled={
              fullscreenState === "unsupported" ||
              fullscreenState === "pending" ||
              fullscreenState === "active"
            }
            onClick={requestFullscreen}
          >
            {fullscreenLabel}
          </button>
          <p
            className="initial-experience__fullscreen-status"
            data-initial-fullscreen-status={fullscreenState}
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
    </main>
  );
}
