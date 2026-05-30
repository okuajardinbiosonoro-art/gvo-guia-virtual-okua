# TICKET 002A - Portada Intro handoff, preproducción y metodología

Fecha: 2026-05-17

## Objetivo

Dejar el repositorio alineado con el estado real del proyecto y preparar la preproducción completa de la pantalla `PORTADA / INTRO - EL ARCHIVO VIVO DE OKÚA`, sin implementar UI runtime ni modificar la carga inicial funcional.

## Base verificada

- Rama base: `main`
- Commit base confirmado: `87e048b feat: register initial loading frames timeline`
- Tag confirmado: `checkpoint/carga-inicial-v13-7p2`
- Carga inicial: `APROBADA_PARA_AVANZAR / 7.2_DE_10 / DEUDA_VISUAL_DOCUMENTADA`
- Carga inicial no está `CERRADA_APROBADA_FINAL`

## Rama

- Rama de trabajo: `feature/002A-portada-intro-handoff-preproduccion`

## Insumos locales usados

- `C:\Users\JOSE DAVID\Desktop\OKÚA\Aplicaciones\GVO_archivos_iniciales\GVO_PORTADA_ARCHIVO_VIVO_ESPECIFICACION_V1.txt`
- `C:\Users\JOSE DAVID\Desktop\OKÚA\Aplicaciones\GVO_archivos_iniciales\portada.png`

## Insumos copiados al repo

- `docs/source_specs/002_portada_intro_archivo_vivo_v1.txt`
- `assets/reference/screens/002_portada_intro_archivo_vivo_reference.png`

La referencia `portada.png` se copió sin optimizar, recortar ni convertir. Es referencia visual, no asset runtime final.

## Documentación creada o actualizada

- `docs/process/METODOLOGIA_AVANCE_POR_UMBRAL_VISUAL.md`
- `docs/status/HANDOFF_001_CARGA_INICIAL_V13_BASE_AVANCE.md`
- `docs/screens/002_PORTADA_INTRO_PREPRODUCCION.md`
- `docs/visual/cover-intro/ASSET_PLAN.md`
- `docs/visual/cover-intro/PROMPT_PACK_CHATGPT_IMAGES_PORTADA_INTRO.md`
- `docs/visual/cover-intro/CHECKLIST_VISUAL_PORTADA_INTRO.md`
- `docs/status/PROMPT_NUEVO_CHAT_002_PORTADA_INTRO_GVO.md`
- `README.md`
- `AGENTS.md`
- `docs/status/ESTADO_ACTUAL_PROYECTO.md`
- `tools/audit_assets.mjs`

## Estado de carga inicial

`APROBADA_PARA_AVANZAR / 7.2_DE_10 / DEUDA_VISUAL_DOCUMENTADA`

La carga inicial no queda `CERRADA_APROBADA_FINAL`.

## Estado de portada

`PREPRODUCCION_DESBLOQUEADA / NO_IMPLEMENTADA`

## Estructura local documentada

```text
C:\Users\JOSE DAVID\Desktop\OKÚA\Aplicaciones\GVO_archivos_iniciales\portada_intro_v1\
├── 00_especificacion\
├── 01_referencias_chatgpt\
├── 02_aprobadas\
│   ├── reference\
│   ├── lia\
│   ├── portals\
│   ├── locks\
│   ├── background\
│   ├── button\
│   └── dialog\
├── 03_editables_photopea\
├── 04_runtime_export\
├── 05_descartadas\
└── 06_notas_revision\
```

## Límites definidos

- Usuario: aprobación visual explícita y selección de referencias.
- ChatGPT Images: generación de composición y capas visuales sin textos incrustados.
- Photopea: limpieza, separación, recorte, transparencia y exportación.
- Codex: documentación, prompts, plan de assets y, en ticket futuro, implementación React accesible.

## Ajuste de auditoría

`tools/audit_assets.mjs` se ajustó para no leer binarios de imagen/fuentes como UTF-8. La referencia `portada.png` conserva metadata C2PA/provenance con URLs de certificación dentro del binario; no es una carga runtime. El auditor sigue revisando código, texto y SVG para detectar URLs externas, CDN y audio.

## Fuera de alcance confirmado

- No se implementó portada.
- No se crearon rutas React.
- No se modificó la carga inicial funcional.
- No se tocaron assets runtime.
- No se implementaron estaciones.
- No se implementó transición entre mundos.
- No se agregó audio.
- No se agregó video runtime.
- No se usaron recursos externos.
- No se usó CDN.
- No se abrió Pull Request.
- No se marcó `CERRADA_APROBADA_FINAL`.

## Validaciones

Ejecutadas al cierre del ticket:

- `npm run lint`: OK.
- `npm run test`: OK, 3 archivos y 16 tests.
- `npm run build`: OK.
- `npm run audit:assets`: OK.
