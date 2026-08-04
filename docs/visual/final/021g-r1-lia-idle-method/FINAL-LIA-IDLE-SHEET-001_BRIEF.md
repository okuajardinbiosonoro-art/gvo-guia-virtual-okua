# FINAL-LIA-IDLE-SHEET-001 — Brief de producción

> PREPRODUCTION — NOT RUNTIME. No iniciar hasta aprobación humana explícita de la master.

## Contrato

- ID: `FINAL-LIA-IDLE-SHEET-001`.
- Filename: `final_lia_idle_3x2_sheet_v01.png`.
- Formato: PNG RGBA.
- Layout: `3×2`, seis celdas cuadradas naturales, row-major.
- Clasificación: `PRODUCTION_SOURCE / NOT_RUNTIME`.
- Reference #1 obligatoria: `FINAL-LIA-MASTER-001` aprobada.

## Estados

| Celda | Estado |
|---|---|
| F1 | master neutral, ojos abiertos |
| F2 | mismo cuerpo, traslación vertical `−2 px` final |
| F3 | mismo cuerpo, `−4 px`, ojos medio cerrados |
| F4 | mismo cuerpo, `−2 px`, ojos cerrados |
| F5 | mismo cuerpo, `+2 px`, ojos reabriendo |
| F6 | misma pose que F1, ojos abiertos |

La flotación adicional puede completarse con `transform` futuro; no obliga a
redibujar el cuerpo.

## Reglas de coherencia

- Master aprobada adjunta como primera referencia.
- Una sola composición 3:2, no seis conversaciones.
- Cuerpo completo y exactamente cinco pétalos en cada celda.
- Misma escala, luz, color, anatomía, collar y pixel scale.
- Safe area equivalente a `≥16 px` después del resize a 256×256.
- Sin drift horizontal; center drift final `≤6 px`.
- Baseline drift respecto a F1 `≤4 px`.
- Diferencia de ancho/alto visible respecto a F1 `≤2 %`.
- Sin líneas, números, labels o gutters horneados.
- F6 compatible visualmente con F1.

## Decisión de blink

`OPTION_A_SELECTED_FOR_INITIAL_PRODUCTION`.

Los ojos neutral/50 %/closed existentes comparten canvas `941×1672`, pero no
hay registro aprobado contra la futura master `1024×1024`. No se inventa una
transformación ni se hace ajuste manual por frame. La Opción B sólo se reabre
con registro común demostrado para cabeza y ojos.

## Prompt positivo en inglés

```text
use the approved FINAL-LIA-MASTER-001 as the mandatory first reference, one continuous three-by-two animation sheet containing six minimal states of the exact same canonical Lia, row one frames one two three and row two frames four five six, exactly five petals in every cell, identical opalescent head, identical amber collar, identical segmented plant bulb, identical scale lighting colors anatomy and pixel scale, complete body and generous transparent margins in every square cell, only tiny vertical translations and a subtle three-state crescent-eye blink, frame six visually matching frame one, true transparent background, no baked guides
```

## Prompt negativo en inglés

```text
independent character redesigns, crop, edge contact, extra or missing petals, changing anatomy, changing scale, changing lighting, changing colors, changing collar, arms, hands, legs, feet, mouth, nose, eyebrows, bounce, squash, stretch, gelatinous motion, horizontal drift, horizontal flip, solid background, labels, numbers, cell lines, gutters, text, Mirador environment, particles, bloom veil, blurry resampling, mixed pixel scales
```

## Photopea mínimo

Superponer `final_021g_r1_lia_idle_3x2_sheet_guide.png`; verificar seis celdas
cuadradas naturales; limpiar alpha y alinear el sheet completo. No reconstruir
frames, no redibujar anatomía, no corregir cada cuerpo de forma independiente.
Detener si una corrección exige redimensión >10 % o trabajo manual anatómico.

## QA y plantilla de retorno

Retornar dimensiones nativas, celda nativa, modo/alpha, bboxes, márgenes,
centros, baselines, scale delta, estado de ojos, similitud F6→F1, bytes y hash:

```text
ID | filename | native canvas | cell | mode/alpha | F1..F6 bbox/margins/center/baseline | scale deltas | blink states | F6→F1 | bytes | SHA-256 | human review status | NOT_RUNTIME
```

## Estado

`BLOCKED_BY_FINAL_LIA_MASTER_001_HUMAN_APPROVAL`.
