# GVO ST5-020H — Cierre de Estación V y salida W5→Final para revisión

Fecha: 2026-07-30

Rama de publicación: `main`

Baseline validada: `ddd6859efa3bdb3c5415b9bb6ec2cd13faac707a`

SHA final de publicación: corresponde al único commit `ST5-020H` que contiene
este documento y se verifica contra `origin/main` y el remoto después del push.
Por definición, un commit no puede incluir su propio SHA dentro de su contenido;
el handoff de publicación consigna el valor exacto.

Decisión humana de entrada: `ST5_020G_HUMAN_APPROVED`

Estado publicado: `ST5_020H_PUBLISHED_PENDING_HUMAN_REVIEW`

## Alcance ejecutado

- Se añadió el CTA nativo `Ir al cierre` únicamente al `action` del panel
  editorial del overview de Estación V cuando el progreso interno es exactamente
  4/4. Permanece fuera del DOM en 0/4–3/4, dentro de las cuatro áreas y durante
  estados transitorios.
- La activación se bloquea contra doble click, relee `gvo.progress.v1`, registra
  la estación 5 solo si falta, relee el storage y verifica `canOpenFinal` antes
  de navegar a `/transition/world-5-to-final`.
- `gvo.station5.v1` no se reescribe durante el cierre. Restaurar, recargar o
  revisitar el estado interno 4/4 tampoco completa el progreso global.
- Si leer, escribir o verificar el progreso global falla, la pantalla permanece
  en `/estacion/5`, conserva el 4/4 y muestra
  `No fue posible guardar el cierre. Inténtalo de nuevo.`. El CTA recupera foco
  y permite un reintento real.
- Las rutas `/transition/world-5-to-final` y `/final` usan una guarda previa al
  montaje. Sin estación 5 global redirigen mediante `replace` a `/estacion/5`;
  con la estación cerrada admiten entrada directa y recarga.

## Contratos preservados

- `TransitionWorld` permanece byte-idéntico al baseline. Conserva `id =
world-5-to-final`, `fromRoute = /estacion/5`, `toRoute = /final`, duración
  `2300 ms`, reduced motion `1000 ms`, portal `open`, preload `none` y copy
  editorial `TEMP`.
- `FinalRoot` permanece byte-idéntico. La evidencia de `/final` prueba solo el
  arribo al Mirador temporal; no representa aprobación visual ni cierre de Final.
- Plantas, Sistema, Espacio y Visitante no recibieron cambios funcionales,
  editoriales, de assets, sockets, anclas o composición. Las cuatro comparaciones
  protegidas pasaron la compuerta perceptual documentada; el JSON conserva
  también `exactMatch = false` por el ruido subpíxel de rasterizado entre
  ejecuciones, con error medio máximo de `0,657/255` por canal.
- Los 24 assets runtime, sus 24 espejos `current-used`, Lía, `package.json` y
  `package-lock.json` son byte-idénticos al baseline. No se agregó ningún asset
  ni dependencia.

## Responsive, accesibilidad y movimiento

Se validaron los once viewports contractuales: `360×560`, `360×640`, `375×548`,
`375×667`, `390×844`, `667×320`, `667×375`, `736×414`, `844×390`, `768×1024` y
`1024×768`.

- 45/45 capturas de estado en PASS; tipografía mínima `14 px`, target del CTA
  mínimo `124×44 px`, overflow horizontal `0` y scroll normal `0` en el overview
  4/4 + CTA.
- El CTA conserva orden lógico, nombre accesible, foco visible y estados de
  persistencia/error sin color como única señal.
- Las secuencias dinámicas `375×667 → 667×375 → 375×667` y
  `667×375 → 667×320 → 667×375` conservaron ruta, foco y estado tanto en overview
  como en error; transición no presentó overflow horizontal.
- `prefers-reduced-motion` mantiene CTA, persistencia y la transición contractual
  de 1000 ms sin omitirla ni agregar animación en Estación V.
- Cero errores de consola, errores de página, requests fallidos, 404, requests
  externos o superposiciones detectadas en la matriz.

## QA y evidencia

- Suite focal Vitest: 6 archivos y `66/66` pruebas en PASS.
- Suite global Vitest: 24 archivos y `281/281` pruebas en PASS. Un primer intento
  paralelo quedó inválido por timeout al iniciar diez workers; la repetición
  completa terminó verde sin errores no controlados.
- Playwright focal: `16/16` pruebas en PASS — nueve de 020H, tres regresiones
  020G y cuatro de TransitionWorld—. Cubre cierre, retry, guardas, recarga,
  reduced motion, 11 viewports, reflow dinámico, comparaciones y navegador real
  Chromium. El preview histórico de transición se estabilizó esperando carga
  real de imágenes y comprobando presencia de capas alternas de su timeline.
- ESLint: PASS. TypeScript: PASS. Build Vite/PWA: PASS. Se conserva el warning
  informativo preexistente de chunk mayor de 500 kB.
- Auditoría: `24/24` assets y `24/24` espejos en PASS; `0` assets nuevos,
  URLs externas, CDN, fuentes remotas, audio o video.
- PWA generada: `24/24` assets de Estación V en precache, shell precargado y
  navigation fallback presente.
- Assets raíz de transición: 34 archivos runtime validados.
- Chromium `148.0.7778.96`: PASS. Firefox y WebKit no se ejecutaron porque sus
  binarios Playwright no están instalados; no se declaran validados.
- La instalación y el relanzamiento de una PWA instalada continúan siendo una
  comprobación manual de plataforma y no se declaran certificados.

La evidencia reproducible está en `docs/visual/world5/st5-020h/`: 84 archivos
con capturas, reduced motion, orientación dinámica, dos contact sheets, seis
comparaciones 020G/020H, métricas, resumen, matriz de navegadores, auditoría de
assets, inventario de precache y contratos congelados. El generador de contratos
es `tools/qa/st5_020h_verify_contracts.mjs`.

## Límites y revisión pendiente

- No se modificaron TransitionWorld, FinalRoot, assets, identidad de Lía,
  arquitectura de progreso, copy `TEMP`, audio, permisos ni dependencias.
- No se declara aprobación humana de `ST5-020H`.
- No se declara aprobada la pantalla Final ni se inicia el Mirador.
- La revisión humana pendiente cubre únicamente CTA, persistencia global,
  guardas, transición y arribo.

Estado técnico final: `ST5_020H_PUBLISHED_PENDING_HUMAN_REVIEW`.

**REVISIÓN HUMANA DE OVERVIEW 4/4 + CTA IR AL CIERRE + TRANSICIÓN W5→FINAL + ARRIBO A MIRADOR TEMPORAL**
