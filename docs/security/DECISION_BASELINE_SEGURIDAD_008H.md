# Decision baseline de seguridad 008H

## 1. Proposito

Formalizar la decision operativa sobre el baseline de seguridad introducido en `e669a28/cbc0d8b`, usando la evidencia de 008D y 008E.

Este documento define si el baseline queda aprobado como gate automatico, bloqueado como gate completo, permitido solo como referencia documental o limitado a gates parciales por ticket explicito.

## 2. Alcance

Este ticket es documental. No ejecuta el baseline, no instala dependencias, no modifica runtime y no cambia configuracion.

Archivo creado:

```text
docs/security/DECISION_BASELINE_SEGURIDAD_008H.md
```

Archivos revisados en modo lectura:

- `docs/status/008D_VALIDACION_BASELINE_SEGURIDAD.md`
- `docs/status/008E_PRUEBA_CONTROLADA_BASELINE_SEGURIDAD.md`
- `docs/security/SECURITY_GATE_COMANDOS_SCRIPTS_PERMISOS.md`
- `docs/security/MATRIZ_COMANDOS_POR_TIPO_DE_TICKET.md`
- `docs/security/MAPA_OSW_HERRAMIENTAS_007R.md`
- `.pre-commit-config.yaml`
- `requirements-security.txt`
- `scripts/run_security_checks.ps1`
- `package.json`

## 3. Evidencia base

| Evidencia | Estado | Lectura operativa |
|---|---|---|
| 008D - Validacion documental del baseline | Cerrado y sincronizado | Identifico riesgos de red, dependencias, hooks que escriben, caches locales y mezcla de seguridad con runtime historico. |
| 008D-PUSH | Cerrado y sincronizado | Publico la evidencia documental del baseline. |
| 008E - Prueba controlada en sandbox | Cerrado y sincronizado | Confirmo que el baseline completo no puede ejecutarse hoy de forma completa, reproducible y sin red. |
| 008E-PUSH | Cerrado y sincronizado | Publico la conclusion tecnica `BLOQUEAR_BASELINE_COMO_GATE`. |

Commits relevantes:

```text
e669a28 chore: add OKUA frontend security baseline
cbc0d8b merge: integrate OKUA frontend security baseline
00bbb28 docs: validate security baseline 008D
39540a2 docs: test security baseline in sandbox 008E
```

## 4. Estado del baseline observado

El baseline existe como conjunto documental y tecnico compuesto por:

- `.pre-commit-config.yaml`
- `requirements-security.txt`
- `scripts/run_security_checks.ps1`
- ajustes relacionados en `eslint.config.js`
- referencia documental en 008D y 008E

El baseline completo no esta listo para operar como gate automatico porque depende de herramientas y condiciones no disponibles o no autorizadas por defecto.

## 5. Resultado tecnico de 008E

Conclusion tecnica vigente:

```text
BLOQUEAR_BASELINE_COMO_GATE
```

Motivos confirmados:

1. `pre-commit` no esta disponible como comando.
2. El modulo Python `pre_commit` no esta instalado.
3. `gitleaks` no esta disponible como comando local.
4. `npm audit` requiere red.
5. El sandbox externo no tiene `node_modules`, por lo que `npm run lint` y `npm run test` no deben ejecutarse sin preparacion previa.
6. `scripts/run_security_checks.ps1` mezcla comandos bloqueados: `pre-commit`, `gitleaks`, `npm audit`, lint y test.
7. El baseline no puede ejecutarse de forma completa, reproducible y sin red en el entorno actual.

## 6. Decision operativa

Decision principal:

```text
BLOQUEAR_BASELINE_COMO_GATE_COMPLETO
```

Decisiones complementarias:

```text
MANTENER_BASELINE_COMO_REFERENCIA_DOCUMENTAL
PERMITIR_SOLO_GATES_PARCIALES_POR_TICKET
PENDIENTE_DE_ENTORNO_CONTROLADO
```

Interpretacion:

- El baseline completo queda bloqueado como gate automatico.
- El baseline puede conservarse como referencia documental de riesgos, comandos y estrategia de seguridad.
- Solo se permiten gates parciales cuando el ticket los autorice explicitamente.
- Cualquier adopcion operativa completa requiere preparar entorno externo controlado o red/dependencias bajo ticket especifico.

## 7. Que queda bloqueado

Queda bloqueado como gate automatico o ejecucion por defecto:

- `scripts/run_security_checks.ps1`
- `pre-commit run --all-files`
- `python -m pre_commit run --all-files`
- `gitleaks detect`
- `npm audit`
- `npm run check`
- `npm run build`
- `npm run format`
- instalacion de `pre-commit`
- instalacion o descarga de `gitleaks`
- uso de red para preparar hooks, auditorias o dependencias
- ejecucion del baseline contra el working tree real de GVO
- cualquier hook automatico no aprobado

## 8. Que queda permitido

Queda permitido solo bajo ticket explicito y con alcance documentado:

- `git status --short --branch`
- `git log --oneline -n 5`
- `git diff --check`
- `git diff`
- `npm run lint`
- `npm run test -- <scope focalizado>`

Condiciones:

- El ticket debe nombrar el comando.
- El ticket debe autorizar el alcance.
- El comando no debe sustituir una decision humana.
- Si aparece escritura, red, instalacion, cache inesperada o fallo de entorno, se debe detener y reportar.

## 9. Que queda pendiente

Queda pendiente decidir en ticket futuro si se prepara un entorno externo controlado para herramientas de seguridad.

Pendientes especificos:

- Definir si se instala `pre-commit` fuera de GVO.
- Definir si se obtiene `gitleaks` como binario controlado fuera de GVO.
- Definir si `npm audit` se evaluara en ticket con red autorizada.
- Definir si `scripts/run_security_checks.ps1` se reemplaza por gates parciales separados.
- Definir si los caches `.pre-commit-cache/` y `.npm-cache/` se gestionan solo fuera de GVO.

## 10. Comandos que no pueden ejecutarse como gate

No aprobar como gate automatico:

```text
scripts/run_security_checks.ps1
pre-commit run --all-files
python -m pre_commit run --all-files
gitleaks detect
npm audit
npm run check
npm run build
npm run format
npm install
npm update
npx
pip install
python -m pip install
```

## 11. Comandos que pueden seguir usandose bajo ticket especifico

Los siguientes comandos pueden usarse solo si el ticket activo los autoriza:

```text
git status --short --branch
git log --oneline -n 5
git diff
git diff --check
npm run lint
npm run test -- <scope focalizado>
npm run status
npm run audit:assets
```

Notas:

- `npm run lint` no debe ejecutarse en tickets documentales salvo autorizacion textual.
- `npm run test -- <scope focalizado>` debe usarse solo en tickets de validacion tecnica o runtime que lo permitan.
- `npm run status` y `npm run audit:assets` siguen sujetos a confirmacion de que no escriben archivos.

## 12. Relacion con la matriz de comandos

Esta decision conserva la regla base de `docs/security/MATRIZ_COMANDOS_POR_TIPO_DE_TICKET.md`:

```text
si un comando no esta permitido por el ticket activo, no se ejecuta
```

Efecto de 008H sobre la matriz:

- `npm audit` permanece prohibido salvo ticket explicito de seguridad/dependencias con red autorizada.
- `npm run build`, `npm run check` y `npm run format` permanecen prohibidos salvo ticket explicito.
- `npm run lint` y `npm run test` quedan permitidos solo por ticket especifico, no por baseline automatico.
- `git diff --check` queda como validacion parcial segura cuando el ticket la autorice.

## 13. Relacion con security gate

Esta decision complementa `docs/security/SECURITY_GATE_COMANDOS_SCRIPTS_PERMISOS.md`.

Orden de autoridad:

1. Ticket activo.
2. `AGENTS.md`.
3. Reglas no negociables.
4. Security gate.
5. Matriz de comandos.
6. Decision baseline 008H.

Si un ticket futuro invoca el baseline de seguridad, debe aplicar la decision mas restrictiva:

```text
BLOQUEAR_BASELINE_COMO_GATE_COMPLETO
```

salvo que exista un ticket posterior que cambie explicitamente esta decision con evidencia nueva.

## 14. Reglas para futuros tickets runtime

Para tickets runtime futuros:

1. No ejecutar `scripts/run_security_checks.ps1` como validacion de cierre.
2. No ejecutar `pre-commit`, `gitleaks` ni `npm audit` por defecto.
3. No instalar dependencias para satisfacer el baseline.
4. No mezclar cambios de seguridad/tooling con cambios runtime.
5. Usar validaciones parciales solo si el ticket las autoriza.
6. Registrar si `npm run lint`, `npm run test -- <scope>` o `git diff --check` fueron ejecutados, fallaron o quedaron bloqueados.
7. Mantener `PR_NO_APLICA`.

## 15. Riesgos residuales

| Riesgo | Nivel | Mitigacion |
|---|---|---|
| Falsa sensacion de gate activo | Alto | Documentar que el baseline completo esta bloqueado como gate. |
| Script amplio ejecutado por accidente | Alto | No usar `scripts/run_security_checks.ps1` salvo ticket futuro que lo autorice por nombre. |
| Uso de red no autorizado | Alto | Mantener `npm audit`, descargas de hooks e instalaciones bloqueadas. |
| Herramientas faltantes | Medio/alto | Preparar entorno externo solo si hay ticket dedicado. |
| Mezcla seguridad/runtime | Medio/alto | Separar cambios de seguridad de tickets runtime. |
| Caches locales dentro de GVO | Medio | Mantener caches ignorados y no usarlos como evidencia versionada. |
| Validaciones parciales tomadas como gate completo | Medio | Nombrarlas como gates parciales por ticket, no como baseline operativo. |

## 16. Matriz obligatoria - Decision baseline

| Elemento | Estado 008E | Decision 008H | Uso permitido | Uso prohibido | Ticket requerido |
|---|---|---|---|---|---|
| pre-commit | No disponible como comando; modulo Python `pre_commit` ausente | Bloqueado como gate completo | Ninguno en GVO por defecto | `pre-commit run --all-files`; descarga de hooks; hooks automaticos | 008I o ticket de entorno externo controlado |
| gitleaks | No disponible localmente | Bloqueado hasta binario controlado | Ninguno en GVO por defecto | `gitleaks detect` sobre GVO real | 008I o auditoria de secretos con herramienta definida |
| npm audit | No ejecutado; requiere red | Bloqueado por red | Ninguno sin red autorizada | `npm audit` en tickets normales | Ticket de seguridad/dependencias con red autorizada |
| npm run lint | No ejecutado; sandbox sin `node_modules` | Gate parcial por ticket | `npm run lint` solo si el ticket lo autoriza | Usarlo como gate automatico o sustituto del baseline | Ticket runtime/validacion que lo nombre |
| npm run test | No ejecutado; sandbox sin `node_modules` | Gate parcial focalizado por ticket | `npm run test -- <scope focalizado>` si el ticket lo autoriza | Suite completa automatica sin alcance | Ticket runtime/validacion que lo nombre |
| scripts/run_security_checks.ps1 | No ejecutado; mezcla comandos bloqueados | No ejecutar como gate | Lectura documental del script | Ejecutarlo contra GVO real o sandbox sin ticket posterior | Ticket futuro si se rediseña o se prueba con red/entorno |
| git diff --check | No parte del baseline completo, pero validacion local segura | Gate parcial permitido por ticket | Validar whitespace/conflictos sin red | Tratarlo como reemplazo de pruebas funcionales | Ticket que lo autorice |
| caches locales | Caches externas 008E vacias; caches reales existen pero no se usaron | Permitidas solo fuera de GVO o ignoradas localmente | Caches externas documentadas | Versionar caches o usarlas como evidencia obligatoria | Ticket de entorno/caches si aplica |
| working tree real GVO | Protegido; herramientas no ejecutadas sobre GVO real | Mantener protegido | Lectura y cambios permitidos por ticket | Ejecutar baseline completo contra GVO real | Ticket explicito posterior |
| sandbox externo | Snapshot 008E creado con 721 archivos, sin `node_modules` | Valido para pruebas sin red, limitado por entorno | Pruebas futuras controladas | Considerarlo equivalente al repo real con dependencias completas | 008I si se prepara entorno |

## 17. Matriz obligatoria - Continuidad

| Opcion | Descripcion | Ventaja | Riesgo | Recomendacion | Ticket siguiente |
|---|---|---|---|---|---|
| 008H-PUSH - Sincronizar decision operativa del baseline | Publicar este documento despues de aprobacion y commit local. | Deja la decision disponible en `origin/main`. | Bajo; solo push documental. | Recomendado como paso inmediato tras aprobar 008H. | 008H-PUSH |
| 008F - Preparar flujo hacia Mundo II | Retomar plan funcional despues de Mundo I. | Permite volver a desarrollo de producto. | Puede avanzar sin resolver si se exige gate completo. | Viable despues de 008H-PUSH si se acepta baseline documental/parcial. | 008F |
| 008G - Resolver deuda visual residual de Mundo I | Atender deuda visual observada en 008B/008C. | Mejora calidad visual antes de Mundo II. | Puede retrasar avance funcional si la deuda no bloquea. | Elegir si prioridad humana es pulir Mundo I antes de Mundo II. | 008G |
| 008I - Preparar entorno externo para herramientas de seguridad | Crear/definir entorno controlado para `pre-commit`, `gitleaks`, dependencias y caches. | Podria habilitar un gate mas fuerte en el futuro. | Requiere red, instalaciones o binarios controlados bajo ticket. | Recomendado solo si se decide invertir en gate completo. | 008I |

## 18. Recomendacion principal

Recomendacion principal:

```text
Formalizar el baseline como referencia documental, no como gate completo.
Permitir solo validaciones parciales bajo ticket explicito.
Preparar 008H-PUSH.
Luego avanzar a 008F o 008G segun prioridad humana.
```

Decision final de este documento:

```text
BLOQUEAR_BASELINE_COMO_GATE_COMPLETO
MANTENER_BASELINE_COMO_REFERENCIA_DOCUMENTAL
PERMITIR_SOLO_GATES_PARCIALES_POR_TICKET
PENDIENTE_DE_ENTORNO_CONTROLADO
```

## 19. Confirmaciones de cumplimiento

- No se ejecuto baseline.
- No se ejecuto `pre-commit`.
- No se ejecuto `gitleaks`.
- No se ejecuto `npm audit`.
- No se ejecutaron scripts npm.
- No se instalo ninguna dependencia.
- No se uso red.
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
- No se creo rama.
- No se hizo push.
- No se creo Pull Request.
- PR_NO_APLICA.
- No se ejecuto `okua-delivery-md`.
