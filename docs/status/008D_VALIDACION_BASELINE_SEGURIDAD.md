# 008D - Validacion de baseline de seguridad

## 1. Identificacion

| Campo | Valor |
|---|---|
| Ticket | 008D - Validacion de baseline de seguridad introducido en e669a28/cbc0d8b |
| Tipo | SEGURIDAD_CONTROLADA_SOLO_LECTURA_CON_REPORTE |
| Fecha de ejecucion | 2026-06-13 |
| Rama inicial | main |
| Estado Git inicial | `## main...origin/main` |
| Archivo creado | `docs/status/008D_VALIDACION_BASELINE_SEGURIDAD.md` |
| Estado del reporte | PRE-CIERRE_DOCUMENTAL |
| PR | PR_NO_APLICA |

## 2. Resumen ejecutivo

Se reviso el baseline de seguridad integrado en los commits:

```text
e669a28 chore: add OKUA frontend security baseline
cbc0d8b merge: integrate OKUA frontend security baseline
```

El baseline agrega una configuracion de `pre-commit`, una dependencia Python declarativa para `pre-commit`, un script PowerShell de validaciones de seguridad y exclusiones en ESLint para caches/reportes locales. Tambien se observo que el commit `e669a28` toco un archivo runtime (`src/shared/assets/useAssetPreloader.ts`) y varios documentos/metricas historicas.

La conclusion principal es que el baseline no debe ejecutarse todavia como gate obligatorio de tickets comunes. Requiere una prueba controlada especifica porque puede:

- necesitar dependencias Python y binarios externos previamente instalados;
- usar red o caches si las herramientas no estan disponibles localmente;
- crear artefactos locales como `.pre-commit-cache/` y `.npm-cache/`;
- ejecutar hooks que pueden reescribir archivos;
- escanear todo el repositorio en busca de secretos;
- ejecutar `npm audit`, que usa red por defecto.

Recomendacion:

```text
APROBADA_CERRAR_Y_PREPARAR_008D_PUSH
```

Despues del push documental de 008D, preparar:

```text
008E - Prueba controlada del baseline de seguridad sin modificar runtime
```

## 3. Alcance

Esta validacion fue documental y de inspeccion local. No se ejecuto el baseline de seguridad, no se ejecuto `pre-commit`, no se ejecuto `gitleaks`, no se ejecuto `npm audit`, no se ejecuto `scripts/run_security_checks.ps1` y no se instalaron dependencias.

El objetivo fue entender el impacto operativo antes de permitir que el baseline forme parte de un flujo normal de cierre, build, pre-push o desarrollo.

## 4. Estado Git inicial

```text
## main...origin/main
```

HEAD observado al iniciar:

```text
fad7cd4 feat: connect Mundo I exit flow 008C
```

## 5. Commits revisados

| Commit | Mensaje | Estado observado |
|---|---|---|
| `e669a28` | `chore: add OKUA frontend security baseline` | Introduce baseline de seguridad con archivos de tooling, script, exclusiones y cambios colaterales. |
| `cbc0d8b` | `merge: integrate OKUA frontend security baseline` | Integra el baseline en `main` mediante merge. |

Resumen de impacto observado entre `e669a28^..cbc0d8b`:

```text
27 files changed, 149 insertions(+), 22 deletions(-)
```

Archivos principales del baseline:

- `.pre-commit-config.yaml`
- `requirements-security.txt`
- `scripts/run_security_checks.ps1`
- `eslint.config.js`
- `src/shared/assets/useAssetPreloader.ts`
- `package.json`
- `package-lock.json`
- `docs/security/**`

## 6. Archivos revisados

Archivos de baseline y seguridad revisados:

- `.pre-commit-config.yaml`
- `requirements-security.txt`
- `scripts/run_security_checks.ps1`
- `eslint.config.js`
- `package.json`
- `package-lock.json`
- `src/shared/assets/useAssetPreloader.ts`
- `docs/security/SECURITY_GATE_COMANDOS_SCRIPTS_PERMISOS.md`
- `docs/security/MATRIZ_COMANDOS_POR_TIPO_DE_TICKET.md`
- `docs/security/POLITICA_HERRAMIENTAS_EXTERNAS_Y_AGENTES.md`
- `docs/security/PROTOCOLO_SECRETOS_Y_CREDENCIALES.md`
- `docs/security/POLITICA_PERMISOS_SENSIBLES_QR_CAMARA.md`

Documentacion de continuidad revisada:

- `docs/status/008A_REVISION_ESTADO_FUNCIONAL_POST_GOBERNANZA.md`
- `docs/status/008B_AUDITORIA_VISUAL_RUNTIME_MUNDO_I.md`
- `docs/status/008C_RETORNO_DESARROLLO_SALIDA_MUNDO_I.md`

Archivos o rutas esperadas que se confirmaron por existencia:

- `.pre-commit-config.yaml`
- `requirements-security.txt`
- `scripts/run_security_checks.ps1`

El reporte `docs/status/008D_VALIDACION_BASELINE_SEGURIDAD.md` no existia antes de este ticket.

## 7. Baseline observado

### 7.1 `.pre-commit-config.yaml`

La configuracion declara repositorios remotos:

- `https://github.com/pre-commit/pre-commit-hooks`
- `https://github.com/gitleaks/gitleaks`

Hooks declarados:

- `trailing-whitespace`
- `end-of-file-fixer`
- `check-yaml`
- `check-json`
- `check-toml`
- `check-added-large-files`
- `detect-private-key`
- `gitleaks`

Riesgo principal: los hooks `trailing-whitespace` y `end-of-file-fixer` pueden modificar archivos. Ademas, si los hooks no estan cacheados, `pre-commit` puede requerir red para descargar repositorios de hooks.

### 7.2 `requirements-security.txt`

Contenido observado:

```text
pre-commit
```

Riesgo principal: la dependencia no esta versionada con pin exacto y requeriria instalacion Python para usarse en un entorno nuevo. Instalarla no esta permitido en tickets normales sin autorizacion explicita.

### 7.3 `scripts/run_security_checks.ps1`

El script ejecuta:

- `python -m pre_commit run --all-files`
- `gitleaks detect --source . --redact --verbose`
- `npm audit` si existe `package.json`
- `npm run lint` si existe el script
- `npm run typecheck` si existe el script
- `npm run test` si existe el script

Tambien configura caches locales:

- `.pre-commit-cache`
- `.npm-cache`

Riesgos principales:

- puede crear directorios de cache;
- puede ejecutar herramientas no instaladas;
- puede usar red mediante `npm audit` o descarga de hooks;
- puede modificar archivos por hooks de formato;
- puede leer una superficie amplia del repositorio;
- depende de `gitleaks` como binario externo disponible.

### 7.4 `eslint.config.js`

Se observaron exclusiones para:

- `.venv`
- `.pre-commit-cache`
- `.npm-cache`
- `.tool-reports`
- `.security-reports`

Impacto observado: positivo para evitar que caches locales contaminen lint. No ejecuta herramientas por si mismo.

### 7.5 `src/shared/assets/useAssetPreloader.ts`

El baseline historico toco este archivo runtime. En la revision actual el archivo se mantiene como hook de precarga de assets y no fue modificado en 008D.

Riesgo principal: cualquier baseline de seguridad que toque runtime debe tratarse como cambio mixto y revisarse con validacion funcional. Para 008D no se aplicaron cambios runtime.

### 7.6 `package.json` y `package-lock.json`

`package.json` contiene scripts de desarrollo, pruebas, lint, formato, estado y auditoria de assets. El script `run_security_checks.ps1` no aparece integrado como script npm obligatorio.

`package-lock.json` existe, usa lockfile version 3 y contiene 601 entradas de paquetes segun lectura estructurada con `ConvertFrom-Json -AsHashtable`.

Observacion tecnica: la lectura con `ConvertFrom-Json` sin `-AsHashtable` fallo por una propiedad de nombre vacio en el JSON. La lectura con `-AsHashtable` si permitio inspeccionar metadatos. No se modifico el lockfile.

### 7.7 `docs/security/**`

La documentacion vigente de seguridad y herramientas externas ya marca restricciones compatibles con esta validacion:

- `npm audit`, `npx`, instalaciones y comandos con red quedan bloqueados salvo ticket explicito;
- `okua-delivery-md` es herramienta externa, no dependencia runtime de GVO;
- Graphify y SkillCheck no deben integrarse ni ejecutarse dentro de GVO sin ticket especifico;
- PR_NO_APLICA para este proyecto;
- comandos de push solo aplican en tickets de sincronizacion aprobados.

## 8. Matriz de baseline

| Elemento | Archivo | Estado observado | Riesgo | Puede ejecutarse ahora | Requiere aprobacion | Accion recomendada |
|---|---|---|---|---|---|---|
| Configuracion pre-commit | `.pre-commit-config.yaml` | Define hooks remotos de `pre-commit-hooks` y `gitleaks`. Incluye hooks que pueden modificar archivos. | Alto en tickets solo lectura; medio en ticket controlado. | No en tickets normales. Solo en piloto controlado. | Si | Probar en 008E con caches controlados, sin modificar runtime y con rollback/limpieza documentada. |
| Dependencia Python | `requirements-security.txt` | Declara `pre-commit` sin pin exacto. | Medio por instalacion y version flotante. | No, requiere instalacion si no existe. | Si | Evaluar pin de version y entorno externo antes de convertirlo en gate. |
| Script de baseline | `scripts/run_security_checks.ps1` | Ejecuta pre-commit, gitleaks, npm audit, lint y test; crea/usa caches locales. | Alto por red, caches, lectura amplia y posible escritura de hooks. | No. | Si | No usar como gate hasta completar 008E. |
| ESLint ignores | `eslint.config.js` | Excluye caches y reportes locales. | Bajo. | Si, solo afecta lint cuando lint se ejecute por ticket. | Segun ticket | Mantener; valida que caches no contaminen lint. |
| Runtime asset preloader | `src/shared/assets/useAssetPreloader.ts` | Fue tocado por el baseline historico; no se modifico en 008D. | Medio por mezcla de seguridad con runtime. | No aplica como herramienta. | Si hay cambio runtime | Evitar mezclar security baseline con runtime en futuros commits. |
| Scripts npm | `package.json` | Tiene `lint`, `test`, `check`, `status`, `audit:assets`, entre otros. No integra `run_security_checks.ps1` como obligatorio. | Medio si el script de seguridad dispara npm audit/test sin ticket. | Solo comandos autorizados por ticket. | Si para audit/build/check/format | Mantener matriz de comandos vigente. |
| Lockfile npm | `package-lock.json` | Existe, lockfile version 3, 601 entradas de paquetes. No fue modificado en 008D. | Medio por superficie de dependencias; bajo para esta inspeccion. | No aplica. | Si se audita o actualiza | No modificar; revisar en ticket de dependencias si se autoriza. |
| Politicas de seguridad | `docs/security/**` | Documentan comandos bloqueados, herramientas externas y PR_NO_APLICA. | Bajo si se respetan; alto si se ignoran. | Si, como lectura/documentacion. | No para lectura | Usarlas como fuente normativa para 008E. |

## 9. Evaluacion de riesgos

### Seguridad

- `gitleaks detect` escanea el repositorio y podria recorrer archivos amplios. Usa `--redact`, lo cual reduce exposicion, pero no elimina el riesgo operativo de leer secretos si existen.
- `detect-private-key` es util, pero su ejecucion dentro de `pre-commit` depende de hooks remotos/caches.
- El script mezcla revision de secretos, auditoria npm, lint y test en una sola ejecucion, lo que aumenta el radio de impacto.

### Red

- `pre-commit` puede descargar hooks si no estan en cache.
- `npm audit` usa red por defecto.
- `pip install -r requirements-security.txt` seria necesario en entornos sin `pre-commit`, pero no esta autorizado en tickets comunes.

### Escritura de archivos

- `trailing-whitespace` y `end-of-file-fixer` pueden modificar archivos.
- `.pre-commit-cache/` y `.npm-cache/` pueden crearse localmente.
- La ejecucion del script completo no es compatible con modo solo lectura estricto.

### Runtime

- El baseline historico toco `src/shared/assets/useAssetPreloader.ts`. Aunque el cambio ya esta integrado, esto confirma que el baseline no fue puramente documental/tooling.
- En tickets futuros, cambios de seguridad y runtime deben separarse.

### Dependencias

- `requirements-security.txt` no fija version de `pre-commit`.
- `gitleaks` se invoca como binario externo, pero no se define instalacion controlada dentro de GVO.
- `package-lock.json` no se modifica en 008D y no debe actualizarse dentro de una validacion documental.

## 10. Compatibilidad con reglas vigentes

| Regla vigente | Compatibilidad observada |
|---|---|
| No ejecutar red sin autorizacion | El baseline completo no es compatible si incluye `npm audit` o descarga de hooks. |
| No modificar runtime sin ticket | El baseline historico toco runtime; no se debe repetir ese patron. |
| No instalar dependencias sin ticket | `requirements-security.txt` requiere instalacion si falta `pre-commit`. |
| No ejecutar herramientas externas dentro de GVO sin ticket | `gitleaks` y `pre-commit` requieren ticket controlado. |
| No PR | Compatible; el flujo sigue `PR_NO_APLICA`. |
| okua-delivery-md externo | Compatible; no se integra al repo. |

## 11. Validaciones ejecutadas

| Comando / validacion | Resultado | Estado |
|---|---|---|
| `git status --short --branch` | `## main...origin/main` | PASA |
| `git log --oneline -n 8` | HEAD inicial `fad7cd4 feat: connect Mundo I exit flow 008C` | PASA |
| `git show --stat --oneline --summary e669a28` | Baseline identificado: 27 archivos, 149 inserciones, 22 eliminaciones | PASA |
| `git show --stat --oneline --summary cbc0d8b` | Merge del baseline identificado | PASA |
| `git show --name-status e669a28` | Archivos del baseline listados | PASA |
| `git show --name-status cbc0d8b` | Archivos integrados por merge listados | PASA |
| `git diff --name-status e669a28^..cbc0d8b` | Lista de archivos del baseline confirmada | PASA |
| `git diff --stat e669a28^..cbc0d8b` | `27 files changed, 149 insertions(+), 22 deletions(-)` | PASA |
| `Get-Content -Raw .pre-commit-config.yaml` | Lectura realizada | PASA |
| `Get-Content -Raw requirements-security.txt` | Lectura realizada | PASA |
| `Get-Content -Raw scripts\run_security_checks.ps1` | Lectura realizada | PASA |
| `Get-Content -Raw eslint.config.js` | Lectura realizada | PASA |
| `Get-Content -Raw package.json` | Lectura realizada | PASA |
| `Get-Content -Raw src\shared\assets\useAssetPreloader.ts` | Lectura realizada | PASA |
| `Get-Content -Raw docs\security\SECURITY_GATE_COMANDOS_SCRIPTS_PERMISOS.md` | Lectura realizada | PASA |
| `Get-Content -Raw docs\security\MATRIZ_COMANDOS_POR_TIPO_DE_TICKET.md` | Lectura realizada | PASA |
| `Get-Content -Raw docs\security\POLITICA_HERRAMIENTAS_EXTERNAS_Y_AGENTES.md` | Lectura realizada | PASA |
| `Get-Content -Raw docs\security\PROTOCOLO_SECRETOS_Y_CREDENCIALES.md` | Lectura realizada | PASA |
| `Get-Content -Raw docs\security\POLITICA_PERMISOS_SENSIBLES_QR_CAMARA.md` | Lectura realizada | PASA |
| `Get-Content -Raw docs\status\008A_REVISION_ESTADO_FUNCIONAL_POST_GOBERNANZA.md` | Lectura realizada | PASA |
| `Get-Content -Raw docs\status\008B_AUDITORIA_VISUAL_RUNTIME_MUNDO_I.md` | Lectura realizada | PASA |
| `Get-Content -Raw docs\status\008C_SALIDA_MUNDO_I.md` | No existe con ese nombre | FALLA_CONTROLADA |
| `rg --files docs/status | rg "008C|MUNDO_I|SALIDA"` | Ruta real detectada: `docs/status/008C_RETORNO_DESARROLLO_SALIDA_MUNDO_I.md` | PASA |
| `Get-Content -Raw docs\status\008C_RETORNO_DESARROLLO_SALIDA_MUNDO_I.md` | Lectura realizada | PASA |
| `Get-Content -Raw package-lock.json \| ConvertFrom-Json` | Falla por propiedad de nombre vacio | FALLA_CONTROLADA |
| `Get-Content -Raw package-lock.json \| ConvertFrom-Json -AsHashtable` | Lockfile version 3, 601 entradas | PASA |
| `Test-Path .pre-commit-config.yaml` | `True` | PASA |
| `Test-Path requirements-security.txt` | `True` | PASA |
| `Test-Path scripts\run_security_checks.ps1` | `True` | PASA |
| `Test-Path docs\status\008D_VALIDACION_BASELINE_SEGURIDAD.md` | `False` antes de crear el reporte | PASA |

## 12. Validaciones no ejecutadas

| Comando / herramienta | Motivo | Estado |
|---|---|---|
| `pre-commit run --all-files` | Prohibido por el ticket; puede descargar hooks y modificar archivos. | NO_EJECUTADA |
| `python -m pre_commit run --all-files` | Prohibido por el ticket; requiere dependencia Python disponible. | NO_EJECUTADA |
| `gitleaks detect` | Prohibido por el ticket; herramienta externa y escaneo amplio. | NO_EJECUTADA |
| `scripts/run_security_checks.ps1` | Prohibido por el ticket; ejecuta pre-commit, gitleaks, npm audit, lint y test. | NO_EJECUTADA |
| `npm audit` | Prohibido por el ticket; usa red. | NO_EJECUTADA |
| `npm run build` | Prohibido por el ticket. | NO_EJECUTADA |
| `npm run check` | Prohibido por el ticket. | NO_EJECUTADA |
| `npm run format` | Prohibido por el ticket. | NO_EJECUTADA |
| `npm install`, `npm update`, `npx`, `pip install` | Prohibidos por el ticket. | NO_EJECUTADA |

## 13. Matriz de continuidad

| Opcion | Descripcion | Ventaja | Riesgo | Recomendacion | Ticket siguiente |
|---|---|---|---|---|---|
| 008D-PUSH - Sincronizar validacion documental del baseline | Subir el reporte documental 008D despues de aprobacion y commit local. | Deja trazabilidad cerrada antes del piloto. | Bajo; solo sincroniza documentacion ya aprobada. | Recomendada inmediatamente despues de aprobar 008D y crear commit. | 008D-PUSH |
| 008E - Prueba controlada del baseline de seguridad sin modificar runtime | Ejecutar o simular el baseline bajo reglas explicitas, con control de caches, red, herramientas y efectos. | Permite saber si el baseline puede operar sin romper flujo ni escribir archivos no autorizados. | Medio-alto si no se aisla: puede usar red, crear caches o modificar archivos. | Recomendada antes de convertir el baseline en gate operativo. | 008E |
| 008F - Preparar flujo hacia Mundo II | Retomar roadmap funcional despues de salida de Mundo I. | Avanza producto. | Prematuro si el gate de seguridad no esta entendido o si quedan deudas visuales. | Posponer hasta cerrar 008E o decision humana equivalente. | 008F |
| 008G - Resolver deuda visual residual de Mundo I | Atender la cola/franja visual residual documentada en 008B/008C si el usuario la sigue observando. | Mejora calidad visual antes de Mundo II. | Puede distraer del baseline si no es bloqueo visual actual. | Mantener como opcion si la revision humana prioriza calidad visual. | 008G |

## 14. Decisiones recomendadas

1. No ejecutar `scripts/run_security_checks.ps1` en tickets normales todavia.
2. No tratar `pre-commit` como gate obligatorio hasta realizar 008E.
3. No instalar `pre-commit` ni `gitleaks` dentro de GVO sin ticket externo/controlado.
4. No permitir `npm audit` dentro de tickets sin red autorizada.
5. Separar futuros cambios de seguridad de cualquier cambio runtime.
6. Mantener `okua-delivery-md` como herramienta externa y solo despues de aprobacion humana.
7. Cerrar 008D como reporte documental y preparar 008D-PUSH.
8. Despues de 008D-PUSH, preparar 008E como prueba controlada del baseline.

## 15. Errores o bloqueos

- `docs/status/008C_SALIDA_MUNDO_I.md` no existe; la ruta real detectada es `docs/status/008C_RETORNO_DESARROLLO_SALIDA_MUNDO_I.md`.
- `package-lock.json` no pudo parsearse con `ConvertFrom-Json` estandar por una propiedad de nombre vacio; se uso `ConvertFrom-Json -AsHashtable` para lectura de metadatos sin modificar el archivo.
- No se ejecuto el baseline de seguridad por prohibicion expresa del ticket.

## 16. Pendientes

- Aprobacion humana de este PRE-CIERRE.
- Commit documental posterior a aprobacion con mensaje:

```text
docs: validate security baseline 008D
```

- Generar entrega final cerrada con `okua-delivery-md` despues de la aprobacion y el commit.
- Preparar 008D-PUSH despues del cierre.
- Preparar 008E si se aprueba probar el baseline de seguridad.

## 17. Confirmaciones de cumplimiento

- GVO solo se modifica con este reporte documental permitido.
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
- No se ejecutaron scripts npm.
- No se ejecuto `pre-commit`.
- No se ejecuto `gitleaks`.
- No se ejecuto `npm audit`.
- No se ejecuto Graphify.
- No se ejecuto SkillCheck.
- No se ejecuto Claude Code, Spec-kit, Gstack, Claude Council ni MCP.
- No se crearon carpetas de agentes, skills ni MCP.
- No se creo rama.
- No se hizo push.
- No se creo Pull Request.
- PR_NO_APLICA.

## 18. Decision propuesta

```text
APROBADA_CERRAR_Y_PREPARAR_008D_PUSH
```

Justificacion: el baseline de seguridad queda documentado, sus riesgos quedan identificados y no debe ejecutarse como gate obligatorio sin una prueba controlada posterior.
