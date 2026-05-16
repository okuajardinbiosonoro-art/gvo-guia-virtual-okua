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

Repositorio con carga inicial animada V2. La carga inicial pre-portada está disponible en `/` y `/carga`, usa assets runtime locales normalizados y queda pendiente de revisión visual del usuario. No está cerrada como pantalla final aprobada.

## Metodología de avance por pantalla

GVO se desarrolla por pantallas secuenciales. Una pantalla puede tener una base técnica o visual integrada en `main` sin estar cerrada como experiencia final. No se puede avanzar a la siguiente pantalla hasta que la pantalla actual esté marcada como `CERRADA_APROBADA` y cuente con aprobación explícita del usuario.

Estado actual:

- Carga inicial: ANIMACION_V2_IMPLEMENTADA / EN_REVISION_VISUAL
- Portada: NO_INICIADA / BLOQUEADA
- Estaciones: NO_INICIADAS / BLOQUEADAS
- Transición: NO_INICIADA / BLOQUEADA
- Final: NO_INICIADA / BLOQUEADO
