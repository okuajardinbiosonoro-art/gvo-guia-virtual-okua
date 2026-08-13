# ADR-0006: Entrada inicial, preferencia de idioma y fullscreen

## Estado

Aceptado técnicamente; pendiente de revisión humana bajo `GVO_DEBT_012`.

## Contexto

El flujo principal iniciaba en Carga inicial y navegaba directamente a Portada.
El documento declaraba `lang="es"`, pero no existía selección ni persistencia
de preferencia. Fullscreen ya estaba encapsulado por `shared/immersive` y se
ofrecía mediante gesto dentro de estaciones, no en la primera interacción.

El nuevo contrato debe conservar `QR → navegador → experiencia`, no requerir
instalación, no solicitar fullscreen automáticamente y no modificar progreso,
checkpoints, QR, PWA, route chunking ni contenido editorial aprobado.

## Decisión

- Incorporar `/inicio` como pantalla crítica DOM/CSS entre Carga inicial y
  Portada en la entrada normal `/`.
- Mantener `/carga`, `/portada` y el flujo técnico `/?resetIntro=1` con sus
  contratos existentes.
- Exigir una selección explícita entre `es` y `en` antes de habilitar el inicio
  del recorrido.
- Persistir sólo el valor validado en `gvo.language.v1`; ante corrupción,
  bloqueo o cuota, usar `es` como fallback del documento y conservar la
  selección de la visita en memoria.
- Aplicar la preferencia a `document.documentElement.lang` también en recargas
  y entradas directas mediante el shell global.
- Reutilizar `shared/immersive` para solicitar la Fullscreen API únicamente
  desde el botón nativo de la pantalla. La denegación o ausencia de API informa
  el fallback y nunca deshabilita el botón de recorrido.
- Mantener el selector fuera de la allowlist de reset: idioma es preferencia de
  visitante, no estado pedagógico.

La interfaz inicial ofrece microcopy operacional bilingüe requerido para la
selección. No traduce ni reescribe el contenido editorial del recorrido.

## Consecuencias

- La primera entrada normal termina en `/inicio`; el visitante elige idioma y
  decide si solicita fullscreen antes de ir a `/portada`.
- English registra preferencia y semántica de documento, pero no implica una
  traducción editorial no autorizada.
- Fullscreen continúa siendo opcional, reversible desde el control de
  estaciones y dependiente de soporte y gesto del navegador.
- La preferencia sobrevive a reload y al reset real sin tocar progreso ni
  checkpoints.
- No se agregan assets, dependencias, permisos ni recursos externos.
