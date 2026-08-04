#!/usr/bin/env python3
"""Generate the documentary outputs and curated pack for GVO_FINAL_021G_R1."""

from __future__ import annotations

import csv
import hashlib
import json
import shutil
import zipfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[4]
OUT = Path(__file__).resolve().parent
STATUS = ROOT / "docs/status/GVO_FINAL_021G_R1_LIA_IDLE_METHOD_CORRECTION.md"
DOWNLOADS = Path(r"C:\Users\JOSE DAVID\Downloads")
I17 = DOWNLOADS / "I17"
PACK = DOWNLOADS / "GVO_FINAL_021G_R1_LIA_IDLE_REFERENCE_PACK"
PACK_ZIP = DOWNLOADS / "GVO_FINAL_021G_R1_LIA_IDLE_REFERENCE_PACK.zip"
BASELINE = "b3ce96a5e523a5bfa4c09fc51a402c9b10b05927"
STAMP = "PREPRODUCTION — NOT RUNTIME"

FONT_REGULAR = Path(r"C:\Windows\Fonts\segoeui.ttf")
FONT_BOLD = Path(r"C:\Windows\Fonts\segoeuib.ttf")
FONT_MONO = Path(r"C:\Windows\Fonts\consola.ttf")

BG = (13, 18, 25, 255)
PANEL = (25, 33, 44, 255)
INK = (241, 237, 222, 255)
MUTED = (164, 176, 188, 255)
AMBER = (232, 176, 75, 255)
OPAL = (143, 216, 208, 255)
RED = (234, 101, 91, 255)
GREEN = (104, 204, 140, 255)


I17_EXPECTED = [
    ("I17-PNG", "final_lia_idle_contemplative_6f_v01.png", 509870, "6636C67A147CCA18F6FCCC44845D7C4ACB290207DA535EFA8B51A9F9B5AD8D07", "PNG"),
    ("I17-WEBP", "final_lia_idle_contemplative_6f_v01.webp", 124022, "92AF06EE8C4F1F43AE7DA10FF8E2615DB1C3A336F7D28096B80655F94C14425F", "WEBP"),
]


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest().upper()


def font(size: int, bold: bool = False, mono: bool = False) -> ImageFont.FreeTypeFont:
    path = FONT_MONO if mono else FONT_BOLD if bold else FONT_REGULAR
    return ImageFont.truetype(str(path), size)


def wrap(draw: ImageDraw.ImageDraw, text: str, fnt: ImageFont.FreeTypeFont, width: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = word if not current else f"{current} {word}"
        if draw.textbbox((0, 0), candidate, font=fnt)[2] <= width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines or [""]


def draw_wrapped(draw: ImageDraw.ImageDraw, x: int, y: int, text: str, fnt: ImageFont.FreeTypeFont, fill: tuple[int, ...], width: int, spacing: int = 5) -> int:
    for line in wrap(draw, text, fnt, width):
        draw.text((x, y), line, font=fnt, fill=fill)
        y += fnt.size + spacing
    return y


def header(draw: ImageDraw.ImageDraw, title: str, subtitle: str, width: int, compact: bool = False) -> int:
    pad = 18 if compact else 34
    title_size = 22 if compact else 40
    sub_size = 12 if compact else 20
    draw.text((pad, pad), title, font=font(title_size, bold=True), fill=INK)
    draw.text((pad, pad + title_size + 8), subtitle, font=font(sub_size), fill=MUTED)
    sf = font(12 if compact else 17, bold=True)
    tw = draw.textbbox((0, 0), STAMP, font=sf)[2]
    draw.text((width - tw - pad, pad), STAMP, font=sf, fill=AMBER)
    return pad + title_size + sub_size + 30


def checker(size: tuple[int, int], cell: int = 16) -> Image.Image:
    im = Image.new("RGBA", size, (38, 45, 55, 255))
    draw = ImageDraw.Draw(im)
    for y in range(0, size[1], cell):
        for x in range(0, size[0], cell):
            if (x // cell + y // cell) % 2:
                draw.rectangle((x, y, min(size[0] - 1, x + cell - 1), min(size[1] - 1, y + cell - 1)), fill=(48, 56, 67, 255))
    return im


def alpha_center(alpha: Image.Image) -> tuple[float, float]:
    x_projection = [sum(alpha.crop((x, 0, x + 1, alpha.height)).getdata()) for x in range(alpha.width)]
    y_projection = [sum(alpha.crop((0, y, alpha.width, y + 1)).getdata()) for y in range(alpha.height)]
    total = sum(x_projection)
    return (
        sum(i * value for i, value in enumerate(x_projection)) / total,
        sum(i * value for i, value in enumerate(y_projection)) / total,
    )


def audit_i17() -> list[dict[str, object]]:
    rows: list[dict[str, object]] = []
    for file_id, name, expected_bytes, expected_sha, expected_format in I17_EXPECTED:
        path = I17 / name
        if not path.is_file():
            raise FileNotFoundError(path)
        with Image.open(path) as opened:
            if opened.size != (1536, 256) or opened.mode != "RGBA" or opened.format != expected_format:
                raise RuntimeError(f"I17 metadata drift: {name}, {opened.size}, {opened.mode}, {opened.format}")
            image = opened.convert("RGBA")
        if path.stat().st_size != expected_bytes or sha256(path) != expected_sha:
            raise RuntimeError(f"I17 hash/bytes drift: {name}")
        for index in range(6):
            cell = image.crop((index * 256, 0, (index + 1) * 256, 256))
            alpha = cell.getchannel("A")
            bbox = alpha.getbbox()
            if bbox is None:
                raise RuntimeError(f"Empty I17 frame: {name} F{index + 1}")
            x0, y0, x1, y1 = bbox
            center_x, center_y = alpha_center(alpha)
            margins = {"left": x0, "top": y0, "right": 256 - x1, "bottom": 256 - y1}
            rows.append({
                "file_id": file_id,
                "source_path": str(path),
                "filename": name,
                "bytes": expected_bytes,
                "sha256": expected_sha,
                "format": expected_format,
                "mode": "RGBA",
                "canvas": "1536x256",
                "frame": index + 1,
                "bbox": f"[{x0},{y0},{x1},{y1}]",
                "visible_width": x1 - x0,
                "visible_height": y1 - y0,
                "visible_height_percent": round((y1 - y0) / 256 * 100, 2),
                "center_x": round(center_x, 2),
                "center_y": round(center_y, 2),
                "baseline": y1 - 1,
                "margin_left": margins["left"],
                "margin_top": margins["top"],
                "margin_right": margins["right"],
                "margin_bottom": margins["bottom"],
                "edge_contacts": ",".join(key for key, value in margins.items() if value == 0),
                "safe16": "FAIL" if min(margins.values()) < 16 else "PASS",
                "cropped": "YES",
                "identity_consistency": "UNAPPROVABLE_DUE_TO_CROP_SCALE_AND_FRAME_REINTERPRETATION",
                "eyes_state": "OPEN_NO_CONTRACTUAL_BLINK",
                "f6_to_f1": "INCOMPATIBLE" if index in {0, 5} else "N/A",
                "classification": "REJECTED_PRODUCTION_CANDIDATE / NOT_RUNTIME / DO_NOT_REPAIR",
            })
    return rows


def rejection_sheet(audit: list[dict[str, object]], output: Path) -> None:
    im = Image.new("RGBA", (1800, 1250), BG)
    draw = ImageDraw.Draw(im)
    y0 = header(draw, "I17 — evidencia real de rechazo", "Strip directo 6×1: seis celdas recortadas, sin safe area y sin blink contractual", im.width)
    source = I17 / "final_lia_idle_contemplative_6f_v01.png"
    with Image.open(source) as opened:
        strip = opened.convert("RGBA")
    canvas = checker(strip.size, 12)
    canvas.alpha_composite(strip)
    im.alpha_composite(canvas, (132, y0 + 20))
    draw.rectangle((132, y0 + 20, 1667, y0 + 275), outline=RED, width=3)
    for index in range(7):
        x = 132 + index * 256
        draw.line((x, y0 + 20, x, y0 + 276), fill=RED, width=2)
    row = audit[:6]
    for index, metrics in enumerate(row):
        x = 40 + index * 290
        y = y0 + 335
        draw.rounded_rectangle((x, y, x + 270, y + 590), radius=14, fill=PANEL, outline=RED, width=2)
        cell = checker((238, 238), 12)
        original = strip.crop((index * 256, 0, (index + 1) * 256, 256)).resize((238, 238), Image.Resampling.NEAREST)
        cell.alpha_composite(original)
        im.alpha_composite(cell, (x + 16, y + 48))
        draw.rectangle((x + 16, y + 48, x + 253, y + 285), outline=RED, width=3)
        draw.text((x + 16, y + 14), f"F{index + 1} — REJECT", font=font(20, bold=True), fill=RED)
        facts = [
            f"bbox {metrics['bbox']}",
            f"margins L{metrics['margin_left']} T{metrics['margin_top']} R{metrics['margin_right']} B{metrics['margin_bottom']}",
            f"COM ({metrics['center_x']}, {metrics['center_y']})",
            f"baseline {metrics['baseline']}",
            f"contact: {metrics['edge_contacts']}",
            "safe16: FAIL",
            "eyes: OPEN / no blink",
        ]
        ty = y + 310
        for fact in facts:
            draw.text((x + 17, ty), fact, font=font(14, mono=True), fill=INK if "FAIL" not in fact else RED)
            ty += 33
    draw.rounded_rectangle((40, 1100, 1760, 1215), radius=14, fill=(33, 22, 22, 255), outline=RED, width=2)
    draw.text((70, 1125), "RESULT: REJECTED_PRODUCTION_CANDIDATE / NOT_RUNTIME / DO_NOT_REPAIR", font=font(23, bold=True), fill=RED)
    draw.text((70, 1165), "Root cause: extreme generative framing 6:1 inside a 3:2 artboard; not Photopea and not a microscopic defect.", font=font(18), fill=INK)
    im.convert("RGB").save(output, "PNG", optimize=True)


def master_guide(output: Path) -> None:
    im = checker((1024, 1024), 24)
    draw = ImageDraw.Draw(im)
    draw.rectangle((205, 164, 819, 860), outline=AMBER, width=5)
    draw.rectangle((236, 184, 788, 839), outline=OPAL, width=4)
    draw.rectangle((471, 471, 553, 553), outline=GREEN, width=3)
    draw.line((512, 80, 512, 944), fill=(170, 185, 195, 190), width=2)
    draw.line((80, 512, 944, 512), fill=(170, 185, 195, 190), width=2)
    draw.rounded_rectangle((28, 28, 996, 145), radius=14, fill=(10, 15, 22, 230), outline=AMBER, width=2)
    draw.text((52, 46), "FINAL-LIA-MASTER-001 — SAFE AREA 1024×1024", font=font(27, bold=True), fill=INK)
    draw.text((52, 86), "Visible: 58–64% H · 46–54% W · top/bottom ≥16% · sides ≥20%", font=font(19), fill=OPAL)
    draw.text((52, 116), "Optical center inside central 4% · complete body · no edge contact", font=font(18), fill=MUTED)
    draw.text((216, 878), "SAFE FRAME: x205–819 / y164–860", font=font(18, bold=True), fill=AMBER)
    draw.text((246, 905), "TARGET BBOX ENVELOPE: W 471–553 / H 594–655", font=font(17, bold=True), fill=OPAL)
    draw.text((34, 980), STAMP, font=font(14, bold=True), fill=AMBER)
    im.convert("RGB").save(output, "PNG", optimize=True)


def sheet_guide(output: Path) -> None:
    im = checker((1536, 1024), 24)
    draw = ImageDraw.Draw(im)
    states = [
        "F1 master neutral / eyes open", "F2 same body / y −2 px final", "F3 same body / y −4 / eyes half",
        "F4 same body / y −2 / eyes closed", "F5 same body / y +2 / reopening", "F6 same as F1 / eyes open",
    ]
    for index, state in enumerate(states):
        col, row = index % 3, index // 3
        x, y = col * 512, row * 512
        draw.rectangle((x, y, x + 511, y + 511), outline=RED, width=2)
        draw.rectangle((x + 32, y + 32, x + 479, y + 479), outline=AMBER, width=3)
        draw.rectangle((x + 118, y + 92, x + 394, y + 420), outline=OPAL, width=3)
        draw.line((x + 256, y + 32, x + 256, y + 479), fill=(150, 175, 185, 180), width=1)
        draw.text((x + 46, y + 48), state, font=font(18, bold=True), fill=INK)
        draw.text((x + 46, y + 448), "safe source ≥32px → final ≥16px", font=font(15, mono=True), fill=GREEN)
    draw.rounded_rectangle((24, 460, 1512, 548), radius=12, fill=(8, 13, 20, 230), outline=AMBER, width=2)
    draw.text((52, 473), "3×2 · ROW-MAJOR · SIX SQUARE CELLS · NO BAKED GUTTERS/LABELS", font=font(23, bold=True), fill=AMBER)
    draw.text((52, 512), "Documentary overlay only; guides and labels never appear in the production sheet.", font=font(16), fill=INK)
    draw.text((1180, 995), STAMP, font=font(13, bold=True), fill=AMBER)
    im.convert("RGB").save(output, "PNG", optimize=True)


def output_guide(output: Path) -> None:
    im = checker((1536, 256), 16)
    draw = ImageDraw.Draw(im)
    states = ["master/open", "y−2/open", "y−4/half", "y−2/closed", "y+2/reopen", "same F1/open"]
    for index, state in enumerate(states):
        x = index * 256
        draw.rectangle((x, 0, x + 255, 255), outline=RED, width=2)
        draw.rectangle((x + 16, 16, x + 239, 239), outline=AMBER, width=2)
        draw.rectangle((x + 59, 46, x + 197, 210), outline=OPAL, width=2)
        draw.line((x + 128, 16, x + 128, 239), fill=(145, 170, 182, 190), width=1)
        draw.line((x + 58, 219, x + 198, 219), fill=GREEN, width=2)
        draw.text((x + 22, 22), f"F{index + 1}", font=font(18, bold=True), fill=INK)
        draw.text((x + 22, 48), state, font=font(11), fill=MUTED)
        draw.text((x + 22, 224), "safe≥16", font=font(10, mono=True), fill=GREEN)
    draw.text((8, 241), f"ASSEMBLED, NEVER DIRECT-GENERATED · {STAMP}", font=font(10, bold=True), fill=AMBER)
    im.convert("RGB").save(output, "PNG", optimize=True)


def flow_sheet(output: Path) -> None:
    im = Image.new("RGBA", (1800, 900), BG)
    draw = ImageDraw.Draw(im)
    y0 = header(draw, "Método corregido del idle de Lía", "Cada transición conserva un gate explícito; el ensamblaje no equivale a aprobación runtime", im.width)
    stages = [
        ("1", "MASTER 1024²", "Una Lía completa\n58–64% H\nHUMAN APPROVAL", GREEN),
        ("2", "SHEET 3×2", "Master = reference #1\n6 edits minimal\nHUMAN REVIEW", OPAL),
        ("3", "ASSEMBLER", "row-major split\none resize\nnearest/lanczos", AMBER),
        ("4", "AUTO QA", "safe≥16\ncenter≤6\nbaseline≤4\nscale≤2%", GREEN),
        ("5", "HUMAN GATE", "preview loop\nidentity review\nNOT PROMOTED", RED),
    ]
    gap = 36
    width = (1720 - gap * 4) // 5
    y = y0 + 150
    for index, (number, title, body, color) in enumerate(stages):
        x = 40 + index * (width + gap)
        draw.rounded_rectangle((x, y, x + width, y + 420), radius=20, fill=PANEL, outline=color, width=3)
        draw.ellipse((x + 26, y + 26, x + 82, y + 82), fill=color)
        draw.text((x + 45, y + 35), number, font=font(20, bold=True), fill=BG)
        draw.text((x + 26, y + 112), title, font=font(23, bold=True), fill=INK)
        ty = y + 168
        for line in body.splitlines():
            draw.text((x + 26, ty), line, font=font(17), fill=MUTED)
            ty += 40
        if index < 4:
            ax = x + width + 5
            draw.line((ax, y + 210, ax + gap - 10, y + 210), fill=AMBER, width=5)
            draw.polygon([(ax + gap - 10, y + 198), (ax + gap - 10, y + 222), (ax + gap + 2, y + 210)], fill=AMBER)
    draw.rounded_rectangle((40, 750, 1760, 850), radius=14, fill=(35, 22, 22, 255), outline=RED, width=2)
    draw.text((68, 773), "DIRECT_GENERATIVE_6X1_STRIP = DEPRECATED_FOR_LIA", font=font(26, bold=True), fill=RED)
    draw.text((68, 815), "No final art, no integration, no current-used mutation in 021G_R1.", font=font(18), fill=INK)
    im.convert("RGB").save(output, "PNG", optimize=True)


def blink_sheet(output: Path) -> None:
    im = Image.new("RGBA", (1800, 1000), BG)
    draw = ImageDraw.Draw(im)
    y0 = header(draw, "Decisión híbrida de blink", "Comparación real: coherencia, alineación, QA, trabajo manual y riesgo anatómico", im.width)
    boxes = [(50, y0 + 70, 865, 760), (935, y0 + 70, 1750, 760)]
    data = [
        ("OPTION A — SHEET STATES", GREEN, [
            "F3 half / F4 closed / F5 reopening",
            "Master aprobada como reference #1",
            "No requiere registrar capas 941×1672",
            "QA directa sobre seis celdas completas",
            "Riesgo: la herramienta puede reinterpretar el cuerpo",
            "Mitigación: acting mínimo + rechazo por drift",
        ]),
        ("OPTION B — EYE OVERLAY", MUTED, [
            "Neutral / 50% / closed comparten 941×1672",
            "La futura master usa 1024×1024",
            "No existe transformación aprobada entre canvases",
            "Cubrir ojos neutrales exige head plate registrado",
            "Ajuste frame a frame sería trabajo manual no permitido",
            "Estado actual: alineación determinista no demostrada",
        ]),
    ]
    for box, (title, color, lines) in zip(boxes, data):
        draw.rounded_rectangle(box, radius=20, fill=PANEL, outline=color, width=3)
        draw.text((box[0] + 30, box[1] + 30), title, font=font(28, bold=True), fill=color)
        y = box[1] + 100
        for line in lines:
            draw.ellipse((box[0] + 34, y + 7, box[0] + 45, y + 18), fill=color)
            y = draw_wrapped(draw, box[0] + 62, y, line, font(19), INK, box[2] - box[0] - 100, 9) + 20
    draw.rounded_rectangle((50, 805, 1750, 950), radius=16, fill=(19, 35, 29, 255), outline=GREEN, width=3)
    draw.text((82, 830), "DECISION: OPTION_A_SELECTED_FOR_INITIAL_PRODUCTION", font=font(28, bold=True), fill=GREEN)
    draw.text((82, 875), "Reopen B only after the approved master proves one common clean registration for head + eyes; never frame-by-frame.", font=font(19), fill=INK)
    draw.text((82, 912), "This is a production-method decision, not human approval of an asset.", font=font(18), fill=AMBER)
    im.convert("RGB").save(output, "PNG", optimize=True)


MASTER_BRIEF = f"""# FINAL-LIA-MASTER-001 — Brief de producción

> {STAMP}. Fuente de producción; no es asset runtime.

## Contrato

- ID: `FINAL-LIA-MASTER-001`.
- Filename: `final_lia_idle_master_v01.png`.
- Canvas: `1024×1024`.
- Formato: PNG RGBA, transparencia real.
- Clasificación: `PRODUCTION_SOURCE / NOT_RUNTIME`.
- Función: autoridad visual y frame reduced-motion para todo el idle final.
- Consumidor inmediato: `FINAL-LIA-IDLE-SHEET-001`; ningún consumidor runtime.

## Referencias exactas

Prioridad obligatoria:

1. `docs/03_IDENTIDAD_LIA.md` — identidad textual.
2. `public/assets/gvo/current-used/cover-intro/lia/reference/lia_master_cover_reference_v1.png` — master Cover.
3. `public/assets/gvo/current-used/cover-intro/lia/poses/lia_pose_idle_v1.png` — reposo frontal.
4. `public/assets/gvo/current-used/world-3-root/lia/lia_world3_idle_v01.png` — pixel scale aprobado.
5. `public/assets/gvo/current-used/world-5-root/lia/lia_world5_attend_neutral_v01.webp` — acting contemplativo.
6. `final_021g_r1_lia_master_safearea_1024.png` — framing obligatorio.
7. Overlays portrait/landscape 021G — escala futura, no composición binaria.

No reutilizar ningún binario como asset de `/final`.

## Identidad invariable

Una sola entidad vegetal no humana: exactamente cinco pétalos, cabeza
opalescente, ojos neutrales en media luna, collar ámbar, bulbo segmentado
completo y silueta vegetal. Sin boca, nariz, cejas, brazos, manos, piernas,
pies, ropa, alas, accesorios, sexto pétalo, duplicación o flip.

## Framing 1024×1024

- Altura visible: `58–64 %` del canvas (`594–655 px`).
- Ancho visible: `46–54 %` (`471–553 px`).
- Margen superior mínimo: `16 %` (`164 px`).
- Margen inferior mínimo: `16 %` (`164 px`).
- Márgenes laterales mínimos: `20 %` (`205 px`).
- Centro óptico: dentro del `4 %` central (`x/y 471–553`).
- Ningún alpha visible toca borde.

## Contenido obligatorio

Lía completa, frontal, contemplativa, pixelart cálido coherente con el Mirador,
ojos abiertos neutrales, iluminación estable, alpha limpio y margen amplio.

## Hard fails

Crop de pétalo o bulbo; margen insuficiente; anatomía humana; conteo distinto de
cinco pétalos; cambio de collar/cuerpo; boca/nariz/cejas; fondo; texto; entorno
del Mirador horneado; blur; mixed pixel scale; overscale; flip; reconstrucción
manual; redimensión >10 %.

## Prompt positivo en inglés

```text
one single canonical Lia, exactly five petals, complete opalescent head, neutral crescent eyes, amber collar, complete segmented plant bulb, frontal contemplative pose, warm poetic pixel art coherent with the Mirador, true transparent background, full body visible, generous alpha margins, visible height fifty-eight to sixty-four percent of a square canvas, visible width forty-six to fifty-four percent, centered optical mass, identical calm lighting, no text, no environment
```

## Prompt negativo en inglés

```text
cropped top petal, cropped bulb, edge contact, extra or missing petals, arms, hands, legs, feet, mouth, nose, eyebrows, clothing, wings, accessories, multiple characters, horizontal flip, asymmetrical framing, oversized character, solid background, Mirador environment, particles, bloom veil, 3D, anime, vector, photorealism, blurry resampling, mixed pixel scales, text, labels, grid lines
```

## Producción y Photopea

Generar una sola master cuadrada. Photopea sólo puede limpiar alpha, hacer un
centrado leve, aplicar una única redimensión proporcional `≤10 %` y exportar.
No redibujar anatomía, reemplazar pétalos ni reconstruir el bulbo.

## Criterios y plantilla de retorno

Antes de aprobar: revisar fondo claro/oscuro, dimensiones, modo, alpha bbox,
ocupación, márgenes, centro óptico, identidad y pixel scale. Retornar:

```text
ID | filename | native canvas | final canvas | mode/alpha | visible bbox | visible W/H percent | margins | optical center | proportional resize | bytes | SHA-256 | human review status | NOT_RUNTIME
```

## Estado

`READY_FOR_HUMAN_ASSET_PRODUCTION / FIRST_AND_ONLY_NEXT_ASSET`.
"""


SHEET_BRIEF = f"""# FINAL-LIA-IDLE-SHEET-001 — Brief de producción

> {STAMP}. No iniciar hasta aprobación humana explícita de la master.

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
"""


ASSEMBLY_CONTRACT = f"""# FINAL-LIA-IDLE-001 — Contrato de ensamblaje

> {STAMP}. Ensamblaje técnico no-runtime; pasar QA automática no equivale a aprobación humana.

## Input

- `final_lia_idle_3x2_sheet_v01.png`, PNG RGBA aprobado.
- Layout 3×2 con celdas cuadradas y orden row-major F1–F6.
- Source fuera de runtime; la herramienta verifica SHA antes/después.

## Tool usage

```powershell
python tools/asset-production/lia/build_final_lia_idle.py `
  --sheet C:/ruta/final_lia_idle_3x2_sheet_v01.png `
  --output-dir C:/ruta/salida-no-runtime `
  --interpolation nearest
```

`lanczos` existe como opción explícita, pero `nearest` es la inicial para
preservar pixel scale. No se instalan dependencias.

## Transformación

1. Validar alpha y ratio 3×2.
2. Dividir seis celdas cuadradas row-major.
3. Redimensionar cada celda una sola vez a 256×256.
4. Validar bboxes, safe area, centro, baseline y escala.
5. Ensamblar F1–F6 en 1536×256.
6. Exportar outputs y metadata.

## Outputs

- `final_lia_idle_contemplative_6f_v01.webp`: WebP RGBA lossless 1536×256.
- `final_lia_idle_contemplative_6f_preview.png`: preview estático documental.
- `final_lia_idle_contemplative_6f_preview_animated.webp`: preview loop documental.
- `final_lia_idle_contemplative_6f_metrics.json`: métricas y hashes.

## Métricas

Por frame: alpha bbox, ancho/alto visible, porcentaje visible, centro alpha,
drift desde F1, baseline, baseline drift, scale delta, márgenes, contactos y
safe-area. Para el loop: alpha IoU y mean RGBA delta F6→F1.

## Failure rules

Fallar si frame count no es 6; falta alpha; celdas no son cuadradas; un frame
toca borde; cualquier margen final es <16 px; bbox sale de 46–54 % W o 58–64 %
H; center drift >6 px; baseline drift respecto a F1 >4 px; ancho/alto varía >2
%; source cambia; output existente sin `--force`; canvas final no es 1536×256.

## Blink y preview

Blink seleccionado: `OPTION_A_SHEET_STATES`. Secuencia F1 open, F2 open, F3
half, F4 closed, F5 reopening, F6 open. Preview default: 4000 ms total, loop
continuo, sólo documental.

## Metadata/hash y gate final

El JSON registra SHA-256 source antes/después, configuración, límites, métricas,
outputs y hashes. Resultado automático:
`PRODUCTION_OUTPUT_PENDING_HUMAN_REVIEW / NOT_RUNTIME`.

La promoción a runtime o `current-used` requiere ticket futuro explícito y
aprobación humana del asset; esta herramienta no la realiza.
"""


REFERENCE_FIELDS = ["reference_id", "source_path", "filename", "sha256", "bytes", "width", "height", "mode", "alpha", "approved_use", "assets_served", "do_not_copy", "pack_path"]


def image_metadata(path: Path) -> dict[str, object]:
    with Image.open(path) as opened:
        alpha = "YES" if "A" in opened.mode or "transparency" in opened.info else "NO"
        return {"width": opened.width, "height": opened.height, "mode": opened.mode, "alpha": alpha}


def pack_sources(outputs: dict[str, Path]) -> list[dict[str, object]]:
    definitions = [
        ("R01", "public/assets/gvo/current-used/cover-intro/lia/reference/lia_master_cover_reference_v1.png", "IDENTITY_AUTHORITY", "ALL", "No reutilizar como asset Final"),
        ("R02", "public/assets/gvo/current-used/cover-intro/lia/poses/lia_pose_idle_v1.png", "ACTING_REFERENCE", "ALL", "No copiar encuadre Cover"),
        ("R03", "public/assets/gvo/current-used/cover-intro/lia/rig/idle_v1/lia_rig_eyes_crescent_neutral_v1.png", "EYE_REFERENCE", "SHEET", "No overlay sin registro aprobado"),
        ("R04", "public/assets/gvo/current-used/cover-intro/lia/rig/idle_v1/lia_rig_eyes_crescent_blink_50_v1.png", "EYE_REFERENCE", "SHEET", "No overlay sin registro aprobado"),
        ("R05", "public/assets/gvo/current-used/cover-intro/lia/rig/idle_v1/lia_rig_eyes_crescent_closed_v1.png", "EYE_REFERENCE", "SHEET", "No overlay sin registro aprobado"),
        ("R06", "public/assets/gvo/current-used/world-3-root/lia/lia_world3_idle_v01.png", "PIXELART_REFERENCE", "ALL", "No reutilizar binario"),
        ("R07", "public/assets/gvo/current-used/transition-world/lia/lia_transition_root_idle_4f_v1.png", "TECHNICAL_SPRITE_REFERENCE", "SHEET", "No copiar frames"),
        ("R08", "public/assets/gvo/current-used/world-5-root/lia/lia_world5_attend_neutral_v01.webp", "ACTING_REFERENCE", "MASTER", "No copiar composición Mundo V"),
        ("R09", "docs/visual/final/021g-lia-production-briefs/final_021g_lia_identity_contact_sheet.png", "IDENTITY_AUTHORITY", "ALL", "Documento, no asset runtime"),
        ("R10", "docs/visual/final/021g-lia-production-briefs/final_021g_lia_hard_fails_contact_sheet.png", "HARD_FAIL_REFERENCE", "ALL", "Documento, no asset runtime"),
        ("R11", outputs["master"].relative_to(ROOT).as_posix(), "FRAMING_GUIDE", "MASTER", "No hornear guía"),
        ("R12", outputs["sheet"].relative_to(ROOT).as_posix(), "FRAMING_GUIDE", "SHEET", "No hornear guía"),
        ("R13", "docs/visual/final/021g-lia-production-briefs/final_021g_lia_portrait_scale_overlay.png", "SCALE_REFERENCE", "MASTER", "No copiar environment"),
        ("R14", "docs/visual/final/021g-lia-production-briefs/final_021g_lia_landscape_667x375_scale_overlay.png", "SCALE_REFERENCE", "MASTER", "No copiar environment"),
        ("R15", outputs["flow"].relative_to(ROOT).as_posix(), "METHOD_REFERENCE", "ALL", "Documento, no asset runtime"),
    ]
    rows = []
    for reference_id, source_path, approved_use, served, do_not_copy in definitions:
        path = ROOT / source_path
        if not path.is_file():
            raise FileNotFoundError(path)
        rows.append({"reference_id": reference_id, "source_path": source_path, "filename": path.name, "sha256": sha256(path), "bytes": path.stat().st_size, **image_metadata(path), "approved_use": approved_use, "assets_served": served, "do_not_copy": do_not_copy, "pack_path": ""})
    if len(rows) != 15:
        raise RuntimeError(len(rows))
    return rows


def save_csv(path: Path, rows: list[dict[str, object]], fields: list[str]) -> None:
    with path.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def safe_directory(path: Path) -> None:
    if path.exists():
        if not path.is_dir() or path.is_symlink():
            raise RuntimeError(f"Unsafe directory target: {path}")
        if any(child.is_symlink() for child in path.rglob("*")):
            raise RuntimeError(f"Symlink found under pack: {path}")
    else:
        path.mkdir(parents=True)


def build_pack(rows: list[dict[str, object]]) -> dict[str, object]:
    safe_directory(PACK)
    groups = {
        "COMMON": rows,
        "FINAL-LIA-MASTER-001": [row for row in rows if row["assets_served"] in {"ALL", "MASTER"}],
        "FINAL-LIA-IDLE-SHEET-001": [row for row in rows if row["assets_served"] in {"ALL", "SHEET"}],
    }
    allowed_root = set(groups) | {"README.md", "MANIFEST.csv", "PACK_SUMMARY.json"}
    extras = [path.name for path in PACK.iterdir() if path.name not in allowed_root]
    if extras:
        raise RuntimeError(f"Unexpected existing pack entries: {extras}")
    all_copies: list[dict[str, object]] = []
    for folder_name, selected in groups.items():
        folder = PACK / folder_name
        safe_directory(folder)
        expected = {"README.md", "MANIFEST.csv"}
        for index, row in enumerate(selected, 1):
            expected.add(f"{index:02d}__{row['reference_id']}__{row['filename']}")
        unknown = [path.name for path in folder.iterdir() if path.name not in expected]
        if unknown:
            raise RuntimeError(f"Unexpected entries in {folder}: {unknown}")
        copied_rows = []
        for index, row in enumerate(selected, 1):
            source = ROOT / str(row["source_path"])
            destination = folder / f"{index:02d}__{row['reference_id']}__{row['filename']}"
            shutil.copy2(source, destination)
            if sha256(destination) != row["sha256"]:
                raise RuntimeError(destination)
            copied = dict(row)
            copied["pack_path"] = destination.relative_to(PACK).as_posix()
            copied_rows.append(copied)
        save_csv(folder / "MANIFEST.csv", copied_rows, REFERENCE_FIELDS)
        (folder / "README.md").write_text(
            f"# {folder_name}\n\n`REFERENCE_ONLY / NOT_RUNTIME`\n\nFuentes curadas: {len(selected)}. Ver `MANIFEST.csv`. No reutilizar binarios como assets del Mirador, no producir fuera de los gates y no promover a `current-used`.\n",
            encoding="utf-8",
        )
        all_copies.extend(copied_rows)
    save_csv(PACK / "MANIFEST.csv", all_copies, REFERENCE_FIELDS)
    summary = {"ticket": "GVO_FINAL_021G_R1", "classification": "REFERENCE_ONLY / NOT_RUNTIME", "unique_sources": len(rows), "attachment_copies": len(all_copies), "folder_counts": {key: len(value) for key, value in groups.items()}, "copied_021g_reference_count": 0, "runtime_modified": False}
    (PACK / "PACK_SUMMARY.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (PACK / "README.md").write_text("# GVO_FINAL_021G_R1 — Lía idle reference pack\n\n`REFERENCE_ONLY / NOT_RUNTIME`\n\nPack curado para master-first y sheet 3×2. Contiene 15 fuentes únicas; no replica las 67 referencias de 021G.\n", encoding="utf-8")
    if PACK_ZIP.exists() and (not PACK_ZIP.is_file() or PACK_ZIP.is_symlink()):
        raise RuntimeError(f"Unsafe ZIP target: {PACK_ZIP}")
    with zipfile.ZipFile(PACK_ZIP, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for path in sorted((p for p in PACK.rglob("*") if p.is_file()), key=lambda p: p.relative_to(PACK).as_posix()):
            info = zipfile.ZipInfo(f"{PACK.name}/{path.relative_to(PACK).as_posix()}", date_time=(2026, 8, 4, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o100644 << 16
            archive.writestr(info, path.read_bytes(), compress_type=zipfile.ZIP_DEFLATED, compresslevel=9)
    with zipfile.ZipFile(PACK_ZIP) as archive:
        if archive.testzip() is not None:
            raise RuntimeError("ZIP integrity failure")
    return {**summary, "folder": str(PACK), "manifest": str(PACK / "MANIFEST.csv"), "manifest_sha256": sha256(PACK / "MANIFEST.csv"), "zip": str(PACK_ZIP), "zip_sha256": sha256(PACK_ZIP), "zip_bytes": PACK_ZIP.stat().st_size}


def status_markdown(audit: list[dict[str, object]], outputs: dict[str, Path], pack: dict[str, object]) -> str:
    png_rows = audit[:6]
    table = [
        "| Frame | Alpha bbox | Margins L/T/R/B | COM | Baseline | Contacts | Safe16 |",
        "|---|---|---|---|---:|---|---|",
    ]
    for row in png_rows:
        table.append(
            f"| F{row['frame']} | `{row['bbox']}` | {row['margin_left']}/{row['margin_top']}/{row['margin_right']}/{row['margin_bottom']} | ({row['center_x']}, {row['center_y']}) | {row['baseline']} | `{row['edge_contacts']}` | `{row['safe16']}` |"
        )
    visuals = [f"- `{path.name}` — {image_metadata(path)['width']}×{image_metadata(path)['height']} — `{sha256(path)}`" for path in outputs.values()]
    return f"""# GVO_FINAL_021G_R1 — Corrección del método de producción del idle de Lía

## Estado

`GVO_FINAL_021G_R1_LIA_IDLE_METHOD_CORRECTION_COMPLETE`

Corrección documental y herramienta no-runtime completa. 021G permanece
trazable e intacto; R1 sustituye únicamente el método de producción del idle.

## Baseline

- Branch: `main`.
- HEAD previo: `{BASELINE}`.
- `origin/main` local: `{BASELINE}`.
- `refs/heads/main` remoto: `{BASELINE}`.
- Divergencia inicial: `0/0`.
- Worktree inicial: limpio.
- `fetch`: no ejecutado.

## Auditoría I17

- PNG: 509870 bytes — `6636C67A147CCA18F6FCCC44845D7C4ACB290207DA535EFA8B51A9F9B5AD8D07`.
- WebP: 124022 bytes — `92AF06EE8C4F1F43AE7DA10FF8E2615DB1C3A336F7D28096B80655F94C14425F`.
- Ambos: `1536×256`, RGBA; alpha geometry idéntica.
- Las seis celdas tienen altura visible 256 px, tocan top/bottom y fallan safe area de 16 px.
- F1/F2/F6 tocan los cuatro bordes; F3 toca left/top/bottom; F4 top/bottom; F5 top/right/bottom.
- COM horizontal: 79.42, 72.93, 92.64, 131.86, 179.69, 187.25 px; drift incompatible con el límite de 6 px.
- Blink: no existe la secuencia contractual; los seis estados permanecen abiertos.
- F6→F1: incompatible por posición, crop y encuadre.

{chr(10).join(table)}

Resultado común: `REJECTED_PRODUCTION_CANDIDATE / NOT_RUNTIME / DO_NOT_REPAIR`.

## Causa raíz y método corregido

La causa es el framing: se pidió un strip extremo 6:1 dentro de un artboard 3:2,
la herramienta ocupó toda la altura y reinterpretó cada figura. Photopea no es
la causa y no debe reparar I17.

`DIRECT_GENERATIVE_6X1_STRIP = DEPRECATED_FOR_LIA`.

Flujo vigente:

```text
FINAL-LIA-MASTER-001 1024×1024 HUMAN-APPROVED
→ FINAL-LIA-IDLE-SHEET-001 3×2
→ deterministic assembler
→ automatic QA
→ human review
```

El filename final, canvas 1536×256, grid 6×1 y celdas 256×256 no cambian.

## Decisión de blink

`OPTION_A_SELECTED_FOR_INITIAL_PRODUCTION`.

Las capas neutral/50 %/closed comparten canvas 941×1672, pero no existe registro
aprobado contra la futura master 1024×1024. Imponer overlay requeriría inventar
una transformación o reconstruir cabeza/ojos. Opción B sólo se reabre si una
master aprobada demuestra un registro común determinista y visualmente limpio.

## Ensamblador

- Path: `tools/asset-production/lia/build_final_lia_idle.py`.
- Input: sheet PNG RGBA 3×2 con celdas cuadradas.
- Outputs: WebP final lossless, preview PNG, preview WebP animado y JSON de métricas.
- Interpolación: `nearest` o `lanczos`; una sola redimensión por celda.
- Gates: safe ≥16 px, center drift ≤6 px, baseline drift ≤4 px, scale delta ≤2 %, bbox 46–54 % W / 58–64 % H.
- Source: SHA-256 antes/después; no se modifica.
- Self-test: fixture geométrica válida PASS; fixture insegura REJECT; output 1536×256 PASS; cuatro outputs PASS; artifacts retenidos NO.

## Briefs y gates

- `FINAL-LIA-MASTER-001_BRIEF.md`: `READY_FOR_HUMAN_ASSET_PRODUCTION / FIRST_AND_ONLY_NEXT_ASSET`.
- `FINAL-LIA-IDLE-SHEET-001_BRIEF.md`: bloqueado por aprobación humana de master.
- `FINAL-LIA-IDLE-001_ASSEMBLY_CONTRACT.md`: ensamblaje posterior a sheet aprobada.
- Greeting y glow permanecen bloqueados.

## Guías visuales

{chr(10).join(visuals)}

Todas están marcadas `{STAMP}`. La rejection sheet anota el I17 real sin editarlo
ni crear imágenes de error nuevas.

## Reference pack

- Fuentes únicas: `{pack['unique_sources']}`.
- Copias trazadas: `{pack['attachment_copies']}`.
- Pack 021G copiado en bloque: `NO` (`0/67`).
- Manifest: `{pack['manifest']}` — `{pack['manifest_sha256']}`.
- ZIP: `{pack['zip']}` — `{pack['zip_sha256']}` — {pack['zip_bytes']} bytes.
- Clasificación: `REFERENCE_ONLY / NOT_RUNTIME`.

## Estado global

No existe `CURRENT_STATE.md` ni `ROADMAP.md` bajo la convención vigente del
checkout, por lo que R1 no fabrica uno. El idle sigue no aprobado y queda
registrado en este status trazable.

## Límites respetados

- `src/**`, `tests/**`, `public/assets/**`, `current-used`, mundos y transiciones: no modificados.
- I17 y demás assets de Descargas: no modificados.
- Arte final de Lía: no generado.
- Integración/runtime: no ejecutados.
- Build, tests runtime, Playwright y navegador: no ejecutados por contrato.
"""


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    audit = audit_i17()
    outputs = {
        "rejection": OUT / "final_021g_r1_i17_rejection_contact_sheet.png",
        "master": OUT / "final_021g_r1_lia_master_safearea_1024.png",
        "sheet": OUT / "final_021g_r1_lia_idle_3x2_sheet_guide.png",
        "output": OUT / "final_021g_r1_lia_6x1_output_guide.png",
        "flow": OUT / "final_021g_r1_master_to_sheet_to_strip_flow.png",
        "blink": OUT / "final_021g_r1_blink_method_decision_sheet.png",
    }
    rejection_sheet(audit, outputs["rejection"])
    master_guide(outputs["master"])
    sheet_guide(outputs["sheet"])
    output_guide(outputs["output"])
    flow_sheet(outputs["flow"])
    blink_sheet(outputs["blink"])
    (OUT / "FINAL-LIA-MASTER-001_BRIEF.md").write_text(MASTER_BRIEF, encoding="utf-8")
    (OUT / "FINAL-LIA-IDLE-SHEET-001_BRIEF.md").write_text(SHEET_BRIEF, encoding="utf-8")
    (OUT / "FINAL-LIA-IDLE-001_ASSEMBLY_CONTRACT.md").write_text(ASSEMBLY_CONTRACT, encoding="utf-8")
    audit_fields = ["file_id", "source_path", "filename", "bytes", "sha256", "format", "mode", "canvas", "frame", "bbox", "visible_width", "visible_height", "visible_height_percent", "center_x", "center_y", "baseline", "margin_left", "margin_top", "margin_right", "margin_bottom", "edge_contacts", "safe16", "cropped", "identity_consistency", "eyes_state", "f6_to_f1", "classification"]
    save_csv(OUT / "final_021g_r1_i17_audit.csv", audit, audit_fields)
    sources = pack_sources(outputs)
    pack = build_pack(sources)
    summary = {
        "ticket": "GVO_FINAL_021G_R1",
        "baseline": BASELINE,
        "runtime": "READ_ONLY",
        "art_generated": False,
        "i17": {"files": 2, "frames_per_file": 6, "cropped_frames_per_file": 6, "safe16_pass_frames": 0, "classification": "REJECTED_PRODUCTION_CANDIDATE / NOT_RUNTIME / DO_NOT_REPAIR"},
        "method": {"deprecated": "DIRECT_GENERATIVE_6X1_STRIP", "master": "FINAL-LIA-MASTER-001", "sheet": "FINAL-LIA-IDLE-SHEET-001", "assembler": "tools/asset-production/lia/build_final_lia_idle.py", "blink": "OPTION_A_SELECTED_FOR_INITIAL_PRODUCTION"},
        "visual_outputs": {path.name: {"sha256": sha256(path), **image_metadata(path)} for path in outputs.values()},
        "reference_pack": pack,
        "next": "Produce only FINAL-LIA-MASTER-001.",
    }
    (OUT / "final_021g_r1_family_summary.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    STATUS.parent.mkdir(parents=True, exist_ok=True)
    STATUS.write_text(status_markdown(audit, outputs, pack), encoding="utf-8")
    print(json.dumps({"status": "GVO_FINAL_021G_R1_LIA_IDLE_METHOD_CORRECTION_COMPLETE", "i17_rows": len(audit), "cropped_frames_per_file": 6, "visuals": len(outputs), "pack": pack, "status_sha256": sha256(STATUS)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
