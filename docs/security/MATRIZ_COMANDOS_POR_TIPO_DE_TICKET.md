# Matriz de comandos por tipo de ticket

## 1. Proposito

Esta matriz define que comandos pueden ejecutarse en GVO segun el tipo de ticket. Su objetivo es evitar ejecuciones accidentales, escrituras no autorizadas, uso de red, instalacion de dependencias o modificaciones runtime fuera de alcance.

La regla base es simple: si un comando no esta permitido por el ticket activo, no se ejecuta.

## 2. Tipos de ticket

| Tipo | Descripcion |
|---|---|
| SOLO_LECTURA | Inspeccion local sin crear, modificar, mover, renombrar ni eliminar archivos. |
| DOCUMENTAL_CON_ESCRITURA | Cambios limitados a documentacion permitida por el ticket. |
| LIMPIEZA_LOCAL_NO_VERSIONADA | Eliminacion controlada de temporales no versionados. |
| ARCHIVO_HISTORICO | Movimiento o retiro controlado de evidencia historica con verificacion externa. |
| PUSH | Sincronizacion de commits ya aprobados con remoto. |
| RUNTIME | Cambios en codigo, pantallas, assets runtime o comportamiento de la app. |
| DEPENDENCIAS | Instalacion, actualizacion o auditoria de dependencias. |
| HERRAMIENTAS_EXTERNAS | Evaluacion o adopcion controlada de herramientas externas. |
| SEGURIDAD | Auditorias, politicas y gates de seguridad. |
| VISUAL_ASSETS | Revision, staging, validacion o normalizacion de assets visuales. |

## 3. Clasificacion de comandos

| Clasificacion | Significado |
|---|---|
| Permitido | Puede ejecutarse si el ticket lo incluye o no lo prohibe. |
| Permitido con aprobacion humana | Requiere aprobacion explicita previa. |
| Prohibido | No debe ejecutarse en ese tipo de ticket. |
| Prohibido salvo ticket explicito | Solo se ejecuta si el ticket lo autoriza de forma textual. |
| Solo externo a GVO | Puede ejecutarse fuera del repo GVO y sin acoplarse al proyecto. |

## 4. Matriz Git

| Comando | SOLO_LECTURA | DOCUMENTAL_CON_ESCRITURA | LIMPIEZA_LOCAL_NO_VERSIONADA | ARCHIVO_HISTORICO | PUSH | RUNTIME | DEPENDENCIAS | HERRAMIENTAS_EXTERNAS | SEGURIDAD | VISUAL_ASSETS |
|---|---|---|---|---|---|---|---|---|---|---|
| `git status` | Permitido | Permitido | Permitido | Permitido | Permitido | Permitido | Permitido | Permitido | Permitido | Permitido |
| `git log` | Permitido | Permitido | Permitido | Permitido | Permitido | Permitido | Permitido | Permitido | Permitido | Permitido |
| `git diff` | Permitido | Permitido | Permitido | Permitido | Permitido | Permitido | Permitido | Permitido | Permitido | Permitido |
| `git add` | Prohibido | Permitido con aprobacion humana | Prohibido salvo ticket explicito | Permitido con aprobacion humana | Prohibido | Permitido con aprobacion humana | Prohibido salvo ticket explicito | Prohibido salvo ticket explicito | Permitido con aprobacion humana | Permitido con aprobacion humana |
| `git commit` | Prohibido | Permitido con aprobacion humana | Prohibido salvo ticket explicito | Permitido con aprobacion humana | Prohibido | Permitido con aprobacion humana | Prohibido salvo ticket explicito | Prohibido salvo ticket explicito | Permitido con aprobacion humana | Permitido con aprobacion humana |
| `git push` | Prohibido | Prohibido | Prohibido | Prohibido | Permitido solo si el ticket es `*-PUSH` | Prohibido salvo ticket explicito | Prohibido salvo ticket explicito | Prohibido salvo ticket explicito | Prohibido salvo ticket explicito | Prohibido salvo ticket explicito |
| `git reset` | Prohibido | Prohibido salvo ticket explicito | Prohibido | Prohibido | Prohibido | Prohibido salvo ticket explicito | Prohibido | Prohibido | Prohibido | Prohibido |
| `git clean` | Prohibido | Prohibido | Prohibido | Prohibido | Prohibido | Prohibido | Prohibido | Prohibido | Prohibido | Prohibido |
| `git rebase` | Prohibido | Prohibido | Prohibido | Prohibido | Prohibido | Prohibido salvo ticket explicito | Prohibido | Prohibido | Prohibido | Prohibido |
| `git merge` | Prohibido | Prohibido salvo ticket explicito | Prohibido | Prohibido | Prohibido | Prohibido salvo ticket explicito | Prohibido | Prohibido | Prohibido | Prohibido |

## 5. Matriz npm

| Comando | Clasificacion general | Regla |
|---|---|---|
| `npm run status` | Lectura segura | Permitido en auditorias si el script sigue sin escribir archivos. |
| `npm run audit:assets` | Lectura segura | Permitido en auditorias si el script sigue sin escribir archivos. |
| `npm run lint` | Lectura probable | Permitido si el ticket lo autoriza; no usar como sustituto de auditoria textual. |
| `npm run test` | Ejecucion controlada | Requiere ticket que autorice pruebas. |
| `npm run test:e2e` | Puede generar resultados | Requiere ticket explicito y revision de artefactos. |
| `npm run build` | Escritura | Prohibido salvo ticket explicito. |
| `npm run check` | Escritura indirecta | Prohibido salvo ticket explicito porque incluye `build`. |
| `npm run format` | Escritura | Prohibido salvo ticket explicito porque usa `--write`. |
| `npm install` | Dependencias/red | Prohibido salvo ticket DEPENDENCIAS explicito. |
| `npm update` | Dependencias/red | Prohibido salvo ticket DEPENDENCIAS explicito. |
| `npm audit` | Red/seguridad dependencias | Prohibido salvo ticket explicito de dependencias o seguridad con red autorizada. |
| `npx` | Red/ejecucion externa | Prohibido salvo aprobacion humana y ticket explicito. |

## 6. Scripts npm detectados en GVO

| Script | Comando | Tipo | Clasificacion | Requiere aprobacion |
|---|---|---|---|---|
| `dev` | `vite --host 0.0.0.0` | servidor local | Permitido con aprobacion humana | Si |
| `build` | `tsc -b && vite build` | escritura | Prohibido salvo ticket explicito | Si |
| `preview` | `vite preview --host 0.0.0.0` | servidor local | Permitido con aprobacion humana | Si |
| `test` | `vitest run` | prueba | Permitido con ticket de validacion | Segun ticket |
| `test:watch` | `vitest` | proceso persistente | Permitido con aprobacion humana | Si |
| `test:e2e` | `playwright test` | prueba/evidencia | Permitido con ticket explicito | Si |
| `lint` | `eslint .` | lectura probable | Permitido con ticket explicito | Segun ticket |
| `format` | `prettier . --write` | escritura | Prohibido salvo ticket explicito | Si |
| `check` | `npm run lint && npm run test && npm run build` | escritura indirecta | Prohibido salvo ticket explicito | Si |
| `status` | `node tools/print_project_status.mjs` | lectura | Permitido si no escribe | No |
| `audit:assets` | `node tools/audit_assets.mjs` | lectura | Permitido si no escribe | No |
| `assets:normalize:loading` | `node tools/normalize_loading_initial_assets.mjs` | escritura/runtime assets | Prohibido salvo ticket explicito | Si |
| `assets:validate:loading` | `node tools/validate_loading_initial_assets.mjs` | validacion | Permitido con ticket explicito | Segun ticket |
| `validate:cover-intro-assets` | `node tools/validate_cover_intro_assets.mjs` | validacion | Permitido con ticket explicito | Segun ticket |
| `validate:transition-root-assets` | `node scripts/validate-transition-root-assets.mjs` | validacion | Permitido con ticket explicito | Segun ticket |

## 7. Matriz de comandos de archivo

| Comando | Clasificacion | Regla |
|---|---|---|
| `Get-ChildItem` | lectura | Permitido en auditorias. |
| `Measure-Object` | lectura | Permitido en auditorias. |
| `Get-FileHash` | lectura/verificacion | Permitido en archivo historico y validacion. |
| `Copy-Item` | escritura/copia | Permitido solo con ticket explicito. |
| `Remove-Item` | eliminacion | Prohibido salvo ticket explicito. |
| `Remove-Item -Recurse -Force .` | eliminacion destructiva | Prohibido. |
| `Move-Item` | movimiento | Prohibido salvo ticket explicito. |
| `Rename-Item` | renombrado | Prohibido salvo ticket explicito. |

## 8. Matriz de herramientas externas

| Herramienta | Clasificacion | Regla |
|---|---|---|
| `okua-delivery-md` | Solo externo a GVO | Usar despues de aprobacion humana; no dependencia runtime; no RAW persistente. |
| Graphify | Pendiente de evaluacion | No ejecutar dentro de GVO sin ticket especifico. |
| SkillCheck | Pendiente de evaluacion | No instalar ni ejecutar sobre GVO sin auditoria previa. |
| Spec-kit | Pendiente de evaluacion | No reemplaza tickets GVO; usar solo con ticket explicito. |
| Gstack | Pendiente de evaluacion | Solo referencia externa hasta nuevo ticket. |
| Claude Council | Pendiente de evaluacion | Revision puntual externa; sin permisos amplios. |
| Claude Code | Pendiente de evaluacion | No instalar ni conectar MCP sin security gate. |

## 9. Politica especifica para okua-delivery-md

`okua-delivery-md` se usa como herramienta externa de documentacion.

Reglas:

- no antes de aprobacion humana si el ticket requiere PRE-CIERRE;
- si despues del cierre aprobado;
- externo al repo GVO;
- no crear dependencia npm;
- no crear script obligatorio;
- no guardar RAW persistente;
- no guardar `.md` intermedio;
- entregar solo el `.md` final cerrado.

## 10. Comandos prohibidos por defecto

Prohibidos salvo ticket explicito:

- `curl`;
- `wget`;
- `Invoke-WebRequest`;
- `irm`;
- `iwr`;
- `npx`;
- `git clone`;
- `git clean`;
- `rm -rf`;
- `Remove-Item -Recurse -Force .`;
- `npm install`;
- `npm update`;
- `npm audit`;
- scripts mutativos sin ticket.

## 11. Tabla de scripts npm por categoria

| Categoria | Scripts |
|---|---|
| Lectura segura | `status`, `audit:assets` |
| Escritura | `build`, `format`, `check`, `assets:normalize:loading` |
| Servidor local | `dev`, `preview` |
| Proceso persistente | `test:watch`, `dev`, `preview` |
| Posible red | `npm install`, `npm update`, `npm audit`, `npx` |
| Requiere aprobacion | `build`, `format`, `check`, `test:e2e`, `assets:normalize:loading`, `dev`, `preview`, `test:watch` |

## 12. Checklist previo para comandos fuera de lectura

Antes de ejecutar un comando fuera de lectura:

- confirmar tipo de ticket;
- confirmar que el comando aparece autorizado;
- confirmar archivos permitidos;
- confirmar si escribe artefactos;
- confirmar si usa red;
- confirmar si requiere aprobacion humana;
- confirmar estado Git inicial;
- confirmar que no toca runtime si el ticket lo prohibe;
- confirmar rollback;
- registrar comando y resultado.

## 13. Reglas de aprobacion humana

Requieren aprobacion humana explicita:

- commits;
- push;
- eliminacion, movimiento o renombrado;
- instalacion de dependencias;
- uso de red;
- herramientas externas dentro de GVO;
- MCP/conectores;
- permisos sensibles;
- scripts mutativos;
- cambios runtime;
- archivo historico que retire evidencia del repo.

## 14. Ejemplos de aplicacion por ticket

| Tipo de ticket | Permitido | Prohibido |
|---|---|---|
| SOLO_LECTURA | `git status`, `git log`, `git diff`, `rg`, `Get-ChildItem` | `git add`, `git commit`, `npm run build`, `npm install` |
| DOCUMENTAL_CON_ESCRITURA | Crear/editar documentos permitidos, `git diff`, validaciones de lectura | Modificar runtime, assets, lockfiles, scripts npm |
| LIMPIEZA_LOCAL_NO_VERSIONADA | Borrar solo temporales no versionados autorizados | Borrar versionados, usar `git clean` |
| ARCHIVO_HISTORICO | Copiar, verificar hash, retirar origen autorizado, crear manifiesto | Mover evidencia sin copia verificada |
| PUSH | `git status`, `git log`, `git push origin main` | commits nuevos, merge, rebase, force push |
| RUNTIME | Cambios tecnicos autorizados y pruebas indicadas | Redisenos fuera de ticket, assets inventados |
| DEPENDENCIAS | Instalar/auditar solo con red autorizada | Instalar global, usar `npx` sin aprobacion |
| HERRAMIENTAS_EXTERNAS | Evaluacion sandbox documentada | Integrar herramientas al runtime sin gate |
| SEGURIDAD | Auditorias y politicas de seguridad | Leer secretos o enviar datos a red |
| VISUAL_ASSETS | Validar o normalizar assets autorizados | Tocar Atlas 006I o assets vivos fuera de alcance |
