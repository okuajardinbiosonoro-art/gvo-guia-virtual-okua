# GVO ST5-020I — Cierre editorial global de transiciones

Fecha: 2026-07-30

Rama de publicación: `main`

Baseline remoto validado:
`d933d1468931b854dd407ab3b4662327f9524f5f`

SHA final de publicación: corresponde al único commit `ST5-020I` que contiene
este documento. Por definición, el commit no puede incluir su propio SHA dentro
de su contenido; el handoff de publicación lo verifica contra `origin/main` y
el remoto después del push.

Decisiones registradas:

```text
ST5_020H_HUMAN_APPROVED
ST5_020I_PUBLISHED_COMPLETE
TRANSITION_COPY_AUDIT_COMPLETE
ESTACIÓN V CERRADA PARA EL ALCANCE ACTUAL
```

No se requiere una revisión humana adicional para este ticket. La Pantalla
Final conserva su experiencia temporal preexistente y no fue iniciada,
rediseñada, cerrada ni aprobada.

## Inventario runtime auditado

| ID | Ruta | Origen | Destino | Slot título | Slot subtítulo | Baseline | Estado baseline | Diagnóstico | Acción | Copy final |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `intro-to-station-1` | `/transition/intro-to-station-1` | `/portada` | `/estacion/1` | ninguno | ninguno | `Abriendo Mundo I: Raíz...` / `Preparando recorrido...` | hardcoded, sin metadata | genérico, no canónico y fuera del registro | corregir | `Abriendo Mundo I` / `Preparando la raíz.` |
| `world-1-to-world-2` | `/transition/world-1-to-world-2` | `/estacion/1` | `/estacion/2` | `TRANS_W1_W2_TITLE_01` | `TRANS_W1_W2_SUB_01` | `Abriendo Mundo II` / `Preparando el pulso invisible.` | `TEMP` | visible correcto, metadata temporal | corregir metadata | `Abriendo Mundo II` / `Preparando el pulso invisible.` |
| `world-2-to-world-3` | `/transition/world-2-to-world-3` | `/estacion/2` | `/estacion/3` | `TRANS_W2_W3_TITLE_01` | `TRANS_W2_W3_SUB_01` | `Abriendo Mundo III` / `Preparando el Cuaderno Pixel de Pruebas…` | `FINAL` | título correcto; subtítulo no canónico | conservar título; corregir subtítulo | `Abriendo Mundo III` / `Preparando el cuaderno de pruebas.` |
| `world-3-to-world-4` | `/transition/world-3-to-world-4` | `/estacion/3` | `/estacion/4` | `TRANS_W3_W4_TITLE_01` | `TRANS_W3_W4_SUB_01` | `TEMP — Abriendo Mundo IV` / `TEMP — Preparando la mesa del sistema.` | `TEMP` | temporal y subtítulo no canónico | corregir | `Abriendo Mundo IV` / `Preparando la mesa de sistema.` |
| `world-4-to-world-5` | `/transition/world-4-to-world-5` | `/estacion/4` | `/estacion/5` | `TRANS_W4_W5_TITLE_01` | `TRANS_W4_W5_SUB_01` | `TEMP — Abriendo Mundo V` / `TEMP — Preparando el mapa del presente.` | `TEMP` | temporal | corregir | `Abriendo Mundo V` / `Preparando el mapa del presente.` |
| `world-5-to-final` | `/transition/world-5-to-final` | `/estacion/5` | `/final` | `TRANS_W5_FINAL_TITLE_01` | `TRANS_W5_FINAL_SUB_01` | `TEMP — Abriendo el Mirador` / `TEMP — Preparando el cierre del recorrido.` | `TEMP` | temporal | corregir | `Abriendo el Mirador` / `Preparando el cierre del recorrido.` |

El inventario contiene exactamente seis configuraciones runtime y doce slots
editoriales finales. No se creó ninguna transición, ruta o pantalla.

## Tabla antes/después por slot

| Slot | Texto antes | Estado antes | Texto final | `shortText` final | Metadata final |
| --- | --- | --- | --- | --- | --- |
| `TRANS_COVER_W1_TITLE_01` | no existía; literal `Abriendo Mundo I: Raíz...` | sin slot | `Abriendo Mundo I` | `Abriendo Mundo I` | `es / human_approved / FINAL / replacement null` |
| `TRANS_COVER_W1_SUB_01` | no existía; literal `Preparando recorrido...` | sin slot | `Preparando la raíz.` | `Raíz` | `es / human_approved / FINAL / replacement null` |
| `TRANS_W1_W2_TITLE_01` | `Abriendo Mundo II` | `TEMP` | `Abriendo Mundo II` | `Abriendo Mundo II` | `es / human_approved / FINAL / replacement null` |
| `TRANS_W1_W2_SUB_01` | `Preparando el pulso invisible.` | `TEMP` | `Preparando el pulso invisible.` | `Pulso invisible` | `es / human_approved / FINAL / replacement null` |
| `TRANS_W2_W3_TITLE_01` | `Abriendo Mundo III` | `FINAL` | `Abriendo Mundo III` | `Abriendo Mundo III` | `es / human_approved / FINAL / replacement null` |
| `TRANS_W2_W3_SUB_01` | `Preparando el Cuaderno Pixel de Pruebas…` | `FINAL` | `Preparando el cuaderno de pruebas.` | `Cuaderno de pruebas` | `es / human_approved / FINAL / replacement null` |
| `TRANS_W3_W4_TITLE_01` | `TEMP — Abriendo Mundo IV` | `TEMP` | `Abriendo Mundo IV` | `Abriendo Mundo IV` | `es / human_approved / FINAL / replacement null` |
| `TRANS_W3_W4_SUB_01` | `TEMP — Preparando la mesa del sistema.` | `TEMP` | `Preparando la mesa de sistema.` | `Mesa de sistema` | `es / human_approved / FINAL / replacement null` |
| `TRANS_W4_W5_TITLE_01` | `TEMP — Abriendo Mundo V` | `TEMP` | `Abriendo Mundo V` | `Abriendo Mundo V` | `es / human_approved / FINAL / replacement null` |
| `TRANS_W4_W5_SUB_01` | `TEMP — Preparando el mapa del presente.` | `TEMP` | `Preparando el mapa del presente.` | `Mapa del presente` | `es / human_approved / FINAL / replacement null` |
| `TRANS_W5_FINAL_TITLE_01` | `TEMP — Abriendo el Mirador` | `TEMP` | `Abriendo el Mirador` | `Abriendo el Mirador` | `es / human_approved / FINAL / replacement null` |
| `TRANS_W5_FINAL_SUB_01` | `TEMP — Preparando el cierre del recorrido.` | `TEMP` | `Preparando el cierre del recorrido.` | `Cierre del recorrido` | `es / human_approved / FINAL / replacement null` |

El único slot conservado byte por byte en texto y metadata fue
`TRANS_W2_W3_TITLE_01`. Los dos textos visibles W1→W2 se conservaron, pero sus
metadatos se formalizaron. Las demás transiciones necesitaron al menos una
corrección editorial o de registro.

La fuente contractual para las doce piezas es la tabla canónica por destino de
`GVO ST5-020I`, autorizada humanamente. Las adendas A, B y C autorizan
exclusivamente el cierre responsive medido en `667×375`.

## Corrección responsive autorizada

La adenda A hizo visible el copy completo mediante una regla localizada. La
medición posterior identificó `177 px` de overflow documental: la caja
intrínseca de `.stage` medía `552 px`; limitar solo el root provocaba que el grid
la centrara y desplazara portal, Lía y progreso `88.5 px`.

La corrección atómica final, exclusivamente dentro de
`@media (orientation: landscape) and (max-height: 430px)`, es:

```css
.transitionWorld {
  height: 100svh;
}

.stage {
  align-self: start;
}

.copy {
  position: absolute;
  inset-block-start: 2px;
  gap: 2px;
  margin-top: 0;
}
```

Resultado comparado con el estado A restaurado:

| Medición `667×375` | Antes | Después |
| --- | ---: | ---: |
| overflow vertical documental | 177 px | 0 px |
| overflow horizontal | 0 px | 0 px |
| `window.scrollX / scrollY` | `0 / 0` | `0 / 0` |
| deriva máxima portal | — | 0 px |
| deriva máxima Lía | — | 0 px |
| deriva máxima progreso | — | 0 px |
| diferencia de canales en composición protegida | — | 0 |
| delta máximo de canal | — | 0 |

La comparación pixel-idéntica aísla la composición protegida sobre fondo plano
para no confundir el reencuadre normal del fondo `object-fit: cover` al corregir
la altura documental con una deriva de portal, Lía o progreso. Sus bounding
boxes, escala, recorte visible, orden y alpha perceptiva permanecen idénticos al
estado A; no existe recorte nuevo.

## Matriz de navegador y evidencia

| Viewport | Media query compacta | Casos | Título mínimo | Subtítulo mínimo | Overflow H/V máx. | Autoavance |
| --- | --- | ---: | ---: | ---: | --- | --- |
| `375×667` | no | 6/6 PASS | 17.28 px, token base intacto | 14.25 px | `0 / 0` | 1 por transición |
| `667×375` | sí | 6/6 PASS | 21.44 px | 16.32 px | `0 / 0` | 1 por transición |
| `1024×768` | no | 6/6 PASS | 21.44 px | 16.32 px | `0 / 0` | 1 por transición |

En los 18 casos se verificaron copy exacto y completo, slots finales, rutas,
destinos, `2300 ms / 1000 ms`, portal `open`, precarga intacta, cero controles,
cero scroll interno, storage byte-idéntico, cero requests externas, errores de
consola, errores de página, requests fallidos y 404.

La evidencia reproducible consta de 18 capturas finales, tres JSON de métricas,
cuatro capturas de comparación geométrica y un JSON antes/después bajo
`docs/visual/transitions/st5-020i/`.

## Implementación y archivos

Runtime:

- `src/content/editorial/editorialRegistry.ts`;
- `src/content/transitionEditorialSlots.ts`;
- `src/screens/TransitionWorld/transitionWorld.config.ts`;
- `src/screens/TransitionWorld/TransitionWorld.tsx`;
- `src/screens/TransitionWorld/TransitionWorld.module.css`.

La única modificación TSX es la excepción mínima autorizada por el ticket
original: el estado de precarga dejó de imprimir el literal genérico
`Preparando recorrido...` y usa el subtítulo canónico de la configuración. La
corrección responsive A/B/C no modificó JSX ni DOM.

Pruebas:

- registro y adaptador editorial;
- componente `TransitionWorld`;
- gate global de las seis transiciones;
- flujo Portada→transición;
- expectativas E2E activas de smoke, preview y QA de Portada que observan la
  transición ya montada.

Documentación y evidencia:

- este cierre;
- estado canónico, roadmap e índices vivos;
- `docs/visual/transitions/st5-020i/`.

## Contratos congelados

- IDs, rutas, destinos, guardas, precarga y autoavance;
- duraciones `2300 ms / 1000 ms`, portal, Lía, progreso, keyframes y capas;
- cero CTA, botones, enlaces, hotspots, gestos o interacción;
- `gvo.station5.v1` y `gvo.progress.v1`;
- Portada y Estaciones I–V, salvo expectativas de prueba del handoff;
- assets, manifiestos, `current-used`, dependencias y lockfiles;
- PWA, service worker y precache;
- `FinalRoot` y todos los slots temporales propios de la Pantalla Final.

Las únicas excepciones son la sustitución editorial mínima de precarga descrita
arriba y el CSS responsive expresamente autorizado por las adendas A/B/C. No se
modificaron assets, animaciones, tiempos, rutas, interacciones, storage, PWA ni
`FinalRoot`.

## Validaciones

- Vitest focal: 3 archivos, `42/42` PASS.
- Vitest global: 25 archivos, `295/295` PASS.
- Playwright contractual ST5-020I: `4/4` PASS; cubre la geometría C y las seis
  transiciones en los tres viewports.
- Flujo Portada→transición→Mundo I: `2/2` PASS.
- Regresión focal 020H de cierre, guardas y reduced motion: `3/3` PASS.
- Regresión adicional `TransitionWorld` + smoke: `15/16`; los cuatro casos de
  transición y todos los casos que observan el copy nuevo pasan. El único fallo,
  repetido aislado, es un contrato histórico ajeno: espera que Carga Inicial
  complete su duración vigente de `12000 ms` dentro de un timeout de `5000 ms`.
  Carga Inicial está congelada y no se alteró para falsear ese test.
- ESLint: PASS.
- TypeScript: PASS.
- Build Vite/PWA: PASS; `258` entradas de precache. Permanece el warning
  informativo de chunk mayor de 500 kB.
- Auditoría de assets: PASS, sin URLs externas, CDN ni audio.
- Assets raíz de transición: `34` archivos runtime validados.
- PWA estática: shell, `manifest.webmanifest`, `registerSW.js`, precache y
  `NavigationRoute` con fallback a `/index.html` presentes.
- Chromium: PASS. Firefox y WebKit no se ejecutaron porque sus binarios
  Playwright no están instalados.

- `git diff --check`: PASS.
- Control de áreas congeladas contra el baseline: PASS; `public`, rutas,
  guardas, Estaciones I–V, `FinalRoot`, dependencias y configuración PWA
  permanecen byte-idénticos.
- La sincronización Git se verifica inmediatamente antes y después del único
  commit de publicación.

## Estado editorial final

```text
ALL TRANSITION COPY AUDITED
NO TEMPORARY TRANSITION COPY REMAINS
NO INTERACTIONS ADDED
NO HUMAN REVIEW REQUIRED
FINAL SCREEN NOT STARTED
```
