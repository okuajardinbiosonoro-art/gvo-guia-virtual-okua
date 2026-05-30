# Asset plan - Portada / Intro

Pantalla: `PORTADA / INTRO - EL ARCHIVO VIVO DE OKÚA`

Estado: `PREPRODUCCION_DESBLOQUEADA / NO_IMPLEMENTADA`

## Assets fuente

- Especificación local: `C:\Users\JOSE DAVID\Desktop\OKÚA\Aplicaciones\GVO_archivos_iniciales\GVO_PORTADA_ARCHIVO_VIVO_ESPECIFICACION_V1.txt`
- Referencia visual local: `C:\Users\JOSE DAVID\Desktop\OKÚA\Aplicaciones\GVO_archivos_iniciales\portada.png`
- Identidad de Lía: `docs/03_IDENTIDAD_LIA.md`
- Reglas no negociables: `docs/01_REGLAS_NO_NEGOCIABLES.md`

## Assets de referencia en repo

- `docs/source_specs/002_portada_intro_archivo_vivo_v1.txt`
- `assets/reference/screens/002_portada_intro_archivo_vivo_reference.png`

Estos archivos son referencia y especificación. No son runtime final.

## Estructura local recomendada

Ruta local sugerida:

`C:\Users\JOSE DAVID\Desktop\OKÚA\Aplicaciones\GVO_archivos_iniciales\portada_intro_v1\`

Estructura:

```text
portada_intro_v1\
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

No es obligatorio crear esta carpeta desde el repo. Si se crea localmente, no se deben commitear archivos externos salvo que estén dentro del repo y el ticket lo autorice.

## Assets runtime mínimos futuros

Rutas sugeridas dentro del repo para un ticket futuro, no para este ticket:

```text
public/assets/runtime/cover-intro/
├── manifest.json
├── background_archive_alive.png
├── lia_cover_idle.png
├── portal_01_root_enabled.png
├── portal_02_pulse_locked.png
├── portal_03_notebook_locked.png
├── portal_04_system_locked.png
├── portal_05_present_locked.png
├── lock_pixel.png
└── particles_soft.png
```

## Assets runtime opcionales futuros

- `portal_01_root_opening_*.png`
- `portal_locked_feedback.png`
- `lia_cover_greeting.png`
- `lia_cover_pointing.png`
- `dialog_tail.png`
- `archive_pedestal.png`

## Formato recomendado

- PNG con transparencia para Lía, portales, candados y elementos superpuestos.
- PNG 9:16 o capas amplias para fondo.
- Nombres en minúsculas, sin espacios, con guiones bajos.
- Sin texto incrustado en imágenes finales.
- UI, textos, botones y diálogos como DOM/CSS.
- Logo OKÚA controlado localmente, no generado como texto por IA.

## Qué genera ChatGPT Images

- Composición maestra sin textos.
- Lía portada aislada.
- Fondo/sala archivo vivo sin UI.
- Portales I-V como capas o referencias separadas.
- Candado/lock visual si conviene.
- Versión limpia menos saturada.

ChatGPT Images no debe generar textos finales ni logos definitivos.

## Qué limpia Photopea

- Separación de capas.
- Limpieza de bordes.
- Recorte transparente.
- Corrección de inconsistencias de Lía.
- Eliminación de texto incrustado accidental.
- Exportación a PNG runtime.
- Ajustes de contraste para mobile.

## Qué implementa Codex

- Montaje React cuando exista ticket funcional.
- DOM/CSS para textos, botones y diálogos.
- Estados de portales.
- Gating de primera pasada.
- Accesibilidad.
- Reduced motion.
- Tests unitarios/e2e.
- Validación de no recursos externos.

Codex no debe inventar arte ni crear rutas funcionales en este ticket.

## Nombres sugeridos de archivos aprobados

```text
lia_cover_idle.png
lia_cover_greeting.png
cover_archive_background.png
cover_archive_pedestal.png
portal_01_root_enabled.png
portal_02_pulse_locked.png
portal_03_notebook_locked.png
portal_04_system_locked.png
portal_05_present_locked.png
lock_pixel_soft.png
button_start_reference.png
dialog_panel_reference.png
```
