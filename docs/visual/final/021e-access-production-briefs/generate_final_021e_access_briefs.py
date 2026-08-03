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
REPO_ROOT = OUTPUT_DIR.parents[3]
DOWNLOADS = Path(r"C:\Users\JOSE DAVID\Downloads")
EXTERNAL_DIR = DOWNLOADS / "GVO_FINAL_021E_ACCESS_REFERENCE_PACK"
EXTERNAL_ZIP = DOWNLOADS / "GVO_FINAL_021E_ACCESS_REFERENCE_PACK.zip"
H07 = "OPEN_CONTROLLED_ART_DIRECTION_ONLY_NO_BINARY_REUSE"

FONT_REGULAR = Path(r"C:\Windows\Fonts\consola.ttf")
FONT_BOLD = Path(r"C:\Windows\Fonts\consolab.ttf")

PALETTE = {
    "deep": "#1D221C",
    "moss": "#4E5B27",
    "wood": "#795537",
    "parchment": "#E1B171",
    "amber": "#F1C376",
    "sunset": "#E7A35B",
    "lilac": "#AE7EA3",
    "violet": "#583955",
    "signal": "#68AABF",
    "cream": "#F4E8C9",
    "red": "#D46A64",
}

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

ENVIRONMENT_REFERENCES = [
    {
        "reference_id": "E01",
        "filename": "final_environment_portrait_v01.webp",
        "source_path": str(DOWNLOADS / "I1" / "final_environment_portrait_v01.webp"),
        "expected_canvas": "1440x2560",
        "expected_alpha": "no",
        "assets_served": "FINAL-ACCESS-I-001;FINAL-ACCESS-II-001;FINAL-ACCESS-III-001;FINAL-ACCESS-IV-001;FINAL-ACCESS-V-001",
        "reason": "Cámara portrait aprobada, paleta, horizonte y escala ambiental",
    },
    {
        "reference_id": "E02",
        "filename": "final_environment_landscape_v01.webp",
        "source_path": str(DOWNLOADS / "I2" / "final_environment_landscape_v01.webp"),
        "expected_canvas": "2560x1440",
        "expected_alpha": "no",
        "assets_served": "FINAL-ACCESS-I-001;FINAL-ACCESS-II-001;FINAL-ACCESS-III-001;FINAL-ACCESS-IV-001;FINAL-ACCESS-V-001",
        "reason": "Cámara landscape aprobada, paleta, horizonte y escala ambiental",
    },
    {
        "reference_id": "E03",
        "filename": "final_valley_depth_portrait_v01.webp",
        "source_path": str(DOWNLOADS / "I3" / "final_valley_depth_portrait_v01.webp"),
        "expected_canvas": "1440x2560",
        "expected_alpha": "yes",
        "assets_served": "FINAL-ACCESS-I-001;FINAL-ACCESS-II-001;FINAL-ACCESS-III-001;FINAL-ACCESS-IV-001;FINAL-ACCESS-V-001",
        "reason": "Profundidad portrait aprobada y relación de alpha con los accesos",
    },
    {
        "reference_id": "E04",
        "filename": "final_valley_depth_landscape_v01.webp",
        "source_path": str(DOWNLOADS / "I4" / "final_valley_depth_landscape_v01.webp"),
        "expected_canvas": "2560x1440",
        "expected_alpha": "yes",
        "assets_served": "FINAL-ACCESS-I-001;FINAL-ACCESS-II-001;FINAL-ACCESS-III-001;FINAL-ACCESS-IV-001;FINAL-ACCESS-V-001",
        "reason": "Profundidad landscape aprobada y relación de alpha con los accesos",
    },
    {
        "reference_id": "E05",
        "filename": "final_mirador_foreground_portrait_v01.webp",
        "source_path": str(DOWNLOADS / "I5" / "final_mirador_foreground_portrait_v01.webp"),
        "expected_canvas": "1440x1280",
        "expected_alpha": "yes",
        "assets_served": "FINAL-ACCESS-I-001;FINAL-ACCESS-II-001;FINAL-ACCESS-III-001;FINAL-ACCESS-IV-001;FINAL-ACCESS-V-001;FINAL-PLATE-LABEL-001",
        "reason": "Foreground portrait aprobado para encaje, oclusión y materialidad",
    },
    {
        "reference_id": "E06",
        "filename": "final_mirador_foreground_landscape_v01.webp",
        "source_path": str(DOWNLOADS / "I6" / "final_mirador_foreground_landscape_v01.webp"),
        "expected_canvas": "2560x900",
        "expected_alpha": "yes",
        "assets_served": "FINAL-ACCESS-I-001;FINAL-ACCESS-II-001;FINAL-ACCESS-III-001;FINAL-ACCESS-IV-001;FINAL-ACCESS-V-001;FINAL-PLATE-LABEL-001",
        "reason": "Foreground landscape aprobado para encaje, oclusión y materialidad",
    },
]

ASSETS = [
    {
        "id": "FINAL-ACCESS-I-001",
        "filename": "final_access_world1_root_v01.webp",
        "narrative": "Memoria de Raíz.",
        "visual": "Mini escena flotante con pedestal vegetal, brote vivo y raíces visibles.",
        "consumer": "FinalAccessCard[I]",
        "state_layer": "/final / acceso I; imagen decorativa dentro del botón; z30.",
        "canvas": "1024x1024",
        "ratio": "1:1 square",
        "format": "WebP alpha",
        "alpha": "Transparencia real; fondo completamente transparente.",
        "orientation": "Asset único compatible con portrait y landscape.",
        "z": "30",
        "safe": "Silueta dentro del 14–86 % de x/y; 10–16 % de alpha exterior por lado; sombra dentro de x=12–88 %, y=76–88 %.",
        "runtime_size": "88 px mínimo de lectura; objetivo 96–112 px en el gate 375x667 y 88–104 px en 667x375.",
        "mandatory": "Pedestal/isla vegetal pequeña; brote vivo; raíces claras; luz cálida/dorada contenida; piedra y vegetación comunes.",
        "prohibited": "Texto, números, puerta literal, manos, personaje, maceta dominante, fondo completo, escena W1 copiada, halo grande.",
        "subject_prompt": "a small floating planted stone islet with one living sprout and clearly visible branching roots, restrained warm golden light",
        "framing": "Sujeto visible 68–78 % del ancho y alto; centro óptico dentro del 8 % central; raíces legibles sin tocar el borde.",
        "local_refs": ["W1C", "W1P", "W1R"],
        "take": "W1C: vocabulario de Raíz; W1P: silueta de brote; W1R: ramificación legible. Common: cámara, paleta, escala y encaje.",
        "do_not_copy": "No copiar el background, la planta o las raíces como binario ni reproducir su silueta exacta.",
        "dependencies": "Art Bible/cámara 021C; referencias Environment auditadas; producir primero; no requiere otro acceso.",
        "order": 1,
        "max_bytes": 184320,
    },
    {
        "id": "FINAL-ACCESS-II-001",
        "filename": "final_access_world2_pulse_v01.webp",
        "narrative": "Memoria de Pulso invisible.",
        "visual": "Mini escena flotante de planta y área reservada para una señal violeta.",
        "consumer": "FinalAccessCard[II]",
        "state_layer": "/final / acceso II; imagen decorativa dentro del botón; z30.",
        "canvas": "1024x1024",
        "ratio": "1:1 square",
        "format": "WebP alpha",
        "alpha": "Transparencia real; fondo completamente transparente.",
        "orientation": "Asset único compatible con portrait y landscape.",
        "z": "30",
        "safe": "Silueta dentro del 14–86 % de x/y; 10–16 % de alpha exterior; reservar un arco limpio dentro del bbox para FX futuro.",
        "runtime_size": "88 px mínimo de lectura; objetivo 96–112 px portrait y 88–104 px landscape.",
        "mandatory": "Planta reconocible; relación planta–pulso; reserva visible para señal violeta; base material común.",
        "prohibited": "Texto técnico, dashboard, loop horneado, fondo completo, captura W2, halo que ocupe todo el canvas.",
        "subject_prompt": "a small floating stone-and-moss islet with a recognizable living plant and a restrained open arc reserved for one violet bioelectric pulse",
        "framing": "Planta y reserva de señal forman una sola silueta 68–78 %; el pulso futuro no queda detrás del label.",
        "local_refs": ["W2C", "W2P", "W2W", "W2N"],
        "take": "W2C: relación planta-señal; W2P: identidad vegetal; W2W: ritmo lineal; W2N: foco violeta. Common: escala y encaje.",
        "do_not_copy": "No copiar planta, waveform, core o constelación; no hornear una animación completa.",
        "dependencies": "Acceso I producido y revisado; Art Bible/cámara; Environment auditado.",
        "order": 2,
        "max_bytes": 184320,
    },
    {
        "id": "FINAL-ACCESS-III-001",
        "filename": "final_access_world3_notebook_v01.webp",
        "narrative": "Memoria de Cuaderno de pruebas.",
        "visual": "Mini escena flotante con cuaderno abierto de silueta inmediata.",
        "consumer": "FinalAccessCard[III]",
        "state_layer": "/final / acceso III; imagen decorativa dentro del botón; z30.",
        "canvas": "1024x1024",
        "ratio": "1:1 square",
        "format": "WebP alpha",
        "alpha": "Transparencia real; fondo completamente transparente.",
        "orientation": "Asset único compatible con portrait y landscape.",
        "z": "30",
        "safe": "Silueta dentro del 14–86 %; alpha exterior 10–16 %; páginas abiertas sin perspectiva extrema.",
        "runtime_size": "88 px mínimo de lectura; objetivo 96–112 px portrait y 88–104 px landscape.",
        "mandatory": "Cuaderno abierto; páginas claras; marcas pictóricas abstractas mínimas; pedestal/isla común.",
        "prohibited": "Frases, letras, números, fórmulas, UI, contenido pedagógico, captura completa de W3.",
        "subject_prompt": "a small floating stone-and-moss islet holding one open field notebook with a strong readable silhouette and only a few abstract pictographic marks",
        "framing": "Cuaderno abierto ocupa el centro y conserva 68–78 % de ocupación; lomo y dos páginas reconocibles a 88 px.",
        "local_refs": ["W3C", "W3B", "W3M"],
        "take": "W3C: memoria general; W3B: silueta/material; W3M: economía de marcas abstractas. Common: paleta y escala.",
        "do_not_copy": "No reutilizar el cuaderno ni la hoja de marcas; no replicar símbolos específicos.",
        "dependencies": "Acceso II producido y revisado; Art Bible/cámara; Environment auditado.",
        "order": 3,
        "max_bytes": 184320,
    },
    {
        "id": "FINAL-ACCESS-IV-001",
        "filename": "final_access_world4_system_v01.webp",
        "narrative": "Memoria de Mesa de sistema.",
        "visual": "Mini escena flotante con mesa técnica y red de nodos resumida.",
        "consumer": "FinalAccessCard[IV]",
        "state_layer": "/final / acceso IV; imagen decorativa dentro del botón; z30.",
        "canvas": "1024x1024",
        "ratio": "1:1 square",
        "format": "WebP alpha",
        "alpha": "Transparencia real; fondo completamente transparente.",
        "orientation": "Asset único compatible con portrait y landscape.",
        "z": "30",
        "safe": "Silueta dentro del 14–86 %; alpha exterior 10–16 %; red contenida dentro de la superficie.",
        "runtime_size": "88 px mínimo de lectura; objetivo 96–112 px portrait y 88–104 px landscape.",
        "mandatory": "Mesa/superficie pequeña; 3–5 nodos resumidos; una relación de red clara; base material común.",
        "prohibited": "Dashboard, texto, cables densos, captura W4, monitor dominante, red completa o pulsos activos horneados.",
        "subject_prompt": "a small floating stone-and-wood technical table with three to five simplified connected nodes, immediately readable as a compact system",
        "framing": "Mesa y red funcionan como una masa 68–78 %; la lectura no depende de líneas de menos de 3 px en el source.",
        "local_refs": ["W4C", "W4T", "W4R", "W4N"],
        "take": "W4C: síntesis de familia; W4T: masa de mesa; W4R: arco de red; W4N: jerarquía de nodo. Common: materialidad.",
        "do_not_copy": "No reutilizar mesa, ruta ni nodo; no replicar la mesa runtime completa.",
        "dependencies": "Acceso III producido y revisado; Art Bible/cámara; Environment auditado.",
        "order": 4,
        "max_bytes": 184320,
    },
    {
        "id": "FINAL-ACCESS-V-001",
        "filename": "final_access_world5_map_v01.webp",
        "narrative": "Memoria de Mapa del presente.",
        "visual": "Mini escena flotante con mapa/tablero resumido y zona preparada para ping.",
        "consumer": "FinalAccessCard[V]",
        "state_layer": "/final / acceso V; imagen decorativa dentro del botón; z30.",
        "canvas": "1024x1024",
        "ratio": "1:1 square",
        "format": "WebP alpha",
        "alpha": "Transparencia real; fondo completamente transparente.",
        "orientation": "Asset único compatible con portrait y landscape.",
        "z": "30",
        "safe": "Silueta dentro del 14–86 %; alpha exterior 10–16 %; marcador futuro dentro del bbox y lejos del label.",
        "runtime_size": "88 px mínimo de lectura; objetivo 96–112 px portrait y 88–104 px landscape.",
        "mandatory": "Mapa/tablero compacto; síntesis espacial; marcador o zona preparada para ping; base material común.",
        "prohibited": "Texto, geografía nueva, mapa runtime completo, controles, cuatro áreas copiadas, ping animado horneado.",
        "subject_prompt": "a small floating stone-and-wood observation map board with a simple abstract spatial layout and one restrained clear area reserved for a future ping",
        "framing": "Tablero y base ocupan 68–78 %; borde y zona de ping se distinguen a 88 px sin texto.",
        "local_refs": ["W5C", "W5E", "W5P", "W5S"],
        "take": "W5C: síntesis visual; W5E: idea de mapa/cavidad; W5P/W5S: vocabulario de sectores. Common: cámara y materialidad.",
        "do_not_copy": "No copiar el mapa, cavidad, plantas, dispositivo ni organización de cuatro áreas.",
        "dependencies": "Acceso IV producido y revisado; Art Bible/cámara; Environment auditado.",
        "order": 5,
        "max_bytes": 184320,
    },
    {
        "id": "FINAL-PLATE-LABEL-001",
        "filename": "final_access_label_backplate_v01.png",
        "narrative": "Placa común que nombra cada memoria mediante texto DOM.",
        "visual": "Backplate 9-slice reutilizable de pergamino/madera/bronce, sin contenido horneado.",
        "consumer": "FinalAccessLabel",
        "state_layer": "/final; backplate bajo el texto DOM; z42.",
        "canvas": "1024x256",
        "ratio": "Widest supported landscape framing; final ratio 4:1",
        "format": "PNG RGBA",
        "alpha": "Transparencia real fuera de la placa; interior con contraste estable.",
        "orientation": "Una placa reutilizable en portrait y landscape.",
        "z": "42",
        "safe": "Insets propuestos: top=64, right=112, bottom=64, left=112 px. Texto seguro: x=144–880, y=56–200.",
        "runtime_size": "Altura visual objetivo 28–40 px; ancho variable por label; esquinas sin escalado y centro extensible.",
        "mandatory": "Centro horizontal extensible; esquinas estables; borde mínimo 8 px source; pergamino/madera/bronce; contraste para cinco labels DOM.",
        "prohibited": "Texto, letras, romanos, iconos, números, estiramiento no uniforme, ornamento central que impida expansión.",
        "subject_prompt": "one empty reusable horizontal label backplate made of warm parchment, subtle wood and restrained bronze, stable corner caps and a clean repeatable center strip",
        "framing": "Placa aislada con relación visual mínima 3.6:1 dentro del ratio más ancho soportado. Si no se logra, generar caps y centro coordinados por partes.",
        "local_refs": ["PLC", "PLW1", "PLW2", "PLD"],
        "take": "PLC: comparación; PLW1/PLW2: estabilidad de bordes y centro; PLD: contraste pergamino. O05 gobierna insets y pruebas.",
        "do_not_copy": "No reutilizar ningún backplate; no copiar contorno, color o brillo literal.",
        "dependencies": "Cinco accesos producidos y revisados; tokens 9-slice documentales; prueba con los cinco labels DOM.",
        "order": 6,
        "max_bytes": 92160,
    },
]

COMMON_ACCESS_REFS = ["C01", "E01", "E02", "E05", "E06", "O01", "O02", "O03", "O04"]
PLATE_COMMON_REFS = ["C01", "E05", "E06", "O01", "O02", "O05"]


def source_row(
    reference_id: str,
    source_path: str,
    display_name: str,
    current_consumer: str,
    provenance: str,
    license_status: str,
    approved_use: str,
    assets_served: str,
    reason: str,
    attachment_priority: str,
    do_not_copy: str,
    pack_folder: str,
    external_name: str,
) -> dict[str, str]:
    return {
        "reference_id": reference_id,
        "source_path": source_path,
        "display_name": display_name,
        "current_consumer": current_consumer,
        "provenance": provenance,
        "license_status": license_status,
        "approved_use": approved_use,
        "assets_served": assets_served,
        "reason": reason,
        "attachment_priority": attachment_priority,
        "do_not_copy": do_not_copy,
        "pack_folder": pack_folder,
        "external_name": external_name,
    }


SOURCE_REFERENCES = [
    source_row(
        "C01",
        "docs/narrative/visual_refs/08_pantalla_final_mirador.png",
        "Referencia canónica Mirador",
        "Documentación narrativa",
        "Repositorio; auditada por 021B y aprobada como dirección por 021C",
        "NO_DOCUMENTADA; uso interno sólo como dirección artística",
        "ART_DIRECTION_ONLY",
        "FINAL-ACCESS-I-001;FINAL-ACCESS-II-001;FINAL-ACCESS-III-001;FINAL-ACCESS-IV-001;FINAL-ACCESS-V-001;FINAL-PLATE-LABEL-001",
        "Cámara, tono, materialidad y patrón de cinco accesos",
        "COMMON:1",
        "YES; no copiar layout, texto, portales, Lía u ornamento literal",
        "COMMON",
        "C01_08_pantalla_final_mirador.png",
    ),
]

for env in ENVIRONMENT_REFERENCES:
    SOURCE_REFERENCES.append(
        source_row(
            env["reference_id"],
            env["source_path"],
            f"Environment aprobado — {env['filename']}",
            "APPROVED_PRODUCTION_REFERENCE / NOT_RUNTIME",
            "Producción aprobada localizada en Descargas y auditada por GVO_FINAL_021E",
            "PRODUCTION_REFERENCE; no licencia de reutilización binaria inferida",
            "COMPOSITION_ALIGNMENT_REFERENCE",
            env["assets_served"],
            env["reason"],
            f"COMMON:{int(env['reference_id'][1:]) + 1}",
            "YES; usar cámara, paleta, escala y encaje; no copiar píxeles al asset nuevo",
            "COMMON",
            env["filename"],
        )
    )

SOURCE_REFERENCES.extend(
    [
        source_row("W1C", "docs/visual/final/021b-preproduction/final_021b_world1_memory_candidates.png", "Contact sheet Mundo I", "GVO_FINAL_021B documentación", "Generación documental 021B; aprobación visual 021C", "PROJECT_DOCUMENTATION", "IDENTITY_REFERENCE", "FINAL-ACCESS-I-001", "Memoria visual de Raíz y prohibiciones de copia", "ACCESS-I:1", "YES; documento, no arte", "FINAL-ACCESS-I-001", "W1C_world1_memory_candidates.png"),
        source_row("W1P", "public/assets/gvo/current-used/world-1-root/plant/world1_root_young_plant_approved_v1.png", "W1 brote joven", "World1RootScreen", "Manifest W1; fuente local Downloads/MUNDO1", "NO_DOCUMENTADA; referencia solamente", "IDENTITY_REFERENCE", "FINAL-ACCESS-I-001", "Silueta de brote vivo", "ACCESS-I:2", "YES; no copiar silueta ni binario", "FINAL-ACCESS-I-001", "W1P_world1_young_plant.png"),
        source_row("W1R", "public/assets/gvo/current-used/world-1-root/roots/world1_root_roots_base_approved_v1.png", "W1 raíces", "World1RootScreen", "Manifest W1; fuente local Downloads/MUNDO1", "NO_DOCUMENTADA; referencia solamente", "IDENTITY_REFERENCE", "FINAL-ACCESS-I-001", "Ramificación y lectura de raíz", "ACCESS-I:3", "YES; no copiar forma ni binario", "FINAL-ACCESS-I-001", "W1R_world1_roots.png"),
        source_row("W2C", "docs/visual/final/021b-preproduction/final_021b_world2_memory_candidates.png", "Contact sheet Mundo II", "GVO_FINAL_021B documentación", "Generación documental 021B; aprobación visual 021C", "PROJECT_DOCUMENTATION", "IDENTITY_REFERENCE", "FINAL-ACCESS-II-001", "Relación planta–pulso y síntesis de memoria", "ACCESS-II:1", "YES; documento, no arte", "FINAL-ACCESS-II-001", "W2C_world2_memory_candidates.png"),
        source_row("W2P", "public/assets/gvo/current-used/world-2-root/plant/world2_main_living_plant_v01.png", "W2 planta viva", "world2RuntimeAssets/World2RootScreen", "Copiado desde Descargas según README", "PATH_LICENSE_EXACTOS_NO_DOCUMENTADOS; referencia solamente", "IDENTITY_REFERENCE", "FINAL-ACCESS-II-001", "Identidad de planta bioeléctrica", "ACCESS-II:2", "YES; no copiar planta ni binario", "FINAL-ACCESS-II-001", "W2P_world2_living_plant.png"),
        source_row("W2W", "public/assets/gvo/current-used/world-2-root/signal/world2_raw_bioelectric_waveform_v01.png", "W2 waveform bioeléctrico", "world2RuntimeAssets/World2RootScreen", "Copiado desde Descargas según README", "PATH_LICENSE_EXACTOS_NO_DOCUMENTADOS; referencia solamente", "ART_DIRECTION_ONLY", "FINAL-ACCESS-II-001", "Ritmo visual de señal violeta", "ACCESS-II:3", "YES; no copiar waveform ni binario", "FINAL-ACCESS-II-001", "W2W_world2_waveform.png"),
        source_row("W2N", "public/assets/gvo/current-used/world-2-root/signal/world2_pulse_core_node_v01.png", "W2 núcleo de pulso", "world2RuntimeAssets/World2RootScreen", "Copiado desde Descargas según README", "PATH_LICENSE_EXACTOS_NO_DOCUMENTADOS; referencia solamente", "ART_DIRECTION_ONLY", "FINAL-ACCESS-II-001", "Foco violeta contenido", "ACCESS-II:4", "YES; no copiar halo ni binario", "FINAL-ACCESS-II-001", "W2N_world2_pulse_core.png"),
        source_row("W3C", "docs/visual/final/021b-preproduction/final_021b_world3_memory_candidates.png", "Contact sheet Mundo III", "GVO_FINAL_021B documentación", "Generación documental 021B; aprobación visual 021C", "PROJECT_DOCUMENTATION", "IDENTITY_REFERENCE", "FINAL-ACCESS-III-001", "Memoria visual de Cuaderno de pruebas", "ACCESS-III:1", "YES; documento, no arte", "FINAL-ACCESS-III-001", "W3C_world3_memory_candidates.png"),
        source_row("W3B", "public/assets/gvo/current-used/world-3-root/notebook/world3_notebook_open_base_v01.png", "W3 cuaderno abierto", "World3RootScreen", "W3 runtime aprobado", "NO_DOCUMENTADA; referencia solamente", "IDENTITY_REFERENCE", "FINAL-ACCESS-III-001", "Silueta y materialidad del cuaderno", "ACCESS-III:2", "YES; no copiar cuaderno ni binario", "FINAL-ACCESS-III-001", "W3B_world3_notebook_open.png"),
        source_row("W3M", "public/assets/gvo/current-used/world-3-root/index/world3_index_notebook_marks_sheet_v01.png", "W3 marcas pictóricas", "World3IndexNotebookMarks", "W3 runtime aprobado", "NO_DOCUMENTADA; referencia solamente", "ART_DIRECTION_ONLY", "FINAL-ACCESS-III-001", "Economía de marcas pictóricas abstractas", "ACCESS-III:3", "YES; no copiar símbolos ni binario", "FINAL-ACCESS-III-001", "W3M_world3_notebook_marks.png"),
        source_row("W4C", "docs/visual/final/021b-preproduction/final_021b_world4_memory_candidates.png", "Contact sheet Mundo IV", "GVO_FINAL_021B documentación", "Generación documental 021B; aprobación visual 021C", "PROJECT_DOCUMENTATION", "IDENTITY_REFERENCE", "FINAL-ACCESS-IV-001", "Memoria visual de Mesa de sistema", "ACCESS-IV:1", "YES; documento, no arte", "FINAL-ACCESS-IV-001", "W4C_world4_memory_candidates.png"),
        source_row("W4T", "public/assets/gvo/current-used/world-4-root/table/world4_table_top_v01.png", "W4 superficie de mesa", "World4Stage", "W4 runtime HUMAN_APPROVED", "NO_DOCUMENTADA; referencia solamente", "MATERIAL_REFERENCE", "FINAL-ACCESS-IV-001", "Masa, borde y perspectiva de mesa", "ACCESS-IV:2", "YES; no copiar forma ni binario", "FINAL-ACCESS-IV-001", "W4T_world4_table_top.png"),
        source_row("W4R", "public/assets/gvo/current-used/world-4-root/route/world4_system_route_base_v01.png", "W4 ruta de sistema", "World4Stage", "W4 runtime HUMAN_APPROVED", "NO_DOCUMENTADA; referencia solamente", "ART_DIRECTION_ONLY", "FINAL-ACCESS-IV-001", "Síntesis de red y curva", "ACCESS-IV:3", "YES; no copiar ruta ni binario", "FINAL-ACCESS-IV-001", "W4R_world4_system_route.png"),
        source_row("W4N", "public/assets/gvo/current-used/world-4-root/objects/world4_node_central_system_v01.png", "W4 nodo central", "World4NodeStack", "W4 runtime HUMAN_APPROVED", "NO_DOCUMENTADA; referencia solamente", "IDENTITY_REFERENCE", "FINAL-ACCESS-IV-001", "Jerarquía de nodo técnico", "ACCESS-IV:4", "YES; no copiar nodo ni binario", "FINAL-ACCESS-IV-001", "W4N_world4_central_node.png"),
        source_row("W5C", "docs/visual/final/021b-preproduction/final_021b_world5_memory_candidates.png", "Contact sheet Mundo V", "GVO_FINAL_021B documentación", "Generación documental 021B; aprobación visual 021C", "PROJECT_DOCUMENTATION", "IDENTITY_REFERENCE", "FINAL-ACCESS-V-001", "Memoria visual de Mapa del presente", "ACCESS-V:1", "YES; documento, no arte", "FINAL-ACCESS-V-001", "W5C_world5_memory_candidates.png"),
        source_row("W5E", "public/assets/gvo/current-used/world-5-root/world5_map_environment_portrait_v01.webp", "W5 base de mapa portrait", "world5RuntimeAssets/World5RootScreen", "Manifest ST5-020G; fuente local registrada", "NO_DOCUMENTADA; referencia solamente", "COMPOSITION_ALIGNMENT_REFERENCE", "FINAL-ACCESS-V-001", "Idea de mapa/cavidad y síntesis espacial", "ACCESS-V:2", "YES; no copiar cavidad ni binario", "FINAL-ACCESS-V-001", "W5E_world5_map_environment_portrait.webp"),
        source_row("W5P", "public/assets/gvo/current-used/world-5-root/world5_map_sector_plants_v01.webp", "W5 sector Plantas", "world5RuntimeAssets/World5RootScreen", "Manifest ST5-020G; fuente local registrada", "NO_DOCUMENTADA; referencia solamente", "IDENTITY_REFERENCE", "FINAL-ACCESS-V-001", "Vocabulario de sector y masa", "ACCESS-V:3", "YES; no copiar plantas ni binario", "FINAL-ACCESS-V-001", "W5P_world5_sector_plants.webp"),
        source_row("W5S", "public/assets/gvo/current-used/world-5-root/world5_map_sector_system_v01.webp", "W5 sector Sistema", "world5RuntimeAssets/World5RootScreen", "Manifest ST5-020G; fuente local registrada", "NO_DOCUMENTADA; referencia solamente", "IDENTITY_REFERENCE", "FINAL-ACCESS-V-001", "Vocabulario de marcador/dispositivo", "ACCESS-V:4", "YES; no copiar dispositivo ni binario", "FINAL-ACCESS-V-001", "W5S_world5_sector_system.webp"),
        source_row("PLC", "docs/visual/final/021b-preproduction/final_021b_ui_backplate_candidates.png", "Contact sheet backplates", "GVO_FINAL_021B documentación", "Generación documental 021B; aprobación visual 021C", "PROJECT_DOCUMENTATION", "TECHNICAL_9SLICE_REFERENCE", "FINAL-PLATE-LABEL-001", "Comparación de bordes, centros y materialidad", "PLATE:1", "YES; documento, no arte", "FINAL-PLATE-LABEL-001", "PLC_ui_backplate_candidates.png"),
        source_row("PLW1", "public/assets/gvo/current-used/world-4-root/ui/world4_text_card_backplate_v01.png", "W4 text card backplate", "World4RootScreen", "W4 runtime HUMAN_APPROVED", "NO_DOCUMENTADA; referencia solamente", "TECHNICAL_9SLICE_REFERENCE", "FINAL-PLATE-LABEL-001", "Centro ancho y estabilidad de borde", "PLATE:2", "YES; no copiar contorno ni binario", "FINAL-PLATE-LABEL-001", "PLW1_world4_text_card_backplate.png"),
        source_row("PLW2", "public/assets/gvo/current-used/world-4-root/ui/world4_open_world5_button_backplate_v01.png", "W4 button backplate", "World4RootScreen", "W4 runtime HUMAN_APPROVED", "NO_DOCUMENTADA; referencia solamente", "TECHNICAL_9SLICE_REFERENCE", "FINAL-PLATE-LABEL-001", "Esquinas y centro extensible", "PLATE:3", "YES; no copiar contorno ni binario", "FINAL-PLATE-LABEL-001", "PLW2_world4_button_backplate.png"),
        source_row("PLD", "public/assets/gvo/current-used/world-2-root/dialogue/world2_dialogue_card_mobile_safe_v01.png", "W2 dialogue card", "World2RootScreen", "W2 runtime", "NO_DOCUMENTADA; referencia solamente", "MATERIAL_REFERENCE", "FINAL-PLATE-LABEL-001", "Contraste de centro y borde ornamental", "PLATE:4", "YES; no copiar forma ni binario", "FINAL-PLATE-LABEL-001", "PLD_world2_dialogue_card.png"),
    ]
)

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
    "safe_area",
    "target_runtime_size",
    "dependencies",
    "brief_path",
    "status",
    "production_order",
    "max_bytes_preliminary",
]

ENV_HEADERS = [
    "reference_id",
    "filename",
    "source_path",
    "bytes",
    "sha256",
    "width",
    "height",
    "format",
    "mode",
    "alpha_observed",
    "alpha_expected",
    "alpha_extrema",
    "alpha_bbox",
    "duplicate_count",
    "status",
    "classification",
    "ambiguity",
]

OVERLAY_SPECS = [
    ("O01", "final_021e_access_portrait_alignment_overlay.png", "Portrait alignment overlay", "COMPOSITION_ALIGNMENT_REFERENCE", "FINAL-ACCESS-I-001;FINAL-ACCESS-II-001;FINAL-ACCESS-III-001;FINAL-ACCESS-IV-001;FINAL-ACCESS-V-001;FINAL-PLATE-LABEL-001", "COMMON:8"),
    ("O02", "final_021e_access_landscape_alignment_overlay.png", "Landscape alignment overlay", "COMPOSITION_ALIGNMENT_REFERENCE", "FINAL-ACCESS-I-001;FINAL-ACCESS-II-001;FINAL-ACCESS-III-001;FINAL-ACCESS-IV-001;FINAL-ACCESS-V-001;FINAL-PLATE-LABEL-001", "COMMON:9"),
    ("O03", "final_021e_access_square_safearea_overlay.png", "Square safe-area overlay", "COMPOSITION_ALIGNMENT_REFERENCE", "FINAL-ACCESS-I-001;FINAL-ACCESS-II-001;FINAL-ACCESS-III-001;FINAL-ACCESS-IV-001;FINAL-ACCESS-V-001", "COMMON:10"),
    ("O04", "final_021e_access_family_scale_contact_sheet.png", "Family scale contact sheet", "COMPOSITION_ALIGNMENT_REFERENCE", "FINAL-ACCESS-I-001;FINAL-ACCESS-II-001;FINAL-ACCESS-III-001;FINAL-ACCESS-IV-001;FINAL-ACCESS-V-001", "COMMON:11"),
    ("O05", "final_021e_label_9slice_guide.png", "Label 9-slice guide", "TECHNICAL_9SLICE_REFERENCE", "FINAL-PLATE-LABEL-001", "COMMON:12"),
]


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest().upper()


def resolve_source(source_path: str) -> Path:
    candidate = Path(source_path)
    return candidate if candidate.is_absolute() else REPO_ROOT / candidate


def image_metadata(path: Path) -> dict[str, Any]:
    with Image.open(path) as image:
        has_alpha = "A" in image.getbands() or "transparency" in image.info
        return {
            "width": image.width,
            "height": image.height,
            "mode": image.mode,
            "alpha": "yes" if has_alpha else "no",
        }


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    path = FONT_BOLD if bold else FONT_REGULAR
    if path.is_file():
        return ImageFont.truetype(str(path), size)
    return ImageFont.load_default()


def text(
    draw: ImageDraw.ImageDraw,
    xy: tuple[int, int],
    value: str,
    size: int,
    color: str = "#F4E8C9",
    anchor: str = "la",
    bold: bool = False,
) -> None:
    draw.text(
        xy,
        value,
        font=font(size, bold),
        fill=color,
        anchor=anchor,
        stroke_width=max(1, size // 18),
        stroke_fill="#08110F",
    )


def header(image: Image.Image, title: str, subtitle: str) -> ImageDraw.ImageDraw:
    draw = ImageDraw.Draw(image, "RGBA")
    width, height = image.size
    bar = max(86, int(height * 0.075))
    draw.rectangle((0, 0, width, bar), fill=(10, 24, 21, 246))
    draw.rectangle(
        (2, 2, width - 3, height - 3),
        outline=PALETTE["amber"],
        width=max(3, width // 620),
    )
    text(
        draw,
        (int(width * 0.025), int(bar * 0.17)),
        title,
        max(24, int(bar * 0.29)),
        PALETTE["cream"],
        bold=True,
    )
    text(
        draw,
        (int(width * 0.025), int(bar * 0.61)),
        f"PREPRODUCTION — NOT RUNTIME · {subtitle}",
        max(16, int(bar * 0.19)),
        PALETTE["amber"],
    )
    return draw


def composite_environment(orientation: str) -> Image.Image:
    if orientation == "portrait":
        size = (1440, 2560)
        env = resolve_source(ENVIRONMENT_REFERENCES[0]["source_path"])
        foreground = resolve_source(ENVIRONMENT_REFERENCES[4]["source_path"])
        fg_top = 1280
    else:
        size = (2560, 1440)
        env = resolve_source(ENVIRONMENT_REFERENCES[1]["source_path"])
        foreground = resolve_source(ENVIRONMENT_REFERENCES[5]["source_path"])
        fg_top = 540
    base = Image.new("RGBA", size, "#111915")
    with Image.open(env) as image:
        base.alpha_composite(
            image.convert("RGBA").resize(size, Image.Resampling.LANCZOS)
        )
    with Image.open(foreground) as image:
        base.alpha_composite(image.convert("RGBA"), (0, fg_top))
    base.alpha_composite(Image.new("RGBA", size, (6, 16, 15, 82)))
    return base


def draw_alignment_overlay(orientation: str, filename: str) -> None:
    image = composite_environment(orientation)
    draw = header(
        image,
        f"FINAL ACCESS · {orientation.upper()} ALIGNMENT",
        "APPROVED ENV + FOREGROUND REFERENCE",
    )
    width, height = image.size
    anchors = PORTRAIT_ANCHORS if orientation == "portrait" else LANDSCAPE_ANCHORS
    max_box = 420 if orientation == "portrait" else 400
    min_box = 338
    label_w = 350 if orientation == "portrait" else 310
    label_h = 92 if orientation == "portrait" else 76
    line_w = max(3, width // 650)

    for label, (nx, ny) in anchors.items():
        cx, cy = int(nx * width), int(ny * height)
        draw.rectangle(
            (
                cx - max_box // 2,
                cy - max_box // 2,
                cx + max_box // 2,
                cy + max_box // 2,
            ),
            outline=PALETTE["signal"],
            width=line_w,
        )
        draw.rectangle(
            (
                cx - min_box // 2,
                cy - min_box // 2,
                cx + min_box // 2,
                cy + min_box // 2,
            ),
            outline=PALETTE["amber"],
            width=line_w,
        )
        draw.ellipse(
            (cx - 16, cy - 16, cx + 16, cy + 16),
            fill=PALETTE["lilac"],
        )
        text(
            draw,
            (cx, cy),
            label,
            max(22, width // 64),
            PALETTE["cream"],
            "mm",
            True,
        )
        label_top = cy + max_box // 2 + 16
        draw.rectangle(
            (
                cx - label_w // 2,
                label_top,
                cx + label_w // 2,
                label_top + label_h,
            ),
            fill=(225, 177, 113, 55),
            outline=PALETTE["parchment"],
            width=line_w,
        )
        text(
            draw,
            (cx, label_top + label_h // 2),
            "DOM LABEL",
            max(17, width // 94),
            PALETTE["cream"],
            "mm",
        )

    title_box = (
        int(width * 0.30),
        int(height * 0.07),
        int(width * 0.70),
        int(height * 0.17),
    )
    lia_box = (
        int(width * 0.40),
        int(height * (0.59 if orientation == "portrait" else 0.50)),
        int(width * 0.60),
        int(height * (0.76 if orientation == "portrait" else 0.70)),
    )
    actions_box = (
        int(width * 0.06),
        int(height * (0.79 if orientation == "portrait" else 0.69)),
        int(width * 0.94),
        int(height * (0.88 if orientation == "portrait" else 0.81)),
    )
    credits_box = (
        int(width * 0.10),
        int(height * (0.91 if orientation == "portrait" else 0.86)),
        int(width * 0.90),
        int(height * 0.97),
    )
    for box, label, color in [
        (title_box, "TITLE EXCLUSION", PALETTE["red"]),
        (lia_box, "LIA EXCLUSION", PALETTE["lilac"]),
        (actions_box, "ACTIONS / NO OVERLAP", PALETTE["amber"]),
        (credits_box, "CREDITS / NO OVERLAP", PALETTE["amber"]),
    ]:
        draw.rectangle(box, fill=None, outline=color, width=line_w)
        text(
            draw,
            ((box[0] + box[2]) // 2, (box[1] + box[3]) // 2),
            label,
            max(18, width // 76),
            color,
            "mm",
            True,
        )

    if orientation == "portrait":
        note = "2–1–2 · SOURCE BOX MIN 338 / MAX 420 PX · LABEL BELOW EACH ACCESS"
    else:
        draw.rectangle(
            (
                int(width * 0.055),
                int(height * 0.11),
                int(width * 0.945),
                int(height * 0.80),
            ),
            outline=PALETTE["red"],
            width=line_w,
        )
        note = "ARC I–V · 667×375 IS AN INDEPENDENT GATE · PROTECT I/V EXTREMES"
    text(
        draw,
        (int(width * 0.025), int(height * 0.985)),
        note,
        max(18, width // 70),
        PALETTE["cream"],
        "ls",
        True,
    )
    image.convert("RGB").save(OUTPUT_DIR / filename, "PNG", optimize=True)


def draw_square_safearea(filename: str) -> None:
    size = 1024
    image = Image.new("RGB", (size, size), PALETTE["deep"])
    draw = header(
        image,
        "ACCESS 1024×1024 · SAFE AREA",
        "PLACEHOLDER GEOMETRY ONLY",
    )
    line_w = 4
    draw.rectangle((102, 102, 922, 922), outline=PALETTE["red"], width=line_w)
    draw.rectangle(
        (143, 143, 881, 881),
        outline=PALETTE["signal"],
        width=line_w,
    )
    draw.rectangle(
        (430, 430, 594, 594),
        outline=PALETTE["lilac"],
        width=line_w,
    )
    draw.line((512, 110, 512, 914), fill=PALETTE["cream"], width=2)
    draw.line((110, 512, 914, 512), fill=PALETTE["cream"], width=2)
    draw.rectangle(
        (123, 778, 901, 901),
        fill=(225, 177, 113, 38),
        outline=PALETTE["amber"],
        width=line_w,
    )
    text(
        draw,
        (512, 205),
        "SUBJECT TARGET: 68–78 %",
        28,
        PALETTE["signal"],
        "mm",
        True,
    )
    text(
        draw,
        (512, 474),
        "OPTICAL CENTER",
        24,
        PALETTE["lilac"],
        "mm",
        True,
    )
    text(
        draw,
        (512, 822),
        "SHADOW ALLOWED ONLY INSIDE THIS BAND",
        22,
        PALETTE["amber"],
        "mm",
    )
    text(
        draw,
        (512, 930),
        "10–16 % EXTERIOR ALPHA · NO TEXT ANYWHERE IN FINAL ASSET",
        22,
        PALETTE["red"],
        "mm",
        True,
    )
    preview = Image.new("RGB", (88, 88), PALETTE["deep"])
    pdraw = ImageDraw.Draw(preview)
    pdraw.rectangle((12, 12, 75, 75), outline=PALETTE["signal"], width=2)
    pdraw.ellipse((36, 36, 52, 52), fill=PALETTE["amber"])
    image.paste(preview, (820, 170))
    text(draw, (864, 274), "88 PX CHECK", 18, PALETTE["cream"], "mm")
    image.save(OUTPUT_DIR / filename, "PNG", optimize=True)


def placeholder_master(label: str, color: str) -> Image.Image:
    image = Image.new("RGBA", (1024, 1024), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image, "RGBA")
    draw.ellipse(
        (143, 143, 881, 881),
        fill=(29, 34, 28, 220),
        outline=color,
        width=24,
    )
    draw.rectangle(
        (255, 650, 769, 780),
        fill=(121, 85, 55, 235),
        outline=PALETTE["amber"],
        width=16,
    )
    text(draw, (512, 470), label, 210, color, "mm", True)
    return image


def draw_family_scale(filename: str) -> None:
    image = Image.new("RGB", (2560, 1440), "#14211D")
    draw = header(
        image,
        "ACCESS FAMILY · SCALE CONTACT SHEET",
        "FIVE PLACEHOLDERS, NO FINAL ART",
    )
    colors = [
        PALETTE["amber"],
        PALETTE["lilac"],
        PALETTE["signal"],
        PALETTE["sunset"],
        PALETTE["moss"],
    ]
    labels = ["I", "II", "III", "IV", "V"]
    masters = [
        placeholder_master(label, color)
        for label, color in zip(labels, colors)
    ]

    portrait_box = (90, 180, 690, 1247)
    landscape_box = (820, 210, 2440, 1120)
    draw.rectangle(portrait_box, outline=PALETTE["parchment"], width=5)
    draw.rectangle(landscape_box, outline=PALETTE["parchment"], width=5)
    text(
        draw,
        ((portrait_box[0] + portrait_box[2]) // 2, 145),
        "PORTRAIT 375×667 SIMULATION",
        27,
        PALETTE["cream"],
        "mm",
        True,
    )
    text(
        draw,
        ((landscape_box[0] + landscape_box[2]) // 2, 175),
        "LANDSCAPE 667×375 SIMULATION · GATE",
        27,
        PALETTE["cream"],
        "mm",
        True,
    )

    pscale = (portrait_box[2] - portrait_box[0]) / 375
    for master, label in zip(masters, labels):
        nx, ny = PORTRAIT_ANCHORS[label]
        rendered = master.resize(
            (int(100 * pscale), int(100 * pscale)),
            Image.Resampling.NEAREST,
        )
        cx = int(
            portrait_box[0] + nx * (portrait_box[2] - portrait_box[0])
        )
        cy = int(
            portrait_box[1] + ny * (portrait_box[3] - portrait_box[1])
        )
        image.paste(
            rendered,
            (cx - rendered.width // 2, cy - rendered.height // 2),
            rendered,
        )

    lscale = (landscape_box[2] - landscape_box[0]) / 667
    for master, label in zip(masters, labels):
        nx, ny = LANDSCAPE_ANCHORS[label]
        rendered = master.resize(
            (int(96 * lscale), int(96 * lscale)),
            Image.Resampling.NEAREST,
        )
        cx = int(
            landscape_box[0] + nx * (landscape_box[2] - landscape_box[0])
        )
        cy = int(
            landscape_box[1] + ny * (landscape_box[3] - landscape_box[1])
        )
        image.paste(
            rendered,
            (cx - rendered.width // 2, cy - rendered.height // 2),
            rendered,
        )

    text(
        draw,
        (1280, 1190),
        "EXACT 88 PX REDUCTION CHECK",
        26,
        PALETTE["cream"],
        "mm",
        True,
    )
    start_x = 900
    for index, (master, label) in enumerate(zip(masters, labels)):
        reduced = master.resize((88, 88), Image.Resampling.NEAREST)
        x = start_x + index * 180
        image.paste(reduced, (x, 1230), reduced)
        text(draw, (x + 44, 1340), label, 20, PALETTE["cream"], "mm")
    text(
        draw,
        (2490, 1385),
        "PLACEHOLDER ONLY · SAME APPARENT SCALE · NO REDIMENSION >15 %",
        22,
        PALETTE["amber"],
        "rs",
        True,
    )
    image.save(OUTPUT_DIR / filename, "PNG", optimize=True)


def draw_label_guide(filename: str) -> None:
    image = Image.new("RGB", (1536, 1024), "#14211D")
    draw = header(
        image,
        "LABEL 1024×256 · 9-SLICE GUIDE",
        "DOM TEXT SIMULATION; TEXT IS NOT BAKED",
    )
    x0, y0 = 256, 90
    width, height = 1024, 256
    x1, y1 = x0 + width, y0 + height
    draw.rounded_rectangle(
        (x0, y0, x1, y1),
        radius=42,
        fill=(121, 85, 55, 170),
        outline=PALETTE["amber"],
        width=8,
    )
    for x in (x0 + 112, x1 - 112):
        draw.line((x, y0, x, y1), fill=PALETTE["signal"], width=5)
    for y in (y0 + 64, y1 - 64):
        draw.line((x0, y, x1, y), fill=PALETTE["signal"], width=5)
    draw.rectangle(
        (x0 + 144, y0 + 56, x1 - 144, y1 - 56),
        outline=PALETTE["lilac"],
        width=4,
    )
    text(
        draw,
        (x0 + 56, y0 + 38),
        "STABLE CAP",
        18,
        PALETTE["cream"],
        "mm",
    )
    text(
        draw,
        (x1 - 56, y0 + 38),
        "STABLE CAP",
        18,
        PALETTE["cream"],
        "mm",
    )
    text(
        draw,
        ((x0 + x1) // 2, y0 + 38),
        "REPEAT / STRETCH CENTER",
        20,
        PALETTE["signal"],
        "mm",
        True,
    )
    text(
        draw,
        ((x0 + x1) // 2, (y0 + y1) // 2),
        "SAFE DOM TEXT x=144–880 · y=56–200",
        23,
        PALETTE["cream"],
        "mm",
        True,
    )
    text(
        draw,
        ((x0 + x1) // 2, y1 + 35),
        "INSETS top 64 · right 112 · bottom 64 · left 112 · MIN RIM 8 PX SOURCE",
        21,
        PALETTE["amber"],
        "mm",
    )

    labels = [
        ("I — Raíz", 420),
        ("II — Pulso invisible", 610),
        ("III — Cuaderno de pruebas", 720),
        ("IV — Mesa de sistema", 620),
        ("V — Mapa del presente", 650),
    ]
    start_y = 455
    for index, (label, bar_width) in enumerate(labels):
        y = start_y + index * 98
        left = (1536 - bar_width) // 2
        right = left + bar_width
        draw.rounded_rectangle(
            (left, y, right, y + 64),
            radius=18,
            fill=(225, 177, 113, 48),
            outline=PALETTE["parchment"],
            width=3,
        )
        text(
            draw,
            ((left + right) // 2, y + 32),
            label,
            24,
            PALETTE["cream"],
            "mm",
            True,
        )
        text(
            draw,
            (right + 24, y + 32),
            f"{bar_width}px SIM",
            16,
            PALETTE["signal"],
            "lm",
        )
    text(
        draw,
        (768, 975),
        "PASS: corners unchanged; center expands; no non-uniform stretch",
        20,
        PALETTE["amber"],
        "mm",
        True,
    )
    image.save(OUTPUT_DIR / filename, "PNG", optimize=True)


def exact_reference_lines(asset: dict[str, Any]) -> list[str]:
    common = (
        PLATE_COMMON_REFS
        if asset["id"] == "FINAL-PLATE-LABEL-001"
        else COMMON_ACCESS_REFS
    )
    ids = common + asset["local_refs"]
    lookup = {row["reference_id"]: row for row in SOURCE_REFERENCES}
    lookup.update(
        {
            ref_id: {
                "reference_id": ref_id,
                "display_name": display_name,
                "source_path": (
                    "docs/visual/final/021e-access-production-briefs/"
                    + filename
                ),
            }
            for ref_id, filename, display_name, _, _, _ in OVERLAY_SPECS
        }
    )
    return [
        (
            f"{index}. `{ref_id}` — `{lookup[ref_id]['display_name']}` — "
            f"`{lookup[ref_id]['source_path']}`"
        )
        for index, ref_id in enumerate(ids, start=1)
    ]


def positive_prompt(asset: dict[str, Any]) -> str:
    if asset["id"] == "FINAL-PLATE-LABEL-001":
        return (
            "Create one empty reusable horizontal label backplate for a poetic "
            "pixel-art garden overlook. Use clean warm poetic pixel art, shared "
            "Mirador materiality, warm parchment, subtle wood and restrained "
            "bronze, stable corner caps, a clean repeatable center strip, "
            "transparent background, strong readable silhouette, controlled "
            "detail, mobile readability, same apparent pixel scale as the "
            "provided references, no text, no icons, no numbers, no UI content. "
            "Frame the plate at a visual ratio of at least 3.6:1 inside the widest "
            "supported landscape output, with generous transparent margin. The "
            "center must support deterministic 9-slice horizontal expansion while "
            "corners and top/bottom borders remain unchanged."
        )
    return (
        "Create one independent floating memory mini-scene for the Final "
        f"Mirador: {asset['subject_prompt']}. Clean warm poetic pixel art, "
        "shared Mirador stone and vegetation materiality, transparent square "
        "asset, strong readable silhouette, mobile readability at 88 px, same "
        "apparent pixel scale as the other four access assets, controlled detail, "
        "compatible with portrait and landscape, no copied full-world scene, no "
        "UI, no character, no background environment. The visible subject must "
        "occupy 68–78 percent of both canvas width and height, keep 10–16 percent "
        "transparent alpha margin on every side, and keep the optical center "
        "within 8 percent of canvas center. Use restrained contact shadow only "
        "inside the safe area."
    )


def negative_prompt(asset: dict[str, Any]) -> str:
    common = (
        "text, letters, numbers, roman numerals, logos, watermark, Lía, "
        "characters, humans, animals, full scene, background environment, "
        "complete station screenshot, copied runtime binary, UI, buttons, cards, "
        "large glow, bloom, photorealism, 3D render, anime, mixed pixel scales, "
        "clipped silhouette, subject too small, subject too large, solid "
        "background, shadow outside safe area"
    )
    if asset["id"] == "FINAL-PLATE-LABEL-001":
        return (
            common
            + ", baked label, icon, asymmetric center ornament, non-repeatable "
            "center, distorted corners, thick opaque rectangle, non-uniform "
            "stretching"
        )
    return (
        common
        + ", literal door, five identical portals, long baked directional shadow"
    )


def render_brief(asset: dict[str, Any]) -> str:
    is_plate = asset["id"] == "FINAL-PLATE-LABEL-001"
    refs = "\n".join(exact_reference_lines(asset))
    generation = (
        "Use the widest landscape ratio actually exposed by the selected tool; "
        "do not invent its native pixel dimensions. Generate one isolated plate "
        "with a visual ratio >=3.6:1. If the tool cannot maintain that framing "
        "without a strong crop, stop and generate three coordinated parts—left "
        "cap, repeatable center tile, right cap—then assemble deterministically "
        "in Photopea."
        if is_plate
        else
        "Request a square 1:1 generation. Preserve the original generated file. "
        "Judge framing before editing; do not ask Photopea to repair composition. "
        "Generate one asset only and keep all surrounding pixels transparent."
    )
    photopea = (
        "Open a working copy; create a 1024x256 RGBA document; place "
        "proportionally without non-uniform stretch; use the O05 guide; "
        "set/verify 9-slice insets 64/112/64/112; test the five simulated DOM "
        "widths; inspect corners and borders; remove all generated text; export "
        "PNG RGBA. If one-piece framing cannot reach 4:1 with <=15 % proportional "
        "scaling, assemble approved caps/center parts instead of stretching."
        if is_plate
        else
        "Open a working copy in a 1024x1024 document; verify real alpha; place O03 "
        "above the art; center by visible-content bbox, not empty canvas; allow "
        "only proportional scaling, alpha cleanup and slight centering; never "
        "stretch or reconstruct; inspect at 1024, 256, 128 and 88 px; export WebP "
        "with alpha."
    )
    acceptance = (
        "Canvas 1024x256; RGBA; no text/icons; stable corners; repeatable center; "
        "all five DOM labels fit; contrast survives portrait/landscape; <=90 KiB "
        "without material degradation."
        if is_plate
        else
        "Canvas 1024x1024; WebP alpha; narrative reads at 88 px; bbox obeys O03; "
        "source occupation 68–78 %; common family materiality; no prohibited "
        f"content; <={asset['max_bytes'] // 1024} KiB without material degradation."
    )
    hard_fails = (
        "Any baked text/icon/number; corner distortion; center not repeatable; "
        "non-uniform stretch; unsafe text zone; opaque rectangular background; "
        ">15 % proportional repair; wrong canvas/format; >90 KiB without "
        "justified quality need."
        if is_plate
        else
        "Any text/number/UI/character/background; copied station binary or "
        "silhouette; alpha margin outside 10–16 %; subject outside 68–78 %; "
        "optical center outside 8 %; clipped silhouette; unreadable at 88 px; "
        ">15 % scaling/recomposition; wrong filename/canvas/format."
    )
    export = (
        "Export exactly `final_access_label_backplate_v01.png` as 1024x256 PNG "
        "RGBA; preserve alpha; do not quantize if it harms edge quality; "
        "preliminary budget <=90 KiB."
        if is_plate
        else
        f"Export exactly `{asset['filename']}` as 1024x1024 WebP with alpha; "
        "preserve apparent pixel scale; preliminary budget <=180 KiB."
    )
    return f"""# {asset['id']} — Production brief

Classification: `PREPRODUCTION / NOT RUNTIME`

## 1. ID

`{asset['id']}`

## 2. Filename final

`{asset['filename']}`

## 3. Función narrativa

{asset['narrative']}

## 4. Función visual

{asset['visual']}

## 5. Consumidor

`{asset['consumer']}`

## 6. Estado/capa

{asset['state_layer']}

## 7. Canvas final

`{asset['canvas']}` exacto.

## 8. Ratio de generación

`{asset['ratio']}`. El ratio de la herramienta no sustituye el canvas final.

## 9. Formato final

`{asset['format']}`.

## 10. Alpha/fondo

{asset['alpha']}

## 11. Orientación

{asset['orientation']}

## 12. z-order

`z{asset['z']}`.

## 13. Zona segura dentro del canvas

{asset['safe']}

## 14. Tamaño visual objetivo en runtime

{asset['runtime_size']}

## 15. Contenido obligatorio

{asset['mandatory']}

## 16. Contenido prohibido

{asset['prohibited']}

## 17. Referencias exactas

Adjuntar únicamente este set exacto, en orden:

{refs}

Todas son `REFERENCE_ONLY / NOT_RUNTIME`.

## 18. Prioridad de referencias

El orden anterior es vinculante. La identidad específica precede a las fuentes
binarias individuales; O03/O05 gobierna geometría; O01/O02 gobiernan encaje;
Environment gobierna cámara y paleta.

## 19. Qué tomar de cada una

{asset['take']}

## 20. Qué no copiar

{asset['do_not_copy']} H07 permanece `{H07}`.

## 21. Prompt positivo en inglés

```text
{positive_prompt(asset)}
```

## 22. Prompt negativo en inglés

```text
{negative_prompt(asset)}
```

## 23. Instrucciones de generación

{generation}

## 24. Framing esperado

{asset['framing']} Crop sólo de alpha exterior; crop de silueta o de una parte
narrativa es prohibido.

## 25. Escalado máximo aceptable en Photopea

Máximo `15 %` proporcional respecto al sujeto aprobado. Si requiere más,
estirar, rearmar partes narrativas o reconstruir detalle, regenerar.

## 26. Criterios de aceptación

{acceptance}

## 27. Hard fails

{hard_fails}

## 28. Instrucciones de Photopea

{photopea}

## 29. Exportación

{export}

## 30. Metadata/hash

Reportar filename, canvas, formato, modo, alpha sí/no, bytes, SHA-256, bbox
alpha/visible `x0,y0,x1,y1`, ocupación porcentual x/y, escala aplicada y ruta
del original preservado. No promover a runtime.

## 31. Plantilla de retorno

```text
asset_id:
final_filename:
source_original_path:
working_copy_path:
canvas:
format_mode_alpha:
visible_or_alpha_bbox:
subject_occupancy_x_y:
photopea_scale_percent:
bytes:
sha256:
checks_1024_256_128_88:
hard_fails:
human_review:
runtime_promoted: NO
```

## 32. Dependencias

{asset['dependencies']}

## 33. Estado

`READY_FOR_HUMAN_ASSET_PRODUCTION`. Este estado declara completo el brief, no
el asset. Orden de producción: `{asset['order']}`. No saltar dependencias.
"""


def write_csv(
    path: Path,
    headers: list[str],
    rows: list[dict[str, Any]],
) -> None:
    with path.open("w", encoding="utf-8", newline="") as stream:
        writer = csv.DictWriter(
            stream,
            fieldnames=headers,
            lineterminator="\n",
            extrasaction="ignore",
        )
        writer.writeheader()
        writer.writerows(rows)


def build_environment_manifest() -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    for env in ENVIRONMENT_REFERENCES:
        matches = sorted(
            path
            for path in DOWNLOADS.rglob(env["filename"])
            if EXTERNAL_DIR not in path.parents
        )
        if len(matches) != 1:
            raise RuntimeError(
                f"Expected exactly one {env['filename']} in Downloads; "
                f"observed {len(matches)}: {matches}"
            )
        path = matches[0]
        expected_path = resolve_source(env["source_path"])
        if path.resolve() != expected_path.resolve():
            raise RuntimeError(
                f"Unexpected location for {env['filename']}: {path}"
            )
        with Image.open(path) as image:
            has_alpha = (
                "A" in image.getbands() or "transparency" in image.info
            )
            alpha_extrema = (
                image.getchannel("A").getextrema()
                if "A" in image.getbands()
                else None
            )
            alpha_bbox = (
                image.getchannel("A").getbbox()
                if "A" in image.getbands()
                else None
            )
            canvas = f"{image.width}x{image.height}"
            observed = "yes" if has_alpha else "no"
            ambiguity = ""
            status = "PASS"
            if canvas != env["expected_canvas"]:
                status = "FAIL_CANVAS"
                ambiguity = (
                    f"expected {env['expected_canvas']}, observed {canvas}"
                )
            elif observed != env["expected_alpha"]:
                status = "PASS_WITH_DOCUMENTED_ALPHA_DEVIATION"
                ambiguity = (
                    f"expected alpha={env['expected_alpha']}, "
                    f"observed alpha={observed}"
                )
            rows.append(
                {
                    "reference_id": env["reference_id"],
                    "filename": env["filename"],
                    "source_path": str(path),
                    "bytes": path.stat().st_size,
                    "sha256": sha256(path),
                    "width": image.width,
                    "height": image.height,
                    "format": image.format,
                    "mode": image.mode,
                    "alpha_observed": observed,
                    "alpha_expected": env["expected_alpha"],
                    "alpha_extrema": (
                        json.dumps(alpha_extrema, separators=(",", ":"))
                        if alpha_extrema
                        else ""
                    ),
                    "alpha_bbox": (
                        json.dumps(alpha_bbox, separators=(",", ":"))
                        if alpha_bbox
                        else ""
                    ),
                    "duplicate_count": len(matches),
                    "status": status,
                    "classification": (
                        "APPROVED_PRODUCTION_REFERENCE / NOT_RUNTIME"
                    ),
                    "ambiguity": ambiguity,
                }
            )
    return rows


def build_reference_rows() -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    for reference in SOURCE_REFERENCES:
        path = resolve_source(reference["source_path"])
        if not path.is_file():
            raise FileNotFoundError(path)
        metadata = image_metadata(path)
        rows.append(
            {
                "reference_id": reference["reference_id"],
                "source_path": reference["source_path"].replace("\\", "/"),
                "display_name": reference["display_name"],
                "sha256": sha256(path),
                **metadata,
                "current_consumer": reference["current_consumer"],
                "provenance": reference["provenance"],
                "license_status": reference["license_status"],
                "approved_use": reference["approved_use"],
                "assets_served": reference["assets_served"],
                "reason": reference["reason"],
                "attachment_priority": reference["attachment_priority"],
                "do_not_copy": reference["do_not_copy"],
            }
        )
    for (
        ref_id,
        filename,
        display_name,
        approved_use,
        assets_served,
        priority,
    ) in OVERLAY_SPECS:
        path = OUTPUT_DIR / filename
        metadata = image_metadata(path)
        rows.append(
            {
                "reference_id": ref_id,
                "source_path": str(path.relative_to(REPO_ROOT)).replace(
                    "\\",
                    "/",
                ),
                "display_name": display_name,
                "sha256": sha256(path),
                **metadata,
                "current_consumer": "GVO_FINAL_021E documentation",
                "provenance": (
                    "Guía determinista 021E derivada de contratos 021B/021C "
                    "y referencias Environment aprobadas"
                ),
                "license_status": "PROJECT_DOCUMENTATION",
                "approved_use": approved_use,
                "assets_served": assets_served,
                "reason": (
                    "Geometría, safe areas, escala, no-solape o 9-slice "
                    "contractual"
                ),
                "attachment_priority": priority,
                "do_not_copy": (
                    "YES; guía técnica, nunca arte final ni runtime"
                ),
            }
        )
    return rows


def generate_repo_package() -> list[dict[str, Any]]:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    draw_alignment_overlay(
        "portrait",
        "final_021e_access_portrait_alignment_overlay.png",
    )
    draw_alignment_overlay(
        "landscape",
        "final_021e_access_landscape_alignment_overlay.png",
    )
    draw_square_safearea(
        "final_021e_access_square_safearea_overlay.png"
    )
    draw_family_scale(
        "final_021e_access_family_scale_contact_sheet.png"
    )
    draw_label_guide("final_021e_label_9slice_guide.png")

    for asset in ASSETS:
        (OUTPUT_DIR / f"{asset['id']}_BRIEF.md").write_text(
            render_brief(asset),
            encoding="utf-8",
            newline="\n",
        )

    family_rows = [
        {
            "asset_id": asset["id"],
            "final_filename": asset["filename"],
            "final_canvas": asset["canvas"],
            "generation_ratio": asset["ratio"],
            "final_format": asset["format"],
            "alpha": asset["alpha"],
            "orientation": asset["orientation"],
            "z_order": asset["z"],
            "safe_area": asset["safe"],
            "target_runtime_size": asset["runtime_size"],
            "dependencies": asset["dependencies"],
            "brief_path": (
                "docs/visual/final/021e-access-production-briefs/"
                f"{asset['id']}_BRIEF.md"
            ),
            "status": "READY_FOR_HUMAN_ASSET_PRODUCTION",
            "production_order": asset["order"],
            "max_bytes_preliminary": asset["max_bytes"],
        }
        for asset in ASSETS
    ]
    write_csv(
        OUTPUT_DIR / "final_021e_access_family_manifest.csv",
        FAMILY_HEADERS,
        family_rows,
    )

    environment_rows = build_environment_manifest()
    write_csv(
        OUTPUT_DIR
        / "final_021e_environment_production_reference_manifest.csv",
        ENV_HEADERS,
        environment_rows,
    )

    reference_rows = build_reference_rows()
    write_csv(
        OUTPUT_DIR / "final_021e_access_reference_manifest.csv",
        REFERENCE_HEADERS,
        reference_rows,
    )

    hash_targets = sorted(
        path
        for path in OUTPUT_DIR.iterdir()
        if path.is_file()
        and path.name != "final_021e_access_family_summary.json"
    )
    summary = {
        "ticket": "GVO_FINAL_021E",
        "classification": "PREPRODUCTION_NOT_RUNTIME",
        "brief_count": len(ASSETS),
        "ready_count": len(ASSETS),
        "blocked_count": 0,
        "first_ready_asset": "FINAL-ACCESS-I-001",
        "reference_count": len(reference_rows),
        "source_reference_count": len(SOURCE_REFERENCES),
        "overlay_count": len(OVERLAY_SPECS),
        "environment_reference_count": len(environment_rows),
        "environment_alpha_deviation_count": sum(
            1
            for row in environment_rows
            if row["status"]
            == "PASS_WITH_DOCUMENTED_ALPHA_DEVIATION"
        ),
        "h07_status": H07,
        "runtime_modified": False,
        "final_assets_produced": False,
        "outputs": [
            {
                "file": path.name,
                "bytes": path.stat().st_size,
                "sha256": sha256(path),
            }
            for path in hash_targets
        ],
    }
    (
        OUTPUT_DIR / "final_021e_access_family_summary.json"
    ).write_text(
        json.dumps(summary, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
        newline="\n",
    )
    return reference_rows


def asset_by_id(asset_id: str) -> dict[str, Any]:
    return next(asset for asset in ASSETS if asset["id"] == asset_id)


def attachment_ids(asset: dict[str, Any]) -> list[str]:
    common = (
        PLATE_COMMON_REFS
        if asset["id"] == "FINAL-PLATE-LABEL-001"
        else COMMON_ACCESS_REFS
    )
    return common + asset["local_refs"]


def external_name_for_id(reference_id: str) -> str:
    for reference in SOURCE_REFERENCES:
        if reference["reference_id"] == reference_id:
            return reference["external_name"]
    for ref_id, filename, _, _, _, _ in OVERLAY_SPECS:
        if ref_id == reference_id:
            return filename
    raise KeyError(reference_id)


def folder_readme(
    folder: str,
    rows_by_id: dict[str, dict[str, Any]],
) -> str:
    if folder == "COMMON":
        return f"""# GVO_FINAL_021E — COMMON

Estado: `REFERENCE_ONLY / NOT_RUNTIME`

Contiene únicamente la referencia canónica del Mirador, los seis Environment
aprobados auditados y las cinco guías documentales 021E. No es un depósito de
`current-used` y no autoriza reutilización binaria.

- H07: `{H07}`.
- Los Environment son `APPROVED_PRODUCTION_REFERENCE / NOT_RUNTIME`.
- `final_environment_portrait_v01.webp` conserva una desviación auditada:
  alpha real en dos filas; no editar ni corregir dentro de 021E.
- Cada brief y cada carpeta específica indican el subconjunto exacto a adjuntar.
"""

    asset = asset_by_id(folder)
    lines = []
    for index, ref_id in enumerate(attachment_ids(asset), start=1):
        location = external_name_for_id(ref_id)
        if ref_id not in asset["local_refs"]:
            location = f"../COMMON/{location}"
        lines.append(
            f"{index}. `{ref_id}` — `{location}` — "
            f"{rows_by_id[ref_id]['display_name']}"
        )
    return f"""# {asset['id']} — exact attachment set

Estado: `REFERENCE_ONLY / NOT_RUNTIME`

Producir únicamente `{asset['filename']}` siguiendo el brief versionado.
Adjuntar exactamente, en este orden:

{chr(10).join(lines)}

No copiar binarios, siluetas ni layouts literales. H07 permanece `{H07}`.
"""


def create_external_pack(
    reference_rows: list[dict[str, Any]],
) -> None:
    if EXTERNAL_DIR.exists() or EXTERNAL_ZIP.exists():
        raise FileExistsError(
            f"Refusing to overwrite: {EXTERNAL_DIR} / {EXTERNAL_ZIP}"
        )

    folders = ["COMMON"] + [asset["id"] for asset in ASSETS]
    for folder in folders:
        (EXTERNAL_DIR / folder).mkdir(parents=True, exist_ok=False)

    rows_by_id = {
        row["reference_id"]: row for row in reference_rows
    }
    external_records: list[dict[str, Any]] = []

    for reference in SOURCE_REFERENCES:
        source = resolve_source(reference["source_path"])
        destination = (
            EXTERNAL_DIR
            / reference["pack_folder"]
            / reference["external_name"]
        )
        shutil.copyfile(source, destination)
        if sha256(source) != sha256(destination):
            raise RuntimeError(f"Byte identity failed: {destination}")
        external_records.append(
            {
                **rows_by_id[reference["reference_id"]],
                "pack_relative_path": str(
                    destination.relative_to(EXTERNAL_DIR)
                ).replace("\\", "/"),
                "external_sha256": sha256(destination),
                "byte_identical_to_source": True,
            }
        )

    for ref_id, filename, _, _, _, _ in OVERLAY_SPECS:
        source = OUTPUT_DIR / filename
        destination = EXTERNAL_DIR / "COMMON" / filename
        shutil.copyfile(source, destination)
        if sha256(source) != sha256(destination):
            raise RuntimeError(f"Byte identity failed: {destination}")
        external_records.append(
            {
                **rows_by_id[ref_id],
                "pack_relative_path": str(
                    destination.relative_to(EXTERNAL_DIR)
                ).replace("\\", "/"),
                "external_sha256": sha256(destination),
                "byte_identical_to_source": True,
            }
        )

    external_by_id = {
        row["reference_id"]: row for row in external_records
    }
    common_ids = [
        row["reference_id"]
        for row in SOURCE_REFERENCES
        if row["pack_folder"] == "COMMON"
    ] + [spec[0] for spec in OVERLAY_SPECS]

    for folder in folders:
        folder_path = EXTERNAL_DIR / folder
        (folder_path / "README.md").write_text(
            folder_readme(folder, rows_by_id),
            encoding="utf-8",
            newline="\n",
        )
        if folder == "COMMON":
            payload = {
                "ticket": "GVO_FINAL_021E",
                "folder": folder,
                "classification": "REFERENCE_ONLY_NOT_RUNTIME",
                "h07_status": H07,
                "files": [
                    external_by_id[ref_id]
                    for ref_id in common_ids
                ],
            }
        else:
            asset = asset_by_id(folder)
            payload = {
                "ticket": "GVO_FINAL_021E",
                "folder": folder,
                "final_asset": asset["filename"],
                "classification": "REFERENCE_ONLY_NOT_RUNTIME",
                "h07_status": H07,
                "attachment_order": attachment_ids(asset),
                "local_files": [
                    external_by_id[ref_id]
                    for ref_id in asset["local_refs"]
                ],
                "common_files": [
                    external_by_id[ref_id]
                    for ref_id in attachment_ids(asset)
                    if ref_id not in asset["local_refs"]
                ],
            }
        (folder_path / "manifest.json").write_text(
            json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
            newline="\n",
        )

    root_readme = f"""# GVO_FINAL_021E — Access reference pack

Estado: `REFERENCE_ONLY / NOT_RUNTIME`

Este paquete contiene siete carpetas: una común, cinco para los accesos I–V y
una para la placa. No contiene arte Final producido, no se versiona y no debe
copiarse a `public/assets` ni `current-used`.

Primer asset: `FINAL-ACCESS-I-001 — final_access_world1_root_v01.webp`.
No iniciar `FINAL-ACCESS-II-001` hasta revisar humanamente el acceso I.

H07: `{H07}`.
"""
    (EXTERNAL_DIR / "REFERENCE_PACK_README.md").write_text(
        root_readme,
        encoding="utf-8",
        newline="\n",
    )

    files_before_root_manifest = sorted(
        path for path in EXTERNAL_DIR.rglob("*") if path.is_file()
    )
    root_payload = {
        "ticket": "GVO_FINAL_021E",
        "classification": "REFERENCE_ONLY_NOT_RUNTIME",
        "h07_status": H07,
        "image_reference_count": len(external_records),
        "folder_count": len(folders),
        "files": [
            {
                "path": str(path.relative_to(EXTERNAL_DIR)).replace(
                    "\\",
                    "/",
                ),
                "bytes": path.stat().st_size,
                "sha256": sha256(path),
            }
            for path in files_before_root_manifest
        ],
    }
    (EXTERNAL_DIR / "reference_pack_manifest.json").write_text(
        json.dumps(root_payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
        newline="\n",
    )

    with zipfile.ZipFile(
        EXTERNAL_ZIP,
        "x",
        compression=zipfile.ZIP_DEFLATED,
        compresslevel=9,
    ) as archive:
        for path in sorted(EXTERNAL_DIR.rglob("*")):
            if path.is_file():
                archive.write(
                    path,
                    arcname=(
                        f"{EXTERNAL_DIR.name}/"
                        f"{path.relative_to(EXTERNAL_DIR).as_posix()}"
                    ),
                )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--external-pack", action="store_true")
    args = parser.parse_args()
    reference_rows = generate_repo_package()
    if args.external_pack:
        create_external_pack(reference_rows)
    print(
        json.dumps(
            {
                "repo_output": str(OUTPUT_DIR),
                "briefs": len(ASSETS),
                "references": len(reference_rows),
                "overlays": len(OVERLAY_SPECS),
                "environment_references": len(
                    ENVIRONMENT_REFERENCES
                ),
                "external_created": args.external_pack,
                "external_folder": (
                    str(EXTERNAL_DIR) if args.external_pack else None
                ),
                "external_zip": (
                    str(EXTERNAL_ZIP) if args.external_pack else None
                ),
            },
            ensure_ascii=False,
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
