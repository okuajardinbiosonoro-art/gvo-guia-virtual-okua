# Photopea cleanup next steps

## Después de generar candidatos

1. Guardar candidatos en carpeta local de trabajo, no en runtime.
2. Abrir cada candidato en Photopea.
3. Revisar contra `ASSET_ACCEPTANCE_CHECKLIST_ROOT.md`.
4. Descartar de inmediato cualquier imagen con texto, letras falsas o rasgos humanos.
5. Limpiar bordes y transparencia.
6. Normalizar canvas.
7. Separar capas si aplica.
8. Exportar PNG transparente.
9. Exportar PSD editable.

## Lía

- Canvas final recomendado: 96x96 o 128x128 por frame.
- Alinear por visor/collar.
- Mantener exactamente cinco pétalos.
- Exportar spritesheets horizontales para idle/guide si se aprueban.

## Portal

- Canvas recomendado: 192x288 o 224x336.
- Separar base, glow, open y símbolo.
- Exportar SVG si conserva crisp/pixelart.
- Exportar PNG transparente si la textura orgánica funciona mejor en raster.

## Nombres esperados

- `lia_transition_root_master.png`
- `lia_transition_root_idle_4f.png`
- `lia_transition_root_guide_2f.png`
- `lia_transition_root_exit_1f.png`
- `portal_root_base.svg`
- `portal_root_glow.svg`
- `portal_root_open.svg`
- `symbol_root.svg`

## Entrega a Codex

Codex solo debe integrar después de aprobación explícita y ticket funcional. No entregar archivos sueltos sin contact sheet.
