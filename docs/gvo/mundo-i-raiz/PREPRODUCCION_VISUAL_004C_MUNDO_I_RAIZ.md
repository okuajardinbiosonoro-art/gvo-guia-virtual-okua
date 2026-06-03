# GVO - Mundo I: Raiz
## Preproduccion visual 004C

## 0. Estado del documento

Estado:

`PREPRODUCCION_VISUAL_004C_DOCUMENTAL / SIN_IMPLEMENTACION_RUNTIME / SIN_ARTE_FINAL`

Este documento prepara la produccion visual por capas de Mundo I: Raiz. No implementa `/estacion/1`, no crea componentes React, no modifica rutas, no modifica `public/assets` y no declara Mundo I como aprobado visualmente.

Base usada:

- `docs/gvo/mundo-i-raiz/AUDITORIA_004A_MUNDO_I_RAIZ.md`.
- `docs/gvo/mundo-i-raiz/CONTRATO_ASSETS_ANIMACION_004B_MUNDO_I_RAIZ.md`.
- Commit base esperado: `2028ade docs(gvo): add Mundo I Raiz 004B asset animation contract`.

## 1. Objetivo de la preproduccion

Definir un plan visual controlado para producir, revisar y aprobar los assets de Mundo I: Raiz antes de cualquier montaje runtime.

La preproduccion debe proteger la idea central:

> OKUA nace de una pregunta sobre la relacion con una planta viva, no de un deseo de espectaculo.

Frase central de la estacion:

> Antes de escuchar, necesitamos aprender a mirar.

Secuencia conceptual obligatoria:

`RELACION -> PERCEPCION -> MEDIACION -> Continuar`

Objetivos concretos:

- Preparar familias de assets separadas.
- Evitar una pantalla fusionada imposible de animar.
- Mantener textos finales en DOM/CSS.
- Preparar criterios de aceptacion visual antes de usar assets en runtime.
- Documentar limites entre generacion visual, Photopea y futura implementacion Codex.

## 2. Insumos usados

Insumos documentales:

- Auditoria 004A: identifica que `/estacion/1` existe solo como `StationPlaceholder` y que no hay assets runtime de Mundo I.
- Contrato 004B: define capas, estados, microposes de Lia, estados funcionales, reduced motion y limites tecnicos.

Insumos visuales indirectos del repo:

- Carga Inicial V13: referencia de escena mobile-first, texto DOM, barra y motion sobrio.
- Portada / Intro: referencia de Lia, dialogos DOM/CSS, gating narrativo y estados visuales aprobados para avanzar.
- Transicion entre mundos: referencia de assets locales, portal, progreso y composicion pixelart sobria.

No se usaron:

- Nuevas imagenes.
- Assets finales.
- Recursos externos.
- CDN.
- Audio.
- Video.

## 3. Principios de direccion visual

Mundo I debe sentirse como una estacion de origen, observacion y cuidado.

Principios:

- Organico, calido, subterraneo y contemplativo.
- Hibrido editorial organico con acentos pixelart GVO.
- Mobile-first vertical 9:16.
- Atmosfera oscura/dorada sin saturacion.
- Planta joven como centro sensible, no como espectaculo.
- Raices como estructura conceptual, no como cables.
- Tres nodos claros y pocos.
- Lia pequena o media, guia y acompanante, no protagonista dominante.
- Dialogos, labels y botones como DOM/CSS accesible.
- Animacion futura por opacidad, glow, pequenos desplazamientos y estados.

Evitar:

- Magia excesiva.
- Planta cantando.
- Notas musicales.
- Sensores, ESP32, MIDI, routers o cables como metafora principal.
- Particulas densas.
- Fondos con UI quemada.
- Lia redisenada, humana o hada.

## 4. Composicion objetivo

Composicion mobile-first:

- Pantalla vertical.
- Fondo subterraneo oscuro, calido y dorado.
- Planta joven en zona superior central.
- Raices bajo tierra ocupando la zona media.
- Tres nodos conceptuales en zona media-inferior.
- Lia pequena, activa y no dominante, ubicada cerca de planta o lateral de observacion.
- Camino luminoso hacia la derecha o salida visual, visible con mayor fuerza al cierre.
- Texto DOM en zona inferior, fuera de imagen.
- Boton `Continuar` DOM/CSS, inicialmente bloqueado hasta completar conceptos.
- Navegacion minima superior solo si el sistema la conserva.

Distribucion conceptual:

| Zona | Elemento | Funcion |
| --- | --- | --- |
| Superior | Planta joven | Centro sensible de la escena |
| Superior/media | Lia | Guia visual y narrativa |
| Media | Raices base | Origen y continuidad |
| Media-inferior | Nodos RELACION, PERCEPCION, MEDIACION | Progreso conceptual |
| Inferior | Dialogo/texto DOM | Explicacion breve y accesible |
| Inferior | Boton Continuar | Salida controlada |

## 5. Estrategia de produccion por capas

Mundo I debe producirse por familias de assets, no como imagen unica.

Familias minimas:

1. Fondo base.
2. Luz ambiental.
3. Planta joven.
4. Raices base.
5. Raices por concepto.
6. Glows por concepto.
7. Nodos conceptuales.
8. Camino luminoso de salida.
9. Lia en microposes.
10. Sombra/glow de Lia.
11. Particulas minimas opcionales.
12. Mascara/vineta opcional.

Regla practica:

- La imagen maestra puede existir como referencia o contact sheet.
- El runtime futuro solo debe usar capas separadas y controlables.
- Toda capa que cambie por estado debe exportarse de forma independiente.

## 6. Inventario visual por familia de assets

| Familia | Assets esperados | Estado futuro minimo | Observaciones |
| --- | --- | --- | --- |
| Fondo base | `world1_root_background_base` | Base | Sin texto, sin Lia, sin nodos, sin boton |
| Luz ambiental | `world1_root_ambient_glow`, halos suaves | Base/active | Overlays transparentes animables por opacidad |
| Planta joven | `world1_root_plant_young` | Base/emphasis | Fragil, sana, no adulta |
| Raices base | `world1_root_roots_base` | Idle | Apagadas, organicas, no cables |
| Raices por concepto | `world1_root_root_relation`, `world1_root_root_perception`, `world1_root_root_mediation` | Available/active/completed | Separadas para activar cada concepto |
| Glows por concepto | `world1_root_glow_relation`, `world1_root_glow_perception`, `world1_root_glow_mediation` | Active/completed | Brillo calido, baja saturacion |
| Nodos | `world1_root_node_relation`, `world1_root_node_perception`, `world1_root_node_mediation` | Locked/available/active/completed | Sin texto incrustado |
| Camino salida | `world1_root_exit_path_base`, `world1_root_exit_path_active` | Hidden/available/active | No portal dominante |
| Lia | microposes `lia_root_*` | Idle/dialog/concept/ready/exit | Debe conservar identidad aprobada |
| Sombra/glow Lia | `lia_root_shadow`, `lia_root_soft_glow` | Base/focus | Capa separada |
| Particulas | `world1_root_particles_soft` | Optional | Pocas, lentas, no saturadas |
| Mascara/vineta | `world1_root_vignette_focus` | Optional | Legibilidad y foco |

## 7. Matriz de decision raster / SVG / DOM / CSS

| Elemento | Formato preferido | Alternativa | Justificacion | Riesgo |
| --- | --- | --- | --- | --- |
| Fondo base | WebP | PNG | Peso menor, buena atmosfera | Si incluye elementos fusionados limita animacion |
| Luz ambiental | PNG transparente + CSS | CSS radial-gradient | Animacion por opacidad | Blur excesivo reduce nitidez |
| Planta joven | PNG/WebP transparente | Sprite corto futuro | Mantiene textura organica | Cambios de estado pueden parecer salto |
| Raices base | PNG/WebP transparente | SVG local | Textura organica | Si se fusiona no permite activacion |
| Raices activas | SVG local o PNG glow | PNG por estado | SVG permite stroke; PNG conserva estilo | SVG puede romper estetica pixel/ilustrada |
| Glows | PNG transparente | CSS box/radial glow | Control por opacidad | Exceso de glow parece magia |
| Nodos | DOM label + PNG ornamento | DOM puro | Accesibilidad y estados reales | Texto quemado no sirve |
| Lia | PNG/WebP transparente por pose | Sprite sheet | Coherencia con identidad | Generacion inconsistente |
| Dialogos | DOM/CSS | Ninguna | Accesibilidad y edicion | Imagen no accesible |
| Boton | DOM/CSS | Ninguna | Estado real y foco | Imagen no accesible |
| Camino salida | PNG transparente + CSS | SVG | Activacion por estado | Exceso de glow |
| Particulas | CSS/PNG pequeno | Reutilizar sparkles si se autoriza | Control de densidad | Saturacion visual |
| Textos | DOM/CSS | Ninguna | Accesibilidad, i18n futura, QA | Texto en imagen bloquea cambios |

## 8. Plan de generacion de candidatos

La fase posterior debe generar candidatos por lotes, fuera de Codex:

- 3 candidatos de fondo base.
- 3 candidatos de kit de raices por capas.
- 3 candidatos de kit de nodos.
- 3 candidatos de camino luminoso.
- 3 candidatos de microposes de Lia, usando referencia aprobada.
- 1 hoja de revision final por familia aprobada.

Reglas:

- Codex no ejecuta estos prompts en 004C.
- Cada candidato debe indicar familia, version, herramienta usada y observaciones.
- Ningun candidato entra a `public/assets` hasta aprobacion visual.
- Cada lote debe incluir version descartable y version con capas separables.

## 9. Plan de separacion y limpieza en Photopea

Photopea u otra herramienta grafica puede usarse despues para:

- Separar fondo de raices y nodos.
- Limpiar bordes transparentes.
- Eliminar textos generados accidentalmente.
- Corregir halos contaminados.
- Alinear tamanos de microposes.
- Preparar capas con nombres consistentes.
- Exportar PNG/WebP transparentes.

Reglas de limpieza:

- No redibujar identidad de Lia sin revision del usuario.
- No fusionar nodos con labels.
- No dejar fondos opacos en assets que deben ser transparentes.
- No exportar una unica pantalla final como runtime.
- Documentar cualquier retoque manual relevante.

## 10. Plan de exportacion de capas

Estructura local recomendada para preproduccion externa:

```txt
GVO_archivos_iniciales/
└── mundo_i_raiz_v1/
    ├── 00_especificacion/
    ├── 01_referencias_chatgpt/
    ├── 02_aprobadas/
    │   ├── background/
    │   ├── light/
    │   ├── plant/
    │   ├── roots/
    │   ├── nodes/
    │   ├── lia/
    │   ├── exit_path/
    │   └── ui_reference/
    ├── 03_editables_photopea/
    ├── 04_runtime_export/
    ├── 05_descartadas/
    └── 06_notas_revision/
```

Rutas runtime futuras sugeridas, no creadas en este ticket:

```txt
public/assets/gvo/stations/world-1-root/background/
public/assets/gvo/stations/world-1-root/light/
public/assets/gvo/stations/world-1-root/plant/
public/assets/gvo/stations/world-1-root/roots/
public/assets/gvo/stations/world-1-root/nodes/
public/assets/gvo/stations/world-1-root/lia/
public/assets/gvo/stations/world-1-root/exit-path/
```

Formato esperado:

- WebP para fondos finales si no requieren alpha complejo.
- PNG/WebP transparente para overlays, Lia, planta, raices y nodos.
- SVG local solo si conserva estetica y permite activacion mas limpia.
- DOM/CSS para textos, dialogos y boton.

## 11. Reglas de consistencia visual

- Mantener paleta calida, dorada, subterranea y sobria.
- Evitar neon cyberpunk.
- Evitar tecnicismo visual prematuro.
- Mantener densidad baja de particulas.
- Asegurar que Lia pertenezca al mismo universo visual que Portada y Transicion.
- Asegurar que los nodos no compitan con dialogos.
- Asegurar que la planta siga siendo joven.
- Asegurar que el fondo deje aire para texto y controles.
- Mantener una jerarquia clara: planta, raices, nodos, Lia, dialogo.

## 12. Reglas especificas para fondo animable

Permitido:

- Respiracion de luz ambiental.
- Opacidad lenta.
- Glow bajo planta.
- Brillo bajo tierra.
- Shimmer muy leve en raices.
- Particulas minimas con baja densidad.
- Vineta suave.

No permitido:

- Video de fondo.
- Zoom agresivo.
- Parallax complejo.
- Particulas abundantes.
- Fondo magico saturado.
- Movimiento de raices como cables.
- Crecimiento fuerte de planta.
- Blur pesado.
- Destellos rapidos.

El fondo debe conservar suficiente separacion para que las capas futuras funcionen con reduced motion.

## 13. Reglas especificas para raices animables

Las raices deben representar origen, relacion, percepcion y mediacion.

Reglas:

- Raices organicas, no electricas.
- Tres rutas conceptuales claramente separables.
- Estado base apagado.
- Estado disponible con brillo minimo.
- Estado activo con glow calido focalizado.
- Estado completado con luz mas estable y menos intensa.
- No deben parecer cables, circuitos o nervios electronicos.
- No deben moverse con fuerza.

Secuencia:

| Concepto | Ruta visual | Activacion esperada |
| --- | --- | --- |
| RELACION | lateral/izquierda | Primer acercamiento a la planta viva |
| PERCEPCION | central | Aprender a mirar antes de escuchar |
| MEDIACION | derecha/salida | OKUA como puente, no como sustitucion |

## 14. Reglas especificas para nodos conceptuales

Los nodos deben ser puntos de decision y aprendizaje, no iconos tecnicos.

Estados esperados:

| Estado | Visual esperado |
| --- | --- |
| Locked | Bajo contraste, apagado, sin brillo fuerte |
| Available | Contorno calido discreto |
| Active | Glow calido y foco claro |
| Completed | Luz estable, sin parpadeo |

Reglas:

- Sin texto incrustado.
- Espacio para label DOM.
- Forma tactil compatible con botones reales.
- No usar iconos de sensor, red, MIDI o audio.
- No usar candados dominantes si rompen calma visual.

## 15. Reglas especificas para Lia

Lia no debe ser inventada ni redisenada. La fase visual debe partir de referencia aprobada.

Microposes requeridas:

```txt
lia_root_idle
lia_root_invite_relation
lia_root_point_relation
lia_root_look_perception
lia_root_guide_mediation
lia_root_ready_continue
lia_root_exit
```

Descripcion:

| Micropose | Intencion visual | Riesgo a evitar |
| --- | --- | --- |
| `lia_root_idle` | Presencia serena cerca de planta | Rigidez o protagonismo excesivo |
| `lia_root_invite_relation` | Invita a observar la relacion | Gesto humanoide exagerado |
| `lia_root_point_relation` | Senala primer nodo/raiz | Parecer hada o guia magica |
| `lia_root_look_perception` | Mira planta o raiz central | Perder identidad de Lia |
| `lia_root_guide_mediation` | Acompana el puente conceptual | Explicar tecnologia visualmente |
| `lia_root_ready_continue` | Cierra con calma | Exceso de celebracion |
| `lia_root_exit` | Acompana salida hacia Mundo II | Crear transicion nueva sin ticket |

Si no hay referencia aprobada disponible, no generar Lia.

## 16. Reglas especificas para luz ambiental

La luz debe acompanhar la lectura conceptual sin convertir la escena en magia.

Permitido:

- Halos dorados suaves.
- Overlays con alpha bajo.
- Pulsos lentos.
- Luz bajo planta.
- Luz al activar raiz/nodo.

No permitido:

- Brillos blancos saturados.
- Glow permanente en toda la pantalla.
- Particulas densas.
- Rayos, explosiones o destellos.
- Efectos de audio visualizado.

## 17. Reglas especificas para camino de salida

El camino de salida debe aparecer como consecuencia de completar RELACION, PERCEPCION y MEDIACION.

Reglas:

- Sutil, calido y lateral.
- No debe parecer un portal nuevo dominante.
- No debe parecer carretera literal.
- No debe competir con nodos.
- Debe tener estado base y activo.
- Debe poder ocultarse en reduced motion o aparecer sin animacion.

## 18. Reglas para textos DOM/CSS

Textos finales fuera de imagen.

Requisitos:

- Labels de nodos como DOM/CSS.
- Dialogos de Lia como DOM/CSS.
- Boton Continuar como DOM/CSS.
- Texto breve, editable y accesible.
- Sin textos quemados en fondos, nodos o hojas de contacto.

Textos conceptuales protegidos:

- `RELACION`
- `PERCEPCION`
- `MEDIACION`
- `Continuar`
- `Antes de escuchar, necesitamos aprender a mirar.`

## 19. Reglas de accesibilidad visual

- Contraste suficiente entre texto y fondo.
- Areas tactiles reales para nodos y boton.
- Estados de foco visibles.
- No depender solo de color para estado.
- Labels DOM legibles en mobile 360px.
- Dialogos no deben tapar nodos activos.
- Animaciones lentas y pausables por reduced motion.
- Evitar flicker o destellos.

## 20. Reglas de reduced-motion desde preproduccion

La preproduccion debe preparar equivalentes estaticos o casi estaticos.

| Familia | Normal | Reduced motion |
| --- | --- | --- |
| Fondo | Respiracion de luz lenta | Estado estatico |
| Raices | Glow progresivo sutil | Cambio de estado sin shimmer |
| Nodos | Pulso leve en active | Contorno/fill estable |
| Lia | Microvida ligera | Pose estable |
| Camino salida | Fade suave | Aparicion simple |
| Particulas | Opcionales, lentas | Ocultas o estaticas |

## 21. Riesgos visuales y mitigaciones

| Riesgo | Impacto | Mitigacion |
| --- | --- | --- |
| Imagen final fusionada | Bloquea animacion y accesibilidad | Exigir capas separadas |
| Lia inconsistente | Rompe identidad GVO | Usar referencia aprobada y checklist |
| Fondo saturado | Dificulta lectura | Bajar densidad y contraste de particulas |
| Raices como cables | Mensaje tecnico prematuro | Rechazo inmediato |
| Texto incrustado | No accesible ni editable | Rechazo inmediato |
| Nodos poco tactiles | Mala UX mobile | Reservar espacio para DOM real |
| Assets pesados | Riesgo offline/mobile | Preferir WebP y optimizar despues |
| Exceso de glow | Parecer magia | Intensidad baja y estados claros |
| Planta adulta | Rompe narrativa de origen | Exigir planta joven |

## 22. Bloqueos antes de produccion de assets

Bloqueos visuales:

- Falta de referencia aprobada de Lia para microposes.
- Falta de decision del usuario sobre candidatos de fondo.
- Falta de aprobacion de estilo de raices.
- Falta de aprobacion de nodos sin texto.

Bloqueos tecnicos:

- Assets fusionados sin transparencia.
- Nombres de archivo inconsistentes.
- Exportes sin alpha donde se requiere.
- Pesos excesivos sin version optimizada.
- Falta de contact sheet por familia.

## 23. Criterios para pasar de preproduccion a generacion visual

La preproduccion 004C puede considerarse lista para generar candidatos cuando:

- Existen prompts por familia.
- Existe checklist QA visual.
- Se entiende que Codex no genera arte final.
- Esta clara la estructura local de trabajo.
- Estan claros los estados visuales y funcionales.
- Se confirma que ninguna capa debe tener texto final incrustado.
- Se confirma que Mundo I sigue sin implementacion runtime.
- Se confirma que `/estacion/1` y `public/assets` no fueron modificados en 004C.
