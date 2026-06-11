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

También existe una pantalla reutilizable de transición entre mundos. La primera transición runtime aprobada para avanzar conecta Portada / Intro con Mundo I: Raíz en `/estacion/1`.

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

Repositorio con carga inicial animada V13 consolidada en `main` como base estable de avance. La carga inicial pre-portada está disponible en `/` y `/carga`, usa assets runtime locales normalizados y queda documentada como `APROBADA_PARA_AVANZAR / 7.2_DE_10 / DEUDA_VISUAL_DOCUMENTADA`. No está cerrada como `CERRADA_APROBADA_FINAL`.

La Portada / Intro, `EL ARCHIVO VIVO DE OKÚA`, está en `APROBADA_PARA_AVANZAR / 7.8_DE_10 / DEUDA_VISUAL_DOCUMENTADA / NO_CERRADA_FINAL`. `/portada` muestra la base visual, los cinco diálogos introductorios de Lía, feedback de portales bloqueados, un panel de diálogo integrado sin conector ordinario, progreso legible `Paso X de 5`, Portal I protagonista, rig facial seguro en idle y diálogos 1-4, y una activación del Portal I por capas con Lía anclada al portal, frame frontal duplicado y luz de contacto CSS antes de entregar el flujo a la transición real. Para revisar primera pasada, usar `/portada?resetIntro=1` o `/?resetIntro=1`.

La Transición entre mundos está en `APROBADA_PARA_AVANZAR / 7.9_DE_10 / FUNCIONAL_INTEGRADA / DEUDA_VISUAL_DOCUMENTADA`. `/transition/intro-to-station-1` ejecuta la transición runtime desde Portada hacia `/estacion/1`; `/dev/transition-world` se conserva como preview técnico aislado.

Mundo I: Raíz ya está montado en `/estacion/1` mediante `World1RootScreen`. Incluye fondo aprobado, raíces, planta, Lía por estados, nodos secuenciales de RELACIÓN / PERCEPCIÓN / MEDIACIÓN y estado `ready_to_continue` sin navegación de salida final. No está marcado como `CERRADA_APROBADA_FINAL`; conserva deuda visual y de continuidad documentada.

El Atlas Visual 006I quedó cerrado para etapa pre-PDFs: 47 PNG en la carpeta Atlas, mapa de 197/197 slots y sin pendientes visuales bloqueantes en `manifest_006i_pending_visuals.csv`.

## Metodología de avance por pantalla

GVO se desarrolla por pantallas secuenciales. Una pantalla puede avanzar bajo dos estados documentados:

- `APROBADA_PARA_AVANZAR`: calificación visual del usuario igual o superior a 7/10, aprobación explícita del usuario Ing. José David, estabilidad técnica, reglas no negociables cumplidas y deuda visual documentada.
- `CERRADA_APROBADA_FINAL`: calificación objetivo igual o superior a 9/10 y sin deuda visual importante.

`main` puede contener pantallas aprobadas para avanzar, no necesariamente finales. El aprobador visual explícito es el usuario Ing. José David. La metodología completa está en `docs/process/METODOLOGIA_AVANCE_POR_UMBRAL_VISUAL.md`.

Estado actual:

- Carga inicial: APROBADA_PARA_AVANZAR / 7.2_DE_10 / DEUDA_VISUAL_DOCUMENTADA
- Portada: APROBADA_PARA_AVANZAR / 7.8_DE_10 / DEUDA_VISUAL_DOCUMENTADA / NO_CERRADA_FINAL
- Transición: APROBADA_PARA_AVANZAR / 7.9_DE_10 / FUNCIONAL_INTEGRADA / DEUDA_VISUAL_DOCUMENTADA
- Estación I: WORLD1_ROOT_RUNTIME_BASE / READY_TO_CONTINUE_SIN_SALIDA_FINAL / DEUDA_VISUAL_DOCUMENTADA
- Estaciones II-V: NO_INICIADAS / BLOQUEADAS
- Final: NO_INICIADA / BLOQUEADO
