# ADR-0001: Stack base

## Estado

Aceptado.

## Contexto

GVO necesita una app web local, mobile-first, instalable como build estático y mantenible por tickets pequeños.

## Decisión

Usar Vite, React, TypeScript, React Router, Motion for React, @zxing/browser, vite-plugin-pwa, Vitest, Playwright, ESLint y Prettier.

## Consecuencias

- No se usa Next.js.
- El runtime no depende de servidor externo.
- Las rutas pueden mantenerse explícitas y simples.
- Las pruebas unitarias y e2e quedan disponibles desde el inicio.
