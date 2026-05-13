import "./LoadingInitialScreen.css";

const loadingIllustration = "/assets/runtime/loading-initial-pre-portada.png";

export function LoadingInitialScreen() {
  return (
    <main
      className="loading-initial"
      aria-labelledby="loading-initial-title"
      aria-describedby="loading-initial-description"
    >
      <section className="loading-initial__stage">
        <div className="loading-initial__art" aria-hidden="false">
          <img
            src={loadingIllustration}
            alt="Lía, guía floral con exactamente cinco pétalos, flota y riega una planta joven en una maceta."
            className="loading-initial__image"
          />
        </div>

        <div className="loading-initial__copy">
          <p className="loading-initial__kicker">GVO — Guía Virtual OKÚA</p>
          <h1 id="loading-initial-title">Preparando el recorrido</h1>
          <p id="loading-initial-description">Cuidando el inicio...</p>
        </div>

        <div
          className="loading-initial__progress"
          role="progressbar"
          aria-label="Progreso de preparación del recorrido"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={38}
        >
          <span className="loading-initial__progress-fill" />
        </div>

        <p className="loading-initial__sr">
          Pantalla de carga inicial. Lía cuida una planta joven mientras se
          prepara la experiencia.
        </p>
      </section>
    </main>
  );
}
