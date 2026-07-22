# Retrospectiva — Estación IV / Mundo IV

## Propósito

Esta retrospectiva consolida el trabajo desde la auditoría `018A` hasta el
cierre `018E`. No altera los flags históricos ni convierte validación técnica
en aprobación estética retroactiva. La aprobación humana final pertenece a
`018E`.

## Secuencia de trabajo

```text
auditoría e inventario
→ cámara, anchors y capas
→ lookdev y producción asset-first
→ composición estática
→ layout inmersivo
→ interacción y motion
→ aprobación humana
→ documentación y cierre Git
```

El orden fue decisivo: cada etapa estabilizó una categoría de decisiones antes
de permitir la siguiente.

## Qué salió bien

- **Inventario antes de generar.** `018A` separó lo existente, lo reutilizable,
  los placeholders y los faltantes antes de producir arte.
- **Camera contract y layer contract.** `018B` fijó una sola perspectiva y un
  orden z común, evitando que cada asset inventara su cámara.
- **Artboard único.** El sistema `1536×1024` permitió medir, normalizar anchors
  y escalar la mesa como una unidad.
- **Asset-first.** El runtime no se usó como lugar de improvisación visual; los
  assets se produjeron y aprobaron antes de integrarse.
- **Lookdev.** Una referencia común alineó materialidad, iluminación, volumen y
  tono sin convertirse en un asset runtime.
- **Capas separadas.** Entorno, profundidad, haze, sombra, base, canto y
  tabletop pudieron aislarse y diagnosticarse.
- **Pedestales y halos reutilizables.** Una pieza de cada tipo sostuvo los ocho
  nodos sin crear inconsistencias gratuitas.
- **Ocho objetos semánticos distintos.** Planta, Bionosificador, ESP32, MIDI,
  Wi‑Fi/UDP, Router, Sistema central y Sonido conservaron identidad propia.
- **UI 9-slice.** Backplates assetizados y contenido DOM mantuvieron identidad
  visual, responsive, foco y accesibilidad.
- **Manifest y SHA-256.** Intake, runtime y mirrors quedaron verificables; la
  aprobación no dependió del nombre del archivo.
- **Alpha-aware alignment.** El contenido visible, no el canvas transparente,
  gobernó centro y baseline.
- **Static composition antes de motion.** Primero se estabilizaron cámara,
  escala, objetos y tarjeta.
- **Immersive layout antes de coreografía.** Portrait, landscape, fullscreen y
  orientación se resolvieron antes de mover Lía o activar la ruta.
- **Fullscreen API y orientation hint.** Fullscreen sólo ocurre por gesto
  explícito; la ayuda de orientación informa sin bloquear.
- **Reduced motion.** Se diseñó una secuencia completa equivalente, no una
  simple desactivación global.
- **QA humano y evidencia real.** Chromium, matrices, contact sheets, trazas y
  WebM apoyaron la decisión, mientras la aprobación estética siguió siendo
  humana.
- **Microfrentes y gates.** Cada ticket tuvo un contrato acotado, evidencia y
  una barrera explícita antes de avanzar.

## Qué salió mal o costó demasiado

- **Sombra generativa para una geometría determinista.** Una sombra técnica
  exacta no necesitaba incertidumbre generativa.
- **Ruta generativa difícil de registrar.** La trayectoria requería anchors y
  segmentos medibles; el enfoque generativo dificultó continuidad y estado.
- **Master genérico de objetos.** Un master común tendía a homogeneizar ocho
  categorías con funciones y siluetas distintas. Se rechazó
  `world4_node_top_object_master_v01.png`.
- **Bboxes ideales que Images no respetaba.** Canvas y transparencia entregados
  no siempre coincidían con la masa visual esperada.
- **Confusión canvas vs contenido.** Centrar 1024×1024 no equivale a centrar el
  objeto visible dentro de ese canvas.
- **Capa frontal ambigua.** El canto z5 generó “puntas” laterales; sólo los
  toggles por capa permitieron atribuir el problema con certeza.
- **Portrait y fullscreen considerados tarde.** La composición estática era
  correcta, pero el uso inmersivo real exigió un microfrente adicional.
- **Estación demasiado apagada.** La primera integración heredó un tono más
  oscuro de lo conveniente y necesitó ajuste local contenido.
- **Demasiadas iteraciones cuando CSS/SVG/Python era mejor.** Geometría,
  máscaras, rutas, mediciones y sombras técnicas debieron tratarse como
  problemas deterministas desde el principio.
- **Riesgo de confundir PASS técnico con aprobación visual.** Tests, hashes y
  navegador prueban integridad y comportamiento; no sustituyen el juicio
  estético del usuario.

## Aprendizajes

- Usar **SVG/CSS/Python para geometría exacta**, rutas, sombras técnicas,
  máscaras y mediciones reproducibles.
- Aceptar por **escala de integración** cuando el bbox visual es válido: no
  reexportar un asset correcto sólo porque su transparencia no ocupa el canvas
  ideal imaginado.
- No crear un **master genérico** para categorías visualmente diversas.
- Verificar siempre **dimensiones y alpha bbox reales**, además de filename y
  SHA-256.
- Separar con precisión **canvas, contenido visible y escala CSS**.
- Aislar capas mediante **toggles** antes de corregir por intuición.
- Diseñar **mobile landscape desde preproducción**, no como parche al final.
- Desarrollar en el orden:

  ```text
  assets → static → immersive → motion → closeout
  ```

- La **aprobación humana manda en decisiones estéticas**. Una matriz técnica
  impecable puede seguir necesitando corrección visual.

## Decisiones que deben permanecer

- Texto arriba, mesa abajo.
- Cámara y artboard únicos.
- Anchors normalizados y alineación alpha-aware.
- z1 retenido; z5 preservado pero excluido del render por decisión humana.
- UI semántica en DOM; assets para identidad, materialidad y volumen.
- Secuencia técnica 1→8 y estados no dependientes sólo del color.
- Lía reutiliza `explain_calm` y `greeting`.
- Portrait soportado y mobile landscape recomendado.
- OrientationHint no bloqueante y fullscreen sólo por gesto explícito.
- Reduced motion funcionalmente completo.
- No audio runtime.
- Runtime y `current-used` como pares byte-idénticos y auditables.

## Aplicación a Estación V

La siguiente estación debe conservar la metodología, no copiar la estética de
la mesa:

- auditar estado, paths, copy, assets y deuda antes de diseñar;
- resolver narrativa, interacción, cámara, responsive y capas en
  preproducción;
- separar asset de geometría ejecutable;
- producir assets uno por uno, con canvas, filename, referencias y criterios;
- integrar estático antes de motion;
- incorporar portrait, landscape, fullscreen/PWA y reduced motion desde el
  inicio;
- mantener un gate humano antes del cierre;
- no convertir placeholders procedurales en arte aprobado por permanencia.

## Cierre

El principal éxito de Estación IV no fue sólo su resultado visual. Fue convertir
una base funcional 2.5D en una experiencia aprobada mediante un proceso
trazable que distingue inventario, preproducción, generación, integración,
validación técnica y decisión humana.

El estado técnico y las condiciones Git viven en
[`GVO_ST4_018E_STATION4_CLOSEOUT.md`](../status/GVO_ST4_018E_STATION4_CLOSEOUT.md).
