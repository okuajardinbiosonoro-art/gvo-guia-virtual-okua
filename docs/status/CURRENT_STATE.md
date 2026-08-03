# Estado actual del proyecto

Actualizado: 2026-08-03

## Estado canónico

- Estación III / Mundo III — Cuaderno Pixel de Pruebas: `CERRADA_APROBADA_FINAL` (`HUMAN_APPROVED`).
- Estación IV / Mundo IV — Mesa de sistema: `CERRADA_APROBADA_FINAL` (`HUMAN_APPROVED`) por el cierre `GVO_ST4_018E`.
- Ruta runtime de Estación IV: `/estacion/4`, servida por `World4RootScreen`.
- Cadena aprobada: `Planta → Bionosificador → ESP32 → MIDI → Wi‑Fi/UDP → Router → Sistema central → Sonido`.
- Contrato completo de Estación IV: [GVO_ST4_018E_STATION4_CLOSEOUT.md](GVO_ST4_018E_STATION4_CLOSEOUT.md).
- Contrato completo de Estación III: [GVO_STATION3_COMPLETE.md](GVO_STATION3_COMPLETE.md).
- Contrato previo de Mundo II: [WORLD_II_FINAL.md](../worlds/WORLD_II_FINAL.md).

## Estado global verificable

| Tramo         | Estado vigente                                                                                                                                                                                                |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Carga inicial | `APROBADA_PARA_AVANZAR / 7.2_DE_10`, con deuda visual documentada.                                                                                                                                            |
| Portada       | `APROBADA_PARA_AVANZAR / 7.8_DE_10`, no cerrada final.                                                                                                                                                        |
| Mundo I       | Runtime activo, interacción refinada y deuda visual documentada.                                                                                                                                              |
| Mundo II      | Finalizado para el alcance actual.                                                                                                                                                                            |
| Transiciones  | `TRANSITION_COPY_AUDIT_COMPLETE`: seis rutas y doce piezas finales `FINAL / human_approved`; pasivas y automáticas.                                                                                           |
| Mundo III     | `CERRADA_APROBADA_FINAL / HUMAN_APPROVED`.                                                                                                                                                                    |
| Mundo IV      | `CERRADA_APROBADA_FINAL / HUMAN_APPROVED`.                                                                                                                                                                    |
| Mundo V       | `ST5_020H_HUMAN_APPROVED`; `ESTACIÓN V CERRADA PARA EL ALCANCE ACTUAL`, con 4/4, CTA, persistencia global, guardas y salida validados.                                                                         |
| W5→Final      | Copy final `Abriendo el Mirador / Preparando el cierre del recorrido.`; ruta protegida, pasiva y automática.                                                                                                  |
| Final         | Runtime temporal y no cerrado. Los seis Environment aprobados permanecen en Descargas como `NOT_RUNTIME`; 021E deja briefs de accesos I–V/placa listos, sin producirlos ni implementar.                 |

Los documentos históricos conservan el estado real de su fecha. En particular,
los flags parciales de `018C_R1` y `018D` no se reescriben: `018E` incorpora la
aprobación humana vinculante y cierra Estación IV sin alterar esos registros.

## Contrato de Estación IV

La composición usa un artboard único `1536×1024`, texto arriba y mesa abajo.
Los anchors, escalas, bboxes alfa y capas se resuelven en coordenadas de
artboard, sin offsets por viewport.

Capas aprobadas:

```text
z0  environment
z1  rear depth plane
z2  haze
z3  contact shadow
z4  lower base
z5  front edge — preservado, excluido del render por revisión humana
z6  tabletop
z7  passive route
z8  halo
z9  pedestal
z10 object
z11 Lía
z12 DOM/UI
```

La decisión z5 queda registrada como `front-edge-disabled-by-human-review`;
z1 permanece retenido. Los 20 assets runtime y sus 20 espejos `current-used`
son byte-idénticos. El master genérico rechazado no existe como archivo, import
ni entrada de precache.

## Interacción, movimiento y acceso

- Progreso secuencial 1→8 con estados locked, available, active y completed.
- Revisión libre después del cierre, sin duplicar progreso.
- Ruta pasiva PNG con overlay SVG activo de siete segmentos.
- Un FX semántico por nodo, Lía mediante poses existentes `greeting` y
  `explain_calm`, tarjeta DOM, ayuda tap y ambiente técnico contenido.
- Chain complete, CTA y salida hacia la transición existente W4→W5.
- Pointer, toque, Enter y Space; controles nativos, foco visible, hit targets
  de al menos 44×44 y estados no dependientes sólo del color.
- `prefers-reduced-motion` conserva comprensión y secuencia sin travel, drift
  ni loops decorativos.
- Portrait está soportado; mobile landscape es recomendado. `OrientationHint`
  es no bloqueante y fullscreen sólo se inicia mediante gesto explícito.

## PWA, red y sonido

El build mantiene manifest y service worker. La PWA instalada no pudo
certificarse en la plataforma de QA y no se declara validada. En despliegue
LAN, la instalación PWA real requiere un origen seguro. La experiencia no
añade audio y no depende de CDN, URL externa ni servicio remoto runtime.

## QA y aprobación

El cierre de Estación IV integra la evidencia de los microfrentes 018A→018D y
la aprobación humana vinculante de 018E. La suite final, build/PWA, auditoría
de assets, hashes, áreas congeladas y smoke global se registran en el reporte
externo del cierre. Los resultados históricos 018D incluyen 42/42 tests focales,
242/242 globales, 15 contact sheets y un WebM real.

## Estado de Estación V

El mapa, Plantas, Sistema, Espacio, Visitante y el estado interno 4/4 están
humanamente aprobados por `ST5_020G_HUMAN_APPROVED`. El progreso local
`gvo.station5.v1` acepta el prefijo exacto
`['plantas','sistema','espacio','visitante']`; tras 4/4 permite revisita libre
de las cuatro áreas.

`ST5-020H`, aprobado humanamente, muestra `Ir al cierre` solo en el overview
4/4. La activación verifica
la escritura de Estación V en `gvo.progress.v1` antes de entrar a la transición
W5→Final; un fallo conserva el 4/4 y permite reintentar. La transición y Final
están protegidas antes del cierre global. La evidencia técnica vigente está en
[GVO_ST5_020H_CIERRE_ESTACION_V_Y_SALIDA_W5_FINAL_PARA_REVISION.md](GVO_ST5_020H_CIERRE_ESTACION_V_Y_SALIDA_W5_FINAL_PARA_REVISION.md).
El cierre editorial global está en
[GVO_ST5_020I_CIERRE_EDITORIAL_GLOBAL_TRANSICIONES.md](GVO_ST5_020I_CIERRE_EDITORIAL_GLOBAL_TRANSICIONES.md).
Final continúa temporal y no cerrado en runtime. Su preproducción, Art Bible,
cámaras y dirección visual están humanamente aprobadas por
[GVO_FINAL_021C_APROBACION_HUMANA_ART_BIBLE_CAMARA_Y_DIRECCION_VISUAL.md](GVO_FINAL_021C_APROBACION_HUMANA_ART_BIBLE_CAMARA_Y_DIRECCION_VISUAL.md),
con Gates 1–4 cerrados. 021E auditó los seis Environment aprobados en Descargas
como `APPROVED_PRODUCTION_REFERENCE / NOT_RUNTIME` y publicó seis briefs,
cinco overlays y el reference pack de accesos I–V/placa;
`FINAL-ACCESS-I-001` es el primer brief
`READY_FOR_HUMAN_ASSET_PRODUCTION`. No se produjo ningún acceso ni placa final
y no se implementó runtime. El registro está en
[GVO_FINAL_021E_ACCESS_AND_LABEL_ASSET_PRODUCTION_BRIEFS.md](GVO_FINAL_021E_ACCESS_AND_LABEL_ASSET_PRODUCTION_BRIEFS.md).
La siguiente acción controlada es producir sólo ACCESS-I con ticket posterior y
revisarlo antes de ACCESS-II. Los registros 020A–020H permanecen históricos y
no se reescriben.
