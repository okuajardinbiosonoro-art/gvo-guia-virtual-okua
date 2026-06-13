# Evaluacion controlada de SkillCheck 007O

## 1. Proposito de la evaluacion

Este documento evalua de forma preliminar si SkillCheck podria ser util para el flujo OSW/GVO sin integrarlo en el repositorio, sin instalarlo dentro de GVO, sin ejecutarlo sobre archivos vivos y sin convertirlo en dependencia runtime, dependencia de desarrollo o requisito operativo.

La evaluacion es documental. No autoriza ejecutar SkillCheck.

## 2. Alcance

Esta evaluacion cubre:

- riesgos de instalacion;
- riesgos de ejecucion de codigo externo;
- uso de red;
- acceso a archivos;
- lectura accidental de secretos;
- escritura o modificacion del repositorio;
- generacion de carpetas de skills, agentes o MCP;
- hooks y automatizaciones;
- compatibilidad con Codex y Claude Code;
- evidencia requerida para una prueba futura;
- condiciones minimas de sandbox externo.

No cubre una prueba real de SkillCheck, porque no se uso red, no se descargo la herramienta, no se instalo y no se ejecuto.

## 3. Estado actual

SkillCheck no esta integrado en GVO.

Estado vigente:

```text
SKILLCHECK_PENDIENTE_DE_EVALUACION
```

Reglas actuales:

- no instalar SkillCheck dentro de GVO;
- no ejecutar SkillCheck dentro de GVO;
- no crear `skills/`, `.agents/`, `.codex/`, `.claude/`, `.cursor/` ni `.mcp*`;
- no crear configuracion MCP;
- no crear hooks;
- no dar acceso a secretos;
- no modificar runtime;
- no modificar `package.json` ni lockfiles;
- no usar red sin aprobacion humana explicita.

## 4. Relacion con documentos de seguridad

Esta evaluacion complementa:

- `docs/security/POLITICA_HERRAMIENTAS_EXTERNAS_Y_AGENTES.md`;
- `docs/security/MATRIZ_COMANDOS_POR_TIPO_DE_TICKET.md`;
- `docs/security/SECURITY_GATE_COMANDOS_SCRIPTS_PERMISOS.md`;
- `docs/security/PROTOCOLO_SECRETOS_Y_CREDENCIALES.md`.

La politica de herramientas externas clasifica SkillCheck como pendiente de evaluacion. La matriz de comandos exige ticket explicito para herramientas externas. El security gate bloquea integraciones, MCP, hooks, red o escritura si el ticket no los autoriza. El protocolo de secretos impide exponer `.env`, tokens, credenciales o material sensible durante cualquier prueba.

## 5. Supuestos conocidos

Sin usar red ni ejecutar la herramienta, solo pueden asumirse condiciones de trabajo:

- SkillCheck se considera herramienta externa, no runtime.
- Cualquier prueba debe ocurrir fuera de GVO.
- La herramienta podria leer archivos si se ejecuta sobre un directorio.
- La herramienta podria generar reportes, caches, configuraciones o carpetas.
- La herramienta podria requerir instalacion, dependencias, red o hooks.
- La herramienta podria producir falsos positivos o recomendaciones fuera del metodo GVO.

Estos supuestos no son afirmaciones sobre la implementacion real de SkillCheck. Deben verificarse en una investigacion posterior autorizada.

## 6. Informacion faltante

Antes de aprobar cualquier prueba real se necesita confirmar:

- licencia;
- mantenedor;
- fuente oficial;
- modelo de instalacion;
- dependencias requeridas;
- si requiere red;
- si ejecuta codigo de terceros;
- rutas que lee;
- rutas que escribe;
- si genera carpetas `skills/` o equivalentes;
- si crea hooks;
- si usa MCP o conectores;
- si accede a variables de entorno;
- si puede ejecutarse en modo read-only;
- si permite salida a un directorio externo;
- si permite excluir `.env`, `node_modules`, caches y binarios;
- modo de rollback;
- formato de evidencia auditable.

## 7. Riesgos potenciales

| Riesgo | Descripcion | Nivel preliminar | Mitigacion |
|---|---|---|---|
| Instalacion | Podria requerir paquetes, binarios o instalacion global. | Alto | No instalar en GVO; usar sandbox externo. |
| Ejecucion de codigo externo | Podria ejecutar reglas, plugins o analizadores no auditados. | Alto | Ejecutar solo en entorno aislado y con origen verificado. |
| Red | Podria descargar reglas o enviar telemetria. | Alto | Bloquear por defecto; permitir solo lectura documental con aprobacion. |
| Acceso a archivos | Podria leer mas rutas de las necesarias. | Alto | Usar copia minima o fixture externo sin secretos. |
| Lectura de secretos | Podria escanear `.env`, tokens o credenciales. | Alto | Excluir secretos; usar datos sinteticos. |
| Modificacion del repo | Podria escribir reportes o configuracion. | Alto | No apuntar a GVO; salida fuera del repo. |
| Generacion de carpetas | Podria crear `skills/`, caches o metadatos. | Medio/alto | Prohibir dentro de GVO. |
| Hooks | Podria instalar pre-commit, hooks o automatizaciones. | Alto | Bloquear hooks en prueba inicial. |
| Dependencias | Podria requerir dependencias adicionales. | Medio/alto | No modificar `package.json`, lockfiles ni entorno GVO. |
| Falsos positivos | Podria producir recomendaciones no aplicables. | Medio | Clasificar hallazgos con revision humana. |
| Acoplamiento al flujo | Podria intentar reemplazar tickets o gates. | Medio/alto | Mantener como herramienta auxiliar externa. |

## 8. Criterios de aceptacion para evaluar SkillCheck fuera de GVO

Una prueba futura solo seria aceptable si cumple todo lo siguiente:

- ticket explicito aprobado;
- ejecucion fuera de GVO;
- carpeta externa a GVO;
- sin credenciales;
- sin `.env`;
- sin acceso a secretos;
- sin permisos amplios;
- sin escritura sobre GVO;
- sin hooks;
- sin MCP;
- sin integracion automatica;
- sin cambios en `package.json`;
- sin cambios en lockfiles;
- sin cambios runtime;
- salida auditable y versionable solo si es curada;
- comandos exactos aprobados antes de ejecutarse;
- posibilidad de borrar el sandbox sin afectar GVO;
- reporte final con comandos, rutas leidas, rutas escritas, hallazgos y decision humana.

## 9. Criterios de rechazo

SkillCheck debe rechazarse o mantenerse bloqueado si:

- requiere instalarse dentro de GVO;
- exige hooks no auditados;
- exige MCP o conectores con permisos amplios;
- requiere leer secretos;
- no permite excluir `.env`;
- no permite limitar rutas;
- escribe directamente sobre GVO;
- modifica runtime;
- modifica `package.json` o lockfiles;
- requiere red sin modo offline o sin justificacion;
- no tiene licencia clara;
- no tiene mantenedor identificable;
- no permite salida auditable;
- induce flujo de Pull Request;
- reemplaza el metodo de tickets, aprobacion humana o security gate.

## 10. Criterios de sandbox

Para una prueba posterior, el sandbox debe cumplir:

- carpeta externa a GVO;
- repo temporal fuera de GVO;
- sin credenciales;
- sin acceso a `.env`;
- sin permisos amplios;
- sin escritura sobre GVO;
- sin hooks;
- sin MCP;
- sin integracion automatica;
- sin dependencia runtime;
- sin tocar `src/**`, `public/**`, `assets/**` ni Atlas 006I;
- sin salida persistente dentro de GVO salvo reporte curado aprobado;
- con rutas de entrada y salida enumeradas;
- con limpieza final documentada.

## 11. Matriz de decision

| Decision posible | Estado preliminar | Condicion |
|---|---|---|
| Aprobar evaluacion externa | Parcialmente viable | Solo con ticket futuro, sandbox externo y comandos exactos aprobados. |
| Mantener pendiente | Recomendado ahora | Falta informacion sobre licencia, instalacion, red, permisos y escritura. |
| Rechazar | No recomendado todavia | No hay evidencia suficiente para rechazo definitivo. |
| Requerir investigacion adicional | Recomendado | Se necesita revisar fuente oficial sin descargar ni instalar. |

## 12. Matriz obligatoria de evaluacion

| Area | Pregunta de evaluacion | Riesgo | Evidencia requerida | Estado actual | Decision preliminar | Accion recomendada |
|---|---|---|---|---|---|---|
| Licencia | La licencia permite uso en OSW/GVO? | Legal/metodologico | Fuente oficial y licencia textual | No verificado | Pendiente | Investigar con red autorizada. |
| Mantenedor | Quien mantiene la herramienta? | Supply chain | Repositorio o pagina oficial | No verificado | Pendiente | Identificar mantenedor antes de probar. |
| Instalacion | Requiere instalacion local/global? | Contaminacion de entorno | Guia oficial de instalacion | No verificado | Bloquear dentro de GVO | Probar solo fuera de GVO si se aprueba. |
| Dependencias | Que paquetes instala o ejecuta? | Cambios de lockfile/red | Manifest o docs oficiales | No verificado | Pendiente | No tocar `package.json`. |
| Permisos de archivo | Que rutas lee y escribe? | Lectura/escritura fuera de alcance | Modo read-only o documentacion | No verificado | Pendiente | Usar fixture externo. |
| Red | Usa red para reglas, telemetria o descargas? | Exfiltracion/descarga | Documentacion y prueba con red controlada | No verificado | Bloquear por defecto | Pedir aprobacion antes de red. |
| Secretos | Puede leer `.env` o credenciales? | Exposicion sensible | Soporte de exclude/ignore | No verificado | Alto riesgo | Excluir secretos y usar datos sinteticos. |
| Hooks | Crea hooks o automatizaciones? | Mutacion oculta | Documentacion de instalacion | No verificado | Bloquear | No permitir hooks en prueba inicial. |
| MCP/conectores | Usa MCP o conectores? | Permisos amplios | Inventario de permisos | No verificado | Bloquear dentro de GVO | Requiere ticket propio si aplica. |
| Skills generadas | Crea o modifica skills? | Carpetas nuevas/acoplamiento | Salida esperada | No verificado | Bloquear dentro de GVO | No crear `skills/` en GVO. |
| Compatibilidad con Codex | Puede apoyar revision sin ejecutar cambios? | Automatizacion excesiva | Modo reporte externo | No verificado | Pendiente | Evaluar solo como reporte curado. |
| Compatibilidad con Claude Code | Requiere Claude Code o hooks? | Integracion no aprobada | Documentacion oficial | No verificado | Bloquear por defecto | No conectar Claude Code. |
| Uso fuera de GVO | Puede ejecutarse sobre copia o fixture? | Bajo si aislado | Prueba externa controlada | No verificado | Potencialmente viable | Preparar sandbox externo futuro. |
| Uso dentro de GVO | Puede ejecutarse en repo vivo? | Alto | No aplica | No autorizado | Rechazado por ahora | Mantener prohibido. |
| Rollback | Se puede deshacer todo? | Residuos locales | Lista de archivos generados | No verificado | Pendiente | Exigir salida a carpeta temporal externa. |
| Evidencia auditable | Entrega reporte claro? | Hallazgos no verificables | Formato de salida | No verificado | Pendiente | Exigir comandos, rutas y resultados. |

## 13. Plan de evaluacion posterior

Si el usuario decide avanzar, preparar un ticket separado:

```text
007P - Sandbox externo para prueba controlada de SkillCheck
```

Ese ticket deberia:

- autorizar o no uso de red de lectura documental;
- definir fuente oficial a revisar;
- definir carpeta externa de sandbox;
- prohibir instalacion dentro de GVO;
- usar fixture minimo sin secretos;
- registrar comandos exactos antes de ejecutarlos;
- producir reporte externo o documento curado;
- no tocar runtime ni repo GVO.

## 14. Evidencia que deberia entregar Codex en una prueba futura

Una prueba futura debe entregar:

- ticket ejecutado;
- rama y estado Git de GVO antes y despues;
- confirmacion de que GVO no fue modificado;
- ruta del sandbox externo;
- fuente oficial consultada;
- comandos aprobados;
- comandos ejecutados;
- uso de red, si lo hubo;
- rutas leidas;
- rutas escritas;
- archivos generados;
- hallazgos;
- falsos positivos;
- riesgos;
- decision humana;
- recomendacion de adopcion, rechazo o nueva prueba.

## 15. Comandos prohibidos

Quedan prohibidos para SkillCheck dentro de GVO:

- `npm install`;
- `npm update`;
- `npx`;
- `curl`;
- `wget`;
- `Invoke-WebRequest`;
- `irm`;
- `iwr`;
- `git clone`;
- `git submodule`;
- `git checkout`;
- `git switch`;
- `git reset`;
- `git clean`;
- `npm run build`;
- `npm run check`;
- `npm run format`;
- comandos que creen hooks;
- comandos que creen MCP;
- comandos que creen `skills/`, `.agents/`, `.codex/`, `.claude/`, `.cursor/` o `.mcp*`;
- comandos que escriban sobre GVO sin ticket explicito.

## 16. Comandos permitidos solo con aprobacion humana

En una fase posterior y fuera de GVO, podrian considerarse con aprobacion humana:

- lectura documental de fuente oficial;
- descarga en carpeta externa, si el usuario autoriza red;
- instalacion en sandbox externo, si el usuario autoriza;
- ejecucion sobre fixture externo sin secretos;
- generacion de reporte en carpeta temporal externa;
- copia manual de reporte curado a `docs/`, solo con ticket documental posterior.

## 17. Recomendacion final para GVO

Recomendacion:

```text
MANTENER_SKILLCHECK_PENDIENTE_DE_EVALUACION
```

SkillCheck no debe integrarse ni ejecutarse dentro de GVO por ahora. Puede considerarse una evaluacion externa futura si se aprueba un ticket de sandbox con red, comandos, rutas, permisos y rollback definidos.

Decision preliminar:

```text
NO_APROBAR_USO_DENTRO_DE_GVO
APROBAR_SOLO_INVESTIGACION_EXTERNA_FUTURA_SI_EL_USUARIO_LO_AUTORIZA
```

## 18. Siguiente ticket recomendado

Paso inmediato:

```text
007O-PUSH - Sincronizar evaluacion controlada de SkillCheck
```

Si despues del push se decide probar la herramienta:

```text
007P - Sandbox externo para prueba controlada de SkillCheck
```

## 19. Cierre metodologico

Esta evaluacion no instala SkillCheck, no lo ejecuta, no descarga nada, no usa red, no crea carpetas de agentes ni skills, no crea MCP y no modifica runtime. Su unico resultado es documentar condiciones de seguridad para decidir si una prueba externa futura tiene sentido.
