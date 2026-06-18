# 015B - Rebuild inmersivo Estacion II / Mundo II

## Estado

`IMPLEMENTADO_LOCAL / VALIDADO / SIN_PUSH / PR_NO_APLICA`

## Problema visual corregido

La version 015A de `/estacion/2` quedo funcional, pero visualmente seguia percibiendose como una pantalla de placeholder dentro de la plantilla global beige.

En 015B se rehizo la composicion runtime de Estacion II como una escena mobile-only inmersiva:

- se elimino el uso de `MobileShell` en Mundo II;
- ya no aparece la card/base panel global;
- ya no aparece el badge `Sin audio · Sin Internet · Mobile-first`;
- el titulo vive dentro del mundo;
- la escena ocupa el viewport completo en mobile;
- planta, senal, Lia, ruta, microescenas, dialogo y navegacion tienen jerarquia visual curada.

## Archivos modificados

```text
src/screens/World2Root/World2RootScreen.tsx
src/screens/World2Root/World2RootScreen.css
src/screens/World2Root/World2RootScreen.test.tsx
docs/status/015B_WORLD2_IMMERSIVE_REBUILD.md
```

## Assets

No se generaron assets nuevos.

No se copiaron assets desde Descargas.

No se copiaron assets innecesarios.

La implementacion usa los assets ya integrados en 015A:

```text
public/assets/gvo/stations/world-2/pulse-invisible/runtime/
public/assets/gvo/current-used/world-2-root/
```

Se conserva la regla `current-used`: no hubo assets runtime nuevos que registrar.

No se usaron las poses generadas/rechazadas de Lia para W2.

Lia se mantiene desde el set 2.5D existente del repo:

```text
public/assets/gvo/shared/lia/current-used/portada-intro/
```

## Composicion implementada

- Stage full-screen mobile con proporcion base `1080 / 2340`.
- Fondo oscuro inmersivo.
- Titulo interno: `ESTACION II`, `MUNDO II`, `Lia y el pulso invisible`.
- Planta principal a la izquierda / centro-izquierda.
- Senal visible como dato, no como musica.
- Lia 2.5D protagonista a la derecha.
- Microescenas curadas solo en capas que las necesitan.
- Dialogo breve integrado con assets de panel.
- Navegacion inferior de seis capas dentro del stage, sin corte en mobile.
- Botones visibles limpios: `Siguiente` y `Continuar`.

## Flujo funcional preservado

- Primera pasada secuencial 1 -> 2 -> 3 -> 4 -> 5 -> 6.
- Capas posteriores bloqueadas al inicio.
- Tocar capa bloqueada muestra mensaje suave.
- Las capas completadas quedan disponibles para revision.
- Solo una capa queda activa a la vez.
- `Continuar` aparece despues de completar la capa 6.
- La salida usa la ruta existente hacia la transicion W2 -> W3.

## Textos visibles

No se muestra `TEMP` en UI visible.

Los slots editoriales pueden seguir teniendo estado interno `TEMP`, pero la experiencia usa textos limpios para el usuario.

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
npm run build
Resultado: FALLA POR DEUDA PREEXISTENTE FUERA DEL ALCANCE 015B
Detalle: TypeScript falla en src/content/editorial/resolveEditorialText.ts por acceso de locale en entradas editoriales sin variante en.
Decision: no se corrige en 015B para no modificar arquitectura editorial fuera del ticket.
```

## Validacion browser 390x844

```text
Resultado: PASA
Ruta: /estacion/2
Stage: 390 x 844, ocupa el viewport completo
MobileShell: no presente
Base panel/card: no presente
Badge global: no presente
TEMP visible: no
Imagenes: 22
Imagenes rotas: 0
Imagenes remotas: 0
Audio: 0
Video: 0
Canvas: 0
Overflow horizontal: no
Overflow vertical: no
Navegacion inferior: 6 capas visibles, bottom 826 dentro de viewport 844
Planta: visible
Lia 2.5D repo existente: visible
```

## Validacion browser 430x932

```text
Resultado: PASA
Ruta: /estacion/2
Stage: 430 x 932, ocupa el viewport completo
MobileShell: no presente
Base panel/card: no presente
Badge global: no presente
TEMP visible: no
Imagenes: 22
Imagenes rotas: 0
Imagenes remotas: 0
Audio: 0
Video: 0
Canvas: 0
Overflow horizontal: no
Overflow vertical: no
Navegacion inferior: 6 capas visibles, bottom 912 dentro de viewport 932
Planta: visible
Lia 2.5D repo existente: visible
```

## Validacion de flujo en browser

```text
Resultado: PASA
Bloqueo suave: pasa
Mensaje bloqueado: Vamos paso a paso. Primero necesitamos entender la capa anterior.
Secuencia: planta_viva -> senal -> captura -> acondicionamiento -> mapeo -> resultado_mediado -> ready_to_continue
Microescenas: aparecen solo en captura, mapeo y resultado_mediado
Waveform: aparece desde senal
CTA final: aparece al completar capa 6
Salida: el flujo existente resuelve hasta /estacion/3 despues de activar Continuar
```

## Reduced motion

La hoja CSS mantiene reglas para `prefers-reduced-motion: reduce`:

- elimina animaciones continuas;
- conserva cambios de opacidad discretos;
- mantiene la comprension por estado, borde e highlight fijo.

## Confirmaciones

- No se genero ningun asset visual.
- No se usaron assets remotos.
- No se uso CDN.
- No se uso audio.
- No se uso video.
- No se activo QR/camara.
- No se importo Excel.
- No se ejecuto `npm audit`.
- No se ejecuto `pre-commit`.
- No se ejecuto `gitleaks`.
- No se ejecuto baseline completo.
- No se modifico `package.json`.
- No se modificaron lockfiles.
- No se hizo push.
- No se creo Pull Request.
- `PR_NO_APLICA`.
