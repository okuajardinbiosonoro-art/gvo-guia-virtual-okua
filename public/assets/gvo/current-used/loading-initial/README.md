# Carga inicial — marca editorial 2026-10-23

## Registro vigente OBS03 — v03, revisión en escena pendiente

Estado: `ART_TECHNICAL_CANDIDATE_SCENE_QA_PENDING_HUMAN_PENDING`.
El consumidor usa `lia/lia_loading_16f_okua_v03.png` (2560×2560,
2.050.024 bytes) y `plant/plant_growth_4f_okua_v03.png` (3072×768,
370.976 bytes), con los correspondientes metadatos `_okua_v03.json`.
[`OBS03-brand-v03.json`](OBS03-brand-v03.json) registra los tres originales
de material, la máscara auténtica única 58×71, hashes y registro por fotograma.

El material limpio de maceta/regadera procede del piloto ChatGPT Images
conservado fuera de `public`; se adapta a la iluminación local del cuerpo.
La forma de OKÚA procede sólo de la máscara auténtica. No se usa la placa
blanca v01. Los cuatro soportes de maceta y los doce de regadera tienen
registro propio; la máscara de regadera excluye su borde superior izquierdo.
La comparación completa después de codificar comprueba alpha original
idéntica, cero píxeles RGBA cambiados fuera de las máscaras finales y las
primeras cuatro celdas de Lía idénticas. Agua, cinco pétalos, movimiento,
grillas y tiempos quedan fuera de las modificaciones locales.

Reproducción: `node tools/assets/derive_obs03_brand_assets.mjs`.
`--inspect` produce sólo contactos documentales, sin escribir runtime.
Los originales y la derivación histórica permanecen conservados. La inspección
ampliada de los 16 soportes no sustituye la comprobación en escena ni la
revisión/aprobación del responsable humano único.

## Historial v01 preservado — fuera del consumidor actual

Estado: `LOCAL_REVIEW_CANDIDATE / PENDING_HUMAN_REVIEW`.

`loadingInitialAssets.ts` consume las hojas derivadas
`lia/lia_loading_16f_okua_v01.png` (2560×2560, 16 celdas) y
`plant/plant_growth_4f_okua_v01.png` (3072×768, 4 celdas). Sus pares runtime están
bajo `public/assets/runtime/loading-initial/` con las mismas rutas relativas.

El símbolo procede exclusivamente del PNG auténtico conservado en
`assets-source/editorial-2026-10-23/logo-candidate-from-brand-archive.png`,
recorte `(6,4,58,71)`, con escalado proporcional. Placas pequeñas sustituyen los
emblemas florales anteriores de maceta y regadera. No hay regadera en las primeras
cuatro celdas de Lía; estas permanecen intactas. Se preservan los cinco pétalos,
las grillas, los tiempos, el registro y todos los píxeles fuera de las placas.

`integration-brand-2026-10-23.json` registra hashes, dimensiones, 16 rectángulos
y verificación de identidad runtime/mirror. La reproducción se ejecuta mediante
`node tools/assets/derive_entry_brand_assets.mjs`; los PNG originales no se
sobrescriben. Agua, halo y brillos conservan sus archivos existentes.
