# GVO — Mobile performance audit 004F-0A

## 0. Estado

Estado del ticket: AUDITORIA DOCUMENTAL COMPLETADA.

Este documento audita performance mobile-first, carga por capas y estrategia de preload para GVO en el estado actual de `main`.

Base auditada:

- Rama: `main`
- Commit: `2c27107 feat(gvo): add static ready state for Mundo I`
- Tipo de trabajo: auditoria tecnica/visual
- Cambios runtime: ninguno
- Assets editados: ninguno
- Dependencias agregadas: ninguna

## 1. Alcance auditado

Rutas revisadas:

- `/`
- `/carga`
- `/portada`
- `/transition/intro-to-station-1`
- `/estacion/1`
- `/dev/transition-world`
- `/dev/world1-root-layout`

Viewports usados:

- `360x800`
- `390x844`
- `430x932`

La ruta `/` fue medida en `390x844` como entrada de carga inicial. Las rutas principales de pantalla fueron medidas en los tres tamaños mobile.

## 2. Evidencia generada

Carpeta de validacion:

```txt
docs/gvo/performance/validation/004F0A/
```

Archivos principales:

- `asset-inventory.json`
- `asset-summary.json`
- `route-performance-metrics.json`
- `route-performance-summary.json`
- capturas PNG por ruta y viewport

Las mediciones fueron generadas con un servidor Vite local temporal y Playwright. No se usaron recursos externos.

## 3. Resumen por ruta

| Ruta | Viewports | Imagenes visibles | Recursos imagen | Peso medido aprox. | Overflow horizontal | Audio/video |
| --- | --- | ---: | ---: | ---: | --- | --- |
| `/` | 390x844 | 11 | 42 | 6119.7 KB | No | No |
| `/carga` | 360/390/430 | 11 | 42 | 6119.7 KB | No | No |
| `/portada?resetIntro=1` | 360/390/430 | 24 | 53 | 8189.6 KB | No | No |
| `/transition/intro-to-station-1` | 360/390/430 | 15 | 48 | 3025.4 KB | No | No |
| `/estacion/1` | 360/390/430 | 5 | 40 | 7908.9 KB | No | No |
| `/dev/transition-world` | 390x844 | 15 | 48 | 3025.4 KB | No | No |
| `/dev/world1-root-layout` | 390x844 | 5 | 40 | 7908.9 KB | No | No |

Nota: `/dev/world1-root-layout` presenta scroll vertical, esperado por ser herramienta de calibracion y no pantalla runtime final.

## 4. Hallazgos principales de performance

1. La carga inicial actual es principalmente una pantalla temporizada/visual; no funciona todavia como compuerta real de preload y decode para Portada, Transicion o Mundo I.

2. Portada / Intro sigue siendo una pantalla pesada para mobile: renderiza muchas capas visibles y solicita alrededor de 8 MB en la medicion local de desarrollo.

3. Mundo I: Raiz tiene una libreria de assets robusta, pero pesada. El conjunto inventariado pesa 19.55 MB y la entrada inicial critica se estima en 5.01 MB. La ruta `/estacion/1` midio alrededor de 7.9 MB de recursos.

4. Transicion entre mundos es el mejor patron actual de optimizacion: conserva PNG fallback, pero usa WebP en runtime mediante `picture`/fuentes preferentes. Su subconjunto critico WebP es mucho mas liviano.

5. La percepcion de "carga por capas" en mobile probablemente no viene de CDN ni recursos externos, sino de muchas imagenes locales decodificandose y apareciendo en momentos cercanos sin una compuerta explicita de `decode()`.

6. No se detecto audio, video runtime, CDN ni recursos externos en las rutas auditadas.

7. No se detecto overflow horizontal en rutas runtime principales.

## 5. Hallazgos de mobile layout

1. `/carga`, `/portada`, `/transition/intro-to-station-1` y `/estacion/1` no mostraron overflow horizontal en 360, 390 ni 430 px.

2. Mundo I en estado intro y ready-to-continue cabe sin scroll vertical en las capturas runtime, pero la composicion es densa en 360 px.

3. Los nodos de Mundo I quedan cerca del panel inferior. En textos mas largos o futuras animaciones existe riesgo de que los nodos tapen lectura o compitan con el panel.

4. El camino de salida de Mundo I se percibe como una capa luminosa amplia sobrepuesta a raices/fondo. No esta roto tecnicamente, pero visualmente necesita calibracion independiente antes de conectarlo con navegacion real.

5. La planta y la raiz base estan suficientemente alineadas para continuar con auditoria/preload, pero la revision visual en dispositivo real debe seguir siendo fuente principal antes de animar.

## 6. Riesgos tecnicos

- Si se agregan animaciones sin compuerta de assets, el usuario puede ver capas entrando tarde o imagenes apareciendo de golpe en celulares reales.
- Si se precargan todos los assets globalmente, la entrada inicial puede sentirse lenta y consumir memoria innecesaria.
- Si Mundo I carga todas las poses futuras desde el inicio, el primer estado puede pagar costo de assets que no necesita aun.
- Si se optimizan PNG sin validar visualmente, se puede degradar Lía, raices o portales aprobados.

## 7. Decision tecnica

La siguiente mejora tecnica deberia ser una estrategia de carga por bundles de pantalla y estado, no un preload global completo.

Decision recomendada:

- mantener la carga inicial como pre-portada visual;
- agregar un preloader local por manifiestos;
- precargar solo el bundle critico de la siguiente pantalla;
- usar `HTMLImageElement.decode()` con timeout controlado;
- diferir assets secundarios de Mundo I hasta que el estado los necesite;
- conservar fallback visual si un asset no decodifica a tiempo.

## 8. Fuera de alcance confirmado

- No se implemento preload.
- No se implemento pantalla nueva.
- No se modifico carga inicial.
- No se modifico Portada / Intro.
- No se modifico Transicion entre mundos.
- No se modifico Mundo I.
- No se editaron assets.
- No se agregaron dependencias.
- No se agrego audio.
- No se agrego video runtime.
- No se usaron recursos externos.
- No se uso CDN.

