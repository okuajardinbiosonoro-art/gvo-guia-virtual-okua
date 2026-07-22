# Política de assets utilizados runtime

## Estado

`ACTIVA / OBLIGATORIA / VIGENTE_TRAS_CIERRE_ESTACION_IV`

## Propósito

Esta política evita que los assets usados por pantallas reales queden dispersos
únicamente en carpetas runtime, bibliotecas parciales o documentos de referencia.
El repositorio mantiene el registro canónico:

```text
public/assets/gvo/current-used/
```

Esa carpeta no reemplaza las rutas runtime ni obliga a cambiar imports. Funciona
como espejo organizado por pantalla para revisión, continuidad visual, handoff e
inventario verificable.

## Regla obligatoria para Codex

Antes de cualquier ticket relacionado con assets, pantallas, integración visual,
producción manual, inventario visual o continuidad de mundos, Codex debe revisar:

```text
docs/process/POLITICA_ASSETS_UTILIZADOS_RUNTIME.md
public/assets/gvo/current-used/README.md
docs/assets/ASSET_INVENTORY.md
```

Si se integra o se declara usado un asset runtime, Codex debe asegurar que exista
copia o registro equivalente en:

```text
public/assets/gvo/current-used/<pantalla>/
```

Esto aplica aunque el ticket no lo diga explícitamente.

Cuando existe una copia física en runtime y otra en `current-used`, ambas deben
ser byte-idénticas. El inventario de la pantalla debe registrar, como mínimo:

- Ruta relativa común del par.
- Formato y dimensiones.
- SHA-256.
- Función visual y consumidor runtime.
- Estado de aprobación.

## Diferencia con Atlas visual

El Atlas visual ubicado en:

```text
docs/narrative/atlas_visual_assets_gvo_v1/
```

es referencia documental, mockup, evidencia visual o guía de producción. No
sustituye a `public/assets/gvo/current-used/`.

Un asset puede estar en Atlas como referencia y aun así debe registrarse en
`current-used` cuando pasa a ser usado por runtime o por una pantalla aprobada.
La presencia en Atlas, por sí sola, nunca autoriza su promoción.

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
public/assets/gvo/current-used/shared/
public/assets/gvo/current-used/global/
```

Mantener nombres estables y carpetas internas descriptivas (`environment`,
`index`, `lia`, `notebook`, `plant`, `prototype`, `records`, `signal`,
`background`, `progress`, `nodes`, `roots`, `overlays`, `manifests`, etc.).

La existencia de un directorio no demuestra aprobación funcional. En particular,
`world-4-root/` contiene desde 018C los espejos integrados de la composición
estática. R1 conserva los 20 hashes, retiene z1 y preserva z5 aunque la excluye
del render tras la comprobación visual por capas. El cierre 018E registra
Estación IV como `HUMAN_APPROVED`: esa aprobación procede de la autorización
humana expresa, no de la presencia del directorio. La experiencia cerrada no
usa audio, ofrece reduced motion completo y conserva como limitación documentada
que la PWA instalada no fue certificada en la plataforma de QA.

## Registro aprobado de Estación III

Estación III usa 15 assets locales bajo:

```text
public/assets/gvo/stations/world-3/notebook-pixel/runtime/
```

Sus 15 espejos aprobados y byte-idénticos viven en:

```text
public/assets/gvo/current-used/world-3-root/
```

El detalle de rutas, formato, dimensiones, SHA-256, función, consumidor y estado
está en:

```text
public/assets/gvo/current-used/world-3-root/README.md
docs/assets/ASSET_INVENTORY.md
```

## Reglas de seguridad

- No mover ni borrar originales sin ticket explícito.
- No reexportar, comprimir, optimizar ni convertir formatos sin ticket explícito.
- No inventar assets.
- No tratar mockups del Atlas como assets runtime.
- No modificar imports runtime solo por actualizar este espejo.
- No declarar aprobada una pantalla por la sola presencia de su carpeta.
- Si el asset viene de Descargas, primero debe existir ticket de integración con
  nombre exacto esperado.

## Checklist para próximos tickets

1. Identificar pantalla o bloque runtime y su estado real.
2. Revisar si el asset está en la ruta runtime consumida.
3. Confirmar el consumidor en código y su responsabilidad semántica.
4. Revisar si existe copia o registro en
   `public/assets/gvo/current-used/<pantalla>/`.
5. Si falta, copiarlo byte-idéntico o registrar el bloqueo.
6. Verificar ruta relativa, formato, dimensiones y SHA-256 del par.
7. Actualizar el inventario y el README de la pantalla con función, consumidor y
   estado.
8. Mantener la organización por pantalla.
9. Confirmar en la entrega que `current-used` quedó actualizado.
10. Confirmar que el Atlas solo fue usado como referencia documental.
