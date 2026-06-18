# 015A - Base runtime Estacion II / Mundo II

## Estado

`IMPLEMENTADO_LOCAL / VALIDADO_PARCIAL / PENDIENTE_REVISION_USUARIO / SIN_PUSH`

## Objetivo

Integrar una primera base runtime mobile-only para Estacion II - Mundo II: Lia y el pulso invisible.

La estacion comunica que la senal existe antes de ser musica y que el resultado final es mediado por captura, acondicionamiento, mapeo e interpretacion.

## Estado Git inicial

```text
## main...origin/main [ahead 1]
94b86a9 assets: add current-used runtime asset registry
ed62302 docs: inventory existing assets for World II references 014BREF
0247c18 fix: correct loading preload and asset methodology 014A1
```

## Assets copiados al runtime

Destino:

```text
public/assets/gvo/stations/world-2/pulse-invisible/runtime/
```

Se copiaron 36 assets usados por la composicion base, organizados por familias:

- `background/`
- `atmosphere/`
- `plant/`
- `signal/`
- `route/`
- `dialogue/`
- `navigation/`
- `micro-scenes/`
- `lia-fx/`

## Assets copiados al registro current-used

Destino:

```text
public/assets/gvo/current-used/world-2-root/
```

La copia en `current-used` cumple la politica obligatoria de assets utilizados runtime.

## Assets disponibles pero no usados

No se integraron en esta primera base:

- `world2_bioelectric_particle_field_v01.png`
- `world2_intro_invisible_pulse_reveal_v01.png`
- `world2_lia_idle_pose_world2_v01.png`
- `world2_lia_explain_pose_world2_v01.png`
- `world2_lia_invite_pose_world2_v01.png`
- `world2_background_base_mobile_v01.png`

Motivo: evitar sobrecarga visual, mantener version mobile optimizada, usar la version WebP del fondo y reutilizar Lia 2.5D existente desde el repo.

## Ruta de Estacion II

```text
/estacion/2
src/screens/World2Root/World2RootScreen.tsx
```

## Estados funcionales implementados

- `planta_viva`
- `senal`
- `captura`
- `acondicionamiento`
- `mapeo`
- `resultado_mediado`
- `ready_to_continue`

## Comportamiento

- La experiencia inicia en capa 1 activa.
- Las capas posteriores aparecen bloqueadas.
- Tocar una capa bloqueada muestra mensaje suave de Lia.
- Confirmar la capa activa desbloquea la siguiente.
- Las capas completadas quedan disponibles para revision.
- `Continuar` se habilita al completar la capa 6.
- `Continuar` navega a `/transition/world-2-to-world-3`.

## Validaciones ejecutadas

```text
npm run test -- World2Root
Resultado: PASA
Evidencia: 1 archivo de prueba, 3 pruebas pasadas.
```

```text
npm run lint
Resultado: PASA
```

```text
git diff --check
Resultado: PASA
Observacion: solo avisos normales de conversion LF -> CRLF en Windows.
```

```text
Verificacion SHA256 Downloads -> runtime -> current-used
Resultado: PASA
RuntimeFiles=36
CurrentUsedFiles=36
HashErrors=0
```

```text
Validacion browser 390x844 en /estacion/2
Resultado: PASA
Evidencia: 38 imagenes locales, 0 imagenes rotas, 0 imagenes remotas, critical assets ready, sin audio, sin video, sin canvas, sin overflow horizontal, capa 1 activa, capas posteriores bloqueadas, mensaje suave visible al tocar capa bloqueada.
```

```text
Validacion browser 430x932 en /estacion/2
Resultado: PASA
Evidencia: 38 imagenes locales, 0 imagenes rotas, 0 imagenes remotas, critical assets ready, sin audio, sin video, sin canvas, sin overflow horizontal.
```

```text
Validacion de flujo de capas
Resultado: PASA
Evidencia: avance secuencial planta_viva -> senal -> captura -> acondicionamiento -> mapeo -> resultado_mediado -> ready_to_continue; revision libre de capas completadas; CTA final disponible.
```

```text
Validacion de salida
Resultado: PASA CON OBSERVACION
Evidencia: el CTA se implementa contra /transition/world-2-to-world-3; en runtime local la cadena existente resuelve hasta /estacion/3.
```

```text
npm run build
Resultado: FALLA POR DEUDA PREEXISTENTE FUERA DEL ALCANCE 015A
Detalle: TypeScript falla en src/content/editorial/resolveEditorialText.ts por acceso de locale en entradas editoriales sin variante en.
Decision: no se corrige en 015A para no modificar arquitectura editorial fuera del ticket.
```

## Confirmaciones

- No se genero ningun asset visual.
- No se usaron assets remotos.
- No se uso CDN.
- No se uso audio.
- No se uso video.
- No se activo QR/camara.
- No se importo Excel.
- No se modifico `package.json`.
- No se modificaron lockfiles.
- No se creo Pull Request.
- `PR_NO_APLICA`.
