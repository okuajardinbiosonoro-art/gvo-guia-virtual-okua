# T003E4 - Transition preview static corrections

## 1. Resumen

Se corrigió el preview estático con assets reales de la transición:

`Portada / Intro -> Mundo I: Raíz`

La pantalla sigue disponible únicamente como ruta dev en:

`/dev/transition-world`

Este ticket corrige la escala visual y el layering de la barra de progreso sin implementar animación completa ni navegación real.

Estado final:

`TRANSITION_PREVIEW_STATIC_CORRECTIONS_T003E4 / EN_REVISION_VISUAL`

## 2. Rama base y rama final

- Rama base: `feature/003E3-transition-world-real-assets-preview`
- Commit base: `c6dd7f3 feat: integrate approved transition assets preview`
- Rama final: `feature/003E4-transition-preview-static-corrections`

## 3. Observaciones corregidas

### Acceso móvil al preview

La transición no aparece al entrar al root de la app porque todavía no está conectada al flujo real. Eso es intencional.

Para revisar desde celular en la misma red:

1. Ejecutar en el PC:

```powershell
npm run dev -- --host 0.0.0.0
```

2. Abrir en el celular:

```text
http://IP_DEL_PC:5173/dev/transition-world
```

Ejemplo: si el PC tiene IP `192.168.88.20`, abrir:

```text
http://192.168.88.20:5173/dev/transition-world
```

No se creó enlace visible desde Portada y no se conectó navegación real.

### Barra de progreso

Problema T003E3: el fill quedaba visualmente por encima del track y tapaba parte del contorno, especialmente en el lado izquierdo.

Corrección T003E4:

- `progressFillClip` queda debajo del track.
- `progressTrackPicture` queda por encima del fill.
- `progressSparkPicture` queda por encima de ambos.
- El fill usa clip interno con inset horizontal para no invadir ornamentos.
- El progreso estático se ajustó a una lectura cercana a `62%`.

Layering aplicado:

```text
z-index 1 -> fill segment
z-index 3 -> track/frame
z-index 4 -> spark
```

No se muestran porcentajes ni números.

### Escala visual

Se aumentó ligeramente la escala del conjunto principal:

- Portal: de `clamp(218px, 58vw, 272px)` a `clamp(242px, 64vw, 304px)`.
- Lía: de `clamp(70px, 20vw, 88px)` a `clamp(78px, 22vw, 98px)`.
- Progress: de `clamp(254px, 74vw, 328px)` a `clamp(282px, 80vw, 360px)`.

Se ajustó el stage para mantener respiración vertical sin pegar textos ni barra.

## 4. Decisiones de layout

- El portal permanece en zona superior/media.
- Lía sigue a la derecha del portal para acompañar sin tapar el símbolo raíz.
- Los textos quedan debajo del portal como DOM/CSS.
- La barra queda debajo del texto, más grande y con track limpio.
- No hay overflow horizontal en e2e.

## 5. Textos DOM/CSS

Se conservaron exactos:

- `Abriendo Mundo I: Raíz...`
- `Preparando recorrido...`

No se incrustó texto en imágenes.

## 6. Confirmación de fuera de alcance

- No se modificó Portada / Intro.
- No se modificó Carga Inicial.
- No se conectó navegación real.
- No se navegó a Mundo I.
- No se implementó animación completa.
- No se agregaron sparkles reutilizables todavía.
- No se modificó tipografía global.
- No se agregaron dependencias.
- No se usó CDN.
- No se usaron recursos externos.
- No se agregó audio.
- No se agregó video runtime.
- No se usó Three.js, React Three Fiber, Drei, Blender ni GLB.

## 7. Pendientes deliberadamente excluidos de T003E4

- T003E5: motion foundation / entrada-salida / portal pulse / Lía idle.
- T003E6: sparkles reutilizables desde Carga Inicial.
- T003E7: auditoría tipográfica global GVO.
- T003E8: integración real Portada -> Transición -> Mundo I.

## 8. Capturas generadas

- `docs/visual/transition-world/validation/t003e4/transition-world-t003e4-390x844.png`
- `docs/visual/transition-world/validation/t003e4/transition-world-t003e4-430x932.png`

## 9. Validaciones ejecutadas

```powershell
npm run validate:transition-root-assets
npm run lint
npm run test
npm run build
npm run audit:assets
npm run test:e2e -- tests/e2e/transition-world.spec.ts
npm run test:e2e
```

Resultados:

- `npm run validate:transition-root-assets`: OK, 34 archivos runtime validados.
- `npm run lint`: OK.
- `npm run test`: OK, 5 archivos y 40 tests.
- `npm run build`: OK.
- `npm run audit:assets`: OK, sin URLs externas, CDN ni audio.
- `npm run test:e2e -- tests/e2e/transition-world.spec.ts`: OK, 2 tests.
- `npm run test:e2e`: OK, 30 tests.

## 10. Estado final del repo

Pendiente hasta commit y push final del ticket. El working tree debe quedar limpio después de publicar la rama.
