# Evaluacion Graphify 007Q

## 1. Proposito

Registrar en GVO los resultados aprobados de `007Q - Evaluacion controlada de Graphify sin integrar herramientas en GVO`.

Este documento sirve como referencia trazable para decisiones futuras sobre Graphify, sin instalar la herramienta, sin ejecutarla, sin descargarla, sin integrarla al runtime y sin autorizar su uso directo sobre el repositorio vivo.

## 2. Alcance

Este registro cubre:

- evidencia documental revisada durante 007Q;
- candidato principal identificado;
- entradas y salidas documentadas;
- riesgos para OSW/GVO;
- prohibiciones vigentes;
- condiciones para una prueba futura;
- decision preliminar de uso solo en sandbox externo.

No cubre una prueba real. Graphify no fue instalado ni ejecutado en 007Q.

## 3. Relacion con documentos de seguridad

Este documento complementa:

- `docs/security/POLITICA_HERRAMIENTAS_EXTERNAS_Y_AGENTES.md`;
- `docs/security/MATRIZ_COMANDOS_POR_TIPO_DE_TICKET.md`;
- `docs/security/SECURITY_GATE_COMANDOS_SCRIPTS_PERMISOS.md`;
- `docs/security/PROTOCOLO_SECRETOS_Y_CREDENCIALES.md`;
- `docs/security/EVALUACION_CONTROLADA_SKILLCHECK_007O.md`.

La politica de herramientas externas mantiene Graphify como herramienta pendiente de evaluacion. La matriz de comandos y el security gate impiden instalar, ejecutar o integrar herramientas externas dentro de GVO sin ticket explicito. El protocolo de secretos impide usar datos reales, `.env`, credenciales o API keys en pruebas no controladas. La evaluacion SkillCheck 007O sirve como antecedente metodologico: herramientas ambiguas o externas deben aislarse antes de cualquier adopcion.

## 4. Resumen de 007Q

007Q evaluo Graphify de forma documental y externa.

Resultado operativo:

- GVO no fue modificado.
- No se creo commit.
- No se hizo push.
- No se creo rama.
- No se creo Pull Request.
- `PR_NO_APLICA`.
- No se instalo Graphify.
- No se ejecuto Graphify.
- No se descargo Graphify.
- No se clono repositorio.
- No se ejecuto npm.
- No se instalaron dependencias.
- No se leyeron secretos.
- Se uso red solo para investigacion documental autorizada.

Clasificacion final:

```text
APROBAR_SOLO_SANDBOX_EXTERNO
```

## 5. Estado de GVO durante 007Q

Durante 007Q, el estado Git de GVO fue:

```text
## main...origin/main
```

El working tree quedo limpio. No se generaron artefactos dentro de GVO.

## 6. Sandbox externo usado

Ruta externa preparada:

```text
C:\Users\JOSE DAVID\Documents\OKUA_SANDBOX\graphify_007Q
```

La carpeta fue creada fuera de GVO y quedo vacia.

No se copiaron documentos reales de GVO al sandbox. No se creo fixture. No se generaron salidas.

## 7. Candidato principal identificado

Durante 007Q se identifico como candidato principal:

| Campo | Evidencia |
|---|---|
| Repositorio | `safishamsi/graphify` |
| Sitio documental | `graphify.net` |
| Paquete | `graphifyy` |
| CLI | `graphify` |
| Lenguaje principal | Python |
| Licencia | MIT |
| Proposito | Builder de knowledge graph para asistentes de codigo y analisis documental |

Graphify se presenta como herramienta para generar grafos de conocimiento orientados a asistentes como Claude Code, OpenAI Codex y OpenCode.

## 8. Entradas documentadas

La documentacion revisada indica soporte o alcance para:

- codigo fuente;
- Markdown;
- docs;
- PDFs;
- imagenes;
- diagramas;
- video/audio mediante extras;
- JSON;
- Bash.

Para GVO, la entrada potencial mas segura seria un fixture Markdown ficticio fuera de GVO.

## 9. Salidas documentadas

Graphify documenta salidas como:

- `graphify-out/graph.html`;
- `graphify-out/graph.json`;
- `graphify-out/GRAPH_REPORT.md`;
- cache incremental;
- exports HTML de arquitectura/callflow.

Estas salidas no deben generarse dentro de GVO sin ticket especifico y curaduria humana.

## 10. Riesgos identificados

| Riesgo | Descripcion | Nivel |
|---|---|---|
| Instalacion externa | Instalacion por `uv`, `pipx` o `pip` puede contaminar entorno. | Medio/alto |
| Escritura de salidas | Puede generar `graphify-out/` y reportes. | Medio |
| Lectura de carpetas completas | Puede analizar arboles completos indicados por comando. | Alto |
| Salidas masivas | Puede generar HTML, JSON, Markdown, cache y grafos extensos. | Medio/alto |
| Skills o integraciones | `graphify install --project` puede escribir integraciones de asistente. | Alto |
| Hooks | Puede instalar o sugerir hooks/integraciones de flujo. | Alto |
| MCP | Extras o integraciones pueden incluir MCP. | Alto |
| Extras | Extras `neo4j`, `google`, `video`, `office`, `pdf` amplian superficie. | Medio/alto |
| LLM/API keys | Docs/PDFs/imagenes pueden requerir backend LLM o API keys. | Alto |
| GVO vivo | Apuntar Graphify a GVO real podria leer docs, codigo y generar artefactos no curados. | Alto |

## 11. Matriz de evaluacion

| Area | Evidencia 007Q | Riesgo | Decision | Condicion futura |
|---|---|---|---|---|
| Origen oficial | `graphify.net` y `safishamsi/graphify` | Bajo/medio | Candidato principal identificado | Verificar version/fuente en ticket de prueba |
| Licencia | MIT documentada | Bajo | Favorable | Confirmar antes de instalar |
| Instalacion | `graphifyy`, `uv`, `pipx`, `pip` | Medio/alto | No instalar en GVO | Solo sandbox externo |
| Ejecucion | CLI `graphify` documentada | Alto si apunta a GVO | No ejecutar en GVO | Fixture ficticio |
| Red | Puede requerir modelo/API key para ciertos inputs | Alto | No usar sin ticket | Prueba offline o con autorizacion explicita |
| Lectura de carpetas | Lee rutas indicadas por comando | Alto | No apuntar a GVO | Usar carpeta minima externa |
| Escritura de salidas | Genera `graphify-out/` y reportes | Medio | No escribir en GVO | Salida externa controlada |
| Markdown | Soportado/documentado | Medio | Potencial util | Usar Markdown ficticio |
| Obsidian/docs | Potencial para docs y knowledge graph | Medio | No usar docs reales aun | Fixture tipo Obsidian falso |
| HTML/JSON | `graph.html`, `graph.json` | Medio | Util si se controla | Salida externa y revisada |
| Mermaid/callflow | Callflow HTML con Mermaid documentado | Medio | Potencial | Validar en sandbox futuro |
| Graphviz | No confirmado como salida principal | Bajo/medio | Pendiente | Investigar si es necesario |
| MCP | Extras/integraciones posibles | Alto | Bloqueado para GVO | Ticket especifico si aplica |
| LLM/API keys | Posible necesidad para docs/PDFs/imagenes | Alto | Bloqueado con datos reales | Sin API keys reales en prueba inicial |
| Hooks/integraciones | Puede instalar skills/integraciones | Alto | Bloqueado en GVO | Prohibir `install --project` |
| Compatibilidad OSW | Potencial para mapa de herramientas/docs | Medio | Prometedor | Evaluar solo con fixture |
| Compatibilidad GVO | Riesgo alto sobre repo vivo | Alto | No aprobado dentro de GVO | Nunca sobre `docs/**` reales sin ticket |
| Valor practico | Puede revelar relaciones documentales | Medio | Viable para sandbox | Medir utilidad con fixture |
| Rollback | Sandbox externo vacio | Bajo | Controlado | Mantener salidas fuera de GVO |

## 12. Clasificacion final

```text
APROBAR_SOLO_SANDBOX_EXTERNO
```

Esta clasificacion significa:

- Graphify puede considerarse para prueba futura fuera de GVO.
- Graphify no queda aprobado para integrarse al repositorio.
- Graphify no queda aprobado para ejecutarse sobre GVO.
- Graphify no queda aprobado como dependencia runtime ni de desarrollo.
- Graphify no queda aprobado para crear carpetas de agentes, skills, hooks o MCP dentro de GVO.

## 13. Prohibiciones explicitas

Queda prohibido:

- ejecutar Graphify sobre GVO;
- instalar Graphify dentro de GVO;
- descargar Graphify dentro de GVO;
- clonar Graphify dentro de GVO;
- usar Graphify sobre `docs/**` reales todavia;
- crear `.agents/skills`;
- crear `.claude/skills`;
- crear `.mcp*`;
- crear hooks;
- usar API keys reales;
- leer `.env`;
- leer tokens o credenciales;
- versionar salidas masivas sin curaduria;
- agregar Graphify a `package.json`;
- agregar scripts obligatorios de Graphify;
- convertir Graphify en dependencia runtime o requisito del flujo principal.

## 14. Condiciones para prueba futura

Una prueba futura debe cumplir:

- ticket explicito aprobado;
- fixture ficticio;
- sandbox externo;
- sin secretos;
- sin `.env`;
- sin LLM/API keys reales;
- sin lectura de GVO;
- sin copiar `docs/**` reales;
- sin hooks;
- sin MCP;
- sin instalacion dentro de GVO;
- sin salidas dentro de GVO;
- salidas controladas;
- evidencia textual;
- comandos exactos aprobados;
- decision humana antes de conservar cualquier resultado.

## 15. Decision sobre documentacion

Decision:

```text
REGISTRAR_EVALUACION_EN_GVO
NO_APROBAR_INTEGRACION
```

Este documento registra la evaluacion aprobada. No autoriza una prueba real ni una integracion.

## 16. Siguiente ticket recomendado

Despues de registrar este documento:

```text
007Q-DOC-PUSH - Sincronizar documentacion de evaluacion Graphify
```

Si se desea prueba real externa:

```text
007Q-SANDBOX - Probar Graphify con fixture Markdown ficticio fuera de GVO
```

## 17. Cierre metodologico

Graphify queda tratado como herramienta externa prometedora pero no integrada. La unica ruta aceptable para avanzar es una prueba externa, con fixture falso y evidencia auditada, sin tocar GVO.
