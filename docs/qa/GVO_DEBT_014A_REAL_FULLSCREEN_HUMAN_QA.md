# GVO_DEBT_014A — QA humano de fullscreen real (≤ 60 segundos)

Este control usa una URL directa y top-level. No usar un iframe, un panel de
preview ni una vista embebida para la aceptación.

## Recorrido principal

1. Con el preview activo, abre directamente
   `http://127.0.0.1:4173/inicio` en Chrome, Edge u Opera de escritorio.
2. Selecciona `Español` y confirma que `Activar pantalla completa` está
   habilitado.
3. Pulsa `Activar pantalla completa` y confirma que desaparece el chrome del
   navegador y que el estado indica `Pantalla completa activa`.
4. Pulsa `Iniciar recorrido`; en Portada confirma que el fullscreen continúa y
   que existe un solo control global con label `Salir de pantalla completa`.
5. Pulsa ese control y confirma el retorno a ventana normal y el label
   `Activar pantalla completa`.
6. Entra otra vez desde Portada y confirma que vuelve el fullscreen nativo.
7. Pulsa `Esc`; confirma salida y retorno del control a
   `Activar pantalla completa`.
8. Repite el recorrido en el navegador principal del visitante si es distinto
   del usado arriba.

Resultado PASS: botón habilitado → entrada nativa → navegación SPA aún activa
→ salida por control → reentrada → salida con `Esc`.

## Diagnóstico sólo si falla

DevTools no es necesario para el uso normal. Si el botón aparece deshabilitado
o la solicitud falla, abre la consola en la misma pestaña, pega una sola vez el
bloque siguiente y adjunta el objeto resultante:

```js
(() => {
  const doc = document;
  const frame = window.frameElement;
  const policy =
    doc.permissionsPolicy?.allowsFeature?.("fullscreen") ??
    doc.featurePolicy?.allowsFeature?.("fullscreen") ??
    null;
  return {
    href: location.href,
    protocol: location.protocol,
    topLevel: window.top === window.self,
    secureContext: window.isSecureContext,
    fullscreenEnabled: document.fullscreenEnabled,
    fullscreenElement: document.fullscreenElement?.tagName ?? null,
    requestFullscreen: typeof document.documentElement.requestFullscreen,
    exitFullscreen: typeof document.exitFullscreen,
    userActivation: navigator.userActivation
      ? {
          isActive: navigator.userActivation.isActive,
          hasBeenActive: navigator.userActivation.hasBeenActive,
        }
      : null,
    policyAllowsFullscreen: policy,
    frame: frame
      ? {
          tag: frame.tagName,
          allow: frame.getAttribute("allow"),
          allowFullscreen: frame.hasAttribute("allowfullscreen"),
          embedderOrigin: document.referrer
            ? new URL(document.referrer).origin
            : null,
        }
      : null,
  };
})()
```

Interpretación cerrada:

- `requestFullscreen !== "function"`: `UNSUPPORTED_BROWSER`.
- API presente pero `fullscreenEnabled === false` o policy `false`:
  `BLOCKED_BY_CONTEXT`; abrir GVO directamente como top-level.
- API/policy disponibles y rechazo tras clic: registrar el error real del
  navegador; no declarar fullscreen activo.
