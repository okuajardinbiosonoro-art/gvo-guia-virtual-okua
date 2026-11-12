export const loadingInitialCopy = {
  title: "Bienvenido a OKÚA",
  subtitle: "Preparando tu recorrido",
} as const;

export const loadingInitialCopyByLocale = {
  es: { ...loadingInitialCopy, error: "No fue posible preparar el recorrido. Puedes reintentar o volver.", retry: "Reintentar", back: "Volver", exhausted: "Este intento terminó. Vuelve para comenzar de nuevo." },
  en: { title: "Welcome to OKÚA", subtitle: "Preparing your journey", error: "The journey could not be prepared. You can retry or go back.", retry: "Retry", back: "Back", exhausted: "This attempt has ended. Go back to start again." },
} as const;
