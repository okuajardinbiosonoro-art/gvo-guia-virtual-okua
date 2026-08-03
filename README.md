# GVO — Guía Virtual OKÚA

GVO es la Guía Virtual OKÚA: una aplicación web local, mobile-first e insonora para acompañar el recorrido OKÚA mediante QR físicos dentro de una red MikroTik sin Internet.

## Qué problema resuelve

El visitante debe poder abrir una guía visual desde el navegador de su celular sin instalar nada. La experiencia ocurre en sitio, dentro de una red local controlada. Por eso GVO no puede depender de CDN, APIs externas, fuentes remotas, imágenes remotas ni servicios en línea.

## Reglas de operación local sin Internet

- La app debe funcionar servida desde una máquina local dentro de la red MikroTik.
- El visitante accede con QR físicos que abren URLs locales.
- No se deben cargar recursos externos en runtime.
- No se debe pedir instalación al visitante.
- No se debe reproducir sonido.
- La experiencia debe priorizar pantallas móviles.

## Flujo general

1. Carga inicial
2. Portada
3. Estación I — Mundo I: Raíz
4. Estación II — Mundo II: Lía y el pulso invisible
5. Estación III — Mundo III: Cuaderno Pixel de Pruebas
6. Estación IV — Mundo IV: Mesa de sistema
7. Estación V — Mundo V: Mapa del presente
8. Final — Mirador final del jardín

También existe una pantalla reutilizable de transición entre mundos. El tramo definitivo Mundo II → Mundo III es pasivo y automático: muestra `Abriendo Mundo III` / `Preparando el Cuaderno Pixel de Pruebas…` y avanza sin CTA tras 2300 ms (1000 ms con reduced motion).

## Stack técnico

- Vite
- React
- TypeScript
- React Router
- Motion for React
- @zxing/browser
- vite-plugin-pwa
- Vitest
- Playwright
- ESLint
- Prettier

## Comandos

Ejecutar comandos según el alcance del ticket activo. En tickets de solo lectura no ejecutar comandos que instalen dependencias, escriban artefactos o regeneren archivos.

```powershell
npm install
npm run dev
npm run assets:normalize:loading
npm run assets:validate:loading
npm run build
npm run test
npm run check
```

Comandos auxiliares:

```powershell
npm run status
npm run audit:assets
npm run test:e2e
```

## Estado actual

La fuente de verdad es [`docs/status/CURRENT_STATE.md`](docs/status/CURRENT_STATE.md). El recorrido con aprobación humana cierra Estación V para el alcance actual:

- Mundo I funcional en `/estacion/1`.
- Mundo II finalizado para el alcance actual en `/estacion/2`.
- Transición Mundo II → Mundo III definitiva, pasiva y automática.
- Mundo III / Estación III cerrada y aprobada por revisión humana en `/estacion/3`.
- Estación III ofrece índice progresivo, PLANTA, PROTOTIPO, SEÑAL, sello AJUSTADO, revisitas, ayudas de interacción, assets runtime y espejos `current-used`, responsive y reduced motion.
- Mundo IV / Estación IV cerrada y aprobada por revisión humana en `/estacion/4`: cadena Planta → Bionosificador → ESP32 → MIDI → Wi‑Fi/UDP → Router → Sistema central → Sonido, 20 assets runtime con espejos, ruta SVG, Lía, fullscreen, responsive y reduced motion.
- Las seis transiciones runtime y sus doce piezas editoriales están cerradas como `FINAL / human_approved` por `TRANSITION_COPY_AUDIT_COMPLETE`.
- Mundo V conserva mapa, Plantas, Sistema, Espacio, Visitante, 4/4, `Ir al cierre`, persistencia global, guardas y salida bajo `ST5_020H_HUMAN_APPROVED`.
- Final conserva runtime temporal y no cerrado; 021E auditó los seis Environment aprobados en Descargas como referencias `NOT_RUNTIME` y dejó listos seis briefs para accesos I–V/placa, sin producir esos assets ni implementar.

Los contratos integrales están en [`docs/status/GVO_STATION3_COMPLETE.md`](docs/status/GVO_STATION3_COMPLETE.md) y [`docs/status/GVO_ST4_018E_STATION4_CLOSEOUT.md`](docs/status/GVO_ST4_018E_STATION4_CLOSEOUT.md). El umbral de revisión vigente está en [`docs/ROADMAP.md`](docs/ROADMAP.md).

## Metodología de avance por pantalla

GVO se desarrolla por pantallas secuenciales. Una pantalla puede avanzar bajo dos estados documentados:

- `APROBADA_PARA_AVANZAR`: calificación visual del usuario igual o superior a 7/10, aprobación explícita del usuario Ing. José David, estabilidad técnica, reglas no negociables cumplidas y deuda visual documentada.
- `CERRADA_APROBADA_FINAL`: calificación objetivo igual o superior a 9/10 y sin deuda visual importante.

`main` puede contener pantallas aprobadas para avanzar, no necesariamente finales. El aprobador visual explícito es el usuario Ing. José David. La metodología completa está en `docs/process/METODOLOGIA_AVANCE_POR_UMBRAL_VISUAL.md`.

Estado actual:

- Carga inicial: APROBADA_PARA_AVANZAR / 7.2_DE_10 / DEUDA_VISUAL_DOCUMENTADA
- Portada: APROBADA_PARA_AVANZAR / 7.8_DE_10 / DEUDA_VISUAL_DOCUMENTADA / NO_CERRADA_FINAL
- Transición: APROBADA_PARA_AVANZAR / 7.9_DE_10 / FUNCIONAL_INTEGRADA / DEUDA_VISUAL_DOCUMENTADA
- Estación I: RUNTIME ACTIVO / INTERACCION REFINADA / DEUDA VISUAL DOCUMENTADA
- Estación II: FINALIZADA PARA EL ALCANCE ACTUAL / RUNTIME 016V-R2
- Estación III: CERRADA_APROBADA_FINAL / HUMAN_APPROVED
- Estación IV: CERRADA_APROBADA_FINAL / HUMAN_APPROVED
- Estación V: ST5_020H_HUMAN_APPROVED / CERRADA PARA EL ALCANCE ACTUAL
- Transiciones: ST5_020I_PUBLISHED_COMPLETE / TRANSITION_COPY_AUDIT_COMPLETE
- Final: RUNTIME TEMPORAL / GATES 1–4 CERRADOS / 021E BRIEFS ACCESS+LABEL READY / PRIMER ASSET ACCESS-I / NO IMPLEMENTADA

Consulta el [índice documental](docs/README.md), los contratos finales de [Estación II](docs/worlds/WORLD_II_FINAL.md), [Estación III](docs/status/GVO_STATION3_COMPLETE.md) y [Estación IV](docs/status/GVO_ST4_018E_STATION4_CLOSEOUT.md), el [inventario de assets](docs/assets/ASSET_INVENTORY.md), el [handoff de inicio de Estación V](GVO-HANDOFF-INICIO-ESTACION-V.md), la [aprobación de preproducción del Mirador](docs/status/GVO_FINAL_021C_APROBACION_HUMANA_ART_BIBLE_CAMARA_Y_DIRECCION_VISUAL.md), los [briefs Environment 021D](docs/status/GVO_FINAL_021D_ASSET_PRODUCTION_BRIEFS_ENVIRONMENT_FAMILY.md) y los [briefs de accesos/placa 021E](docs/status/GVO_FINAL_021E_ACCESS_AND_LABEL_ASSET_PRODUCTION_BRIEFS.md).
