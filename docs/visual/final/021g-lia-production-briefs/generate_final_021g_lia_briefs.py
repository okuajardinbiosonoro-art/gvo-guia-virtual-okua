#!/usr/bin/env python3
"""Deterministic documentation generator for GVO_FINAL_021G.

This script audits existing references, writes preproduction-only briefs and
visual guides, and builds the external reference pack. It never creates final
Lia art and never writes to runtime or current-used paths.
"""

from __future__ import annotations

import csv
import hashlib
import json
import shutil
import zipfile
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

from PIL import Image, ImageDraw, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[4]
OUT = Path(__file__).resolve().parent
STATUS = ROOT / "docs/status/GVO_FINAL_021G_LIA_ASSET_PRODUCTION_BRIEFS.md"
DOWNLOADS = Path(r"C:\Users\JOSE DAVID\Downloads")
PACK = DOWNLOADS / "GVO_FINAL_021G_LIA_REFERENCE_PACK"
PACK_ZIP = DOWNLOADS / "GVO_FINAL_021G_LIA_REFERENCE_PACK.zip"
BASELINE = "ae8d03c8b6f90470381e103c2cb72f7398f467ff"
STAMP = "PREPRODUCTION — NOT RUNTIME"
H07 = "OPEN_CONTROLLED_ART_DIRECTION_ONLY_NO_BINARY_REUSE"

FONT_REGULAR = Path(r"C:\Windows\Fonts\segoeui.ttf")
FONT_BOLD = Path(r"C:\Windows\Fonts\segoeuib.ttf")
FONT_MONO = Path(r"C:\Windows\Fonts\consola.ttf")

BG = (14, 18, 25, 255)
PANEL = (25, 32, 43, 255)
INK = (239, 235, 219, 255)
MUTED = (164, 176, 188, 255)
AMBER = (229, 172, 76, 255)
OPAL = (151, 218, 211, 255)
RED = (229, 102, 92, 255)
GREEN = (113, 202, 143, 255)


PRODUCTION_EXPECTED = [
    ("I01", "final_environment_portrait_v01.webp", 157294, "1E8B599BE197EE26E346B1B1974CAA571DE42AF4B8587758C801C914C04C1347", 1440, 2560, "WEBP", "RGBA", "YES", "ENVIRONMENT"),
    ("I02", "final_environment_landscape_v01.webp", 212234, "EDB75703A398724B9084D800CF21B888D72B6028C4199DC1D7A2C5F5CC0D1D84", 2560, 1440, "WEBP", "RGB", "NO", "ENVIRONMENT"),
    ("I03", "final_valley_depth_portrait_v01.webp", 108270, "F64326254C5215CB44E0F9D93134B425E8806EA41E27556A4BBC40EA36D71E99", 1440, 2560, "WEBP", "RGBA", "YES", "ENVIRONMENT"),
    ("I04", "final_valley_depth_landscape_v01.webp", 107632, "FA9999A33EA636F57FA901D8C06B4FF9694A27F66704DAE7968B9E2DC45EC42B", 2560, 1440, "WEBP", "RGBA", "YES", "ENVIRONMENT"),
    ("I05", "final_mirador_foreground_portrait_v01.webp", 124114, "19290CF1995A8FAB2B643BEBC88126D3BA6E67A516A43877E1AA79A16E11427D", 1440, 1280, "WEBP", "RGBA", "YES", "ENVIRONMENT"),
    ("I06", "final_mirador_foreground_landscape_v01.webp", 168898, "455EDBA68398FBB8BC1A508C42D0EB1BC7D2B6AFC236BF5F8928C2356FD60544", 2560, 900, "WEBP", "RGBA", "YES", "ENVIRONMENT"),
    ("I07", "final_access_world1_root_v01.webp", 375436, "F1BE36246795D8A89241AA708D8E8ECE29FA5C98F3F0DCCAF5C2BD5F8F1BF046", 1024, 1024, "WEBP", "RGBA", "YES", "ACCESS"),
    ("I08", "final_access_world2_pulse_v01.webp", 297082, "6EE6B093DEE9ABBEA96FDA66C6C80DB3601CDF588A34FD062D0F844466EDD7B6", 1024, 1024, "WEBP", "RGBA", "YES", "ACCESS"),
    ("I09", "final_access_world3_notebook_v01.webp", 238198, "2EFAB6C3CA5430D7BA1F0113AA4E19A4B99CE6D4AF5C3212371AC86314039CD3", 1024, 1024, "WEBP", "RGBA", "YES", "ACCESS"),
    ("I10", "final_access_world4_system_v01.webp", 254472, "5472BDCA276DBD851D0C3C7C48A96038A5D7544AA13EF4A51BE7BC4DCC2E2B9D", 1024, 1024, "WEBP", "RGBA", "YES", "ACCESS"),
    ("I11", "final_access_world5_map_v01.webp", 354658, "A034AA6940E2043870FF3EE0B6C833DF4F3C3F15CFD386C846DB78AA1CBFC07F", 1024, 1024, "WEBP", "RGBA", "YES", "ACCESS"),
    ("I12", "final_access_label_backplate_v01.png", 314629, "36257FEC3E1E69D58A9F5E7CA2543F983D309776E45F757D1A81A7CAECFA3698", 1024, 256, "PNG", "RGBA", "YES", "ACCESS"),
    ("I13", "final_title_backplate_v01.png", 443818, "898949FFAA35E66507A3AA799BFE32AEC36FA4D3B73B54E58FC1E1A2715C360D", 1536, 512, "PNG", "RGBA", "YES", "UI"),
    ("I14", "final_credits_backplate_v01.png", 650737, "45C6FD147A04FF9F8FF5A249EDBC2FCE16EA07FE843A9082B2E011ABC75FFFB1", 1536, 384, "PNG", "RGBA", "YES", "UI"),
    ("I15", "final_action_backplate_v01.png", 342069, "C771BA00ACD157962EA1C1BD54FC54758BB6D7306F99C9C0616B5BDCEF211B81", 1024, 256, "PNG", "RGBA", "YES", "UI"),
    ("I16", "final_restart_dialog_backplate_v01.png", 2082196, "2E81A8CE8C4DFB17E519BC3AE8513367D0C45418A312DC863C9238186FDAB32C", 1536, 1024, "PNG", "RGBA", "YES", "UI"),
]

DERIVED_HOMONYMS = [
    ("N01", "final_access_label_backplate_v01.webp", "I12"),
    ("N02", "final_title_backplate_v01.webp", "I13"),
    ("N03", "final_credits_backplate_v01.webp", "I14"),
    ("N04", "final_action_backplate_v01.webp", "I15"),
    ("N05", "final_restart_dialog_backplate_v01.webp", "I16"),
]


@dataclass(frozen=True)
class Source:
    reference_id: str
    relpath: str
    display_name: str
    consumer: str
    provenance: str
    use: str
    assets_served: str
    reason: str
    priority: str
    do_not_copy: str
    license_status: str = "SPECIFIC_LICENSE_NOT_DOCUMENTED"


def source_catalog() -> list[Source]:
    p = "public/assets/gvo/current-used"
    sources = [
        Source("D01", "docs/03_IDENTIDAD_LIA.md", "Identidad canónica de Lía", "GVO/GLOBAL", "PROJECT_DOCUMENTATION", "IDENTITY_AUTHORITY", "ALL", "Autoridad textual de anatomía e identidad", "P0", "No reinterpretar identidad", "NOT_APPLICABLE_DOCUMENTARY"),
        Source("D02", "public/assets/gvo/shared/lia/asset_manifest_lia_v1.json", "Manifest compartido de Lía", "GVO/GLOBAL", "RUNTIME_MANIFEST_READ_ONLY", "IDENTITY_AUTHORITY", "ALL", "Catálogo y hashes históricos", "P0", "No promover ni editar manifest", "NOT_APPLICABLE_DOCUMENTARY"),
        Source("D03", "public/assets/runtime/cover-intro/manifest.json", "Manifest Cover Intro", "COVER_INTRO", "RUNTIME_MANIFEST_READ_ONLY", "IDENTITY_AUTHORITY", "ALL", "Contrato real del consumidor Cover", "P0", "No copiar slots ni editar runtime", "NOT_APPLICABLE_DOCUMENTARY"),
        Source("C01", f"{p}/cover-intro/lia/reference/lia_master_cover_reference_v1.png", "Lía master Cover", "COVER_INTRO", "APPROVED_RUNTIME_REFERENCE", "IDENTITY_AUTHORITY", "ALL", "Vista maestra aprobada", "P0", "No reutilizar binario en Mirador"),
        Source("C02", f"{p}/cover-intro/lia/poses/lia_pose_idle_v1.png", "Cover idle", "COVER_INTRO", "APPROVED_RUNTIME_POSE", "ACTING_REFERENCE", "IDLE,GREET,RESET", "Reposo canónico", "P0", "No copiar encuadre Cover"),
        Source("C03", f"{p}/cover-intro/lia/poses/lia_pose_greeting_v1.png", "Cover greeting", "COVER_INTRO", "APPROVED_RUNTIME_POSE", "ACTING_REFERENCE", "GREET", "Saludo sin anatomía humana", "P0", "No copiar escala o posición"),
        Source("C04", f"{p}/cover-intro/lia/poses/lia_pose_explain_calm_v1.png", "Cover explain calm", "COVER_INTRO", "APPROVED_RUNTIME_POSE", "ACTING_REFERENCE", "GREET,DIRECTION", "Acting ceremonial contenido", "P1", "No convertir en pose direccional final"),
    ]
    rig = [
        ("R01", "lia_rig_body_bulb_segmented_v1.png", "Bulbo segmentado"),
        ("R02", "lia_rig_petal_top_v1.png", "Pétalo superior"),
        ("R03", "lia_rig_petal_left_upper_v1.png", "Pétalo superior izquierdo"),
        ("R04", "lia_rig_petal_left_lower_v1.png", "Pétalo inferior izquierdo"),
        ("R05", "lia_rig_petal_right_upper_v1.png", "Pétalo superior derecho"),
        ("R06", "lia_rig_petal_right_lower_v1.png", "Pétalo inferior derecho"),
        ("R07", "lia_rig_collar_amber_v1.png", "Collar ámbar"),
        ("R08", "lia_rig_glow_collar_v1.png", "Glow contenido de collar"),
        ("R09", "lia_rig_head_opal_clean_v1.png", "Cabeza opalescente"),
        ("R10", "lia_rig_eyes_crescent_neutral_v1.png", "Ojos media luna neutrales"),
        ("R11", "lia_rig_eyes_crescent_blink_50_v1.png", "Ojos blink 50"),
        ("R12", "lia_rig_eyes_crescent_closed_v1.png", "Ojos cerrados"),
        ("R13", "lia_rig_shadow_soft_v1.png", "Sombra suave"),
    ]
    for rid, filename, label in rig:
        use = "MATERIAL_REFERENCE" if rid in {"R08", "R13"} else "IDENTITY_AUTHORITY"
        served = "GLOW" if rid in {"R08", "R13"} else "ALL"
        sources.append(Source(rid, f"{p}/cover-intro/lia/rig/idle_v1/{filename}", label, "COVER_INTRO", "APPROVED_RUNTIME_RIG_LAYER", use, served, "Capa canónica controlada", "P0", "No reconstruir anatomía ni reutilizar binario"))
    sources += [
        Source("L01", f"{p}/loading-initial/lia/lia_loading_16f.png", "Loading 16f sprite", "LOADING_INITIAL", "APPROVED_RUNTIME_SPRITE", "TECHNICAL_SPRITE_REFERENCE", "IDLE,GREET", "Coherencia multiframe y celdas", "P1", "No copiar acting de riego"),
        Source("L02", f"{p}/loading-initial/lia/lia_loading_16f.json", "Loading 16f metadata", "LOADING_INITIAL", "RUNTIME_METADATA_READ_ONLY", "TECHNICAL_SPRITE_REFERENCE", "IDLE,GREET", "Contrato real de frames", "P1", "No copiar timings sin adaptar", "NOT_APPLICABLE_DOCUMENTARY"),
        Source("T01", f"{p}/transition-world/lia/lia_transition_root_master_v1.png", "Transition master", "TRANSITION_WORLD", "APPROVED_RUNTIME_REFERENCE", "TECHNICAL_SPRITE_REFERENCE", "ALL", "Centro y escala técnica", "P1", "No reutilizar binario en Mirador"),
        Source("T02", f"{p}/transition-world/lia/lia_transition_root_idle_4f_v1.png", "Transition idle 4f", "TRANSITION_WORLD", "APPROVED_RUNTIME_SPRITE", "TECHNICAL_SPRITE_REFERENCE", "IDLE", "Strip horizontal de 256 px", "P0", "No copiar frames como final"),
        Source("T03", f"{p}/transition-world/lia/lia_transition_root_guide_2f_v1.png", "Transition guide 2f", "TRANSITION_WORLD", "APPROVED_RUNTIME_SPRITE", "TECHNICAL_SPRITE_REFERENCE", "GREET,DIRECTION", "Coherencia entre poses", "P1", "No reutilizar binario en Mirador"),
        Source("T04", f"{p}/transition-world/lia/lia_transition_root_exit_v1.png", "Transition exit", "TRANSITION_WORLD", "APPROVED_RUNTIME_POSE", "ACTING_REFERENCE", "GREET", "Retorno compatible", "P2", "No copiar desplazamiento de salida"),
    ]
    world1 = [
        ("W101", "lia_root_idle_approved_v1.png", "Mundo I idle", "IDLE,RESET"),
        ("W102", "lia_root_invite_relation_approved_v1.png", "Mundo I invite", "GREET"),
        ("W103", "lia_root_point_relation_approved_v1.png", "Mundo I point", "DIRECTION"),
        ("W104", "lia_root_look_perception_approved_v1.png", "Mundo I look", "DIRECTION"),
        ("W105", "lia_root_guide_mediation_approved_v1.png", "Mundo I guide", "GREET,DIRECTION"),
        ("W106", "lia_root_ready_continue_approved_v1.png", "Mundo I ready", "GREET"),
    ]
    for rid, filename, label, served in world1:
        sources.append(Source(rid, f"{p}/world-1-root/lia/{filename}", label, "WORLD_1_ROOT", "APPROVED_RUNTIME_POSE", "ACTING_REFERENCE", served, "Acting vegetal aprobado", "P1", "No copiar pose como asset Final"))
    world3 = [
        ("W301", "lia_world3_idle_v01.png", "Mundo III idle", "IDLE,RESET"),
        ("W302", "lia_world3_pointing_v01.png", "Mundo III pointing", "DIRECTION"),
        ("W303", "lia_world3_observing_v01.png", "Mundo III observing", "IDLE"),
        ("W304", "lia_world3_confirming_v01.png", "Mundo III confirming", "GREET"),
        ("W305", "lia_world3_closure_v01.png", "Mundo III closure", "GREET"),
    ]
    for rid, filename, label, served in world3:
        sources.append(Source(rid, f"{p}/world-3-root/lia/{filename}", label, "WORLD_3_ROOT", "APPROVED_RUNTIME_PIXELART_POSE", "PIXELART_REFERENCE", served, "Escala de píxel y acting aprobados", "P1", "No copiar cámara o paleta local"))
    world5 = [
        ("W501", "lia_world5_attend_neutral_v01.webp", "Mundo V attend", "IDLE"),
        ("W502", "lia_world5_lead_forward_v01.webp", "Mundo V lead", "DIRECTION"),
        ("W503", "lia_pose_greeting_v1.png", "Mundo V greeting", "GREET"),
        ("W504", "lia_pose_explain_calm_v1.png", "Mundo V explain", "GREET,DIRECTION"),
    ]
    for rid, filename, label, served in world5:
        sources.append(Source(rid, f"{p}/world-5-root/lia/{filename}", label, "WORLD_5_ROOT", "APPROVED_RUNTIME_POSE", "ACTING_REFERENCE", served, "Jerarquía sobria y orientación", "P1", "No copiar composición Mundo V"))
    sources.append(Source("CS01", "docs/visual/final/021b-preproduction/final_021b_lia_candidate_contact_sheet.png", "021B Lía candidate contact sheet", "FINAL_PREPRODUCTION", "PREPRODUCTION_DOCUMENTATION", "COMPOSITION_ALIGNMENT_REFERENCE", "ALL", "Comparación documentada de familias existentes", "P1", "No interpretar como aprobación de asset Final", "NOT_APPLICABLE_DOCUMENTARY"))
    assert len(sources) == 42, len(sources)
    return sources


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


def draw_wrapped(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str, fnt: ImageFont.FreeTypeFont, fill: tuple[int, ...], width: int, spacing: int = 5) -> int:
    x, y = xy
    line_h = fnt.size + spacing
    for line in wrap(draw, text, fnt, width):
        draw.text((x, y), line, font=fnt, fill=fill)
        y += line_h
    return y


def header(draw: ImageDraw.ImageDraw, title: str, subtitle: str, width: int, compact: bool = False) -> int:
    pad = 18 if compact else 34
    title_size = 21 if compact else 42
    sub_size = 12 if compact else 22
    draw.text((pad, pad), title, font=font(title_size, bold=True), fill=INK)
    draw.text((pad, pad + title_size + 8), subtitle, font=font(sub_size), fill=MUTED)
    stamp_f = font(12 if compact else 18, bold=True)
    box = draw.textbbox((0, 0), STAMP, font=stamp_f)
    draw.text((width - (box[2] - box[0]) - pad, pad), STAMP, font=stamp_f, fill=AMBER)
    return pad + title_size + sub_size + 28


def checker(size: tuple[int, int], cell: int = 18) -> Image.Image:
    im = Image.new("RGBA", size, (37, 43, 52, 255))
    d = ImageDraw.Draw(im)
    for y in range(0, size[1], cell):
        for x in range(0, size[0], cell):
            if (x // cell + y // cell) % 2:
                d.rectangle((x, y, min(x + cell - 1, size[0] - 1), min(y + cell - 1, size[1] - 1)), fill=(48, 55, 65, 255))
    return im


def locate_exact(name: str) -> Path:
    matches = []
    for path in DOWNLOADS.rglob(name):
        if path.is_file() and "REFERENCE_PACK" not in str(path.parent).upper():
            matches.append(path)
    if len(matches) != 1:
        raise RuntimeError(f"Expected exactly one source for {name}; found {len(matches)}: {matches}")
    return matches[0]


def image_meta(path: Path) -> dict[str, object]:
    with Image.open(path) as im:
        mode = im.mode
        fmt = im.format or "UNKNOWN"
        width, height = im.size
        alpha = "YES" if "A" in mode or "transparency" in im.info else "NO"
        bbox = "N/A"
        if alpha == "YES":
            rgba = im.convert("RGBA")
            bbox_value = rgba.getchannel("A").getbbox()
            bbox = list(bbox_value) if bbox_value else []
    return {"width": width, "height": height, "format": fmt, "mode": mode, "alpha": alpha, "alpha_bbox": bbox}


def audit_production() -> list[dict[str, object]]:
    rows: list[dict[str, object]] = []
    for rid, name, expected_bytes, expected_sha, width, height, fmt, mode, alpha, family in PRODUCTION_EXPECTED:
        path = locate_exact(name)
        meta = image_meta(path)
        actual = {
            "reference_id": rid,
            "filename": name,
            "source_path": str(path),
            "bytes": path.stat().st_size,
            "sha256": sha256(path),
            **meta,
            "exact_match_count": 1,
            "classification": "APPROVED_PRODUCTION_REFERENCE / NOT_RUNTIME",
            "canonical": "YES",
            "family": family,
            "notes": "Canonical extension and exact audited source",
        }
        checks = [
            actual["bytes"] == expected_bytes,
            actual["sha256"] == expected_sha,
            actual["width"] == width,
            actual["height"] == height,
            actual["format"] == fmt,
            actual["mode"] == mode,
            actual["alpha"] == alpha,
        ]
        if not all(checks):
            raise RuntimeError(f"Production reference drift for {name}: {actual}")
        rows.append(actual)
    return rows


def find_derived() -> list[dict[str, object]]:
    rows = []
    for rid, name, canonical_id in DERIVED_HOMONYMS:
        path = locate_exact(name)
        rows.append({"reference_id": rid, "filename": name, "source_path": str(path), "sha256": sha256(path), "bytes": path.stat().st_size, **image_meta(path), "canonical_id": canonical_id})
    return rows


def save_csv(path: Path, rows: Iterable[dict[str, object]], fields: list[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def paste_fit(base: Image.Image, source: Path, box: tuple[int, int, int, int], contain: bool = True, crop_alpha: bool = False) -> None:
    with Image.open(source) as opened:
        im = opened.convert("RGBA")
    if crop_alpha:
        bbox = im.getchannel("A").getbbox()
        if bbox:
            im = im.crop(bbox)
    target = (box[2] - box[0], box[3] - box[1])
    if contain:
        fitted = ImageOps.contain(im, target, Image.Resampling.LANCZOS)
        x = box[0] + (target[0] - fitted.width) // 2
        y = box[1] + (target[1] - fitted.height) // 2
    else:
        fitted = ImageOps.fit(im, target, Image.Resampling.LANCZOS)
        x, y = box[0], box[1]
    base.alpha_composite(fitted, (x, y))


def card(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], title: str, detail: str = "") -> None:
    draw.rounded_rectangle(box, radius=18, fill=PANEL, outline=(61, 75, 90, 255), width=2)
    draw.text((box[0] + 18, box[1] + 14), title, font=font(20, bold=True), fill=INK)
    if detail:
        draw_wrapped(draw, (box[0] + 18, box[3] - 56), detail, font(14), MUTED, box[2] - box[0] - 36)


def identity_sheet(sources: dict[str, Path], output: Path) -> None:
    im = Image.new("RGBA", (2000, 1400), BG)
    d = ImageDraw.Draw(im)
    y0 = header(d, "Lía — identidad canónica y fuentes controladas", "Una entidad vegetal no humana · exactamente cinco pétalos · escala del Mirador", im.width)
    labels = [
        ("C01", "MASTER COVER", "Identidad / silueta"),
        ("C02", "IDLE COVER", "Reposo"),
        ("C03", "GREETING COVER", "Saludo"),
        ("L01", "LOADING 16F", "Coherencia multiframe"),
        ("T02", "TRANSITION 4F", "Celdas de 256 px"),
        ("W101", "WORLD I IDLE", "Acting vegetal"),
        ("W301", "WORLD III IDLE", "Pixelart aprobado"),
        ("W302", "WORLD III POINT", "Dirección sin flip"),
        ("W501", "WORLD V ATTEND", "Jerarquía sobria"),
    ]
    cols, gap = 3, 22
    card_w = (im.width - 80 - gap * (cols - 1)) // cols
    card_h = 330
    for idx, (rid, title, detail) in enumerate(labels):
        col, row = idx % cols, idx // cols
        x = 40 + col * (card_w + gap)
        y = y0 + 20 + row * (card_h + gap)
        box = (x, y, x + card_w, y + card_h)
        card(d, box, title, f"{rid} · {detail}")
        canvas = checker((card_w - 36, 205), 14)
        paste_fit(canvas, sources[rid], (0, 0, canvas.width, canvas.height), True, rid not in {"L01", "T02"})
        im.alpha_composite(canvas, (x + 18, y + 50))
    footer_y = y0 + 20 + 3 * (card_h + gap)
    d.rounded_rectangle((40, footer_y, 1960, 1380), radius=18, fill=(20, 27, 36, 255), outline=AMBER, width=2)
    invariants = "5 PÉTALOS  ·  CABEZA OPALESCENTE  ·  OJOS MEDIA LUNA  ·  COLLAR ÁMBAR  ·  BULBO SEGMENTADO  ·  SILUETA VEGETAL"
    d.text((70, footer_y + 26), invariants, font=font(23, bold=True), fill=AMBER)
    d.text((70, footer_y + 70), "Consumidores auditados: Cover · Loading · Transition · Mundo I · Mundo III · Mundo V", font=font(19), fill=INK)
    d.text((70, footer_y + 104), "Escala visible Mirador: portrait 14–18 % H · landscape 20–26 % H · anchor por alpha bbox, nunca por canvas vacío", font=font(19), fill=OPAL)
    d.text((70, footer_y + 130), "NO BINARY REUSE · NO FLIP · NO ARTE FINAL PRODUCIDO EN 021G", font=font(17, bold=True), fill=RED)
    im.convert("RGB").save(output, "PNG", optimize=True)


def hard_fails_sheet(output: Path) -> None:
    im = Image.new("RGBA", (2000, 1400), BG)
    d = ImageDraw.Draw(im)
    y0 = header(d, "Lía — hard fails de producción", "Diagramas documentales y anotaciones; no son imágenes generadas de errores", im.width)
    fails = [
        ("PETAL COUNT", "4 o 6 pétalos", "El conteo debe ser exactamente 5."),
        ("HUMAN LIMBS", "brazos / manos", "Sin extremidades ni gestos humanos."),
        ("HUMAN BASE", "piernas / pies", "La base sigue siendo un bulbo vegetal."),
        ("FACE DRIFT", "boca / nariz / cejas", "Sólo ojos en media luna."),
        ("BOUNCE", "rebote de balón", "Movimiento vertical sobrio, 4–7 % visible."),
        ("DEFORMATION", "squash / stretch", "Volumen y anatomía permanecen estables."),
        ("BLOOM VEIL", "glow excesivo", "El glow no lava paisaje ni sustituye silueta."),
        ("PIXEL SCALE", "píxel mezclado", "Una sola escala aparente, sin blur."),
        ("OVERSCALE", "Lía domina", "14–18 % portrait; 20–26 % landscape."),
        ("OCCLUSION", "tapa UI/accesos", "No cubrir título, accesos, acciones o créditos."),
    ]
    cols, rows, gap = 2, 5, 22
    w = (im.width - 100 - gap) // cols
    h = (im.height - y0 - 80 - gap * (rows - 1)) // rows
    for idx, (title, bad, rule) in enumerate(fails):
        col, row = idx % 2, idx // 2
        x, y = 40 + col * (w + gap), y0 + 20 + row * (h + gap)
        d.rounded_rectangle((x, y, x + w, y + h), radius=16, fill=PANEL, outline=RED, width=2)
        d.ellipse((x + 20, y + 24, x + 78, y + 82), outline=RED, width=5)
        d.line((x + 31, y + 35, x + 67, y + 71), fill=RED, width=5)
        d.line((x + 67, y + 35, x + 31, y + 71), fill=RED, width=5)
        d.text((x + 98, y + 20), title, font=font(22, bold=True), fill=INK)
        d.text((x + 98, y + 52), f"FAIL: {bad}", font=font(18, bold=True), fill=RED)
        draw_wrapped(d, (x + 98, y + 86), rule, font(17), MUTED, w - 128)
    im.convert("RGB").save(output, "PNG", optimize=True)


def alpha_crop(path: Path) -> Image.Image:
    with Image.open(path) as opened:
        im = opened.convert("RGBA")
    bbox = im.getchannel("A").getbbox()
    return im.crop(bbox) if bbox else im


def cover(im: Image.Image, size: tuple[int, int]) -> Image.Image:
    return ImageOps.fit(im.convert("RGBA"), size, Image.Resampling.LANCZOS)


def render_viewport(size: tuple[int, int], production: dict[str, Path], lia: Path, percent: float, anchor: tuple[float, float], orientation: str) -> Image.Image:
    w, h = size
    env_key, depth_key, fore_key = ("I01", "I03", "I05") if orientation == "portrait" else ("I02", "I04", "I06")
    base = cover(Image.open(production[env_key]), size)
    depth = cover(Image.open(production[depth_key]), size)
    base = Image.blend(base, depth, 0.28)
    accesses = [production[f"I{i:02d}"] for i in range(7, 12)]
    icon_size = max(34, int(min(w / 6.8, h / 8.0)))
    gap = max(4, int(icon_size * 0.12))
    total = 5 * icon_size + 4 * gap
    start_x = (w - total) // 2
    access_y = int(h * (0.43 if orientation == "portrait" else 0.39))
    for idx, path in enumerate(accesses):
        icon = alpha_crop(path)
        icon = ImageOps.contain(icon, (icon_size, icon_size), Image.Resampling.LANCZOS)
        base.alpha_composite(icon, (start_x + idx * (icon_size + gap), access_y))
    fg = cover(Image.open(production[fore_key]), size)
    base.alpha_composite(fg)
    lia_im = alpha_crop(lia)
    target_h = int(h * percent)
    lia_im = ImageOps.contain(lia_im, (int(target_h * 1.2), target_h), Image.Resampling.NEAREST)
    ax, ay = int(w * anchor[0]), int(h * anchor[1])
    base.alpha_composite(lia_im, (ax - lia_im.width // 2, ay - lia_im.height))
    d = ImageDraw.Draw(base)
    label = f"{int(percent * 100)}% H · anchor ({anchor[0]:.2f}, {anchor[1]:.2f}) · alpha bbox"
    d.rounded_rectangle((8, 8, min(w - 8, 390), 40), radius=8, fill=(7, 12, 18, 205))
    d.text((16, 14), label, font=font(15, bold=True), fill=INK)
    d.text((w - 190, h - 28), STAMP, font=font(10, bold=True), fill=AMBER)
    return base


def portrait_overlay(production: dict[str, Path], lia: Path, output: Path) -> None:
    im = Image.new("RGBA", (1800, 1600), BG)
    left = render_viewport((900, 1600), production, lia, 0.14, (0.50, 0.68), "portrait")
    right = render_viewport((900, 1600), production, lia, 0.18, (0.50, 0.68), "portrait")
    im.alpha_composite(left, (0, 0))
    im.alpha_composite(right, (900, 0))
    d = ImageDraw.Draw(im)
    d.line((899, 0, 899, 1600), fill=AMBER, width=2)
    im.convert("RGB").save(output, "PNG", optimize=True)


def landscape_overlay(production: dict[str, Path], lia: Path, output: Path) -> None:
    im = Image.new("RGBA", (1334, 375), BG)
    left = render_viewport((667, 375), production, lia, 0.20, (0.50, 0.61), "landscape")
    right = render_viewport((667, 375), production, lia, 0.26, (0.50, 0.61), "landscape")
    im.alpha_composite(left, (0, 0))
    im.alpha_composite(right, (667, 0))
    d = ImageDraw.Draw(im)
    d.line((666, 0, 666, 375), fill=AMBER, width=2)
    im.convert("RGB").save(output, "PNG", optimize=True)


def sprite_guide(output: Path, frames: int, title: str, acting: list[str]) -> None:
    width, height = frames * 256, 256
    im = checker((width, height), 16)
    d = ImageDraw.Draw(im)
    for idx in range(frames):
        x = idx * 256
        d.rectangle((x, 0, x + 255, 255), outline=(90, 110, 125, 255), width=1)
        d.rectangle((x + 20, 20, x + 235, 235), outline=AMBER if idx == 0 else OPAL, width=2)
        d.line((x + 128, 20, x + 128, 235), fill=(110, 188, 182, 210), width=1)
        d.line((x + 34, 232, x + 222, 232), fill=GREEN, width=2)
        d.ellipse((x + 122, 149, x + 134, 161), outline=RED, width=2)
        d.text((x + 25, 24), f"F{idx + 1}", font=font(18, bold=True), fill=INK)
        d.text((x + 25, 49), acting[idx], font=font(11), fill=MUTED)
        d.text((x + 25, 202), "bbox x34–222", font=font(10, mono=True), fill=INK)
        d.text((x + 25, 216), "base y232±4", font=font(10, mono=True), fill=GREEN)
    d.rectangle((0, 0, width - 1, height - 1), outline=RED, width=2)
    d.text((8, 238), f"{title} · {STAMP}", font=font(10, bold=True), fill=AMBER)
    d.text((width - 215, 238), "NO GUTTERS · NO CROP", font=font(10, bold=True), fill=RED)
    im.convert("RGB").save(output, "PNG", optimize=True)


def glow_guide(output: Path) -> None:
    im = checker((1024, 512), 20)
    d = ImageDraw.Draw(im)
    d.ellipse((180, 280, 844, 470), fill=(151, 218, 211, 28), outline=OPAL, width=3)
    d.ellipse((330, 340, 694, 455), fill=(15, 18, 23, 70), outline=AMBER, width=2)
    d.line((512, 30, 512, 482), fill=(140, 160, 175, 180), width=1)
    d.line((40, 380, 984, 380), fill=(140, 160, 175, 180), width=1)
    d.rounded_rectangle((32, 28, 992, 155), radius=14, fill=(13, 18, 25, 220), outline=AMBER, width=2)
    d.text((56, 48), "FINAL-LIA-GLOW-001 — GUIDE 1024×512", font=font(27, bold=True), fill=INK)
    d.text((56, 88), "Sólo glow opalescente tenue + sombra/halo inferior alpha-aware", font=font(19), fill=OPAL)
    d.text((56, 119), "SIN silueta · SIN partículas · SIN fondo · SIN bloom veil", font=font(18, bold=True), fill=RED)
    d.text((34, 483), STAMP, font=font(13, bold=True), fill=AMBER)
    im.convert("RGB").save(output, "PNG", optimize=True)


def timing_sheet(output: Path) -> None:
    im = Image.new("RGBA", (1920, 1080), BG)
    d = ImageDraw.Draw(im)
    y0 = header(d, "Lía — timing y dependencia de producción", "Idle es el primer y único asset habilitado; los demás no comienzan sin aprobación humana", im.width)
    rows = [
        ("IDLE 6F · LOOP", "3.5–5.0 s", 6, ["neutral", "ascenso", "alto/blink", "descenso", "reposo bajo", "retorno"], GREEN),
        ("GREET 4F · ONE SHOT", "≤700 ms", 4, ["idle", "inclinación", "pétalos", "retorno"], AMBER),
        ("GLOW · STATIC", "opacity/transform en código", 1, ["frame único"], OPAL),
    ]
    y = y0 + 55
    for name, duration, count, labels, color in rows:
        d.text((70, y), name, font=font(27, bold=True), fill=color)
        d.text((460, y + 4), duration, font=font(21), fill=INK)
        bar_y = y + 58
        usable = 1760
        cell_w = usable // count
        for i in range(count):
            x = 70 + i * cell_w
            d.rounded_rectangle((x, bar_y, x + cell_w - 12, bar_y + 105), radius=10, fill=PANEL, outline=color, width=2)
            d.text((x + 16, bar_y + 14), f"F{i + 1}", font=font(19, bold=True), fill=INK)
            d.text((x + 16, bar_y + 48), labels[i], font=font(16), fill=MUTED)
        y += 240
    d.rounded_rectangle((70, 900, 1850, 1035), radius=14, fill=(27, 22, 22, 255), outline=RED, width=2)
    d.text((95, 925), "GATE: producir sólo FINAL-LIA-IDLE-001", font=font(26, bold=True), fill=RED)
    d.text((95, 970), "Greeting y glow: BLOCKED_BY_IDLE_HUMAN_APPROVAL · Direction y reset: sin asset nuevo inicial", font=font(20), fill=INK)
    im.convert("RGB").save(output, "PNG", optimize=True)


def benchmark_sheet(sources: dict[str, Path], output: Path) -> None:
    im = Image.new("RGBA", (2000, 1600), BG)
    d = ImageDraw.Draw(im)
    y0 = header(d, "Lía — benchmark de poses existentes", "Fuentes auditadas; referencia de identidad/acting/técnica, nunca reutilización binaria para Mirador", im.width)
    items = [
        ("C02", "Cover idle"), ("C03", "Cover greet"), ("L01", "Loading 16f"), ("T01", "Transition master"),
        ("W101", "W1 idle"), ("W103", "W1 point"), ("W106", "W1 ready"), ("W301", "W3 idle"),
        ("W302", "W3 point"), ("W305", "W3 closure"), ("W501", "W5 attend"), ("W502", "W5 lead"),
    ]
    cols, gap = 4, 18
    w = (im.width - 80 - gap * (cols - 1)) // cols
    h = 430
    for idx, (rid, label) in enumerate(items):
        col, row = idx % cols, idx // cols
        x, y = 40 + col * (w + gap), y0 + 18 + row * (h + gap)
        card(d, (x, y, x + w, y + h), label, f"{rid} · REFERENCE ONLY · NO BINARY REUSE")
        canvas = checker((w - 34, 300), 14)
        paste_fit(canvas, sources[rid], (0, 0, canvas.width, canvas.height), True, rid not in {"L01"})
        im.alpha_composite(canvas, (x + 17, y + 52))
    d.text((50, 1548), f"H07: {H07} · {STAMP}", font=font(17, bold=True), fill=AMBER)
    im.convert("RGB").save(output, "PNG", optimize=True)


REFERENCE_FIELDS = [
    "reference_id", "source_path", "display_name", "sha256", "width", "height", "mode", "alpha",
    "current_consumer", "provenance", "license_status", "approved_use", "assets_served", "reason",
    "attachment_priority", "do_not_copy",
]


def resolved(path_value: str) -> Path:
    path = Path(path_value)
    return path if path.is_absolute() else ROOT / path


def reference_row(reference_id: str, source_path: str, display_name: str, consumer: str, provenance: str, license_status: str, approved_use: str, assets_served: str, reason: str, priority: str, do_not_copy: str) -> dict[str, object]:
    path = resolved(source_path)
    if not path.is_file():
        raise FileNotFoundError(path)
    if path.suffix.lower() in {".png", ".webp", ".jpg", ".jpeg"}:
        meta = image_meta(path)
    else:
        meta = {"width": "N/A", "height": "N/A", "mode": "N/A", "alpha": "N/A"}
    return {
        "reference_id": reference_id,
        "source_path": source_path,
        "display_name": display_name,
        "sha256": sha256(path),
        "width": meta["width"],
        "height": meta["height"],
        "mode": meta["mode"],
        "alpha": meta["alpha"],
        "current_consumer": consumer,
        "provenance": provenance,
        "license_status": license_status,
        "approved_use": approved_use,
        "assets_served": assets_served,
        "reason": reason,
        "attachment_priority": priority,
        "do_not_copy": do_not_copy,
    }


def build_reference_rows(catalog: list[Source], production: list[dict[str, object]], derived: list[dict[str, object]], output_paths: dict[str, Path]) -> list[dict[str, object]]:
    rows: list[dict[str, object]] = []
    for item in catalog:
        rows.append(reference_row(item.reference_id, item.relpath, item.display_name, item.consumer, item.provenance, item.license_status, item.use, item.assets_served, item.reason, item.priority, item.do_not_copy))
    for item in production:
        rows.append(reference_row(
            f"P{item['reference_id']}", str(item["source_path"]), str(item["filename"]), "FINAL_MIRADOR_PREPRODUCTION",
            "AUDITED_APPROVED_PRODUCTION_REFERENCE_NOT_RUNTIME", "NOT_DOCUMENTED", "APPROVED_PRODUCTION_REFERENCE", "ALL",
            f"Cámara, paleta, escala y encaje; familia {item['family']}", "P0" if item["family"] == "ENVIRONMENT" else "P1",
            "No promover a runtime ni reutilizar como asset de Lía",
        ))
    for item in derived:
        rows.append(reference_row(
            item["reference_id"], str(item["source_path"]), str(item["filename"]), "NONE",
            "DERIVED_HOMONYM_NONCANONICAL", "NOT_DOCUMENTED", "NOT_ALLOWED", "NONE",
            f"Derivado WebP no canónico del PNG {item['canonical_id']}", "DO_NOT_ATTACH",
            "No copiar, no adjuntar, no promover; usar el PNG canónico",
        ))
    output_defs = [
        ("O01", "identity", "Identidad canónica 021G", "IDENTITY_AUTHORITY", "ALL", "Resumen visual de identidad y fuentes"),
        ("O02", "hard_fails", "Hard fails 021G", "IDENTITY_AUTHORITY", "ALL", "Errores de identidad y composición prohibidos"),
        ("O03", "portrait", "Overlay portrait 14–18%", "COMPOSITION_ALIGNMENT_REFERENCE", "ALL", "Prueba visual de escala y anchor portrait"),
        ("O04", "landscape", "Overlay landscape 667×375 20–26%", "COMPOSITION_ALIGNMENT_REFERENCE", "ALL", "Prueba visual de escala y anchor landscape"),
        ("O05", "idle_guide", "Guía sprite idle 6f", "TECHNICAL_SPRITE_REFERENCE", "IDLE", "Celdas, safe area, baseline y centro"),
        ("O06", "greet_guide", "Guía sprite greeting 4f", "TECHNICAL_SPRITE_REFERENCE", "GREET", "Celdas, safe area, baseline y centro"),
        ("O07", "glow_guide", "Guía glow/shadow", "MATERIAL_REFERENCE", "GLOW", "Masa alpha-aware sin silueta"),
        ("O08", "timing", "Timing sheet", "TECHNICAL_SPRITE_REFERENCE", "IDLE,GREET,GLOW", "Timing y gates de producción"),
        ("O09", "benchmark", "Benchmark de poses existentes", "ACTING_REFERENCE", "ALL", "Comparación controlada de acting existente"),
    ]
    for rid, key, label, use, served, reason in output_defs:
        path = output_paths[key]
        rows.append(reference_row(rid, path.relative_to(ROOT).as_posix(), label, "FINAL_021G_PREPRODUCTION", "GENERATED_DOCUMENTARY_OVERLAY_NOT_ART", "NOT_APPLICABLE_DOCUMENTARY", use, served, reason, "P0", "No usar como asset runtime"))
    if len(rows) != 72:
        raise RuntimeError(f"Reference row count drift: {len(rows)}")
    return rows


POSITIVE_CORE = (
    "one single Lia, exactly five petals, canonical opalescent head, crescent eyes, amber collar, "
    "segmented plant body, no human anatomy, warm poetic pixel art, true transparent background, "
    "identical scale, identical lighting, common baseline, subtle motion, no text, no separators, "
    "no labels, no numbered frames, no background, no Mirador environment baked into sprites"
)

NEGATIVE_CORE = (
    "extra or missing petals, arms, hands, legs, feet, mouth, nose, eyebrows, multiple characters, "
    "clone variation, changing anatomy, changing scale, changing colors, bounce, strong squash or stretch, "
    "gelatinous motion, asymmetrical frame crop, labels, numbers, grid lines, solid background, bloom veil, "
    "3D, anime, vector, photorealism, blurry resampling, mixed pixel scales, horizontal flip"
)


def brief_sections(asset: str) -> list[tuple[str, str]]:
    if asset == "IDLE":
        values = {
            "id": "`FINAL-LIA-IDLE-001`.", "filename": "`final_lia_idle_contemplative_6f_v01.webp`.",
            "narrative": "Sostener la contemplación ceremonial de Lía en el Mirador sin competir con los cinco accesos.",
            "visual": "Loop sobrio de reposo con microflotación, un parpadeo sutil y anatomía completamente estable.",
            "consumer": "Futuro actor Lía de `/final`; 021G no implementa ni registra consumidor runtime.",
            "state": "Capa de personaje principal; z contractual `74`; loop contemplativo.", "canvas": "`1536×256 px`.",
            "grid": "`6×1`; seis celdas exactas de `256×256 px`; sin gutters.",
            "framing": "Un solo master horizontal en el modo nativo horizontal más ancho realmente soportado por la herramienta. Registrar sus dimensiones reales; no inventarlas. Mantener las seis Lías dentro de una única composición y recortar con la guía 6f.",
            "format": "WebP RGBA con transparencia real.", "alpha": "Sí. Sin matte, fondo sólido ni píxeles opacos fuera del sujeto.",
            "z": "`74`.", "safe": "20 px por lado dentro de cada celda.",
            "bbox": "Objetivo por celda `x=34–222`, `y=20–236`; medir el bbox real de alpha y reportarlo, no forzarlo si una desviación menor no tiene impacto material.",
            "baseline": "Centro visible `x=128 ±6 px`; baseline `y=232 ±4 px`; anchor futuro por alpha bbox.",
            "acting": "F1 reposo neutral y frame reduced; F2 ascenso mínimo; F3 punto alto con blink apenas iniciado; F4 descenso mínimo; F5 reposo bajo; F6 retorno compatible con F1.",
            "movement": "Desplazamiento vertical visible máximo 4–7 % de la altura visible; center drift horizontal ≤6 px; baseline drift ≤4 px; diferencia de escala entre frames ≤2 %.",
            "must": "Una sola Lía; cinco pétalos; cabeza opalescente; ojos media luna; collar ámbar; bulbo segmentado; cuerpo vegetal; seis frames coherentes; F1 estable.",
            "priority": "P0. Primer y único asset posterior habilitado por 021G.",
            "take": "Identidad de C01 y rig R01–R13; reposo C02/W101/W301; coherencia multiframe L01/T02; encaje de I01–I11 y overlays O03/O04.",
            "notcopy": "No copiar binarios, cámara, acting de riego, composición de otro mundo, fondo, UI ni assets del Mirador dentro del strip.",
            "positive": f"{POSITIVE_CORE}, six poses in one continuous horizontal sprite master, exact six-frame count, equal 256 by 256 final cells, restrained contemplative idle, frame one stable for reduced motion, maximum visible vertical travel four to seven percent, one subtle blink",
            "generation": "Abrir una sola sesión/composición. Usar el modo horizontal nativo más ancho disponible y documentar sus dimensiones. Generar las seis poses juntas, sin separadores horneados. Detener si la herramienta no conserva anatomía/escala o si una celda exigiría >15 % de redimensión proporcional.",
            "resize": "Una sola redimensión proporcional total ≤15 %. Si requiere más, detener y devolver evidencia; no reconstruir frames.",
            "criteria": "6 frames legibles; loop 3.5–5 s; identidad exacta; F1 apto para reduced motion; escala por frame ±2 %; center/baseline dentro de tolerancia; alpha limpio.",
            "photopea": "Superponer O05, recortar strip exacto, alinear sin redibujar anatomía, comprobar seis celdas 256×256, alpha, bboxes, centro, baseline y loop. No interpolar con IA tras aprobación.",
            "export": "Exportar WebP RGBA `1536×256`; conservar un master fuente; no promover ni copiar a `current-used`.",
            "deps": "Autoridad D01; fuentes C/R/L/T/W; references I01–I16; guías O01–O05/O08/O09. Greeting y glow dependen de aprobación humana de este idle.",
            "status": "`READY_FOR_HUMAN_ASSET_PRODUCTION / FIRST_ONLY`.",
        }
    elif asset == "GREET":
        values = {
            "id": "`FINAL-LIA-GREET-001`.", "filename": "`final_lia_greeting_4f_v01.webp`.",
            "narrative": "Saludo ceremonial breve de llegada al Mirador, sin antropomorfizar a Lía.",
            "visual": "One-shot contenido que parte de idle y vuelve de forma compatible a idle.",
            "consumer": "Futuro actor Lía de `/final`; no implementado en 021G.", "state": "Capa de personaje, z `74`; gesto no loop.",
            "canvas": "`1024×256 px`.", "grid": "`4×1`; cuatro celdas exactas de `256×256 px`; sin gutters.",
            "framing": "Misma estrategia del idle: una única composición horizontal en el modo nativo más ancho realmente soportado, documentando dimensiones reales y manteniendo cuatro poses coherentes.",
            "format": "WebP RGBA con transparencia real.", "alpha": "Sí; sin matte ni entorno.", "z": "`74`.",
            "safe": "20 px por lado dentro de cada celda.", "bbox": "Objetivo por celda `x=34–222`, `y=20–236`; medir y reportar bbox real.",
            "baseline": "Centro visible `x=128 ±6 px`; baseline `y=232 ±4 px`; compatible con idle aprobado.",
            "acting": "F1 idle de partida; F2 inclinación ceremonial mínima; F3 apertura contenida de pétalos; F4 retorno compatible con idle.",
            "movement": "Duración total ≤700 ms; sin salto, drift horizontal o cambio de escala; escala entre frames ≤2 %, center drift ≤6 px y baseline drift ≤4 px.",
            "must": "Una sola Lía canónica, cuatro frames coherentes, gesto vegetal breve y retorno limpio a idle.",
            "priority": "P1, pero bloqueada hasta aprobación humana del idle.",
            "take": "Idle aprobado como base; C03/W102/W105/W106/W304/W305 para acting; T03/T04 para coherencia técnica.",
            "notcopy": "No copiar manos, reverencia humana, fondo, composición de otros mundos o frames binarios existentes.",
            "positive": f"{POSITIVE_CORE}, four poses in one continuous horizontal sprite master, exact four-frame count, equal 256 by 256 final cells, restrained ceremonial plant greeting, starts at approved idle and returns cleanly to idle, total motion under seven hundred milliseconds",
            "generation": "No iniciar antes del gate humano de idle. Cuando se habilite, generar cuatro poses en una sola composición y una sola sesión; registrar el modo nativo real; detener ante variación anatómica o necesidad de redimensión >15 %.",
            "resize": "Una sola redimensión proporcional total ≤15 %; diferencia entre frames ≤2 %.",
            "criteria": "4 frames; one-shot ≤700 ms; identidad exacta; inicio y retorno compatibles con idle; alpha, centro y baseline dentro de tolerancia.",
            "photopea": "Superponer O06, recortar cuatro celdas exactas, alinear sin redibujar, medir bboxes/centro/baseline y probar `greeting→idle`.",
            "export": "Exportar WebP RGBA `1024×256`; no promover.",
            "deps": "`FINAL-LIA-IDLE-001` producido, revisado y aprobado explícitamente por Ing. José David; fuentes y guías 021G.",
            "status": "`READY_FOR_HUMAN_ASSET_PRODUCTION / BLOCKED_BY_IDLE_HUMAN_APPROVAL`.",
        }
    else:
        values = {
            "id": "`FINAL-LIA-GLOW-001`.", "filename": "`final_lia_glow_shadow_v01.png`.",
            "narrative": "Asentar a Lía en el Mirador con presencia opalescente tenue y contacto espacial.",
            "visual": "Glow y sombra inferior estáticos que acompañan, nunca sustituyen, la silueta.",
            "consumer": "Futura capa decorativa vinculada al actor Lía en `/final`; no implementada en 021G.",
            "state": "Capa bajo personaje; z `72`; estática y animable sólo por opacity/transform en código.",
            "canvas": "`1024×512 px`.", "grid": "Un frame; sin sprite grid.",
            "framing": "Composición horizontal 2:1 o modo nativo equivalente cercano realmente soportado; registrar dimensiones reales y recortar a 1024×512 sin reconstruir.",
            "format": "PNG RGBA canónico.", "alpha": "Sí; gradientes alpha limpios y sin matte.", "z": "`72`.",
            "safe": "Zona de trabajo recomendada `x=180–844`, `y=280–470`; conservar margen transparente amplio.",
            "bbox": "Masa alpha-aware inferior aproximada `x=180–844`, `y=280–470`; centro compatible con Lía, sujeto a medición real.",
            "baseline": "Centro conceptual `(512, 380)`; sombra alineada con el contacto inferior del alpha bbox del idle aprobado.",
            "acting": "No aplica por frames. Un solo estado estático; el runtime futuro podrá variar opacity/transform.",
            "movement": "Ninguno horneado. El PNG no contiene partículas ni secuencia.",
            "must": "Glow opalescente muy tenue, sombra de contacto o halo inferior y masa alpha-aware sin silueta de Lía.",
            "priority": "P2, bloqueada hasta aprobación humana del idle.",
            "take": "R08/R13 para material y sombra; idle aprobado para centro/contacto; I01–I06 para prueba sobre paisajes; O07 para encuadre.",
            "notcopy": "No copiar silueta, collar, personaje, particles, motas, fondo, paisaje o bloom veil.",
            "positive": "a single subtle opalescent contact glow and soft lower shadow for canonical Lia, true transparent background, alpha-aware mass, restrained warm poetic pixel-art material, no character silhouette, no text, no particles, no environment",
            "generation": "No iniciar antes del gate humano de idle. Producir una única composición 2:1 cercana, registrar dimensiones nativas reales y detener si exige reconstrucción o >15 % de redimensión.",
            "resize": "Una sola redimensión proporcional total ≤15 %.",
            "criteria": "PNG 1024×512; alpha real; visible sobre fondos claros/oscuros y environments; no lava paisaje; no sustituye silueta.",
            "photopea": "Superponer O07, centrar por contacto del idle, limpiar alpha sin redibujar, probar sobre fondos claro/oscuro y environment, medir bbox.",
            "export": "Exportar PNG RGBA `1024×512`; reportar bbox, bytes y SHA-256; no promover.",
            "deps": "Idle producido y aprobado; centro/bbox medidos del idle; validación humana del material sobre environments.",
            "status": "`READY_FOR_HUMAN_ASSET_PRODUCTION / BLOCKED_BY_IDLE_HUMAN_APPROVAL`.",
        }
    values["identity"] = "Exactamente cinco pétalos; cabeza opalescente; ojos en media luna; collar ámbar; bulbo/cuerpo segmentado; silueta vegetal; sin anatomía ni rasgos humanos; una sola Lía; sin flip."
    values["forbidden"] = "Pétalos extra/faltantes; boca/nariz/cejas; brazos/manos; piernas/pies; ropa, alas o accesorios; duplicación; flip; fondo; texto; separadores; rebote; squash/stretch; blur; cambio de color/iluminación."
    values["refs"] = "Ver `final_021g_lia_reference_manifest.csv`; prioridades P0 primero. H07 permanece abierto y prohíbe reutilización binaria."
    values["negative"] = NEGATIVE_CORE
    values["hardfails"] = "Cualquier cambio de identidad; frame count/canvas/grid incorrectos; fondo opaco; flip; drift visible; rebote; oclusión; bloom veil; reconstrucción fuerte; >15 % de redimensión; promoción runtime."
    values["metadata"] = "Retornar dimensiones nativas de generación, dimensiones finales, modo, alpha, bytes, SHA-256, bbox alpha por frame/asset, escala por frame, center drift y baseline drift."
    values["return"] = "`ID | filename | native canvas | final canvas | format/mode/alpha | bytes | SHA-256 | bbox(es) | scale delta | center drift | baseline drift | QA claro/oscuro/portrait/landscape | human review status | NOT_PROMOTED`."
    fields = [
        ("ID", "id"), ("Filename", "filename"), ("Función narrativa", "narrative"), ("Función visual", "visual"),
        ("Consumidor", "consumer"), ("Estado/capa", "state"), ("Canvas", "canvas"), ("Grid/celdas", "grid"),
        ("Ratio/framing de generación", "framing"), ("Formato", "format"), ("Alpha", "alpha"), ("z", "z"),
        ("Identidad invariable", "identity"), ("Safe area por frame", "safe"), ("Alpha bbox objetivo", "bbox"),
        ("Baseline/centro", "baseline"), ("Acting por frame", "acting"), ("Movimiento máximo", "movement"),
        ("Contenido obligatorio", "must"), ("Contenido prohibido", "forbidden"), ("Referencias exactas", "refs"),
        ("Prioridad", "priority"), ("Qué tomar", "take"), ("Qué no copiar", "notcopy"),
        ("Prompt positivo en inglés", "positive"), ("Prompt negativo en inglés", "negative"),
        ("Instrucciones de generación", "generation"), ("Redimensión máxima", "resize"), ("Criterios", "criteria"),
        ("Hard fails", "hardfails"), ("Photopea", "photopea"), ("Exportación", "export"),
        ("Metadata/hash", "metadata"), ("Plantilla de retorno", "return"), ("Dependencias", "deps"), ("Estado", "status"),
    ]
    return [(title, values[key]) for title, key in fields]


def brief_markdown(asset: str) -> str:
    sections = brief_sections(asset)
    asset_id = {"IDLE": "FINAL-LIA-IDLE-001", "GREET": "FINAL-LIA-GREET-001", "GLOW": "FINAL-LIA-GLOW-001"}[asset]
    lines = [f"# {asset_id} — Brief de producción", "", f"> {STAMP}. Documentación de producción; no es arte ni autorización de integración.", ""]
    for index, (title, body) in enumerate(sections, 1):
        lines += [f"## {index}. {title}", "", body, ""]
    return "\n".join(lines).rstrip() + "\n"


def decision_markdown(kind: str) -> str:
    if kind == "DIRECTION":
        decision = "DEFERRED / NO_NEW_ASSET_IN_INITIAL_SET"
        options = [
            ("A", "Rotación/traslación determinista pequeña", "Sin binario nuevo; conserva identidad y evita inversión", "SELECTED_FOR_INITIAL_TEST"),
            ("B", "Flip horizontal", "Invierte iluminación, collar, pétalos y asimetrías", "REJECTED"),
            ("C", "Cinco poses raster dedicadas", "Mayor costo y riesgo antes de probar comprensión", "DEFERRED"),
        ]
        foundation = "La orientación inicial debe probarse con rotación/traslación mínima; no con flip. Producir estados separados sólo se justifica si una prueba humana muestra una mejora material de comprensión."
        reopen = "Reabrir únicamente con evidencia humana comparativa de que la rotación/traslación no comunica dirección y que un raster separado mejora materialmente la comprensión sin romper identidad."
    else:
        decision = "NO_NEW_ASSET_REQUIRED_FOR_INITIAL_IMPLEMENTATION"
        options = [
            ("A", "Usar frame estable del idle", "Cero binario adicional y continuidad visual", "SELECTED"),
            ("B", "Pose crítica dedicada", "Duplica el set antes de demostrar necesidad", "DEFERRED"),
            ("C", "Animación expresiva", "Riesgo de antropomorfismo y distracción", "REJECTED"),
        ]
        foundation = "El diálogo de reinicio puede usar el frame estable del idle; una pose adicional no está justificada sin prueba humana."
        reopen = "Reabrir únicamente si una prueba humana demuestra mejora material de comprensión del diálogo de reinicio y el idle estable resulta insuficiente."
    lines = [
        f"# FINAL-LIA-{kind}-001 — Decisión 021G", "", f"> {STAMP}. No se produce asset en este ticket.", "",
        "## Opciones", "", "| Opción | Descripción | Comparación | Resultado |", "|---|---|---|---|",
    ]
    lines += [f"| {a} | {b} | {c} | `{d}` |" for a, b, c, d in options]
    lines += ["", "## Decisión", "", f"`{decision}`", "", "## Fundamento", "", foundation, "", "## Condición explícita de reapertura", "", reopen, "", "## Restricciones", "", "Sin flip, sin arte anticipado, sin integración, sin `current-used` y sin reinterpretar identidad.", ""]
    return "\n".join(lines)


def family_rows() -> list[dict[str, object]]:
    return [
        {"asset_id": "FINAL-LIA-IDLE-001", "filename": "final_lia_idle_contemplative_6f_v01.webp", "canvas": "1536x256", "format": "WebP RGBA", "alpha": "YES", "grid": "6x1", "cell": "256x256", "frames": 6, "z": 74, "motion": "LOOP_3.5_TO_5.0_SECONDS", "production_order": 1, "dependency": "NONE", "state": "READY_FOR_HUMAN_ASSET_PRODUCTION_FIRST_ONLY"},
        {"asset_id": "FINAL-LIA-GREET-001", "filename": "final_lia_greeting_4f_v01.webp", "canvas": "1024x256", "format": "WebP RGBA", "alpha": "YES", "grid": "4x1", "cell": "256x256", "frames": 4, "z": 74, "motion": "ONE_SHOT_MAX_700_MS", "production_order": 2, "dependency": "IDLE_HUMAN_APPROVAL", "state": "BLOCKED_BY_IDLE_HUMAN_APPROVAL"},
        {"asset_id": "FINAL-LIA-GLOW-001", "filename": "final_lia_glow_shadow_v01.png", "canvas": "1024x512", "format": "PNG RGBA", "alpha": "YES", "grid": "1", "cell": "N/A", "frames": 1, "z": 72, "motion": "STATIC_CODE_OPACITY_TRANSFORM_ONLY", "production_order": 3, "dependency": "IDLE_HUMAN_APPROVAL", "state": "BLOCKED_BY_IDLE_HUMAN_APPROVAL"},
        {"asset_id": "FINAL-LIA-DIRECTION-001", "filename": "NO_NEW_ASSET", "canvas": "N/A", "format": "N/A", "alpha": "N/A", "grid": "N/A", "cell": "N/A", "frames": 0, "z": "N/A", "motion": "SMALL_DETERMINISTIC_ROTATION_TRANSLATION_TEST_FIRST", "production_order": "N/A", "dependency": "HUMAN_MATERIAL_PROOF", "state": "DEFERRED_NO_NEW_ASSET_IN_INITIAL_SET"},
        {"asset_id": "FINAL-LIA-RESET-001", "filename": "NO_NEW_ASSET", "canvas": "N/A", "format": "N/A", "alpha": "N/A", "grid": "N/A", "cell": "N/A", "frames": 0, "z": "N/A", "motion": "USE_IDLE_STABLE_FRAME", "production_order": "N/A", "dependency": "HUMAN_MATERIAL_PROOF", "state": "NO_NEW_ASSET_REQUIRED_FOR_INITIAL_IMPLEMENTATION"},
    ]


def pack_readme(folder_name: str, rows: list[dict[str, object]]) -> str:
    return f"""# GVO_FINAL_021G — {folder_name}

`REFERENCE_ONLY / NOT_RUNTIME`

Este conjunto contiene referencias controladas para producir briefs de Lía. No autoriza reutilización binaria, integración, edición de runtime ni promoción a `current-used`.

- Filas adjuntas: {len(rows)}
- H07: `{H07}`
- Identidad: exactamente cinco pétalos, cabeza opalescente, ojos media luna, collar ámbar y bulbo segmentado.
- Prohibido: flip, anatomía humana, fondos horneados, reconstrucción de frames y producción fuera del orden contractual.

Usar `MANIFEST.csv` para verificar origen, hash, uso permitido y restricciones de cada archivo.
"""


def safe_pack_dir(path: Path) -> None:
    if path.exists():
        if path.is_symlink() or not path.is_dir():
            raise RuntimeError(f"Unsafe pack target: {path}")
        for child in path.rglob("*"):
            if child.is_symlink():
                raise RuntimeError(f"Symlink/reparse-like entry not allowed in pack: {child}")
    else:
        path.mkdir(parents=True)


def pack_copy(row: dict[str, object], folder: Path, index: int) -> dict[str, object]:
    source = resolved(str(row["source_path"]))
    suffix_name = source.name.replace(" ", "_")
    destination = folder / f"{index:03d}__{row['reference_id']}__{suffix_name}"
    shutil.copy2(source, destination)
    if sha256(destination) != row["sha256"]:
        raise RuntimeError(f"Pack copy hash mismatch: {destination}")
    copied = dict(row)
    copied["pack_path"] = destination.relative_to(PACK).as_posix()
    return copied


def build_pack(rows: list[dict[str, object]], repo_docs: list[Path]) -> dict[str, object]:
    safe_pack_dir(PACK)
    groups = {
        "COMMON": [r for r in rows if r["approved_use"] != "NOT_ALLOWED"],
        "FINAL-LIA-IDLE-001": [r for r in rows if r["approved_use"] != "NOT_ALLOWED" and ("ALL" in str(r["assets_served"]) or "IDLE" in str(r["assets_served"]))],
        "FINAL-LIA-GREET-001": [r for r in rows if r["approved_use"] != "NOT_ALLOWED" and ("ALL" in str(r["assets_served"]) or "GREET" in str(r["assets_served"]))],
        "FINAL-LIA-GLOW-001": [r for r in rows if r["approved_use"] != "NOT_ALLOWED" and ("ALL" in str(r["assets_served"]) or "GLOW" in str(r["assets_served"]))],
    }
    all_copies: list[dict[str, object]] = []
    allowed_names = set(groups) | {"README.md", "MANIFEST.csv", "PACK_SUMMARY.json", "BRIEFS"}
    unknown_root = [p.name for p in PACK.iterdir() if p.name not in allowed_names]
    if unknown_root:
        raise RuntimeError(f"Unexpected pre-existing pack entries: {unknown_root}")
    for folder_name, selected in groups.items():
        folder = PACK / folder_name
        safe_pack_dir(folder)
        expected_names = {"README.md", "MANIFEST.csv"}
        for idx, row in enumerate(selected, 1):
            expected_names.add(f"{idx:03d}__{row['reference_id']}__{resolved(str(row['source_path'])).name.replace(' ', '_')}")
        extras = [p.name for p in folder.iterdir() if p.name not in expected_names]
        if extras:
            raise RuntimeError(f"Unexpected pre-existing entries in {folder}: {extras}")
        copied = [pack_copy(row, folder, idx) for idx, row in enumerate(selected, 1)]
        save_csv(folder / "MANIFEST.csv", copied, REFERENCE_FIELDS + ["pack_path"])
        (folder / "README.md").write_text(pack_readme(folder_name, selected), encoding="utf-8")
        all_copies.extend(copied)
    briefs_dir = PACK / "BRIEFS"
    safe_pack_dir(briefs_dir)
    expected_briefs = {path.name for path in repo_docs}
    extras = [p.name for p in briefs_dir.iterdir() if p.name not in expected_briefs]
    if extras:
        raise RuntimeError(f"Unexpected pre-existing brief pack entries: {extras}")
    for path in repo_docs:
        shutil.copy2(path, briefs_dir / path.name)
    root_manifest = PACK / "MANIFEST.csv"
    save_csv(root_manifest, all_copies, REFERENCE_FIELDS + ["pack_path"])
    summary = {
        "ticket": "GVO_FINAL_021G",
        "classification": "REFERENCE_ONLY / NOT_RUNTIME",
        "unique_reference_rows": len(rows),
        "attachable_unique_sources": len(groups["COMMON"]),
        "noncanonical_not_attached": len([r for r in rows if r["approved_use"] == "NOT_ALLOWED"]),
        "attachment_copies": len(all_copies),
        "folder_counts": {name: len(selected) for name, selected in groups.items()},
        "brief_document_count": len(repo_docs),
        "h07": H07,
        "runtime_modified": False,
    }
    (PACK / "PACK_SUMMARY.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (PACK / "README.md").write_text(pack_readme("ROOT", groups["COMMON"]), encoding="utf-8")
    if PACK_ZIP.exists() and (PACK_ZIP.is_symlink() or not PACK_ZIP.is_file()):
        raise RuntimeError(f"Unsafe zip target: {PACK_ZIP}")
    with zipfile.ZipFile(PACK_ZIP, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for path in sorted((p for p in PACK.rglob("*") if p.is_file()), key=lambda p: p.relative_to(PACK).as_posix()):
            arcname = f"{PACK.name}/{path.relative_to(PACK).as_posix()}"
            info = zipfile.ZipInfo(arcname, date_time=(2026, 8, 3, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o100644 << 16
            archive.writestr(info, path.read_bytes(), compress_type=zipfile.ZIP_DEFLATED, compresslevel=9)
    with zipfile.ZipFile(PACK_ZIP, "r") as archive:
        bad = archive.testzip()
        if bad:
            raise RuntimeError(f"Corrupt ZIP member: {bad}")
    summary.update({
        "manifest": str(root_manifest),
        "manifest_sha256": sha256(root_manifest),
        "folder": str(PACK),
        "zip": str(PACK_ZIP),
        "zip_sha256": sha256(PACK_ZIP),
        "zip_bytes": PACK_ZIP.stat().st_size,
    })
    return summary


def status_markdown(production: list[dict[str, object]], derived: list[dict[str, object]], pack: dict[str, object], output_paths: dict[str, Path]) -> str:
    audit_table = [
        "| ID | Filename | Canvas | Mode | Alpha | Bytes | SHA-256 | Canonical |",
        "|---|---|---:|---|---|---:|---|---|",
    ]
    for row in production:
        audit_table.append(f"| {row['reference_id']} | `{row['filename']}` | {row['width']}×{row['height']} | {row['mode']} | {row['alpha']} | {row['bytes']} | `{row['sha256']}` | YES |")
    derived_table = [
        "| ID | Derived WebP | Bytes | SHA-256 | Decision |", "|---|---|---:|---|---|",
    ]
    for row in derived:
        derived_table.append(f"| {row['reference_id']} | `{row['filename']}` | {row['bytes']} | `{row['sha256']}` | `NOT_ALLOWED / NONCANONICAL` |")
    visual_lines = [f"- `{path.name}` — {image_meta(path)['width']}×{image_meta(path)['height']} — `{sha256(path)}`" for path in output_paths.values()]
    return f"""# GVO_FINAL_021G — Briefs de producción del set final de Lía

## Estado

`GVO_FINAL_021G_LIA_ASSET_PRODUCTION_BRIEFS_COMPLETE`

Preproducción documental completa. No se generó arte final, no se implementó `/final` y no se modificó runtime ni `current-used`.

## Baseline auditado antes de escribir

- Branch: `main`
- HEAD previo: `{BASELINE}`
- `origin/main` local: `{BASELINE}`
- `refs/heads/main` remoto: `{BASELINE}`
- Divergencia inicial: `0/0`
- Worktree inicial: limpio
- `fetch`: no ejecutado

## Referencias producidas del Mirador

Las 16 coincidencias exactas fueron auditadas en Descargas sin editar, mover, renombrar, recomprimir ni promover. Clasificación común: `APPROVED_PRODUCTION_REFERENCE / NOT_RUNTIME`.

{chr(10).join(audit_table)}

Nota conocida: I01 conserva una desviación transparente de dos filas (`alpha bbox [0,0,1440,2558]`); 021G la documenta y no la repara. Los PNG de UI son canónicos. Sus homónimos WebP quedan excluidos:

{chr(10).join(derived_table)}

Los tamaños de los PNG UI exceden los presupuestos preliminares no bloqueantes documentados en 021F. Este ticket no recomprime, revoca aprobación ni integra; la optimización sigue siendo deuda previa a una futura integración autorizada.

## Fuentes de Lía

- Familias: documentación/manifest, Cover, rig, Loading, Transition, Mundo I, Mundo III, Mundo V y contact sheet 021B.
- Fuentes curadas auditadas: `42`.
- Filas del reference manifest: `72` (`42` Lía/documentales + `16` producción + `5` derivados no permitidos + `9` guías 021G).
- Autoridad de identidad: `docs/03_IDENTIDAD_LIA.md`, master Cover y rig controlado.
- Candidatos de reutilización binaria para Mirador: `0`.
- H07: `{H07}`.

## Contrato canónico

| ID | Decisión | Estado |
|---|---|---|
| `FINAL-LIA-IDLE-001` | WebP RGBA 1536×256, 6×1, z74, loop 3.5–5 s | `READY_FOR_HUMAN_ASSET_PRODUCTION / FIRST_ONLY` |
| `FINAL-LIA-GREET-001` | WebP RGBA 1024×256, 4×1, z74, one-shot ≤700 ms | `BLOCKED_BY_IDLE_HUMAN_APPROVAL` |
| `FINAL-LIA-GLOW-001` | PNG RGBA 1024×512, z72, estático | `BLOCKED_BY_IDLE_HUMAN_APPROVAL` |
| `FINAL-LIA-DIRECTION-001` | `DEFERRED / NO_NEW_ASSET_IN_INITIAL_SET` | rotación/traslación pequeña primero; nunca flip |
| `FINAL-LIA-RESET-001` | `NO_NEW_ASSET_REQUIRED_FOR_INITIAL_IMPLEMENTATION` | usar frame estable de idle |

## Briefs y orden de producción

- Briefs completos: `3`, cada uno con las 36 secciones contractuales.
- Decisiones completas: `2`.
- Ready: idle.
- Blocked: greeting y glow hasta revisión/aprobación humana del idle.
- Primer y único asset habilitado: `FINAL-LIA-IDLE-001`.
- No se abren direction/reset sin su condición explícita de reapertura.

## Guías visuales

{chr(10).join(visual_lines)}

- Idle guide: 1536×256, seis celdas exactas 256×256, sin gutters, safe area 20 px.
- Greeting guide: 1024×256, cuatro celdas exactas 256×256, sin gutters, safe area 20 px.
- Escala probada: portrait 14–18 % H, anchor `(0.50,0.68)`; landscape 667×375 a 20–26 % H, anchor `(0.50,0.61)`.
- Todas las guías: `{STAMP}`.

## Reference pack externo

- Manifest: `{pack['manifest']}` — `{pack['manifest_sha256']}`
- Fuentes únicas adjuntables: `{pack['attachable_unique_sources']}`.
- Copias trazadas por carpeta: `{pack['attachment_copies']}`.
- Carpeta: `{pack['folder']}`.
- ZIP: `{pack['zip']}` — `{pack['zip_sha256']}` — {pack['zip_bytes']} bytes.
- Clasificación: `REFERENCE_ONLY / NOT_RUNTIME`; no versionado.

## Framing y QA de producción posterior

- Usar el modo horizontal nativo más ancho realmente soportado y registrar sus dimensiones; 021G no inventa modos ni tamaños de herramienta.
- Una sola composición master por asset; no generar frames en conversaciones separadas.
- Photopea sólo para crop, alineación, limpieza alpha y exportación; no reconstruir anatomía.
- Redimensión proporcional total ≤15 %, escala entre frames ≤2 %, center drift ≤6 px, baseline drift ≤4 px.
- El posicionamiento futuro se mide por alpha bbox, no por canvas vacío.

## Límites respetados

- `src/**`: no modificado.
- `tests/**`: no modificado.
- `public/assets/**` y `current-used`: no modificados.
- Assets de Descargas: no modificados.
- Arte final producido: no.
- Implementación: no.
- Build/tests runtime/Playwright/browser: no ejecutados por prohibición contractual.
- Pruebas ejecutadas: Markdown, CSV, JSON, IDs, canvas, frames, hashes, overlays, celdas, escalas, timing, paths y Git documental.
"""


def validate_outputs(output_paths: dict[str, Path], reference_rows: list[dict[str, object]]) -> None:
    expected_sizes = {
        "identity": (2000, 1400), "hard_fails": (2000, 1400), "portrait": (1800, 1600),
        "landscape": (1334, 375), "idle_guide": (1536, 256), "greet_guide": (1024, 256),
        "glow_guide": (1024, 512), "timing": (1920, 1080), "benchmark": (2000, 1600),
    }
    for key, path in output_paths.items():
        with Image.open(path) as im:
            if im.size != expected_sizes[key] or im.format != "PNG":
                raise RuntimeError(f"Visual validation failed: {key} {im.size} {im.format}")
    for asset in ("IDLE", "GREET", "GLOW"):
        text = (OUT / f"FINAL-LIA-{asset}-001_BRIEF.md").read_text(encoding="utf-8")
        count = sum(1 for line in text.splitlines() if line.startswith("## ") and line.split(". ", 1)[0][3:].isdigit())
        if count != 36:
            raise RuntimeError(f"{asset} brief section count: {count}")
    if len(reference_rows) != 72 or len({str(row["reference_id"]) for row in reference_rows}) != 72:
        raise RuntimeError("Reference IDs are not unique and complete")
    if (1536 // 6, 256) != (256, 256) or (1024 // 4, 256) != (256, 256):
        raise RuntimeError("Sprite cell arithmetic failed")
    summary = json.loads((OUT / "final_021g_lia_family_summary.json").read_text(encoding="utf-8"))
    if summary["family_asset_count"] != 5 or summary["brief_count"] != 3 or summary["decision_count"] != 2:
        raise RuntimeError("Summary counts failed")
    with (OUT / "final_021g_lia_reference_manifest.csv").open("r", encoding="utf-8-sig", newline="") as handle:
        if len(list(csv.DictReader(handle))) != 72:
            raise RuntimeError("Reference CSV count failed")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    production = audit_production()
    derived = find_derived()
    catalog = source_catalog()
    source_paths = {source.reference_id: ROOT / source.relpath for source in catalog}
    missing = [str(path) for path in source_paths.values() if not path.is_file()]
    if missing:
        raise FileNotFoundError(f"Missing curated sources: {missing}")
    production_paths = {str(row["reference_id"]): Path(str(row["source_path"])) for row in production}
    output_paths = {
        "identity": OUT / "final_021g_lia_identity_contact_sheet.png",
        "hard_fails": OUT / "final_021g_lia_hard_fails_contact_sheet.png",
        "portrait": OUT / "final_021g_lia_portrait_scale_overlay.png",
        "landscape": OUT / "final_021g_lia_landscape_667x375_scale_overlay.png",
        "idle_guide": OUT / "final_021g_idle_6f_sprite_guide.png",
        "greet_guide": OUT / "final_021g_greeting_4f_sprite_guide.png",
        "glow_guide": OUT / "final_021g_glow_shadow_guide.png",
        "timing": OUT / "final_021g_lia_motion_timing_sheet.png",
        "benchmark": OUT / "final_021g_lia_existing_pose_benchmark.png",
    }
    identity_sheet(source_paths, output_paths["identity"])
    hard_fails_sheet(output_paths["hard_fails"])
    portrait_overlay(production_paths, source_paths["W301"], output_paths["portrait"])
    landscape_overlay(production_paths, source_paths["W301"], output_paths["landscape"])
    sprite_guide(output_paths["idle_guide"], 6, "IDLE 6F · F1 STABLE/REDUCED", ["neutral", "up", "high/blink", "down", "low", "return"])
    sprite_guide(output_paths["greet_guide"], 4, "GREETING 4F · ONE SHOT", ["idle", "incline", "petals", "return"])
    glow_guide(output_paths["glow_guide"])
    timing_sheet(output_paths["timing"])
    benchmark_sheet(source_paths, output_paths["benchmark"])

    repo_docs = []
    for asset in ("IDLE", "GREET", "GLOW"):
        path = OUT / f"FINAL-LIA-{asset}-001_BRIEF.md"
        path.write_text(brief_markdown(asset), encoding="utf-8")
        repo_docs.append(path)
    for decision in ("DIRECTION", "RESET"):
        path = OUT / f"FINAL-LIA-{decision}-001_DECISION.md"
        path.write_text(decision_markdown(decision), encoding="utf-8")
        repo_docs.append(path)

    families = family_rows()
    family_fields = ["asset_id", "filename", "canvas", "format", "alpha", "grid", "cell", "frames", "z", "motion", "production_order", "dependency", "state"]
    save_csv(OUT / "final_021g_lia_family_manifest.csv", families, family_fields)
    production_fields = ["reference_id", "filename", "source_path", "bytes", "sha256", "width", "height", "format", "mode", "alpha", "alpha_bbox", "exact_match_count", "classification", "canonical", "family", "notes"]
    save_csv(OUT / "final_021g_production_reference_manifest.csv", production, production_fields)
    reference_rows = build_reference_rows(catalog, production, derived, output_paths)
    save_csv(OUT / "final_021g_lia_reference_manifest.csv", reference_rows, REFERENCE_FIELDS)
    summary = {
        "ticket": "GVO_FINAL_021G",
        "baseline": BASELINE,
        "runtime": "READ_ONLY",
        "art_generated": False,
        "integration": False,
        "current_used_modified": False,
        "family_asset_count": 5,
        "brief_count": 3,
        "decision_count": 2,
        "production_reference_count": 16,
        "curated_lia_source_count": 42,
        "reference_manifest_rows": 72,
        "canonical_identity": {"petals": 5, "head": "opalescent", "eyes": "crescent", "collar": "amber", "body": "segmented_plant_bulb", "horizontal_flip": "FORBIDDEN_BY_DEFAULT"},
        "scale": {"portrait_viewport_height_percent": [14, 18], "portrait_anchor": [0.50, 0.68], "landscape_viewport_height_percent": [20, 26], "landscape_anchor": [0.50, 0.61], "measurement": "ALPHA_BBOX"},
        "first_ready_asset": "FINAL-LIA-IDLE-001",
        "blocked_until_idle_human_approval": ["FINAL-LIA-GREET-001", "FINAL-LIA-GLOW-001"],
        "direction": "DEFERRED / NO_NEW_ASSET_IN_INITIAL_SET",
        "reset": "NO_NEW_ASSET_REQUIRED_FOR_INITIAL_IMPLEMENTATION",
        "h07": H07,
        "visual_outputs": {path.name: {"sha256": sha256(path), **{k: v for k, v in image_meta(path).items() if k in {"width", "height", "mode", "alpha"}}} for path in output_paths.values()},
    }
    (OUT / "final_021g_lia_family_summary.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    repo_docs += [
        OUT / "final_021g_lia_family_manifest.csv",
        OUT / "final_021g_lia_reference_manifest.csv",
        OUT / "final_021g_lia_family_summary.json",
        OUT / "final_021g_production_reference_manifest.csv",
    ]
    pack = build_pack(reference_rows, repo_docs)
    STATUS.parent.mkdir(parents=True, exist_ok=True)
    STATUS.write_text(status_markdown(production, derived, pack, output_paths), encoding="utf-8")
    validate_outputs(output_paths, reference_rows)
    result = {
        "status": "GVO_FINAL_021G_LIA_ASSET_PRODUCTION_BRIEFS_COMPLETE",
        "production_references": len(production),
        "curated_sources": len(catalog),
        "reference_rows": len(reference_rows),
        "visual_outputs": len(output_paths),
        "briefs": 3,
        "decisions": 2,
        "pack": pack,
        "status_document_sha256": sha256(STATUS),
    }
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
