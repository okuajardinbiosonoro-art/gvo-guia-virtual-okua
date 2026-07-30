# GVO ST5-020C — Corrección de composición visual y UX

Fecha: 2026-07-30

Baseline: `d8df42d692dcd3d6221ac99b89064fa0a0c27fae`

Estado humano de entrada: `ST5_020A_HUMAN_REJECTED_VISUAL` +
`ST5_020B_HUMAN_REJECTED_VISUAL`

Flags conservados: `COPY_CANDIDATE_PENDING_HUMAN_APPROVAL` ·
`LIA_WORLD5_APPROVED_ASSETS_INTEGRATED_PENDING_HUMAN_RUNTIME_REVIEW` ·
`SPACE_ROUTE_PROTECTED` · `VISITOR_ROUTE_PROTECTED` ·
`FINAL_4_OF_4_OUT_OF_SCOPE`

## Blueprint correctivo — auditoría previa read-only

La auditoría se ejecutó antes de modificar runtime sobre `main` limpio,
sincronizado `0/0` con `origin/main` y remoto en el baseline esperado. Se
inspeccionaron código, CSS y capturas Chromium reales a `390×844` y `844×390`
de Estaciones III, IV, mapa rechazado, Plantas rechazada y Sistema rechazado.

### Causa raíz por pantalla

- **Mapa:** la base y el rim usan todo el stage, mientras los cuatro sectores
  viven en un cuadrado independiente limitado por altura. Cada sector añade
  placa de label, placa de estado, emoji/check o candado, sombra/halo, más un
  nexo y rutas SVG. La suma rompe el sistema de coordenadas del arte y produce
  la lectura de piezas o tapones pegados.
- **Plantas:** en portrait el wrapper fija `top:34%` y transforma `-34%` sin
  alinear el contacto inferior del foco con el borde real de tierra/jardinera;
  por eso el tallo termina en el aire. El pulso SVG, pseudo-halo y check agregan
  una segunda gramática gráfica rechazada.
- **Sistema:** el centro del socket está documentado en `[0.50,0.56]` portrait
  y `[0.33,0.55]` landscape, pero el wrapper se traslada `-55%` aunque el ancla
  interna del foco está en 40% de su canvas. Esa diferencia eleva el equipo y
  lo hace flotar. La curva SVG, nodos y check empeoran la integración.
- **Jerarquía/UX:** la cabecera técnica ocupa una fila separada; escena, copy y
  Lía son bloques verticales independientes. Lía queda como sticker pequeño y
  el CTA de retorno duplica el Back. El documento oculta el exceso con
  `overflow:hidden`, de modo que un scrollHeight correcto no prueba que todo el
  contenido importante esté visible.

### Patrón elegido de Estaciones III y IV

- De Estación IV se adopta el contrato `100dvh`, hijos `min-height:0`, título
  editorial compacto y un único artículo narrativo atómico.
- De Estación III se adopta la relación espacial directa entre Lía y su mensaje,
  además de foco visible sólo para teclado.
- No se reutiliza el backplate raster oscuro de Estación IV: es específico de
  su mesa técnica y no es compatible con la paleta cálida de Mundo V. Tampoco
  se fabrica una tarjeta con gradiente, borde, glassmorphism o pseudo-elementos.
  El rail editorial propio de Mundo V será transparente y agrupará semánticamente
  contexto, título, copy, estado y Lía. **No se requiere asset nuevo.**

### Arquitectura y coordenadas

- **Portrait:** grid de dos filas dentro de `100dvh`: stage `minmax(0,1fr)` y
  rail editorial compacto. El stage usa el background portrait completo; el
  rail mantiene título, mensaje, Lía y acciones visibles sin scroll a 100%.
- **Landscape:** grid `56fr/44fr`, stage a la izquierda y rail editorial a la
  derecha, sin divisor artificial ni bloques debajo del fold.
- **Mapa:** base, rim y un único artboard normalizado por orientación. Los cuatro
  botones comparten celdas y escala; no hay tablas gráficas paralelas.
- **Plantas:** se conserva la calibración landscape que ya toca la jardinera;
  portrait baja el wrapper hasta alinear el extremo del tallo con el borde de
  tierra visible.
- **Sistema:** el ancla interna `[0.50,0.40]` se alinea con los sockets aprobados
  `[0.50,0.56]` portrait y `[0.33,0.55]` landscape.

### Elementos a retirar

- Nexo y rutas SVG del mapa.
- Placas/emoji/check/candados flotantes de estado.
- Drop shadows y halos genéricos de sectores.
- Pulso SVG y check de Plantas.
- Curva/nodos SVG y check de Sistema.
- Pseudo-affordances permanentes.
- CTA de retorno duplicado; el control Back conserva cancelación y ejecuta el
  retorno verificado cuando el área ya está resuelta.

### Archivos previstos

- `src/screens/World5Root/World5RootScreen.tsx`
- `src/screens/World5Root/World5RootScreen.css`
- `src/screens/World5Root/World5EditorialPanel.tsx`
- `src/screens/World5Root/station5Content.ts`
- pruebas unitarias y E2E focales de Mundo V
- este reporte, índices de estado y evidencia bajo
  `docs/visual/world5/st5-020c/`

## Implementación y validación

### Resultado implementado

La composición usa ahora un único artboard normalizado para las cuatro áreas
del mapa. Los sectores conservan sus rasters aprobados y expresan estado sólo
con opacidad, saturación, luz y escala mínima del elemento real. El rim quedó
como capa estructural detrás de los sectores para no cortar rótulos.

Plantas alinea su wrapper completo con el borde real de tierra/jardinera:
`top:50%` y ancla interna de hoja/tallo en portrait; en landscape conserva la
calibración de contacto probada. Sistema alinea el ancla interna `[0.50,0.40]`
con el socket por orientación mediante `translate(-50%,-40%)`. No se añadió
sombra de contacto, cable, placa ni otro objeto CSS.

`World5EditorialPanel` agrupa jerarquía, copy y Lía en un solo artículo:

- contexto semántico: `ESTACIÓN V · MUNDO V`;
- protagonista: `Mapa del presente`;
- nombre corto, idea principal, síntesis/estado y acción sólo cuando aplica;
- Lía dentro de la misma composición, completa, sin espejo, recorte ni target;
- un único retorno escénico: cancela durante entrada, vuelve inmediatamente
  antes de resolver y ejecuta retorno verificado después de persistir;
- ante error de storage, el retorno queda bloqueado y sólo aparece el retry.

El copy continúa en `COPY_CANDIDATE_PENDING_HUMAN_APPROVAL`. La antigua
instrucción de “pulso visual” se reemplazó por “reconocer su vitalidad” para no
prometer el recurso procedural que este ticket elimina.

### Elementos procedurales retirados

- mapa: nexo, rutas SVG, checks/candados/emoji, placas de estado y drop shadows;
- Plantas: línea/pulso SVG, pseudo-halo permanente y check flotante;
- Sistema: curva SVG, cable/nodos procedurales, pseudo-halo y check;
- UX: CTA inferior duplicado y acumulación de seis bloques verticales.

Las pruebas verifican que los selectores retirados tienen conteo DOM cero.

### Arquitectura responsive final

- **Portrait:** `100dvh`, dos filas `minmax(0,1fr) auto`; escena full-bleed y
  artículo editorial compacto. No existe regla de escape con `height:auto` en
  los viewports normales del ticket.
- **Landscape:** columnas `56fr/44fr`; escena a la izquierda y rail editorial a
  la derecha. Lía se alinea con el mensaje, no debajo de la escena.
- **Reflow 200%:** proxy equivalente `195×422`; se permite scroll vertical
  controlado, sin overflow horizontal. Título, contexto, retorno, foco y Lía se
  recorren, se hacen visibles y conservan target mínimo de 44 px.
- **Accesibilidad:** focus ring sólo con `:focus-visible`, flujo completo por
  teclado, live region para resolución/error y reduced motion conservado.

### QA visual Chromium

Se capturaron 56 escenas individuales con `fullPage:false`: siete estados por
cada uno de los ocho viewports requeridos. Cada captura se midió en el mismo
instante; `metrics.json` conserva bounding boxes, targets, overflow, consola,
404, red externa, jerarquía y conteo procedural.

| Viewport | Orientación | Escenas | Δ ancho máx. | Δ alto máx. | Target mín. | Problemas |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| 360×560 | portrait | 7 | 0 px | 0 px | 44 px | 0 |
| 360×640 | portrait | 7 | 0 px | 0 px | 44 px | 0 |
| 375×667 | portrait | 7 | 0 px | 0 px | 44 px | 0 |
| 390×844 | portrait | 7 | 0 px | 0 px | 44 px | 0 |
| 430×932 | portrait | 7 | 0 px | 0 px | 44 px | 0 |
| 768×1024 | portrait | 7 | 0 px | 0 px | 44 px | 0 |
| 844×390 | landscape | 7 | 0 px | 0 px | 44 px | 0 |
| 1024×768 | landscape | 7 | 0 px | 0 px | 44 px | 0 |

La inspección humana de las capturas a resolución original confirmó:

- las cuatro etiquetas del mapa completas, sin rim ni borde encima;
- Plantas con tallo apoyado en la tierra/jardinera en ambas orientaciones;
- Sistema dentro de la región/socket documentada, con su sombra raster propia;
- copy, título, retorno y Lía completos en `360×560` y `844×390`;
- ausencia visual de líneas, checks, placas, halos y “tapones”.

Evidencia principal:

- [métricas reproducibles](../visual/world5/st5-020c/metrics.json)
- [contact sheet portrait responsive](../visual/world5/st5-020c/contact_sheet_portrait_responsive.jpg)
- [flujo portrait 390×844](../visual/world5/st5-020c/contact_sheet_portrait_flow_390x844.jpg)
- [flujo landscape 844×390](../visual/world5/st5-020c/contact_sheet_landscape_flow_844x390.jpg)
- [landscape responsive](../visual/world5/st5-020c/contact_sheet_landscape_responsive.jpg)
- [comparación antes/después](../visual/world5/st5-020c/comparison_before_after_rejected_390x844.jpg)
- [detalle de contacto de Plantas](../visual/world5/st5-020c/detail_plants_grounding_390x844.png)
- [detalle de socket de Sistema](../visual/world5/st5-020c/detail_system_socket_390x844.png)
- [detalle de tarjeta + Lía](../visual/world5/st5-020c/detail_card_lia_390x844.png)

### Pruebas y gates

| Gate | Resultado |
| --- | --- |
| `npm run lint` | PASS |
| `npm run test` | PASS — 22 archivos, 254 pruebas |
| Vitest focal World5Root | PASS — 3 archivos, 26 pruebas |
| E2E focal 020A + 020B + 020C | PASS — 18 pruebas, Chromium real, 1 worker |
| Matriz visual | PASS — 56/56 capturas, 0 problemas |
| `npm run build` | PASS — PWA generada |
| `npm run audit:assets` | PASS — sin URL externa, CDN ni audio |
| `git diff --check` | PASS |

El gate PWA existente del repositorio pasó: build `generateSW`, 252 entradas y
los 18 assets runtime de Mundo V presentes en el manifiesto de precache. Un
probe adicional de desconexión live no fue concluyente en Chromium: el service
worker llegó a `activated` y controlador, pero `context.setOffline(true)` cortó
los fetch antes de permitir inspeccionar la caché. Por ello no se declara una
recarga offline live adicional como PASS; se conserva el gate existente.

### Inventario y paridad de assets

No se creó, regeneró ni retocó ningún asset runtime. Se compararon por SHA-256
los 18 archivos gráficos de
`public/assets/gvo/stations/world-5/present-map/runtime/` contra sus mirrors en
`public/assets/gvo/current-used/world-5-root/`: `18/18 BYTE_IDENTICAL`.
`world5RuntimeAssets.test.ts` conserva nombre, formato, canvas, alpha, bytes y
hash de los bundles tipados. La evidencia QA nueva vive sólo en
`docs/visual/world5/st5-020c/` y no participa del runtime.

### Archivos de implementación y prueba

- `src/screens/World5Root/World5RootScreen.tsx`
- `src/screens/World5Root/World5RootScreen.css`
- `src/screens/World5Root/World5EditorialPanel.tsx`
- `src/screens/World5Root/station5Content.ts`
- `src/screens/World5Root/World5RootScreen.test.tsx`
- `tests/e2e/world5-st5-020a.spec.ts`
- `tests/e2e/world5-st5-020b.spec.ts`
- `tests/e2e/world5-st5-020c.spec.ts`
- `docs/visual/world5/st5-020c/` — 56 capturas, métricas, 4 contact sheets,
  comparación antes/después y 3 detalles.
- este reporte.

### Baseline, publicación y alcance

- SHA inicial: `d8df42d692dcd3d6221ac99b89064fa0a0c27fae`.
- SHA final: el commit portador de este documento; se verifica externamente
  contra `HEAD`, `origin/main` y `git ls-remote` porque un commit no puede
  autoincrustar su propio hash sin modificarlo.
- Rama autorizada: `main`.
- Tarjeta: composición DOM/CSS transparente reutilizable; no requiere decisión
  ni asset nuevo.

Deudas deliberadas y límites conservados:

- `COPY_CANDIDATE_PENDING_HUMAN_APPROVAL`.
- `LIA_WORLD5_APPROVED_ASSETS_INTEGRATED_PENDING_HUMAN_RUNTIME_REVIEW`.
- `SPACE_ROUTE_PROTECTED`.
- `VISITOR_ROUTE_PROTECTED`.
- `FINAL_4_OF_4_OUT_OF_SCOPE`.
- La revisión técnica/visual de Codex no equivale a aprobación humana.
- Deuda de validación: el probe live offline adicional descrito arriba quedó
  inconcluso; build, registro SW y manifiesto de precache sí fueron verificados.
- No se implementaron Espacio, Visitante, 3/4, 4/4, Final, navegación de cierre,
  audio, copy final ni assets nuevos.
- No se declara `HUMAN_APPROVED` ni `STATION5_COMPLETE`.
