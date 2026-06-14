# 009C - Arquitectura contador diario de uso

Fecha: 2026-06-14

## 1. Proposito

Disenar la arquitectura tecnica y operativa del contador diario de uso de GVO para el PC host donde correra la aplicacion, sin implementar todavia ningun contador en runtime.

El contador futuro debe ser robusto, auditable, deduplicable, tolerante a reinicios, trazable, local-first y preparado para conciliacion diaria con flujo de caja o contabilidad.

Este documento no activa QR real, no activa camara, no escribe datos reales, no crea base de datos, no crea endpoints y no modifica la aplicacion para empezar a contar usuarios.

## 2. Alcance

Este ticket es documental. El alcance aplicado fue:

- revisar documentacion vigente de 008G, 009A, 009B y decision de baseline 008H;
- revisar rutas y pantallas existentes en modo lectura;
- ubicar puntos futuros de instrumentacion sin tocar runtime;
- definir uso valido, sesion valida y dia operativo;
- definir eventos futuros;
- definir reglas de deduplicacion;
- evaluar persistencia local en PC host;
- disenar reporte diario exportable;
- documentar relacion futura con QR y flujo de caja;
- documentar privacidad, modo prueba y riesgos.

Fuera de alcance:

- implementar contador;
- modificar `src/**`;
- modificar assets;
- crear almacenamiento operativo;
- ejecutar servidor local;
- ejecutar scripts npm;
- instalar dependencias;
- usar red;
- ejecutar herramientas externas dentro de GVO.

## 3. Estado Git inicial

```text
## main...origin/main
```

Ultimos commits iniciales:

```text
0415cf3 feat: prepare editorial locale architecture 009B
df2b968 feat: build Mundo II temporary experience 009A
8812531 feat: unify loading progress and restore W1 W2 transition 008G
8d2e6f0 feat: prepare Mundo II entry flow 008F
d7aaa0b docs: formalize security baseline decision 008H
```

## 4. Requerimiento de negocio

GVO necesita poder saber cuantas experiencias reales ocurren por dia operativo en el PC host, con suficiente trazabilidad para comparar el total diario con flujo de caja, registro de operacion o conteo manual del jardin/experiencia.

El objetivo no es identificar personas. El objetivo es medir uso operacional:

- cuantas sesiones validas iniciaron;
- cuantas completaron el recorrido;
- cuantas abandonaron;
- hasta que estacion llegaron;
- por que QR o punto de entrada iniciaron cuando QR exista;
- en que rango horario ocurrio la operacion;
- que sesiones fueron invalidadas por pruebas, recargas, errores o mantenimiento.

## 5. Definicion de uso valido

Un uso valido futuro debe contarse cuando una persona inicia una experiencia real y supera criterios minimos de actividad.

Criterios propuestos para contar una sesion como uso valido:

1. Inicio desde QR valido o acceso autorizado del flujo operativo.
2. Entrada efectiva al recorrido GVO, no solo apertura tecnica de la app.
3. Avance minimo de pantalla: por ejemplo, llegada a una estacion viva o confirmacion de inicio de experiencia.
4. Tiempo minimo activo: por ejemplo, 20 a 45 segundos desde `session_started`, configurable por operacion.
5. No ser duplicado inmediato de una sesion reciente del mismo origen.
6. Tener fecha operativa valida segun reloj local del PC host.
7. No estar marcado como modo prueba, mantenimiento o editorial.
8. No estar invalidado por error de carga, cierre tecnico o cancelacion humana.

No debe contar como uso valido:

- recarga accidental;
- apertura tecnica;
- prueba interna;
- refresh del navegador;
- volver atras;
- reingreso inmediato del mismo usuario/origen;
- doble click;
- error de carga;
- sesion iniciada en modo prueba;
- acceso directo a rutas de desarrollo;
- visita a placeholder QR sin completar criterio de sesion.

## 6. Definicion de sesion

Una sesion futura es una unidad local de recorrido en el PC host.

Campos conceptuales recomendados:

```text
sessionId
operationalDate
startedAt
lastSeenAt
endedAt
entryRoute
entrySource
qrId
mode
status
validity
maxStationReached
eventsCount
dedupeKey
invalidatedReason
notes
```

Estados propuestos:

```text
created
started
active
completed
abandoned
invalidated
expired
```

Validez propuesta:

```text
candidate
valid
invalid
test
maintenance
editorial
```

Una sesion no deberia convertirse en `valid` en el mismo instante de abrir la app. Debe pasar por un punto de confirmacion, por ejemplo `session_started` mas tiempo minimo o `station_entered` en ruta operativa permitida.

## 7. Definicion de dia operativo

Regla por defecto:

```text
Dia calendario local del PC host
```

Zona horaria:

```text
Zona horaria local del sistema operativo del PC host
```

Formato recomendado:

```text
YYYY-MM-DD
```

Regla futura configurable:

- permitir un corte operativo distinto a medianoche, por ejemplo `04:00`;
- conservar `operationalDate` aunque la sesion cruce medianoche;
- registrar `systemDate` y `operationalDate` por separado si existe corte configurable.

Manejo de reinicio del PC:

- al iniciar la app, leer el ultimo estado local persistido;
- cerrar como `abandoned` o `expired` cualquier sesion abierta que haya superado el timeout permitido;
- emitir evento futuro `daily_rollover` si cambio el dia operativo;
- no duplicar una sesion solo porque la app reabrio despues de reinicio.

Manejo de cambio de fecha:

- detectar si el reloj local retrocede o avanza de forma anomala;
- registrar advertencia local en el reporte diario;
- evitar contar dos veces por saltos de reloj;
- requerir revision humana si hay cambio manual de fecha durante operacion.

## 8. Eventos futuros propuestos

Los eventos deben ser append-only, con timestamp local, `sessionId` cuando aplique y datos minimos. No deben incluir datos personales.

Eventos base:

```text
app_opened
qr_access_started
session_started
station_entered
station_completed
journey_completed
session_abandoned
session_invalidated
daily_rollover
```

Eventos opcionales futuros:

```text
session_resumed
session_expired
session_deduped
report_exported
operator_note_added
```

## 9. Modelo de deduplicacion

La deduplicacion debe reducir conteos dobles sin prometer infalibilidad absoluta.

Reglas propuestas:

1. Generar `sessionId` local por intento real de sesion.
2. Usar `dedupeKey` derivado de informacion no personal, por ejemplo `qrId + operationalDate + cooldownWindow + browserInstanceIdLocal`.
3. Aplicar ventana de reingreso: por ejemplo, 3 a 10 minutos para no contar refresh o retorno inmediato.
4. Aplicar cooldown por QR cuando QR exista.
5. No contar doble click sobre botones de inicio o confirmacion.
6. No contar doble refresh de `/`, `/portada`, transiciones o estaciones.
7. No contar rutas `/dev/**` ni pruebas internas.
8. Si una sesion queda abierta por corte electrico, cerrarla como `expired` al siguiente arranque y no crear uso valido adicional automaticamente.

Regla de conteo recomendada:

```text
El total diario de uso debe calcularse desde sesiones validas, no desde eventos sueltos.
```

## 10. Modelo de almacenamiento local

El almacenamiento futuro debe vivir en el PC host, sin red externa por defecto.

Modelo recomendado por fases:

1. Fase de prototipo: JSONL append-only local en carpeta operativa externa a assets runtime, con exportacion diaria.
2. Fase de operacion estable: SQLite local con tabla de eventos append-only, tabla de sesiones derivada y exportacion CSV/JSON diaria.
3. Fase de auditoria reforzada: archivo diario exportable con hash de integridad y resumen firmado localmente si se aprueba.

No crear almacenamiento en 009C. Esta es solo una decision de arquitectura.

Ubicacion futura sugerida:

```text
Carpeta local operativa del PC host, fuera de src/public/assets y fuera de evidencia historica visual.
```

Ejemplos conceptuales, no implementados:

```text
C:\OKUA_GVO_DATA\usage\
C:\Users\Public\OKUA\GVO\usage\
```

La ruta exacta debe decidirse con el operador antes de implementar.

## 11. Modelo de reporte diario

El reporte diario futuro debe poder emitirse por dia operativo y ser legible por una persona.

Campos minimos:

- fecha operativa;
- total de sesiones candidatas;
- total de sesiones validas;
- total de recorridos completos;
- total de abandonos;
- total de sesiones invalidadas;
- conteo por estacion alcanzada;
- conteo por QR si aplica;
- hora primera sesion;
- hora ultima sesion;
- advertencias del dia;
- notas de operacion;
- hash o referencia de integridad si aplica;
- ruta del archivo exportado.

Formato recomendado:

- CSV diario para conciliacion humana/contable;
- JSON diario para auditoria tecnica;
- resumen Markdown o pantalla local de operacion si se aprueba mas adelante.

## 12. Integracion futura con QR

QR no se implementa en 009C.

Diseno futuro:

- QR como inicio de sesion: `qr_access_started`;
- QR como origen de estacion: `qrId`, `stationId`, `entryRoute`;
- QR como token de entrada no personal;
- QR como punto de deduplicacion;
- QR no debe activar camara sin ticket especifico;
- QR no debe recolectar identidad personal;
- QR invalido o expirado puede generar evento tecnico, pero no uso valido.

Recomendacion:

```text
El contador no debe depender exclusivamente del QR. El QR puede iniciar una sesion candidata, pero el uso valido debe requerir avance minimo y tiempo activo.
```

## 13. Relacion futura con flujo de caja

El reporte diario debe facilitar comparacion con caja sin integrarse directamente a contabilidad.

Comparables minimos:

- conteo diario total de sesiones validas;
- rango horario de operacion;
- total de recorridos completos;
- total de sesiones anuladas;
- marcas de invalidacion;
- notas de operacion;
- QR o punto de entrada cuando aplique;
- archivo diario exportable.

No implementar:

- integracion con software contable;
- facturacion;
- pagos;
- identificacion personal;
- red externa;
- sincronizacion cloud.

## 14. Reglas de privacidad

Regla por defecto:

```text
Contar uso operacional, no personas identificadas.
```

No recolectar:

- nombre;
- documento;
- telefono;
- correo;
- imagen;
- audio;
- camara;
- ubicacion precisa;
- IP externa;
- tracking externo;
- huella invasiva del navegador;
- red externa.

Datos permitidos conceptualmente:

- `sessionId` aleatorio local;
- `operationalDate`;
- timestamps locales;
- ruta o estacion;
- QR/token no personal si se aprueba;
- modo de sesion;
- estado de validez;
- conteos agregados.

## 15. Modo prueba vs modo operacion

El sistema futuro debe diferenciar modos desde el inicio.

Modos propuestos:

```text
operation
technical_test
editorial_test
maintenance
dev
```

Reglas:

- solo `operation` puede sumar al conteo operativo;
- `technical_test` valida runtime sin afectar conteo;
- `editorial_test` permite revisar textos/slots sin afectar conteo;
- `maintenance` permite diagnostico local sin sumar;
- `dev` aplica a rutas tecnicas o entorno de desarrollo.

Recomendacion futura:

- mostrar o registrar el modo activo en el reporte diario;
- permitir nota humana de operacion;
- bloquear conteo de rutas `/dev/**`;
- invalidar sesiones si se detecta bandera de prueba.

## 16. Riesgos de conteo

| Riesgo | Nivel | Lectura | Mitigacion |
|---|---|---|---|
| Corte electrico durante sesion | Alto | Puede dejar sesiones abiertas. | Persistencia append-only y cierre `expired` al reinicio. |
| Refresh del navegador | Medio | Puede duplicar intentos. | Dedupe por ventana y sessionId recuperable. |
| Reingreso inmediato | Medio | Puede contar doble a la misma persona/origen. | Cooldown por QR/origen y tiempo minimo activo. |
| Cambio manual de hora | Alto | Puede afectar dia operativo. | Registrar advertencia y requerir revision humana. |
| Pruebas tecnicas durante operacion | Medio | Pueden contaminar conteo. | Modo prueba no suma al total. |
| QR compartido o reutilizado | Medio | Puede generar ambiguedad. | QR como origen, no como unica prueba de uso valido. |
| Manipulacion local de archivos | Medio/alto | PC host puede ser alterado. | Hash diario y archivos append-only en fase futura. |
| LocalStorage borrado | Medio | Pierde sesiones si se usa solo navegador. | No recomendarlo como fuente principal. |
| Error de carga | Medio | Apertura parcial podria contar mal. | Contar desde sesion valida, no `app_opened`. |
| Doble click | Bajo/medio | Eventos repetidos inmediatos. | Idempotencia por boton/evento y cooldown corto. |

## 17. Recomendacion tecnica

Recomendacion principal:

```text
Disenar el contador futuro como Event Log local append-only + sesiones derivadas + reporte diario exportable.
```

Persistencia recomendada:

- prototipo controlado: JSONL append-only;
- operacion estable: SQLite local con eventos append-only y reportes exportables;
- conciliacion diaria: CSV/Markdown exportado por fecha operativa;
- integridad futura: hash diario del archivo o resumen.

Regla clave:

```text
No contar `app_opened` como uso. Contar sesiones validas derivadas de eventos y reglas de negocio.
```

## 18. Que queda prohibido por ahora

Queda prohibido en 009C:

- implementar contador;
- crear codigo de tracking;
- crear base de datos;
- crear `.db`, `.sqlite`, `.jsonl` o `.csv` operativos;
- modificar runtime;
- modificar `src/**`;
- modificar `public/**`;
- modificar `assets/**`;
- modificar Atlas 006I;
- modificar `package.json`;
- modificar lockfiles;
- modificar `.gitignore`;
- modificar `.pre-commit-config.yaml`;
- modificar `requirements-security.txt`;
- modificar `scripts/run_security_checks.ps1`;
- instalar dependencias;
- ejecutar scripts npm;
- ejecutar servidor local;
- ejecutar baseline completo;
- ejecutar `pre-commit`, `gitleaks` o `npm audit`;
- ejecutar Graphify, SkillCheck, Claude Code, Spec-kit, Gstack, Claude Council o MCP;
- usar red;
- hacer push;
- crear rama;
- crear Pull Request.

## 19. Fases futuras de implementacion

Fase 1 - Prototipo controlado sin QR real:

- crear modelo de eventos en codigo;
- escribir en almacenamiento local temporal aprobado;
- separar modo prueba/operacion;
- generar reporte diario falso o fixture;
- no contar uso real todavia.

Fase 2 - Contador operativo local:

- habilitar escritura local en PC host;
- definir ruta operativa final;
- activar sesiones validas;
- generar reporte diario exportable;
- validar reinicios y cortes simulados.

Fase 3 - Integracion QR:

- usar QR como origen de sesion;
- dedupe por QR/origen;
- mantener QR sin datos personales;
- validar que QR invalido no cuente.

Fase 4 - Conciliacion diaria:

- exportar CSV/Markdown por dia;
- comparar con caja o registro manual;
- registrar notas de operacion;
- revisar discrepancias.

Fase 5 - Integridad/auditoria:

- hash diario;
- cierre de dia;
- verificacion de archivos;
- politica de retencion.

## 20. Matriz obligatoria - Diseno contador

| Area | Decision propuesta | Motivo | Riesgo | Mitigacion | Ticket futuro |
|---|---|---|---|---|---|
| Uso valido | Contar solo sesiones que superen acceso autorizado, avance minimo, tiempo activo y dedupe. | Evita contar aperturas tecnicas o refresh. | Puede excluir sesiones reales muy cortas. | Umbral configurable y revision diaria. | 009F |
| Sesion | Usar `sessionId` local, estado y validez derivada. | Permite auditar recorrido sin datos personales. | Sesiones abiertas por corte. | Timeout y cierre `expired` al reinicio. | 009F |
| Dia operativo | Usar fecha local del PC host por defecto, con corte configurable futuro. | Simple para caja diaria. | Cambio manual de hora. | Advertencias y revision humana. | 009F/009G |
| Dedupe | Ventana de reingreso, cooldown por QR/origen y no contar doble click/refresh. | Reduce duplicados probables. | No es infalible ante uso indebido. | Documentar limites y eventos `session_deduped`. | 009F |
| Persistencia | Event log append-only; prototipo JSONL y operacion estable SQLite. | Auditabilidad y tolerancia a cortes. | Complejidad mayor que LocalStorage. | Implementacion por fases. | 009F/009G |
| Reporte diario | Exportar resumen diario con sesiones validas, completadas, abandonadas e invalidadas. | Facilita conciliacion con caja. | Riesgo de interpretar eventos tecnicos como uso. | Reportar sesiones derivadas y notas. | 009G |
| QR futuro | QR inicia sesion candidata, no uso valido automatico. | Evita que escaneo accidental cuente. | QR reutilizado o compartido. | Dedupe y avance minimo. | Ticket QR futuro |
| Flujo de caja | Comparar total diario y rango horario sin integracion contable directa. | Mantiene alcance local-first. | Diferencias por anulaciones/pruebas. | Marcas de invalidacion y notas. | 009G |
| Privacidad | No recolectar datos personales ni usar tracking externo. | Reduce riesgo legal/operativo. | Menor precision para dedupe. | Dedupe no personal y auditoria agregada. | 009F |
| Modo pruebas | Separar `operation`, `technical_test`, `editorial_test`, `maintenance`, `dev`. | Evita contaminar conteo real. | Operador podria olvidar modo activo. | Indicador visible o reporte de modo en fase futura. | 009F |

## 21. Matriz obligatoria - Eventos futuros

| Evento | Cuando ocurre | Cuenta como uso | Datos minimos | Riesgo | Notas |
|---|---|---|---|---|---|
| `app_opened` | La app carga o se abre la ruta inicial. | No | timestamp, route, mode | Contar aperturas tecnicas por error. | Solo evento tecnico. |
| `qr_access_started` | Se inicia acceso desde QR/token futuro. | No por si solo | timestamp, qrId no personal, stationId, mode | QR accidental o reutilizado. | Crea sesion candidata. |
| `session_started` | Se confirma inicio operativo de recorrido. | Candidata | sessionId, entryRoute, operationalDate, mode | Doble inicio por refresh. | Debe pasar dedupe/tiempo. |
| `station_entered` | La sesion entra a una estacion viva. | Puede validar si cumple reglas | sessionId, stationId, route, timestamp | Acceso directo a ruta. | Validar origen permitido. |
| `station_completed` | Se completa criterio de una estacion. | No individualmente | sessionId, stationId, timestamp | Repeticiones de capa. | Alimenta progreso/maxStationReached. |
| `journey_completed` | Se completa recorrido aprobado. | No duplica uso | sessionId, timestamp, maxStationReached | Doble click de cierre. | Marca recorrido completo. |
| `session_abandoned` | Sesion queda inactiva o sale antes de completar. | Si ya era valida, mantiene conteo valido; si no, no | sessionId, reason, lastSeenAt | Timeout falso. | Diferenciar abandono validado vs candidato. |
| `session_invalidated` | Operador o reglas invalidan sesion. | No | sessionId, reason, timestamp, operatorNote opcional | Uso indebido de invalidacion. | Debe quedar auditado. |
| `daily_rollover` | Cambia dia operativo. | No | previousDate, newDate, timestamp | Cambio manual de reloj. | Cierra/resume reportes. |

## 22. Matriz obligatoria - Opciones de persistencia

| Opcion | Ventaja | Riesgo | Recomendacion | Ticket requerido |
|---|---|---|---|---|
| SQLite local | Consultas confiables, transacciones, reportes derivados, tolera mejor operacion diaria. | Requiere diseno de esquema, backups y posible dependencia/runtime de acceso. | Recomendado para operacion estable. | 009G o ticket de implementacion estable |
| JSONL append-only | Simple, auditable, tolerante a cortes, facil de inspeccionar. | Consultas y dedupe derivados requieren procesamiento; archivo puede crecer. | Recomendado para prototipo controlado. | 009F |
| CSV diario | Facil de abrir y conciliar con caja. | Malo como fuente de eventos; dificil preservar auditoria completa. | Usarlo como export, no como fuente primaria. | 009G |
| LocalStorage | Facil desde navegador. | Fragil, borrable, dificil de auditar, no ideal para PC host. | No recomendado como fuente principal; solo cache auxiliar si se justifica. | Ticket especifico si aplica |
| Archivo diario exportable | Claro para cierre de dia, envio o archivo manual. | Si es unico origen puede perder detalle de eventos. | Recomendado como salida diaria derivada con hash futuro. | 009G/009H |

## 23. Matriz obligatoria - Continuidad

| Opcion | Descripcion | Ventaja | Riesgo | Recomendacion | Ticket siguiente |
|---|---|---|---|---|---|
| 009C-PUSH - Sincronizar arquitectura contador diario | Publicar este documento despues de aprobacion y commit local. | Deja la decision en `origin/main`. | Bajo si el commit queda documental. | Recomendado inmediato. | 009C-PUSH |
| 009D - Disenar transicion W2->W3 y entrada Mundo III | Retomar continuidad de recorrido. | Avanza producto visual/narrativo. | Puede ignorar decisiones de contador si se implementa antes de prototipo. | Viable despues de 009C-PUSH. | 009D |
| 009E - Preparar importacion futura del Excel editorial | Aprovechar arquitectura 009B para contenido final. | Ordena textos antes de mas pantallas. | Requiere formato real de Excel. | Recomendado si el editor avanza primero. | 009E |
| 009F - Prototipo controlado de contador diario sin QR real | Probar eventos, sesion, dedupe y reporte sin QR/camara. | Reduce riesgo antes de operacion real. | Puede tocar runtime/persistencia; requiere ticket estricto. | Recomendado antes de activar QR o conteo real. | 009F |
| 008I - Preparar entorno externo de seguridad | Fortalecer tooling fuera de GVO. | Mejora confianza de validaciones. | Puede distraer del retorno funcional. | Solo si se prioriza seguridad/tooling. | 008I |

## 24. Archivos revisados

- `docs/status/009B_ARQUITECTURA_EDITORIAL_ES_EN.md`
- `docs/status/009A_MUNDO_II_EXPERIENCIA_TEMPORAL.md`
- `docs/status/008G_TRANSICION_W1_W2_Y_BARRA_CARGA.md`
- `docs/security/DECISION_BASELINE_SEGURIDAD_008H.md`
- `src/app/routes.ts`
- `src/app/router.tsx`
- `src/screens/World1Root/World1RootScreen.tsx`
- `src/screens/World2Root/World2RootScreen.tsx`
- `src/screens/TransitionWorld/transitionWorld.config.ts`
- `src/content/transitionEditorialSlots.ts`
- `src/content/world2EditorialSlots.ts`
- listado de `src/content/**`
- listado de `src/screens/TransitionWorld/**`

## 25. Validaciones permitidas

| Comando | Resultado | Estado |
|---|---|---|
| `git status --short --branch` | `## main...origin/main` y `?? docs/status/009C_ARQUITECTURA_CONTADOR_DIARIO_USO.md` | PASO |
| `git log --oneline -n 5` | HEAD `0415cf3 feat: prepare editorial locale architecture 009B` | PASO |
| `git diff --stat` | Sin salida porque el unico archivo de 009C esta sin trackear antes de aprobacion/stage. | EJECUTADO |
| `git diff -- docs/status/009C_ARQUITECTURA_CONTADOR_DIARIO_USO.md` | Sin salida por la misma razon: archivo nuevo sin trackear. | EJECUTADO |
| `git diff --check` | Sin salida; no detecto errores en cambios trackeados. | PASO |

No se ejecutaron scripts npm.

## 26. Siguiente paso recomendado

Despues de aprobacion humana y commit local de 009C:

```text
009C-PUSH - Sincronizar arquitectura contador diario
```

Luego decidir entre:

```text
009D - Disenar transicion W2->W3 y entrada Mundo III
009E - Preparar importacion futura del Excel editorial
009F - Prototipo controlado de contador diario sin QR real
```

No implementar el contador todavia en 009C.

## 27. Confirmaciones finales del reporte

- No se implemento contador.
- No se creo codigo de tracking.
- No se creo base de datos.
- No se crearon archivos `.db`, `.sqlite`, `.jsonl` ni `.csv` operativos.
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
- No se ejecutaron scripts npm.
- No se ejecuto servidor local.
- No se ejecuto baseline completo.
- No se ejecuto `pre-commit`.
- No se ejecuto `gitleaks`.
- No se ejecuto Graphify.
- No se ejecuto SkillCheck.
- No se ejecuto Claude Code, Spec-kit, Gstack, Claude Council ni MCP.
- No se uso red.
- No se hizo push.
- No se creo rama.
- No se creo Pull Request.
- PR_NO_APLICA.
- No se ejecuto `okua-delivery-md`.
