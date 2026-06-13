# 008E - Prueba controlada del baseline de seguridad

## 1. Proposito

Probar de forma controlada el baseline de seguridad documentado en 008D, sin modificar runtime, sin ejecutar herramientas contra el working tree real de GVO, sin instalar dependencias dentro de GVO, sin usar red y sin convertir todavia el baseline en gate obligatorio.

## 2. Alcance

La prueba se realizo con estrategia de sandbox externo. El working tree real de GVO se uso solo para inspeccion local permitida, creacion del reporte documental y verificacion de estado Git.

No se ejecuto:

- `pre-commit run --all-files` contra GVO real.
- `python -m pre_commit run --all-files` contra GVO real.
- `gitleaks detect --source .` contra GVO real.
- `scripts/run_security_checks.ps1`.
- `npm audit`.
- `npm install`.
- `npm update`.
- `npx`.
- `pip install`.
- `npm run build`.
- `npm run check`.
- `npm run format`.

## 3. Estado Git inicial

```text
## main...origin/main
```

HEAD inicial:

```text
00bbb28 docs: validate security baseline 008D
```

## 4. Estrategia usada

Estrategia elegida:

```text
sandbox externo por snapshot git archive de HEAD
```

Motivo: evita correr herramientas sobre el working tree real y evita crear un `git worktree` que modifique metadata interna `.git/worktrees` del repositorio principal.

El sandbox se creo desde `HEAD` mediante `git archive`, se expandio fuera de GVO y el archivo `.zip` temporal externo fue eliminado despues de extraerlo.

## 5. Rutas usadas

| Uso | Ruta |
|---|---|
| Sandbox base | `C:\Users\JOSE DAVID\Documents\OKUA_SANDBOX\security_baseline_008E` |
| Snapshot externo | `C:\Users\JOSE DAVID\Documents\OKUA_SANDBOX\security_baseline_008E\worktree` |
| Cache pre-commit externa | `C:\Users\JOSE DAVID\Documents\OKUA_SANDBOX\security_baseline_008E\.pre-commit-cache` |
| Cache npm externa | `C:\Users\JOSE DAVID\Documents\OKUA_SANDBOX\security_baseline_008E\.npm-cache` |
| Logs externos | `C:\Users\JOSE DAVID\Documents\OKUA_SANDBOX\security_baseline_008E\logs` |
| Reports externos | `C:\Users\JOSE DAVID\Documents\OKUA_SANDBOX\security_baseline_008E\reports` |
| Reporte GVO permitido | `docs/status/008E_PRUEBA_CONTROLADA_BASELINE_SEGURIDAD.md` |

El snapshot externo contiene 721 archivos y no contiene `node_modules`.

## 6. Herramientas detectadas localmente

| Herramienta | Estado | Evidencia | Decision |
|---|---|---|---|
| Python | Disponible | `Python 3.11.0`; comando `python.exe` en `C:\Users\JOSE DAVID\AppData\Local\Programs\Python\Python311\python.exe` | Solo version/availability check. |
| npm | Disponible | `10.9.2`; comando `npm.ps1` en `C:\Program Files\nodejs\npm.ps1` | Solo version check en sandbox. |

## 7. Herramientas faltantes

| Herramienta | Estado | Evidencia | Impacto |
|---|---|---|---|
| pre-commit | No disponible como comando | `Get-Command pre-commit` no devolvio comando | Bloquea `pre-commit run --all-files`. |
| pre_commit Python module | No disponible | `python -m pre_commit --version` devolvio `No module named pre_commit` | Bloquea el modo usado por `scripts/run_security_checks.ps1`. |
| gitleaks | No disponible como comando | `Get-Command gitleaks` no devolvio comando | Bloquea `gitleaks detect`. |
| node_modules en sandbox | No disponible | `Test-Path node_modules` en sandbox: `False` | Bloquea `npm run lint` y `npm run test` sin instalar dependencias. |

## 8. Comandos ejecutados

### Inspeccion en GVO real

- `git status --short --branch`
- `git log --oneline -n 8`
- `Get-Content -Raw .pre-commit-config.yaml`
- `Get-Content -Raw requirements-security.txt`
- `Get-Content -Raw scripts\run_security_checks.ps1`
- `Get-Content -Raw package.json`
- `Get-Content -Raw eslint.config.js`
- `Get-Content -Raw docs\status\008D_VALIDACION_BASELINE_SEGURIDAD.md`
- `Get-Command python -ErrorAction SilentlyContinue`
- `Get-Command pre-commit -ErrorAction SilentlyContinue`
- `Get-Command gitleaks -ErrorAction SilentlyContinue`
- `Get-Command npm -ErrorAction SilentlyContinue`
- `Test-Path node_modules`
- `Test-Path package-lock.json`
- `Test-Path .pre-commit-cache`
- `Test-Path .npm-cache`
- `python --version`
- `npm --version`
- `python -m pre_commit --version`

### Sandbox externo

- `New-Item -ItemType Directory -Force` para crear el sandbox externo.
- `git archive --format=zip --output ... HEAD`
- `Expand-Archive` del snapshot externo.
- `Remove-Item` del zip temporal externo.
- Configuracion de variables externas:
  - `PRE_COMMIT_HOME=C:\Users\JOSE DAVID\Documents\OKUA_SANDBOX\security_baseline_008E\.pre-commit-cache`
  - `npm_config_cache=C:\Users\JOSE DAVID\Documents\OKUA_SANDBOX\security_baseline_008E\.npm-cache`
- `python --version` dentro del flujo de disponibilidad.
- `python -m pre_commit --version` dentro del flujo de disponibilidad.
- `npm --version` dentro del sandbox.
- `Test-Path node_modules` dentro del sandbox.
- Conteo de caches externas.
- Conteo de archivos del snapshot.

## 9. Comandos bloqueados

| Comando | Motivo |
|---|---|
| `pre-commit run --all-files` | `pre-commit` no esta disponible como comando y el modulo Python `pre_commit` tampoco esta instalado. Ejecutarlo requeriria instalacion o descarga de hooks. |
| `python -m pre_commit run --all-files` | El modulo Python `pre_commit` no esta instalado. |
| `gitleaks detect --source . --redact --verbose` | `gitleaks` no esta disponible localmente. |
| `npm audit` | Prohibido por ticket y usa red por defecto. |
| `scripts/run_security_checks.ps1` | Prohibido por ticket; mezcla pre-commit, gitleaks, npm audit, lint y test. |
| `npm run lint` | El sandbox no contiene `node_modules`; ejecutarlo sin dependencias disponibles no cumple la regla de prueba controlada. |
| `npm run test` | El sandbox no contiene `node_modules`; ejecutarlo sin dependencias disponibles no cumple la regla de prueba controlada. |
| `npm install`, `npm update`, `npx`, `pip install`, `python -m pip install` | Prohibidos por ticket. |
| `npm run build`, `npm run check`, `npm run format` | Prohibidos por ticket. |

## 10. Uso de red

```text
NO_SE_USO_RED
```

No se ejecuto ningun comando que requiriera red. Al detectarse que `pre-commit`, `pre_commit` y `gitleaks` no estaban disponibles, la prueba se detuvo antes de cualquier descarga o instalacion.

## 11. Instalacion de dependencias

```text
NO_SE_INSTALARON_DEPENDENCIAS
```

No se ejecuto `pip install`, `python -m pip install`, `npm install`, `npm update` ni `npx`.

## 12. Caches y artefactos generados

Artefactos generados fuera de GVO:

- `C:\Users\JOSE DAVID\Documents\OKUA_SANDBOX\security_baseline_008E\worktree`
- `C:\Users\JOSE DAVID\Documents\OKUA_SANDBOX\security_baseline_008E\.pre-commit-cache`
- `C:\Users\JOSE DAVID\Documents\OKUA_SANDBOX\security_baseline_008E\.npm-cache`
- `C:\Users\JOSE DAVID\Documents\OKUA_SANDBOX\security_baseline_008E\logs`
- `C:\Users\JOSE DAVID\Documents\OKUA_SANDBOX\security_baseline_008E\reports`

Conteos observados:

| Artefacto | Resultado |
|---|---|
| Snapshot externo `worktree` | 721 archivos |
| `.pre-commit-cache` externa | 0 items |
| `.npm-cache` externa | 0 items |
| `logs` externa | directorio creado |
| `reports` externa | directorio creado |

El working tree real de GVO ya tenia `.pre-commit-cache/` y `.npm-cache/` al inicio, pero este ticket no las uso ni las modifico.

## 13. Resultado de pre-commit

```text
NO_EJECUTADO
```

Motivo:

- `pre-commit` no esta disponible como comando.
- `python -m pre_commit --version` falla con `No module named pre_commit`.
- Ejecutarlo requeriria instalacion o descarga de herramientas/hooks.

Decision:

```text
BLOQUEADO_COMO_GATE_COMPLETO
```

## 14. Resultado de gitleaks

```text
NO_EJECUTADO
```

Motivo:

- `gitleaks` no esta disponible como comando local.

Decision:

```text
BLOQUEADO_HASTA_TENER_BINARIO_LOCAL_CONTROLADO
```

## 15. Resultado de npm run lint

```text
NO_EJECUTADO
```

Motivo:

- El sandbox externo no contiene `node_modules`.
- Ejecutar lint sin dependencias disponibles no prueba el baseline de forma util y podria inducir un fallo esperado por entorno, no por codigo.
- Instalar dependencias esta prohibido.

Decision:

```text
BLOQUEADO_HASTA_SANDBOX_CON_DEPENDENCIAS_PREEXISTENTES_O_TICKET_DE_PREPARACION
```

## 16. Resultado de npm run test

```text
NO_EJECUTADO
```

Motivo:

- El sandbox externo no contiene `node_modules`.
- Instalar dependencias esta prohibido.

Decision:

```text
BLOQUEADO_HASTA_SANDBOX_CON_DEPENDENCIAS_PREEXISTENTES_O_TICKET_DE_PREPARACION
```

## 17. Resultado de npm audit

```text
NO_EJECUTADO
```

Motivo:

- Prohibido por el ticket.
- Usa red por defecto.

Decision:

```text
BLOQUEADO_POR_RED_REQUERIDA
```

## 18. Impacto sobre el working tree real de GVO

Antes de crear este reporte, el working tree real de GVO permanecio limpio:

```text
## main...origin/main
```

No se ejecutaron herramientas de seguridad sobre GVO real. No se modifico runtime, `src/**`, `public/**`, `assets/**`, Atlas 006I, `package.json`, `package-lock.json`, `.gitignore`, `.pre-commit-config.yaml`, `requirements-security.txt` ni `scripts/run_security_checks.ps1`.

El unico cambio permitido dentro de GVO es este reporte documental:

```text
docs/status/008E_PRUEBA_CONTROLADA_BASELINE_SEGURIDAD.md
```

## 19. Matriz obligatoria - Prueba baseline

| Elemento | Comando / archivo | Ejecutado | Resultado | Artefactos generados | Riesgo | Decision |
|---|---|---|---|---|---|---|
| pre-commit | `pre-commit run --all-files` / `.pre-commit-config.yaml` | No | Comando no disponible; modulo Python `pre_commit` no instalado | Cache externa vacia | Alto: requeriria instalacion o descarga de hooks | BLOQUEADO_COMO_GATE_COMPLETO |
| gitleaks | `gitleaks detect --source . --redact --verbose` | No | Binario no disponible localmente | Ninguno | Alto: herramienta externa no controlada | BLOQUEADO_HASTA_BINARIO_LOCAL_CONTROLADO |
| npm audit | `npm audit` | No | Prohibido; red por defecto | Ninguno | Alto por red | BLOQUEADO_POR_RED_REQUERIDA |
| npm run lint | `npm run lint` | No | `node_modules` ausente en sandbox | Ninguno | Medio: requiere dependencias preexistentes o setup controlado | BLOQUEADO_HASTA_SANDBOX_PREPARADO |
| npm run test | `npm run test` | No | `node_modules` ausente en sandbox | Ninguno | Medio: requiere dependencias preexistentes o setup controlado | BLOQUEADO_HASTA_SANDBOX_PREPARADO |
| scripts/run_security_checks.ps1 | `scripts/run_security_checks.ps1` | No | Prohibido; mezcla comandos bloqueados | Ninguno | Alto: ejecuta audit, pre-commit, gitleaks, lint y test | NO_EJECUTAR_COMO_GATE_AUN |
| .pre-commit-cache | `PRE_COMMIT_HOME` externo | Parcial | Directorio externo creado; 0 items | `.pre-commit-cache/` fuera de GVO | Bajo mientras siga externo | PERMITIDO_SOLO_FUERA_DE_GVO |
| .npm-cache | `npm_config_cache` externo | Parcial | Directorio externo creado; 0 items | `.npm-cache/` fuera de GVO | Bajo mientras siga externo | PERMITIDO_SOLO_FUERA_DE_GVO |
| working tree real GVO | `git status --short --branch` | Si | Limpio antes de reporte; no se ejecutaron herramientas sobre GVO real | Solo reporte documental permitido | Bajo | PROTEGIDO |
| sandbox externo | `git archive` + `Expand-Archive` | Si | Snapshot externo creado con 721 archivos; sin `node_modules` | `worktree/`, caches vacias, `logs/`, `reports/` | Bajo-medio: ocupa disco externo | VALIDO_PARA_PRUEBAS_SIN_RED |

## 20. Matriz obligatoria - Decision de continuidad

| Opcion | Descripcion | Ventaja | Riesgo | Recomendacion | Ticket siguiente |
|---|---|---|---|---|---|
| 008E-PUSH - Sincronizar prueba controlada del baseline | Publicar el reporte 008E despues de aprobacion y commit local. | Deja evidencia de bloqueo real antes de avanzar. | Bajo; solo push documental posterior. | Recomendado como paso inmediato tras aprobar 008E. | 008E-PUSH |
| 008F - Preparar flujo hacia Mundo II | Retomar desarrollo funcional despues de Mundo I. | Avanza producto. | Prematuro si se exige security gate completo antes de desarrollo. | Viable solo si se acepta que el baseline queda documental/parcial, no gate completo. | 008F |
| 008G - Resolver deuda visual residual de Mundo I | Atender deuda visual residual documentada en 008B/008C. | Mejora calidad visual antes de Mundo II. | Puede retrasar roadmap si no es bloqueo visible para el usuario. | Mantener como alternativa si el ojo humano prioriza calidad visual. | 008G |
| 008H - Formalizar baseline como gate parcial | Definir un gate parcial sin red ni herramientas faltantes, o mantener baseline documental. | Convierte evidencia 008E en politica operativa segura. | Requiere decidir si se prepara entorno externo o se limita a checks disponibles. | Recomendado si el baseline debe gobernar tickets proximos. | 008H |

## 21. Riesgos detectados

1. El baseline completo no puede operar hoy sin preparar herramientas externas.
2. `pre-commit` no esta disponible como comando ni como modulo Python.
3. `gitleaks` no esta disponible localmente.
4. `npm audit` requiere red y sigue bloqueado.
5. El sandbox por snapshot no contiene `node_modules`, por lo que `lint` y `test` no deben ejecutarse sin instalacion.
6. `scripts/run_security_checks.ps1` sigue siendo demasiado amplio para gate automatico porque mezcla audit, hooks, gitleaks, lint y test.
7. El baseline historico ya habia tocado runtime; futuros cambios de seguridad deben mantenerse separados de runtime.
8. En GVO real existen `.pre-commit-cache/` y `.npm-cache/` desde antes de 008E; este ticket no las uso, pero conviene mantenerlas ignoradas y fuera del flujo documental.

## 22. Recomendacion principal

Decision recomendada:

```text
BLOQUEAR_BASELINE_COMO_GATE
```

Justificacion: el baseline no puede ejecutarse de forma completa, reproducible y sin red en el entorno actual. Debe mantenerse como baseline documental/parcial hasta decidir una estrategia de herramientas externas controladas.

Siguiente paso inmediato recomendado tras aprobar 008E:

```text
008E-PUSH - Sincronizar prueba controlada del baseline
```

Siguiente decision tecnica recomendada:

```text
008H - Formalizar baseline como gate parcial o mantenerlo documental
```

## 23. Confirmaciones de cumplimiento

- No se modifico runtime.
- No se modifico `src/**`.
- No se modifico `public/**`.
- No se modifico `assets/**`.
- No se modifico Atlas 006I.
- No se modifico `package.json`.
- No se modifico `package-lock.json`.
- No se modifico `.gitignore`.
- No se modifico `.pre-commit-config.yaml`.
- No se modifico `requirements-security.txt`.
- No se modifico `scripts/run_security_checks.ps1`.
- No se instalaron dependencias.
- No se uso red.
- No se ejecuto `npm audit`.
- No se ejecuto `pre-commit run --all-files`.
- No se ejecuto `python -m pre_commit run --all-files`.
- No se ejecuto `gitleaks detect`.
- No se ejecuto `scripts/run_security_checks.ps1`.
- No se ejecutaron scripts npm.
- No se ejecuto Graphify.
- No se ejecuto SkillCheck.
- No se ejecuto Claude Code, Spec-kit, Gstack, Claude Council ni MCP.
- No se crearon carpetas `.agents`, `.codex`, `.claude`, `.cursor`, `skills` ni `.mcp*` dentro de GVO.
- No se crearon hooks.
- No se creo configuracion MCP.
- No se hizo push.
- No se creo rama.
- No se creo Pull Request.
- PR_NO_APLICA.
- No se ejecuto `okua-delivery-md`.

## 24. Estado de cierre propuesto

```text
BLOQUEAR_BASELINE_COMO_GATE
```

El ticket 008E puede aprobarse como evidencia documental de prueba controlada, pero el baseline no debe quedar aprobado como gate obligatorio.
