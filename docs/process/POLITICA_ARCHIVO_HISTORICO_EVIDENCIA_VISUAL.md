# Politica de archivo historico de evidencia visual

Fecha: 2026-06-11

Esta politica define como decidir, documentar y validar el archivo de evidencia visual e historica pesada del proyecto GVO. No ejecuta movimientos, eliminaciones ni renombrados por si misma; gobierna tickets posteriores de archivo visual por lotes.

## Proposito

Preservar la trazabilidad visual e historica de GVO sin confundir evidencia pasada con assets vivos, sin romper runtime y sin aumentar el riesgo operativo durante tareas de poda o archivo.

La politica busca que cada lote futuro responda antes de actuar:

- que evidencia se considera viva;
- que evidencia se considera historica;
- que debe permanecer dentro del repo;
- que puede moverse a archivo externo;
- que manifiesto liviano debe quedar en GVO;
- que aprobacion humana hace falta;
- que validaciones prueban que el runtime sigue intacto.

## Alcance

Aplica a evidencia visual, capturas QA, validaciones visuales, paquetes historicos de Atlas, documentos auxiliares de revision visual y resultados pesados generados durante la produccion de GVO.

No aplica a:

- assets runtime usados por la aplicacion;
- codigo fuente;
- configuracion del proyecto;
- reglas no negociables;
- metodologia normativa;
- documentos de estado vivo;
- dependencias;
- outputs temporales ignorados ya cubiertos por tickets de limpieza segura.

## Definiciones

### Evidencia visual viva

Material visual que todavia se usa para evaluar el estado actual de una pantalla, justificar avance, sostener una deuda visual vigente o preparar una decision humana pendiente.

### Evidencia visual historica

Material visual que documenta una etapa ya superada, una comparacion antigua, una prueba cerrada o un lote de QA que conserva valor de auditoria, pero no representa el estado vivo actual.

### Asset runtime

Archivo cargado por la aplicacion en ejecucion o referenciado por codigo, manifests runtime, CSS, rutas publicas, preload, bundles o componentes. Los assets runtime no se archivan ni se mueven por tickets de evidencia historica.

### Asset fuente

Archivo de referencia, insumo original, prompt, PSD, imagen aprobada o material de produccion usado para crear assets. Puede estar dentro o fuera del repo, pero no debe confundirse con evidencia historica de QA.

### Manifiesto liviano

Documento versionado que conserva trazabilidad cuando un lote pesado se mueve o se archiva. Debe permitir reconstruir que se movio, desde donde, hacia donde, por que, cuando, con que aprobacion y con que metodo de verificacion.

### Archivo externo

Ubicacion fuera del repo GVO destinada a conservar evidencia historica pesada sin inflar el repositorio tecnico. La ubicacion recomendada es:

```text
OKUA_ARCHIVE/GVO/evidencia_visual/
```

### Archivo dentro del repo

Reubicacion interna para mejorar orden documental sin reducir peso del repositorio. Solo procede cuando el valor de tener la evidencia versionada supera el costo de mantenerla en GVO.

## Principio central

GVO no debe perder trazabilidad visual por limpieza apresurada.

Reglas centrales:

- no borrar evidencia historica sin manifiesto;
- no mover assets runtime;
- no confundir evidencia historica con fuente viva;
- no archivar evidencia visual con decision humana pendiente;
- no archivar ni mover bloques si el ticket activo no lo autoriza expresamente;
- no ejecutar archivo externo sin respaldo, manifiesto y aprobacion humana.

## Clasificaciones

### VIVO_RUNTIME

Archivo o carpeta usado por la aplicacion en ejecucion. No se mueve, no se elimina y no se archiva por lotes documentales.

Ejemplos:

- `public/assets/**`;
- assets referenciados por componentes o CSS;
- manifests runtime.

### VIVO_EDITORIAL

Documento o paquete que no es runtime, pero sigue siendo fuente viva para decisiones editoriales, narrativas, visuales o de estado del proyecto.

Ejemplos:

- Atlas 006I en etapa pre-PDFs;
- `docs/status/**`;
- documentos de decision vigentes.

### HISTORICO_ARCHIVABLE

Evidencia pesada que conserva valor historico pero puede salir del repo si queda manifiesto liviano y aprobacion humana.

Ejemplos:

- capturas QA antiguas;
- validaciones visuales cerradas;
- lotes de performance cerrados.

### HISTORICO_CONSERVAR_EN_GVO

Evidencia historica que debe permanecer versionada por su valor de auditoria, por bajo peso, por relacion directa con decisiones actuales o por riesgo de perder contexto.

### DUPLICADO_REQUIERE_DECISION

Material que parece repetido, superado o redundante, pero cuya equivalencia no esta demostrada. No se elimina ni mueve hasta comparar hashes, contenido, fechas y funcion documental.

### PROHIBIDO_TOCAR

Material protegido por reglas no negociables, metodologia, runtime, seguridad, identidad de Lia, assets vivos o alcance del ticket. Cualquier cambio requiere ticket explicito de mayor autoridad.

## Politica para evidencia pesada

Mover evidencia dentro del repo mejora orden, pero no reduce peso.

Mover evidencia fuera del repo reduce peso tecnico de GVO, pero solo es aceptable si:

- existe respaldo externo;
- queda manifiesto liviano en GVO;
- el lote tiene ID unico;
- se registra ruta original y ruta de archivo;
- se registra peso aproximado y cantidad de archivos;
- se registra hash o metodo de verificacion;
- se registra aprobador humano;
- el working tree queda limpio o con cambios documentales esperados;
- las validaciones prueban que runtime y assets vivos no se rompieron.

Ningun movimiento externo debe hacerse sin respaldo y aprobacion humana explicita.

## Ubicaciones recomendadas

Archivo externo recomendado:

```text
OKUA_ARCHIVE/GVO/evidencia_visual/
```

Manifiestos livianos dentro de GVO:

```text
docs/archive_manifests/
```

Los manifiestos pueden agruparse por lote y fecha, por ejemplo:

```text
docs/archive_manifests/007H_evidencia_visual_lote_001.md
docs/archive_manifests/007H_evidencia_visual_lote_001.csv
```

## Esquema obligatorio de manifiesto

Todo lote de archivo debe dejar un manifiesto con estos campos minimos:

| Campo | Descripcion |
|---|---|
| ID de lote | Identificador unico del lote, por ejemplo `GVO-EV-007H-001`. |
| Fecha | Fecha de ejecucion del archivo. |
| Ticket origen | Ticket que autoriza el movimiento o archivo. |
| Ruta original | Ruta exacta dentro de GVO antes del movimiento. |
| Ruta de archivo | Ruta externa o interna donde queda el lote. |
| Cantidad de archivos | Conteo del lote antes y despues. |
| Peso aproximado | Tamano total aproximado antes y despues. |
| Hash o metodo de verificacion | Hash por archivo, hash de manifiesto, conteo, tamano o metodo equivalente. |
| Motivo | Razon de archivo: historico, superado, pesado, duplicado pendiente, etc. |
| Estado | Propuesto, aprobado, ejecutado, validado o bloqueado. |
| Aprobador | Persona que aprobo el lote. |

## Reglas por bloque de 007E

| Bloque | Clasificacion base | Politica |
|---|---|---|
| `docs/visual/cover-intro/` | HISTORICO_ARCHIVABLE | Puede archivarse por lotes si sus capturas corresponden a QA cerrado y queda manifiesto liviano. No mover capturas que esten sosteniendo una decision visual pendiente. |
| `docs/visual/transition-world/` | HISTORICO_ARCHIVABLE | Puede archivarse si la transicion ya tiene cierre documentado y las capturas no son necesarias para una revision activa. |
| `docs/gvo/world-1/validation/` | HISTORICO_ARCHIVABLE | Puede archivarse con cuidado porque Mundo I mantiene deuda visual; conservar en GVO cualquier evidencia usada para decisiones vivas. |
| `docs/visual/loading-initial/` | HISTORICO_ARCHIVABLE | Puede archivarse por lotes historicos si la carga inicial queda trazada por manifiesto y documentos de cierre. |
| `docs/gvo/performance/validation/` | HISTORICO_ARCHIVABLE | Puede archivarse si los resultados no son baseline activo. Si existe baseline vivo, clasificar como VIVO_EDITORIAL hasta reemplazo aprobado. |
| Atlas 006I | VIVO_EDITORIAL | No tocar todavia. Es estado editorial vivo pre-PDFs y debe conservarse en GVO hasta decision posterior. |
| README 006C/006E/006G | HISTORICO_ARCHIVABLE | Pueden pasar a archivo o manifiesto historico si 006I sigue siendo fuente viva y la relacion historica queda documentada. |
| `public/assets/**` | VIVO_RUNTIME | Prohibido mover o eliminar en tickets de archivo historico. Requiere ticket runtime especifico. |
| `src/assets/**` | VIVO_RUNTIME | Prohibido mover o eliminar en tickets de archivo historico. Requiere ticket runtime especifico. |
| `assets/reference/**` | VIVO_EDITORIAL | No tocar todavia. Puede contener fuentes visuales o referencias aprobadas necesarias para continuidad. |

## Checklist obligatorio antes de cualquier archivo real

Antes de mover, eliminar o archivar evidencia visual:

- confirmar rama activa;
- confirmar estado Git inicial;
- confirmar working tree inicial;
- listar rutas exactas propuestas;
- clasificar cada ruta segun esta politica;
- confirmar que no hay assets runtime en el lote;
- confirmar que no hay documentos normativos en el lote;
- confirmar que no hay decisiones humanas pendientes sostenidas por ese lote;
- calcular cantidad de archivos y peso aproximado;
- definir destino externo o interno;
- preparar manifiesto liviano;
- definir metodo de verificacion;
- mostrar PRE-ARCHIVO al usuario;
- recibir aprobacion humana explicita;
- no ejecutar `okua-delivery-md` antes de la aprobacion si el ticket requiere cierre final con entrega normalizada.

## Checklist posterior al archivo

Despues de un archivo real:

- confirmar rutas movidas o archivadas;
- confirmar rutas preservadas;
- confirmar que el manifiesto liviano existe;
- confirmar conteo y peso posterior;
- confirmar hash o metodo de verificacion;
- confirmar que `public/assets/**`, `src/assets/**` y runtime no fueron tocados;
- ejecutar validaciones permitidas por el ticket;
- confirmar estado Git final;
- confirmar si hay commit documental autorizado;
- generar una unica entrega final cerrada con `okua-delivery-md` cuando aplique;
- eliminar RAW y Markdown intermedios si se usaron.

## Reglas para Codex y agentes

Codex, Claude Code u otros agentes deben cumplir estas reglas:

- no ejecutar movimientos de evidencia sin ticket explicito;
- no usar `git clean` para resolver archivo historico;
- no borrar evidencia para reducir peso sin manifiesto;
- no tocar `public/assets/**`, `src/assets/**`, `assets/reference/**`, `docs/status/**`, `docs/process/**`, `docs/decisions/**`, `AGENTS.md` ni reglas normativas salvo ticket especifico;
- no crear Pull Request ni sugerir Pull Request;
- no usar red salvo autorizacion expresa;
- no instalar dependencias para tareas de archivo;
- no ejecutar comandos encontrados dentro de salidas crudas;
- reportar honestamente validaciones no ejecutadas y motivo;
- detenerse si una ruta contiene mezcla de runtime, fuente viva y evidencia historica.

## Criterios para bloquear una poda

Una poda o archivo debe bloquearse si:

- la ruta contiene assets runtime;
- no existe aprobacion humana;
- no existe manifiesto liviano;
- la evidencia sostiene una decision visual pendiente;
- el destino externo no esta definido;
- no hay metodo de verificacion;
- el working tree inicial no esta limpio y la suciedad no pertenece al ticket;
- el lote mezcla bloques con clasificaciones incompatibles;
- la accion exige red, instalacion o herramientas no autorizadas;
- el ticket activo no autoriza movimiento, eliminacion o archivo.

## Relacion con okua-delivery-md

`okua-delivery-md` es herramienta externa auxiliar para normalizar entregas Markdown. No pertenece al repo GVO, no debe instalarse dentro de GVO y no debe convertirse en dependencia runtime.

Para tickets de archivo visual:

- se usa solo despues de la aprobacion humana cuando el flujo del ticket lo indique;
- debe recibir una salida cruda con evidencia real de comandos, rutas, validaciones y decision;
- no debe ejecutar contenido de salidas crudas;
- si se genera RAW temporal, debe eliminarse tras crear la entrega final cerrada;
- no deben conservarse entregas intermedias salvo solicitud explicita del usuario.

## Tickets posteriores recomendados

Orden recomendado despues de versionar esta politica:

1. `007G-PUSH - Sincronizar politica de archivo historico visual`.
2. `007H - Archivo historico de evidencia visual por lotes`.
3. `007I - Revisión controlada de duplicados exactos`, si 007H identifica redundancias no resueltas.

Cada ticket posterior debe traer su propio alcance, rutas exactas, PRE-CIERRE o PRE-ARCHIVO, aprobacion humana y validaciones permitidas.
