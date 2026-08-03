"""Genera los briefs y overlays documentales de GVO_FINAL_021D.

PREPRODUCTION / NOT_RUNTIME. No genera arte final ni modifica assets fuente.
El paquete externo se crea sólo con --external-pack y se rehúsa a sobrescribir.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import shutil
import zipfile
from pathlib import Path
from typing import Any

from PIL import Image, ImageDraw, ImageFont


OUTPUT_DIR = Path(__file__).resolve().parent
REPO_ROOT = Path(__file__).resolve().parents[4]
DOWNLOADS = Path.home() / "Downloads"
EXTERNAL_DIR = DOWNLOADS / "GVO_FINAL_021D_ENVIRONMENT_REFERENCE_PACK"
EXTERNAL_ZIP = DOWNLOADS / "GVO_FINAL_021D_ENVIRONMENT_REFERENCE_PACK.zip"

REFERENCE_HEADERS = [
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

FAMILY_HEADERS = [
    "asset_id",
    "final_filename",
    "final_canvas",
    "generation_ratio",
    "final_format",
    "alpha",
    "orientation",
    "z_order",
    "dependencies",
    "brief_path",
    "overlay_path",
    "status",
    "production_order",
    "max_bytes_preliminary",
]


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest().upper()


def image_metadata(path: Path) -> dict[str, Any]:
    with Image.open(path) as image:
        bands = image.getbands()
        alpha = "yes" if "A" in bands or "transparency" in image.info else "no"
        return {
            "width": image.width,
            "height": image.height,
            "mode": image.mode,
            "alpha": alpha,
        }


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        Path("C:/Windows/Fonts/consolab.ttf" if bold else "C:/Windows/Fonts/consola.ttf"),
        Path("C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf"),
    ]
    for candidate in candidates:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size=size)
    return ImageFont.load_default()


SOURCE_REFERENCES: list[dict[str, str | None]] = [
    {
        "reference_id": "R01",
        "source_path": "docs/narrative/visual_refs/08_pantalla_final_mirador.png",
        "display_name": "Referencia canónica Mirador",
        "current_consumer": "docs narrativos",
        "provenance": "Repositorio/entrega escritor; auditada por 021B y aprobada como dirección por 021C",
        "license_status": "NO_DOCUMENTADA; uso interno sólo como dirección artística",
        "approved_use": "ART_DIRECTION_ONLY",
        "assets_served": "FINAL-ENV-P-001;FINAL-ENV-L-001;FINAL-DEPTH-P-001;FINAL-DEPTH-L-001;FINAL-MIRADOR-P-001;FINAL-MIRADOR-L-001",
        "reason": "Cámara elevada, eje sol-río, tono, materialidad y relación cálido/frío",
        "attachment_priority": "ENV-P:1;ENV-L:1;DEPTH-P:4;DEPTH-L:4;MIRADOR-P:1;MIRADOR-L:1",
        "do_not_copy": "YES; no copiar layout, texto, iconos, accesos, Lía ni ornamento literal",
        "external_name": "R01_08_pantalla_final_mirador.png",
    },
    {
        "reference_id": "R02",
        "source_path": "docs/narrative/atlas_visual_assets_gvo_v1/gvo_atlas_006f_306_final_revision_libre_mockup.png",
        "display_name": "Atlas Mirador revisión libre",
        "current_consumer": "Atlas documental",
        "provenance": "Atlas visual GVO; auditada por 021B y aprobada como dirección por 021C",
        "license_status": "NO_DOCUMENTADA; uso interno sólo como composición",
        "approved_use": "COMPOSITION_REFERENCE",
        "assets_served": "FINAL-MIRADOR-P-001;FINAL-MIRADOR-L-001",
        "reason": "Relación mirador-valle, oclusores laterales y jerarquía del plano físico",
        "attachment_priority": "MIRADOR-P:3;MIRADOR-L:3",
        "do_not_copy": "YES; no copiar portales, texto, Lía, botones ni detalle literal",
        "external_name": "R02_atlas_final_revision_libre.png",
    },
    {
        "reference_id": "R03",
        "source_path": "docs/visual/final/021b-preproduction/final_021b_camera_375x667.png",
        "display_name": "Wireframe 375x667",
        "current_consumer": "GVO_FINAL_021B documentación",
        "provenance": "Generado determinísticamente por GVO_FINAL_021B",
        "license_status": "PROJECT_DOCUMENTATION",
        "approved_use": "COMPOSITION_REFERENCE",
        "assets_served": "FINAL-ENV-P-001;FINAL-DEPTH-P-001;FINAL-MIRADOR-P-001",
        "reason": "Gate portrait compacto, core y exclusiones",
        "attachment_priority": "DERIVATION_ONLY",
        "do_not_copy": "YES; guía técnica, no arte",
        "external_name": None,
    },
    {
        "reference_id": "R04",
        "source_path": "docs/visual/final/021b-preproduction/final_021b_camera_390x844.png",
        "display_name": "Wireframe 390x844",
        "current_consumer": "GVO_FINAL_021B documentación",
        "provenance": "Generado determinísticamente por GVO_FINAL_021B",
        "license_status": "PROJECT_DOCUMENTATION",
        "approved_use": "COMPOSITION_REFERENCE",
        "assets_served": "FINAL-ENV-P-001;FINAL-DEPTH-P-001;FINAL-MIRADOR-P-001",
        "reason": "Respiración vertical portrait",
        "attachment_priority": "DERIVATION_ONLY",
        "do_not_copy": "YES; guía técnica, no arte",
        "external_name": None,
    },
    {
        "reference_id": "R05",
        "source_path": "docs/visual/final/021b-preproduction/final_021b_camera_667x375.png",
        "display_name": "Wireframe 667x375",
        "current_consumer": "GVO_FINAL_021B documentación",
        "provenance": "Generado determinísticamente por GVO_FINAL_021B",
        "license_status": "PROJECT_DOCUMENTATION",
        "approved_use": "COMPOSITION_REFERENCE",
        "assets_served": "FINAL-ENV-L-001;FINAL-DEPTH-L-001;FINAL-MIRADOR-L-001",
        "reason": "Gate landscape de alto crítico",
        "attachment_priority": "DERIVATION_ONLY",
        "do_not_copy": "YES; guía técnica, no arte",
        "external_name": None,
    },
    {
        "reference_id": "R06",
        "source_path": "docs/visual/final/021b-preproduction/final_021b_camera_844x390.png",
        "display_name": "Wireframe 844x390",
        "current_consumer": "GVO_FINAL_021B documentación",
        "provenance": "Generado determinísticamente por GVO_FINAL_021B",
        "license_status": "PROJECT_DOCUMENTATION",
        "approved_use": "COMPOSITION_REFERENCE",
        "assets_served": "FINAL-ENV-L-001;FINAL-DEPTH-L-001;FINAL-MIRADOR-L-001",
        "reason": "Landscape mobile amplio",
        "attachment_priority": "DERIVATION_ONLY",
        "do_not_copy": "YES; guía técnica, no arte",
        "external_name": None,
    },
    {
        "reference_id": "R07",
        "source_path": "docs/visual/final/021b-preproduction/final_021b_camera_1024x768.png",
        "display_name": "Wireframe 1024x768",
        "current_consumer": "GVO_FINAL_021B documentación",
        "provenance": "Generado determinísticamente por GVO_FINAL_021B",
        "license_status": "PROJECT_DOCUMENTATION",
        "approved_use": "COMPOSITION_REFERENCE",
        "assets_served": "FINAL-ENV-L-001;FINAL-DEPTH-L-001;FINAL-MIRADOR-L-001",
        "reason": "Derivación 4:3 desde cámara landscape",
        "attachment_priority": "DERIVATION_ONLY",
        "do_not_copy": "YES; guía técnica, no arte",
        "external_name": None,
    },
    {
        "reference_id": "R08",
        "source_path": "docs/visual/final/021b-preproduction/final_021b_camera_1365x768.png",
        "display_name": "Wireframe 1365x768",
        "current_consumer": "GVO_FINAL_021B documentación",
        "provenance": "Generado determinísticamente por GVO_FINAL_021B",
        "license_status": "PROJECT_DOCUMENTATION",
        "approved_use": "COMPOSITION_REFERENCE",
        "assets_served": "FINAL-ENV-L-001;FINAL-DEPTH-L-001;FINAL-MIRADOR-L-001",
        "reason": "Landscape 16:9 completo",
        "attachment_priority": "DERIVATION_ONLY",
        "do_not_copy": "YES; guía técnica, no arte",
        "external_name": None,
    },
    {
        "reference_id": "R09",
        "source_path": "public/assets/gvo/current-used/world-4-root/environment/world4_environment_base_v01.webp",
        "display_name": "W4 base ambiental",
        "current_consumer": "World4Stage",
        "provenance": "W4 runtime HUMAN_APPROVED; fuente versionada y hash inventariado",
        "license_status": "NO_DOCUMENTADA; no reutilización binaria",
        "approved_use": "PALETTE_REFERENCE",
        "assets_served": "FINAL-ENV-P-001;FINAL-ENV-L-001",
        "reason": "Sombra fría contenida y ausencia de ruido uniforme",
        "attachment_priority": "OPTIONAL_NOT_REQUIRED",
        "do_not_copy": "YES; no copiar textura ni binario",
        "external_name": "R09_world4_environment_base_v01.webp",
    },
    {
        "reference_id": "R10",
        "source_path": "public/assets/gvo/current-used/world-4-root/environment/world4_rear_depth_plane_v01.png",
        "display_name": "W4 plano de profundidad",
        "current_consumer": "World4Stage",
        "provenance": "W4 runtime HUMAN_APPROVED; fuente versionada y hash inventariado",
        "license_status": "NO_DOCUMENTADA; no reutilización binaria",
        "approved_use": "MATERIAL_REFERENCE",
        "assets_served": "FINAL-DEPTH-P-001;FINAL-DEPTH-L-001",
        "reason": "Ejemplo técnico de plano alpha independiente",
        "attachment_priority": "DEPTH-P:2;DEPTH-L:2",
        "do_not_copy": "YES; tomar separación de capa, no forma ni textura",
        "external_name": "R10_world4_rear_depth_plane_v01.png",
    },
    {
        "reference_id": "R11",
        "source_path": "public/assets/gvo/current-used/world-4-root/environment/world4_haze_overlay_v01.png",
        "display_name": "W4 haze restringido",
        "current_consumer": "World4Stage",
        "provenance": "W4 runtime HUMAN_APPROVED; fuente versionada y hash inventariado",
        "license_status": "NO_DOCUMENTADA; no reutilización binaria",
        "approved_use": "MATERIAL_REFERENCE",
        "assets_served": "FINAL-DEPTH-P-001;FINAL-DEPTH-L-001",
        "reason": "Referencia de alpha suave localizado sin velo global",
        "attachment_priority": "DEPTH-P:3;DEPTH-L:3",
        "do_not_copy": "YES; no copiar textura ni distribución",
        "external_name": "R11_world4_haze_overlay_v01.png",
    },
    {
        "reference_id": "R12",
        "source_path": "public/assets/gvo/current-used/world-4-root/table/world4_table_top_v01.png",
        "display_name": "W4 superficie estructural",
        "current_consumer": "World4Stage",
        "provenance": "W4 runtime HUMAN_APPROVED; fuente versionada y hash inventariado",
        "license_status": "NO_DOCUMENTADA; no reutilización binaria",
        "approved_use": "MATERIAL_REFERENCE",
        "assets_served": "FINAL-MIRADOR-P-001;FINAL-MIRADOR-L-001",
        "reason": "Referencia de masa, borde y sombra de contacto estructural",
        "attachment_priority": "MIRADOR-P:2;MIRADOR-L:2",
        "do_not_copy": "YES; no copiar silueta de mesa ni binario",
        "external_name": "R12_world4_table_top_v01.png",
    },
    {
        "reference_id": "R13",
        "source_path": "public/assets/gvo/current-used/world-5-root/world5_map_environment_portrait_v01.webp",
        "display_name": "W5 cámara portrait",
        "current_consumer": "World5RootScreen",
        "provenance": "Manifest ST5-020G; fuente local registrada y versionada",
        "license_status": "NO_DOCUMENTADA; no reutilización binaria",
        "approved_use": "COMPOSITION_REFERENCE",
        "assets_served": "FINAL-ENV-P-001",
        "reason": "Referencia técnica de canvas portrait y escala aparente, no contenido",
        "attachment_priority": "ENV-P:3",
        "do_not_copy": "YES; no copiar cavidad, textura ni forma",
        "external_name": "R13_world5_environment_portrait.webp",
    },
    {
        "reference_id": "R14",
        "source_path": "public/assets/gvo/current-used/world-5-root/world5_map_environment_landscape_v01.webp",
        "display_name": "W5 cámara landscape",
        "current_consumer": "World5RootScreen",
        "provenance": "Manifest ST5-020G; fuente local registrada y versionada",
        "license_status": "NO_DOCUMENTADA; no reutilización binaria",
        "approved_use": "COMPOSITION_REFERENCE",
        "assets_served": "FINAL-ENV-L-001",
        "reason": "Referencia técnica de canvas landscape independiente, no contenido",
        "attachment_priority": "ENV-L:3",
        "do_not_copy": "YES; no copiar cavidad, textura ni forma",
        "external_name": "R14_world5_environment_landscape.webp",
    },
    {
        "reference_id": "R15",
        "source_path": "public/assets/gvo/current-used/world-5-root/world5_map_sector_plants_v01.webp",
        "display_name": "W5 plantas estructurales",
        "current_consumer": "World5RootScreen",
        "provenance": "Manifest ST5-020G; fuente local registrada y versionada",
        "license_status": "NO_DOCUMENTADA; no reutilización binaria",
        "approved_use": "MATERIAL_REFERENCE",
        "assets_served": "FINAL-MIRADOR-P-001;FINAL-MIRADOR-L-001",
        "reason": "Masas vegetales claras y lectura alpha a escala reducida",
        "attachment_priority": "MIRADOR-P:4;MIRADOR-L:4",
        "do_not_copy": "YES; no copiar macetas, plantas ni binario",
        "external_name": "R15_world5_plants_material.webp",
    },
]


COMMON_NEGATIVE = (
    "text, letters, numbers, logos, signatures, watermarks, UI, buttons, labels, credits, "
    "Lia, characters, humans, animals, floating islands, station portals, five access objects, "
    "photorealism, smooth vector gradients, glossy 3D render look, anime, extra worlds, World VI, "
    "excessive particles, global bloom veil, fisheye lens, impossible perspective, symmetrical repetition, "
    "low-resolution pixel noise, mixed pixel scales, blurry resampling, cropped protected regions"
)


ASSETS: list[dict[str, Any]] = [
    {
        "id": "FINAL-ENV-P-001",
        "filename": "final_environment_portrait_v01.webp",
        "narrative": "Sostener el cierre contemplativo del recorrido sin crear un Mundo VI.",
        "visual": "Fondo opaco completo de cielo, valle lejano y eje sol-río para la cámara portrait.",
        "consumer": "FinalEnvironmentLayer",
        "state_layers": "`/final`, capa decorativa base z0 en todos los estados; sin interacción.",
        "canvas": "1440×2560",
        "ratio": "9:16; pedir la relación, sin afirmar dimensiones nativas de la herramienta",
        "format": "WebP opaco",
        "background": "Opaco; cobertura completa sin alpha ni matte",
        "alpha": "No esperado; alpha=false",
        "orientation": "Portrait, composición propia",
        "z": "z0",
        "core": "76% central del ancho (x=12%–88%); título y cinco respiraciones, eje sol-río, Lía, acciones y créditos no pueden quedar comprometidos.",
        "crop": "Sólo cielo superior, valle lateral y vegetación periférica fuera del core; nunca el eje central ni las cinco respiraciones.",
        "required": [
            "Cielo de atardecer con fuente luminosa central y nubes contenidas.",
            "Montañas lejanas, valle amplio y relieve lejano integrado al opaco.",
            "Río o camino sinuoso central legible al reducir a 375×667.",
            "Cinco zonas de respiración vacías en patrón 2–1–2 para assets posteriores.",
            "Zona superior tranquila para título DOM y tercio inferior compatible con mirador y Lía.",
            "Pixelart limpio; relación cálido/frío aproximada 75/25 y siluetas antes que microdetalle.",
        ],
        "forbidden": [
            "Accesos, islas, portales, Lía, mirador, barandal, piso, lámpara, atril, macetas u oclusores foreground.",
            "Texto, UI, créditos, marcas técnicas, motas, FX o bruma destinada a capa móvil.",
            "Semántica nueva, Mundo VI, fotorrealismo o masa plana que fusione todos los planos.",
        ],
        "references": [
            ("R01_08_pantalla_final_mirador.png", "R01", "cámara elevada, eje sol-río, tono y materialidad", "texto, portales, Lía y layout literal"),
            ("O01_env_portrait_generation_overlay.png", "O01", "core, horizonte, anchors y exclusiones", "colores de guía y texto técnico"),
            ("R13_world5_environment_portrait.webp", "R13", "disciplina de canvas y escala aparente", "cavidad, textura y forma"),
        ],
        "positive": (
            "Create an environment-layer-only illustration in clean, warm, poetic pixel art for an elevated balcony viewpoint, "
            "composed independently for a portrait 9:16 frame. Build a complete opaque sunset background with a central warm sun, "
            "restrained clouds, distant mountains, a broad valley, and a clearly readable winding river or path descending along the "
            "central axis. Preserve five calm negative-space pockets in a 2-1-2 arrangement for later interactive access assets, while "
            "keeping a quiet upper title zone and an unobstructed lower central zone for a later foreground and Lia. Use clear silhouettes, "
            "one consistent apparent pixel scale, short defined highlights, large material masses, and an approximately 75/25 warm-to-cool "
            "relationship. The background must remain coherent if every later layer is hidden. Include only distant atmosphere naturally "
            "baked into the opaque environment; keep mid-depth movable detail out of this layer. Make the composition readable when reduced "
            "to a 375 by 667 viewport. No operational text or technical marks in the artwork."
        ),
        "negative": COMMON_NEGATIVE + ", balcony foreground, railing, floor, lamp, lectern, potted plants, opaque haze overlay, separate FX",
        "generation": [
            "Adjuntar únicamente R01, O01 y R13 en ese orden.",
            "Solicitar una sola propuesta portrait 9:16; no generar lote ni variante landscape.",
            "Evaluar primero eje, core y respiraciones; rechazar antes de cualquier edición si falla la cámara.",
            "No pedir pixels nativos; conservar la salida original y llevar sólo la propuesta aprobada a Photopea.",
        ],
        "visual_accept": [
            "Sol, horizonte y río/camino alineados con O01.",
            "Cinco zonas de respiración distinguibles sin dibujar accesos.",
            "Título y tercio inferior quedan tranquilos; lectura correcta a 375×667.",
            "Pixelart consistente, sin seams, ruido uniforme ni velo bloom.",
        ],
        "hard_fails": [
            "Cualquier texto/UI, acceso, Lía o foreground horneado.",
            "Crop del core, pérdida del eje, perspectiva imposible o valle ilegible en miniatura.",
            "Fotorrealismo, look 3D/vectorial, pixel noise o semántica de Mundo VI.",
        ],
        "photopea": [
            "Conservar un master editable fuera de runtime y duplicar antes de crop/resize.",
            "Superponer O01 sin reescalado relativo; proteger x=12%–88% y ajustar sólo periferia.",
            "Llevar a 1440×2560 con resampling nearest-neighbor o método que preserve pixelart; inspeccionar al 100% y miniatura.",
            "Eliminar cualquier texto generado; revisar banding, seams y halos sin suavizado destructivo.",
        ],
        "export": "Exportar `final_environment_portrait_v01.webp`, 1440×2560, RGB opaco, objetivo preliminar <=900 KiB; no promover a runtime/current-used.",
        "metadata": "Reportar filename, 1440×2560, modo, alpha=false, bytes, SHA-256, herramienta/modelo mostrado, fecha, referencias adjuntas y correcciones Photopea.",
        "dependencies": "Art Bible/cámara portrait HUMAN_APPROVED; H07 controlado; ninguna dependencia de asset producido.",
        "overlay": "final_021d_env_portrait_generation_overlay.png",
        "status": "READY_FOR_HUMAN_ASSET_PRODUCTION",
        "order": 1,
        "max_bytes": 921600,
    },
    {
        "id": "FINAL-ENV-L-001",
        "filename": "final_environment_landscape_v01.webp",
        "narrative": "Sostener el mismo cierre contemplativo en cámara landscape sin derivarlo del portrait.",
        "visual": "Fondo opaco 16:9 independiente con arco de cinco respiraciones y eje central.",
        "consumer": "FinalEnvironmentLayer",
        "state_layers": "`/final`, capa decorativa base z0 en todos los estados; sin interacción.",
        "canvas": "2560×1440",
        "ratio": "16:9; pedir la relación, sin afirmar dimensiones nativas de la herramienta",
        "format": "WebP opaco",
        "background": "Opaco; cobertura completa sin alpha ni matte",
        "alpha": "No esperado; alpha=false",
        "orientation": "Landscape, composición propia; prohibido crop/extensión/rotación del portrait",
        "z": "z0",
        "core": "82% central del ancho y 86% del alto (x=9%–91%, y=7%–93%); proteger extremos I/V, eje, Lía, acciones y créditos.",
        "crop": "Sólo cielo o vegetación periféricos fuera del core; nunca extremos I/V ni alto útil del gate 667×375.",
        "required": [
            "Atardecer, montañas, valle y río/camino del mismo vocabulario aprobado, recompuestos para 16:9.",
            "Arco amplio con cinco zonas vacías; eje central claro y laterales respirables.",
            "Lectura completa en 667×375 y 1365×768, sin depender de crop portrait.",
            "Zona inferior compatible con foreground de 900 px y UI posterior.",
        ],
        "forbidden": [
            "Crop, outpainting automático, rotación o relleno lateral del portrait.",
            "Accesos, Lía, mirador, UI, texto, FX, foreground o Mundo VI.",
            "Detalle uniforme que cierre el alto útil de 667×375.",
        ],
        "references": [
            ("R01_08_pantalla_final_mirador.png", "R01", "tono, eje y profundidad narrativa", "layout portrait literal y sujetos"),
            ("O02_env_landscape_generation_overlay.png", "O02", "core 16:9, arco, 667×375 y exclusiones", "texto y colores técnicos"),
            ("R14_world5_environment_landscape.webp", "R14", "disciplina de canvas landscape independiente", "cavidad, textura y forma"),
        ],
        "positive": (
            "Create a new environment-layer-only illustration in clean, warm, poetic pixel art, independently composed for a landscape "
            "16:9 elevated balcony viewpoint. Show a complete opaque sunset background with a centered light source, restrained clouds, "
            "distant mountains, a broad valley, and a winding river or path maintaining the central vertical narrative axis. Arrange five "
            "clear negative-space pockets as a wide arc for later access assets, protecting both outer pockets in a very short 667 by 375 "
            "viewport. Keep the upper title area and lower action, credit, foreground, and Lia zones calm and unobstructed. Use clear silhouettes, "
            "one consistent apparent pixel scale, large readable forms, short highlights, and an approximately 75/25 warm-to-cool balance. "
            "The image must be a genuinely recomposed landscape scene, not a crop, extension, rotation, or side fill of a portrait image. "
            "Include only distant atmosphere baked naturally into the opaque background and no separate mid-depth content."
        ),
        "negative": COMMON_NEGATIVE + ", portrait crop, portrait outpainting, duplicated side fill, balcony foreground, railing, floor, lamp, lectern, opaque haze overlay",
        "generation": [
            "No iniciar hasta que FINAL-ENV-P-001 haya sido producido y revisado humanamente.",
            "Adjuntar únicamente R01, O02 y R14; no adjuntar el binario portrait producido como base de crop.",
            "Solicitar una sola propuesta landscape 16:9 y evaluar primero el gate 667×375.",
            "Conservar salida original; Photopea sólo después de aprobar composición independiente.",
        ],
        "visual_accept": [
            "Arco completo y extremos I/V seguros en 667×375.",
            "Eje central y valle legibles; no parece una extensión del portrait.",
            "Core 82%×86% intacto y zona inferior compatible con foreground/UI.",
            "Pixelart coherente con portrait aprobado sin clonar su layout.",
        ],
        "hard_fails": [
            "Evidencia de crop/outpainting/rotación del portrait.",
            "Accesos, Lía, foreground, texto o UI horneados.",
            "I/V recortados, alto útil saturado o eje desplazado en 667×375.",
        ],
        "photopea": [
            "Conservar master independiente; no abrir el portrait como canvas base.",
            "Superponer O02 y verificar core x=9%–91%, y=7%–93% y gate corto.",
            "Llevar a 2560×1440 preservando pixelart; ajustar sólo periferia permitida.",
            "Revisar seams, banding, texto generado y miniaturas 667×375/1365×768.",
        ],
        "export": "Exportar `final_environment_landscape_v01.webp`, 2560×1440, RGB opaco, objetivo preliminar <=900 KiB; no promover.",
        "metadata": "Reportar filename, 2560×1440, modo, alpha=false, bytes, SHA-256, herramienta/modelo mostrado, fecha, referencias y correcciones.",
        "dependencies": "FINAL-ENV-P-001 producido y revisado; Art Bible/cámara landscape HUMAN_APPROVED; H07 controlado.",
        "overlay": "final_021d_env_landscape_generation_overlay.png",
        "status": "READY_FOR_HUMAN_ASSET_PRODUCTION",
        "order": 2,
        "max_bytes": 921600,
    },
    {
        "id": "FINAL-DEPTH-P-001",
        "filename": "final_valley_depth_portrait_v01.webp",
        "narrative": "Conectar visualmente los cinco mundos mediante un plano medio sobrio.",
        "visual": "Capa alpha de colinas medias, hombros de relieve y continuidad del río/camino portrait.",
        "consumer": "FinalDepthLayer",
        "state_layers": "`/final`, z10 decorativo; transform opcional <=1.5%, estático en reduced motion.",
        "canvas": "1440×2560",
        "ratio": "9:16; pedir la relación, sin afirmar dimensiones nativas de la herramienta",
        "format": "WebP con alpha",
        "background": "Transparente real fuera del contenido; sin matte opaco",
        "alpha": "Esperado; bbox objetivo x=6%–94%, y=30%–76%, con bleed mínimo 48 px",
        "orientation": "Portrait, capa propia",
        "z": "z10",
        "core": "Eje central, cinco respiraciones y bbox indicado por O03; el layer no puede ocupar título, accesos, Lía ni mirador.",
        "crop": "Sólo transparencia exterior al bbox; no cortar crestas, río/camino ni bleed de 48 px.",
        "required": [
            "Dos hombros de colina media y conector central de río/camino coherentes con ENV-P.",
            "Vegetación media escasa y acentos de haze/luz localizados que pertenezcan al plano móvil.",
            "Alpha limpio y solape suficiente para transform máximo 1.5% sin seams.",
            "Fallback estático en transform:none; ENV-P continúa completo si esta capa no carga.",
        ],
        "forbidden": [
            "Cielo, sol, montañas lejanas completas o color base del valle ya horneado en ENV.",
            "Accesos, Lía, foreground, UI, texto, motas o velo de haze global.",
            "Duplicación exacta de detalles de ENV-P o fondo opaco.",
        ],
        "references": [
            ("O03_depth_portrait_layer_map.png", "O03", "bbox, bleed, plano permitido y exclusiones", "texto/colores de guía"),
            ("R10_world4_rear_depth_plane_v01.png", "R10", "separación técnica de plano alpha", "forma y textura W4"),
            ("R11_world4_haze_overlay_v01.png", "R11", "haze localizado y alpha suave", "distribución/textura W4"),
            ("R01_08_pantalla_final_mirador.png", "R01", "eje y relación de planos", "elementos literales"),
        ],
        "positive": (
            "Create only a transparent mid-depth layer in clean, warm, poetic pixel art for a portrait 9:16 valley scene viewed from an "
            "elevated balcony. Isolate two restrained mid-distance ridge shoulders, a readable central continuation of the winding river or "
            "path, sparse mid-distance vegetation masses, and a few localized haze or light accents that logically sit between a complete "
            "opaque distant environment and later access objects. Keep true transparency everywhere else, with clean soft-to-pixel edges and "
            "at least the documented safety overlap for subtle parallax. Maintain one apparent pixel scale, clear silhouettes, the approved "
            "warm/cool relation, and a calm center around the five future access pockets. The layer must still align when motion is disabled "
            "and must add depth without being required for semantic completeness."
        ),
        "negative": COMMON_NEGATIVE + ", opaque background, full sky, sun disk, complete distant mountains, baked environment duplicate, foreground railing, hard rectangular matte, global fog veil",
        "generation": [
            "Esperar FINAL-ENV-P-001 aprobado; usarlo sólo para alinear seams, no para duplicarlo.",
            "Adjuntar O03, R10, R11 y R01 en ese orden; pedir una sola capa transparente.",
            "Rechazar cualquier fondo opaco o detalle fuera del bbox antes de Photopea.",
            "Probar composición estática y desplazamientos máximos documentales antes de exportar.",
        ],
        "visual_accept": [
            "Plano medio distinguible sin competir con las cinco respiraciones.",
            "Retirar la capa deja ENV-P completo; activarla añade profundidad sin seams.",
            "Haze localizado, no velo; río/camino conecta con el eje.",
            "Bordes y pixel scale consistentes en miniatura portrait.",
        ],
        "hard_fails": [
            "Fondo opaco, matte, seams o bleed menor a 48 px.",
            "Duplicación visible de ENV-P o inclusión de cualquier elemento prohibido.",
            "Capa necesaria para entender el valle o desalineada en transform:none.",
        ],
        "photopea": [
            "Conservar master con ENV-P como capa de referencia bloqueada y no exportable.",
            "Ajustar a 1440×2560; limpiar alpha sin borrar el bleed mínimo de 48 px.",
            "Medir alpha bbox; inspeccionar halos sobre fondos claro, oscuro y ENV-P.",
            "Probar transform x±22 px/y±38 px y reduced motion transform:none; corregir seams.",
        ],
        "export": "Exportar `final_valley_depth_portrait_v01.webp`, 1440×2560, RGBA con alpha real, objetivo <=450 KiB; no promover.",
        "metadata": "Reportar filename, canvas, modo, alpha=true, alpha bbox en píxeles, bytes, SHA-256, bleed real, herramienta/modelo, fecha y correcciones.",
        "dependencies": "FINAL-ENV-P-001 aprobado; O03; H07 controlado; prueba de seams y reduced motion.",
        "overlay": "final_021d_depth_portrait_layer_map.png",
        "status": "READY_FOR_HUMAN_ASSET_PRODUCTION",
        "order": 3,
        "max_bytes": 460800,
    },
    {
        "id": "FINAL-DEPTH-L-001",
        "filename": "final_valley_depth_landscape_v01.webp",
        "narrative": "Conectar los cinco mundos en paisaje corto sin perder el arco aprobado.",
        "visual": "Capa alpha de relieve/río medios recompuesta para landscape.",
        "consumer": "FinalDepthLayer",
        "state_layers": "`/final`, z10 decorativo; transform opcional <=1.5%, estático en reduced motion.",
        "canvas": "2560×1440",
        "ratio": "16:9; pedir la relación, sin afirmar dimensiones nativas de la herramienta",
        "format": "WebP con alpha",
        "background": "Transparente real fuera del contenido; sin matte opaco",
        "alpha": "Esperado; bbox objetivo x=4%–96%, y=27%–78%, con bleed mínimo 48 px",
        "orientation": "Landscape, capa propia; no crop de portrait",
        "z": "z10",
        "core": "Arco completo, eje y alto crítico 667×375 dentro de O04; ningún relieve tapa I/V o UI inferior.",
        "crop": "Sólo transparencia exterior al bbox; no cortar hombros, conector central ni bleed.",
        "required": [
            "Relieve medio ancho y conector río/camino recompuestos para 16:9.",
            "Cinco respiraciones en arco y centro legible en 667×375.",
            "Alpha/bleed para transform <=1.5%; fallback estático sin seams.",
            "ENV-L permanece completo al ocultar esta capa.",
        ],
        "forbidden": [
            "Crop/rotación/outpainting de DEPTH-P.",
            "Cielo, sol, fondo completo, accesos, Lía, mirador, UI, texto o haze global.",
            "Duplicación exacta de ENV-L o fondo opaco.",
        ],
        "references": [
            ("O04_depth_landscape_layer_map.png", "O04", "bbox, bleed, arco y gate corto", "texto/colores de guía"),
            ("R10_world4_rear_depth_plane_v01.png", "R10", "separación técnica alpha", "forma/textura W4"),
            ("R11_world4_haze_overlay_v01.png", "R11", "haze localizado", "distribución W4"),
            ("R01_08_pantalla_final_mirador.png", "R01", "eje y relación de planos", "layout portrait literal"),
        ],
        "positive": (
            "Create only a transparent mid-depth layer in clean, warm, poetic pixel art, independently composed for a landscape 16:9 valley "
            "viewed from an elevated balcony. Isolate broad but restrained mid-distance ridge shoulders, a central winding river or path "
            "continuation, sparse vegetation masses, and very localized haze or light accents. Preserve five empty pockets across a wide arc, "
            "including both outer pockets in a short 667 by 375 viewport. Keep true transparency outside the documented bounding area and "
            "provide safe overlapping edges for subtle parallax without seams. Use one apparent pixel scale and clear silhouettes. The layer "
            "must align statically when reduced motion is enabled and must never be required for the opaque environment to remain complete. "
            "This is a new landscape composition, not a crop or extension of the portrait depth layer."
        ),
        "negative": COMMON_NEGATIVE + ", opaque background, portrait crop, portrait outpainting, full sky, sun disk, distant environment duplicate, foreground railing, global fog veil, clipped outer arc",
        "generation": [
            "No iniciar hasta aprobar FINAL-ENV-L-001 y revisar la capa portrait anterior.",
            "Adjuntar O04, R10, R11 y R01; pedir una sola capa alpha landscape.",
            "Rechazar crop del portrait, fondo opaco o pérdida de I/V en 667×375.",
            "Probar estático y desplazamientos máximos antes de exportar.",
        ],
        "visual_accept": [
            "Arco y extremos legibles a 667×375; centro sin saturación.",
            "ENV-L completo sin capa; con capa hay profundidad sin seams.",
            "Haze localizado y eje continuo; pixel scale consistente.",
            "Composición independiente de DEPTH-P.",
        ],
        "hard_fails": [
            "Crop/outpainting del portrait, fondo opaco, seams o bleed insuficiente.",
            "I/V recortados o inclusión de elementos prohibidos.",
            "Desalineación en transform:none o dependencia semántica.",
        ],
        "photopea": [
            "Usar ENV-L bloqueado como referencia; no usar DEPTH-P como base de crop.",
            "Ajustar a 2560×1440 y conservar bleed mínimo de 48 px.",
            "Medir alpha bbox y revisar halos sobre fondos claro, oscuro y ENV-L.",
            "Probar transform x±38 px/y±22 px, transform:none y miniatura 667×375.",
        ],
        "export": "Exportar `final_valley_depth_landscape_v01.webp`, 2560×1440, RGBA con alpha real, objetivo <=450 KiB; no promover.",
        "metadata": "Reportar filename, canvas, modo, alpha=true, alpha bbox, bytes, SHA-256, bleed, herramienta/modelo, fecha y correcciones.",
        "dependencies": "FINAL-ENV-L-001 aprobado; FINAL-DEPTH-P-001 revisado; O04; H07 controlado.",
        "overlay": "final_021d_depth_landscape_layer_map.png",
        "status": "READY_FOR_HUMAN_ASSET_PRODUCTION",
        "order": 4,
        "max_bytes": 460800,
    },
    {
        "id": "FINAL-MIRADOR-P-001",
        "filename": "final_mirador_foreground_portrait_v01.webp",
        "narrative": "Ubicar físicamente al visitante en el mirador sin competir con el cierre.",
        "visual": "Foreground alpha portrait de plataforma, barandal, piedra/madera y vegetación estructural.",
        "consumer": "FinalForegroundLayer",
        "state_layers": "`/final`, z70 decorativo detrás de Lía/UI; transform opcional mínimo, estático en reduced motion.",
        "canvas": "1440×1280",
        "ratio": "9:8 aproximado; usar sólo un modo soportado documentado y ajustar con O05, sin asumir pixels de salida",
        "format": "WebP con alpha",
        "background": "Transparente real; sólo masa estructural del mirador",
        "alpha": "Esperado; bbox medido y bordes sin matte",
        "orientation": "Portrait; corresponde al tramo inferior y=0.50–1.00 del artboard 1440×2560",
        "z": "z70",
        "core": "Reservar Lía central, accesos, acciones, créditos y modal conforme a O05; oclusores laterales <=14% del ancho cada uno.",
        "crop": "Permitido sólo en extremos exteriores y borde inferior; no cortar barandal estructural ni invadir reservas.",
        "required": [
            "Plataforma/piso y barandal legibles con bloques de piedra, madera simple y sombra de contacto.",
            "Plantas/macetas estructurales y oclusores laterales contenidos.",
            "Lámpara apagada/estable y atril/libro sin texto sólo si caben sin invadir reservas.",
            "Centro y bandas de acciones/créditos visualmente tranquilos.",
        ],
        "forbidden": [
            "Lía, accesos, botones, labels, título, créditos, texto de libro/cartel o modal.",
            "Llama animada, motas, feedback, sombras de assets inexistentes o fondo opaco.",
            "Oclusores que tapen targets o anatomía/ornamento copiado literalmente.",
        ],
        "references": [
            ("R01_08_pantalla_final_mirador.png", "R01", "vocabulario piedra/madera y relación balcón-valle", "layout, texto, portales y Lía"),
            ("O05_mirador_portrait_exclusion_map.png", "O05", "masas permitidas y reservas", "texto/colores técnicos"),
            ("R02_atlas_final_revision_libre.png", "R02", "jerarquía de foreground y oclusores", "silueta literal, portales y UI"),
            ("R12_world4_table_top_v01.png", "R12", "masa estructural y sombra de contacto", "silueta/material exactos"),
            ("R15_world5_plants_material.webp", "R15", "masas vegetales alpha legibles", "plantas/macetas exactas"),
        ],
        "positive": (
            "Create only a transparent structural foreground layer in clean, warm, poetic pixel art for the lower half of a portrait elevated "
            "balcony scene. Build a readable stone-and-wood overlook platform with a restrained railing, large worn stone blocks, simple warm "
            "wood grain, sparse bronze accents, contact shadows, and a few clearly grouped structural plants or pots near the sides. A stable "
            "unlit lamp and a textless lectern or closed/open book may appear only if they remain secondary. Keep the central Lia reserve, five "
            "access sightlines, action bands, credits, and modal region unobstructed according to the exclusion map. Use true transparency "
            "outside the physical foreground, clean alpha edges, one apparent pixel scale, clear silhouettes, and calm detail density. Side "
            "occluders must remain narrow and the layer must work without animation."
        ),
        "negative": COMMON_NEGATIVE + ", opaque background, baked valley, animated flame, floating motes, generated writing on book or signs, centered large object, oversized side occluders, shadows for absent objects",
        "generation": [
            "Esperar aprobación de FINAL-ENV-P-001 y no iniciar antes de su revisión.",
            "Adjuntar R01, O05, R02, R12 y R15 en ese orden; pedir una sola capa transparente.",
            "Rechazar texto, fondo opaco o invasión de reservas antes de Photopea.",
            "Evaluar sobre ENV-P como referencia bloqueada y también sobre checkerboard.",
        ],
        "visual_accept": [
            "Mirador legible y estable sin tapar Lía, cinco sightlines ni UI.",
            "Materiales en masas grandes, sin ruido; oclusores laterales <=14%.",
            "Centro y franja inferior tranquilos; alpha limpio.",
            "Lectura correcta al componer en 375×667.",
        ],
        "hard_fails": [
            "Texto generado, Lía/accesos/UI o fondo opaco.",
            "Reserva central/acciones/créditos invadida o targets visualmente tapados.",
            "Alpha con matte, oclusores excesivos, fotorrealismo o detalle uniforme.",
        ],
        "photopea": [
            "Conservar master con ENV-P/O05 como referencias bloqueadas no exportables.",
            "Ajustar a 1440×1280 y alinear como y=1280–2560 del artboard portrait.",
            "Limpiar alpha, medir bbox y revisar halos en checkerboard, fondo claro y ENV-P.",
            "Comprobar reservas y miniatura 375×667; no hornear sombras de otros assets.",
        ],
        "export": "Exportar `final_mirador_foreground_portrait_v01.webp`, 1440×1280, RGBA con alpha, objetivo <=600 KiB; no promover.",
        "metadata": "Reportar filename, canvas, modo, alpha=true, alpha bbox, bytes, SHA-256, alineación scene-y, herramienta/modelo, fecha y correcciones.",
        "dependencies": "FINAL-ENV-P-001 aprobado; O05; H07 controlado; prueba de reservas y alpha.",
        "overlay": "final_021d_mirador_portrait_exclusion_map.png",
        "status": "READY_FOR_HUMAN_ASSET_PRODUCTION",
        "order": 5,
        "max_bytes": 614400,
    },
    {
        "id": "FINAL-MIRADOR-L-001",
        "filename": "final_mirador_foreground_landscape_v01.webp",
        "narrative": "Ubicar al visitante en el mirador landscape sin consumir el alto crítico.",
        "visual": "Foreground alpha ancho y bajo de plataforma/barandal/materialidad aprobada.",
        "consumer": "FinalForegroundLayer",
        "state_layers": "`/final`, z70 decorativo detrás de Lía/UI; estático en reduced motion.",
        "canvas": "2560×900",
        "ratio": "128:45 (~2.844:1); usar el modo wide soportado más cercano y ajustar con O06, sin asumir pixels nativos",
        "format": "WebP con alpha",
        "background": "Transparente real; sólo masa estructural del mirador",
        "alpha": "Esperado; bbox medido, bordes sin matte",
        "orientation": "Landscape; corresponde al tramo scene-y=540–1440 del artboard 2560×1440",
        "z": "z70",
        "core": "Reservar arco I–V, Lía, acciones, créditos y modal; oclusores <=10% de ancho por lado y barandal bajo.",
        "crop": "Sólo extremos exteriores y borde inferior; nunca reducir alto útil ni cortar silueta estructural.",
        "required": [
            "Plataforma y barandal anchos/bajos recompuestos para 16:9.",
            "Piedra/madera en masas claras, plantas laterales escasas y sombra de contacto.",
            "Lámpara estable y atril sin texto sólo si no invaden el gate 667×375.",
            "Centro, extremos de acciones y franja de créditos tranquilos.",
        ],
        "forbidden": [
            "Crop/outpainting del foreground portrait.",
            "Lía, accesos, UI, texto, llama, motas, feedback, fondo opaco o sombras ajenas.",
            "Barandal alto u oclusores que reduzcan el alto útil.",
        ],
        "references": [
            ("R01_08_pantalla_final_mirador.png", "R01", "materialidad y relación balcón-valle", "layout portrait literal"),
            ("O06_mirador_landscape_exclusion_map.png", "O06", "reservas, alto crítico y masas permitidas", "texto/colores técnicos"),
            ("R02_atlas_final_revision_libre.png", "R02", "jerarquía del plano físico", "silueta/portales/UI literales"),
            ("R12_world4_table_top_v01.png", "R12", "masa y sombra de contacto", "silueta/material exactos"),
            ("R15_world5_plants_material.webp", "R15", "masas vegetales alpha", "plantas/macetas exactas"),
        ],
        "positive": (
            "Create only a transparent structural foreground layer in clean, warm, poetic pixel art, independently composed as a very wide, "
            "low landscape balcony plane. Build a restrained stone-and-wood overlook platform and low railing with large worn stone masses, "
            "simple warm wood grain, sparse bronze accents, contact shadows, and small grouped plants near the far sides. Preserve the short "
            "667 by 375 viewport: keep the five-access arc, central Lia reserve, lower action targets, credits, and modal region unobstructed. "
            "Side occluders must be narrow, the railing must stay low, and optional stable lamp or textless lectern details must remain secondary. "
            "Use true transparency, clean alpha edges, one apparent pixel scale, clear silhouettes, and calm detail density. Compose this layer "
            "independently; do not crop, rotate, or extend the portrait foreground."
        ),
        "negative": COMMON_NEGATIVE + ", portrait crop, portrait outpainting, opaque background, baked valley, tall railing, oversized side occluders, animated flame, writing on book or signs, centered large object",
        "generation": [
            "No iniciar hasta revisar FINAL-MIRADOR-P-001 y aprobar FINAL-ENV-L-001.",
            "Adjuntar R01, O06, R02, R12 y R15; pedir una propuesta wide transparente.",
            "Rechazar crop portrait, fondo opaco o pérdida de alto útil antes de Photopea.",
            "Evaluar sobre ENV-L, checkerboard y miniatura 667×375.",
        ],
        "visual_accept": [
            "Foreground ancho/bajo; arco, Lía y UI libres en 667×375.",
            "Composición propia, no extensión de portrait.",
            "Materiales claros, oclusores <=10%, centro tranquilo y alpha limpio.",
            "No reduce el alto útil ni parece una mesa W4 copiada.",
        ],
        "hard_fails": [
            "Crop/outpainting portrait, texto, Lía/accesos/UI o fondo opaco.",
            "Barandal/oclusores que tapen arco, Lía, acciones o créditos.",
            "Alpha con matte, fotorrealismo, ruido o silueta copiada de W4.",
        ],
        "photopea": [
            "Conservar master independiente; ENV-L/O06 son referencias bloqueadas no exportables.",
            "Ajustar a 2560×900 y alinear como scene-y=540–1440.",
            "Limpiar alpha, medir bbox y revisar halos sobre tres fondos.",
            "Validar 667×375, 844×390 y 1365×768; no hornear sombras ajenas.",
        ],
        "export": "Exportar `final_mirador_foreground_landscape_v01.webp`, 2560×900, RGBA con alpha, objetivo <=600 KiB; no promover.",
        "metadata": "Reportar filename, canvas, modo, alpha=true, alpha bbox, bytes, SHA-256, alineación scene-y, herramienta/modelo, fecha y correcciones.",
        "dependencies": "FINAL-ENV-L-001 y FINAL-MIRADOR-P-001 aprobados; O06; H07 controlado; gate 667×375.",
        "overlay": "final_021d_mirador_landscape_exclusion_map.png",
        "status": "READY_FOR_HUMAN_ASSET_PRODUCTION",
        "order": 6,
        "max_bytes": 614400,
    },
]


def bullets(items: list[str]) -> str:
    return "\n".join(f"- {item}" for item in items)


def reference_table(rows: list[tuple[str, str, str, str]]) -> str:
    lines = [
        "| Orden | Archivo externo | ID | Tomar | No copiar |",
        "| ---: | --- | --- | --- | --- |",
    ]
    for index, (filename, ref_id, take, reject) in enumerate(rows, start=1):
        lines.append(f"| {index} | `{filename}` | `{ref_id}` | {take} | {reject} |")
    return "\n".join(lines)


def render_brief(asset: dict[str, Any]) -> str:
    return f"""# {asset['id']} — Brief de producción

- Clasificación: `PREPRODUCTION — NOT RUNTIME`
- Estado del brief: `{asset['status']}`
- Orden de producción autorizado: {asset['order']} de 6; producir uno por uno.

## 1. ID

`{asset['id']}`

## 2. Filename final exacto

`{asset['filename']}`

## 3. Función narrativa

{asset['narrative']}

## 4. Función visual

{asset['visual']}

## 5. Consumidor futuro

`{asset['consumer']}`. Consumidor previsto, todavía inexistente/no integrado por 021D.

## 6. Estado/capas donde aparece

{asset['state_layers']}

## 7. Canvas final

`{asset['canvas']}`.

## 8. Ratio de generación

{asset['ratio']}.

## 9. Formato final

{asset['format']}.

## 10. Fondo opaco/transparente

{asset['background']}.

## 11. Alpha esperado

{asset['alpha']}.

## 12. Orientación

{asset['orientation']}.

## 13. z-order

`{asset['z']}`.

## 14. Core protegido

{asset['core']}

## 15. Crop permitido

{asset['crop']}

## 16. Contenido obligatorio

{bullets(asset['required'])}

## 17. Contenido prohibido

{bullets(asset['forbidden'])}

## 18. Referencias exactas a adjuntar

{reference_table(asset['references'])}

No adjuntar todo el paquete. Los hashes y paths originales se verifican en
`final_021d_environment_reference_manifest.csv` y en el `reference_manifest.json`
externo.

## 19. Orden de prioridad de referencias

El orden de la tabla anterior es vinculante. La referencia 1 gobierna arte o
composición; el overlay gobierna geometría y exclusiones; las restantes sólo
aportan la función descrita.

## 20. Qué debe tomarse de cada referencia

Usar exclusivamente la columna **Tomar** de la tabla. Una referencia de cámara
o material no autoriza copiar contenido, textura ni silueta.

## 21. Qué no debe copiarse

Usar como hard boundary la columna **No copiar**, el campo `do_not_copy` del
manifest y las prohibiciones de la sección 17. Ninguna referencia es candidato
de reutilización binaria para `/final`.

## 22. Prompt positivo en inglés

```text
{asset['positive']}
```

## 23. Prompt negativo en inglés

```text
{asset['negative']}
```

## 24. Instrucciones de generación

{bullets(asset['generation'])}

## 25. Criterios de aceptación visual

Checklist visual:

{bullets(asset['visual_accept'])}

La aceptación requiere revisión humana explícita; un hash, dimensión o pase
técnico no la sustituye.

## 26. Hard fails

{bullets(asset['hard_fails'])}

Cualquier hard fail detiene el asset; no se corrige produciendo el siguiente.

## 27. Instrucciones de Photopea

{bullets(asset['photopea'])}

Flujo no destructivo: master editable fuera de runtime, duplicado de trabajo,
overlay bloqueado, revisión al 100% y miniatura, export final separado.

## 28. Exportación final

{asset['export']}

Checklist técnico:

- filename y canvas exactos;
- modo/alpha conforme al contrato;
- ausencia de texto generado, seams, banding y halos;
- presupuesto preliminar comprobado, no asumido;
- SHA-256 y bytes calculados sobre la exportación;
- para alpha: bbox reportado y prueba sobre fondos claro/oscuro;
- ninguna copia en runtime ni `current-used`.

## 29. Metadata/hash que deberá reportarse

{asset['metadata']}

## 30. Plantilla de retorno del usuario

```text
ASSET_ID LISTO
Archivo:
Canvas:
Fondo:
Correcciones en Photopea:
Observaciones:
```

## 31. Dependencias

{asset['dependencies']}

La secuencia de producción sigue el orden 1→6. Aunque el brief esté listo, no
se salta una dependencia ni se produce en lote.

## 32. Estado

`{asset['status']}`

Este estado declara el brief listo, no el asset producido, aprobado o integrado.
"""


PORTRAIT_ANCHORS = {
    "I": (0.24, 0.30),
    "II": (0.76, 0.30),
    "III": (0.50, 0.43),
    "IV": (0.24, 0.52),
    "V": (0.76, 0.52),
}
LANDSCAPE_ANCHORS = {
    "I": (0.14, 0.34),
    "II": (0.32, 0.27),
    "III": (0.50, 0.23),
    "IV": (0.68, 0.27),
    "V": (0.86, 0.34),
}


def load_wireframe(path: Path, size: tuple[int, int]) -> Image.Image:
    with Image.open(path) as source:
        return source.convert("RGBA").resize(size, Image.Resampling.NEAREST)


def base_overlay(size: tuple[int, int], wireframe: Path, title: str) -> tuple[Image.Image, ImageDraw.ImageDraw]:
    width, height = size
    image = load_wireframe(wireframe, size)
    shade = Image.new("RGBA", size, (8, 18, 17, 150))
    image.alpha_composite(shade)
    draw = ImageDraw.Draw(image, "RGBA")
    header_h = max(72, int(height * 0.055))
    draw.rectangle((0, 0, width, header_h), fill=(11, 22, 20, 245))
    draw.text((int(width * 0.02), int(header_h * 0.18)), title, font=font(max(22, int(header_h * 0.30)), True), fill="#F4E8C9")
    draw.text((int(width * 0.02), int(header_h * 0.58)), "PREPRODUCTION — NOT RUNTIME · GUIDES ONLY", font=font(max(16, int(header_h * 0.20)), True), fill="#F0B35D")
    draw.rectangle((2, 2, width - 3, height - 3), outline="#F0B35D", width=max(3, width // 480))
    return image, draw


def rect_norm(draw: ImageDraw.ImageDraw, size: tuple[int, int], box: tuple[float, float, float, float], fill: tuple[int, int, int, int], outline: str, width: int) -> tuple[int, int, int, int]:
    w, h = size
    coords = (int(box[0] * w), int(box[1] * h), int(box[2] * w), int(box[3] * h))
    # Los mapas son guías sobre wireframes aprobados. Usar relleno RGBA directo
    # y luego convertir a RGB aplana el color y oculta la evidencia base; los
    # contornos mantienen legibles ambas capas documentales.
    draw.rectangle(coords, fill=None, outline=outline, width=width)
    return coords


def text_box(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str, size: int, color: str = "#F4E8C9", anchor: str = "la") -> None:
    draw.text(xy, text, font=font(size, True), fill=color, anchor=anchor, stroke_width=max(1, size // 16), stroke_fill="#08110F")


def draw_common_scene_guides(draw: ImageDraw.ImageDraw, size: tuple[int, int], orientation: str) -> None:
    w, h = size
    portrait = orientation == "portrait"
    core = (0.12, 0.04, 0.88, 0.96) if portrait else (0.09, 0.07, 0.91, 0.93)
    rect_norm(draw, size, core, (76, 160, 110, 18), "#75D69B", max(3, w // 500))
    text_box(draw, (int(core[0] * w + 12), int(core[1] * h + 12)), "PROTECTED CORE", max(18, w // 55), "#75D69B")
    horizon_y = 0.30 if portrait else 0.32
    draw.line((0, int(horizon_y * h), w, int(horizon_y * h)), fill="#F0B35D", width=max(3, w // 480))
    text_box(draw, (int(0.02 * w), int(horizon_y * h - 10)), "HORIZON", max(18, w // 60), "#F0B35D", "ls")
    draw.line((w // 2, int(0.12 * h), w // 2, int(0.78 * h)), fill="#68AABF", width=max(3, w // 600))
    text_box(draw, (w // 2 + 12, int(0.20 * h)), "SUN → RIVER AXIS", max(18, w // 65), "#68AABF")
    title = (0.25, 0.055, 0.75, 0.18) if portrait else (0.30, 0.045, 0.70, 0.16)
    rect_norm(draw, size, title, (225, 177, 113, 45), "#E1B171", max(2, w // 700))
    text_box(draw, (w // 2, int((title[1] + title[3]) * 0.5 * h)), "TITLE / QUIET", max(18, w // 58), "#F4E8C9", "mm")
    anchors = PORTRAIT_ANCHORS if portrait else LANDSCAPE_ANCHORS
    radius = max(30, int(min(w, h) * (0.047 if portrait else 0.062)))
    for name, (x, y) in anchors.items():
        cx, cy = int(x * w), int(y * h)
        draw.ellipse((cx - radius, cy - radius, cx + radius, cy + radius), fill=None, outline="#68AABF", width=max(3, w // 650))
        text_box(draw, (cx, cy), name, max(18, radius // 2), "#C6EAF4", "mm")
    lia_y = 0.68 if portrait else 0.61
    lia_r = max(34, int(min(w, h) * 0.055))
    draw.ellipse((w // 2 - lia_r, int(lia_y * h) - lia_r, w // 2 + lia_r, int(lia_y * h) + lia_r), fill=None, outline="#D5A7D0", width=max(3, w // 650))
    text_box(draw, (w // 2, int(lia_y * h)), "LIA", max(18, lia_r // 2), "#F0D3EC", "mm")
    actions = (0.08, 0.79, 0.92, 0.875) if portrait else (0.04, 0.68, 0.96, 0.80)
    credits = (0.08, 0.90, 0.92, 0.985) if portrait else (0.18, 0.84, 0.82, 0.97)
    modal = (0.18, 0.30, 0.82, 0.70) if portrait else (0.25, 0.22, 0.75, 0.72)
    rect_norm(draw, size, actions, (225, 177, 113, 36), "#E1B171", max(2, w // 700))
    rect_norm(draw, size, credits, (225, 177, 113, 28), "#E1B171", max(2, w // 700))
    rect_norm(draw, size, modal, (120, 75, 120, 20), "#AE7EA3", max(2, w // 700))
    text_box(draw, (int(actions[0] * w + 8), int(actions[1] * h + 8)), "ACTIONS", max(16, w // 70), "#F4E8C9")
    text_box(draw, (int(credits[0] * w + 8), int(credits[1] * h + 8)), "CREDITS", max(16, w // 70), "#F4E8C9")
    text_box(draw, (w // 2, int((modal[1] + modal[3]) * 0.5 * h)), "MODAL EXCLUSION", max(18, w // 62), "#D5A7D0", "mm")


def draw_environment_overlay(size: tuple[int, int], orientation: str, filename: str) -> None:
    wireframe = REPO_ROOT / "docs/visual/final/021b-preproduction" / ("final_021b_camera_375x667.png" if orientation == "portrait" else "final_021b_camera_667x375.png")
    image, draw = base_overlay(size, wireframe, f"ENV {orientation.upper()} · GENERATION OVERLAY")
    draw_common_scene_guides(draw, size, orientation)
    w, h = size
    if orientation == "portrait":
        bands = [(0, 0, 0.12, 1), (0.88, 0, 1, 1)]
        calm = (0.18, 0.19, 0.82, 0.60)
    else:
        bands = [(0, 0, 0.09, 1), (0.91, 0, 1, 1), (0, 0, 1, 0.07), (0, 0.93, 1, 1)]
        calm = (0.10, 0.17, 0.90, 0.58)
    for band in bands:
        rect_norm(draw, size, band, (190, 56, 56, 38), "#D46A64", max(2, w // 720))
    rect_norm(draw, size, calm, (66, 126, 96, 18), "#75D69B", max(2, w // 800))
    text_box(draw, (int(0.02 * w), int(0.985 * h)), "ENV ONLY: sky · distant mountains · valley base · river/path · baked distant atmosphere", max(17, w // 62), "#F4E8C9", "ls")
    image.convert("RGB").save(OUTPUT_DIR / filename, format="PNG", optimize=True)


def draw_depth_overlay(size: tuple[int, int], orientation: str, filename: str) -> None:
    wireframe = REPO_ROOT / "docs/visual/final/021b-preproduction" / ("final_021b_camera_375x667.png" if orientation == "portrait" else "final_021b_camera_667x375.png")
    image, draw = base_overlay(size, wireframe, f"DEPTH {orientation.upper()} · ALPHA LAYER MAP")
    draw_common_scene_guides(draw, size, orientation)
    w, h = size
    bbox = (0.06, 0.30, 0.94, 0.76) if orientation == "portrait" else (0.04, 0.27, 0.96, 0.78)
    rect_norm(draw, size, bbox, (68, 154, 190, 44), "#68AABF", max(4, w // 520))
    bleed_x = 48 / w
    bleed_y = 48 / h
    outer = (max(0, bbox[0] - bleed_x), max(0, bbox[1] - bleed_y), min(1, bbox[2] + bleed_x), min(1, bbox[3] + bleed_y))
    rect_norm(draw, size, outer, (0, 0, 0, 0), "#F0B35D", max(2, w // 800))
    text_box(draw, (int(bbox[0] * w + 14), int(bbox[1] * h + 14)), "ALPHA BBOX TARGET", max(18, w // 58), "#C6EAF4")
    text_box(draw, (int(outer[0] * w + 14), int(outer[3] * h - 14)), "48 px MIN BLEED", max(18, w // 62), "#F0B35D", "ls")
    text_box(draw, (int(0.02 * w), int(0.985 * h)), "DEPTH ONLY: mid ridges · central river connector · sparse localized haze · transparent elsewhere", max(17, w // 66), "#F4E8C9", "ls")
    image.convert("RGB").save(OUTPUT_DIR / filename, format="PNG", optimize=True)


def draw_mirador_overlay(full_size: tuple[int, int], asset_size: tuple[int, int], orientation: str, filename: str) -> None:
    wireframe = REPO_ROOT / "docs/visual/final/021b-preproduction" / ("final_021b_camera_375x667.png" if orientation == "portrait" else "final_021b_camera_667x375.png")
    full = load_wireframe(wireframe, full_size)
    if orientation == "portrait":
        top = full_size[1] - asset_size[1]
    else:
        top = full_size[1] - asset_size[1]
    crop = full.crop((0, top, asset_size[0], top + asset_size[1]))
    image = crop
    shade = Image.new("RGBA", asset_size, (8, 18, 17, 150))
    image.alpha_composite(shade)
    draw = ImageDraw.Draw(image, "RGBA")
    w, h = asset_size
    header_h = max(72, int(h * 0.085))
    draw.rectangle((0, 0, w, header_h), fill=(11, 22, 20, 245))
    draw.text((int(w * 0.02), int(header_h * 0.14)), f"MIRADOR {orientation.upper()} · EXCLUSION MAP", font=font(max(22, int(header_h * 0.28)), True), fill="#F4E8C9")
    draw.text((int(w * 0.02), int(header_h * 0.55)), "PREPRODUCTION — NOT RUNTIME · TRANSPARENT ASSET", font=font(max(16, int(header_h * 0.19)), True), fill="#F0B35D")
    draw.rectangle((2, 2, w - 3, h - 3), outline="#F0B35D", width=max(3, w // 480))
    if orientation == "portrait":
        allowed_floor = (0.02, 0.54, 0.98, 0.98)
        allowed_rail = (0.06, 0.22, 0.94, 0.48)
        left = (0.00, 0.12, 0.14, 0.82)
        right = (0.86, 0.12, 1.00, 0.82)
        lia = (0.35, 0.08, 0.65, 0.52)
        ui = (0.08, 0.58, 0.92, 0.98)
        modal = (0.18, 0.02, 0.82, 0.62)
        side_note = "SIDE OCCLUDERS <=14%"
    else:
        allowed_floor = (0.02, 0.62, 0.98, 0.98)
        allowed_rail = (0.04, 0.34, 0.96, 0.58)
        left = (0.00, 0.12, 0.10, 0.82)
        right = (0.90, 0.12, 1.00, 0.82)
        lia = (0.40, 0.05, 0.60, 0.55)
        ui = (0.04, 0.58, 0.96, 0.98)
        modal = (0.25, 0.02, 0.75, 0.66)
        side_note = "SIDE OCCLUDERS <=10% · KEEP 667x375 HEIGHT"
    rect_norm(draw, asset_size, allowed_floor, (76, 160, 110, 42), "#75D69B", max(3, w // 600))
    rect_norm(draw, asset_size, allowed_rail, (76, 160, 110, 32), "#75D69B", max(3, w // 600))
    rect_norm(draw, asset_size, left, (76, 160, 110, 30), "#75D69B", max(2, w // 760))
    rect_norm(draw, asset_size, right, (76, 160, 110, 30), "#75D69B", max(2, w // 760))
    rect_norm(draw, asset_size, lia, (174, 126, 163, 52), "#D5A7D0", max(3, w // 620))
    rect_norm(draw, asset_size, ui, (225, 177, 113, 35), "#E1B171", max(3, w // 620))
    rect_norm(draw, asset_size, modal, (190, 56, 56, 25), "#D46A64", max(3, w // 620))
    text_box(draw, (int(0.04 * w), int(allowed_rail[1] * h + 14)), "ALLOWED: LOW RAIL / STRUCTURE", max(18, w // 58), "#75D69B")
    text_box(draw, (int(0.04 * w), int(allowed_floor[1] * h + 14)), "ALLOWED: FLOOR / STONE / WOOD", max(18, w // 58), "#75D69B")
    text_box(draw, (w // 2, int((lia[1] + lia[3]) * 0.5 * h)), "KEEP LIA + SIGHTLINES CLEAR", max(18, w // 60), "#F0D3EC", "mm")
    text_box(draw, (w // 2, int((ui[1] + ui[3]) * 0.5 * h)), "KEEP ACTIONS / CREDITS QUIET", max(18, w // 62), "#F4E8C9", "mm")
    text_box(draw, (int(0.02 * w), int(0.985 * h)), side_note + " · NO TEXT / UI / LIA / ACCESS / FX", max(17, w // 66), "#F0B35D", "ls")
    image.convert("RGB").save(OUTPUT_DIR / filename, format="PNG", optimize=True)


OVERLAY_SPECS = [
    ("O01", "final_021d_env_portrait_generation_overlay.png", "ENV portrait generation overlay", "FINAL-ENV-P-001", "ENV-P:2"),
    ("O02", "final_021d_env_landscape_generation_overlay.png", "ENV landscape generation overlay", "FINAL-ENV-L-001", "ENV-L:2"),
    ("O03", "final_021d_depth_portrait_layer_map.png", "DEPTH portrait alpha map", "FINAL-DEPTH-P-001", "DEPTH-P:1"),
    ("O04", "final_021d_depth_landscape_layer_map.png", "DEPTH landscape alpha map", "FINAL-DEPTH-L-001", "DEPTH-L:1"),
    ("O05", "final_021d_mirador_portrait_exclusion_map.png", "MIRADOR portrait exclusion map", "FINAL-MIRADOR-P-001", "MIRADOR-P:2"),
    ("O06", "final_021d_mirador_landscape_exclusion_map.png", "MIRADOR landscape exclusion map", "FINAL-MIRADOR-L-001", "MIRADOR-L:2"),
]


def build_reference_rows() -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    for reference in SOURCE_REFERENCES:
        path = REPO_ROOT / str(reference["source_path"])
        if not path.is_file():
            raise FileNotFoundError(path)
        meta = image_metadata(path)
        rows.append({
            key: reference[key]
            for key in REFERENCE_HEADERS
            if key not in {"sha256", "width", "height", "mode", "alpha"}
        } | {
            "sha256": sha256(path),
            **meta,
        })
    for ref_id, filename, display_name, assets_served, priority in OVERLAY_SPECS:
        path = OUTPUT_DIR / filename
        meta = image_metadata(path)
        rows.append({
            "reference_id": ref_id,
            "source_path": str(path.relative_to(REPO_ROOT)).replace("\\", "/"),
            "display_name": display_name,
            "sha256": sha256(path),
            **meta,
            "current_consumer": "GVO_FINAL_021D documentation",
            "provenance": "Overlay determinista 021D derivado de wireframe 021B aprobado",
            "license_status": "PROJECT_DOCUMENTATION",
            "approved_use": "COMPOSITION_REFERENCE",
            "assets_served": assets_served,
            "reason": "Geometría, core, exclusiones, bleed y anchors contractuales",
            "attachment_priority": priority,
            "do_not_copy": "YES; guía técnica, nunca arte ni runtime",
        })
    return rows


def write_csv(path: Path, headers: list[str], rows: list[dict[str, Any]]) -> None:
    with path.open("w", encoding="utf-8", newline="") as stream:
        writer = csv.DictWriter(stream, fieldnames=headers, lineterminator="\n", extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def generate_repo_package() -> list[dict[str, Any]]:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    draw_environment_overlay((1440, 2560), "portrait", "final_021d_env_portrait_generation_overlay.png")
    draw_environment_overlay((2560, 1440), "landscape", "final_021d_env_landscape_generation_overlay.png")
    draw_depth_overlay((1440, 2560), "portrait", "final_021d_depth_portrait_layer_map.png")
    draw_depth_overlay((2560, 1440), "landscape", "final_021d_depth_landscape_layer_map.png")
    draw_mirador_overlay((1440, 2560), (1440, 1280), "portrait", "final_021d_mirador_portrait_exclusion_map.png")
    draw_mirador_overlay((2560, 1440), (2560, 900), "landscape", "final_021d_mirador_landscape_exclusion_map.png")

    for asset in ASSETS:
        (OUTPUT_DIR / f"{asset['id']}_BRIEF.md").write_text(render_brief(asset), encoding="utf-8", newline="\n")

    family_rows = []
    for asset in ASSETS:
        family_rows.append({
            "asset_id": asset["id"],
            "final_filename": asset["filename"],
            "final_canvas": asset["canvas"],
            "generation_ratio": asset["ratio"],
            "final_format": asset["format"],
            "alpha": asset["alpha"],
            "orientation": asset["orientation"],
            "z_order": asset["z"],
            "dependencies": asset["dependencies"],
            "brief_path": f"docs/visual/final/021d-asset-production-briefs/{asset['id']}_BRIEF.md",
            "overlay_path": f"docs/visual/final/021d-asset-production-briefs/{asset['overlay']}",
            "status": asset["status"],
            "production_order": asset["order"],
            "max_bytes_preliminary": asset["max_bytes"],
        })
    write_csv(OUTPUT_DIR / "final_021d_environment_family_manifest.csv", FAMILY_HEADERS, family_rows)

    reference_rows = build_reference_rows()
    write_csv(OUTPUT_DIR / "final_021d_environment_reference_manifest.csv", REFERENCE_HEADERS, reference_rows)

    hash_targets = sorted(
        path for path in OUTPUT_DIR.iterdir()
        if path.is_file() and path.name != "final_021d_environment_family_summary.json"
    )
    summary = {
        "ticket": "GVO_FINAL_021D",
        "classification": "PREPRODUCTION_NOT_RUNTIME",
        "brief_count": len(ASSETS),
        "ready_count": sum(1 for asset in ASSETS if asset["status"] == "READY_FOR_HUMAN_ASSET_PRODUCTION"),
        "blocked_count": sum(1 for asset in ASSETS if asset["status"].startswith("BLOCKED")),
        "first_ready_asset": "FINAL-ENV-P-001",
        "reference_count": len(reference_rows),
        "source_reference_count": len(SOURCE_REFERENCES),
        "overlay_count": len(OVERLAY_SPECS),
        "h07_status": "OPEN_CONTROLLED_ART_DIRECTION_ONLY_NO_BINARY_REUSE",
        "outputs": [
            {"file": path.name, "bytes": path.stat().st_size, "sha256": sha256(path)}
            for path in hash_targets
        ],
    }
    (OUTPUT_DIR / "final_021d_environment_family_summary.json").write_text(
        json.dumps(summary, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
        newline="\n",
    )
    return reference_rows


def external_readme() -> str:
    return """# GVO_FINAL_021D — Environment reference pack

Estado: `REFERENCE_ONLY / NOT_RUNTIME`

Este paquete contiene únicamente referencias internas curadas y overlays
documentales para producir la familia Environment del Mirador uno por uno. No
contiene assets finales y no debe copiarse a runtime ni `current-used`.

## Primer asset

Producir únicamente `FINAL-ENV-P-001 — final_environment_portrait_v01.webp`.
Adjuntar, en este orden:

1. `R01_08_pantalla_final_mirador.png`
2. `O01_env_portrait_generation_overlay.png`
3. `R13_world5_environment_portrait.webp`

No iniciar `FINAL-ENV-L-001` hasta revisar humanamente el portrait.

## Sets exactos posteriores

- ENV-L: R01, O02, R14.
- DEPTH-P: O03, R10, R11, R01.
- DEPTH-L: O04, R10, R11, R01.
- MIRADOR-P: R01, O05, R02, R12, R15.
- MIRADOR-L: R01, O06, R02, R12, R15.

## H07 y reglas de uso

- Las referencias con licencia específica no documentada son sólo dirección,
  composición o materialidad interna; nunca reutilización binaria.
- No copiar texto, portales, Lía, siluetas, texturas ni layout literal.
- Los overlays son guías geométricas, no arte.
- Verificar cada archivo con `reference_manifest.json` antes de adjuntarlo.
- Conservar la salida original de la herramienta y editar sólo una copia en
  Photopea después de aprobar la composición.
"""


def create_external_pack(reference_rows: list[dict[str, Any]]) -> None:
    if EXTERNAL_DIR.exists() or EXTERNAL_ZIP.exists():
        raise FileExistsError(
            f"Refusing to overwrite existing external package: {EXTERNAL_DIR} / {EXTERNAL_ZIP}"
        )
    EXTERNAL_DIR.mkdir(parents=False, exist_ok=False)

    external_records: list[dict[str, Any]] = []
    by_id = {row["reference_id"]: row for row in reference_rows}
    for reference in SOURCE_REFERENCES:
        external_name = reference.get("external_name")
        if not external_name:
            continue
        source = REPO_ROOT / str(reference["source_path"])
        destination = EXTERNAL_DIR / str(external_name)
        shutil.copyfile(source, destination)
        if sha256(source) != sha256(destination):
            raise RuntimeError(f"Byte identity failed for {destination}")
        external_records.append({
            **by_id[str(reference["reference_id"])],
            "external_file": destination.name,
            "external_sha256": sha256(destination),
            "byte_identical_to_source": True,
        })

    overlay_external_names = {
        "O01": "O01_env_portrait_generation_overlay.png",
        "O02": "O02_env_landscape_generation_overlay.png",
        "O03": "O03_depth_portrait_layer_map.png",
        "O04": "O04_depth_landscape_layer_map.png",
        "O05": "O05_mirador_portrait_exclusion_map.png",
        "O06": "O06_mirador_landscape_exclusion_map.png",
    }
    for ref_id, external_name in overlay_external_names.items():
        row = by_id[ref_id]
        source = REPO_ROOT / row["source_path"]
        destination = EXTERNAL_DIR / external_name
        shutil.copyfile(source, destination)
        if sha256(source) != sha256(destination):
            raise RuntimeError(f"Byte identity failed for {destination}")
        external_records.append({
            **row,
            "external_file": destination.name,
            "external_sha256": sha256(destination),
            "byte_identical_to_source": True,
        })

    (EXTERNAL_DIR / "REFERENCE_PACK_README.md").write_text(external_readme(), encoding="utf-8", newline="\n")
    manifest_payload = {
        "ticket": "GVO_FINAL_021D",
        "classification": "REFERENCE_ONLY_NOT_RUNTIME",
        "source_count": len(external_records),
        "h07_status": "OPEN_CONTROLLED_ART_DIRECTION_ONLY_NO_BINARY_REUSE",
        "files": external_records,
    }
    (EXTERNAL_DIR / "reference_manifest.json").write_text(
        json.dumps(manifest_payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
        newline="\n",
    )

    with zipfile.ZipFile(EXTERNAL_ZIP, "x", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for path in sorted(EXTERNAL_DIR.iterdir()):
            archive.write(path, arcname=f"{EXTERNAL_DIR.name}/{path.name}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--external-pack", action="store_true", help="Create the Downloads folder and ZIP once")
    args = parser.parse_args()
    reference_rows = generate_repo_package()
    if args.external_pack:
        create_external_pack(reference_rows)
    print(json.dumps({
        "repo_output": str(OUTPUT_DIR),
        "briefs": len(ASSETS),
        "references": len(reference_rows),
        "overlays": len(OVERLAY_SPECS),
        "external_created": args.external_pack,
        "external_folder": str(EXTERNAL_DIR) if args.external_pack else None,
        "external_zip": str(EXTERNAL_ZIP) if args.external_pack else None,
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
