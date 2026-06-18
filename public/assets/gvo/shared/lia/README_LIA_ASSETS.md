# Biblioteca central de assets de Lia

Estado: `004D-8A_LIBRARY_CREATED / COPY_ONLY / NO_RUNTIME_CHANGES`

Esta carpeta reune copias de assets existentes de Lia usados o documentados en GVO. No reemplaza automaticamente los assets originales y no cambia imports runtime.

Para el registro global de todos los assets runtime usados por pantalla, revisar:

```txt
public/assets/gvo/current-used/
docs/process/POLITICA_ASSETS_UTILIZADOS_RUNTIME.md
```

`shared/lia/current-used/` es solo la biblioteca especializada de Lia. No debe usarse como carpeta general para fondos, nodos, portales, raices ni assets de otras pantallas.

## Reglas

1. Los originales no deben moverse ni borrarse sin ticket especifico.
2. Los futuros assets de Lia deben registrarse en `asset_manifest_lia_v1.json`.
3. Los labels, textos, dialogos y botones no pertenecen a estos assets; deben vivir como DOM/CSS.
4. Lia no debe redisenarse sin aprobacion visual explicita del usuario.
5. Esta biblioteca es una referencia compartida para revision, comparacion y reutilizacion controlada.

## Estructura

```txt
current-used/carga-inicial/
current-used/portada-intro/
current-used/transition-world/
current-used/unknown/
approved/
candidates/
future/mundo-i-raiz/
```

## Convencion futura

- Candidato visual: guardar en `candidates/` y registrar en manifest.
- Candidato aprobado: mover o copiar mediante ticket a `approved/` y registrar estado.
- Limpieza/exportacion: asegurar alfa real, nombre estable y hash documentado.
- Uso por pantalla: registrar ruta runtime especifica y referencia en `docs/gvo/lia/LIA_USAGE_MAP_004D8A.md`.
- Uso global por pantalla: asegurar tambien copia o registro en `public/assets/gvo/current-used/<pantalla>/` cuando Lia se use en runtime.
- Mundo I: Raiz: usar `future/mundo-i-raiz/` solo cuando exista ticket de assets aprobado. Por ahora queda vacia salvo `.gitkeep`.

## Estado 004D-8A

- Assets visuales candidatos encontrados por busqueda: 56.
- Assets current-used copiados: 31.
- Copias verificadas por SHA256: si.
- Runtime modificado: no.
- Nuevos assets generados: no; solo copias byte-identicas.
