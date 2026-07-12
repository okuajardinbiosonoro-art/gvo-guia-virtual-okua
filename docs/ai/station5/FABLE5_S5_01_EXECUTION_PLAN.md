# FABLE5-S5-01 — Plan de ejecución — Estación V / Mundo V: Mapa del presente

Fecha: 2026-07-12
Rama: `feature/fable5-s5-01-station5-present-map`
Ruta objetivo: `/estacion/5` (ya registrada en `src/app/router.tsx`).

## Nota sobre referencias del ticket

El ticket cita `docs/ai/station5/*` como material de lectura; esas rutas no existen
en el repositorio. El material equivalente real usado como autoridad es:

- Especificación: `docs/narrative/source_txt/07_estacion_v_mapa_presente_especificacion_v1.txt`
- Imagen de referencia: `docs/narrative/visual_refs/07_estacion_v_mapa_presente.png`
  (idéntica a `docs/narrative/atlas_visual_assets_gvo_v1/gvo_atlas_006c_208_ref_estacion_v_mapa_presente.png`)
- Slots editoriales: `docs/narrative/estaciones/07_estacion_v_mapa_presente_slots.md`

## Decisión técnica

- **CSS 3D (perspective + rotateX suave ~26° + rotateZ leve)**, siguiendo el patrón
  probado de Estación IV (`World4Root`), pero con cámara más elevada y contemplativa
  (semi-cenital, no la perspectiva técnica de la mesa).
- Objetos de área como **SVG procedural inline** (placeholders reemplazables por Codex),
  contrarrotados en billboard para quedar "de pie" sobre la maqueta.
- **Lía oficial reutilizada**: poses PNG de
  `public/assets/gvo/shared/lia/current-used/portada-intro/` (mismas de Estación IV).
- **Sin dependencias nuevas.** Sin Three.js (AGENTS.md lo prohíbe sin autorización
  explícita; CSS 3D logra la profundidad requerida con costo mínimo en móvil).
- Sin audio, sin red, sin CDN.

## Archivos

Crear/reescribir (solo Estación V):

1. `src/screens/World5Root/station5Content.ts` — copy aprobado del ticket/especificación
   (áreas, mensajes de Lía, CTA, poses de Lía). Sustituye los TEMP de
   `world5EditorialSlots` para esta pantalla (mismo patrón que Estación IV).
2. `src/screens/World5Root/station5AreaArt.tsx` — visuales procedurales por área con
   arquitectura de slot reemplazable (`visualKey` + `data-station5-visual`).
3. `src/screens/World5Root/World5RootScreen.tsx` — reescritura completa:
   maqueta orgánica 2.5D, cuatro áreas secuenciales, nexo central, Lía guía,
   CTA "Ir al cierre", modo revisita.
4. `src/screens/World5Root/World5RootScreen.css` — reescritura completa (paleta crema).
5. `src/screens/World5Root/World5RootScreen.test.tsx` — reescritura de cobertura
   según los 15 puntos del ticket.
6. `public/assets/gvo/current-used/world-5-root/README.md` — registro de assets runtime.
7. Documentación: este plan, changelog, reporte de validación y
   `docs/status/FABLE5_S5_01_STATION5_PRESENT_MAP.md`.
8. Capturas: `docs/visual/world5/fable5-s5-01/` vía script Playwright local.

No tocar: Estaciones I–IV, rutas, transiciones, pantalla final. Los cambios sin
commit de World3/World4 presentes en el working tree pertenecen a otra sesión y
no se incluyen en los commits de este ticket.

## Máquina de estados

`entering → plants_suggested → plants_active → (hint sistema) → system_active →
(hint espacio) → space_active → (hint visitante) → visitor_active →
map_integrated → ready_to_close ⇄ revisit_mode → exiting`

- Una sola área activa a la vez; primera pasada estrictamente secuencial.
- Avance tocando la siguiente área iluminada (sin botones "Siguiente").
- Área bloqueada → mensaje calmado de Lía, sin avance.
- Conexión área→nexo se enciende con el área; el nexo sube de intensidad (0–4).
- CTA deshabilitado (aria-disabled) hasta completar Visitante.
- Revisita libre tras completar; conexiones y nexo permanecen.

## Validación

`npm run lint`, `npm run test`, `npm run build`, `git diff --check`,
auditoría de URLs/CDN/audio, capturas Playwright (estados + 360x640/390x844/430x932
+ reduced motion).
