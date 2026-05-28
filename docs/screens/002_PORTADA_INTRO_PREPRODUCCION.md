# Portada / Intro - Preproducción

Pantalla: `PORTADA / INTRO - EL ARCHIVO VIVO DE OKÚA`

Estado: `PREPRODUCCION_DESBLOQUEADA / NO_IMPLEMENTADA`

Fecha: 2026-05-17

## Insumos usados

- Especificación copiada al repo: `docs/source_specs/002_portada_intro_archivo_vivo_v1.txt`
- Referencia visual copiada al repo: `assets/reference/screens/002_portada_intro_archivo_vivo_reference.png`
- Fuente local original: `C:\Users\JOSE DAVID\Desktop\OKÚA\Aplicaciones\GVO_archivos_iniciales\GVO_PORTADA_ARCHIVO_VIVO_ESPECIFICACION_V1.txt`
- Referencia local original: `C:\Users\JOSE DAVID\Desktop\OKÚA\Aplicaciones\GVO_archivos_iniciales\portada.png`

## Propósito de la portada

La portada debe funcionar como entrada narrativa al recorrido. Debe presentar el Archivo Vivo de OKÚA, mostrar los cinco mundos como portales y situar a Lía como guía antes de permitir el ingreso a Mundo I.

No es una estación, no es transición, no es pantalla de carga, no es menú libre completo en primera pasada y no debe reemplazar la pedagogía inicial de Lía.

## Estilo visual recomendado

Dirección recomendada:

`híbrido editorial orgánico + acentos pixelart`

La portada no debe convertirse en pixelart retro puro. Debe conservar una sensación orgánica, luminosa y editorial, con UI final construida en DOM/CSS y acentos pixelart controlados.

Reglas:

- Textos finales como DOM/CSS, no incrustados en imagen.
- Botones como DOM/CSS.
- Diálogos como DOM/CSS accesible.
- Logo OKÚA controlado localmente, no generado como texto distorsionado por IA.
- Portales y fondo pueden partir de ChatGPT Images, pero deben limpiarse y revisarse.
- Lía debe validarse estrictamente contra identidad.
- Portal I habilitado; portales II-V bloqueados.
- No saturar partículas.
- No incluir cadena técnica de 8 nodos.
- No incluir audio ni video runtime.

## Lectura crítica de `portada.png`

La referencia `portada.png` aporta una composición 9:16 aproximada con:

- Marca superior OKÚA / Guía Visual.
- Lía grande, luminosa, activa y amable.
- Cinco portales centrales.
- Pedestal o base inferior.
- Texto `EL ARCHIVO VIVO DE OKÚA`.
- Botón `Comenzar recorrido`.
- Ambiente cálido, orgánico y biomimético.

Riesgos detectados en la referencia:

- Textos incrustados podrían quedar deformados si se regeneran con IA.
- La presencia de Lía puede competir con portales si no se controla escala.
- Los portales pueden saturar la pantalla móvil si todos tienen igual protagonismo.
- La UI puede parecer imagen fija si botones y diálogos no se implementan como DOM.

## Textos fijos

Textos visibles principales:

- `OKÚA`
- `GUÍA VISUAL`
- `EL ARCHIVO VIVO DE OKÚA`
- `Comenzar recorrido`
- `I`
- `II`
- `III`
- `IV`
- `V`

Los nombres completos de mundos pueden mostrarse al tocar/enfocar, no necesariamente siempre visibles.

## Diálogos introductorios obligatorios de Lía

La primera pasada debe incluir diálogos breves, uno a la vez:

1. `Hola, soy Lía. Voy a acompañarte por el Archivo Vivo de OKÚA.`
2. `Antes de entrar, aclaremos algo: las plantas no hacen música por sí solas.`
3. `Lo que vas a recorrer es una mediación: una señal viva, una captura técnica y una interpretación.`
4. `Primero seguiremos el orden de los mundos. Al final podrás volver libremente a cualquier estación.`
5. `Empecemos por la raíz: el origen y el propósito de OKÚA.`

Ideas que no deben perderse:

- Lía se presenta.
- Las plantas no hacen música por sí solas.
- La experiencia requiere mediación.
- La primera pasada es secuencial.
- Al final habrá revisión libre.
- El primer mundo es Raíz.

## Portales y estados

Portal I:

- Estación I - Mundo I: Raíz.
- Estado inicial: habilitado.
- Tocar Portal I inicia diálogos si es primera pasada.
- No abre directamente antes de completar diálogos.

Portales II-V:

- Estado inicial: bloqueado.
- Deben ser visibles, pero con menor protagonismo.
- Deben comunicar bloqueo con candado o indicador equivalente.
- Deben responder al toque sin navegar.

Estados funcionales previstos:

- `portada_idle`
- `intro_dialogue_started`
- `intro_dialogue_active`
- `intro_dialogue_completed`
- `portal_1_ready`
- `portal_1_opening`
- `transition_to_station_1`
- `free_review_mode`

## Acciones disponibles

Primera pasada:

- Tocar `Comenzar recorrido`.
- Tocar Portal I.
- Tocar portales bloqueados para feedback breve.
- Avanzar diálogos de Lía.
- Confirmar entrada al Portal I después de los diálogos.

No debe permitirse:

- Saltar a Portal II-V.
- Entrar a Estación I sin diálogos introductorios.
- Abrir dos diálogos a la vez.
- Mostrar transición antes de completar la introducción.

## Bloqueos de primera pasada

Durante estas fases se deben bloquear taps repetidos:

- `intro_dialogue_started`
- Cambio entre diálogos.
- `portal_1_opening`
- `transition_to_station_1`

Si el usuario toca varias veces `Comenzar recorrido`, no se reinicia el diálogo. Si toca portales durante diálogo, no se navega.

## Reduced motion

Con `prefers-reduced-motion` activo:

- No hacer zoom fuerte al portal.
- No desplazar a Lía en recorridos amplios.
- No usar partículas animadas densas.
- No usar pulso continuo.
- Usar cambios de opacidad y estado.
- Mantener la secuencia pedagógica.

## Accesibilidad

Requisitos:

- Botón `Comenzar recorrido` con label claro.
- Portales bloqueados con estado comunicado.
- Portal I como disponible.
- Diálogos de Lía con `aria-live` o equivalente.
- Foco lógico en ventana de diálogo.
- Navegación táctil clara.
- No depender solo del color para bloqueo.

Textos accesibles sugeridos:

- Portal I: `Estación I, Mundo Raíz, disponible.`
- Portal II: `Estación II, bloqueada hasta completar Mundo I.`
- Botón: `Comenzar recorrido.`
- Diálogo: `Lía dice: [texto actual].`

## Límites visuales

- No usar varias Lías.
- No usar a Lía solo como decoración.
- No saturar con partículas.
- No usar diálogos largos.
- No mostrar la cadena técnica de 8 nodos en portada.
- No mostrar créditos.
- No mezclar función de portada con pantalla final.
- No generar textos dentro de imágenes.

## Criterios de 7/10

La primera implementación funcional puede considerarse `APROBADA_PARA_AVANZAR` si:

- Se lee claramente como El Archivo Vivo de OKÚA.
- Lía guía la experiencia.
- Hay cinco portales visibles.
- Portal I está habilitado.
- Portales II-V están bloqueados.
- `Comenzar recorrido` inicia diálogos.
- Portal I no abre antes de diálogos.
- La pantalla es mobile-first y legible.
- No hay audio, video runtime, CDN ni recursos externos.

## Criterios de 9/10 y deuda futura

Para `CERRADA_APROBADA_FINAL` se espera:

- Dirección de arte refinada.
- Lía perfectamente consistente.
- Portales con identidad visual clara.
- Animación y microinteracciones fluidas.
- Diálogos integrados sin rigidez.
- Accesibilidad revisada.
- Reduced motion verificado.
- Sin deuda visual importante.

## Riesgos aprendidos de carga inicial

- No invertir demasiado tiempo en un único detalle antes de tener flujo completo.
- Separar `APROBADA_PARA_AVANZAR` de cierre final.
- No depender de PNG completos para resolver toda la animación.
- Documentar deuda visual sin esconderla.
- Validar mobile-first con capturas.
- Mantener assets, prompts y límites antes de que Codex implemente.

## Secuencia de tickets recomendada

1. `002B`: generación y selección de assets de Portada / Intro.
2. `002C`: normalización/export runtime de assets aprobados.
3. `002D`: implementación funcional base de Portada / Intro.
4. `002E`: diálogos de Lía y gating de Portal I.
5. `002F`: polish visual/motion/reduced motion.
6. `002G`: validación mobile y handoff a transición/Mundo I si alcanza umbral.

## Asset staging V1

Estado:

`ASSETS_STAGED / NO_IMPLEMENTADA`

Ruta runtime:

`public/assets/runtime/cover-intro/`

Manifest:

`public/assets/runtime/cover-intro/manifest.json`

Validador:

`tools/validate_cover_intro_assets.mjs`

Comando:

```powershell
npm run validate:cover-intro-assets
```

Decisiones de staging:

- Fondo base staged como `background/cover_bg_archivo_vivo_base_v1.png`.
- Lía staged con cinco poses completas.
- Referencia maestra de Lía staged como referencia runtime.
- Rig idle V1 de Lía staged para futura animación por capas.
- `lia_rig_shadow_soft_v1.png` queda copiado pero opcional.
- Portal I staged con frame enabled y glow enabled.
- Portales II-V usarán `portals/shared/frame/portal_locked_frame_base_v1.png`.
- Candado staged como `locks/lock_soft_gold_v1.png`.
- Interiores de portales quedan diferidos en manifest.
- Textos, números, botón y diálogos siguen definidos como HTML/CSS.

Restricciones:

- No se modificaron visualmente PNGs.
- No se recortó, reencuadró, escaló ni recomprimió.
- No se implementó componente React.
- No se creó ruta funcional de portada.
- No se modificó carga inicial.
