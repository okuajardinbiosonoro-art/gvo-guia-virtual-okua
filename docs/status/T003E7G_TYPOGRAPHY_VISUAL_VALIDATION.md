# T003E7G - Validacion visual comparativa de tipografia GVO

## 1. Resumen del ticket

T003E7G realiza una validacion visual comparativa de la tipografia GVO despues de la migracion por tokens de:

- Carga Inicial.
- Portada / Intro.
- Portada / Intro con dialogo de Lia visible.
- TransitionWorld.

Este ticket no modifica runtime, CSS, tokens, assets, rutas, textos, navegacion ni dependencias. El alcance fue generar evidencia visual, revisar coherencia tipografica y dejar una decision documental para saber si la tipografia global puede avanzar.

## 2. Rama base y rama final

- Rama base: `feature/003E7F-lia-dialog-typography-check`
- Commit base: `878c9e5 docs: verify lia dialog typography coverage`
- Rama final: `feature/003E7G-typography-visual-validation`

## 3. Pantallas capturadas

Se capturaron estas pantallas:

- Carga Inicial: `/carga`
- Portada / Intro: `/portada?resetIntro=1`
- Portada / Intro con dialogo de Lia visible: `/portada?resetIntro=1`, accion `Comenzar recorrido`
- TransitionWorld: `/dev/transition-world`

## 4. Viewports usados

- `390x844`
- `430x932`

## 5. Capturas generadas

Capturas guardadas en:

`docs/visual/typography/validation/t003e7g/`

Archivos:

- `typography-loading-initial-390x844.png`
- `typography-loading-initial-430x932.png`
- `typography-cover-intro-390x844.png`
- `typography-cover-intro-430x932.png`
- `typography-cover-intro-dialogue-390x844.png`
- `typography-cover-intro-dialogue-430x932.png`
- `typography-transition-world-390x844.png`
- `typography-transition-world-430x932.png`

Comando usado: capturas Playwright con `@playwright/test` contra `http://127.0.0.1:5173`, creando paginas con los dos viewports requeridos y usando el flujo real de CTA para abrir el dialogo de Lia.

## 6. Estado de tokens globales

El sistema tipografico global vigente esta en `src/styles/tokens.css`.

Tokens relevantes:

- `--gvo-font-display`
- `--gvo-font-heading`
- `--gvo-font-ui`
- `--gvo-font-microcopy`
- `--gvo-font-system-readable`
- `--gvo-font-body`
- `--gvo-font-dialog`
- `--gvo-text-display-size`
- `--gvo-text-title-size`
- `--gvo-text-heading-size`
- `--gvo-text-subtitle-size`
- `--gvo-text-dialog-size`
- `--gvo-text-ui-size`
- `--gvo-text-microcopy-size`

Decision vigente desde T003E7A/T003E7B:

- Pixelify Sans local se usa para identidad, headings, microcopy y UI corta.
- Stack de sistema local se conserva para body y dialogos largos.
- No se usa `Inter` fantasma.
- No hay fuente remota, CDN ni `@import url(...)`.

## 7. Evaluacion visual por pantalla

### Carga Inicial

La Carga Inicial mantiene un lenguaje pixelart suave y legible. El titulo `Preparando el recorrido` queda centrado, con buena escala y sin recorte en 390x844 ni 430x932. El subtitulo `Cuidando el inicio...` conserva jerarquia secundaria clara y no compite con la barra ni con los elementos animados.

Resultado: coherente con los tokens, legible y sin overflow observado.

### Portada / Intro

Portada / Intro usa la escala display mas fuerte del sistema con la marca `OKUA`, que funciona como pieza especial de identidad. El subtitulo `GUIA VISUAL`, el titulo `EL ARCHIVO VIVO DE OKUA` y el CTA `Comenzar recorrido` se ven integrados con el caracter pixelart. La portada es mas expresiva que Carga Inicial y TransitionWorld, pero esa diferencia es intencional por su rol de pantalla principal.

Resultado: coherente como display/intro, sin recorte observado y con CTA legible.

### Portada / Intro con dialogo de Lia

El panel de dialogo conserva el stack legible para cuerpo narrativo y usa UI corta con caracter pixelart en el boton `Siguiente`. La diferencia entre el texto de dialogo y los headings pixelart se percibe como decision de lectura, no como ruptura accidental. El texto del dialogo entra correctamente en 390x844 y 430x932.

Resultado: dialogo compatible con el sistema. Se mantiene como mezcla controlada: body legible y UI pixelart.

### TransitionWorld

TransitionWorld usa Pixelify desde tokens para titulo y microcopy. El texto `Abriendo Mundo I: Raiz...` se mantiene compacto, centrado y legible; el subtitulo `Preparando recorrido...` conserva jerarquia secundaria sin generar ruido. La pantalla se siente alineada con Carga Inicial por escala tranquila y con Portada por identidad pixelart.

Resultado: coherente y sin overflow observado.

## 8. Comparacion de titulos/headings

- Carga Inicial: heading sereno, mediano, con tono lavanda; correcto para pre-portada.
- Portada / Intro: display grande y protagonista; correcto para marca/pantalla principal.
- TransitionWorld: heading breve y contenido; correcto para transicion corta.

La jerarquia entre pantallas queda clara: Portada puede ser mas grande por ser portada; Carga Inicial y TransitionWorld comparten una escala mas funcional.

## 9. Comparacion de microcopy/subtitulos

- Carga Inicial: `Cuidando el inicio...` se ve delicado y estable.
- Portada / Intro: `GUIA VISUAL` funciona como subtitulo de marca, mas compacto y editorial.
- TransitionWorld: `Preparando recorrido...` se alinea bien con la escala de microcopy.

No se detectan recortes ni saltos de jerarquia en los viewports capturados.

## 10. Comparacion de botones/CTA

El CTA principal de Portada y el boton de dialogo se ven pixelart y compatibles entre si, aunque el boton de dialogo vive dentro de un panel con cuerpo legible. La diferencia no bloquea: el sistema distingue correctamente accion corta de texto narrativo.

No se observan porcentajes, numeros extra ni textos tecnicos nuevos.

## 11. Comparacion de dialogos de Lia

Los dialogos reales de Lia siguen concentrados en Portada / Intro. La cobertura documentada por T003E7F se confirma visualmente: no aparece un segundo estilo de dialogo compitiendo en otra pantalla.

La eleccion de `--gvo-font-dialog` para cuerpo largo conserva legibilidad movil. El panel, el speaker y el boton sostienen la identidad visual sin forzar Pixelify en todo el texto narrativo.

## 12. Comparacion de legibilidad movil

En 390x844 y 430x932:

- No se observo overflow horizontal.
- No se observaron cortes de titulo.
- No se observaron cortes de subtitulo.
- No se observaron cortes de CTA.
- El dialogo de Lia mantiene lectura comoda.
- TransitionWorld conserva titulo y subtitulo dentro del area visual.

## 13. Inconsistencias restantes

No se detectan inconsistencias graves.

Inconsistencias menores aceptables:

- Portada / Intro usa una escala display mucho mas protagonista que las otras pantallas. Se considera intencional por ser marca/intro.
- El cuerpo de dialogo de Lia usa stack de sistema, no Pixelify. Se considera intencional y documentado para lectura movil.
- Esta validacion cubre 390x844 y 430x932 segun ticket; una futura revision global podria volver a incluir 360x640 si el usuario lo solicita.

## 14. Riesgos visuales detectados

- Si en futuras pantallas aparecen dialogos mas largos de Lia, conviene validar nuevamente `--gvo-font-dialog` con textos de mayor longitud.
- Si se agrega una segunda fuente local para body/dialogos, debe entrar por ticket propio y con comparativa visual.
- La escala display de Portada no debe copiarse a pantallas funcionales o de transicion; debe permanecer como nivel de marca.

## 15. Decision documental final

`TIPOGRAFÍA_GVO_VALIDADA_PARA_AVANZAR`

Motivo:

- Las tres pantallas principales migradas se ven coherentes.
- La jerarquia tipografica es clara.
- La estetica pixelart se conserva sin perjudicar lectura movil.
- Los dialogos de Lia quedan legibles y compatibles con el sistema.
- No se detectaron problemas visuales bloqueantes en las capturas requeridas.

## 16. Recomendacion final

No se recomienda abrir un ajuste puntual inmediato por tipografia. El siguiente paso puede avanzar con el sistema tipografico actual, manteniendo como deuda menor revisar 360x640 o dialogos mas largos si una pantalla futura lo exige.

## 17. Validaciones ejecutadas

```powershell
npm run lint
npm run test
npm run build
npm run audit:assets
npm run test:e2e
```

## 18. Resultado de validaciones

- `npm run lint`: OK.
- `npm run test`: OK, 5 archivos y 41 tests.
- `npm run build`: OK, build de produccion generado correctamente.
- `npm run audit:assets`: OK, sin URLs externas, CDN ni uso de audio.
- `npm run test:e2e`: OK, 30 tests.

Nota: `npm run test:e2e` regenero capturas historicas de Portada / Intro y TransitionWorld. Esas capturas se restauraron antes del commit porque estan fuera del alcance de T003E7G.

## 19. Confirmaciones de alcance

- No se modifico runtime.
- No se modifico CSS.
- No se modificaron tokens.
- No se modifico Carga Inicial.
- No se modifico Portada / Intro.
- No se modifico TransitionWorld.
- No se modificaron assets.
- No se cambiaron textos.
- No se cambiaron rutas.
- No se cambio navegacion.
- No se agregaron fuentes.
- No se agregaron dependencias.
- No se uso CDN.
- No se uso audio.
- No se uso video.

## 20. Estado final esperado

El cierre debe quedar publicado en `origin/feature/003E7G-typography-visual-validation` con working tree limpio.
