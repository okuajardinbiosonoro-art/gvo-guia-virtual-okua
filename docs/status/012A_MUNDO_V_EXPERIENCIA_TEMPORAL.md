# 012A - Mundo V experiencia temporal

Fecha: 2026-06-14

## 1. Propósito

Convertir `/estacion/5` de entrada base preliminar a experiencia funcional temporal completa de Mundo V / Estación V: `Mapa del Presente`.

La experiencia sintetiza OKÚA como montaje vivo mediante cuatro áreas conceptuales protegidas:

```text
PLANTAS -> SISTEMA -> ESPACIO -> VISITANTE
```

## 2. Alcance

Incluido:

- Experiencia interactiva temporal completa de Mundo V.
- Progresión funcional `intro -> plantas -> sistema -> espacio -> visitante -> ready_to_continue`.
- Bloqueo suave de áreas futuras.
- Relectura de áreas completadas.
- 24 slots editoriales `W5_*` registrados como `TEMP`.
- Botón final `Continuar` visible y preparado, sin navegación real.
- Validación local en navegador del flujo W1->W5.

Excluido:

- Pantalla final real.
- Transición funcional W5->Final.
- Revisión libre.
- Importación de Excel editorial.
- Selector visible ES/EN.
- Contador diario.
- QR/cámara real.
- Permisos sensibles.
- Assets nuevos o cambios en assets runtime.
- Baseline completo, pre-commit, gitleaks, `npm audit`, `npm run build`, `npm run check` y `npm run format`.

## 3. Estado Git inicial

```text
## main...origin/main
```

Último commit sincronizado al iniciar:

```text
d16fe0b feat: prepare W4 W5 transition and Mundo V entry 011B
```

## 4. Arquitectura previa

Antes de 012A, `/estacion/5` cargaba `World5RootScreen` como entrada preliminar con tres slots temporales y cuatro áreas declarativas. No existía progresión interna, bloqueo suave, relectura ni estado `ready_to_continue`.

## 5. Arquitectura nueva de Mundo V

`World5RootScreen` ahora resuelve una experiencia temporal completa:

```text
intro
-> plantas
-> sistema
-> espacio
-> visitante
-> ready_to_continue
```

Atributos runtime principales:

- `data-world5-experience="temporary"`;
- `data-world5-editorial-source="excel_pending"`;
- `data-world5-state="<intro|plantas|sistema|espacio|visitante|ready_to_continue>"`;
- `data-world5-slot-count="24"`;
- `data-world5-full-experience="temporary_complete"`;
- `data-sensitive-permissions="blocked"`;
- `data-qr-camera="blocked"`;
- `data-daily-counter="not_implemented"`;
- `data-final-screen="not_implemented"`;
- `data-review-free-mode="not_implemented"`.

La salida final queda preparada con:

- `data-world5-exit-target="/transition/world-5-to-final"`;
- `data-world5-exit-mode="prepared_no_navigation"`;
- `data-world5-exit-action="prepared_for_012b"`.

No se agregó la ruta `/transition/world-5-to-final` en este ticket para no consumir el alcance de 012B ni inventar slots de transición final fuera de la matriz 012A.

## 6. Estados y áreas implementadas

| Estado | Área visible | Función | Salida |
|---|---|---|---|
| `intro` | Ninguna activa | Presenta Mundo V y permite iniciar el mapa. | `Iniciar mapa temporal` |
| `plantas` | `PLANTAS` | Abre la presencia viva del recorrido. | `W5_PLANTAS_CONFIRM_01` |
| `sistema` | `SISTEMA` | Resume el sistema como mediación general. | `W5_SISTEMA_CONFIRM_01` |
| `espacio` | `ESPACIO` | Presenta el lugar físico y sensible. | `W5_ESPACIO_CONFIRM_01` |
| `visitante` | `VISITANTE` | Cierra con la presencia activa del visitante. | `W5_VISITANTE_CONFIRM_01` |
| `ready_to_continue` | Todas completadas | Muestra cierre temporal y botón final preparado. | `W5_FINAL_BTN_01` |

Áreas protegidas exactas:

```text
PLANTAS
SISTEMA
ESPACIO
VISITANTE
```

## 7. Matriz obligatoria - Slots Mundo V

| Slot ID | Función temporal | Estado/área | Texto temporal | Reemplazable por Excel | Riesgo conceptual |
|---|---|---|---|---|---|
| `W5_INTRO_LIA_01` | Introducción de Lía | `intro` | `TEMP — Este mapa reúne lo que ya viste: plantas, sistema, espacio y visitante.` | Sí | Bajo: síntesis, sin cierre final. |
| `W5_INTRO_AMB_01` | Contexto ambiental | `intro` | `TEMP — OKÚA aparece como un montaje vivo, no como una sola pieza aislada.` | Sí | Bajo. |
| `W5_ACCESSIBLE_SCENE_01` | Descripción accesible | `intro` | `TEMP — Entrada visual a Mundo V, presentada como un mapa del presente con cuatro áreas: plantas, sistema, espacio y visitante.` | Sí | Bajo. |
| `W5_PLANTAS_HINT_01` | Pista de área | `plantas` | `TEMP — Comienza por las plantas como presencia viva del recorrido.` | Sí | Bajo. |
| `W5_PLANTAS_AMB_01` | Ambiente de área | `plantas` | `TEMP — Las plantas no aparecen como símbolo aislado: sostienen el origen de la experiencia.` | Sí | Bajo: no dice canto literal. |
| `W5_PLANTAS_CONFIRM_01` | Confirmación de área | `plantas` | `TEMP — Área PLANTAS registrada.` | Sí | Bajo. |
| `W5_ACCESSIBLE_PLANTAS_01` | Accesibilidad de área | `plantas` | `TEMP — Área del mapa dedicada a las plantas y su presencia viva en OKÚA.` | Sí | Bajo. |
| `W5_SISTEMA_HINT_01` | Pista de área | `sistema` | `TEMP — Revisa el sistema como mediación, sin repetir toda la cadena técnica.` | Sí | Medio-bajo: protege contra repetir Mundo IV. |
| `W5_SISTEMA_AMB_01` | Ambiente de área | `sistema` | `TEMP — El sistema organiza señales y decisiones, pero aquí aparece como parte del montaje completo.` | Sí | Bajo: síntesis general. |
| `W5_SISTEMA_CONFIRM_01` | Confirmación de área | `sistema` | `TEMP — Área SISTEMA registrada.` | Sí | Bajo. |
| `W5_ACCESSIBLE_SISTEMA_01` | Accesibilidad de área | `sistema` | `TEMP — Área del mapa dedicada al sistema como mediador técnico general.` | Sí | Bajo. |
| `W5_ESPACIO_HINT_01` | Pista de área | `espacio` | `TEMP — Observa el espacio donde la experiencia ocurre.` | Sí | Bajo. |
| `W5_ESPACIO_AMB_01` | Ambiente de área | `espacio` | `TEMP — El jardín, el recorrido y la disposición física también forman parte del presente de OKÚA.` | Sí | Bajo. |
| `W5_ESPACIO_CONFIRM_01` | Confirmación de área | `espacio` | `TEMP — Área ESPACIO registrada.` | Sí | Bajo. |
| `W5_ACCESSIBLE_ESPACIO_01` | Accesibilidad de área | `espacio` | `TEMP — Área del mapa dedicada al espacio físico y sensible de la experiencia.` | Sí | Bajo. |
| `W5_VISITANTE_HINT_01` | Pista de área | `visitante` | `TEMP — Cierra el mapa con la presencia del visitante.` | Sí | Bajo. |
| `W5_VISITANTE_AMB_01` | Ambiente de área | `visitante` | `TEMP — La experiencia termina de tomar forma cuando alguien la recorre, mira y escucha.` | Sí | Bajo. |
| `W5_VISITANTE_CONFIRM_01` | Confirmación de área | `visitante` | `TEMP — Área VISITANTE registrada.` | Sí | Bajo. |
| `W5_ACCESSIBLE_VISITANTE_01` | Accesibilidad de área | `visitante` | `TEMP — Área del mapa dedicada al visitante como parte activa del recorrido.` | Sí | Bajo. |
| `W5_AREA_LOCKED_01` | Bloqueo suave | Áreas futuras | `TEMP — Antes de abrir esta área, revisa el paso anterior.` | Sí | Bajo. |
| `W5_AREA_REPEAT_01` | Relectura | Áreas completadas | `TEMP — Puedes volver a mirar esta área antes de continuar.` | Sí | Bajo. |
| `W5_COMPLETE_LIA_01` | Cierre de Lía | `ready_to_continue` | `TEMP — El mapa ya muestra cómo OKÚA reúne plantas, sistema, espacio y visitante.` | Sí | Bajo: no presenta final real. |
| `W5_COMPLETE_AMB_01` | Cierre ambiente | `ready_to_continue` | `TEMP — El presente queda armado como una experiencia compartida.` | Sí | Bajo. |
| `W5_FINAL_BTN_01` | Botón final preparado | `ready_to_continue` | `Continuar` | Sí | Medio: salida preparada, no navegación real. |

## 8. Textos temporales agregados

Se agregaron 21 textos nuevos sobre los 3 slots base existentes de 011B. Todos los textos nuevos:

- usan `source: "temporary"`;
- usan `status: "TEMP"`;
- quedan bajo `locale: "es"`;
- preservan fallback futuro de la arquitectura ES/EN;
- están asociados a slot editorial real `W5_*`;
- quedan listos para sustitución futura desde Excel editorial.

## 9. Confirmación editorial

Los textos no son finales. El Excel editorial sigue siendo la fuente final posterior.

No se implementó selector visible ES/EN, no se agregó traducción final en inglés y no se importó Excel.

## 10. Confirmaciones funcionales negativas

| Confirmación | Estado |
|---|---|
| No se implementó contador diario. | Confirmado |
| No se construyó pantalla final. | Confirmado |
| No se habilitó revisión libre. | Confirmado |
| No se activó QR real. | Confirmado |
| No se activó cámara. | Confirmado |
| No se solicitaron permisos sensibles. | Confirmado |
| No se crearon assets nuevos. | Confirmado |
| No se modificaron assets runtime. | Confirmado |
| No se instaló ninguna dependencia. | Confirmado |
| No se modificó `package.json` ni lockfiles. | Confirmado |
| No se ejecutó baseline completo, pre-commit, gitleaks ni `npm audit`. | Confirmado |

## 11. Protección conceptual

Mundo V no repite la secuencia técnica completa de Mundo IV. La validación en navegador confirmó ausencia de:

```text
BIONOSIFICADOR
ESP32
MIDI
WI-FI/UDP
ROUTER
SISTEMA CENTRAL
SONIDO
```

`SISTEMA` se mantiene como síntesis conceptual, no como lista técnica completa.

La validación también confirmó ausencia de promesas o afirmaciones prohibidas como canto literal, música directa, magia literal o uso/requisito de Internet.

## 12. Matriz obligatoria - Cambios

| Área | Archivo | Cambio aplicado | Motivo | Riesgo | Validación |
|---|---|---|---|---|---|
| World5RootScreen | `src/screens/World5Root/World5RootScreen.tsx` | Convierte entrada base en experiencia temporal interactiva. | Cumplir 012A. | Medio: nueva secuencia viva. | `npm run test -- World5RootScreen`, browser. |
| Estados/áreas Mundo V | `src/content/world5EditorialSlots.ts` | Agrega definiciones `plantas`, `sistema`, `espacio`, `visitante`. | Centralizar contrato editorial. | Bajo. | Tests unitarios. |
| Contenido temporal | `src/content/editorial/editorialRegistry.ts` | Registra 24 slots W5 en `TEMP`. | Cubrir matriz editorial. | Bajo. | `npm run test -- editorial`. |
| Áreas conceptuales protegidas | `src/content/world5EditorialSlots.ts` | Mantiene `PLANTAS`, `SISTEMA`, `ESPACIO`, `VISITANTE`. | Evitar deriva conceptual. | Bajo. | Test y browser. |
| Evitar repetición técnica Mundo IV | `src/screens/World5Root/World5RootScreen.tsx` | No renderiza la cadena técnica de Mundo IV. | Proteger alcance conceptual. | Bajo. | Browser verifica términos ausentes. |
| Bloqueos suaves | `src/screens/World5Root/World5RootScreen.tsx` | Áreas futuras quedan `locked`. | Secuencia controlada. | Bajo. | Test + browser. |
| Relectura/repetición | `src/screens/World5Root/World5RootScreen.tsx` | Áreas completadas pueden releerse sin romper estado. | Ergonomía de revisión. | Bajo. | Test + browser. |
| Ready to continue | `src/screens/World5Root/World5RootScreen.tsx` | Estado `ready_to_continue` tras `VISITANTE`. | Cierre temporal. | Bajo. | Test + browser. |
| Salida Mundo V | `src/screens/World5Root/World5RootScreen.tsx` | Botón `Continuar` queda preparado para 012B, sin navegación. | No construir final. | Medio. | Test + browser. |
| QR/cámara | `src/screens/World5Root/World5RootScreen.tsx` | Mantiene `data-qr-camera="blocked"`. | Evitar permisos. | Bajo. | Browser sin prompts. |
| Assets runtime | Sin cambios | No se tocaron assets. | Respetar ticket. | Bajo. | `npm run audit:assets`. |
| Gates parciales | Tests/lint | Se ejecutan gates autorizados. | Evidencia de estabilidad. | Bajo. | Ver sección 14. |

## 13. Matriz obligatoria - Validación de rutas

| Ruta | Resultado esperado | Resultado observado | Consola | Permisos sensibles | Estado |
|---|---|---|---|---|---|
| `/` | Carga inicial. | Renderiza `Preparando el recorrido`. | Sin errores de app; favicon 404 residual. | Sin prompts. | PASS |
| `/portada` | Portada viva. | Renderiza portada OKÚA. | Sin errores de app. | Sin prompts. | PASS |
| `/transition/intro-to-station-1` | Transición a Mundo I. | Renderiza `Abriendo Mundo I: Raíz`. | Sin errores de app. | Sin prompts. | PASS |
| `/estacion/1` | Mundo I. | Renderiza Mundo I y funciona en flujo. | Sin errores de app. | Sin prompts. | PASS |
| `/transition/world-1-to-world-2` | Transición W1->W2. | Renderiza `Abriendo Mundo II`. | Sin errores de app. | Sin prompts. | PASS |
| `/estacion/2` | Mundo II. | Renderiza Mundo II y funciona en flujo. | Sin errores de app. | Sin prompts. | PASS |
| `/transition/world-2-to-world-3` | Transición W2->W3. | Renderiza `TEMP — Abriendo Mundo III`. | Sin errores de app. | Sin prompts. | PASS |
| `/estacion/3` | Mundo III. | Renderiza Mundo III y funciona en flujo. | Sin errores de app. | Sin prompts. | PASS |
| `/transition/world-3-to-world-4` | Transición W3->W4. | Renderiza `TEMP — Abriendo Mundo IV`. | Sin errores de app. | Sin prompts. | PASS |
| `/estacion/4` | Mundo IV. | Renderiza Mundo IV y funciona en flujo. | Sin errores de app. | Sin prompts. | PASS |
| `/transition/world-4-to-world-5` | Transición W4->W5. | Renderiza `TEMP — Abriendo Mundo V`. | Sin errores de app. | Sin prompts. | PASS |
| `/estacion/5` | Mundo V temporal completo. | Llega a `ready_to_continue` con 24 slots y 4 áreas. | Sin errores de app. | Sin prompts. | PASS |
| `/qr/1` | Placeholder QR sin cámara. | Renderiza placeholder. | Sin errores de app. | Sin prompts. | PASS |

Nota de consola: Chrome reporta `favicon.ico` 404 residual. No es error de aplicación 012A y no se corrige por estar fuera del alcance permitido.

## 14. Flujo manual validado

Validado en Chrome local contra:

```text
http://127.0.0.1:5173
```

Flujo:

```text
/estacion/1
-> completar Mundo I
-> /transition/world-1-to-world-2
-> /estacion/2
-> completar Mundo II
-> /transition/world-2-to-world-3
-> /estacion/3
-> completar Mundo III
-> /transition/world-3-to-world-4
-> /estacion/4
-> completar Mundo IV
-> /transition/world-4-to-world-5
-> /estacion/5
-> completar Mundo V
-> ready_to_continue
```

Resultado final:

```text
/estacion/5
data-world5-state="ready_to_continue"
```

Mundo V validado:

- `data-world5-experience="temporary"`;
- `data-world5-slot-count="24"`;
- `data-world5-full-experience="temporary_complete"`;
- áreas exactas `PLANTAS`, `SISTEMA`, `ESPACIO`, `VISITANTE`;
- `SISTEMA` bloqueado antes de completar `PLANTAS`;
- relectura de `PLANTAS` visible sin romper estado;
- botón `Continuar` visible;
- botón final no navega y registra continuidad pendiente para transición posterior.

## 15. Resultado visual mobile

Viewport validado:

```text
390x844
```

Resultado:

- sin overflow horizontal;
- `documentElement.scrollWidth = 390`;
- `window.innerWidth = 390`;
- captura temporal fuera del repo: `%TEMP%\gvo-012a-w5-mobile.png`.

## 16. Resultado visual desktop

Viewport validado:

```text
1365x768
```

Resultado:

- sin overflow horizontal;
- `documentElement.scrollWidth = 1365`;
- `window.innerWidth = 1365`;
- captura temporal fuera del repo: `%TEMP%\gvo-012a-w5-desktop.png`.

## 17. Resultado de consola y permisos

| Criterio | Resultado |
|---|---|
| Errores de aplicación | Ninguno. |
| Advertencias ignoradas | `favicon.ico` 404 residual. |
| Requests externos | Ninguno. |
| Prompts de permisos | Ninguno. |
| QR/cámara | Bloqueado, sin activación. |
| Audio/video/canvas/iframe en Mundo V | `0`. |

## 18. Gates parciales ejecutados

| Comando o validación | Resultado | Estado |
|---|---|---|
| `git status --short --branch` | `## main...origin/main` al inicio. | PASS |
| `git log --oneline -n 5` | HEAD `d16fe0b feat: prepare W4 W5 transition and Mundo V entry 011B`. | PASS |
| `git diff --check` | Sin errores; advertencias LF/CRLF normales en Windows. | PASS con advertencia |
| `npm run test -- editorial` | 1 archivo, 6 tests pasados. | PASS |
| `npm run test -- TransitionWorld` | 1 archivo, 14 tests pasados. | PASS |
| `npm run test -- World5RootScreen` | 1 archivo, 4 tests pasados. | PASS |
| `npm run lint` | ESLint sin errores. | PASS |
| `npm run test` | 13 archivos, 89 tests pasados. | PASS |
| `npm run status` | Lectura local ejecutada. | PASS |
| `npm run audit:assets` | Sin URLs externas, CDN ni uso de audio. | PASS |
| `npm run dev -- --host 127.0.0.1 --port 5173` | Servidor local iniciado. | PASS |
| Browser local Chrome | Rutas smoke y flujo W1->W5 validados. | PASS |
| Detener servidor local | `PORT_5173_NO_LISTENER`. | PASS |

## 19. Gates no ejecutados

| Gate / script | Motivo |
|---|---|
| `npm run build` | Prohibido por ticket. |
| `npm run check` | Prohibido por ticket. |
| `npm run format` | Prohibido por ticket. |
| `npm audit` | Prohibido por ticket. |
| `npm install`, `npm update`, `npx` | Prohibidos por ticket. |
| Baseline completo | Prohibido por ticket. |
| `pre-commit`, `gitleaks`, `scripts/run_security_checks.ps1` | Prohibidos por ticket. |
| Graphify, SkillCheck, Claude Code, Spec-kit, Gstack, Claude Council, MCP | Prohibidos por ticket. |

## 20. Matriz obligatoria - Continuidad

| Opción | Descripción | Ventaja | Riesgo | Recomendación | Ticket siguiente |
|---|---|---|---|---|---|
| `012A-PUSH` | Sincronizar experiencia temporal Mundo V. | Publica el trabajo aprobado. | Bajo si el working tree queda limpio. | Recomendada inmediatamente tras aprobación y commit. | `012A-PUSH` |
| `012B` | Diseñar transición W5->Final y entrada Pantalla Final. | Resuelve la salida preparada sin construirla en 012A. | Medio: puede abrir alcance de final. | Recomendable después de push. | `012B` |
| `012C` | Diseñar pantalla final temporal / Mirador. | Permite cerrar el recorrido completo. | Alto si se mezcla con transición. | Solo después de definir 012B o alcance separado. | `012C` |
| `011C` | Preparar importación futura del Excel editorial. | Ordena fuente final de textos. | Medio: no debe reemplazar runtime sin control. | Alternativa válida antes de final. | `011C` |
| `011D` | Prototipo controlado de contador diario sin QR real. | Avanza arquitectura de uso diario. | Alto si se mezcla tracking o datos. | Posponer hasta cerrar continuidad visual. | `011D` |
| `008I` | Preparar entorno externo de seguridad. | Refuerza gates fuera de GVO. | Bajo-medio: no debe integrarse en runtime. | Opcional si se prioriza seguridad. | `008I` |

## 21. Riesgos residuales

- Mundo V es experiencia temporal, no versión editorial final.
- Los textos `TEMP` deben sustituirse desde Excel editorial futuro.
- La salida hacia `/transition/world-5-to-final` queda preparada, pero no implementada.
- El favicon 404 residual permanece fuera de alcance.
- Las capturas de validación quedan fuera del repo, en `%TEMP%`.

## 22. Siguiente paso recomendado

```text
012A-PUSH — Sincronizar experiencia temporal Mundo V
```

Luego decidir entre:

```text
012B — Diseñar transición W5→Final y entrada Pantalla Final
```

o:

```text
011C — Preparar importación futura del Excel editorial
```
