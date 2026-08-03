"""Genera evidencia determinista de GVO_FINAL_021B.

PREPRODUCTION / NOT_RUNTIME. No modifica ni convierte los assets fuente.
"""

from __future__ import annotations

import csv
import hashlib
import json
import textwrap
from collections import Counter
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


OUTPUT_DIR = Path(__file__).resolve().parent
REPO_ROOT = OUTPUT_DIR.parents[3]

FONT_REGULAR = Path("C:/Windows/Fonts/consola.ttf")
FONT_BOLD = Path("C:/Windows/Fonts/consolab.ttf")

CATEGORY_A = "A — REUTILIZAR SIN DUPLICAR"
CATEGORY_B = "B — REUTILIZAR COMO REFERENCIA, GENERAR NUEVO"
CATEGORY_C = "C — NUEVO ASSET OBLIGATORIO"
CATEGORY_D = "D — CÓDIGO DETERMINISTA"
CATEGORY_E = "E — ASSET DE MOVIMIENTO / SPRITE / FRAMES"
CATEGORY_F = "F — CONDICIONAL, REQUIERE PRUEBA"
CATEGORY_G = "G — DESCARTAR / NO NECESARIO"

INVENTORY_HEADERS = [
    "ID estable",
    "Filename exacto propuesto",
    "Categoría A–G",
    "Función narrativa",
    "Función visual",
    "Consumidor previsto",
    "Estado o pantalla",
    "Canvas",
    "Formato",
    "Opaco/transparente",
    "Orientación",
    "Capa/z-order",
    "Referencias",
    "Reutilización",
    "Movimiento",
    "Criterio asset/código",
    "Dependencias",
    "Riesgo",
    "Prioridad",
    "Criterios de aceptación",
]


def inventory_row(*values: str) -> tuple[str, ...]:
    if len(values) != 20:
        raise ValueError(f"Inventory row must have 20 fields, got {len(values)}")
    return tuple(values)


INVENTORY_ROWS = [
    inventory_row("FINAL-ENV-P-001", "final_environment_portrait_v01.webp", CATEGORY_C, "Cierre contemplativo", "Valle y cielo base", "FinalEnvironmentLayer", "/final", "1440×2560", "WEBP", "Opaco", "Portrait", "z0", "08_pantalla_final_mirador.png", "Nuevo; la referencia no se promueve", "NO NECESARIO", "Asset por materialidad y detalle", "Art Bible y cámara portrait aprobadas", "Cámara o texto horneado", "P0", "Sin texto; safe core central; <=900 KiB; aprobación humana"),
    inventory_row("FINAL-ENV-L-001", "final_environment_landscape_v01.webp", CATEGORY_C, "Cierre contemplativo", "Valle y cielo base 16:9", "FinalEnvironmentLayer", "/final", "2560×1440", "WEBP", "Opaco", "Landscape", "z0", "Referencia Mirador y wireframes 16:9", "Nuevo; no recorte del portrait", "NO NECESARIO", "Asset por cámara independiente", "Art Bible y cámara landscape aprobadas", "Derivar por recorte", "P0", "Sin texto; cinco anchors legibles en 667×375; <=900 KiB"),
    inventory_row("FINAL-MIRADOR-P-001", "final_mirador_foreground_portrait_v01.webp", CATEGORY_C, "Sitúa al visitante en el mirador", "Piedra, barandal y plantas frontales", "FinalForegroundLayer", "/final", "1440×1280", "WEBP", "Transparente", "Portrait", "z70", "Materialidad de referencia", "Nuevo", "ASSET ESTÁTICO ANIMADO POR TRANSFORM", "Asset por silueta y oclusión", "Cámara portrait y alpha bbox", "Tapar controles o Lía", "P0", "Alpha real; no texto; baseline documentado; <=600 KiB"),
    inventory_row("FINAL-MIRADOR-L-001", "final_mirador_foreground_landscape_v01.webp", CATEGORY_C, "Sitúa al visitante en el mirador", "Piedra, barandal y plantas frontales 16:9", "FinalForegroundLayer", "/final", "2560×900", "WEBP", "Transparente", "Landscape", "z70", "Materialidad de referencia", "Nuevo", "ASSET ESTÁTICO ANIMADO POR TRANSFORM", "Asset por silueta y oclusión", "Cámara landscape y alpha bbox", "Reducir alto útil", "P0", "No invade targets; baseline documentado; <=600 KiB"),
    inventory_row("FINAL-DEPTH-P-001", "final_valley_depth_portrait_v01.webp", CATEGORY_C, "Une los cinco mundos", "Plano medio de río/camino y colinas", "FinalDepthLayer", "/final", "1440×2560", "WEBP", "Transparente", "Portrait", "z10", "Eje sol-río-Lía", "Nuevo", "ASSET ESTÁTICO ANIMADO POR TRANSFORM", "Asset por profundidad pictórica", "FINAL-ENV-P-001", "Costuras con fondo", "P1", "Alpha limpio; parallax <=1.5%; sin texto; <=450 KiB"),
    inventory_row("FINAL-DEPTH-L-001", "final_valley_depth_landscape_v01.webp", CATEGORY_C, "Une los cinco mundos", "Plano medio de río/camino 16:9", "FinalDepthLayer", "/final", "2560×1440", "WEBP", "Transparente", "Landscape", "z10", "Eje sol-río-Lía", "Nuevo", "ASSET ESTÁTICO ANIMADO POR TRANSFORM", "Asset por profundidad pictórica", "FINAL-ENV-L-001", "Costuras con fondo", "P1", "Core protegido visible a 667×375; <=450 KiB"),
    inventory_row("FINAL-OCC-P-001", "PENDIENTE_DE_DECISIÓN", CATEGORY_F, "Enmarca sin encerrar", "Oclusores vegetales laterales", "FinalForegroundLayer", "/final", "PENDIENTE_DE_DECISIÓN", "WEBP/PNG", "Transparente", "Portrait", "z60", "Árboles laterales de referencia", "Nuevo solo si prueba estática lo exige", "ASSET ESTÁTICO ANIMADO POR TRANSFORM", "Asset si la silueta orgánica aporta profundidad", "Composición estática portrait", "Ruido y targets ocultos", "P2", "Prueba A/B humana; excluir si reduce claridad"),
    inventory_row("FINAL-OCC-L-001", "PENDIENTE_DE_DECISIÓN", CATEGORY_F, "Enmarca sin encerrar", "Oclusores laterales 16:9", "FinalForegroundLayer", "/final", "PENDIENTE_DE_DECISIÓN", "WEBP/PNG", "Transparente", "Landscape", "z60", "Mockup revisión libre", "Nuevo solo si prueba estática lo exige", "ASSET ESTÁTICO ANIMADO POR TRANSFORM", "Asset si aporta profundidad", "Composición 667×375", "Tapar accesos I/V", "P2", "Prueba A/B humana en 667×375"),
    inventory_row("FINAL-ATM-HAZE-001", "FinalAtmosphereLayer.tsx", CATEGORY_D, "Suaviza profundidad", "Haze graduado", "FinalAtmosphereLayer", "/final", "Viewport contractual", "CSS/SVG", "Transparente", "Ambas", "z15", "Haze de Mundo IV como patrón técnico", "No reutiliza binario", "CSS/SVG/JS determinista", "Código si basta gradiente medible", "Paleta documental", "Contraste reducido", "P1", "No cubre texto; intensidad parametrizada; cero loop"),
    inventory_row("FINAL-ATM-LIGHT-001", "finalLighting.ts", CATEGORY_D, "Atardecer cálido", "Gradientes y exposición por plano", "FinalAtmosphereLayer", "/final", "Viewport contractual", "TypeScript/CSS", "NO_APLICA_CÓDIGO", "Ambas", "z16", "Paleta extraída 021B", "No duplica asset", "CSS/SVG/JS determinista", "Código para valores medibles", "Art Bible", "Bloom excesivo", "P1", "Contraste AA y glow acotado; sin recursos externos"),
    inventory_row("FINAL-SHADOW-001", "PENDIENTE_DE_DECISIÓN", CATEGORY_F, "Ancla Lía y mirador", "Sombra de contacto", "FinalForegroundLayer", "/final", "PENDIENTE_DE_DECISIÓN", "PNG/SVG", "Transparente", "Ambas", "z69", "Sombra W4 solo como método", "Nuevo o código tras prueba", "NO NECESARIO", "Código si elipse simple; asset si pictórica", "Alpha bbox de Lía y mirador", "Desalineación", "P1", "Centro visible alpha-aware; no sombra generativa innecesaria"),
    inventory_row("FINAL-ATM-VIGNETTE-001", "finalAtmosphere.css", CATEGORY_D, "Concentra la mirada", "Viñeta periférica suave", "FinalAtmosphereLayer", "/final", "Viewport contractual", "CSS", "NO_APLICA_CÓDIGO", "Ambas", "z65", "Referencia Mirador", "No reutiliza binario", "CSS/SVG/JS determinista", "Código por geometría simple", "Safe areas", "Oscurecer controles", "P2", "Opacidad <=0.18 y desactivable en contraste QA"),

    inventory_row("FINAL-ACCESS-I-001", "final_access_world1_root_v01.webp", CATEGORY_C, "Memoria de Raíz", "Mini escena de brote y raíz", "FinalAccessCard[I]", "/final / acceso I", "1024×1024", "WEBP", "Transparente", "Ambas", "z30", "Assets W1 solo como referencia", "Generar nuevo; no duplicar W1", "ASSET ESTÁTICO ANIMADO POR TRANSFORM", "Asset por identidad pictórica", "Cámara y Art Bible", "Copiar estética literal de W1", "P0", "Raíz reconocible a 88 px; sin texto; <=180 KiB"),
    inventory_row("FINAL-ACCESS-II-001", "final_access_world2_pulse_v01.webp", CATEGORY_C, "Memoria de Pulso invisible", "Planta y señal violeta", "FinalAccessCard[II]", "/final / acceso II", "1024×1024", "WEBP", "Transparente", "Ambas", "z30", "Assets W2 solo como referencia", "Generar nuevo", "ASSET ESTÁTICO ANIMADO POR TRANSFORM", "Asset por identidad pictórica", "Cámara y Art Bible", "Señal ilegible", "P0", "Planta+pulso reconocibles; sin texto; <=180 KiB"),
    inventory_row("FINAL-ACCESS-III-001", "final_access_world3_notebook_v01.webp", CATEGORY_C, "Memoria de Cuaderno de pruebas", "Cuaderno abierto", "FinalAccessCard[III]", "/final / acceso III", "1024×1024", "WEBP", "Transparente", "Ambas", "z30", "Assets W3 solo como referencia", "Generar nuevo", "ASSET ESTÁTICO ANIMADO POR TRANSFORM", "Asset por materialidad", "Cámara y Art Bible", "Texto horneado", "P0", "Silueta de cuaderno; páginas sin texto operativo; <=180 KiB"),
    inventory_row("FINAL-ACCESS-IV-001", "final_access_world4_system_v01.webp", CATEGORY_C, "Memoria de Mesa de sistema", "Mesa y red de nodos", "FinalAccessCard[IV]", "/final / acceso IV", "1024×1024", "WEBP", "Transparente", "Ambas", "z30", "Assets W4 solo como referencia", "Generar nuevo", "ASSET ESTÁTICO ANIMADO POR TRANSFORM", "Asset por materialidad", "Cámara y Art Bible", "Miniatura confusa", "P0", "Mesa+red legibles sin copy; <=180 KiB"),
    inventory_row("FINAL-ACCESS-V-001", "final_access_world5_map_v01.webp", CATEGORY_C, "Memoria de Mapa del presente", "Mapa y ping", "FinalAccessCard[V]", "/final / acceso V", "1024×1024", "WEBP", "Transparente", "Ambas", "z30", "Assets W5 solo como referencia", "Generar nuevo", "ASSET ESTÁTICO ANIMADO POR TRANSFORM", "Asset por identidad pictórica", "Cámara y Art Bible", "Duplicar mapa runtime", "P0", "Mapa reconocible; no copiar binario completo; <=180 KiB"),
    inventory_row("FINAL-PLATE-LABEL-001", "final_access_label_backplate_v01.png", CATEGORY_C, "Nombra cada memoria", "Backplate 9-slice de rótulo", "FinalAccessLabel", "/final", "1024×256", "PNG", "Transparente", "Ambas", "z42", "Placas de referencia; método 9-slice W4", "Nuevo", "NO NECESARIO", "Asset para materialidad; texto DOM", "Tokens de 9-slice", "Texto horneado", "P0", "Centro extensible; bordes 1×; sin texto; <=90 KiB"),
    inventory_row("FINAL-PLATE-TITLE-001", "final_title_backplate_v01.png", CATEGORY_C, "Declara cierre", "Pergamino superior", "FinalHeader", "/final", "1536×512", "PNG", "Transparente", "Ambas", "z80", "Cartel de referencia", "Nuevo", "NO NECESARIO", "Asset para materialidad; h1/subtítulo DOM", "Cámara y copy", "Ocupa demasiado cielo", "P0", "9-slice o variantes validadas; sin texto; <=180 KiB"),
    inventory_row("FINAL-PLATE-CREDITS-001", "final_credits_backplate_v01.png", CATEGORY_C, "Reconoce autoría", "Franja inferior integrada", "FinalCredits", "/final", "1536×384", "PNG", "Transparente", "Ambas", "z82", "Franja de referencia", "Nuevo", "NO NECESARIO", "Asset para materialidad; créditos DOM", "Copy exacto", "Reducir alto útil", "P1", "Dos líneas legibles sin scroll; sin texto horneado; <=140 KiB"),
    inventory_row("FINAL-PLATE-ACTION-001", "final_action_backplate_v01.png", CATEGORY_C, "Sostiene dos decisiones", "Marco 9-slice para botones", "FinalActions", "/final", "1024×256", "PNG", "Transparente", "Ambas", "z82", "Botones de referencia", "Nuevo", "NO NECESARIO", "Asset backplate + button DOM", "Estados de foco", "Diferencia basada solo en color", "P1", "Target 44×44; foco no recortado; texto DOM"),
    inventory_row("FINAL-PLATE-DIALOG-001", "PENDIENTE_DE_DECISIÓN", CATEGORY_F, "Pide confirmación consciente", "Marco de diálogo", "FinalRestartDialog", "/final / final_restart_prompt", "PENDIENTE_DE_DECISIÓN", "PNG/CSS", "Transparente", "Ambas", "z110", "Mockup reinicio y backplates existentes", "Prueba nuevo asset vs CSS", "NO NECESARIO", "Asset solo si materialidad lo exige", "Contrato modal", "Peso o 9-slice defectuoso", "P1", "Diálogo usable 375×667 y 667×375; sin texto"),
    inventory_row("FINAL-ACCESS-LAYOUT-001", "finalGeometry.ts", CATEGORY_D, "Presenta cinco mundos como conjunto", "Anchors 2–1–2 y arco 16:9", "FinalStage", "/final", "Artboards 9:16 y 16:9", "TypeScript", "NO_APLICA_CÓDIGO", "Ambas", "z30", "Wireframes 021B", "No aplica", "CSS/SVG/JS determinista", "Código para geometría exacta", "Dos cámaras aprobadas", "Offsets aislados", "P0", "Anchors normalizados; seis viewports sin solape ni scroll"),
    inventory_row("FINAL-HIT-TARGETS-001", "FinalAccessControl.tsx", CATEGORY_D, "Permite revisión libre", "Superficies táctiles invisibles", "FinalAccessControl", "/final", "Viewport contractual", "React/HTML", "Transparente", "Ambas", "z50", "WCAG y contrato 021B", "No aplica", "NO NECESARIO", "Código semántico", "Assets de accesos", "Target menor a 44", "P0", "Cada acceso >=44×44 y botón nativo"),
    inventory_row("FINAL-SELECTED-001", "FinalAccessControl.css", CATEGORY_D, "Confirma mundo elegido", "Borde, escala mínima y atenuación", "FinalAccessControl", "/final / final_station_selected", "Viewport contractual", "CSS", "NO_APLICA_CÓDIGO", "Ambas", "z55", "Especificación V1", "No aplica", "CSS/SVG/JS determinista", "Código por estado/foco", "Máquina de estados", "Depender del color", "P0", "aria-pressed; borde y forma; no oculta otros accesos"),
    inventory_row("FINAL-ACCESS-GROUP-001", "FinalAccessGroup.tsx", CATEGORY_D, "Agrupa revisión libre", "Orden DOM I–V independiente del visual", "FinalAccessGroup", "/final", "Viewport contractual", "React/HTML", "NO_APLICA_CÓDIGO", "Ambas", "z50", "Contrato accesible 021B", "No aplica", "NO NECESARIO", "Código semántico", "FinalAccessControl", "Orden visual altera lectura", "P0", "DOM I→V; visual por grid/anchors; anuncio seleccionado"),

    inventory_row("FINAL-MOTION-FLOAT-001", "finalMotion.ts", CATEGORY_D, "Mantiene escena viva con calma", "Flotación lenta desfasada", "FinalAccessMotion", "/final / idle", "Viewport contractual", "WAAPI/CSS", "NO_APLICA_CÓDIGO", "Ambas", "z30", "Especificación V1", "No aplica", "CSS/SVG/JS determinista", "Transform medible", "Anchors finales", "Movimiento simultáneo", "P2", "Amplitud 2–5 px; fases distintas; apagado en reduced"),
    inventory_row("FINAL-MOTION-PARALLAX-001", "finalParallax.ts", CATEGORY_D, "Refuerza profundidad", "Parallax de tres planos", "FinalStage", "/final / idle", "Viewport contractual", "TypeScript/CSS", "NO_APLICA_CÓDIGO", "Ambas", "z0–70", "Profundidad Art Bible", "No aplica", "CSS/SVG/JS determinista", "Código por desplazamiento medible", "Planos aprobados", "Mareo o seams", "P2", "Máximo 1.5%; sin pointer obligatorio; off en reduced"),
    inventory_row("FINAL-FX-I-001", "final_access_i_root_spark_sheet_v01.png", CATEGORY_E, "Recuerda el origen", "Destello breve de raíz", "FinalAccessFx[I]", "/final / acceso I", "512×128 / 4×1", "PNG", "Transparente", "Ambas", "z36", "W1 como referencia", "Nuevo", "SPRITE SHEET", "Sprite por deformación pictórica", "FINAL-ACCESS-I-001", "Loop ruidoso", "P2", "4 frames; trigger espaciado/selección; <=45 KiB"),
    inventory_row("FINAL-FX-II-001", "final_access_ii_signal_pulse_sheet_v01.png", CATEGORY_E, "Recuerda la señal", "Pulso violeta", "FinalAccessFx[II]", "/final / acceso II", "512×128 / 4×1", "PNG", "Transparente", "Ambas", "z36", "W2 como referencia", "Nuevo", "SPRITE SHEET", "Sprite si la onda es pictórica", "FINAL-ACCESS-II-001", "Flash excesivo", "P2", "Sin >3 destellos/s; reduced congelado; <=45 KiB"),
    inventory_row("FINAL-FX-III-001", "final_access_iii_notebook_blink_sheet_v01.png", CATEGORY_E, "Recuerda el registro", "Cambio sutil de página", "FinalAccessFx[III]", "/final / acceso III", "384×128 / 3×1", "PNG", "Transparente", "Ambas", "z36", "W3 como referencia", "Nuevo", "SPRITE SHEET", "Sprite por cambio ilustrado", "FINAL-ACCESS-III-001", "Parecer interacción obligatoria", "P2", "3 frames; sin texto; no loop continuo; <=40 KiB"),
    inventory_row("FINAL-FX-IV-001", "FinalAccessSystemFx.tsx", CATEGORY_D, "Recuerda el sistema", "Nodo y tramo activo", "FinalAccessFx[IV]", "/final / acceso IV", "Local al acceso", "SVG/CSS", "Transparente", "Ambas", "z36", "Ruta W4 como método", "No reutiliza binario", "CSS/SVG/JS determinista", "Código por geometría exacta", "FINAL-ACCESS-IV-001", "Densidad técnica", "P2", "Un nodo/tramo; pausa amplia; estado también por forma"),
    inventory_row("FINAL-FX-V-001", "FinalAccessMapFx.tsx", CATEGORY_D, "Recuerda el presente", "Ping de mapa", "FinalAccessFx[V]", "/final / acceso V", "Local al acceso", "SVG/CSS", "Transparente", "Ambas", "z36", "W5 como referencia", "No reutiliza binario", "CSS/SVG/JS determinista", "Código por anillos exactos", "FINAL-ACCESS-V-001", "Loop distractor", "P2", "Un ping espaciado; off en reduced; sin color exclusivo"),
    inventory_row("FINAL-FX-MOTES-001", "PENDIENTE_DE_DECISIÓN", CATEGORY_F, "Aporta atmósfera", "Motas escasas", "FinalAtmosphereLayer", "/final / idle", "PENDIENTE_DE_DECISIÓN", "PNG/CSS", "Transparente", "Ambas", "z20", "Referencia Mirador", "Nuevo solo si mejora materialidad", "ESTADOS RASTER SEPARADOS", "Asset solo para forma orgánica", "Presupuesto visual", "Ruido permanente", "P3", "Máximo 8 visibles; sin interacción; eliminar si no suma"),
    inventory_row("FINAL-FX-LAMP-001", "final_lamp_flame_sheet_v01.png", CATEGORY_E, "Refuerza calidez", "Llama mínima", "FinalForegroundLayer", "/final / idle", "256×64 / 4×1", "PNG", "Transparente", "Ambas", "z75", "Lámpara de referencia", "Nuevo", "SPRITE SHEET", "Sprite por deformación orgánica", "Mirador aprobado", "Flicker", "P3", "4 frames lentos; una lámpara; estática en reduced; <=25 KiB"),
    inventory_row("FINAL-FX-VEG-001", "final_vegetation_sway_states_v01.png", CATEGORY_E, "Mantiene jardín vivo", "Dos estados de follaje", "FinalForegroundLayer", "/final / idle", "512×256 / 2×1", "PNG", "Transparente", "Ambas", "z66", "Vegetación de referencia", "Nuevo", "ESTADOS RASTER SEPARADOS", "Asset por deformación orgánica", "Oclusores aprobados", "Ruido o costura", "P3", "Sólo un grupo; ciclo >=6 s; congelado en reduced"),
    inventory_row("FINAL-MOTION-SELECT-001", "FinalLocalTransition.tsx", CATEGORY_D, "Da feedback antes de revisar", "Máscara y enfoque local", "FinalLocalTransition", "/final / final_revisit_transition", "Viewport contractual", "React/CSS/SVG", "NO_APLICA_CÓDIGO", "Ambas", "z100", "Especificación V1; no TransitionWorld", "No reutiliza transición pasiva", "CSS/SVG/JS determinista", "Código por evento y foco", "Review context", "Bloquear demasiado", "P1", "Feedback visible/aria; 220–420 ms; versión reduced 100–160 ms"),

    inventory_row("FINAL-LIA-REF-001", "lia_master_cover_reference_v1.png", CATEGORY_B, "Autoridad de identidad", "Cinco pétalos y materiales canónicos", "Equipo de arte / QA", "Preproducción", "941×1672", "PNG", "Transparente", "Portrait", "Referencia", "docs/03_IDENTIDAD_LIA.md", "Referencia solamente", "NO NECESARIO", "No es runtime Final", "Procedencia Cover versionada", "Copiar pose/escala sin adaptación", "P0", "Usar para hard fails; nunca promover como arte Final automáticamente"),
    inventory_row("FINAL-LIA-COVER-IDLE-001", "lia_pose_idle_v1.png", CATEGORY_F, "Candidata a reposo", "Pose 2.5D existente", "FinalLiaActor", "/final / candidato", "941×1672", "PNG", "Transparente", "Portrait", "z74", "Cover y biblioteca Lía", "Nuevo consumidor requiere aprobación", "ESTADOS RASTER SEPARADOS", "Asset existente si compatibilidad artística pasa", "Prueba pixelart y cámara", "Mezcla de estilo", "P1", "Prueba a escalas portrait/landscape y aprobación humana"),
    inventory_row("FINAL-LIA-COVER-GREET-001", "lia_pose_greeting_v1.png", CATEGORY_F, "Candidata a saludo", "Pose 2.5D existente", "FinalLiaActor", "/final / candidato", "1086×1448", "PNG", "Transparente", "Ambas", "z74", "Cover/W4/W5", "Nuevo consumidor requiere aprobación", "ESTADOS RASTER SEPARADOS", "Asset existente si pasa prueba", "Prueba pixelart", "Mezcla de estilo", "P1", "Cinco pétalos; no flip; encaje humano aprobado"),
    inventory_row("FINAL-LIA-W5-ATTEND-001", "lia_world5_attend_neutral_v01.webp", CATEGORY_F, "Candidata contemplativa", "Pose neutral aprobada en W5", "FinalLiaActor", "/final / candidato", "1536×1536", "WEBP", "Transparente", "Ambas", "z74", "W5 manifest", "Nuevo consumidor requiere aprobación", "ESTADOS RASTER SEPARADOS", "Asset existente si pasa composición", "Prueba alpha-aware", "Dirección W5 no Final", "P1", "No deformar; compatibilidad técnica y artística separadas"),
    inventory_row("FINAL-LIA-W3-POINT-001", "lia_world3_pointing_v01.png", CATEGORY_B, "Referencia de orientación", "Vocabulario gestual pixelart", "Equipo de arte", "Preproducción", "1024×1024", "PNG", "Transparente", "Ambas", "Referencia", "W3 aprobado", "Referencia solamente", "NO NECESARIO", "No mezclar pixelart W3 automáticamente", "Mapa de Lía", "Confundir aprobación de W3 con Final", "P1", "Extraer acting, no copiar estilo/binario sin autorización"),
    inventory_row("FINAL-LIA-IDLE-001", "final_lia_idle_contemplative_6f_v01.webp", CATEGORY_E, "Presencia contemplativa", "Idle sobrio de Lía pixelart/híbrida", "FinalLiaActor", "/final / idle", "1536×256 / 6×1", "WEBP", "Transparente", "Ambas", "z74", "Identidad canónica + cámara Final", "Nuevo", "SPRITE SHEET", "Sprite por acting ilustrado", "Benchmark de pose y hard fails", "Identidad o pixel crawling", "P0", "Exactamente cinco pétalos; 6 frames; cero anatomía humana; <=220 KiB"),
    inventory_row("FINAL-LIA-GREET-001", "final_lia_greeting_4f_v01.webp", CATEGORY_E, "Saludo breve de cierre", "Gesto ceremonial corto", "FinalLiaActor", "/final / intro", "1024×256 / 4×1", "WEBP", "Transparente", "Ambas", "z74", "Identidad canónica", "Nuevo", "SPRITE SHEET", "Sprite por acting ilustrado", "FINAL-LIA-IDLE-001", "Rebote exagerado", "P0", "No loop; <=700 ms; cinco pétalos; vuelve a idle"),
    inventory_row("FINAL-LIA-DIRECTION-001", "PENDIENTE_DE_DECISIÓN", CATEGORY_F, "Orienta al acceso elegido", "Estados direccionales I–V", "FinalLiaActor", "/final / selected", "PENDIENTE_DE_DECISIÓN", "WEBP/PNG", "Transparente", "Ambas", "z74", "Wireframes 021B", "Nuevo solo si transform no basta", "ESTADOS RASTER SEPARADOS", "Asset si la silueta cambia", "Prueba de composición", "Cinco poses innecesarias", "P2", "Probar primero rotación mínima; no flip sin aprobación"),
    inventory_row("FINAL-LIA-GLOW-001", "final_lia_glow_shadow_v01.png", CATEGORY_C, "Integra a Lía en el mirador", "Glow y sombra alpha-aware", "FinalLiaActor", "/final", "1024×512", "PNG", "Transparente", "Ambas", "z72", "Collar/glow canónico", "Nuevo", "ASSET ESTÁTICO ANIMADO POR TRANSFORM", "Asset por textura de luz", "Alpha bbox Lía", "Halo excesivo", "P1", "No oculta foco; alpha real; <=80 KiB"),
    inventory_row("FINAL-LIA-RESET-001", "PENDIENTE_DE_DECISIÓN", CATEGORY_F, "Acompaña decisión crítica", "Pose de confirmación", "FinalRestartDialog", "/final / restart prompt", "PENDIENTE_DE_DECISIÓN", "WEBP/PNG", "Transparente", "Ambas", "z115", "Mockup reinicio", "Preferir idle/greeting si basta", "ESTADOS RASTER SEPARADOS", "Nuevo asset solo con valor probado", "Composición del diálogo", "Duplicar set sin beneficio", "P3", "Prueba humana demuestra mejor comprensión; si no, NO NECESARIO"),
    inventory_row("FINAL-LIA-CONTROLLER-001", "FinalLiaActor.tsx", CATEGORY_D, "Gobierna presencia de Lía", "Selecciona idle/saludo/orientación", "FinalLiaActor", "/final", "Viewport contractual", "React/TypeScript", "NO_APLICA_CÓDIGO", "Ambas", "z74", "Máquina de estados 021B", "No aplica", "CSS/SVG/JS determinista", "Código para estado y tiempos", "Assets Lía aprobados", "Estado visual sin semántica", "P0", "Un actor; fallback estático; reduced equivalente"),
    inventory_row("FINAL-LIA-ANCHOR-001", "finalLiaGeometry.ts", CATEGORY_D, "Mantiene a Lía presente sin bloquear", "Anchor por alpha bbox", "FinalLiaActor", "/final", "9:16 y 16:9", "TypeScript", "NO_APLICA_CÓDIGO", "Ambas", "z74", "Método W4 alpha-aware", "No aplica", "NO NECESARIO", "Código por geometría", "Assets Lía aprobados", "Centro de canvas incorrecto", "P0", "Centro/baseline visible; no tapa accesos, acciones ni créditos"),

    inventory_row("FINAL-MEM-W1-001", "world1_root_roots_base_approved_v1.png", CATEGORY_B, "Autoridad visual Mundo I", "Referencia de raíz", "Equipo de arte Final", "Preproducción", "941×1672", "PNG", "Transparente", "Portrait", "Referencia", "W1 runtime/current-used", "Referencia; no duplicar", "NO NECESARIO", "Nuevo mini asset para cámara Final", "Consumer W1 preservado", "Mezclar cámaras", "P1", "Hash registrado; consumidor W1 intacto; nuevo arte separado"),
    inventory_row("FINAL-MEM-W2-001", "world2_raw_bioelectric_waveform_v01.png", CATEGORY_B, "Autoridad visual Mundo II", "Referencia de señal", "Equipo de arte Final", "Preproducción", "1536×1024", "PNG", "Transparente", "Landscape", "Referencia", "W2 runtime/current-used", "Referencia; no duplicar", "NO NECESARIO", "Nuevo mini asset", "Consumer W2 preservado", "Detalle ilegible a miniatura", "P1", "Usar lenguaje visual, no binario completo"),
    inventory_row("FINAL-MEM-W3-001", "world3_notebook_open_base_v01.png", CATEGORY_B, "Autoridad visual Mundo III", "Referencia de cuaderno", "Equipo de arte Final", "Preproducción", "1536×1024", "PNG", "Transparente", "Landscape", "Referencia", "W3 runtime/current-used", "Referencia; no duplicar", "NO NECESARIO", "Nuevo mini asset", "Consumer W3 preservado", "Texto horneado", "P1", "Silueta sin copiar contenido operativo"),
    inventory_row("FINAL-MEM-W4-001", "world4_node_central_system_v01.png", CATEGORY_B, "Autoridad visual Mundo IV", "Referencia de sistema", "Equipo de arte Final", "Preproducción", "1024×1024", "PNG", "Transparente", "Ambas", "Referencia", "W4 runtime/current-used", "Referencia; no duplicar", "NO NECESARIO", "Nuevo mini asset", "Consumer W4 preservado", "Iconografía técnica densa", "P1", "Síntesis legible sin master genérico"),
    inventory_row("FINAL-MEM-W5-001", "world5_map_sector_plants_v01.webp", CATEGORY_B, "Autoridad visual Mundo V", "Referencia de mapa", "Equipo de arte Final", "Preproducción", "1536×1536", "WEBP", "Transparente", "Ambas", "Referencia", "W5 runtime/current-used", "Referencia; no duplicar", "NO NECESARIO", "Nuevo mini asset", "Consumer W5 preservado", "Duplicación binaria", "P1", "Nuevo arte específico; W5 byte-idéntico intacto"),
    inventory_row("FINAL-UI-W2-001", "world2_dialogue_panel_backplate_v01.png", CATEGORY_B, "Referencia de diálogo", "Patrón de placa orgánica", "Equipo UI Final", "Preproducción", "1536×512", "PNG", "Transparente", "Ambas", "Referencia", "W2 current-used", "Referencia solamente", "NO NECESARIO", "Evaluar 9-slice, no copiar estética", "Contacto de copy", "Estética W2 incompatible", "P2", "Consumidor W2 intacto; decisión humana antes de nuevo diseño"),
    inventory_row("FINAL-UI-W4-TEXT-001", "world4_text_card_backplate_v01.png", CATEGORY_F, "Candidata técnica a backplate", "9-slice probado", "FinalRestartDialog", "Preproducción", "1536×512", "PNG", "Transparente", "Ambas", "Referencia/prueba", "W4 current-used", "Nuevo consumidor solo si estética pasa", "NO NECESARIO", "Reutilizar binario solo con aprobación", "Prueba Art Bible", "Arrastrar estética W4", "P2", "Compatibilidad técnica y artística documentadas por separado"),
    inventory_row("FINAL-UI-W4-CTA-001", "world4_open_world5_button_backplate_v01.png", CATEGORY_F, "Candidata técnica a botón", "9-slice neutral", "FinalActions", "Preproducción", "1024×512", "PNG", "Transparente", "Ambas", "Referencia/prueba", "W4 current-used", "Nuevo consumidor solo si estética pasa", "NO NECESARIO", "Reutilizar binario solo con aprobación", "Prueba Art Bible", "Estados de foco incompatibles", "P2", "Target/foco/contraste pasan y aprobación humana explícita"),

    inventory_row("FINAL-DOM-TITLE-001", "FinalHeader.tsx", CATEGORY_D, "Declara cierre y completitud", "h1 y subtítulo sobre placa", "FinalHeader", "/final", "Viewport contractual", "React/HTML", "NO_APLICA_CÓDIGO", "Ambas", "z90", "FINAL_TITLE_01/FINAL_SUBTITLE_01", "Sistema editorial existente", "NO NECESARIO", "Texto operativo siempre DOM", "Copy aprobado", "Recorte o texto en imagen", "P0", "Un h1; 18 px mínimo portrait y 16 px landscape"),
    inventory_row("FINAL-DOM-LABELS-001", "FinalAccessLabel.tsx", CATEGORY_D, "Nombra I–V", "Rótulos DOM", "FinalAccessGroup", "/final", "Viewport contractual", "React/HTML", "NO_APLICA_CÓDIGO", "Ambas", "z45", "10 slots label/confirm", "Sistema editorial existente", "NO NECESARIO", "Texto DOM", "Backplate y copy", "Wrap excesivo", "P0", "Legible a 667×375; no horneado; locale es"),
    inventory_row("FINAL-DOM-ACTIONS-001", "FinalActions.tsx", CATEGORY_D, "Volver o reiniciar", "Dos botones distinguibles", "FinalActions", "/final", "Viewport contractual", "React/HTML", "NO_APLICA_CÓDIGO", "Ambas", "z90", "Slots FINAL_BACK/RESTART", "Código semántico existente como referencia", "NO NECESARIO", "Botones nativos", "Contrato reset", "Confusión entre acciones", "P0", "Ayudas explícitas; >=44×44; no solo color"),
    inventory_row("FINAL-DOM-CREDITS-001", "FinalCredits.tsx", CATEGORY_D, "Reconoce autoría", "Dos líneas permanentes", "FinalCredits", "/final", "Viewport contractual", "React/HTML", "NO_APLICA_CÓDIGO", "Ambas", "z90", "FINAL_CREDITS_01", "Slot existente", "NO NECESARIO", "Texto DOM", "Copy exacto", "Scroll o ilegibilidad", "P0", "Texto exacto; visible; lector; no estado separado"),
    inventory_row("FINAL-DIALOG-001", "FinalRestartDialog.tsx", CATEGORY_D, "Confirma pérdida de avance", "Modal accesible", "FinalRestartDialog", "/final / restart", "Viewport contractual", "React/HTML", "NO_APLICA_CÓDIGO", "Ambas", "z120", "Mockup solo dirección", "No aplica", "NO NECESARIO", "Código por semántica/foco", "Reset transaction", "Foco escapable", "P0", "role=dialog; aria-modal; trap; Escape; retorno de foco"),
    inventory_row("FINAL-FOCUS-001", "finalFocus.ts", CATEGORY_D, "Mantiene continuidad de navegación", "Foco visible y restaurado", "FinalRoot/Review wrapper", "/final y revisita", "Viewport contractual", "TypeScript/CSS", "NO_APLICA_CÓDIGO", "Ambas", "z130", "Lección W3", "No aplica", "NO NECESARIO", "Código por interacción", "IDs estables de accesos", "Pérdida de foco", "P0", "Foco vuelve al acceso elegido y al disparador del diálogo"),
    inventory_row("FINAL-ARIA-001", "FinalAnnouncements.tsx", CATEGORY_D, "Anuncia selección, salida y error", "Regiones aria-live", "FinalRoot", "/final", "Viewport contractual", "React/HTML", "NO_APLICA_CÓDIGO", "Ambas", "Semántico", "Slots accesibles", "No aplica", "NO NECESARIO", "Código semántico", "Copy accesible", "Anuncios duplicados", "P0", "polite para selección/navegación; assertive solo reset fallido"),
    inventory_row("FINAL-RETURN-001", "FinalReviewReturnControl.tsx", CATEGORY_D, "Vuelve al Mirador desde revisión", "Control global no invasivo", "Route-level ReviewModeLayout", "/estacion/1–5 en review", "Viewport contractual", "React/HTML", "NO_APLICA_CÓDIGO", "Ambas", "z200", "Contrato 021B", "No tocar narrativa de mundos", "NO NECESARIO", "Wrapper de rutas", "Contexto validado", "Solape con UI congelada", "P0", "Visible solo en review; ruta fija /final; >=44×44"),
    inventory_row("FINAL-RESET-001", "finalResetTransaction.ts", CATEGORY_D, "Reinicia la experiencia con seguridad", "Snapshot, allowlist, verify y rollback", "FinalRestartDialog", "/final / resetting", "NO_APLICA", "TypeScript", "NO_APLICA_CÓDIGO", "NO_APLICA", "Semántico", "Allowlist 021B", "Reutiliza primitivas, no clear()", "NO NECESARIO", "Código transaccional best-effort", "Tres claves actuales", "Rollback incompleto", "P0", "Nunca localStorage.clear; no navega antes de verificar"),
    inventory_row("FINAL-GUARD-001", "finalAccessGuard.ts", CATEGORY_D, "Protege cierre tras I–V", "Validación prefijo [1,2,3,4,5]", "router loader", "/final y transición W5→Final", "NO_APLICA", "TypeScript", "NO_APLICA_CÓDIGO", "NO_APLICA", "Semántico", "progress.storage.ts", "Reutiliza readProgress", "NO NECESARIO", "Código por integridad", "GVO progress schema", "Aceptar [5]", "P0", "Ausente/corrupto/excepción cierran; no estación 6"),
    inventory_row("FINAL-RESET-ERROR-001", "FinalResetError.tsx", CATEGORY_D, "Explica que no se reinició", "Estado y reintento accesibles", "FinalRestartDialog", "/final / final_reset_failed", "Viewport contractual", "React/HTML", "NO_APLICA_CÓDIGO", "Ambas", "z125", "Nuevo copy requerido", "No aplica", "NO NECESARIO", "Código semántico", "Rollback report", "Ocultar pérdida parcial", "P0", "No navega; aria-live; reporta rollback; foco en reintento/cancelar"),
    inventory_row("FINAL-SAFE-AREA-001", "finalGeometry.ts", CATEGORY_D, "Mantiene acciones visibles", "Insets y zona protegida", "FinalStage", "/final", "Seis viewports", "TypeScript/CSS", "NO_APLICA_CÓDIGO", "Ambas", "Layout", "Wireframes 021B", "No aplica", "NO NECESARIO", "Código por viewport", "env(safe-area-inset-*)", "Controles bajo notch", "P0", "Todos los targets dentro del safe area; sin scroll"),
    inventory_row("FINAL-ORIENTATION-001", "finalResponsive.css", CATEGORY_D, "Conserva el Mirador en toda orientación", "Selección 9:16/16:9", "FinalStage", "/final", "Seis viewports", "CSS", "NO_APLICA_CÓDIGO", "Ambas", "Layout", "Matriz 021B", "No aplica", "NO NECESARIO", "Código por orientación y altura", "Dos artboards", "Usar 844 como proxy 667", "P0", "667×375 independiente y operable; reflow sin pérdida"),
    inventory_row("FINAL-RESPONSIVE-001", "finalResponsive.ts", CATEGORY_D, "Mantiene síntesis completa", "Reglas de crop/extend/fallback", "FinalStage", "/final", "Seis viewports", "TypeScript/CSS", "NO_APLICA_CÓDIGO", "Ambas", "Layout", "Matriz 021B", "No aplica", "NO NECESARIO", "Código por composición", "Cámaras aprobadas", "Crop ciego", "P0", "Cero overflow; core protegido; elementos simplificados documentados"),
    inventory_row("FINAL-DOM-ORDER-001", "FinalRootScreen.tsx", CATEGORY_D, "Permite lectura coherente", "Orden DOM independiente de anchors", "FinalRoot", "/final", "Viewport contractual", "React/HTML", "NO_APLICA_CÓDIGO", "Ambas", "Semántico", "Wireframes 021B", "No aplica", "NO NECESARIO", "Código semántico", "Componentes Final", "Orden visual leído", "P0", "h1→subtítulo→I–V→mensaje→acciones→créditos→diálogo"),
    inventory_row("FINAL-REDUCED-001", "finalReducedMotion.ts", CATEGORY_D, "Ofrece cierre equivalente", "Congela loops y simplifica transición", "FinalStage/FinalLiaActor", "/final reduced", "Seis viewports", "TypeScript/CSS", "NO_APLICA_CÓDIGO", "Ambas", "Todas", "Contrato 021B", "No aplica", "NO NECESARIO", "Código por preferencia", "Assets con frame estable", "Solo duration:0", "P0", "Mismas acciones/foco/anuncios; sin parallax/flotación/motas"),
    inventory_row("FINAL-PRECACHE-001", "finalAssetBundle.ts", CATEGORY_D, "Garantiza cierre offline", "Bundle tipado y preload crítico", "screenAssetBundles/PWA", "/final", "NO_APLICA", "TypeScript", "NO_APLICA_CÓDIGO", "NO_APLICA", "Infraestructura", "vite.config.ts", "Runtime canónico; nunca current-used", "NO NECESARIO", "Código para lista y estrategia", "Assets aprobados", "Superar 4 MiB por archivo", "P1", "Cero externos; shell+críticos offline; current-used excluido"),

    inventory_row("FINAL-INFRA-FONT-001", "@fontsource-variable/pixelify-sans", CATEGORY_A, "Mantiene voz visual local", "Tipografía DOM", "Final UI", "/final", "NO_APLICA", "WOFF2 bundle", "Opaco/N.A.", "Ambas", "Infraestructura", "Bundle actual", "Reutilizar import; no duplicar", "NO NECESARIO", "Infraestructura global existente", "Build futuro", "Peso/legibilidad", "P1", "Sin fuente remota; legible a tamaños mínimos"),
    inventory_row("FINAL-INFRA-ICON-001", "gvo-icon.svg", CATEGORY_A, "Identidad PWA", "Icono de instalación", "manifest PWA", "Global", "SVG", "SVG", "Transparente", "Ambas", "Infraestructura", "vite.config.ts", "Reutilizar ruta actual", "NO NECESARIO", "Global; no asset Final", "Manifest", "Duplicación", "P3", "Sin cambios ni copia en final-root"),
    inventory_row("FINAL-INFRA-PROGRESS-001", "resetProgress", CATEGORY_A, "Borra progreso global", "Primitiva storage", "finalResetTransaction.ts", "Reset futuro", "NO_APLICA", "TypeScript", "NO_APLICA_CÓDIGO", "NO_APLICA", "Semántico", "progress.storage.ts", "Reutilizar dentro de transacción", "NO NECESARIO", "Código existente", "Rollback wrapper", "No expone éxito", "P0", "No usar sola; verificar ausencia y rollback externo"),
    inventory_row("FINAL-INFRA-COVER-001", "resetCoverIntroCompleted", CATEGORY_A, "Repite introducción de portada", "Primitiva storage", "finalResetTransaction.ts", "Reset futuro", "NO_APLICA", "TypeScript", "NO_APLICA_CÓDIGO", "NO_APLICA", "Semántico", "coverIntroState.ts", "Reutilizar o remover clave exacta", "NO NECESARIO", "Código existente", "Rollback wrapper", "Silencia errores", "P0", "En transacción verificada; no navegar si falla"),
    inventory_row("FINAL-REVIEW-CONTEXT-001", "finalReviewContext.ts", CATEGORY_D, "Conserva regreso al Mirador", "Token review=final y respaldo session", "router/ReviewModeLayout", "/final↔/estacion/N", "NO_APLICA", "TypeScript", "NO_APLICA_CÓDIGO", "NO_APLICA", "Semántico", "Contrato 021B", "No aceptar return URL arbitraria", "NO NECESARIO", "Código por navegación segura", "sessionStorage futuro", "Open redirect/contexto stale", "P0", "Schema/version; station 1–5; ruta retorno fija; TTL/session"),
    inventory_row("FINAL-REVIEW-FOCUS-001", "finalReviewFocus.ts", CATEGORY_D, "Retoma la selección previa", "Persistencia de accessId y foco", "FinalRoot", "/final retorno", "NO_APLICA", "TypeScript", "NO_APLICA_CÓDIGO", "NO_APLICA", "Semántico", "Contrato 021B", "No altera progreso", "NO NECESARIO", "Código por foco/estado", "Review context", "Repetir intro ceremonial", "P0", "Seleccionado I–V restaurado; foco exacto; intro abreviada"),
    inventory_row("FINAL-ENTRY-001", "FinalEntrySequence.ts", CATEGORY_D, "Marca llegada ceremonial", "Secuencia breve por capas", "FinalStage", "/final / entering→intro", "Viewport contractual", "TypeScript/WAAPI", "NO_APLICA_CÓDIGO", "Ambas", "z0–90", "Especificación V1", "No reutiliza transición pasiva", "CSS/SVG/JS determinista", "Código por tiempos/foco", "Assets estáticos aprobados", "Bloqueo prolongado", "P1", "Interacción disponible <=700 ms; skip/reduced; no repite al retorno"),
    inventory_row("FINAL-EXIT-001", "FinalRevisitExit.ts", CATEGORY_D, "Abre revisión elegida", "Salida local y navegación", "FinalLocalTransition", "/final / revisit transition", "Viewport contractual", "TypeScript/WAAPI", "NO_APLICA_CÓDIGO", "Ambas", "z100", "Contrato 021B", "No modifica TransitionWorld", "CSS/SVG/JS determinista", "Código por side effect", "Review context", "Doble navegación", "P1", "Un side effect; anuncio; foco; ruta /estacion/N"),

    inventory_row("FINAL-DISCARD-001", "texto_horneado_en_assets", CATEGORY_G, "Ninguna", "Texto dentro de imagen", "Ninguno", "Descartado", "NO_APLICA", "Raster", "Opaco/transparente", "Ambas", "N.A.", "Reglas GVO", "No reutilizar", "NO NECESARIO", "Texto operativo debe ser DOM", "Ninguna", "Accesibilidad/localización", "BLOQUEADO", "Cero texto operativo horneado"),
    inventory_row("FINAL-DISCARD-002", "portrait_recortado_como_landscape", CATEGORY_G, "Ninguna", "Recorte ciego 9:16→16:9", "Ninguno", "Descartado", "NO_APLICA", "Raster", "Opaco", "Landscape", "N.A.", "Contrato 021B", "No reutilizar", "NO NECESARIO", "Cámara landscape independiente", "Ninguna", "Pierde accesos/Lía", "BLOQUEADO", "No aparece en producción"),
    inventory_row("FINAL-DISCARD-003", "final_full_background_animation", CATEGORY_G, "Ninguna", "Fondo completo animado", "Ninguno", "Descartado", "NO_APLICA", "Video/sprite gigante", "Opaco", "Ambas", "N.A.", "Límites de motion", "No reutilizar", "NO NECESARIO", "Costo y ruido injustificados", "Ninguna", "Rendimiento/mareo", "BLOQUEADO", "No generar ni integrar"),
    inventory_row("FINAL-DISCARD-004", "final_locked_access_state", CATEGORY_G, "Ninguna", "Acceso bloqueado", "Ninguno", "Descartado", "NO_APLICA", "Código/asset", "N.A.", "Ambas", "N.A.", "Recorrido completo", "No crear", "NO NECESARIO", "Estado ficticio", "Ninguna", "Contradice contrato", "BLOQUEADO", "Cinco accesos siempre activos"),
    inventory_row("FINAL-DISCARD-005", "world_6_or_station_6", CATEGORY_G, "Ninguna", "Sexto mundo", "Ninguno", "Descartado", "NO_APLICA", "Código/asset", "N.A.", "N.A.", "N.A.", "Reglas no negociables", "No crear", "NO NECESARIO", "Fuera de modelo", "Ninguna", "Scope drift", "BLOQUEADO", "Cero /estacion/6 y cero progreso 6"),
    inventory_row("FINAL-DISCARD-006", "final_audio_or_runtime_video", CATEGORY_G, "Ninguna", "Audio/video pesado", "Ninguno", "Descartado", "NO_APLICA", "Audio/video", "N.A.", "N.A.", "N.A.", "Reglas GVO", "No crear", "NO NECESARIO", "Prohibido", "Ninguna", "Offline/permisos", "BLOQUEADO", "Cero audio, locución o video runtime"),
    inventory_row("FINAL-DISCARD-007", "final_remote_resource", CATEGORY_G, "Ninguna", "CDN/API/imagen remota", "Ninguno", "Descartado", "NO_APLICA", "URL remota", "N.A.", "N.A.", "N.A.", "Local-first", "No crear", "NO NECESARIO", "Prohibido", "Ninguna", "Campo sin Internet", "BLOQUEADO", "Cero requests externos"),
    inventory_row("FINAL-DISCARD-008", "duplicated_world_binaries", CATEGORY_G, "Ninguna", "Copias de assets I–V", "Ninguno", "Descartado", "NO_APLICA", "Raster", "N.A.", "N.A.", "N.A.", "Política current-used", "No duplicar", "NO NECESARIO", "Referenciar o generar específico", "Ninguna", "Confusión de procedencia", "BLOQUEADO", "Cero duplicados en paquete Final"),
    inventory_row("FINAL-DISCARD-009", "animated_final_placeholders", CATEGORY_G, "Ninguna", "Placeholder tratado como final", "Ninguno", "Descartado", "NO_APLICA", "CSS/raster", "N.A.", "Ambas", "N.A.", "Metodología GVO", "No reutilizar", "NO NECESARIO", "Prohibido animar placeholders", "Ninguna", "Falsa aprobación", "BLOQUEADO", "No se produce ni presenta como arte final"),
]


def source(path: str, classification: str, provenance: str, consumer: str) -> dict[str, str]:
    return {
        "path": path,
        "classification": classification,
        "provenance": provenance,
        "consumer": consumer,
    }


CONTACT_SHEETS: dict[str, list[dict[str, str]]] = {
    "final_021b_ref_mirador_contact_sheet.png": [
        source("docs/narrative/visual_refs/08_pantalla_final_mirador.png", "REFERENCIA_NO_RUNTIME", "Repositorio/entrega escritor; licencia específica NO DOCUMENTADA", "docs narrativos"),
        source("docs/narrative/atlas_visual_assets_gvo_v1/gvo_atlas_006f_306_final_revision_libre_mockup.png", "REFERENCIA_NO_RUNTIME", "Atlas visual; licencia específica NO DOCUMENTADA", "Atlas documental"),
        source("docs/narrative/atlas_visual_assets_gvo_v1/gvo_atlas_006f_307_final_confirmar_reinicio_mockup.png", "REFERENCIA_NO_RUNTIME", "Atlas visual; licencia específica NO DOCUMENTADA", "Atlas documental"),
    ],
    "final_021b_lia_candidate_contact_sheet.png": [
        source("public/assets/gvo/current-used/cover-intro/lia/poses/lia_pose_idle_v1.png", "F / prueba artística", "Manifest Cover; biblioteca Lía", "CoverIntroScreen/World2Root"),
        source("public/assets/gvo/current-used/cover-intro/lia/poses/lia_pose_greeting_v1.png", "F / prueba artística", "Manifest Cover; biblioteca Lía", "Cover/W4/W5"),
        source("public/assets/gvo/current-used/cover-intro/lia/poses/lia_pose_point_portal_1_v1.png", "F / prueba artística", "Manifest Cover; biblioteca Lía", "CoverIntroScreen/World2Root"),
        source("public/assets/gvo/current-used/world-1-root/lia/lia_root_idle_approved_v1.png", "F / prueba artística", "Manifest W1; fuente local Downloads/MUNDO1", "World1RootScreen"),
        source("public/assets/gvo/current-used/world-1-root/lia/lia_root_point_relation_approved_v1.png", "B / acting de referencia", "Manifest W1; fuente local Downloads/MUNDO1", "World1RootScreen"),
        source("public/assets/gvo/current-used/world-1-root/lia/lia_root_ready_continue_approved_v1.png", "B / acting de referencia", "Manifest W1; fuente local Downloads/MUNDO1", "World1RootScreen"),
        source("public/assets/gvo/current-used/world-3-root/lia/lia_world3_idle_v01.png", "B / pixelart de referencia", "W3 runtime aprobado; licencia específica NO DOCUMENTADA", "World3LiaActor"),
        source("public/assets/gvo/current-used/world-3-root/lia/lia_world3_pointing_v01.png", "B / acting de referencia", "W3 runtime aprobado; licencia específica NO DOCUMENTADA", "World3LiaActor"),
        source("public/assets/gvo/current-used/world-3-root/lia/lia_world3_closure_v01.png", "B / cierre de referencia", "W3 runtime aprobado; licencia específica NO DOCUMENTADA", "World3LiaActor"),
        source("public/assets/gvo/current-used/world-5-root/lia/lia_world5_lead_forward_v01.webp", "F / prueba artística", "Manifest ST5-020G; fuente local registrada", "World5RootScreen"),
        source("public/assets/gvo/current-used/world-5-root/lia/lia_world5_attend_neutral_v01.webp", "F / prueba artística", "Manifest ST5-020G; fuente local registrada", "World5RootScreen"),
    ],
    "final_021b_world1_memory_candidates.png": [
        source("public/assets/gvo/current-used/world-1-root/background/world1_root_background_base_approved_v1.png", "B / referencia de cámara", "Manifest W1; fuente local Downloads/MUNDO1", "World1RootScreen"),
        source("public/assets/gvo/current-used/world-1-root/plant/world1_root_young_plant_approved_v1.png", "B / memoria visual", "Manifest W1; fuente local Downloads/MUNDO1", "World1RootScreen"),
        source("public/assets/gvo/current-used/world-1-root/roots/world1_root_roots_base_approved_v1.png", "B / memoria visual", "Manifest W1; fuente local Downloads/MUNDO1", "World1RootScreen"),
        source("public/assets/gvo/current-used/world-1-root/nodes/world1_root_node_state_kit_approved_v1.png", "B / referencia de estados", "Manifest W1; fuente local Downloads/MUNDO1", "World1RootScreen"),
    ],
    "final_021b_world2_memory_candidates.png": [
        source("public/assets/gvo/current-used/world-2-root/plant/world2_main_living_plant_v01.png", "B / memoria visual", "Copiado desde Descargas según README; path/licencia exactos NO DOCUMENTADOS", "world2RuntimeAssets/World2RootScreen"),
        source("public/assets/gvo/current-used/world-2-root/signal/world2_raw_bioelectric_waveform_v01.png", "B / memoria visual", "Copiado desde Descargas según README; path/licencia exactos NO DOCUMENTADOS", "world2RuntimeAssets/World2RootScreen"),
        source("public/assets/gvo/current-used/world-2-root/route/world2_signal_mapping_constellation_v01.png", "B / referencia de ruta", "Copiado desde Descargas según README; path/licencia exactos NO DOCUMENTADOS", "world2RuntimeAssets/World2RootScreen"),
        source("public/assets/gvo/current-used/world-2-root/signal/world2_pulse_core_node_v01.png", "B / referencia de pulso", "Copiado desde Descargas según README; path/licencia exactos NO DOCUMENTADOS", "world2RuntimeAssets/World2RootScreen"),
    ],
    "final_021b_world3_memory_candidates.png": [
        source("public/assets/gvo/current-used/world-3-root/notebook/world3_notebook_open_base_v01.png", "B / memoria visual", "W3 runtime aprobado; licencia específica NO DOCUMENTADA", "World3RootScreen"),
        source("public/assets/gvo/current-used/world-3-root/records/world3_record_plant_v01.png", "B / memoria visual", "W3 runtime aprobado; licencia específica NO DOCUMENTADA", "World3RootScreen"),
        source("public/assets/gvo/current-used/world-3-root/records/world3_record_signal_device_v01.png", "B / memoria visual", "W3 runtime aprobado; licencia específica NO DOCUMENTADA", "SignalTraceDisplay/World3RootScreen"),
        source("public/assets/gvo/current-used/world-3-root/index/world3_index_notebook_marks_sheet_v01.png", "B / referencia de marcas", "W3 runtime aprobado; licencia específica NO DOCUMENTADA", "World3IndexNotebookMarks"),
    ],
    "final_021b_world4_memory_candidates.png": [
        source("public/assets/gvo/current-used/world-4-root/environment/world4_environment_base_v01.webp", "B / referencia de materialidad", "W4 runtime HUMAN_APPROVED; licencia específica NO DOCUMENTADA", "World4Stage"),
        source("public/assets/gvo/current-used/world-4-root/table/world4_table_top_v01.png", "B / referencia de mesa", "W4 runtime HUMAN_APPROVED; licencia específica NO DOCUMENTADA", "World4Stage"),
        source("public/assets/gvo/current-used/world-4-root/route/world4_system_route_base_v01.png", "B / referencia de ruta", "W4 runtime HUMAN_APPROVED; licencia específica NO DOCUMENTADA", "World4Stage"),
        source("public/assets/gvo/current-used/world-4-root/objects/world4_node_central_system_v01.png", "B / memoria visual", "W4 runtime HUMAN_APPROVED; licencia específica NO DOCUMENTADA", "World4NodeStack"),
    ],
    "final_021b_world5_memory_candidates.png": [
        source("public/assets/gvo/current-used/world-5-root/world5_map_environment_portrait_v01.webp", "B / referencia de cámara", "Manifest ST5-020G; fuente local registrada", "world5RuntimeAssets/World5RootScreen"),
        source("public/assets/gvo/current-used/world-5-root/world5_map_environment_landscape_v01.webp", "B / referencia de cámara", "Manifest ST5-020G; fuente local registrada", "world5RuntimeAssets/World5RootScreen"),
        source("public/assets/gvo/current-used/world-5-root/world5_map_sector_plants_v01.webp", "B / memoria visual", "Manifest ST5-020G; fuente local registrada", "world5RuntimeAssets/World5RootScreen"),
        source("public/assets/gvo/current-used/world-5-root/world5_map_sector_system_v01.webp", "B / memoria visual", "Manifest ST5-020G; fuente local registrada", "world5RuntimeAssets/World5RootScreen"),
    ],
    "final_021b_ui_backplate_candidates.png": [
        source("public/assets/gvo/current-used/world-2-root/dialogue/world2_dialogue_panel_backplate_v01.png", "B / referencia solamente", "W2 runtime; licencia específica NO DOCUMENTADA", "World2RootScreen"),
        source("public/assets/gvo/current-used/world-2-root/dialogue/world2_dialogue_card_mobile_safe_v01.png", "B / referencia solamente", "W2 runtime; licencia específica NO DOCUMENTADA", "World2RootScreen"),
        source("public/assets/gvo/current-used/world-4-root/ui/world4_text_card_backplate_v01.png", "F / prueba técnica y artística", "W4 runtime HUMAN_APPROVED; licencia específica NO DOCUMENTADA", "World4RootScreen"),
        source("public/assets/gvo/current-used/world-4-root/ui/world4_open_world5_button_backplate_v01.png", "F / prueba técnica y artística", "W4 runtime HUMAN_APPROVED; licencia específica NO DOCUMENTADA", "World4RootScreen"),
    ],
}


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest().upper()


def image_meta(path: Path) -> tuple[int, int, str, bool]:
    with Image.open(path) as image:
        alpha = False
        if "A" in image.getbands():
            extrema = image.getchannel("A").getextrema()
            alpha = extrema[0] < 255
        return image.width, image.height, image.mode, alpha


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(FONT_BOLD if bold else FONT_REGULAR), size)


def wrap(text: str, width: int) -> list[str]:
    return textwrap.wrap(text, width=width, break_long_words=True, break_on_hyphens=False) or [""]


def preflight() -> None:
    missing = []
    for entries in CONTACT_SHEETS.values():
        for entry in entries:
            if not (REPO_ROOT / entry["path"]).is_file():
                missing.append(entry["path"])
    if missing:
        raise FileNotFoundError("Missing contact-sheet sources:\n" + "\n".join(missing))
    if not FONT_REGULAR.is_file() or not FONT_BOLD.is_file():
        raise FileNotFoundError("Required local Windows fonts not found")


def checkerboard(size: tuple[int, int], cell: int = 16) -> Image.Image:
    image = Image.new("RGB", size, "#E8ECE8")
    draw = ImageDraw.Draw(image)
    for y in range(0, size[1], cell):
        for x in range(0, size[0], cell):
            if (x // cell + y // cell) % 2:
                draw.rectangle((x, y, x + cell - 1, y + cell - 1), fill="#CFD7D2")
    return image


def make_contact_sheet(filename: str, entries: list[dict[str, str]]) -> list[dict[str, str]]:
    columns = 2
    width = 1600
    margin = 36
    gap = 28
    header_height = 120
    card_width = (width - margin * 2 - gap) // columns
    card_height = 520
    rows = (len(entries) + columns - 1) // columns
    height = header_height + rows * card_height + (rows - 1) * gap + margin
    sheet = Image.new("RGB", (width, height), "#17221F")
    draw = ImageDraw.Draw(sheet)
    draw.text((margin, 24), filename.removesuffix(".png"), font=font(30, True), fill="#F2E7C9")
    draw.text((margin, 68), "PREPRODUCTION — NOT RUNTIME · ningún candidato está aprobado para /final", font=font(22, True), fill="#F0B35D")
    manifest_rows = []

    for index, entry in enumerate(entries):
        col = index % columns
        row = index // columns
        x0 = margin + col * (card_width + gap)
        y0 = header_height + row * (card_height + gap)
        x1 = x0 + card_width
        y1 = y0 + card_height
        draw.rounded_rectangle((x0, y0, x1, y1), radius=18, fill="#24322E", outline="#7E9A78", width=2)

        path = REPO_ROOT / entry["path"]
        w, h, mode, alpha = image_meta(path)
        thumb_box = (x0 + 18, y0 + 18, x0 + 310, y0 + 330)
        background = checkerboard((thumb_box[2] - thumb_box[0], thumb_box[3] - thumb_box[1]))
        with Image.open(path) as original:
            preview = original.convert("RGBA")
            preview.thumbnail(background.size, Image.Resampling.LANCZOS)
            offset = ((background.width - preview.width) // 2, (background.height - preview.height) // 2)
            background.paste(preview, offset, preview)
        sheet.paste(background, (thumb_box[0], thumb_box[1]))
        draw.rectangle(thumb_box, outline="#B6CDB5", width=1)

        tx = x0 + 330
        ty = y0 + 20
        label_lines = [
            Path(entry["path"]).name,
            f"{w}×{h} · {mode} · alpha={'sí' if alpha else 'no'}",
            f"clasificación: {entry['classification']}",
            f"consumidor: {entry['consumer']}",
            f"procedencia: {entry['provenance']}",
            f"SHA-256: {sha256(path)}",
        ]
        for label_index, label in enumerate(label_lines):
            size = 20 if label_index == 0 else 17
            color = "#FFFFFF" if label_index == 0 else "#D6E2D8"
            for line in wrap(label, 42):
                draw.text((tx, ty), line, font=font(size, label_index == 0), fill=color)
                ty += size + 7
            ty += 5

        path_lines = wrap(entry["path"], 90)
        py = y0 + 352
        for line in path_lines[:5]:
            draw.text((x0 + 18, py), line, font=font(15), fill="#BFD0C4")
            py += 20
        draw.text((x0 + 18, y1 - 30), "Decisión Mirador: NO APROBADO · validar técnica y arte por separado", font=font(15, True), fill="#F0B35D")

        manifest_rows.append({
            "contact_sheet": filename,
            "path": entry["path"],
            "sha256": sha256(path),
            "width": str(w),
            "height": str(h),
            "mode": mode,
            "alpha": "yes" if alpha else "no",
            "classification": entry["classification"],
            "provenance": entry["provenance"],
            "current_consumer": entry["consumer"],
            "final_approval": "NO_APPROVED_FOR_FINAL",
        })

    sheet.save(OUTPUT_DIR / filename, format="PNG", optimize=True)
    return manifest_rows


def draw_dashed_rectangle(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], color: str, width: int = 1, dash: int = 6) -> None:
    x0, y0, x1, y1 = box
    for x in range(x0, x1, dash * 2):
        draw.line((x, y0, min(x + dash, x1), y0), fill=color, width=width)
        draw.line((x, y1, min(x + dash, x1), y1), fill=color, width=width)
    for y in range(y0, y1, dash * 2):
        draw.line((x0, y, x0, min(y + dash, y1)), fill=color, width=width)
        draw.line((x1, y, x1, min(y + dash, y1)), fill=color, width=width)


def label(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str, size: int, color: str = "#E8F1EC", bold: bool = False, anchor: str | None = None) -> None:
    draw.text(xy, text, font=font(max(7, size), bold), fill=color, anchor=anchor)


def make_wireframe(width: int, height: int) -> None:
    portrait = height > width
    scale = max(0.72, min(width / 667, height / 667))
    small = max(7, round(9 * scale))
    medium = max(8, round(11 * scale))
    large = max(10, round(15 * scale))
    image = Image.new("RGB", (width, height), "#111A1D")
    draw = ImageDraw.Draw(image, "RGBA")

    safe_x = max(10, round(width * 0.035))
    safe_top = max(14, round(height * 0.04))
    safe_bottom = max(12, round(height * 0.035))
    safe = (safe_x, safe_top, width - safe_x, height - safe_bottom)
    draw_dashed_rectangle(draw, safe, "#73D39A", width=1, dash=max(4, round(6 * scale)))
    label(draw, (safe_x + 4, safe_top + 2), "SAFE AREA", small, "#73D39A", True)

    edge = max(6, round(width * 0.025))
    draw.rectangle((0, 0, edge, height), fill="#3EA56A33")
    draw.rectangle((width - edge, 0, width, height), fill="#3EA56A33")
    label(draw, (edge + 2, height // 2), "crop permitido: periferia", small, "#79DA9E")

    cross = max(10, round(14 * scale))
    for x, y in [(safe_x, safe_top), (width - safe_x, safe_top), (safe_x, height - safe_bottom), (width - safe_x, height - safe_bottom)]:
        draw.line((x - cross, y - cross, x + cross, y + cross), fill="#F16D6D", width=2)
        draw.line((x - cross, y + cross, x + cross, y - cross), fill="#F16D6D", width=2)
    label(draw, (width - safe_x - 2, safe_top + 2), "crop prohibido: core", small, "#F16D6D", True, "ra")

    if portrait:
        title_box = (round(width * 0.15), round(height * 0.07), round(width * 0.85), round(height * 0.17))
        horizon_y = round(height * 0.29)
        anchors = [
            (round(width * 0.24), round(height * 0.30), "I"),
            (round(width * 0.76), round(height * 0.30), "II"),
            (round(width * 0.50), round(height * 0.43), "III"),
            (round(width * 0.24), round(height * 0.52), "IV"),
            (round(width * 0.76), round(height * 0.52), "V"),
        ]
        lia = (round(width * 0.50), round(height * 0.68))
        mirador = (safe_x, round(height * 0.60), width - safe_x, round(height * 0.82))
        buttons_y = round(height * 0.82)
        credits = (round(width * 0.11), round(height * 0.91), round(width * 0.89), height - safe_bottom)
        modal = (round(width * 0.13), round(height * 0.28), round(width * 0.87), round(height * 0.72))
    else:
        title_box = (round(width * 0.31), safe_top + 4, round(width * 0.69), round(height * 0.17))
        horizon_y = round(height * 0.35)
        anchors = [
            (round(width * 0.14), round(height * 0.34), "I"),
            (round(width * 0.32), round(height * 0.27), "II"),
            (round(width * 0.50), round(height * 0.23), "III"),
            (round(width * 0.68), round(height * 0.27), "IV"),
            (round(width * 0.86), round(height * 0.34), "V"),
        ]
        lia = (round(width * 0.50), round(height * 0.61))
        mirador = (safe_x, round(height * 0.54), width - safe_x, round(height * 0.84))
        buttons_y = round(height * 0.72)
        credits = (round(width * 0.67), round(height * 0.86), width - safe_x, height - safe_bottom)
        modal = (round(width * 0.27), round(height * 0.18), round(width * 0.73), round(height * 0.76))

    draw.rectangle((0, 0, width, horizon_y), fill="#31414A55")
    draw.line((safe_x, horizon_y, width - safe_x, horizon_y), fill="#F0B35D", width=2)
    label(draw, (safe_x + 3, horizon_y - medium - 2), "HORIZONTE", medium, "#F0B35D", True)

    draw.rounded_rectangle(title_box, radius=max(4, round(7 * scale)), fill="#D7C59D55", outline="#F0D79C", width=1)
    label(draw, ((title_box[0] + title_box[2]) // 2, (title_box[1] + title_box[3]) // 2 - small), "TITLE ZONE · h1 DOM", large, "#FFF2CC", True, "mm")
    label(draw, ((title_box[0] + title_box[2]) // 2, (title_box[1] + title_box[3]) // 2 + small), "subtítulo DOM", medium, "#FFF2CC", False, "mm")

    radius = max(14, round(min(width, height) * (0.055 if portrait else 0.072)))
    for x, y, numeral in anchors:
        draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill="#6A4A7A88", outline="#D9B7EA", width=2)
        label(draw, (x, y - small), numeral, large, "#FFFFFF", True, "mm")
        label(draw, (x, y + small), "44+ DOM", small, "#FFFFFF", False, "mm")

    draw.rounded_rectangle(mirador, radius=max(5, round(10 * scale)), fill="#74583B66", outline="#CDA76F", width=2)
    label(draw, ((mirador[0] + mirador[2]) // 2, mirador[1] + medium), "ZONA MIRADOR / FOREGROUND", medium, "#F0D19A", True, "mm")

    lia_r = max(14, round(radius * 0.72))
    draw.ellipse((lia[0] - lia_r, lia[1] - lia_r, lia[0] + lia_r, lia[1] + lia_r), fill="#E7D4EC99", outline="#F4E9FA", width=2)
    label(draw, (lia[0], lia[1]), "LÍA", medium, "#322A38", True, "mm")
    label(draw, (lia[0], lia[1] + lia_r + small), "anchor alpha-aware", small, "#F4E9FA", False, "mm")

    button_h = max(22, round(height * 0.055))
    if portrait:
        gap = max(6, round(width * 0.025))
        bx0 = safe_x
        bx1 = width // 2 - gap
        bx2 = width // 2 + gap
        bx3 = width - safe_x
    else:
        bx0 = safe_x
        bx1 = round(width * 0.25)
        bx2 = round(width * 0.75)
        bx3 = width - safe_x
    draw.rounded_rectangle((bx0, buttons_y, bx1, buttons_y + button_h), radius=4, fill="#466B4F", outline="#94D2A0")
    draw.rounded_rectangle((bx2, buttons_y, bx3, buttons_y + button_h), radius=4, fill="#6B426F", outline="#D3A4D8")
    label(draw, ((bx0 + bx1) // 2, buttons_y + button_h // 2), "5 INICIO", small, "#FFFFFF", True, "mm")
    label(draw, ((bx2 + bx3) // 2, buttons_y + button_h // 2), "6 REINICIO", small, "#FFFFFF", True, "mm")

    draw.rounded_rectangle(credits, radius=4, fill="#D7C59D55", outline="#DCCB9E")
    label(draw, ((credits[0] + credits[2]) // 2, (credits[1] + credits[3]) // 2), "7 CRÉDITOS DOM", small, "#FFF2CC", True, "mm")

    draw.rounded_rectangle(modal, radius=max(4, round(8 * scale)), fill="#0D1415CC", outline="#F0B35D", width=2)
    label(draw, ((modal[0] + modal[2]) // 2, modal[1] + medium + 3), "8 MODAL RESET · role=dialog", medium, "#F0B35D", True, "mm")
    label(draw, ((modal[0] + modal[2]) // 2, (modal[1] + modal[3]) // 2), "snapshot → allowlist → verify\nrollback si falla · no navegar", small, "#FFFFFF", False, "mm")

    dom_text = "DOM: 1 h1 · 2 subtítulo · 3 accesos I→V · 4 mensaje/Lía · 5 inicio · 6 reinicio · 7 créditos · 8 diálogo"
    dom_y = max(safe_top + 2, height - safe_bottom - small - 2)
    draw.rectangle((safe_x, dom_y - 2, width - safe_x, height - safe_bottom), fill="#0A1010CC")
    label(draw, (safe_x + 3, dom_y), dom_text, small, "#BEE7CE")
    label(draw, (width // 2, max(2, safe_top - medium - 2)), "PREPRODUCTION — NOT RUNTIME", medium, "#F0B35D", True, "ma")
    label(draw, (width - safe_x, max(2, safe_top - medium - 2)), f"{width}×{height}", medium, "#FFFFFF", True, "ra")

    image.save(OUTPUT_DIR / f"final_021b_camera_{width}x{height}.png", format="PNG", optimize=True)


def write_inventory() -> dict[str, int]:
    output = OUTPUT_DIR / "final_021b_master_asset_inventory.csv"
    with output.open("w", encoding="utf-8-sig", newline="") as stream:
        writer = csv.writer(stream)
        writer.writerow(INVENTORY_HEADERS)
        writer.writerows(INVENTORY_ROWS)
    counts = Counter(row[2][0] for row in INVENTORY_ROWS)
    return {key: counts.get(key, 0) for key in "ABCDEFG"}


def write_contact_manifest(rows: list[dict[str, str]]) -> None:
    output = OUTPUT_DIR / "final_021b_contact_sheet_sources.csv"
    headers = [
        "contact_sheet", "path", "sha256", "width", "height", "mode", "alpha",
        "classification", "provenance", "current_consumer", "final_approval",
    ]
    with output.open("w", encoding="utf-8-sig", newline="") as stream:
        writer = csv.DictWriter(stream, fieldnames=headers)
        writer.writeheader()
        writer.writerows(rows)


def write_reuse_matrix(rows: list[dict[str, str]]) -> None:
    output = OUTPUT_DIR / "final_021b_reuse_matrix.csv"
    headers = [
        "asset", "path real", "hash", "dimensiones", "alpha",
        "consumidor actual", "licencia/procedencia", "compatible técnicamente",
        "compatible artísticamente", "decisión A/B/F/G",
        "nuevo consumidor permitido", "riesgo",
    ]
    with output.open("w", encoding="utf-8-sig", newline="") as stream:
        writer = csv.DictWriter(stream, fieldnames=headers)
        writer.writeheader()
        for row in rows:
            classification = row["classification"]
            if classification.startswith("F"):
                technical = "PENDIENTE_DE_PRUEBA"
                artistic = "PENDIENTE_DE_APROBACIÓN_HUMANA"
                decision = "F"
                allowed = "CONDICIONAL; ticket y aprobación explícita"
                risk = "Mezcla de cámara/estilo o semántica del consumidor original"
            elif classification.startswith("B"):
                technical = "SÍ COMO FUENTE DE REFERENCIA; NO COMO PROMOCIÓN AUTOMÁTICA"
                artistic = "REFERENCIA ÚNICAMENTE"
                decision = "B"
                allowed = "NO para binario; generar asset específico del Mirador"
                risk = "Copiar literalmente o duplicar un binario de otro mundo"
            else:
                technical = "NO COMO ASSET RUNTIME"
                artistic = "SÍ COMO DIRECCIÓN; NO COMO ARTE FINAL"
                decision = "B"
                allowed = "NO; documentación solamente"
                risk = "Promover un mockup/referencia sin procedencia ni licencia cerradas"
            writer.writerow({
                "asset": Path(row["path"]).name,
                "path real": row["path"],
                "hash": row["sha256"],
                "dimensiones": f"{row['width']}×{row['height']}",
                "alpha": row["alpha"],
                "consumidor actual": row["current_consumer"],
                "licencia/procedencia": row["provenance"],
                "compatible técnicamente": technical,
                "compatible artísticamente": artistic,
                "decisión A/B/F/G": decision,
                "nuevo consumidor permitido": allowed,
                "riesgo": risk,
            })


def write_generation_summary(counts: dict[str, int]) -> None:
    outputs = []
    for path in sorted(OUTPUT_DIR.iterdir(), key=lambda item: item.name.lower()):
        if path.is_file() and path.name != "final_021b_generation_summary.json":
            outputs.append({"file": path.name, "bytes": path.stat().st_size, "sha256": sha256(path)})
    payload = {
        "ticket": "GVO_FINAL_021B",
        "classification": "PREPRODUCTION_NOT_RUNTIME",
        "inventory_fields": len(INVENTORY_HEADERS),
        "inventory_resources": len(INVENTORY_ROWS),
        "inventory_category_counts": counts,
        "outputs": outputs,
    }
    (OUTPUT_DIR / "final_021b_generation_summary.json").write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )


def main() -> None:
    preflight()
    all_contact_rows: list[dict[str, str]] = []
    for filename, entries in CONTACT_SHEETS.items():
        all_contact_rows.extend(make_contact_sheet(filename, entries))
    write_contact_manifest(all_contact_rows)
    write_reuse_matrix(all_contact_rows)
    for width, height in [(375, 667), (390, 844), (667, 375), (844, 390), (1024, 768), (1365, 768)]:
        make_wireframe(width, height)
    counts = write_inventory()
    write_generation_summary(counts)
    print(json.dumps({"inventory_resources": len(INVENTORY_ROWS), "category_counts": counts}, ensure_ascii=False))


if __name__ == "__main__":
    main()
