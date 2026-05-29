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

También existe una pantalla reutilizable de transición entre mundos, pendiente de diseño e implementación en ticket propio.

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

La Portada / Intro, `EL ARCHIVO VIVO DE OKÚA`, está en `BASE_VISUAL_IMPLEMENTADA / SIN_DIALOGOS / SIN_GATING_FINAL / NO_CERRADA`. Existe una primera base visual en `/portada`, usando assets runtime locales staged; los diálogos completos, gating narrativo y transición quedan pendientes.

## Metodología de avance por pantalla

GVO se desarrolla por pantallas secuenciales. Una pantalla puede avanzar bajo dos estados documentados:

- `APROBADA_PARA_AVANZAR`: calificación visual del usuario igual o superior a 7/10, aprobación explícita del usuario Ing. José David, estabilidad técnica, reglas no negociables cumplidas y deuda visual documentada.
- `CERRADA_APROBADA_FINAL`: calificación objetivo igual o superior a 9/10 y sin deuda visual importante.

`main` puede contener pantallas aprobadas para avanzar, no necesariamente finales. El aprobador visual explícito es el usuario Ing. José David. La metodología completa está en `docs/process/METODOLOGIA_AVANCE_POR_UMBRAL_VISUAL.md`.

Estado actual:

- Carga inicial: APROBADA_PARA_AVANZAR / 7.2_DE_10 / DEUDA_VISUAL_DOCUMENTADA
- Portada: BASE_VISUAL_IMPLEMENTADA / SIN_DIALOGOS / SIN_GATING_FINAL / NO_CERRADA
- Estaciones: NO_INICIADAS / BLOQUEADAS
- Transición: NO_INICIADA / BLOQUEADA
- Final: NO_INICIADA / BLOQUEADO
