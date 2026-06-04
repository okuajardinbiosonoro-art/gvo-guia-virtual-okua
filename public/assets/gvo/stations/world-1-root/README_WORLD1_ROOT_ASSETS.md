# GVO - Assets Mundo I: Raiz

## Estado

`004D-10A_ASSETS_INGESTED_PRE_RUNTIME / SIN_IMPLEMENTACION_RUNTIME`

Estos assets fueron copiados desde la fuente local del usuario para preparar una implementacion futura de `/estacion/1`. La ingesta preserva bytes, registra hashes y no integra runtime.

## Reglas

- Estos assets estan aprobados/ingestados para Mundo I, pero todavia no estan integrados en runtime.
- Los textos, labels, dialogos y botones deben ir por DOM/CSS con la tipografia oficial del proyecto.
- No redisenar, reexportar, comprimir, optimizar ni limpiar estos assets sin ticket especifico.
- Los assets de Lia tienen copia adicional en la biblioteca central: `public/assets/gvo/shared/lia/future/mundo-i-raiz/`.
- El fondo base es el unico asset que puede no tener alpha.
- Cualquier advertencia de alpha esta registrada en `manifests/world1_root_asset_manifest_v1.json`.
- La implementacion futura debe usar el manifest y no inventar rutas.

## Estructura

```txt
public/assets/gvo/stations/world-1-root/
  background/
  light/
  plant/
  roots/
  nodes/
  exit-path/
  lia/
  manifests/
```

## Manifest

- `public/assets/gvo/stations/world-1-root/manifests/world1_root_asset_manifest_v1.json`

## Resumen

- Assets fuente esperados: 20.
- Assets copiados a carpeta de Mundo I: 20.
- Assets de Lia copiados a biblioteca central: 11.
- Hashes verificados: 31.
- Mismatches: 0.
