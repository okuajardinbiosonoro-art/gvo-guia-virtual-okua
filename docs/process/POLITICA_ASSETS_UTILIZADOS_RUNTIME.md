# Política de assets utilizados runtime

## Estado

`ACTIVA / OBLIGATORIA / PREVIA_A_ESTACION_II`

## Propósito

Esta política evita que los assets usados por pantallas reales queden dispersos únicamente en carpetas runtime, bibliotecas parciales o documentos de referencia.

El repositorio debe mantener una carpeta canónica de assets utilizados:

```text
public/assets/gvo/current-used/
```

Esa carpeta no reemplaza las rutas runtime actuales ni obliga a cambiar imports. Funciona como espejo organizado por pantalla para revisión, continuidad visual, handoff y preparación de nuevos assets.

## Regla obligatoria para Codex

Antes de cualquier ticket relacionado con assets, pantallas, integración visual, producción manual, inventario visual o continuidad de mundos, Codex debe revisar:

```text
docs/process/POLITICA_ASSETS_UTILIZADOS_RUNTIME.md
public/assets/gvo/current-used/README.md
```

Si se integra o se declara usado un asset runtime, Codex debe asegurar que exista copia o registro equivalente en:

```text
public/assets/gvo/current-used/<pantalla>/
```

Esto aplica aunque el ticket no lo diga explícitamente.

## Diferencia con Atlas visual

El Atlas visual ubicado en:

```text
docs/narrative/atlas_visual_assets_gvo_v1/
```

es referencia documental, mockup, evidencia visual o guía de producción.

No sustituye a `public/assets/gvo/current-used/`.

Un asset puede estar en Atlas como referencia y aun así debe registrarse en `current-used` cuando pasa a ser asset usado por runtime o pantalla.

## Organización obligatoria

Usar subcarpetas por pantalla o bloque runtime:

```text
public/assets/gvo/current-used/loading-initial/
public/assets/gvo/current-used/cover-intro/
public/assets/gvo/current-used/transition-world/
public/assets/gvo/current-used/world-1-root/
public/assets/gvo/current-used/world-2-root/
public/assets/gvo/current-used/world-3-root/
public/assets/gvo/current-used/world-4-root/
public/assets/gvo/current-used/world-5-root/
public/assets/gvo/current-used/final-root/
public/assets/gvo/current-used/global/
```

Mantener nombres estables y carpetas internas descriptivas (`background`, `lia`, `progress`, `nodes`, `roots`, `overlays`, `manifests`, etc.).

## Estado inicial corregido antes de Estación II

Antes de continuar con Estación II se creó el registro global y se agregaron los assets usados que faltaban:

- `loading-initial`: assets runtime de pre-portada.
- `cover-intro`: assets runtime de portada.
- `transition-world`: assets runtime de transición.
- `world-1-root`: assets usados por Estación I / Mundo Raíz.
- `global`: assets globales runtime.

## Reglas de seguridad

- No mover ni borrar originales sin ticket explícito.
- No reexportar, comprimir, optimizar ni convertir formatos sin ticket explícito.
- No inventar assets.
- No tratar mockups del Atlas como assets runtime.
- No modificar imports runtime solo por actualizar este espejo.
- Si el asset viene de Descargas, primero debe existir ticket de integración con nombre exacto esperado.

## Checklist para próximos tickets

1. Identificar pantalla o bloque runtime.
2. Revisar si el asset está en ruta runtime.
3. Revisar si existe copia/registro en `public/assets/gvo/current-used/<pantalla>/`.
4. Si falta, copiarlo byte-identico o registrar el bloqueo.
5. Mantener la organización por pantalla.
6. Confirmar en la entrega que `current-used` quedó actualizado.
7. Confirmar que el Atlas solo fue usado como referencia documental.
