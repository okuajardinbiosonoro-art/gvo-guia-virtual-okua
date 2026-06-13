# Cierre TANDA 007 y retorno a desarrollo GVO

Fecha: 2026-06-13

## 1. Proposito del cierre

Cerrar formalmente TANDA 007 y dejar una base operativa para volver al desarrollo funcional de GVO sin perder las reglas de gobernanza, seguridad, archivo historico y control de herramientas externas que quedaron estabilizadas.

Este documento no autoriza cambios runtime. Su funcion es consolidar decisiones, riesgos residuales y ruta recomendada de retorno al desarrollo.

## 2. Alcance

Este cierre cubre:

- baseline y auditorias iniciales;
- reconciliacion documental;
- poda y archivo historico visual;
- politicas de seguridad, agentes y herramientas externas;
- evaluaciones controladas de SkillCheck y Graphify;
- mapa OSW de herramientas;
- criterios para retomar desarrollo funcional despues de TANDA 007.

No cubre implementacion de nuevas pantallas, cambios en `src/**`, cambios de assets runtime, instalacion de herramientas, ejecucion de herramientas externas, cambios de dependencias ni automatizaciones remotas.

## 3. Estado Git inicial

Estado al iniciar 007S:

```text
## main...origin/main
```

Ultimos commits relevantes:

```text
d2d9e18 docs: add OSW tools decision map 007R
f787bac docs: record Graphify evaluation 007Q
38a23bf docs: evaluate SkillCheck adoption 007O
f5e6184 docs: recover security gate documents 007N
cbc0d8b merge: integrate OKUA frontend security baseline
e669a28 chore: add OKUA frontend security baseline
60931e2 docs: add external tools and agents policy 007M
d5c891c docs: evaluate visual archive progress 007K
7f5be76 docs: archive transition world visual evidence 007J
0f1d4aa docs: evaluate visual archive pilot 007I
```

Commit 007R ya sincronizado:

```text
d2d9e18 docs: add OSW tools decision map 007R
```

## 4. Resumen ejecutivo de TANDA 007

TANDA 007 cambio el estado operativo de GVO de un repo con deuda documental, evidencia pesada y herramientas por definir a un repo con:

- documentacion viva reconciliada;
- politicas explicitas de herramientas externas, comandos, permisos y secretos;
- flujo `PR_NO_APLICA` confirmado;
- `okua-delivery-md` reconocido como herramienta externa, no runtime;
- archivo historico visual aplicado a dos lotes verificados;
- mapa OSW de herramientas aprobadas, pendientes, bloqueadas y en observacion;
- criterio claro para no integrar agentes, MCP, hooks o herramientas externas sin ticket especifico;
- working tree limpio y `main` alineada con `origin/main` al cierre de 007R-PUSH.

La decision global es volver a desarrollo funcional con una revision de estado antes de tocar runtime.

## 5. Tabla cronologica de tickets 007

| Ticket | Resultado | Commit / estado | Tipo | Decision | Siguiente efecto |
|---|---|---|---|---|---|
| 007A-0 | Reconocio `okua-delivery-md` como normalizador externo de entregas. | Sin cambio GVO. | Metodologico | Aprobado | Salidas de Codex deben poder normalizarse sin acoplar herramienta a GVO. |
| 007A | Baseline y auditoria inicial de GVO. | Sin cambio GVO. | Auditoria solo lectura | Aprobado | Base para gobernanza y limpieza. |
| 007B | Auditoria de gobernanza documental sin cambios. | Entrega corregida externa. | Auditoria documental | Aprobado | Identifico necesidad de reconciliar documentos vivos. |
| 007C | Reconciliacion documental de estado vivo. | `0e419c7 docs: reconcile live project documentation 007C` | Documental | Aprobado | Documentacion viva alineada con estado real del proyecto. |
| 007D | Plan de poda de artefactos y evidencia historica sin eliminar archivos. | Sin cambio GVO. | Planificacion | Aprobado | Base para matriz accionable. |
| 007E | Matriz accionable de poda sin eliminar archivos. | Entrega corregida externa. | Planificacion | Aprobado | Priorizo temporales, archivo visual y bloques no tocables. |
| 007F | Limpieza segura de temporales no versionados. | Sin commit requerido en GVO. | Limpieza local | Aprobado | Repo operativo mas limpio sin tocar versionados. |
| 007G | Politica de archivo historico visual. | `2ed5a90 docs: add visual evidence archive policy 007G` | Politica documental | Aprobado | Definio reglas para retirar evidencia pesada con trazabilidad. |
| 007H | Archivo historico visual lote `loading-initial`. | `2990218 docs: archive loading initial visual evidence 007H` | Archivo historico | Aprobado | 127 archivos y 19,627,499 bytes archivados fuera de GVO. |
| 007I | Evaluacion del lote piloto. | `0f1d4aa docs: evaluate visual archive pilot 007I` | Evaluacion | Aprobado | Selecciono `transition-world` como siguiente lote. |
| 007J | Archivo historico visual lote `transition-world`. | `7f5be76 docs: archive transition world visual evidence 007J` | Archivo historico | Aprobado | 101 archivos y 62,624,460 bytes archivados fuera de GVO. |
| 007K | Evaluacion de archivo visual y siguiente bloque. | `d5c891c docs: evaluate visual archive progress 007K` | Evaluacion | Aprobado | Recomendo pausar archivo visual y pasar a seguridad/agentes. |
| 007L | Auditoria de seguridad y agentes sin cambios. | Entrega corregida externa. | Auditoria solo lectura | Aprobado | Identifico superficie de herramientas, permisos, red y agentes. |
| 007M | Politica de herramientas externas y agentes. | `60931e2 docs: add external tools and agents policy 007M` | Politica seguridad | Aprobado | Definio reglas para Codex, Claude Code, Obsidian, Graphify, SkillCheck, Spec-kit, Gstack, Claude Council y MCP. |
| 007N | Security gate de comandos, scripts y permisos sensibles. | `f5e6184 docs: recover security gate documents 007N` en estado final recuperado. | Seguridad | Aprobado | Recupero documentos de security gate, secretos y permisos sensibles. |
| 007O | Evaluacion controlada de SkillCheck. | `38a23bf docs: evaluate SkillCheck adoption 007O` | Evaluacion documental | Aprobado | SkillCheck quedo pendiente/en observacion. |
| 007P | Sandbox externo SkillCheck. | Sin cambio GVO. | Sandbox externo | Aprobado | No se adopto SkillCheck; requiere candidato exacto. |
| 007Q | Evaluacion y sandbox externo Graphify. | `f787bac docs: record Graphify evaluation 007Q` | Evaluacion documental/sandbox externo | Aprobado | Graphify quedo en observacion; no usar sobre GVO ni con API keys reales. |
| 007R | Mapa OSW de herramientas aprobadas, pendientes y bloqueadas. | `d2d9e18 docs: add OSW tools decision map 007R` | Mapa de decision | Aprobado y sincronizado | Consolido el tablero de tooling para decisiones futuras. |

## 6. Decisiones aprobadas

1. `okua-delivery-md` queda aprobado como herramienta externa de documentacion, no runtime.
2. Codex queda aprobado bajo tickets, security gate y PRE-CIERRE cuando aplique.
3. `PR_NO_APLICA` queda confirmado como regla operativa de GVO.
4. El archivo historico visual por lotes es valido si copia, verifica, retira origen y conserva manifiestos livianos.
5. Graphify puede observarse solo en sandbox externo; no queda aprobado para GVO vivo.
6. SkillCheck queda en observacion; no se avanza sin candidato exacto.
7. Claude Code queda pendiente y bloqueado dentro de GVO.
8. MCP/conectores quedan bloqueados hasta politica especifica.
9. GitHub Actions queda pendiente de auditoria.
10. Baseline de seguridad/pre-commit requiere auditoria posterior si se amplia.
11. No se aprueban herramientas por reputacion; solo por evidencia.
12. No se toca runtime en tickets de governance.

## 7. Herramientas aprobadas

| Herramienta | Estado final TANDA 007 | Uso permitido | Uso prohibido | Siguiente accion |
|---|---|---|---|---|
| `okua-delivery-md` | Aprobada externa / no runtime | Normalizar entregas desde su repo externo despues de aprobacion humana. | Instalar dentro de GVO, agregar a `package.json`, convertir en runtime o script obligatorio. | Mantener externa; mejoras solo en su repo independiente. |
| Codex | Aprobada bajo tickets y security gate | Ejecutar tickets acotados, documentados y verificables. | Saltar ticket, usar red sin autorizacion, crear PR, ejecutar comandos fuera de alcance. | Continuar con PRE-CIERRE y entregas normalizadas. |
| Obsidian | Aprobada externa documental / no runtime | Apoyo documental externo sobre `docs/` con revision humana. | Plugins obligatorios, dependencia runtime, configuracion opaca versionada. | Mantener externo; formalizar vault solo si se aprueba ticket. |

## 8. Herramientas en observacion

| Herramienta | Estado final TANDA 007 | Uso permitido | Uso prohibido | Siguiente accion |
|---|---|---|---|---|
| Graphify | En observacion / solo sandbox externo | Fixture ficticio fuera de GVO, sin secretos, sin API keys reales. | Ejecutarlo sobre GVO, `docs/**` reales, API keys reales, hooks, MCP o salidas dentro de GVO. | Definir politica de LLM/API keys o modo offline antes de repetir prueba. |
| SkillCheck | En observacion | Investigacion externa futura si se elige candidato exacto. | Instalar/ejecutar dentro de GVO, crear skills/agentes/hooks/MCP. | Elegir candidato exacto antes de sandbox. |

## 9. Herramientas bloqueadas o pendientes

| Herramienta | Estado final TANDA 007 | Uso permitido | Uso prohibido | Siguiente accion |
|---|---|---|---|---|
| Claude Code | Pendiente / bloqueada en GVO | Evaluacion documental futura fuera de GVO. | Uso dentro de GVO, `.claude/`, MCP, hooks, permisos amplios. | Ticket especifico de evaluacion si el usuario lo autoriza. |
| Spec-kit | Pendiente de evaluacion | Evaluacion externa o aislada para features medianas/grandes. | Reemplazar metodologia GVO o tocar runtime sin ticket. | Evaluar solo si se justifica por complejidad. |
| Gstack | Pendiente de evaluacion | Referencia externa puntual. | Dependencia del repo, permisos amplios o automatizacion. | Evaluar si se vuelve necesario. |
| Claude Council | Pendiente de evaluacion | Revision externa puntual sin escritura. | Automatizar cambios, leer secretos o conectar agentes. | Evaluar antes de uso operativo. |
| MCP/conectores | Bloqueados en GVO | Ninguno dentro de GVO por ahora. | Crear `.mcp*`, conectores o configuraciones sin politica propia. | Politica especifica con inventario de permisos. |
| GitHub Actions | Pendiente de auditoria | Ningun cambio actual. | Crear workflows, permisos o secretos remotos sin ticket. | Auditoria controlada de CI si se necesita. |
| pre-commit/security baseline | Existe baseline / requiere auditoria posterior | Mantener como referencia y validarlo bajo ticket. | Modificar baseline en tickets no autorizados. | Auditoria posterior si se amplia o se exige gate formal. |
| npm scripts GVO | Controlados por matriz de comandos | Ejecutar solo scripts permitidos por ticket. | `build`, `check`, `format`, `install`, `update`, `audit` o mutativos en read-only. | Mantener matriz y actualizar si cambia `package.json`. |
| scripts/tools internos GVO | Controlados por security gate | Usar solo si el ticket los autoriza y se sabe si escriben. | Ejecutar herramientas internas mutativas sin autorizacion. | Catalogar si crece la cantidad de scripts. |

## 10. Politicas creadas o consolidadas

| Documento | Funcion |
|---|---|
| `docs/process/POLITICA_ARCHIVO_HISTORICO_EVIDENCIA_VISUAL.md` | Define archivo historico visual por lotes con copia externa, verificacion y manifiestos. |
| `docs/security/POLITICA_HERRAMIENTAS_EXTERNAS_Y_AGENTES.md` | Define reglas para herramientas externas, agentes y conectores. |
| `docs/security/MATRIZ_COMANDOS_POR_TIPO_DE_TICKET.md` | Clasifica comandos permitidos/prohibidos por tipo de ticket. |
| `docs/security/SECURITY_GATE_COMANDOS_SCRIPTS_PERMISOS.md` | Establece gate para comandos, scripts y permisos sensibles. |
| `docs/security/PROTOCOLO_SECRETOS_Y_CREDENCIALES.md` | Establece criterio de proteccion de secretos y credenciales. |
| `docs/security/POLITICA_PERMISOS_SENSIBLES_QR_CAMARA.md` | Gobierna permisos sensibles como QR/camara antes de implementarlos. |
| `docs/security/MAPA_OSW_HERRAMIENTAS_007R.md` | Consolida estado final de herramientas OSW tras TANDA 007. |

## 11. Archivos historicos visuales archivados

| Lote | Origen retirado de GVO | Archivo externo | Archivos | Bytes | Peso aprox. | Manifiestos |
|---|---|---|---:|---:|---:|---|
| 007H | `docs/visual/loading-initial/` | `C:\Users\JOSE DAVID\Documents\OKUA_ARCHIVE\GVO\evidencia_visual\007H_loading_initial` | 127 | 19,627,499 | 18.72 MB | `docs/archive_manifests/007H_loading_initial.md`, `.csv` |
| 007J | `docs/visual/transition-world/` | `C:\Users\JOSE DAVID\Documents\OKUA_ARCHIVE\GVO\evidencia_visual\007J_transition_world` | 101 | 62,624,460 | 59.72 MB | `docs/archive_manifests/007J_transition_world.md`, `.csv` |
| Total | 2 lotes | Archivo externo OKUA | 228 | 82,251,959 | 78.44 MB | 4 manifiestos livianos |

## 12. Evidencia visual pendiente o no tocada

No se debe archivar todavia sin revision humana fina:

- `docs/visual/cover-intro/`: bloque pesado, pero ligado a Portada / Intro con deuda visual y estado `NO_CERRADA_FINAL`.
- `docs/gvo/world-1/validation/`: ligado a Mundo I, que tiene base runtime montada y continuidad pendiente.
- `docs/gvo/performance/validation/`: menor impacto de peso y posible valor como baseline tecnico.
- Atlas 006I y documentos historicos asociados: protegidos por regla de no tocar Atlas sin ticket especifico.

## 13. Seguridad y governance estabilizados

GVO queda con una capa de seguridad operativa mas explicita:

- tickets de solo lectura no deben ejecutar scripts mutativos;
- `git push origin main` solo en tickets `*-PUSH`;
- red prohibida salvo autorizacion textual;
- no crear PR;
- no crear hooks;
- no crear carpetas de agentes, skills ni MCP;
- no integrar herramientas externas como runtime;
- no leer secretos ni variables de entorno innecesarias;
- herramientas externas deben evaluarse por evidencia, licencia, permisos, rutas leidas/escritas, rollback y riesgo de red.

## 14. Riesgos residuales

| Riesgo | Nivel | Mitigacion |
|---|---|---|
| Volver a desarrollo sin revisar estado funcional vivo | Alto | Ejecutar 008A antes de tocar runtime. |
| Retomar archivo visual y retirar evidencia aun viva | Medio/alto | Mantener pausa de archivo visual salvo ticket especifico. |
| Ejecutar Graphify sobre GVO real o con API keys reales | Alto | Mantener Graphify en observacion y sandbox externo. |
| Avanzar con SkillCheck sin candidato exacto | Alto | Exigir identificacion de herramienta, fuente, version y comandos. |
| Integrar Claude Code, MCP o conectores sin politica | Alto | Bloquear hasta politica especifica. |
| Automatizar CI/GitHub Actions sin revisar secretos/permisos | Medio/alto | Auditoria controlada antes de crear workflows. |
| Ejecutar `npm run check`, `build` o `format` en tickets read-only | Medio | Aplicar matriz de comandos. |
| Confundir documentos historicos con estado vivo | Medio | Usar la nota 007C y `ESTADO_ACTUAL_PROYECTO.md` como fuente viva. |

## 15. Que NO se debe hacer despues de TANDA 007

- No tocar runtime directamente sin una revision funcional post-gobernanza.
- No ejecutar Graphify sobre GVO.
- No usar Graphify con API keys reales.
- No avanzar con SkillCheck sin candidato exacto.
- No crear MCP/conectores.
- No crear carpetas `.agents`, `.codex`, `.claude`, `.cursor`, `skills` ni `.mcp*`.
- No usar Claude Code dentro de GVO sin evaluacion especifica.
- No convertir `okua-delivery-md` en dependencia de GVO.
- No ejecutar scripts mutativos en tickets read-only.
- No crear PR ni sugerir PR.
- No archivar `cover-intro`, `world-1/validation`, performance o Atlas sin ticket especifico.

## 16. Que si se puede hacer despues de TANDA 007

- Retomar desarrollo funcional mediante ticket pequeno y verificable.
- Revisar el estado funcional vivo antes de modificar runtime.
- Usar Codex bajo tickets, security gate, PRE-CIERRE y validaciones permitidas.
- Usar `okua-delivery-md` externamente para cierres aprobados.
- Consultar el mapa 007R antes de cualquier herramienta externa.
- Evaluar herramientas externas solo con sandbox externo, fixture ficticio, sin secretos y con comandos aprobados.
- Ejecutar pushes directos solo cuando un ticket `*-PUSH` lo autorice.

## 17. Recomendacion de retorno a desarrollo GVO

Ruta principal recomendada:

```text
008A - Revision de estado funcional post-gobernanza
```

Motivo:

Despues de una tanda larga de gobierno, archivo historico, seguridad, evaluacion de herramientas y cierre documental, conviene confirmar el estado funcional real de GVO antes de tocar runtime. La fuente viva indica que Mundo I esta montado en `/estacion/1`, con estado `ready_to_continue` y salida final pendiente; tambien existen deudas visuales documentadas en carga inicial, Portada / Intro y Transicion.

008A debe ser una revision controlada, preferiblemente sin cambios runtime, que confirme rutas, pantallas, deuda viva, validaciones necesarias y siguiente punto funcional seguro.

## 18. Proximo bloque sugerido

Orden recomendado:

| Orden | Ticket sugerido | Motivo |
|---:|---|---|
| 1 | `007S-PUSH - Sincronizar cierre de TANDA 007` | Publicar el cierre documental aprobado de TANDA 007. |
| 2 | `008A - Revision de estado funcional post-gobernanza` | Confirmar estado vivo antes de tocar runtime. |
| 3 | `008B - Auditoria visual/runtime de Mundo I antes de retomar desarrollo` | Revisar deuda viva de Mundo I si 008A confirma continuidad ahi. |
| 4 | `008C - Retorno a desarrollo de Estacion I / Mundo I` | Solo despues de 008A/008B y aprobacion humana. |
| 5 | `008D - Validacion de baseline de seguridad introducido en e669a28/cbc0d8b` | Revisar baseline si se va a formalizar como gate mas estricto. |

## 19. Criterios para reabrir evaluacion de herramientas externas

Reabrir evaluacion solo si existe:

- ticket explicito;
- objetivo concreto;
- candidato exacto;
- fuente, licencia y version identificadas;
- comandos exactos aprobados;
- rutas de lectura/escritura declaradas;
- sandbox externo o fixture ficticio;
- prohibicion de secretos y API keys reales salvo politica especifica;
- salida externa y reporte curado;
- rollback claro;
- aprobacion humana antes de versionar resultados.

## 20. Decisiones globales explicitas

1. `okua-delivery-md` queda aprobado como herramienta externa, no runtime.
2. Codex queda aprobado bajo tickets, security gate y PRE-CIERRE.
3. Graphify queda en observacion; no ejecutar sobre GVO ni con API keys reales.
4. SkillCheck queda en observacion; no avanzar sin candidato exacto.
5. Claude Code queda pendiente y bloqueado dentro de GVO.
6. MCP/conectores quedan bloqueados hasta politica especifica.
7. Obsidian puede usarse solo como apoyo documental externo.
8. GitHub Actions queda pendiente de auditoria.
9. Baseline de seguridad/pre-commit requiere auditoria posterior si se amplia.
10. No crear carpetas de agentes, skills ni MCP.
11. No ejecutar scripts mutativos en tickets read-only.
12. No aprobar herramientas por reputacion, solo por evidencia.
13. No tocar runtime en tickets de governance.
14. PR no aplica.

## 21. Cierre metodologico

TANDA 007 queda cerrada como tanda de gobernanza, seguridad, archivo historico y tooling.

Decision recomendada:

```text
APROBADA_CERRAR_Y_PREPARAR_007S_PUSH
```

Siguiente paso inmediato:

```text
007S-PUSH - Sincronizar cierre de TANDA 007
```

Despues del push:

```text
008A - Revision de estado funcional post-gobernanza
```

Este cierre no modifica runtime, no instala herramientas, no ejecuta herramientas externas, no usa red, no crea PR, no crea hooks, no crea carpetas de agentes/skills/MCP y no reemplaza la aprobacion humana por tickets.

