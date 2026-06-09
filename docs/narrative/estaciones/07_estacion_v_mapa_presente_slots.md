# Slots de texto — Estación V — Mundo V: Mapa del Presente

## Uso

Este archivo lista los slots de texto requeridos para guionización. No contiene textos finales.

## Tabla de slots

| ID | Estado | Emisor sugerido | Tipo de texto | Contexto visual | Acción previa | Función del texto | Concepto obligatorio | Evitar | Longitud sugerida |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| W5_INTRO_LIA_01 | `w5_intro` | Lía | Entrada | Escena inicial con Lía y elementos principales visibles. | Ingreso a la pantalla. | Presentar OKÚA como montaje vivo situado. | Presente / espacio real | Repetir cadena técnica | 90-160 caracteres |
| W5_INTRO_AMB_01 | `w5_intro` | Ambiente | Texto ambiental | Escena inicial con Lía y elementos principales visibles. | Ingreso a la pantalla. | Situar mapa, espacio y recorrido como conjunto. | Experiencia situada | Nueva teoría | 50-120 caracteres |
| W5_PLANTAS_HINT_01 | `w5_plantas_available` | Lía | Instrucción contextual | Elemento PLANTAS disponible o activo. | Visitante sigue la secuencia indicada. | Invitar a activar PLANTAS. | Plantas | Repetir Mundo I completo | 40-90 caracteres |
| W5_PLANTAS_AMB_01 | `w5_plantas_active` | Lía / ambiente | Diálogo por área | Elemento PLANTAS disponible o activo. | Visitante sigue la secuencia indicada. | Reconocer el origen vivo del montaje actual. | Plantas / vida | Adorno | 70-140 caracteres |
| W5_PLANTAS_CONFIRM_01 | `w5_plantas_active` | Lía | Confirmación breve | Elemento PLANTAS disponible o activo. | Visitante sigue la secuencia indicada. | Confirmar que el presente del montaje parte de vidas vegetales. | Origen vivo | Planta como objeto | 50-120 caracteres |
| W5_SISTEMA_HINT_01 | `w5_sistema_available` | Lía | Instrucción contextual | Elemento SISTEMA disponible o activo. | Visitante sigue la secuencia indicada. | Invitar a activar SISTEMA. | Sistema | Reexplicar ocho nodos | 40-90 caracteres |
| W5_SISTEMA_AMB_01 | `w5_sistema_active` | Lía / ambiente | Diálogo por área | Elemento SISTEMA disponible o activo. | Visitante sigue la secuencia indicada. | Mostrar la mediación operando en el presente. | Sistema / mediación | Repetir Estación IV | 70-140 caracteres |
| W5_SISTEMA_CONFIRM_01 | `w5_sistema_active` | Lía | Confirmación breve | Elemento SISTEMA disponible o activo. | Visitante sigue la secuencia indicada. | Confirmar que el sistema sostiene la experiencia sin reemplazarla. | Mediación actual | Máquina como centro único | 50-120 caracteres |
| W5_ESPACIO_HINT_01 | `w5_espacio_available` | Lía | Instrucción contextual | Elemento ESPACIO disponible o activo. | Visitante sigue la secuencia indicada. | Invitar a activar ESPACIO. | Espacio | Abstracción total | 40-90 caracteres |
| W5_ESPACIO_AMB_01 | `w5_espacio_active` | Lía / ambiente | Diálogo por área | Elemento ESPACIO disponible o activo. | Visitante sigue la secuencia indicada. | Aterrizar la experiencia en un lugar real. | Lugar / montaje | App aislada del jardín | 70-140 caracteres |
| W5_ESPACIO_CONFIRM_01 | `w5_espacio_active` | Lía | Confirmación breve | Elemento ESPACIO disponible o activo. | Visitante sigue la secuencia indicada. | Confirmar que el espacio también organiza la experiencia. | Experiencia situada | Decorado | 50-120 caracteres |
| W5_VISITANTE_HINT_01 | `w5_visitante_available` | Lía | Instrucción contextual | Elemento VISITANTE disponible o activo. | Visitante sigue la secuencia indicada. | Invitar a activar VISITANTE. | Visitante | Usuario pasivo | 40-90 caracteres |
| W5_VISITANTE_AMB_01 | `w5_visitante_active` | Lía / ambiente | Diálogo por área | Elemento VISITANTE disponible o activo. | Visitante sigue la secuencia indicada. | Incluir la participación del visitante en la lectura del montaje. | Participación | Público como espectador pasivo | 70-150 caracteres |
| W5_VISITANTE_CONFIRM_01 | `w5_visitante_active` | Lía | Confirmación breve | Elemento VISITANTE disponible o activo. | Visitante sigue la secuencia indicada. | Confirmar que el recorrido se completa con quien lo atraviesa. | Visitante / experiencia | Antropocentrismo excesivo | 50-130 caracteres |
| W5_AREA_LOCKED_01 | `w5_area_locked` | Lía o sistema | Bloqueo suave | Elemento fuera de orden no avanza. | Visitante tocó un elemento bloqueado. | Guiar a la siguiente área. | Síntesis ordenada | Regaño | 35-90 caracteres |
| W5_AREA_REPEAT_01 | `w5_area_locked` | Lía o sistema | Relectura / repetición | Elemento ya revisado recibe nuevo toque. | Visitante repite un elemento completado. | Indicar que esa área ya fue revisada. | Revisión cuidadosa | Error técnico | 35-90 caracteres |
| W5_COMPLETE_LIA_01 | `w5_complete` | Lía | Cierre previo | Pantalla completa con todos los pasos activados. | Visitante completó la secuencia principal. | Preparar paso al mirador final. | Cierre del recorrido | Introducir estación nueva | 80-150 caracteres |
| W5_COMPLETE_AMB_01 | `w5_complete` | Ambiente | Cierre ambiental | Pantalla completa con todos los pasos activados. | Visitante completó la secuencia principal. | Cerrar el mapa como síntesis del presente. | Presente / síntesis | Repetir teoría | 50-120 caracteres |
| W5_FINAL_BTN_01 | `w5_complete` | Sistema / interfaz | Botón | Botón de avance habilitado. | Pantalla completada. | Abrir transición hacia pantalla final. | Cierre | Ambigüedad | 1-4 palabras |
| W5_ACCESSIBLE_SCENE_01 | `w5_intro` | Sistema / accesibilidad | Descripción accesible | Estado visual activo requiere descripción accesible. | Fallback o lector de pantalla requiere descripción. | Describir mapa, Lía y cuatro áreas. | Mapa / áreas | Texto excesivo | 90-170 caracteres |
| W5_ACCESSIBLE_PLANTAS_01 | `w5_plantas_active` | Sistema / accesibilidad | Descripción accesible | Estado visual activo requiere descripción accesible. | Fallback o lector de pantalla requiere descripción. | Describir activación de PLANTAS. | Plantas | Adorno | 70-140 caracteres |
| W5_ACCESSIBLE_SISTEMA_01 | `w5_sistema_active` | Sistema / accesibilidad | Descripción accesible | Estado visual activo requiere descripción accesible. | Fallback o lector de pantalla requiere descripción. | Describir activación de SISTEMA. | Sistema | Ocho nodos completos | 70-140 caracteres |
| W5_ACCESSIBLE_ESPACIO_01 | `w5_espacio_active` | Sistema / accesibilidad | Descripción accesible | Estado visual activo requiere descripción accesible. | Fallback o lector de pantalla requiere descripción. | Describir activación de ESPACIO. | Espacio | Decorado | 70-140 caracteres |
| W5_ACCESSIBLE_VISITANTE_01 | `w5_visitante_active` | Sistema / accesibilidad | Descripción accesible | Estado visual activo requiere descripción accesible. | Fallback o lector de pantalla requiere descripción. | Describir activación de VISITANTE. | Visitante | Pasividad | 70-150 caracteres |

## Notas para implementación futura

- Los IDs son estables para revisión y futura implementación.
- `Emisor sugerido` no impone estilo literario.
- Los campos de texto final deben ser completados por el escritor en la matriz.
