# Portada / Intro - Preproducción

Pantalla: `PORTADA / INTRO - EL ARCHIVO VIVO DE OKÚA`

Estado: `QA_FINAL_002L_GENERADO / CANDIDATA_APROBADA_PARA_AVANZAR / PENDIENTE_CONFIRMACION_FINAL_USUARIO`

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
6. `002G`: transición placeholder y handoff a Mundo I.
7. `002H`: QA visual mobile y decisión de aprobación para avanzar.
8. `002I`: diálogo premium y recomposición visual D3/P3 parcial.
9. `002I-FIX`: corrección de diálogo, layout y QA flow.
10. `002I-FIX2`: diálogo integrado con Lía y activación visual de Portal I.
11. `002J`: Lía hybrid rig facial seguro en idle.
12. `002J-FIX`: microvida perceptible y diálogo sin conector ordinario.
13. `002K`: coreografía base de activación del Portal I.
14. `002L`: QA visual final y reaprobación.

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

## Base visual 002D

Estado:

`BASE_VISUAL_IMPLEMENTADA / SIN_DIALOGOS / SIN_GATING_FINAL / NO_CERRADA`

Ruta activa:

`/portada`

Implementado:

- Base visual mobile-first de Portada / Intro.
- Fondo Archivo Vivo desde assets staged.
- Lía visible como guía principal usando `lia_pose_idle_v1.png`.
- Portal I disponible visualmente.
- Portales II-V bloqueados visualmente con frame locked compartido.
- Candados visibles para Portales II-V.
- Textos DOM:
  - `OKÚA`
  - `GUÍA VISUAL`
  - `EL ARCHIVO VIVO DE OKÚA`
  - `Comenzar recorrido`
  - `I`, `II`, `III`, `IV`, `V`
- Botón DOM/CSS.
- Números romanos DOM/CSS.
- Reduced motion básico.

No implementado:

- Secuencia completa de diálogos.
- Gating narrativo final de Portal I.
- Transición pixelart a Mundo I.
- Interiores de portales.
- Desbloqueo de Portales II-V.

Notas para 002E:

- El botón y Portal I deben iniciar los diálogos introductorios.
- Portales II-V deben mostrar feedback breve sin navegar.
- Portal I solo debe quedar listo después de completar diálogos.
- La transición real todavía puede quedar para un ticket posterior si el alcance de 002E se mantiene acotado.

## Base narrativa 002E

Estado:

`DIALOGOS_BASE_IMPLEMENTADOS / GATING_PORTAL_I_BASE / SIN_TRANSICION_REAL / NO_CERRADA`

Ruta activa:

`/portada`

Implementado:

- `Comenzar recorrido` inicia la secuencia introductoria de Lía.
- Portal I inicia la misma secuencia en primera pasada; no abre directamente.
- Se muestran los cinco diálogos obligatorios, uno a la vez, como texto DOM accesible.
- Durante los diálogos no se navega ni se abre Portal I.
- Al terminar la introducción, Portal I queda listo y el botón cambia a `Entrar a Mundo I`.
- Al tocar `Entrar a Mundo I` o Portal I listo, la pantalla pasa a `portal_1_opening_placeholder`.
- El placeholder muestra `Abriendo Mundo I: Raíz...`.
- Portales II-V siguen bloqueados y muestran feedback breve al toque.
- Lía cambia entre poses staged existentes: idle, greeting, explainCalm, pointPortal1 y activatePortal1.
- Se usa persistencia mínima `gvo.coverIntro.introCompleted.v1` solo para recordar que la introducción fue completada.

No implementado:

- Transición pixelart real a Mundo I.
- Estación I.
- Interiores de portales.
- Desbloqueo de Portales II-V.
- Modo libre completo.
- Nuevos assets o edición de assets staged.

Notas para 002F:

- Pulir motion de poses de Lía y diálogo sin cambiar textos.
- Refinar pulso de Portal I listo y estado opening placeholder.
- Robustecer reduced motion.
- Mantener `/` y `/carga` intactas.
- No implementar todavía la transición real.

## Motion polish 002F

Estado:

`MOTION_POLISH_BASE / DIALOGOS_BASE_IMPLEMENTADOS / SIN_TRANSICION_REAL / NO_CERRADA`

Ruta activa:

`/portada`

Mejoras aplicadas:

- Lía conserva poses completas staged, pero su flotación queda separada del cambio de pose.
- La flotación de Lía usa desplazamiento vertical leve y rotación mínima.
- Cada cambio de pose usa un fade/settle breve para reducir salto visual.
- Portal I tiene pulso bajo en estado inicial.
- Portal I en `portal_1_ready` gana presencia sin parecer abierto.
- Portal I en `portal_1_opening_placeholder` muestra glow controlado y texto `Abriendo Mundo I: Raíz...`.
- Portales II-V conservan bloqueo y agregan feedback visual sutil cuando se tocan.
- La tarjeta de diálogo aparece con opacidad y desplazamiento mínimo, sin typing effect ni scroll.
- Botón principal y botón de diálogo tienen feedback pressed/focus claro.
- Reduced motion corta animaciones continuas y mantiene la narrativa funcional.

No implementado:

- Transición real hacia Mundo I.
- Navegación a Estación I.
- Interiores de portales.
- Desbloqueo de Portales II-V.
- Nuevos assets.
- Edición de assets staged.

Notas para 002G:

- Conectar `portal_1_opening_placeholder` con una transición controlada o handoff hacia Mundo I.
- Mantener Estación I completa fuera de alcance salvo ticket autorizado.
- Conservar las reglas de reduced motion y no introducir audio, video runtime ni recursos externos.

## Transición placeholder 002G

Estado:

`TRANSICION_PLACEHOLDER_IMPLEMENTADA / HANDOFF_MUNDO_I_PREPARADO / NO_CERRADA`

Ruta activa:

`/portada`

Implementado:

- Se agrega el estado `transition_to_station_1_placeholder`.
- Al tocar `Entrar a Mundo I`, primero se conserva `portal_1_opening_placeholder`.
- Después de un lapso breve, la portada muestra un overlay DOM de transición placeholder.
- El overlay muestra:
  - `Abriendo Mundo I: Raíz...`
  - `Preparando recorrido...`
  - `La transición visual final se integrará en una fase posterior.`
- Se usa una acción explícita `Continuar a Mundo I`.
- La acción apunta a la ruta placeholder existente `/estacion/1`.

No implementado:

- Transición pixelart final.
- Navegación automática a Estación I.
- Estación I real.
- Interiores de portales.
- Desbloqueo de Portales II-V.
- Nuevos assets.
- Edición de assets staged.

Notas para 002H:

- Revisar visualmente `/portada` en mobile 390x844.
- Revisar copy, diálogos, motion, reduced motion y overlay de transición placeholder.
- Decidir si Portada / Intro queda `APROBADA_PARA_AVANZAR` o requiere nuevos ajustes.
- No iniciar Estación I real antes de esa aprobación explícita.

## QA visual 002H

Estado:

`QA_VISUAL_GENERADO / PENDIENTE_APROBACION_USUARIO / NO_CERRADA`

Ruta activa:

`/portada`

Evidencia generada:

- Capturas 390x844 en `docs/visual/cover-intro/qa/002H/`.
- Matriz QA visual en `docs/visual/cover-intro/qa/002H/QA_VISUAL_PORTADA_INTRO_002H.md`.
- Handoff en `docs/status/HANDOFF_002H_PORTADA_INTRO_QA_VISUAL.md`.

Estados revisados:

- `portada_idle`.
- Primer diálogo de Lía.
- Diálogo de aclaración de mediación.
- `portal_1_ready`.
- `portal_1_opening_placeholder`.
- `transition_to_station_1_placeholder`.
- Feedback de portal bloqueado.
- Reduced motion con diálogo activo.

Pendiente de decisión:

- El usuario Ing. José David debe decidir si la pantalla queda `APROBADA_PARA_AVANZAR`.
- Si no alcanza el umbral visual, abrir microticket de ajustes.
- No marcar `CERRADA_APROBADA_FINAL` en esta fase.

No implementado en 002H:

- Interiores de portales.
- Transición pixelart final.
- Estación I real.
- Desbloqueo de Portales II-V.
- Nuevos assets runtime.
- Cambios en `/` o `/carga`.

## Reapertura visual 002I — Diálogo premium y recomposición

Estado:

`AJUSTE_VISUAL_D3_PARCIAL / DIALOGO_PREMIUM_BASE / RECOMPOSICION_PORTALES / NO_CERRADA`

Decisión de revisión:

`AJUSTE_VISUAL_REQUERIDO`

Estrategia global:

`D3 + L2 + P3`

Cobertura de 002I:

- `D3`: diálogo premium tipo anfitriona / ficha museográfica integrada al Archivo Vivo.
- `P3 parcial`: recomposición visual y mayor protagonismo de Portal I.

Implementado:

- Panel de diálogo crema/translúcido con borde lavanda/ámbar sutil.
- Etiqueta `Lía`.
- Indicador de progreso `1/5`, `2/5`, etc.
- Botón de diálogo integrado al panel.
- Portal I más grande y protagonista.
- Portales II-V más legibles, bloqueados y con candados.
- Clases de preparación para coreografía futura:
  - `cover-lia-stage`
  - `cover-lia-layer`
  - `cover-portal-stage`
  - `cover-portal-group`
  - `cover-activation-stage`

Pendiente:

- `L2`: rig facial de Lía, blink y microvida.
- `P3 completo`: coreografía física de activación del Portal I.
- Transición pixelart final.
- Estación I real.

Notas para 002J:

- Usar el rig facial staged sin modificar assets.
- Agregar blink y microvida de Lía de forma sobria.
- Mantener el panel premium y la recomposición de portales.
- No implementar todavía la coreografía física completa del Portal I.

## Corrección 002I-FIX — Diálogo, layout y QA flow

Estado:

`AJUSTE_002I_FIX / DIALOGO_PREMIUM_REVISADO / QA_FLOW_CORREGIDO / NO_CERRADA`

Implementado:

- `/portada?resetIntro=1` limpia `gvo.coverIntro.introCompleted.v1`.
- `/?resetIntro=1` permite revisar el flujo local completo: carga inicial y luego portada fresca.
- `/carga` sigue siendo ruta aislada para QA de carga inicial.
- El panel de diálogo se mueve a una zona media, debajo del rostro de Lía y por encima de portales.
- El panel queda más compacto y menos invasivo.
- Portal I mantiene protagonismo sin quedar oculto por el diálogo.
- Portales II-V siguen visibles, bloqueados y con candados.
- Se generan capturas en `docs/visual/cover-intro/qa/002I-FIX/`.

Rutas de prueba:

- Primera pasada directa: `/portada?resetIntro=1`.
- Flujo local completo: `/?resetIntro=1`.
- Carga aislada: `/carga`.

Pendiente:

- `L2`: rig facial, blink y microvida.
- `P3 completo`: coreografía física de activación del Portal I.
- Transición pixelart final.
- Estación I real.

No se modificó:

- Assets PNG staged.
- Textos narrativos.
- Carga inicial visual.
- Portales bloqueados.

## Corrección 002I-FIX2 — Diálogo integrado con Lía y activación Portal I

Estado:

`AJUSTE_002I_FIX2 / DIALOGO_LIA_INTEGRADO / ACTIVACION_PORTAL_I_REVISADA / NO_CERRADA`

Implementado:

- El indicador compacto `1/5` se reemplaza por `Paso 1 de 5`, `Paso 2 de 5`, etc.
- El cuerpo de diálogo usa tipografía cómoda de lectura: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.
- El botón del diálogo, mensajes de bloqueo y textos largos del placeholder de transición comparten la misma fuente de lectura.
- El panel de diálogo conserva la estética editorial cálida, pero agrega conector/acento visual hacia Lía para sentirse menos separado.
- En activación/opening, Lía se renderiza dentro de una capa anclada al Portal I, no como pose genérica en el lateral.
- La activación usa glow posterior, Lía activate, velo CSS sutil y frame frontal duplicado para simular que Lía se acerca al portal.
- Portal I responde con glow y mantiene el placeholder `Abriendo Mundo I: Raíz...` antes del overlay `Preparando recorrido...`.
- Se generan capturas en `docs/visual/cover-intro/qa/002I-FIX2/`.

Rutas de prueba:

- Primera pasada directa: `/portada?resetIntro=1`.
- Flujo local completo: `/?resetIntro=1`.
- Carga aislada: `/carga`.
- Handoff placeholder: `Continuar a Mundo I` sigue apuntando a `/estacion/1`.

Pendiente:

- `L2`: rig facial, blink, ojos neutral/happy/attentive y microvida.
- Coreografía física completa del Portal I si la activación visual todavía requiere otra iteración.
- Transición pixelart final.
- Estación I real.

No se modificó:

- Assets PNG staged.
- Textos narrativos base.
- Carga inicial visual.
- Desbloqueo de Portales II-V.

## Lía hybrid rig facial 002J

Estado:

`LIA_HYBRID_RIG_IDLE_IMPLEMENTADO / DIALOGO_LIA_INTEGRADO / NO_CERRADA`

Implementado:

- Se crea `LiaHybridAvatar` para centralizar la representación de Lía en la portada.
- En `portada_idle`, Lía usa un rig por capas desde `public/assets/runtime/cover-intro/lia/rig/idle_v1/`.
- El rig idle incluye cuerpo, pétalos, collar, glow, cabeza limpia y ojos como capas locales staged.
- El parpadeo se aplica solo en `rig-idle` con secuencia controlada `neutral -> blink_25 -> blink_50 -> closed -> blink_50 -> blink_25 -> neutral`.
- El collar usa glow sutil solo en `rig-idle`.
- Las capas internas del rig son `aria-hidden`, con una sola descripción accesible global de Lía.

Regla de seguridad visual:

- Las poses completas staged se conservan para estados narrativos: `greeting`, `explainCalm`, `pointPortal1` y `activatePortal1`.
- No se superponen ojos del rig sobre poses completas.
- No se generan doble ojo, manchas visuales ni overlays inseguros sobre los PNG narrativos.

Reduced motion:

- Desactiva parpadeo automático.
- Desactiva pulso del collar.
- Mantiene a Lía visible y conserva diálogos/gating.

Capturas QA:

- `docs/visual/cover-intro/qa/002J/cover-intro-002j-01-idle-rig-390x844.png`
- `docs/visual/cover-intro/qa/002J/cover-intro-002j-02-dialogue-greeting-390x844.png`

Pendiente:

- Revisión visual del usuario sobre el rig idle.
- Coreografía física avanzada del Portal I.
- Transición pixelart final.
- Estación I real.

No se modificó:

- PNG staged.
- Textos narrativos.
- Carga inicial visual.
- Portales II-V bloqueados.
- Rutas `/`, `/carga`, `/portada` ni `/estacion/1`.

## Corrección 002J-FIX — Microvida de Lía y diálogo sin conector ordinario

Estado:

`AJUSTE_002J_FIX / LIA_MICROVIDA_REFORZADA / DIALOGO_ANCHOR_REVISADO / NO_CERRADA`

Problemas corregidos:

- La microvida de Lía casi no se percibía porque el rig solo aparecía en `portada_idle`.
- El conector del panel de diálogo se veía como línea/flecha ordinaria y bajaba la calidad del conjunto.

Implementado:

- `rig-idle` se usa también en diálogos visualmente seguros.
- Diálogo 1 usa expresión `happy`.
- Diálogos 2-4 usan expresión `attentive`.
- Diálogo 5 vuelve a pose completa `pointPortal1`.
- Portal ready conserva pose completa `pointPortal1`.
- Opening y transition placeholder conservan pose completa `activatePortal1`.
- El blink vuelve a la expresión base activa (`happy` o `attentive`) en lugar de volver siempre a neutral.
- El blink usa un ciclo más corto y perceptible, sin volverse caricaturesco.
- El glow del collar queda más presente, pero sin flash.
- Reduced motion conserva expresión fija y desactiva blink/glow pulsante.

Diálogo:

- Se elimina el conector lineal externo.
- Se elimina el triángulo/flecha tipo tooltip.
- El panel queda asociado a Lía por cercanía, badge `Lía`, acento superior y nodo ámbar-lavanda integrado en la esquina.
- Se conserva `Paso X de 5`.
- No vuelve a aparecer `1/5`.

Capturas QA:

- `docs/visual/cover-intro/qa/002J-FIX/cover-intro-002j-fix-01-idle-rig-390x844.png`
- `docs/visual/cover-intro/qa/002J-FIX/cover-intro-002j-fix-02-dialogue-happy-390x844.png`
- `docs/visual/cover-intro/qa/002J-FIX/cover-intro-002j-fix-03-dialogue-attentive-390x844.png`
- `docs/visual/cover-intro/qa/002J-FIX/cover-intro-002j-fix-04-portal-ready-390x844.png`
- `docs/visual/cover-intro/qa/002J-FIX/cover-intro-002j-fix-05-opening-activation-390x844.png`

Pendiente:

- Revisión visual del usuario.
- Coreografía física avanzada del Portal I.
- Transición pixelart final.
- Estación I real.

No se modificó:

- PNG staged.
- Textos narrativos base.
- Carga inicial V13.
- Rutas `/`, `/carga`, `/portada` ni `/estacion/1`.
- Desbloqueo de Portales II-V.

## Coreografía de activación 002K

Estado:

`COREOGRAFIA_PORTAL_I_BASE / LIA_MICROVIDA_OK / NO_CERRADA`

Implementado:

- La activación del Portal I usa una composición tipo sandwich visual por capas.
- Lía `activatePortal1` se renderiza dentro de la estructura anclada al Portal I, no como pose lateral independiente.
- El Portal I duplica su frame: una capa back detrás de Lía y una capa front/rim por encima para dar sensación de profundidad.
- Se agrega una luz de contacto CSS, sin asset nuevo, para marcar el momento en que Lía activa el portal.
- El glow del Portal I sube de forma breve y controlada durante la activación.
- El overlay `Preparando recorrido...` aparece después de una pausa de 920ms para que el contacto se lea antes del handoff placeholder.

No implementado:

- Transición pixelart final.
- Estación I real.
- Interiores de portales.
- Desbloqueo de Portales II-V.
- Nuevos assets runtime.
- Edición de PNG staged.

Notas para 002L:

- Revisar visualmente la captura `docs/visual/cover-intro/qa/002K/cover-intro-002k-02-activation-opening-390x844.png`.
- Confirmar si D3 + L2 + P3 ya alcanza `APROBADA_PARA_AVANZAR`.
- Documentar deuda visual antes de abrir transición real o preproducción de Mundo I.

## QA final 002L — Reaprobación visual

Estado:

`QA_FINAL_002L_GENERADO / CANDIDATA_APROBADA_PARA_AVANZAR / PENDIENTE_CONFIRMACION_FINAL_USUARIO`

Evidencia:

- Capturas finales 390x844 en `docs/visual/cover-intro/qa/002L/`.
- Matriz final en `docs/visual/cover-intro/qa/002L/QA_VISUAL_PORTADA_INTRO_002L.md`.
- Handoff en `docs/status/HANDOFF_002L_PORTADA_INTRO_QA_REAPROBACION.md`.
- Borrador de decisión en `docs/status/DECISION_VISUAL_002L_PORTADA_INTRO.md`.

Revisado:

- Flujo `/?resetIntro=1`: carga inicial y llegada a portada fresca.
- Ruta `/portada?resetIntro=1`.
- Diálogo 1 con Lía `happy`.
- Diálogo 2 con aclaración de mediación.
- Microvida de Lía en rig seguro.
- Portal I listo.
- Activación coreografiada del Portal I.
- Transition placeholder.
- Feedback de portal bloqueado.
- Reduced motion.
- `/estacion/1` como placeholder.

Decisión:

- Decisión técnica de Codex: `CANDIDATA_APROBADA_PARA_AVANZAR`.
- Decisión visual final: pendiente del usuario Ing. José David.

No implementado:

- Transición pixelart final.
- Estación I real.
- Desbloqueo de Portales II-V.
- Assets nuevos.
