# T003E7 - Auditoria tipografica global GVO

## 1. Resumen del ticket

T003E7 documenta el estado tipografico real de GVO despues de T003E6A. El objetivo es diagnosticar la inconsistencia visual entre Carga Inicial, Portada / Intro, dialogos de Lia, Transicion entre mundos y pantallas placeholder, y proponer un sistema tipografico unificado para implementar en tickets futuros.

Este ticket es solo documental. No aplica cambios visuales, no modifica CSS runtime, no cambia rutas, no toca assets y no altera Carga Inicial, Portada / Intro ni TransitionWorld.

## 2. Rama base y rama final

- Rama base: `feature/003E6A-transition-reuse-loading-sparkles`
- Commit base: `1a5e5f9 fix: reuse loading sparkles in transition world`
- Rama final: `feature/003E7-gvo-typography-audit`

## 3. Observacion del usuario

El usuario reporto que las pantallas actuales se sienten tipograficamente fragmentadas:

- Carga Inicial usa un estilo propio.
- Portada / Intro usa otro estilo en logo/titulo.
- Los dialogos de Lia usan un stack legible distinto.
- TransitionWorld usa Pixelify, pero con una declaracion distinta.
- Las pantallas placeholder/globales heredan un stack general que no coincide con el lenguaje pixelart.

La consecuencia visual es una ruptura de armonia: el proyecto tiene identidad pixelart-organica, pero la tipografia no esta gobernada por un sistema comun.

## 4. Archivos inspeccionados

Archivos revisados mediante busqueda de `font-family`, `font-size`, `font-weight`, `line-height`, `letter-spacing`, `text-transform` y selectores relacionados con title, subtitle, dialog, button, loading, cover, intro, lia y transition:

- `package.json`
- `src/main.tsx`
- `src/styles/tokens.css`
- `src/styles/global.css`
- `src/screens/LoadingInitial/LoadingInitialScreen.css`
- `src/screens/LoadingInitial/LoadingInitialScreen.tsx`
- `src/screens/Cover/CoverIntroScreen.css`
- `src/screens/Cover/CoverIntroScreen.tsx`
- `src/screens/Cover/LiaHybridAvatar.css`
- `src/screens/TransitionWorld/TransitionWorld.module.css`
- `src/screens/TransitionWorld/TransitionWorld.tsx`
- `src/screens/TransitionWorld/components/TransitionText.tsx`
- `src/screens/TransitionWorld/components/TransitionProgress.tsx`
- `src/components/layout/MobileShell.tsx`
- `src/components/qr/QrAccessPlaceholder.tsx`
- `src/components/transition/TransitionPlaceholder.tsx`
- `src/components/lia/LiaPlaceholder.tsx`
- `src/screens/Station/StationPlaceholder.tsx`
- `src/screens/Final/FinalPlaceholder.tsx`

## 5. Inventario tipografico real

| Archivo | Selector / componente | Pantalla | Font-family | Font-size | Weight | Line-height | Letter-spacing | Color relevante | Uso visual | Coherencia |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `package.json` | dependencia `@fontsource-variable/pixelify-sans` | global | Pixelify Sans local disponible | n/a | n/a | n/a | n/a | n/a | Fuente pixelart self-hosted | Correcto: respeta app local, sin CDN ni fuente remota. |
| `src/main.tsx` | import `@fontsource-variable/pixelify-sans/index.css` | global | Pixelify Sans Variable importada | n/a | n/a | n/a | n/a | n/a | Entrada tecnica de fuente local | Correcto: habilita fuente local para pantallas visuales. |
| `src/styles/tokens.css` | `:root` | global/placeholders | `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` | n/a | n/a | n/a | n/a | `--gvo-text`, `--gvo-muted` | Stack raiz y fallback global | Inconsistente: `Inter` aparece declarado pero no hay paquete/import local de Inter; en runtime cae a sistema. |
| `src/styles/global.css` | `.eyebrow` | placeholders/global | hereda `:root` | `0.78rem` | `700` | no definido | `0` | `var(--gvo-accent)` | Rotulo tecnico/seccion | Funcional para placeholders, no alineado con pixelart final. |
| `src/styles/global.css` | `h1` global | placeholders/global | hereda `:root` | `2rem` | heredado | `1.05` | no definido | `var(--gvo-text)` | Titulos genericos | Correcto para pantallas tecnicas, no deberia gobernar pantallas finales. |
| `src/styles/global.css` | `h2` global | placeholders/global | hereda `:root` | `1.2rem` | heredado | `1.2` | no definido | `var(--gvo-text)` | Subtitulos genericos | Util como fallback, pero sin identidad OKUA. |
| `src/styles/global.css` | `p` global | placeholders/global | hereda `:root` | heredado | heredado | `1.55` | no definido | `var(--gvo-muted)` | Texto largo placeholder | Legible; puede servir como referencia para body narrativo si se define fuente local o stack final. |
| `src/styles/global.css` | `.status-pill`, `.text-link` | placeholders/global | hereda `:root` | heredado | `700` | heredado | no definido | variables globales | Etiquetas y links | Correcto en prototipo; visualmente diferente a UI pixelart. |
| `src/screens/LoadingInitial/LoadingInitialScreen.css` | `.loading-initial` variable `--loading-font-pixel` | Carga Inicial | `"Pixelify Sans Variable", "Pixelify Sans", system-ui, sans-serif` | n/a | n/a | n/a | n/a | n/a | Stack local pixelart | Coherente y reusable como base de tokens futuros. |
| `src/screens/LoadingInitial/LoadingInitialScreen.css` | `.loading-initial h1` | Carga Inicial | `var(--loading-font-pixel)` | `1.68rem`; mobile `1.44rem`; baja altura `1.38rem` | `590` | `1.04` | `0` | `#7352a3` | Titulo principal `Preparando el recorrido` | Muy coherente: pixelart suave, legible y no excesivo. |
| `src/screens/LoadingInitial/LoadingInitialScreen.css` | `.loading-initial__copy p` | Carga Inicial | `var(--loading-font-pixel)` | `1.02rem`; mobile `0.9rem` | `500` | `1.24` | `0` | `#9a79bd` | Subtitulo `Cuidando el inicio...` | Coherente como microcopy pixelart delicado. |
| `src/screens/Cover/CoverIntroScreen.css` | `.cover-intro` | Portada / Intro | `"Pixelify Sans Variable", "Pixelify Sans", ui-sans-serif, system-ui, sans-serif` | base heredada | n/a | n/a | `0` | variables de portada | Stack visual de pantalla | Coherente en shell visual, aunque convive con readable font. |
| `src/screens/Cover/CoverIntroScreen.css` | `--cover-readable-font` | Portada / Intro | `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` | n/a | n/a | n/a | n/a | n/a | Fuente legible para dialogos | Legible pero rompe continuidad pixelart si no se tokeniza y delimita. |
| `src/screens/Cover/CoverIntroScreen.css` | `.cover-intro__brand` | Portada / Intro | hereda Pixelify | `clamp(2.2rem, 14vw, 4.1rem)`; baja altura `clamp(2rem, 12vw, 3.2rem)` | `700` | `0.86` | `0` | crema/luz de portada | Logo/titulo especial OKUA | Funciona como display especial; no debe copiarse a textos largos. |
| `src/screens/Cover/CoverIntroScreen.css` | `.cover-intro__subtitle` | Portada / Intro | hereda Pixelify | `clamp(0.9rem, 4vw, 1.16rem)` | heredado | `1` | no definido | tono secundario | Bajada corta de portada | Coherente con display; requiere token de microcopy/intro. |
| `src/screens/Cover/CoverIntroScreen.css` | `.cover-intro__title` | Portada / Intro | hereda Pixelify | `clamp(1.25rem, 6.4vw, 2rem)` | heredado | `0.96` | `0` | portada | Titulo narrativo dentro de portada | Funciona como heading corto, pero necesita alineacion con Loading/Transition. |
| `src/screens/Cover/CoverIntroScreen.css` | `.cover-intro__dialogue` | Dialogos de Lia | `var(--cover-readable-font)` | hereda internos | n/a | n/a | n/a | panel crema/morado | Panel de dialogo | Ruptura controlada: legible, pero diferente a identidad pixelart. |
| `src/screens/Cover/CoverIntroScreen.css` | `.cover-intro__dialogue-meta` | Dialogos de Lia | hereda readable | `clamp(0.7rem, 2.8vw, 0.84rem)` | n/a | `1` | no definido | meta de dialogo | Speaker/progreso | Legible; podria usar UI label pixelart en futuro. |
| `src/screens/Cover/CoverIntroScreen.css` | `.cover-intro__dialogue-speaker` | Dialogos de Lia | hereda readable | heredado | `750` | heredado | no definido | enfasis | Nombre de Lia | Funciona por jerarquia, pero no por identidad visual. |
| `src/screens/Cover/CoverIntroScreen.css` | `.cover-intro__dialogue-step` | Dialogos de Lia | hereda readable | `clamp(0.62rem, 2.55vw, 0.76rem)` | `700` | heredado | no definido | contador/estado | Paso de dialogo | Correcto como UI auxiliar; puede tokenizarse. |
| `src/screens/Cover/CoverIntroScreen.css` | `.cover-intro__dialogue-text` | Dialogos de Lia | `var(--cover-readable-font)` | `clamp(0.84rem, 3.25vw, 1rem)`; baja altura `0.78rem` | `500` | `1.25` | `0` | texto de panel | Texto narrativo/dialogo | Muy legible, pero la linea `1.25` puede sentirse apretada para texto narrativo largo. |
| `src/screens/Cover/CoverIntroScreen.css` | `.cover-intro__dialogue-button` | Dialogos de Lia | `var(--cover-readable-font)` | `0.82rem` | `700` | no definido | no definido | accion dialogo | Boton secundario de dialogo | Legible, pero inconsistente con CTA pixelart. |
| `src/screens/Cover/CoverIntroScreen.css` | `.cover-intro__portal-roman` | Portales | hereda Pixelify | `clamp(1rem, 5.3vw, 1.55rem)` | heredado | `1` | no definido | portal | Numero romano del portal | Coherente para etiqueta corta pixelart. |
| `src/screens/Cover/CoverIntroScreen.css` | `.cover-intro__blocked-message`, `.cover-intro__opening` | Portada / Intro | `var(--cover-readable-font)` | `clamp(0.76rem, 3.4vw, 0.95rem)` | `650` | `1.04` | no definido | estados de portales | Estado/feedback | Comprensible, pero visualmente cercano a UI de sistema. |
| `src/screens/Cover/CoverIntroScreen.css` | `.cover-intro__transition-eyebrow` | Overlay transicion en portada | hereda Pixelify | `clamp(0.78rem, 3.2vw, 0.96rem)` | heredado | `1` | `0` | overlay | Rotulo corto | Coherente con microcopy pixelart. |
| `src/screens/Cover/CoverIntroScreen.css` | `.cover-intro__transition-title` | Overlay transicion en portada | hereda Pixelify | `clamp(1rem, 4.5vw, 1.3rem)` | heredado | `0.98` | no definido | overlay | Titulo de transicion | Cercano a TransitionWorld, buen candidato a token heading. |
| `src/screens/Cover/CoverIntroScreen.css` | `.cover-intro__transition-copy` | Overlay transicion en portada | `var(--cover-readable-font)` | `clamp(0.72rem, 3vw, 0.88rem)` | heredado | `1.22` | no definido | overlay | Apoyo textual | Legible, pero mezcla dos lenguajes en un mismo overlay. |
| `src/screens/Cover/CoverIntroScreen.css` | `.cover-intro__transition-link` | Overlay transicion en portada | `var(--cover-readable-font)` | `0.82rem` | `700` | no definido | no definido | link dev/accion | Link de transicion | Inconsistente con CTA principal. |
| `src/screens/Cover/CoverIntroScreen.css` | `.cover-intro__cta` | Portada / Intro | hereda Pixelify | no definido explicitamente | `700` | no definido | `0` | boton principal | Boton `Comenzar recorrido` | Visualmente integrado; necesita token comun para botones. |
| `src/screens/TransitionWorld/TransitionWorld.module.css` | `.transitionWorld` | Transicion entre mundos | `"Pixelify Sans", system-ui, sans-serif` | base heredada | n/a | n/a | n/a | variables de transicion | Stack de pantalla | Casi correcto, pero omite `"Pixelify Sans Variable"` usado por Loading/Cover. |
| `src/screens/TransitionWorld/TransitionWorld.module.css` | `.title`, `.subtitle` | Transicion entre mundos | hereda `.transitionWorld` | ver filas siguientes | `600` | ver filas siguientes | `0` | sombra suave | Titulo/subtitulo de transicion | Coherente con pixelart; requiere unificar stack y tokens. |
| `src/screens/TransitionWorld/TransitionWorld.module.css` | `.title` | Transicion entre mundos | hereda Pixelify | `clamp(1.08rem, 4.4vw, 1.34rem)` | `600` | `1.05` | `0` | claro/sombra | Texto principal `Abriendo Mundo I: Raiz...` | Buen heading narrativo corto. |
| `src/screens/TransitionWorld/TransitionWorld.module.css` | `.subtitle` | Transicion entre mundos | hereda Pixelify | `clamp(0.88rem, 3.8vw, 1.02rem)` | `600` | `1.12` | `0` | opacidad `0.86` | Texto secundario | Buen microcopy; deberia alinearse con loading subtitle. |
| `src/components/layout/MobileShell.tsx` y placeholders | `h1`, `h2`, `p`, `.eyebrow`, `.status-pill` | QR, Lia placeholder, Station, Final, Transition placeholder | heredan global/root | global | global | global | global | global | Pantallas tecnicas/no finales | Aceptable como placeholder; no debe servir como sistema visual final. |

## 6. Diagnostico de inconsistencias

### Familias tipograficas distintas encontradas

1. `Pixelify Sans Variable`, `Pixelify Sans`, `system-ui`, `sans-serif`: usada por Carga Inicial y Portada / Intro como lenguaje visual principal.
2. `Pixelify Sans`, `system-ui`, `sans-serif`: usada por TransitionWorld, pero sin declarar primero la variante variable importada.
3. `system-ui`, `-apple-system`, `BlinkMacSystemFont`, `"Segoe UI"`, `sans-serif`: usada como `--cover-readable-font` para dialogos, mensajes de estado y botones secundarios de Portada / Intro.
4. `Inter`, `ui-sans-serif`, `system-ui`, `-apple-system`, `BlinkMacSystemFont`, `"Segoe UI"`, `sans-serif`: declarada en `:root`, aunque `Inter` no esta instalada ni importada localmente.

### Estilos de titulo existentes

- Carga Inicial: titulo pixelart suave, `1.68rem`, peso `590`, line-height `1.04`, lavanda.
- Portada logo/display: Pixelify muy grande, `clamp(2.2rem, 14vw, 4.1rem)`, peso `700`, line-height `0.86`.
- Portada titulo narrativo: Pixelify `clamp(1.25rem, 6.4vw, 2rem)`, line-height `0.96`.
- Overlay de transicion en Portada: Pixelify `clamp(1rem, 4.5vw, 1.3rem)`, line-height `0.98`.
- TransitionWorld: Pixelify `clamp(1.08rem, 4.4vw, 1.34rem)`, peso `600`, line-height `1.05`.
- Placeholder/global: stack Inter/sistema, `2rem`, line-height `1.05`.

### Estilos de dialogo existentes

- Dialogo principal de Lia en Portada: sistema legible, `clamp(0.84rem, 3.25vw, 1rem)`, peso `500`, line-height `1.25`.
- Meta/speaker/paso de dialogo: sistema legible, pesos `700` a `750`, tamanos menores.
- No existe todavia un sistema compartido de dialogo para Lia fuera de Portada.

### Estilos de botones existentes

- CTA principal de Portada: hereda Pixelify y usa peso `700`.
- Boton de dialogo de Portada: usa `--cover-readable-font`, `0.82rem`, peso `700`.
- Link de overlay de transicion: usa `--cover-readable-font`, `0.82rem`, peso `700`.
- Botones globales heredan `font: inherit`, por lo que dependen del contexto.

### Rupturas visuales evidentes

- `Inter` aparece en tokens globales sin estar disponible como fuente local. Esto no rompe build, pero confunde la arquitectura tipografica y genera un fallback silencioso.
- TransitionWorld usa `"Pixelify Sans"` sin `"Pixelify Sans Variable"`, distinto a Carga Inicial y Portada.
- Portada mezcla Pixelify para identidad/CTA con sistema para dialogos y botones secundarios. La mezcla mejora legibilidad, pero hoy no esta documentada como decision de sistema.
- Los botones no tienen un criterio unificado: algunos se sienten pixelart, otros sistema.
- Los placeholders globales tienen apariencia de herramienta tecnica; esto es aceptable mientras sean placeholders, pero no debe llegar a pantallas finales.

## 7. Estilos que funcionan y deberian conservarse

- Pixelify Sans local como lenguaje visual de identidad. Ya esta instalada via Fontsource y no requiere red.
- Titulo y subtitulo de Carga Inicial: buen equilibrio entre pixelart, suavidad y legibilidad movil.
- Logo/display de Portada: funciona como pieza especial, siempre que se limite a identidad y no a textos largos.
- Texto principal/secundario de TransitionWorld: tamanos contenidos y apropiados para una transicion breve.
- Uso de fuente mas legible en dialogos de Portada: protege lectura movil en bloques narrativos.
- `letter-spacing: 0` en textos pixelart: evita ruido visual y mantiene nitidez.

## 8. Estilos que rompen coherencia

- Referencia global a `Inter` sin fuente local validada.
- Falta de tokens tipograficos globales: cada pantalla define su propio stack y sus escalas.
- Dialogo y boton de dialogo de Portada usan sistema, mientras CTA principal usa Pixelify. La diferencia deberia responder a tokens, no a decisiones locales aisladas.
- Line-heights muy apretados (`0.86`, `0.96`, `1`) funcionan en titulos cortos, pero no deben propagarse a body, dialogos ni microcopy largo.
- Los placeholders de estaciones/final/transicion tecnica heredan una identidad generica; no es problema mientras sigan como placeholders, pero conviene marcarlos como deuda.

## 9. Sistema tipografico recomendado

La recomendacion practica para GVO no es una sola fuente para todo. Conviene una pareja tipografica controlada:

- Una fuente pixelart local para identidad, headings cortos, microcopy breve y acciones principales.
- Una fuente legible local o stack provisional para dialogos y body narrativo, donde la lectura movil pesa mas que el caracter pixelart.

Mientras no exista una segunda fuente local validada, el sistema puede conservar el stack de sistema para body/dialogos como solucion provisional documentada. Si se elige una fuente nueva, debe entrar como asset local o dependencia local en un ticket posterior, sin CDN ni descarga runtime.

### Nivel 1 - Display / logo / titulo especial

- Uso: marca OKUA, titulo especial de Portada o momentos de identidad.
- Fuente recomendada: `Pixelify Sans Variable`.
- Criterio: alto caracter pixelart, line-height ajustado, textos muy cortos.
- No usar para: dialogos largos, explicaciones pedagogicas o instrucciones.

### Nivel 2 - Heading narrativo

- Uso: titulos de pantallas, transiciones, mundos y estados principales.
- Fuente recomendada: `Pixelify Sans Variable`.
- Criterio: pixelart suave, tamaño contenido, line-height cercano a `1.04` - `1.12`.
- Debe tomar como base Carga Inicial y TransitionWorld, no el logo grande de Portada.

### Nivel 3 - Body narrativo

- Uso: explicaciones, contexto pedagogico y textos de estaciones.
- Fuente recomendada: fuente legible local futura o stack de sistema provisional.
- Criterio: line-height `1.45` - `1.6`, peso normal/medio, alta lectura movil.
- Decision pendiente: seleccionar o aprobar una fuente local legible si el sistema visual lo requiere.

### Nivel 4 - Lia dialogue

- Uso: globos, paneles y mensajes de Lia.
- Fuente recomendada: body legible para el mensaje; Pixelify para speaker, paso, etiquetas o botones cortos.
- Criterio: calido, claro, sin parecer interfaz tecnica. El panel puede aportar pixelart por borde, color y estructura, sin forzar todo el texto a una fuente pixel.

### Nivel 5 - UI labels / botones

- Uso: CTA, botones, estados accionables, labels de portales.
- Fuente recomendada: `Pixelify Sans Variable` para acciones principales y labels cortos.
- Criterio: peso `650` - `700`, tamaño `0.82rem` - `0.95rem`, sin mayusculas sostenidas salvo etiquetas muy cortas.
- Nota: botones dentro de dialogo pueden usar un token especifico si se prioriza legibilidad, pero debe ser consistente.

### Nivel 6 - Microcopy / subtitulos

- Uso: `Preparando recorrido...`, subtitulos, ayudas, estados breves.
- Fuente recomendada: `Pixelify Sans Variable`.
- Criterio: discreto, tono lavanda/suave, peso `500` - `600`, line-height `1.12` - `1.24`.

## 10. Tokens CSS propuestos para tickets futuros

Estos tokens son propuesta documental. No se implementan en T003E7.

```css
:root {
  --gvo-font-display: "Pixelify Sans Variable", "Pixelify Sans", system-ui, sans-serif;
  --gvo-font-heading: var(--gvo-font-display);
  --gvo-font-ui: var(--gvo-font-display);
  --gvo-font-microcopy: var(--gvo-font-display);
  --gvo-font-body: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --gvo-font-dialog: var(--gvo-font-body);

  --gvo-text-display-size: clamp(2.2rem, 14vw, 4.1rem);
  --gvo-text-title-size: clamp(1.25rem, 6vw, 2rem);
  --gvo-text-heading-size: clamp(1.08rem, 4.4vw, 1.34rem);
  --gvo-text-subtitle-size: clamp(0.88rem, 3.8vw, 1.02rem);
  --gvo-text-dialog-size: clamp(0.86rem, 3.25vw, 1rem);
  --gvo-text-ui-size: clamp(0.78rem, 3.2vw, 0.95rem);

  --gvo-line-height-display: 0.9;
  --gvo-line-height-title: 1.04;
  --gvo-line-height-heading: 1.08;
  --gvo-line-height-subtitle: 1.16;
  --gvo-line-height-dialog: 1.32;
  --gvo-line-height-body: 1.5;

  --gvo-letter-spacing-pixel: 0;
  --gvo-font-weight-display: 700;
  --gvo-font-weight-heading: 600;
  --gvo-font-weight-body: 500;
  --gvo-font-weight-ui: 700;
}
```

Decision recomendada sobre `Inter`: retirar la referencia a `Inter` en un ticket futuro si no se instala como fuente local. No conviene declarar una fuente que no esta realmente disponible.

## 11. Restricciones tecnicas

La direccion tipografica futura debe respetar:

- app local sin Internet;
- sin CDN;
- sin fuentes remotas;
- sin `@import url(...)`;
- sin descarga de fuentes en runtime;
- textos finales como DOM/CSS;
- accesibilidad movil;
- buena lectura en 360px, 390px y 430px;
- compatibilidad con build actual;
- no alterar identidad de Lia;
- no mezclar tipografias sin token o criterio documentado.

Si se aprueba una segunda fuente para body/dialogos, debe entrar en ticket separado como asset local validado o dependencia local equivalente a Fontsource, con auditoria de assets.

## 12. Plan de implementacion por tickets

- `T003E7A`: decidir stack final de body/dialogos. Comparar mantener sistema provisional vs incorporar una fuente local legible validada.
- `T003E7B`: crear tokens tipograficos globales en `src/styles/tokens.css` y corregir la referencia no respaldada a `Inter`.
- `T003E7C`: aplicar tokens a `TransitionWorld`, empezando por stack, heading y microcopy por ser la pantalla mas acotada.
- `T003E7D`: mapear Carga Inicial a tokens sin drift visual; conservar valores V13/V12 equivalentes.
- `T003E7E`: mapear Portada / Intro a tokens para display, heading, CTA, estados y overlay.
- `T003E7F`: unificar dialogos de Lia: speaker, paso, cuerpo, boton y panel con tokens claros.
- `T003E7G`: generar validacion visual comparativa de Carga Inicial, Portada / Intro y TransitionWorld en 360px, 390px y 430px, incluyendo reduced motion donde aplique.

No se debe ejecutar ningun ticket de implementacion tipografica sin aprobacion explicita del usuario.

## 13. Confirmacion de alcance

- No se modifico runtime.
- No se modifico CSS global.
- No se modifico Carga Inicial.
- No se modifico visualmente Portada / Intro.
- No se modifico visualmente TransitionWorld.
- No se modificaron dialogos.
- No se modificaron rutas.
- No se modifico navegacion.
- No se agregaron fuentes.
- No se agregaron dependencias.
- No se usaron recursos externos.
- No se uso CDN.
- No se tocaron assets.

## 14. Validaciones ejecutadas

Comandos requeridos para este ticket documental:

```powershell
npm run lint
npm run test
npm run build
npm run audit:assets
```

No se ejecuto `npm run test:e2e` porque no se modifico runtime ni comportamiento visual.

## 15. Resultado de validaciones

- `npm run lint`: OK.
- `npm run test`: OK, 5 archivos y 41 tests.
- `npm run build`: OK, build de produccion generado correctamente.
- `npm run audit:assets`: OK, sin URLs externas, CDN ni audio.

## 16. Estado final del repo

El cierre debe quedar publicado en `feature/003E7-gvo-typography-audit` con working tree limpio. La auditoria queda lista para que los tickets `T003E7A` a `T003E7G` se ejecuten solo con autorizacion explicita del usuario.
