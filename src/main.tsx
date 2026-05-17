import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@fontsource-variable/pixelify-sans/index.css";

import { App } from "./app/App";
import "./styles/tokens.css";
import "./styles/global.css";

const rootElement = document.getElementById("app");

if (!rootElement) {
  throw new Error("No se encontro el nodo #app para montar GVO.");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
