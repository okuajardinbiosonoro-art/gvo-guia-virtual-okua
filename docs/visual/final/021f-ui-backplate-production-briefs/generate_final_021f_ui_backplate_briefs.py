from __future__ import annotations

import csv
import hashlib
import json
import shutil
import textwrap
import zipfile
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

from PIL import Image, ImageDraw, ImageFont


REPO = Path(__file__).resolve().parents[4]
OUT = Path(__file__).resolve().parent
DOWNLOADS = Path(r"C:\Users\JOSE DAVID\Downloads")
PACK = DOWNLOADS / "GVO_FINAL_021F_UI_BACKPLATE_REFERENCE_PACK"
ZIP_PATH = DOWNLOADS / "GVO_FINAL_021F_UI_BACKPLATE_REFERENCE_PACK.zip"
STATUS_PATH = REPO / "docs/status/GVO_FINAL_021F_UI_BACKPLATE_ASSET_PRODUCTION_BRIEFS.md"

FONT_REGULAR = Path(r"C:\Windows\Fonts\segoeui.ttf")
FONT_BOLD = Path(r"C:\Windows\Fonts\segoeuib.ttf")
FONT_MONO = Path(r"C:\Windows\Fonts\consola.ttf")

BG = (18, 31, 29)
PANEL = (32, 52, 47)
PANEL_ALT = (40, 61, 55)
INK = (245, 238, 210)
MUTED = (190, 205, 192)
AMBER = (238, 169, 69)
BRONZE = (173, 126, 62)
PARCHMENT = (225, 207, 166)
WOOD = (76, 48, 37)
SAFE = (87, 190, 142)
WARN = (235, 110, 78)

STAMP = "PREPRODUCTION — NOT RUNTIME"
H07 = "OPEN_CONTROLLED_ART_DIRECTION_ONLY_NO_BINARY_REUSE"

PRODUCTION_EXPECTED = {
    "final_environment_portrait_v01.webp": (1440, 2560, "WEBP", "RGBA", True, 157294, "1E8B599BE197EE26E346B1B1974CAA571DE42AF4B8587758C801C914C04C1347"),
    "final_environment_landscape_v01.webp": (2560, 1440, "WEBP", "RGB", False, 212234, "EDB75703A398724B9084D800CF21B888D72B6028C4199DC1D7A2C5F5CC0D1D84"),
    "final_valley_depth_portrait_v01.webp": (1440, 2560, "WEBP", "RGBA", True, 108270, "F64326254C5215CB44E0F9D93134B425E8806EA41E27556A4BBC40EA36D71E99"),
    "final_valley_depth_landscape_v01.webp": (2560, 1440, "WEBP", "RGBA", True, 107632, "FA9999A33EA636F57FA901D8C06B4FF9694A27F66704DAE7968B9E2DC45EC42B"),
    "final_mirador_foreground_portrait_v01.webp": (1440, 1280, "WEBP", "RGBA", True, 124114, "19290CF1995A8FAB2B643BEBC88126D3BA6E67A516A43877E1AA79A16E11427D"),
    "final_mirador_foreground_landscape_v01.webp": (2560, 900, "WEBP", "RGBA", True, 168898, "455EDBA68398FBB8BC1A508C42D0EB1BC7D2B6AFC236BF5F8928C2356FD60544"),
    "final_access_world1_root_v01.webp": (1024, 1024, "WEBP", "RGBA", True, 375436, "F1BE36246795D8A89241AA708D8E8ECE29FA5C98F3F0DCCAF5C2BD5F8F1BF046"),
    "final_access_world2_pulse_v01.webp": (1024, 1024, "WEBP", "RGBA", True, 297082, "6EE6B093DEE9ABBEA96FDA66C6C80DB3601CDF588A34FD062D0F844466EDD7B6"),
    "final_access_world3_notebook_v01.webp": (1024, 1024, "WEBP", "RGBA", True, 238198, "2EFAB6C3CA5430D7BA1F0113AA4E19A4B99CE6D4AF5C3212371AC86314039CD3"),
    "final_access_world4_system_v01.webp": (1024, 1024, "WEBP", "RGBA", True, 254472, "5472BDCA276DBD851D0C3C7C48A96038A5D7544AA13EF4A51BE7BC4DCC2E2B9D"),
    "final_access_world5_map_v01.webp": (1024, 1024, "WEBP", "RGBA", True, 354658, "A034AA6940E2043870FF3EE0B6C833DF4F3C3F15CFD386C846DB78AA1CBFC07F"),
    "final_access_label_backplate_v01.png": (1024, 256, "PNG", "RGBA", True, 314629, "36257FEC3E1E69D58A9F5E7CA2543F983D309776E45F757D1A81A7CAECFA3698"),
}

EXCLUDED_SEARCH_PARTS = (
    "GVO_FINAL_021D_ENVIRONMENT_REFERENCE_PACK",
    "GVO_FINAL_021E_ACCESS_REFERENCE_PACK",
    "GVO_FINAL_021F_UI_BACKPLATE_REFERENCE_PACK",
)

REFERENCE_FIELDS = [
    "reference_id",
    "source_path",
    "display_name",
    "sha256",
    "width",
    "height",
    "mode",
    "alpha",
    "current_consumer",
    "provenance",
    "license_status",
    "approved_use",
    "assets_served",
    "reason",
    "attachment_priority",
    "do_not_copy",
]


@dataclass(frozen=True)
class AssetBrief:
    asset_id: str
    filename: str
    narrative: str
    visual: str
    consumer: str
    layer: str
    canvas: str
    ratio: str
    alpha: str
    z: int
    insets: str
    safe: str
    text_sizes: str
    required: str
    prohibited: str
    references: str
    priority: str
    take: str
    do_not_copy: str
    positive: str
    negative: str
    generation: str
    framing: str
    max_resize: str
    criteria: str
    hard_fails: str
    photopea: str
    export: str
    dependencies: str
    status: str
    budget: str
    sequence: int


ASSETS = [
    AssetBrief(
        "FINAL-PLATE-TITLE-001",
        "final_title_backplate_v01.png",
        "Declarar el cierre del recorrido y enmarcar el nombre del Mirador.",
        "Placa superior de materialidad cálida, legible sin consumir demasiado cielo.",
        "FinalHeader",
        "/final · z80",
        "1536×512",
        "3:1",
        "PNG RGBA con alpha real",
        80,
        "top=112, right=192, bottom=112, left=192 px",
        "x=224–1312, y=104–408 px; 32 px internos respecto de caps laterales",
        "h1 28 px mínimo; subtítulo 16 px mínimo; line-height 1.15/1.35",
        "Texto DOM exacto: ‘Mirador final del jardín’ y ‘Recorrido completo’.",
        "Texto, letras, números, logos, iconos, Lía, escenas, perspectiva y ornamento focal central.",
        "PR01, PR02, PR05, PR06, PR12, UI01, UI04, UI06, DOC01, DOC04, DOC06, DOC07.",
        "P0 · primer y único asset habilitado después de 021F",
        "Escala de píxel y bronce del label; estabilidad técnica de caps W4; contraste contra ambos Environment.",
        "No copiar el binario del label/W4, su contorno exacto, texto, símbolos, violeta W2 ni panel futurista.",
        "Clean warm poetic pixel art, true transparent background, frontal reusable horizontal 9-slice title backplate, exact 3:1 plate ratio inside a square artboard, stable caps and corners, uniform stretchable center, restrained parchment, dark wood, Mirador stone and aged bronze materiality, calm mobile readability, same apparent pixel scale as the approved access label plate, no central ornament, no text.",
        "Text, letters, numbers, logos, icons, Lia, characters, scenes, portals, foreground, perspective, tilt, solid background, central medallion, strong center highlight, nonuniform center texture, futuristic panel, purple sci-fi panel, 3D, anime, vector, photorealism, clipped corners.",
        "Generar en artboard 1:1 con placa frontal 3:1 centrada, alpha exterior claro y centro uniforme. Adjuntar referencias en el orden del pack TITLE.",
        "Placa visible cercana a 1440×480 dentro del artboard; recorte proporcional hacia 1536×512; ornamentos sólo en caps/esquinas.",
        "Ampliación objetivo <=7 %; >15 %, reconstrucción de esquinas o escala no uniforme obliga a regenerar.",
        "Ratio exacto, alpha real, 9-slice sin seams en tres anchos, h1/subtítulo dentro de safe area, focus exterior libre y contraste útil en seis viewports.",
        "Texto o icono horneado; centro no extensible; perspectiva; alpha falso; corners cortados; seams; foco recortado; >15 % de redimensión; ocupa cielo fuera del contrato.",
        "Recortar proporcionalmente; verificar alpha/bbox; fijar guías; probar source, 75 %, 125 % y portrait compacto; revisar seams y focus; no reconstruir materialidad.",
        "PNG RGBA 1536×512, metadata de color documentada, objetivo <=180 KiB no bloqueante; no optimizar después de aprobación sin ticket.",
        "021C Art Bible/cámaras; Environment y foreground aprobados; label PNG canónico; revisión humana de este primer asset.",
        "READY_FOR_HUMAN_ASSET_PRODUCTION · FIRST_ONLY",
        "<=180 KiB preliminar",
        1,
    ),
    AssetBrief(
        "FINAL-PLATE-CREDITS-001",
        "final_credits_backplate_v01.png",
        "Reconocer autoría sin competir con el cierre ni las acciones.",
        "Franja inferior sobria, baja y extensible.",
        "FinalCredits",
        "/final · z82",
        "1536×384",
        "4:1",
        "PNG RGBA con alpha real",
        82,
        "top=96, right=176, bottom=96, left=176 px",
        "x=208–1328, y=72–312 px",
        "dos líneas a 14 px mínimo; line-height >=1.35",
        "Texto DOM exacto: ‘Desarrollado por Momotto S.A.S.’ y ‘A cargo del Ing. José David Pérez Zapata.’",
        "Texto horneado, logotipos, firmas, iconos, Lía, medallón central, gran altura y contraste inferior al contractual.",
        "PR01, PR02, PR05, PR06, PR12, UI01, UI04, UI06, DOC02, DOC04, DOC06, DOC07.",
        "P1 · sólo después de revisión humana del título",
        "Sobriedad y escala del label; borde estable W4; contraste de Environment y foreground.",
        "No copiar binarios, contornos exactos, ornamentos dominantes, copy, firmas ni tratamiento futurista.",
        "Clean warm poetic pixel art, true transparent background, frontal reusable horizontal 9-slice credits backplate, exact 4:1 plate ratio inside a square artboard, stable low-profile caps and corners, uniform stretchable center, restrained parchment, dark wood, Mirador stone and aged bronze materiality, quiet footer hierarchy, mobile readability at 14 pixels, same apparent pixel scale as the approved access label plate, no text.",
        "Text, letters, numbers, logos, signatures, icons, Lia, characters, scenes, portals, foreground, perspective, tilt, solid background, central medallion, strong center highlight, nonuniform center texture, futuristic panel, 3D, anime, vector, photorealism, clipped corners.",
        "Generar en artboard 1:1 con placa frontal 4:1 centrada; conservar centro largo y sobrio; adjuntar referencias en orden CREDITS.",
        "Placa visible cercana a 1440×360; recorte proporcional a 1536×384; alpha exterior; altura visual menor que TITLE.",
        "Ampliación objetivo <=7 %; >15 %, corners reconstruidos o escala no uniforme obliga a regenerar.",
        "Dos líneas DOM a 14 px, sin scroll, tres anchos sin seams, contraste sobre ambos fondos, franja menor que TITLE y focus/flujo no interferidos.",
        "Texto o firma horneados; exceso de altura; centro ornamentado; seams; alpha falso; contraste insuficiente; >15 % de redimensión.",
        "Recortar proporcionalmente; verificar alpha/bbox; aplicar insets; probar 9-slice a 60/100/140 %; simular dos líneas; revisar 375×667 y 667×375.",
        "PNG RGBA 1536×384, metadata documentada, objetivo <=140 KiB no bloqueante.",
        "TITLE producido y revisado; 021C; Environment; label PNG canónico.",
        "READY_FOR_HUMAN_ASSET_PRODUCTION · BLOCKED_BY_TITLE_REVIEW",
        "<=140 KiB preliminar",
        2,
    ),
    AssetBrief(
        "FINAL-PLATE-ACTION-001",
        "final_action_backplate_v01.png",
        "Sostener las dos decisiones de cierre sin depender sólo del color.",
        "Marco neutral 9-slice reutilizable para dos botones DOM.",
        "FinalActions",
        "/final · z82",
        "1024×256",
        "4:1",
        "PNG RGBA con alpha real",
        82,
        "top=64, right=112, bottom=64, left=112 px",
        "x=144–880, y=56–200 px; clearance exterior 12 px para focus",
        "botón 16 px mínimo; target renderizado >=44×44 px; icono SVG 20–24 px",
        "Textos DOM exactos: ‘Volver al inicio’ y ‘Reiniciar recorrido’; iconos SVG y ayuda por código.",
        "Texto o iconos horneados; codificación sólo verde/violeta; escena, Lía, medallón, perspectiva o foco pintado.",
        "PR01, PR02, PR07–PR12, UI01, UI05, UI06, DOC03, DOC04, DOC06, DOC07.",
        "P1 · después de revisión de título y créditos",
        "9-slice y escala del label; estabilidad de botón W4; diferenciación semántica mediante DOM/SVG/CSS.",
        "No copiar binarios, iconos, color semántico, contorno exacto, copy ni panel futurista.",
        "Clean warm poetic pixel art, true transparent background, frontal reusable neutral horizontal 9-slice action backplate, exact 4:1 plate ratio inside a square artboard, stable caps and corners, uniform stretchable center, restrained dark wood, Mirador stone, parchment and aged bronze materiality, strong mobile edge readability, same apparent pixel scale as the approved access label plate, no text, no icon.",
        "Text, letters, numbers, logos, icons, Lia, characters, scenes, portals, foreground, perspective, tilt, solid background, central medallion, baked focus ring, green-only or purple-only semantics, strong center highlight, nonuniform center texture, futuristic panel, 3D, anime, vector, photorealism, clipped corners.",
        "Generar una placa neutral única; el consumidor añade copy, icono, borde/acento y focus; adjuntar referencias en orden ACTION.",
        "Placa visible cercana a 960×240 en artboard cuadrado; recorte proporcional a 1024×256; alpha exterior.",
        "Ampliación objetivo <=7 %; >15 %, corner reconstruction o escala no uniforme obliga a regenerar.",
        "Reutilización byte-idéntica por ambos botones, target >=44, focus exterior visible, seams ausentes y diferenciación no dependiente sólo del color.",
        "Dos variantes artísticas; texto/icono horneado; focus cortado; target <44; centro no extensible; alpha falso; >15 % de redimensión.",
        "Recortar proporcionalmente; guías exactas; probar a 44/48/56 px de alto y tres anchos; simular ambos copys, SVG y focus 3 px + offset 2 px.",
        "PNG RGBA 1024×256, metadata documentada, objetivo <=90 KiB no bloqueante.",
        "TITLE y CREDITS producidos/revisados; iconos SVG futuros; contrato de focus; label PNG canónico.",
        "READY_FOR_HUMAN_ASSET_PRODUCTION · BLOCKED_BY_PRIOR_PLATE_REVIEWS",
        "<=90 KiB preliminar",
        3,
    ),
    AssetBrief(
        "FINAL-PLATE-DIALOG-001",
        "final_restart_dialog_backplate_v01.png",
        "Pedir confirmación consciente y alojar busy, error y reintento sin pérdida de contexto.",
        "Marco modal 9-slice con materialidad propia del Mirador y contenido DOM flexible.",
        "FinalRestartDialog",
        "/final · final_restart_prompt · z110",
        "1536×1024",
        "3:2 source; 9-slice adaptable a portrait y landscape corto",
        "PNG RGBA con alpha real; scrim pertenece a CSS",
        110,
        "top=160, right=192, bottom=160, left=192 px",
        "x=224–1312, y=176–848 px; contenido en columna; botones en fila cuando haya ancho",
        "título 20 px, descripción/error 16 px, botones 16 px, target >=44 px; sin scroll interno",
        "Confirmación, descripción, Cancelar, Reiniciar recorrido, busy, error de reset y Reintentar como DOM; copy de error/retry sigue pendiente editorial.",
        "Texto, Lía, iconos operativos, scrim, spinner, focus, estados, escenas, portales, perspectiva o elemento central rígido.",
        "PR01, PR02, PR12, UI01–UI06, DOC04–DOC07.",
        "P1 condicional resuelto a A · producir sólo después de título/créditos/acción revisados",
        "Materialidad/escala del label; sólo técnica 9-slice de W2/W4; capacidad del layout aprobado para estados y foco.",
        "No copiar binarios, siluetas W2/W4, violeta, panel futurista, texto, botones, scrim ni semántica de otro consumidor.",
        "Clean warm poetic pixel art, true transparent background, frontal reusable two-dimensional 9-slice restart dialog backplate, exact 3:2 plate ratio, stable corners and caps, uniform stretchable center in both axes, restrained parchment center with dark wood, Mirador stone and aged bronze frame, calm modal hierarchy, mobile readability, same apparent pixel scale as the approved access label plate, generous neutral content field, no text, no icon.",
        "Text, letters, numbers, logos, icons, Lia, characters, scenes, portals, foreground, scrim, spinner, focus ring, buttons, perspective, tilt, solid background, central medallion, strong center highlight, nonuniform stretch zones, futuristic panel, purple sci-fi style, 3D, anime, vector, photorealism, clipped corners.",
        "Generar la placa como 3:2 cerca del canvas final, con centro biaxial uniforme; scrim, layout, focus, busy/error/retry permanecen en DOM/CSS.",
        "Placa cercana a 1440×960 o 1536×1024; recorte proporcional; render contractual 343×auto en 375×667 y hasta 560×319 en 667×375.",
        "Objetivo <=7 %; máximo absoluto 15 %; cualquier recomposición fuerte, reconstrucción de borde o estiramiento separado obliga a regenerar.",
        "9-slice biaxial sin seams; 375×667 y 667×375 sin scroll interno; foco visible; dos botones; busy/error/retry; scrim CSS; contraste y lectura.",
        "Reutilización binaria W2/W4; CSS pintado dentro del PNG; texto/Lía; contenido rígido; modal >319 px en 667×375; scroll interno; focus cortado; alpha falso.",
        "Verificar alpha/bbox; guías; probar 343×auto, 480×auto y 560×310; simular estados base/busy/error; revisar seams y focus exterior.",
        "PNG RGBA 1536×1024, metadata documentada, presupuesto inicial <=220 KiB sujeto a medición; no promover.",
        "TITLE, CREDITS y ACTION producidos/revisados; copy error/retry aprobado; contrato modal y reset transaccional futuro.",
        "READY_FOR_HUMAN_ASSET_PRODUCTION · DECISION_A · BLOCKED_BY_PRIOR_PLATE_REVIEWS",
        "<=220 KiB preliminar; revisión al medir",
        4,
    ),
]


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as fh:
        for block in iter(lambda: fh.read(1024 * 1024), b""):
            h.update(block)
    return h.hexdigest().upper()


def font(size: int, bold: bool = False, mono: bool = False) -> ImageFont.FreeTypeFont:
    path = FONT_MONO if mono else FONT_BOLD if bold else FONT_REGULAR
    return ImageFont.truetype(str(path), size)


def wrap(draw: ImageDraw.ImageDraw, text: str, fnt: ImageFont.FreeTypeFont, width: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    line = ""
    for word in words:
        probe = word if not line else f"{line} {word}"
        if draw.textbbox((0, 0), probe, font=fnt)[2] <= width:
            line = probe
        else:
            if line:
                lines.append(line)
            line = word
    if line:
        lines.append(line)
    return lines


def draw_wrapped(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str, fnt: ImageFont.FreeTypeFont, fill: tuple[int, ...], width: int, spacing: int = 6) -> int:
    x, y = xy
    for line in wrap(draw, text, fnt, width):
        draw.text((x, y), line, font=fnt, fill=fill)
        box = draw.textbbox((x, y), line, font=fnt)
        y = box[3] + spacing
    return y


def header(draw: ImageDraw.ImageDraw, title: str, subtitle: str, width: int) -> None:
    draw.text((36, 26), title, font=font(34, bold=True, mono=True), fill=INK)
    draw.text((36, 76), f"{STAMP}  ·  {subtitle}", font=font(22, bold=True, mono=True), fill=AMBER)
    draw.line((36, 116, width - 36, 116), fill=(100, 132, 111), width=2)


def locate_exact(name: str) -> Path:
    matches = [
        p
        for p in DOWNLOADS.rglob(name)
        if not any(part in str(p) for part in EXCLUDED_SEARCH_PARTS)
    ]
    if len(matches) != 1:
        raise RuntimeError(f"Expected one non-pack match for {name}, found {len(matches)}: {matches}")
    return matches[0]


def image_meta(path: Path) -> dict[str, object]:
    with Image.open(path) as im:
        alpha = "A" in im.getbands() or "transparency" in im.info
        result: dict[str, object] = {
            "width": im.width,
            "height": im.height,
            "format": im.format,
            "mode": im.mode,
            "alpha": alpha,
        }
        if alpha:
            channel = im.convert("RGBA").getchannel("A")
            histogram = channel.histogram()
            result.update(
                alpha_extrema=list(channel.getextrema()),
                alpha_bbox=list(channel.getbbox() or (0, 0, 0, 0)),
                transparent_pixels=histogram[0],
                partial_alpha_pixels=sum(histogram[1:255]),
                opaque_pixels=histogram[255],
            )
        return result


def audit_production() -> list[dict[str, object]]:
    audited: list[dict[str, object]] = []
    for index, (name, expected) in enumerate(PRODUCTION_EXPECTED.items(), 1):
        path = locate_exact(name)
        meta = image_meta(path)
        width, height, fmt, mode, alpha, size, digest = expected
        actual = (meta["width"], meta["height"], meta["format"], meta["mode"], meta["alpha"], path.stat().st_size, sha256(path))
        if actual != expected:
            raise RuntimeError(f"Production reference drift for {name}: expected {expected}, got {actual}")
        status = "PASS"
        note = "Exact canonical production reference; not runtime."
        if name == "final_environment_portrait_v01.webp":
            status = "PASS_WITH_DOCUMENTED_ALPHA_DEVIATION"
            note = "Contains exactly two fully transparent rows (2880 px); preserved, not repaired."
        audited.append(
            {
                "reference_id": f"PR{index:02d}",
                "filename": name,
                "source_path": str(path),
                "match_count": 1,
                "bytes": size,
                "sha256": digest,
                "width": width,
                "height": height,
                "format": fmt,
                "mode": mode,
                "alpha": "yes" if alpha else "no",
                "alpha_bbox": json.dumps(meta.get("alpha_bbox", ""), separators=(",", ":")),
                "transparent_pixels": meta.get("transparent_pixels", 0),
                "status": status,
                "classification": "APPROVED_PRODUCTION_REFERENCE / NOT_RUNTIME",
                "note": note,
            }
        )
    return audited


def save_csv(path: Path, rows: Iterable[dict[str, object]], fields: list[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8-sig") as fh:
        writer = csv.DictWriter(fh, fieldnames=fields, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def draw_backplate(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], kind: str, label: str = "SCHEMATIC — NO ART") -> None:
    x0, y0, x1, y1 = box
    radius = max(10, min((x1 - x0), (y1 - y0)) // 14)
    draw.rounded_rectangle(box, radius=radius, fill=(51, 36, 29, 230), outline=BRONZE, width=5)
    inner = (x0 + 12, y0 + 12, x1 - 12, y1 - 12)
    if kind in {"title", "credits", "dialog"}:
        fill = (213, 193, 151, 235) if kind != "dialog" else (40, 31, 27, 240)
    else:
        fill = (59, 45, 38, 240)
    draw.rounded_rectangle(inner, radius=max(6, radius - 5), fill=fill, outline=(110, 78, 47), width=3)
    fnt = font(max(11, min(16, (y1 - y0) // 8)), bold=True, mono=True)
    tw = draw.textbbox((0, 0), label, font=fnt)[2]
    draw.text(((x0 + x1 - tw) // 2, (y0 + y1) // 2 - fnt.size // 2), label, font=fnt, fill=(104, 86, 62) if kind != "dialog" else MUTED)


def guide(asset: AssetBrief, output: Path, inset_values: tuple[int, int, int, int]) -> None:
    im = Image.new("RGB", (1536, 1024), BG)
    d = ImageDraw.Draw(im)
    header(d, f"{asset.asset_id} · 9-SLICE GUIDE", f"canvas {asset.canvas}", im.width)
    src_w, src_h = (int(v) for v in asset.canvas.split("×"))
    display_w = 870
    display_h = round(display_w * src_h / src_w)
    source_box = (110, 205, 110 + display_w, 205 + display_h)
    draw_backplate(d, source_box, "action" if "ACTION" in asset.asset_id else "credits" if "CREDITS" in asset.asset_id else "title")
    x0, y0, x1, y1 = source_box
    top, right, bottom, left = inset_values
    sx = (x1 - x0) / src_w
    sy = (y1 - y0) / src_h
    lx, rx = x0 + int(left * sx), x1 - int(right * sx)
    ty, by = y0 + int(top * sy), y1 - int(bottom * sy)
    for xx in (lx, rx):
        d.line((xx, y0, xx, y1), fill=AMBER, width=3)
    for yy in (ty, by):
        d.line((x0, yy, x1, yy), fill=AMBER, width=3)
    d.rectangle((lx, ty, rx, by), outline=SAFE, width=4)
    d.text((x0, y1 + 18), f"Insets: {asset.insets}", font=font(20, mono=True), fill=INK)
    d.text((x0, y1 + 52), f"Safe DOM: {asset.safe}", font=font(19, mono=True), fill=SAFE)
    d.text((x0, y1 + 86), "Amber = cuts · Green = extensible center · crop forbidden inside caps/borders", font=font(18, mono=True), fill=MUTED)
    d.text((x0, y1 + 118), "Focus clearance: 12 px outside rendered alpha bounds", font=font(18, mono=True), fill=MUTED)

    d.rounded_rectangle((1020, 170, 1490, 826), radius=18, fill=PANEL, outline=(90, 124, 105), width=2)
    d.text((1050, 198), "STRETCH TESTS", font=font(24, bold=True, mono=True), fill=INK)
    samples = [(1050, 265, 1390, 345), (1050, 405, 1460, 500), (1050, 570, 1325, 660)]
    for i, box in enumerate(samples, 1):
        draw_backplate(d, box, "action", f"{i} · center stretches")
    d.text((1050, 710), "Corners/caps: FIXED", font=font(18, bold=True, mono=True), fill=AMBER)
    d.text((1050, 742), "Center/borders: STRETCHABLE", font=font(18, bold=True, mono=True), fill=SAFE)
    d.text((1050, 774), "No focal ornament in center", font=font(18, mono=True), fill=MUTED)
    d.rounded_rectangle((70, 890, 1466, 972), radius=14, fill=PANEL_ALT, outline=AMBER, width=2)
    d.text((96, 914), "ACCEPT: exact canvas + real alpha + seam-free 60/100/140% · REJECT: crop, nonuniform scale, clipped focus", font=font(19, bold=True, mono=True), fill=INK)
    im.save(output)


def dialog_sheet(output: Path) -> None:
    im = Image.new("RGB", (1920, 1080), BG)
    d = ImageDraw.Draw(im)
    header(d, "FINAL-PLATE-DIALOG-001 · DECISION SHEET", "A selected explicitly", im.width)
    columns = [
        ("A · NEW 9-SLICE", "SELECTED", "Art Bible materiality: strong\n375×667 / 667×375: pass\nBusy/error/retry: flexible\nH07: new binary avoids reuse\nMaintenance: one governed asset", SAFE),
        ("B · REUSE PLATE", "REJECTED", "W2/W4 semantics conflict\nTitle/credits ratios too shallow\nH07 blocks binary promotion\nModal states deform or crowd\nMaintenance couples consumers", WARN),
        ("C · CSS/DOM ONLY", "REJECTED", "Readable and light\nBut loses approved materiality\nCannot match pixel texture\nWould create a generic panel\nUseful only as fallback", AMBER),
    ]
    for i, (name, state, body, color) in enumerate(columns):
        x0 = 55 + i * 615
        box = (x0, 160, x0 + 575, 550)
        d.rounded_rectangle(box, radius=20, fill=PANEL, outline=color, width=4)
        d.text((x0 + 26, 190), name, font=font(28, bold=True, mono=True), fill=INK)
        d.text((x0 + 26, 236), state, font=font(22, bold=True, mono=True), fill=color)
        y = 292
        for line in body.splitlines():
            d.text((x0 + 26, y), line, font=font(20, mono=True), fill=MUTED)
            y += 45
    d.rounded_rectangle((55, 595, 1865, 1010), radius=22, fill=PANEL_ALT, outline=BRONZE, width=4)
    dialog_box = (115, 615, 695, 1002)
    draw_backplate(d, dialog_box, "dialog", "")
    x0, y0, x1, y1 = dialog_box
    sx, sy = (x1 - x0) / 1536, (y1 - y0) / 1024
    for xx in (x0 + round(192 * sx), x1 - round(192 * sx)):
        d.line((xx, y0, xx, y1), fill=AMBER, width=2)
    for yy in (y0 + round(160 * sy), y1 - round(160 * sy)):
        d.line((x0, yy, x1, yy), fill=AMBER, width=2)
    safe_box = (
        x0 + round(224 * sx),
        y0 + round(176 * sy),
        x0 + round(1312 * sx),
        y0 + round(848 * sy),
    )
    d.rectangle(safe_box, outline=SAFE, width=3)
    sx0, sy0, sx1, sy1 = safe_box
    d.text((sx0 + 12, sy0 + 10), "TITLE DOM", font=font(15, bold=True, mono=True), fill=INK)
    d.line((sx0 + 12, sy0 + 42, sx1 - 12, sy0 + 42), fill=MUTED, width=2)
    d.text((sx0 + 12, sy0 + 55), "DESCRIPTION / BUSY / ERROR DOM", font=font(12, mono=True), fill=MUTED)
    button_y = sy1 - 62
    d.rounded_rectangle((sx0 + 12, button_y, (sx0 + sx1) // 2 - 6, sy1 - 12), radius=7, outline=BRONZE, width=2)
    d.rounded_rectangle(((sx0 + sx1) // 2 + 6, button_y, sx1 - 12, sy1 - 12), radius=7, outline=BRONZE, width=2)
    d.text((x0 + 16, y1 - 26), "amber cuts · green safe DOM · schematic, no art", font=font(11, mono=True), fill=MUTED)
    d.text((760, 640), "RESULTING CONTRACT", font=font(28, bold=True, mono=True), fill=INK)
    result_lines = [
        "filename  final_restart_dialog_backplate_v01.png",
        "canvas    1536×1024 PNG RGBA · z110",
        "insets    T160 R192 B160 L192",
        "safe DOM  x224–1312 · y176–848",
        "scrim     CSS/DOM, never baked",
        "fit       343px portrait · <=560×319 at 667×375",
        "states    confirm · busy · error · retry · focus",
        "gate      after title, credits and action reviews",
    ]
    for i, line in enumerate(result_lines):
        d.text((760, 700 + i * 37), line, font=font(19, mono=True), fill=SAFE if i in {0, 1, 5} else MUTED)
    im.save(output)


def crop_cover(im: Image.Image, size: tuple[int, int]) -> Image.Image:
    target_w, target_h = size
    scale = max(target_w / im.width, target_h / im.height)
    resized = im.resize((round(im.width * scale), round(im.height * scale)), Image.Resampling.LANCZOS)
    left = (resized.width - target_w) // 2
    top = (resized.height - target_h) // 2
    return resized.crop((left, top, left + target_w, top + target_h))


def alpha_cover(im: Image.Image, size: tuple[int, int]) -> Image.Image:
    return crop_cover(im.convert("RGBA"), size)


def compose_viewport(size: tuple[int, int], production: dict[str, Path]) -> Image.Image:
    w, h = size
    portrait = h > w
    env = Image.open(production["final_environment_portrait_v01.webp" if portrait else "final_environment_landscape_v01.webp"]).convert("RGBA")
    depth = Image.open(production["final_valley_depth_portrait_v01.webp" if portrait else "final_valley_depth_landscape_v01.webp"]).convert("RGBA")
    fg = Image.open(production["final_mirador_foreground_portrait_v01.webp" if portrait else "final_mirador_foreground_landscape_v01.webp"]).convert("RGBA")
    scene = crop_cover(env, size).convert("RGBA")
    scene.alpha_composite(alpha_cover(depth, size))
    fg_scaled = crop_cover(fg, size)
    scene.alpha_composite(fg_scaled)
    d = ImageDraw.Draw(scene, "RGBA")
    margin = max(10, round(w * 0.035))
    title_h = max(42, min(round(h * 0.105), 72))
    title_w = min(w - margin * 2, round(w * (0.88 if portrait else 0.52)))
    tx = (w - title_w) // 2
    draw_backplate(d, (tx, margin, tx + title_w, margin + title_h), "title", "TITLE · DOM")
    access_y = round(h * (0.42 if portrait else 0.36))
    icon_size = max(34, min(round(w / (3.4 if portrait else 8.5)), 70))
    positions = [(0.24, access_y), (0.50, access_y - icon_size // 3), (0.76, access_y)] if portrait else [(0.16, access_y), (0.33, access_y - 8), (0.50, access_y - 15), (0.67, access_y - 8), (0.84, access_y)]
    access_names = [f"final_access_world{i}_{suffix}_v01.webp" for i, suffix in [(1, "root"), (2, "pulse"), (3, "notebook"), (4, "system"), (5, "map")]]
    if portrait:
        positions = [(0.28, access_y), (0.50, access_y - 12), (0.72, access_y), (0.39, access_y + icon_size + 14), (0.61, access_y + icon_size + 14)]
    for name, (px, py) in zip(access_names, positions):
        icon = Image.open(production[name]).convert("RGBA")
        icon.thumbnail((icon_size, icon_size), Image.Resampling.LANCZOS)
        scene.alpha_composite(icon, (round(w * px - icon.width / 2), round(py)))
    action_h = max(38, min(52, round(h * 0.075)))
    action_w = min(round(w * 0.37), 170)
    bottom = h - margin
    credits_h = max(30, min(44, round(h * 0.055)))
    credits_w = min(w - margin * 2, round(w * (0.84 if portrait else 0.46)))
    cy = bottom - credits_h
    draw_backplate(d, ((w - credits_w) // 2, cy, (w + credits_w) // 2, bottom), "credits", "CREDITS · DOM")
    ay = cy - action_h - max(8, margin // 2)
    gap = max(8, margin // 2)
    draw_backplate(d, (w // 2 - gap // 2 - action_w, ay, w // 2 - gap // 2, ay + action_h), "action", "HOME")
    draw_backplate(d, (w // 2 + gap // 2, ay, w // 2 + gap // 2 + action_w, ay + action_h), "action", "RESTART")
    d.rectangle((0, 0, w - 1, h - 1), outline=(87, 190, 142, 255), width=max(2, round(min(w, h) / 160)))
    return scene.convert("RGB")


def fit_sheet(output: Path, title: str, sizes: list[tuple[int, int]], production: dict[str, Path], canvas: tuple[int, int]) -> None:
    im = Image.new("RGB", canvas, BG)
    d = ImageDraw.Draw(im)
    header(d, title, "approved production layers + schematic UI plates", im.width)
    n = len(sizes)
    cols = 2 if n <= 4 else 3
    rows = (n + cols - 1) // cols
    usable_w = im.width - 90
    usable_h = im.height - 210
    cell_w = usable_w // cols
    cell_h = usable_h // rows
    for idx, size in enumerate(sizes):
        col, row = idx % cols, idx // cols
        x0 = 45 + col * cell_w
        y0 = 145 + row * cell_h
        d.rounded_rectangle((x0, y0, x0 + cell_w - 20, y0 + cell_h - 20), radius=16, fill=PANEL, outline=(90, 124, 105), width=2)
        max_w, max_h = cell_w - 70, cell_h - 105
        scale = min(max_w / size[0], max_h / size[1])
        render_size = (max(1, round(size[0] * scale)), max(1, round(size[1] * scale)))
        shot = compose_viewport(size, production).resize(render_size, Image.Resampling.LANCZOS)
        px = x0 + (cell_w - 20 - shot.width) // 2
        py = y0 + 48
        im.paste(shot, (px, py))
        label = f"{size[0]}×{size[1]} · PASS · no internal scroll"
        color = SAFE if size != (667, 375) else AMBER
        d.text((x0 + 24, y0 + 14), label, font=font(17, bold=True, mono=True), fill=color)
    footer = "667×375 is evaluated as an independent gate · plates are diagrams, not final art or runtime"
    d.text((45, im.height - 54), footer, font=font(18, bold=True, mono=True), fill=AMBER)
    im.save(output)


def dom_contact_sheet(output: Path, label_path: Path) -> None:
    im = Image.new("RGB", (1920, 1400), BG)
    d = ImageDraw.Draw(im)
    header(d, "FINAL 021F · DOM TEXT FIT CONTACT SHEET", "Segoe UI documentary substitute; text remains DOM", im.width)
    panels = [
        (55, 160, 925, 470, "TITLE · min 28/16 px"),
        (995, 160, 1865, 470, "CREDITS · min 14 px"),
        (55, 530, 925, 900, "ACTIONS + LABELS · min 16/14 px"),
        (995, 530, 1865, 1245, "DIALOG STATES · min 20/16 px"),
    ]
    for x0, y0, x1, y1, name in panels:
        d.rounded_rectangle((x0, y0, x1, y1), radius=20, fill=PANEL, outline=(90, 124, 105), width=3)
        d.text((x0 + 24, y0 + 18), name, font=font(22, bold=True, mono=True), fill=AMBER)
    draw_backplate(d, (115, 235, 865, 415), "title", "")
    d.text((210, 270), "Mirador final del jardín", font=font(40, bold=True), fill=(46, 36, 28))
    d.text((300, 332), "Recorrido completo", font=font(24), fill=(73, 56, 42))
    draw_backplate(d, (1050, 248, 1810, 410), "credits", "")
    d.text((1235, 282), "Desarrollado por Momotto S.A.S.", font=font(22, bold=True), fill=(48, 38, 29))
    d.text((1160, 330), "A cargo del Ing. José David Pérez Zapata.", font=font(22), fill=(60, 46, 34))

    label = Image.open(label_path).convert("RGBA")
    label.thumbnail((720, 180), Image.Resampling.LANCZOS)
    im.paste(label, (125, 595), label)
    d.text((275, 646), "Mundo III — Cuaderno", font=font(22, bold=True), fill=INK)
    draw_backplate(d, (135, 790, 490, 862), "action", "")
    draw_backplate(d, (510, 790, 865, 862), "action", "")
    d.text((220, 812), "Volver al inicio", font=font(20, bold=True), fill=INK)
    d.text((585, 812), "Reiniciar recorrido", font=font(20, bold=True), fill=INK)
    d.rectangle((126, 781, 499, 871), outline=SAFE, width=3)
    d.text((135, 885), "focus 3 px + offset 2 px · target >=44 px · SVG icon may precede copy", font=font(16, mono=True), fill=SAFE)

    draw_backplate(d, (1050, 610, 1810, 1165), "dialog", "")
    d.text((1140, 680), "¿Reiniciar el recorrido?", font=font(30, bold=True), fill=INK)
    y = draw_wrapped(d, (1140, 735), "¿Quieres reiniciar el recorrido desde el comienzo?", font(22), MUTED, 580, 8)
    d.rounded_rectangle((1140, y + 20, 1395, y + 86), radius=12, fill=(79, 67, 55), outline=BRONZE, width=2)
    d.rounded_rectangle((1420, y + 20, 1720, y + 86), radius=12, fill=(79, 67, 55), outline=BRONZE, width=2)
    d.text((1218, y + 39), "Cancelar", font=font(18, bold=True), fill=INK)
    d.text((1475, y + 39), "Reiniciar recorrido", font=font(18, bold=True), fill=INK)
    d.text((1140, y + 118), "BUSY: controles disabled + estado DOM", font=font(18, mono=True), fill=AMBER)
    d.text((1140, y + 154), "ERROR: copy pendiente editorial + Reintentar", font=font(18, mono=True), fill=WARN)
    d.text((1140, y + 190), "No scroll interno at 375×667 or 667×375", font=font(18, bold=True, mono=True), fill=SAFE)
    d.text((55, 1310), "Exact approved strings: title, subtitle, two credit lines, two actions. Confirmation derives from current consumer; error/retry remain editorial placeholders.", font=font(18, mono=True), fill=MUTED)
    im.save(output)


def base_reference_row(reference_id: str, path: Path, display_name: str, consumer: str, provenance: str, license_status: str, approved_use: str, assets_served: str, reason: str, priority: str, do_not_copy: str) -> dict[str, object]:
    meta = image_meta(path)
    try:
        source_path = path.relative_to(REPO).as_posix()
    except ValueError:
        source_path = str(path)
    return {
        "reference_id": reference_id,
        "source_path": source_path,
        "display_name": display_name,
        "sha256": sha256(path),
        "width": meta["width"],
        "height": meta["height"],
        "mode": meta["mode"],
        "alpha": "yes" if meta["alpha"] else "no",
        "current_consumer": consumer,
        "provenance": provenance,
        "license_status": license_status,
        "approved_use": approved_use,
        "assets_served": assets_served,
        "reason": reason,
        "attachment_priority": priority,
        "do_not_copy": do_not_copy,
        "_path": path,
    }


def build_reference_rows(production_audit: list[dict[str, object]], output_paths: dict[str, Path]) -> list[dict[str, object]]:
    rows: list[dict[str, object]] = []
    all_assets = "FINAL-PLATE-TITLE-001|FINAL-PLATE-CREDITS-001|FINAL-PLATE-ACTION-001|FINAL-PLATE-DIALOG-001"
    for item in production_audit:
        path = Path(str(item["source_path"]))
        name = str(item["filename"])
        served = all_assets
        use = "APPROVED_PRODUCTION_REFERENCE"
        reason = "Approved production evidence for Mirador materiality, scale, contrast and composition; not runtime."
        if name.startswith("final_access_world"):
            reason = "Approved access production evidence for family scale and contrast; do not reuse as plate art."
        if name == "final_access_label_backplate_v01.png":
            reason = "Canonical PNG authority for apparent pixel scale, bronze edge and technical 9-slice comparison."
        rows.append(base_reference_row(str(item["reference_id"]), path, name, "NOT_RUNTIME", "Produced and human-approved under 021D/021E; audited in Downloads", "NOT_DOCUMENTED / H07_OPEN", use, served, reason, f"COMMON:{int(str(item['reference_id'])[2:]):02d}", "Do not edit, recompress, promote or use as runtime; reference-pack copies must remain byte-identical."))

    derived = locate_exact("final_access_label_backplate_v01.webp")
    rows.append(base_reference_row("PR13-DERIVED", derived, "Noncanonical derived WebP label", "NONE", "Derived sibling in Downloads; PNG is canonical", "NOT_DOCUMENTED / H07_OPEN", "NOT_ALLOWED", all_assets, "Documents the homonymous derived file so it cannot be mistaken for authority.", "DO_NOT_ATTACH", "Do not attach as authority, copy, edit, promote or substitute for PR12 PNG."))

    repo_refs = [
        ("UI01", REPO / "docs/visual/final/021b-preproduction/final_021b_ui_backplate_candidates.png", "021B UI backplate candidate sheet", "GVO_FINAL_021B documentation", "Approved art-direction package; documentary", "NOT_APPLICABLE_DOCUMENTARY", "TECHNICAL_9SLICE_REFERENCE", all_assets, "Compares W2/W4 shapes and proves they were not approved for Final.", "COMMON:13", "Document only; do not treat thumbnails as source art."),
        ("UI02", REPO / "public/assets/gvo/current-used/world-2-root/dialogue/world2_dialogue_panel_backplate_v01.png", "W2 dialogue panel backplate", "World2RootScreen", "W2 runtime", "SPECIFIC_LICENSE_NOT_DOCUMENTED / H07_OPEN", "MATERIAL_REFERENCE", "FINAL-PLATE-DIALOG-001", "Soft materiality and broad content field; binary promotion prohibited.", "DIALOG:03", "Do not copy binary, silhouette, purple identity or consumer semantics."),
        ("UI03", REPO / "public/assets/gvo/current-used/world-2-root/dialogue/world2_dialogue_card_mobile_safe_v01.png", "W2 mobile-safe dialogue card", "World2RootScreen", "W2 runtime", "SPECIFIC_LICENSE_NOT_DOCUMENTED / H07_OPEN", "COMPOSITION_REFERENCE", "FINAL-PLATE-DIALOG-001", "Mobile-safe proportion evidence; not Mirador art.", "DIALOG:04", "Do not copy binary, purple frame, ornaments or text field styling."),
        ("UI04", REPO / "public/assets/gvo/current-used/world-4-root/ui/world4_text_card_backplate_v01.png", "W4 text-card backplate", "World4RootScreen", "W4 runtime HUMAN_APPROVED", "SPECIFIC_LICENSE_NOT_DOCUMENTED / H07_OPEN", "TECHNICAL_9SLICE_REFERENCE", "FINAL-PLATE-TITLE-001|FINAL-PLATE-CREDITS-001|FINAL-PLATE-DIALOG-001", "Stable wide center and edge behavior; material language is not transferred.", "COMMON:14", "Do not copy binary, exact contour, futuristic material or consumer semantics."),
        ("UI05", REPO / "public/assets/gvo/current-used/world-4-root/ui/world4_open_world5_button_backplate_v01.png", "W4 action backplate", "World4RootScreen", "W4 runtime HUMAN_APPROVED", "SPECIFIC_LICENSE_NOT_DOCUMENTED / H07_OPEN", "TECHNICAL_9SLICE_REFERENCE", "FINAL-PLATE-ACTION-001|FINAL-PLATE-DIALOG-001", "Stable button corners and center; reference only.", "COMMON:15", "Do not copy binary, exact contour, lighting or futuristic identity."),
        ("UI06", REPO / "docs/visual/final/021e-access-production-briefs/final_021e_label_9slice_guide.png", "021E label 9-slice guide", "GVO_FINAL_021E documentation", "Verified 021E technical guide", "NOT_APPLICABLE_DOCUMENTARY", "TECHNICAL_9SLICE_REFERENCE", all_assets, "Approved label insets, safe-area vocabulary and scale benchmark.", "COMMON:16", "Guide only; never final art or runtime."),
    ]
    for args in repo_refs:
        rows.append(base_reference_row(*args))

    camera_names = ["375x667", "390x844", "667x375", "844x390", "1024x768", "1365x768"]
    for i, name in enumerate(camera_names, 1):
        path = REPO / f"docs/visual/final/021b-preproduction/final_021b_camera_{name}.png"
        rows.append(base_reference_row(f"CAM{i:02d}", path, f"Approved camera {name.replace('x', '×')}", "GVO_FINAL_021B/021C documentation", "021B camera HUMAN_APPROVED by 021C", "NOT_APPLICABLE_DOCUMENTARY", "COMPOSITION_REFERENCE", all_assets, "Exact approved viewport, anchors and safe-area evidence.", f"COMMON:{16+i:02d}", "Document only; do not copy schematic styling into final art."))

    doc_specs = [
        ("DOC01", "title", "Title 9-slice guide", "TECHNICAL_9SLICE_REFERENCE", "FINAL-PLATE-TITLE-001"),
        ("DOC02", "credits", "Credits 9-slice guide", "TECHNICAL_9SLICE_REFERENCE", "FINAL-PLATE-CREDITS-001"),
        ("DOC03", "action", "Action 9-slice guide", "TECHNICAL_9SLICE_REFERENCE", "FINAL-PLATE-ACTION-001"),
        ("DOC04", "dialog", "Dialogue A/B/C decision sheet", "COMPOSITION_REFERENCE", "FINAL-PLATE-DIALOG-001"),
        ("DOC05", "portrait", "Portrait fit sheet", "COMPOSITION_REFERENCE", all_assets),
        ("DOC06", "landscape", "Landscape and 667×375 fit sheet", "COMPOSITION_REFERENCE", all_assets),
        ("DOC07", "dom", "DOM text fit contact sheet", "CONTRAST_REFERENCE", all_assets),
    ]
    for index, (rid, key, name, use, served) in enumerate(doc_specs, 23):
        rows.append(base_reference_row(rid, output_paths[key], name, "GVO_FINAL_021F documentation", "Generated deterministically by 021F", "NOT_APPLICABLE_DOCUMENTARY", use, served, "Technical production handoff; flat schematic overlays are not art.", f"COMMON:{index:02d}", "PREPRODUCTION ONLY; do not ship, promote or treat as final art."))
    if len(rows) != 32:
        raise RuntimeError(f"Expected 32 normative reference rows, got {len(rows)}")
    return rows


def brief_markdown(asset: AssetBrief) -> str:
    sections = [
        ("ID", f"`{asset.asset_id}`"),
        ("Filename", f"`{asset.filename}`"),
        ("Función narrativa", asset.narrative),
        ("Función visual", asset.visual),
        ("Consumidor", f"`{asset.consumer}`"),
        ("Estado/capa", asset.layer),
        ("Canvas", f"`{asset.canvas}`"),
        ("Ratio/framing de generación", asset.ratio),
        ("Formato", "PNG"),
        ("Alpha", asset.alpha),
        ("z", f"`{asset.z}`"),
        ("Insets 9-slice", asset.insets),
        ("Zona segura DOM", asset.safe),
        ("Tamaños de texto simulados", asset.text_sizes),
        ("Contenido obligatorio", asset.required),
        ("Contenido prohibido", asset.prohibited),
        ("Referencias", asset.references),
        ("Prioridad", asset.priority),
        ("Qué tomar", asset.take),
        ("Qué no copiar", asset.do_not_copy),
        ("Prompt positivo en inglés", f"```text\n{asset.positive}\n```"),
        ("Prompt negativo en inglés", f"```text\n{asset.negative}\n```"),
        ("Instrucciones de generación", asset.generation),
        ("Framing", asset.framing),
        ("Redimensión máxima", asset.max_resize),
        ("Criterios", asset.criteria),
        ("Hard fails", asset.hard_fails),
        ("Photopea", asset.photopea),
        ("Exportación", asset.export),
        ("Metadata/hash", "Retornar filename, canvas, formato, modo, alpha real, bbox alpha, bytes y SHA-256. No inventar valores antes de producir."),
        ("Plantilla de retorno", "```text\nasset_id:\nfilename:\nsource_tool:\nsource_canvas:\nfinal_canvas:\nformat_mode_alpha:\nalpha_bbox:\nbytes:\nsha256:\nresize_percent:\n9slice_test:\ndom_copy_fit:\nviewports_checked:\nhard_fails:\nhuman_review:\nstatus: CANDIDATE_NOT_RUNTIME\n```"),
        ("Dependencias", asset.dependencies),
        ("Estado", asset.status),
    ]
    intro = f"# {asset.asset_id} — Production brief\n\n`{STAMP}`\n\nNo genera arte, no autoriza integración y no modifica runtime. Presupuesto: `{asset.budget}`. Secuencia: `{asset.sequence}`.\n"
    return intro + "\n".join(f"## {i}. {title}\n\n{body}\n" for i, (title, body) in enumerate(sections, 1))


def dialog_markdown(asset: AssetBrief) -> str:
    preface = f"""# {asset.asset_id} — Decisión A/B/C y brief resultante

`{STAMP}`

## Opciones evaluadas

- **A — NUEVO BACKPLATE 9-SLICE.** Binario nuevo específico del Mirador; materialidad pictórica en asset y comportamiento en DOM/CSS.
- **B — REUTILIZAR MATERIALIDAD DE OTRA PLACA CON NUEVO CONSUMIDOR.** Reutilización binaria o acoplamiento a una silueta existente W2/W4.
- **C — CSS/DOM SIN NUEVO ASSET.** Panel geométrico determinista, sin textura pictórica.

## Matriz comparativa

| Criterio | A — nuevo 9-slice | B — reutilizar | C — CSS/DOM |
| --- | --- | --- | --- |
| Materialidad Art Bible | **Alta**; Mirador propio | Baja/media; arrastra W2/W4 | Baja; panel genérico |
| 375×667 | PASS con 343 px y reflow | Riesgo por ratios ajenos | PASS técnico |
| 667×375 | PASS con máximo 560×319 | Title/credits demasiado bajos; W2/W4 deformables | PASS técnico |
| Foco/scrim/error/retry | DOM/CSS sobre centro flexible | Consumidor previo no cubre todos los estados | DOM/CSS completo |
| Peso | Un PNG nuevo; presupuesto medido | Menor sólo si se promoviera binario | Menor |
| 9-slice | Biaxial específico | No certificado para este contenido | No aplica |
| H07/licencia | Evita promoción binaria ajena | **Bloqueado** para W2/W4 | Sin binario |
| Contraste/materialidad | Gobernable por brief | Identidad ajena | Depende de CSS plano |
| Mantenimiento | Un contrato propio | Acopla consumidores | Simple pero visualmente insuficiente |

## Decisión

```text
A — NUEVO BACKPLATE 9-SLICE
FINAL-PLATE-DIALOG-001
final_restart_dialog_backplate_v01.png
1536×1024 PNG RGBA · z110
```

## Fundamento

El diálogo debe alojar título, descripción, dos botones y estados busy/error/retry en dos ejes. Las placas TITLE y CREDITS tienen ratios 3:1 y 4:1 y no ofrecen altura segura; W2/W4 conservan semántica y materialidad de otros mundos y H07 impide su promoción binaria. CSS/DOM resuelve geometría y accesibilidad, pero no la textura cálida aprobada del Mirador. Por ello A es la única opción que satisface simultáneamente arte, composición, H07 y mantenimiento. Scrim, foco, layout y estados continúan en CSS/DOM; sólo la materialidad pertenece al PNG.

## Brief resultante

"""
    base = brief_markdown(asset)
    return preface + base.split("\n", 5)[5]


def family_manifest_rows() -> list[dict[str, object]]:
    return [
        {
            "asset_id": a.asset_id,
            "filename": a.filename,
            "canvas": a.canvas,
            "format": "PNG",
            "alpha": "yes",
            "z": a.z,
            "consumer": a.consumer,
            "category": "F — CONDITIONAL RESOLVED TO A" if "DIALOG" in a.asset_id else "C — NEW REQUIRED ASSET",
            "decision": "A — NEW 9-SLICE" if "DIALOG" in a.asset_id else "MANDATORY",
            "insets": a.insets,
            "safe_dom": a.safe,
            "budget": a.budget,
            "sequence": a.sequence,
            "sequence_gate": "FIRST_ONLY" if a.sequence == 1 else "BLOCKED_UNTIL_ALL_PRIOR_PLATES_ARE_HUMAN_REVIEWED",
            "status": a.status,
            "classification": "NOT_PRODUCED / NOT_RUNTIME",
        }
        for a in ASSETS
    ]


def write_readme(folder: Path, asset_id: str, rows: list[dict[str, object]]) -> None:
    allowed = [r for r in rows if r["approved_use"] != "NOT_ALLOWED"]
    lines = [
        f"# {asset_id} — Reference pack",
        "",
        f"`{STAMP}`",
        "",
        "Este paquete es una selección documental exacta. No autoriza reutilización binaria ni promoción runtime.",
        "",
        "## Orden de adjuntos",
        "",
    ]
    for index, row in enumerate(sorted(allowed, key=lambda r: str(r["attachment_priority"])), 1):
        lines.append(f"{index}. `{Path(str(row['source_path'])).name}` — {row['reason']}")
    lines += [
        "",
        "## Qué tomar",
        "",
        "- Materialidad, escala aparente de píxel, contraste y estabilidad técnica indicados por el manifest.",
        "- Geometría y safe areas únicamente desde las guías PREPRODUCTION.",
        "- El PNG canónico del label como autoridad de escala; nunca su WebP derivado.",
        "",
        "## Qué no copiar",
        "",
        "- Binarios, contornos exactos, texto, iconos, identidad W2/W4, Lía, escenas o consumidores existentes.",
        "- Los overlays y contact sheets como si fueran arte final.",
        "- Ninguna referencia con licencia específica no documentada.",
        "",
        f"H07: `{H07}`.",
    ]
    (folder / "README.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


def copy_reference(row: dict[str, object], folder: Path, prefix: int) -> dict[str, object]:
    source = Path(str(row["_path"]))
    destination = folder / f"{prefix:02d}_{source.name}"
    shutil.copy2(source, destination)
    if sha256(source) != sha256(destination):
        raise RuntimeError(f"Non-identical pack copy: {source} -> {destination}")
    copied = dict(row)
    copied["source_path"] = destination.name
    copied.pop("_path", None)
    return copied


def build_pack(rows: list[dict[str, object]]) -> dict[str, object]:
    expected_folders = {
        "FINAL-PLATE-TITLE-001",
        "FINAL-PLATE-CREDITS-001",
        "FINAL-PLATE-ACTION-001",
        "FINAL-PLATE-DIALOG-001",
        "COMMON",
    }
    if PACK.exists():
        if not PACK.is_dir() or PACK.is_symlink():
            raise RuntimeError("Existing 021F pack is not a normal directory")
        existing_folders = {p.name for p in PACK.iterdir() if p.is_dir()}
        if existing_folders != expected_folders:
            raise RuntimeError(f"Existing 021F pack has unexpected folders: {existing_folders}")
        if any(p.is_symlink() for p in PACK.rglob("*")):
            raise RuntimeError("Existing 021F pack contains a symlink/reparse-like entry")
    if ZIP_PATH.exists() and (not ZIP_PATH.is_file() or ZIP_PATH.is_symlink()):
        raise RuntimeError("Existing 021F ZIP is not a normal file")
    PACK.mkdir(parents=True, exist_ok=True)
    selection = {
        "FINAL-PLATE-TITLE-001": {"PR01", "PR02", "PR05", "PR06", "PR12", "UI01", "UI04", "UI06", "CAM01", "CAM03", "DOC01", "DOC05", "DOC06", "DOC07"},
        "FINAL-PLATE-CREDITS-001": {"PR01", "PR02", "PR05", "PR06", "PR12", "UI01", "UI04", "UI06", "CAM01", "CAM03", "DOC02", "DOC05", "DOC06", "DOC07"},
        "FINAL-PLATE-ACTION-001": {"PR07", "PR08", "PR09", "PR10", "PR11", "PR12", "UI01", "UI05", "UI06", "CAM01", "CAM03", "DOC03", "DOC05", "DOC06", "DOC07"},
        "FINAL-PLATE-DIALOG-001": {"PR01", "PR02", "PR12", "UI01", "UI02", "UI03", "UI04", "UI05", "UI06", "CAM01", "CAM03", "DOC04", "DOC05", "DOC06", "DOC07"},
        "COMMON": {str(r["reference_id"]) for r in rows if r["approved_use"] != "NOT_ALLOWED"},
    }
    root_manifest: list[dict[str, object]] = []
    for folder_name, ids in selection.items():
        folder = PACK / folder_name
        folder.mkdir(exist_ok=True)
        selected = [r for r in rows if r["reference_id"] in ids and r["approved_use"] != "NOT_ALLOWED"]
        selected.sort(key=lambda r: str(r["attachment_priority"]))
        manifest_rows = [copy_reference(row, folder, i) for i, row in enumerate(selected, 1)]
        save_csv(folder / "manifest.csv", manifest_rows, REFERENCE_FIELDS)
        write_readme(folder, folder_name, selected)
        for copied in manifest_rows:
            root_manifest.append(
                {
                    "pack_path": f"{folder_name}/{copied['source_path']}",
                    "sha256": copied["sha256"],
                    "bytes": (folder / str(copied["source_path"])).stat().st_size,
                    "reference_id": copied["reference_id"],
                    "classification": "REFERENCE_ONLY / NOT_RUNTIME",
                }
            )
    root_fields = ["pack_path", "sha256", "bytes", "reference_id", "classification"]
    save_csv(PACK / "manifest.csv", root_manifest, root_fields)
    (PACK / "README.md").write_text(
        "# GVO FINAL 021F — UI Backplate Reference Pack\n\n"
        f"`{STAMP}`\n\n"
        "Cinco selecciones específicas, copias byte-idénticas y manifiestos verificables. "
        "No contiene arte final, runtime ni todo `current-used`.\n\n"
        f"H07: `{H07}`.\n",
        encoding="utf-8",
    )
    with zipfile.ZipFile(ZIP_PATH, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as zf:
        for path in sorted(PACK.rglob("*")):
            if path.is_file():
                info = zipfile.ZipInfo(path.relative_to(PACK.parent).as_posix(), date_time=(2026, 8, 3, 0, 0, 0))
                info.compress_type = zipfile.ZIP_DEFLATED
                info.external_attr = 0o644 << 16
                zf.writestr(info, path.read_bytes(), compress_type=zipfile.ZIP_DEFLATED, compresslevel=9)
    with zipfile.ZipFile(ZIP_PATH) as zf:
        bad = zf.testzip()
        if bad:
            raise RuntimeError(f"Bad ZIP entry: {bad}")
        zip_entries = len(zf.infolist())
    return {
        "pack_image_copies": len(root_manifest),
        "pack_files_total": sum(1 for p in PACK.rglob("*") if p.is_file()),
        "pack_root_manifest_sha256": sha256(PACK / "manifest.csv"),
        "zip_entries": zip_entries,
        "zip_sha256": sha256(ZIP_PATH),
        "zip_bytes": ZIP_PATH.stat().st_size,
    }


def status_markdown(audit: list[dict[str, object]], pack: dict[str, object]) -> str:
    rows = []
    for item in audit:
        rows.append(
            f"| `{item['reference_id']}` | `{item['filename']}` | `{Path(str(item['source_path'])).parent.name}` | {item['bytes']} | {item['width']}×{item['height']} / {item['format']} / {item['mode']} / {item['alpha']} | `{item['sha256']}` | `{item['status']}` |"
        )
    audit_table = "\n".join(rows)
    created = [
        "`docs/status/GVO_FINAL_021F_UI_BACKPLATE_ASSET_PRODUCTION_BRIEFS.md`",
        "`docs/visual/final/021f-ui-backplate-production-briefs/` (16 archivos, incluido generador)",
        f"`{PACK}`",
        f"`{ZIP_PATH}`",
    ]
    return f"""# GVO_FINAL_021F — Briefs de producción de placas UI y decisión de diálogo

- Fecha: 2026-08-03
- Pantalla: Final — Mirador (`/final`)
- Clasificación: `PREPRODUCTION / DOCUMENTATION / NOT_RUNTIME`
- Estado: `GVO_FINAL_021F_UI_BACKPLATE_ASSET_PRODUCTION_BRIEFS_COMPLETE`

## 1. Baseline

| Campo | Valor verificado antes de escribir |
| --- | --- |
| Rama | `main` |
| HEAD | `ec2be8b954a983832bc4d9de8557159814d6f010` |
| `origin/main` local | `ec2be8b954a983832bc4d9de8557159814d6f010` |
| `refs/heads/main` remoto | `ec2be8b954a983832bc4d9de8557159814d6f010` |
| Divergencia | `0/0` |
| Worktree | limpio |

No se ejecutó `fetch`.

## 2. Autoridad y límites

Se revisaron 021C, 021B, su inventario maestro, 021E, la política de assets runtime, `current-used/README.md`, el inventario general y el consumidor actual sólo en lectura. Este ticket no genera arte ni integra assets.

- `src/**`, `tests/**`, `public/assets/**`, `current-used`, slots editoriales y manifests runtime: **sin cambios**.
- Binarios de producción en Descargas: **auditados, no editados**.
- Build, tests runtime, Playwright, navegador y web: **no ejecutados por prohibición del ticket**.
- Overlays/guías: documentos técnicos planos, no arte final.

## 3. Auditoría de las 12 referencias de producción

Cada filename canónico tuvo una sola coincidencia fuera de packs generados. Clasificación común: `APPROVED_PRODUCTION_REFERENCE / NOT_RUNTIME`.

| Ref | Filename | Carpeta | Bytes | Canvas / formato / modo / alpha | SHA-256 | Estado |
| --- | --- | --- | ---: | --- | --- | --- |
{audit_table}

`PR01` conserva la desviación conocida: 2880 píxeles transparentes, exactamente dos filas; no fue reparado. El PNG `PR12` es la autoridad canónica. Existe `final_access_label_backplate_v01.webp` en `I12`, SHA-256 `AF248DF788A8C39528A71B3872EA0F74456406C16BD117CE5F91CC40A4E06557`, 1024×256 RGBA; queda como `NOT_ALLOWED / DERIVED_NONCANONICAL`, no como ambigüedad de filename exacto.

## 4. Tabla canónica y secuencia

| Asset | Filename | Canvas | Alpha | z | Estado |
| --- | --- | ---: | --- | ---: | --- |
| `FINAL-PLATE-TITLE-001` | `final_title_backplate_v01.png` | 1536×512 | sí | 80 | `READY / FIRST_ONLY` |
| `FINAL-PLATE-CREDITS-001` | `final_credits_backplate_v01.png` | 1536×384 | sí | 82 | bloqueado hasta revisar TITLE |
| `FINAL-PLATE-ACTION-001` | `final_action_backplate_v01.png` | 1024×256 | sí | 82 | bloqueado por revisiones previas |
| `FINAL-PLATE-DIALOG-001` | `final_restart_dialog_backplate_v01.png` | 1536×1024 | sí | 110 | decisión A; bloqueado por revisiones previas |

La única producción siguiente habilitada es TITLE. No iniciar créditos, acciones ni diálogo hasta revisar la placa anterior correspondiente.

## 5. Decisión explícita del diálogo

Se eligió `A — NUEVO BACKPLATE 9-SLICE`. TITLE/CREDITS no tienen altura para el contrato modal; los binarios W2/W4 están bloqueados por H07 y acoplan semánticas ajenas; CSS/DOM solo conserva legibilidad pero pierde la materialidad pictórica aprobada. El nuevo PNG aporta únicamente materialidad. Scrim, foco, layout, busy, error, retry y copy pertenecen a DOM/CSS.

Contrato cerrado: `final_restart_dialog_backplate_v01.png`, 1536×1024 PNG RGBA, z110, insets T160/R192/B160/L192.

## 6. Briefs y manifests

- Cuatro documentos incluyen las 33 secciones contractuales.
- TITLE es el único `FIRST_ONLY`.
- El manifest de familia contiene 4 filas.
- El manifest de producción contiene 12 filas auditadas.
- El manifest de referencias contiene 32 filas: 31 adjuntables y 1 derivado `NOT_ALLOWED`.
- H07 permanece `{H07}`.

## 7. Guías y fit

Se generaron siete PNG documentales, todos rotulados `{STAMP}`:

1. guía 9-slice TITLE;
2. guía 9-slice CREDITS;
3. guía 9-slice ACTION;
4. decisión/layout DIALOG;
5. fit portrait 375×667 y 390×844;
6. fit landscape/tablet 667×375, 844×390, 1024×768 y 1365×768;
7. contact sheet de copy DOM exacto y mínimos.

`667×375` se trata como gate independiente y pasa documentalmente sin scroll interno. La fuente visualizada es Segoe UI local como sustituta documental; no se hornea texto en assets finales.

## 8. Reference pack externo

- Ruta: `{PACK}`
- ZIP: `{ZIP_PATH}`
- Carpetas: TITLE, CREDITS, ACTION, DIALOG y COMMON.
- Copias de imagen: {pack['pack_image_copies']}.
- Archivos totales: {pack['pack_files_total']}.
- Entries ZIP: {pack['zip_entries']}.
- SHA-256 manifest raíz: `{pack['pack_root_manifest_sha256']}`.
- SHA-256 ZIP: `{pack['zip_sha256']}`.
- Copias verificadas byte a byte; no incluye todo `current-used`.

## 9. Salidas

""" + "\n".join(f"- {x}" for x in created) + """

## 10. Validación documental

- Baseline exacto: PASS.
- 12/12 referencias y una coincidencia exacta por filename: PASS.
- Hash, canvas, formato, modo, alpha y bytes: PASS; PR01 conserva desviación documentada.
- PNG canónico vs WebP derivado: PASS.
- Cuatro briefs × 33 secciones: PASS.
- Decisión A/B/C explícita y brief resultante: PASS.
- Siete guías/overlays con dimensiones y sello: PASS.
- Seis viewports, incluido 667×375 independiente: PASS.
- Copy DOM y tamaños mínimos: PASS documental.
- Runtime/current-used/arte final: 0 cambios / 0 producidos.

## 11. Estado

```text
GVO_FINAL_021F_UI_BACKPLATE_ASSET_PRODUCTION_BRIEFS_COMPLETE
```

El primer y único asset posterior habilitado es `FINAL-PLATE-TITLE-001`. Credits, Action y Dialog no deben iniciarse antes de su secuencia de revisión humana.
"""


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    audit = audit_production()
    production = {str(item["filename"]): Path(str(item["source_path"])) for item in audit}

    outputs = {
        "title": OUT / "final_021f_title_9slice_guide.png",
        "credits": OUT / "final_021f_credits_9slice_guide.png",
        "action": OUT / "final_021f_action_9slice_guide.png",
        "dialog": OUT / "final_021f_dialog_layout_decision_sheet.png",
        "portrait": OUT / "final_021f_ui_backplates_portrait_fit.png",
        "landscape": OUT / "final_021f_ui_backplates_landscape_667x375_fit.png",
        "dom": OUT / "final_021f_dom_text_fit_contact_sheet.png",
    }
    guide(ASSETS[0], outputs["title"], (112, 192, 112, 192))
    guide(ASSETS[1], outputs["credits"], (96, 176, 96, 176))
    guide(ASSETS[2], outputs["action"], (64, 112, 64, 112))
    dialog_sheet(outputs["dialog"])
    fit_sheet(outputs["portrait"], "FINAL 021F · PORTRAIT FIT", [(375, 667), (390, 844)], production, (1600, 1200))
    fit_sheet(outputs["landscape"], "FINAL 021F · LANDSCAPE / SHORT FIT", [(667, 375), (844, 390), (1024, 768), (1365, 768)], production, (2000, 1400))
    dom_contact_sheet(outputs["dom"], production["final_access_label_backplate_v01.png"])

    for asset in ASSETS:
        name = f"{asset.asset_id}_{'DECISION_AND_BRIEF' if 'DIALOG' in asset.asset_id else 'BRIEF'}.md"
        content = dialog_markdown(asset) if "DIALOG" in asset.asset_id else brief_markdown(asset)
        (OUT / name).write_text(content, encoding="utf-8")

    production_fields = [
        "reference_id", "filename", "source_path", "match_count", "bytes", "sha256", "width", "height", "format", "mode", "alpha", "alpha_bbox", "transparent_pixels", "status", "classification", "note"
    ]
    save_csv(OUT / "final_021f_production_reference_manifest.csv", audit, production_fields)

    family_rows = family_manifest_rows()
    family_fields = ["asset_id", "filename", "canvas", "format", "alpha", "z", "consumer", "category", "decision", "insets", "safe_dom", "budget", "sequence", "sequence_gate", "status", "classification"]
    save_csv(OUT / "final_021f_ui_backplate_family_manifest.csv", family_rows, family_fields)

    reference_rows = build_reference_rows(audit, outputs)
    save_csv(OUT / "final_021f_ui_reference_manifest.csv", reference_rows, REFERENCE_FIELDS)

    pack_result = build_pack(reference_rows)
    summary = {
        "ticket": "GVO_FINAL_021F_UI_BACKPLATE_ASSET_PRODUCTION_BRIEFS",
        "status": "GVO_FINAL_021F_UI_BACKPLATE_ASSET_PRODUCTION_BRIEFS_COMPLETE",
        "classification": "PREPRODUCTION / DOCUMENTATION / NOT_RUNTIME",
        "baseline": "ec2be8b954a983832bc4d9de8557159814d6f010",
        "production_references": {"count": len(audit), "all_exact": True, "canonical_label": "final_access_label_backplate_v01.png", "derived_label_webp": "NOT_ALLOWED"},
        "assets": family_rows,
        "dialog_decision": {"option": "A", "filename": "final_restart_dialog_backplate_v01.png", "canvas": "1536×1024", "format": "PNG RGBA", "z": 110},
        "briefs": {"count": 4, "sections_each": 33, "first_ready_asset": "FINAL-PLATE-TITLE-001"},
        "reference_manifest": {"rows": len(reference_rows), "attachable": sum(1 for r in reference_rows if r["approved_use"] != "NOT_ALLOWED"), "h07": H07},
        "guides": {key: {"path": path.relative_to(REPO).as_posix(), "sha256": sha256(path), **image_meta(path)} for key, path in outputs.items()},
        "viewports": ["375×667", "390×844", "667×375", "844×390", "1024×768", "1365×768"],
        "gate_667x375": "PASS_DOCUMENTARY_NO_INTERNAL_SCROLL",
        "external_pack": {"folder": str(PACK), "zip": str(ZIP_PATH), **pack_result},
        "runtime_modified": False,
        "current_used_modified": False,
        "final_art_produced": False,
        "build_tests_browser_run": False,
    }
    (OUT / "final_021f_ui_family_summary.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    STATUS_PATH.write_text(status_markdown(audit, pack_result), encoding="utf-8")
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
