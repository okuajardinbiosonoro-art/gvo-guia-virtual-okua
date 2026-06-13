# Mapa OSW de herramientas 007R

## 1. Proposito

Este documento consolida el estado de las herramientas OSW evaluadas o reconocidas durante TANDA 007 para GVO - Guia Virtual OKUA.

Su funcion es servir como tablero de decision para saber que herramientas pueden usarse, bajo que condiciones y cuales permanecen pendientes, en observacion o bloqueadas para el repositorio vivo.

## 2. Alcance

Este mapa cubre herramientas, agentes, conectores, scripts y baselines que podrian afectar:

- documentacion versionada;
- runtime GVO;
- seguridad;
- permisos;
- secretos;
- flujos de agentes;
- automatizaciones;
- entregas normalizadas;
- validaciones locales;
- decisiones de adopcion de tooling.

No autoriza nuevas instalaciones, ejecuciones, integraciones, conectores, hooks, carpetas de agentes ni uso de red.

## 3. Relacion con TANDA 007

TANDA 007 establecio gobierno tecnico, seguridad documental, politica de agentes, archivo historico visual, evaluaciones de herramientas externas y reglas de cierre trazables.

Este mapa consolida evidencia de:

- reconocimiento de `okua-delivery-md` como herramienta externa de documentacion;
- politica de herramientas externas y agentes 007M;
- matriz de comandos por tipo de ticket;
- security gate de comandos, scripts y permisos sensibles 007N;
- evaluacion controlada de SkillCheck 007O;
- sandbox externo de SkillCheck 007P;
- evaluacion controlada de Graphify 007Q;
- prueba externa de Graphify con fixture ficticio 007Q-SANDBOX.

## 4. Estado actual de GVO

Estado observado al iniciar 007R:

```text
Rama: main
Git: ## main...origin/main
Working tree: limpio antes de crear este documento
PR: PR_NO_APLICA
```

Este ticket permite crear un unico archivo documental:

```text
docs/security/MAPA_OSW_HERRAMIENTAS_007R.md
```

No permite modificar runtime, assets, configuracion, scripts, dependencias, hooks ni baselines existentes.

## 5. Reglas no negociables

- No modificar runtime sin ticket explicito.
- No modificar `src/**`, `public/**`, `assets/**` ni Atlas 006I.
- No modificar `package.json`, `package-lock.json`, `.gitignore`, `.pre-commit-config.yaml`, `requirements-security.txt` ni `scripts/run_security_checks.ps1`.
- No instalar herramientas.
- No ejecutar herramientas externas dentro de GVO.
- No crear carpetas `.agents`, `.codex`, `.claude`, `.cursor`, `skills` ni `.mcp*`.
- No crear hooks.
- No crear configuracion MCP.
- No usar red.
- No ejecutar scripts npm en este ticket.
- No crear Pull Request.
- No sugerir Pull Request.
- No ejecutar `okua-delivery-md` antes de aprobacion humana.

## 6. Estados usados en este mapa

| Estado | Significado operativo |
|---|---|
| `APROBADA_EXTERNA` | Puede usarse fuera de GVO, sin integrarse al repo ni convertirse en dependencia. |
| `APROBADA_SOLO_SANDBOX_EXTERNO` | Puede probarse unicamente en carpeta externa, con fixture o datos ficticios y ticket aprobado. |
| `EN_OBSERVACION` | Hay evidencia preliminar, pero no existe aprobacion de adopcion ni uso sobre GVO vivo. |
| `PENDIENTE_EVALUACION` | Falta evaluacion especifica, evidencia suficiente o candidato exacto. |
| `BLOQUEADA_EN_GVO` | No debe instalarse, ejecutarse ni configurarse dentro de GVO. |
| `NO_RUNTIME` | No puede ser dependencia de runtime ni requisito para servir la app. |
| `NO_APLICA` | No corresponde aplicar como herramienta operativa en el flujo actual. |

## 7. Tabla maestra de herramientas

| Herramienta | Estado 007R | Evidencia | Uso permitido | Uso prohibido | Riesgo residual | Siguiente ticket |
|---|---|---|---|---|---|---|
| `okua-delivery-md` | `APROBADA_EXTERNA` / `NO_RUNTIME` | 007A-0, politica 007M, matriz de comandos | Normalizar entregas Markdown fuera de GVO despues de aprobacion humana cuando el ticket lo pida. | Instalar en GVO, agregar a `package.json`, convertir en dependencia runtime o script obligatorio, ejecutarla antes del PRE-CIERRE si el ticket lo prohibe. | Bajo si permanece externa; medio si se generan entregas incompletas por falta de RAW tecnico. | Mantener flujo actual; mejoras solo en repo independiente `okua-delivery-md`. |
| Codex | `APROBADA_EXTERNA` / controlado por tickets y security gate | `AGENTS.md`, politica 007M, security gate 007N, matriz de comandos | Ejecutar tickets pequenos, acotados, verificables y aprobados; documentar evidencia; detenerse en PRE-CIERRE si aplica. | Improvisar cambios, saltar reglas del ticket, usar red sin autorizacion, crear PR, ejecutar comandos no permitidos. | Medio: depende de rigor del ticket y de validaciones. | Continuar bajo tickets TANDA 007 y security gate. |
| Claude Code | `PENDIENTE_EVALUACION` / `BLOQUEADA_EN_GVO` | Politica 007M | Evaluacion documental futura fuera de GVO si existe ticket especifico. | Usarlo dentro de GVO, crear `.claude/`, conectar MCP, instalar hooks o permitir permisos amplios. | Alto: agente externo con posible acceso amplio a archivos/comandos. | Ticket futuro de evaluacion especifica, si el usuario lo autoriza. |
| Obsidian | `APROBADA_EXTERNA` / `NO_RUNTIME` | Politica 007M | Uso documental externo sobre `docs/` como apoyo humano, con revision de cualquier metadata antes de versionar. | Convertirlo en dependencia de build/runtime, instalar plugins obligatorios, crear configuracion opaca en GVO. | Bajo/medio: metadatos locales o plugins pueden contaminar el repo. | Mantener externo; evaluar convenciones si se adopta vault formal. |
| Graphify | `EN_OBSERVACION` / `APROBADA_SOLO_SANDBOX_EXTERNO` | 007Q-DOC y 007Q-SANDBOX | Pruebas externas con fixture ficticio, sin secretos, sin GVO real y sin API keys reales por ahora. | Ejecutarlo sobre GVO, sobre `docs/**` reales, con API keys reales, con `install --project`, hooks, MCP o salidas dentro de GVO. | Alto: puede requerir LLM/API key para docs y generar salidas masivas; sandbox 007Q no produjo grafo util sin LLM/API key. | Mantener en observacion; definir politica de LLM/API keys o modo offline antes de nueva prueba. |
| SkillCheck | `EN_OBSERVACION` | 007O y 007P | Investigacion externa futura solo si se elige candidato exacto y comandos/rutas quedan aprobados. | Instalar o ejecutar en GVO, crear `skills/`, agentes, MCP, hooks o modificar el repo automaticamente. | Alto: no existe un unico candidato inequívoco y cada candidato implica riesgos distintos. | Elegir candidato exacto antes de cualquier sandbox real. |
| Spec-kit | `PENDIENTE_EVALUACION` | Politica 007M, matriz de comandos | Evaluacion futura externa o en entorno aislado, solo para features medianas/grandes si se aprueba. | Usarlo para reemplazar tickets GVO, introducir estructura sin ADR/documentacion o tocar runtime sin ticket. | Medio/alto: puede alterar metodologia y estructura del proyecto. | Ticket futuro de evaluacion controlada si se decide retomarlo. |
| Gstack | `PENDIENTE_EVALUACION` | Politica 007M | Referencia metodologica externa o revision puntual sin permisos sobre GVO. | Ejecutarlo como dependencia del repo, otorgar permisos amplios o automatizar cambios. | Medio: alcance y permisos no evaluados. | Evaluacion documental futura si se vuelve necesario. |
| Claude Council | `PENDIENTE_EVALUACION` | Politica 007M | Revision puntual externa, sin acceso directo a secretos ni escritura sobre GVO. | Automatizar cambios, conectar agentes, crear hooks o dar permisos amplios. | Medio/alto: multiples agentes pueden amplificar errores o fuga de contexto. | Evaluacion especifica antes de cualquier uso operativo. |
| MCP/conectores | `BLOQUEADA_EN_GVO` | Politica 007M, security gate 007N | Ninguno dentro de GVO por ahora. | Crear `.mcp*`, conectores, permisos a recursos externos o configuraciones MCP sin politica propia. | Alto: superficie de permisos, red, lectura de recursos y acciones externas. | Politica especifica de MCP/conectores solo si el usuario la solicita. |
| GitHub Actions | `PENDIENTE_EVALUACION` | Security baseline y flujo `PR_NO_APLICA` | Ningun cambio en este ticket; posible evaluacion futura de CI si se define flujo sin PR. | Crear workflows, ejecutar CI nuevo, exigir PR, modificar permisos o secretos de Actions sin ticket. | Medio/alto: puede implicar secretos, permisos remotos y red. | Auditoria futura de CI/security baseline si se requiere. |
| pre-commit/security baseline | Existe baseline / requiere auditoria posterior | Commits `e669a28` y `cbc0d8b`, docs de seguridad 007N recuperados | Mantener como referencia de seguridad y validar solo bajo tickets autorizados. | Modificar `.pre-commit-config.yaml`, `requirements-security.txt` o `scripts/run_security_checks.ps1` en 007R. | Medio: baseline debe auditarse despues de estabilizar divergencias previas. | Auditoria posterior del baseline si el usuario lo agenda. |
| npm scripts GVO | Controlados por matriz de comandos | `docs/security/MATRIZ_COMANDOS_POR_TIPO_DE_TICKET.md` | Ejecutar solo scripts permitidos por ticket, distinguiendo lectura, pruebas, escritura y procesos persistentes. | Ejecutar `build`, `check`, `format`, `install`, `update`, `audit` o scripts mutativos en tickets read-only. | Medio: algunos scripts escriben artefactos o pueden disparar builds. | Mantener matriz como gate operativo. |
| scripts/tools internos GVO | Controlados por security gate | Matriz de comandos y security gate 007N | Usar solo scripts internos explicitamente permitidos por ticket y con validacion de si escriben. | Ejecutar scripts que modifiquen assets, runtime, configuracion o salidas sin autorizacion. | Medio: herramientas internas pueden parecer seguras pero escribir archivos. | Revisar caso por caso en tickets futuros. |

## 8. Clasificacion por estado

### `APROBADA_EXTERNA`

- `okua-delivery-md`
- Codex, bajo ticket y security gate
- Obsidian, solo como apoyo documental externo

### `APROBADA_SOLO_SANDBOX_EXTERNO`

- Graphify, solo con fixture ficticio externo y sin API keys reales por ahora

### `EN_OBSERVACION`

- Graphify
- SkillCheck

### `PENDIENTE_EVALUACION`

- Claude Code
- Spec-kit
- Gstack
- Claude Council
- GitHub Actions

### `BLOQUEADA_EN_GVO`

- Claude Code dentro de GVO
- MCP/conectores
- Graphify sobre GVO real
- SkillCheck dentro de GVO
- Carpetas de agents, skills y MCP no autorizadas

### `NO_RUNTIME`

- `okua-delivery-md`
- Obsidian
- Graphify
- SkillCheck
- Spec-kit
- Gstack
- Claude Council
- MCP/conectores

### `NO_APLICA`

- Pull Request como flujo operativo de GVO
- Integracion runtime de herramientas documentales externas

## 9. Condiciones de uso por herramienta

| Herramienta | Condiciones minimas |
|---|---|
| `okua-delivery-md` | Ejecutar desde repo independiente o flujo externo, despues de aprobacion humana, sin RAW persistente ni `.md` intermedio. |
| Codex | Ticket activo, archivos permitidos claros, comandos permitidos, validaciones registradas, PRE-CIERRE cuando aplique. |
| Claude Code | Requiere evaluacion especifica previa; sin uso dentro de GVO por ahora. |
| Obsidian | Uso externo documental; revisar cualquier metadata antes de versionar. |
| Graphify | Solo sandbox externo, fixture ficticio, salidas externas, sin GVO real, sin secretos, sin API keys reales. |
| SkillCheck | Elegir candidato exacto antes de probar; sandbox externo; sin GVO real; sin carpetas de skills/agentes. |
| Spec-kit | Solo con ticket futuro; no reemplaza metodologia GVO; no tocar runtime sin aprobacion. |
| Gstack | Solo referencia externa hasta evaluacion. |
| Claude Council | Solo revision externa puntual hasta evaluacion. |
| MCP/conectores | Requieren politica propia, inventario de permisos y aprobacion humana explicita. |
| GitHub Actions | Requiere auditoria de permisos, secretos, red y flujo sin PR antes de crear workflows. |
| pre-commit/security baseline | Usar solo en tickets de seguridad autorizados; documentar caches y falsos positivos. |
| npm scripts GVO | Ejecutar solo si el ticket los autoriza y la matriz los clasifica como permitidos para ese tipo de ticket. |
| scripts/tools internos GVO | Confirmar si leen o escriben antes de ejecutarlos; usar solo bajo ticket explicito. |

## 10. Prohibiciones por herramienta

| Herramienta | Prohibiciones vigentes |
|---|---|
| `okua-delivery-md` | No instalar en GVO; no agregar a npm; no ejecutar antes de aprobacion si el ticket lo prohibe. |
| Codex | No PR; no comandos fuera de alcance; no red sin ticket; no lectura de secretos. |
| Claude Code | No uso dentro de GVO; no `.claude/`; no MCP; no hooks. |
| Obsidian | No plugins obligatorios; no dependencia runtime; no configuracion opaca versionada. |
| Graphify | No GVO real; no `docs/**` reales; no API keys reales; no hooks; no MCP; no salidas dentro de GVO. |
| SkillCheck | No instalar/ejecutar en GVO; no skills/agentes; no hooks; no MCP. |
| Spec-kit | No aplicar a GVO sin ticket; no cambiar metodologia sin ADR/documentacion. |
| Gstack | No dependencia del repo; no permisos amplios. |
| Claude Council | No automatizar cambios; no secretos; no permisos amplios. |
| MCP/conectores | No crear ni configurar en GVO sin politica especifica. |
| GitHub Actions | No crear workflows ni permisos remotos sin ticket. |
| pre-commit/security baseline | No modificar baseline en 007R. |
| npm scripts GVO | No ejecutar scripts npm en 007R; no scripts mutativos en tickets read-only. |
| scripts/tools internos GVO | No ejecutar herramientas internas mutativas sin autorizacion textual. |

## 11. Siguiente ticket recomendado por herramienta

| Herramienta | Siguiente ticket recomendado |
|---|---|
| `okua-delivery-md` | Ninguno en GVO; mejoras en repo externo si aparecen fallas de normalizacion. |
| Codex | Continuar con tickets pequenos y security gate. |
| Claude Code | Evaluacion especifica de Claude Code antes de cualquier uso dentro de GVO. |
| Obsidian | Politica de vault/metadatos si se decide formalizar uso documental. |
| Graphify | Politica de LLM/API keys o evaluacion offline antes de nueva prueba. |
| SkillCheck | Seleccion de candidato exacto antes de sandbox. |
| Spec-kit | Evaluacion controlada externa si se considera para features medianas/grandes. |
| Gstack | Evaluacion documental si se decide usar como referencia formal. |
| Claude Council | Evaluacion documental si se decide usar revisiones multiagente. |
| MCP/conectores | Politica MCP/conectores con inventario de permisos. |
| GitHub Actions | Auditoria controlada de CI, permisos y secretos. |
| pre-commit/security baseline | Auditoria posterior del baseline y caches. |
| npm scripts GVO | Mantener matriz; ampliar solo cuando cambie `package.json`. |
| scripts/tools internos GVO | Catalogo de scripts internos si crece el numero de herramientas. |

## 12. Decisiones derivadas

1. No usar Graphify sobre GVO.
2. No usar Graphify con API keys reales todavia.
3. No avanzar con SkillCheck sin elegir candidato exacto.
4. No crear MCP/conectores.
5. No crear carpetas de skills/agentes.
6. No usar Claude Code dentro de GVO sin evaluacion especifica.
7. Mantener `okua-delivery-md` externo.
8. Mantener Codex bajo tickets y security gate.
9. No ejecutar scripts mutativos en tickets read-only.
10. No aprobar herramientas por reputacion; solo por evidencia.

## 13. Riesgos residuales

| Riesgo | Nivel | Mitigacion |
|---|---|---|
| Ambiguedad de herramientas con nombres similares | Alto | Exigir candidato exacto, fuente, version y licencia antes de probar. |
| Salidas masivas no curadas | Medio/alto | Mantener salidas fuera de GVO y versionar solo reportes curados. |
| Uso accidental de API keys o secretos | Alto | Prohibir secretos y API keys reales en pruebas iniciales. |
| Configuraciones de agentes o MCP no auditadas | Alto | Bloquear carpetas y conectores hasta politica especifica. |
| Scripts internos que escriben artefactos | Medio | Aplicar matriz de comandos y revisar comportamiento antes de ejecutar. |
| PR o flujos remotos no aplicables | Medio | Mantener `PR_NO_APLICA` y push directo solo en tickets `*-PUSH`. |
| Herramientas aprobadas por reputacion | Medio/alto | Exigir evidencia local, documental o sandbox antes de adopcion. |

## 14. Decision global de TANDA 007

Decision consolidada:

```text
MANTENER_GVO_SIN_INTEGRACION_DE_HERRAMIENTAS_EXTERNAS_NO_APROBADAS
APROBAR_SOLO_USOS_EXTERNOS_DOCUMENTALES_Y_SANDBOX_CONTROLADOS
BLOQUEAR_AGENTES_MCP_HOOKS_Y_RUNTIME_TOOLING_SIN_TICKET_ESPECIFICO
```

Interpretacion:

- GVO conserva su runtime sin nuevas dependencias externas.
- Las herramientas documentales pueden apoyar el flujo solo si permanecen fuera del repo y no se convierten en requisitos operativos.
- Las herramientas de analisis prometedoras quedan en observacion hasta que exista evidencia suficiente y politica especifica.
- Los conectores, MCP, hooks y agentes con permisos amplios permanecen bloqueados.

## 15. Recomendacion operativa

Usar este mapa como gate previo antes de cualquier ticket que mencione herramientas externas, agentes, skills, conectores, scripts, red, permisos sensibles o automatizaciones.

Recomendacion inmediata:

```text
APROBAR_007R_Y_PREPARAR_007R_PUSH
```

Despues de sincronizar 007R, una ruta segura seria cerrar TANDA 007 con un resumen de decisiones y plan de retorno a desarrollo GVO, sin integrar herramientas nuevas por defecto.

## 16. Cierre metodologico

Este documento no instala herramientas, no ejecuta herramientas externas, no usa red, no modifica runtime, no crea conectores, no crea carpetas de agentes, no crea hooks y no reemplaza la aprobacion humana por tickets.

