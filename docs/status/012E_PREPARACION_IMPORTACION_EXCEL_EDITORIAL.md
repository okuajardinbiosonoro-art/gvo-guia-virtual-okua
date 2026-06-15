# 012E - Preparacion importacion Excel editorial

## 1. Proposito

Preparar el contrato documental para una futura importacion controlada del Excel editorial hacia GVO, sin importar Excel, sin leer archivos externos de Excel, sin modificar runtime y sin reemplazar textos `TEMP`.

Este documento deja inventariados los slots editoriales actuales, el contrato minimo esperado del Excel, las validaciones obligatorias futuras, la estrategia de fallback ES/EN y los riesgos residuales antes de crear cualquier validador o importador.

## 2. Alcance

Tipo de ticket:

```text
PREPARACION_DOCUMENTAL_IMPORTACION_EXCEL_SIN_RUNTIME
```

Alcance aplicado:

- revisar en modo solo lectura la arquitectura editorial existente;
- contar los slots actuales por bloque funcional;
- documentar el estado dominante actual de locale, status y source;
- definir un contrato futuro Excel -> GVO;
- proponer validaciones futuras para evitar importaciones ambiguas o peligrosas;
- registrar riesgos y fases futuras;
- crear un unico documento de estado en `docs/status/`.

Fuera de alcance:

- importar Excel;
- leer Excel externo;
- copiar Excel al repo;
- crear parser, CLI, endpoint o script;
- modificar `src/**`, runtime, pantallas, rutas, assets, tests, `package.json`, lockfiles o configuracion;
- crear traducciones `en`;
- implementar selector visible ES/EN;
- implementar contador diario;
- activar QR/camara;
- ejecutar scripts npm, servidor local, baseline completo o herramientas externas.

## 3. Estado Git inicial

```text
## main...origin/main
```

Working tree inicial: limpio.

Ultimo commit sincronizado observado:

```text
86d5708 docs: review full W1 Final flow 013A
```

## 4. Ultimos commits relevantes

```text
86d5708 docs: review full W1 Final flow 013A
f0241a2 feat: build Mirador final temporary experience 012C
4d22527 feat: prepare W5 final transition and Mirador entry 012B
446a976 feat: build Mundo V temporary experience 012A
d16fe0b feat: prepare W4 W5 transition and Mundo V entry 011B
07bf5ad feat: build Mundo IV temporary experience 011A
1dea327 feat: prepare W3 W4 transition and Mundo IV entry 010B
1e28129 feat: build Mundo III temporary experience 010A
```

## 5. Archivos revisados

Revisados en modo solo lectura:

- `src/content/editorial/editorialTypes.ts`
- `src/content/editorial/editorialLocales.ts`
- `src/content/editorial/editorialRegistry.ts`
- `src/content/editorial/resolveEditorialText.ts`
- `src/content/editorial/editorialRegistry.test.ts`
- `src/content/transitionEditorialSlots.ts`
- `src/content/world2EditorialSlots.ts`
- `src/content/world3EditorialSlots.ts`
- `src/content/world4EditorialSlots.ts`
- `src/content/world5EditorialSlots.ts`
- `src/content/finalEditorialSlots.ts`
- `docs/status/009B_ARQUITECTURA_EDITORIAL_ES_EN.md`
- `docs/status/013A_REVISION_FUNCIONAL_INTEGRAL_W1_FINAL.md`

No se detectaron ausencias en las fuentes requeridas por el ticket.

## 6. Confirmacion de no lectura/importacion real del Excel

No se importo Excel.

No se copio Excel al repositorio.

No se leyo ningun Excel externo.

No se creo fixture Excel, `.xlsx`, `.csv`, `.json`, `.jsonl`, `.db` ni `.sqlite`.

No se genero ningun dato importado.

## 7. Inventario de slots por bloque

| Bloque | Archivo actual | Cantidad de slots | Ejemplos de Slot ID | Locale dominante | Status dominante | Source dominante | Riesgo | Accion futura |
|---|---|---:|---|---|---|---|---|---|
| Transiciones | `src/content/transitionEditorialSlots.ts` + `src/content/editorial/editorialRegistry.ts` | 10 | `TRANS_W1_W2_TITLE_01`, `TRANS_W2_W3_SUB_01`, `TRANS_W5_FINAL_TITLE_01` | `es` | `TEMP` | `temporary` | Algunos textos de transicion siguen temporales y los adaptadores exponen `status: "temporary"` en minuscula para compatibilidad runtime. | Validar equivalencia Excel -> registry y mantener adaptadores sin cambio hasta importacion aprobada. |
| Mundo II | `src/content/world2EditorialSlots.ts` + registry | 32 | `W2_INTRO_LIA_01`, `W2_PLANTA_HINT_01`, `W2_CONTINUE_BTN_01` | `es` | `TEMP` | `temporary` | Bloque completo depende de textos temporales; algunos botones tienen texto visible sin prefijo `TEMP` pero status `TEMP`. | Mapear todos los `W2_*` contra Excel y bloquear faltantes/duplicados. |
| Mundo III | `src/content/world3EditorialSlots.ts` + registry | 23 | `W3_INTRO_LIA_01`, `W3_PROTOTIPO_NOTE_01`, `W3_CONTINUE_BTN_01` | `es` | `TEMP` | `temporary` | La secuencia editorial esta completa pero no finalizada; requiere revision del tono de prueba/ajuste. | Validar el bloque `W3_*` antes de importar textos finales ES. |
| Mundo IV | `src/content/world4EditorialSlots.ts` + registry | 40 | `W4_INTRO_SYS_01`, `W4_BIONOSIFICADOR_CARD_01`, `W4_CONTINUE_BTN_01` | `es` | `TEMP` | `temporary` | Es el bloque mas grande y tecnico; alto riesgo de inconsistencias terminologicas. | Priorizar validacion de conceptos tecnicos y emisores antes de importacion. |
| Mundo V | `src/content/world5EditorialSlots.ts` + registry | 24 | `W5_INTRO_LIA_01`, `W5_PLANTAS_HINT_01`, `W5_FINAL_BTN_01` | `es` | `TEMP` | `temporary` | Bloque de sintesis narrativa; riesgo de mezclar cierre conceptual con instrucciones de UI. | Revisar emisor, longitud y rol de cada slot antes de reemplazar. |
| Pantalla Final | `src/content/finalEditorialSlots.ts` + registry | 30 | `FINAL_TITLE_01`, `FINAL_ACCESS_I_LABEL_01`, `FINAL_RESTART_CONFIRM_BTN_01` | `es` | `TEMP` | `temporary` | Incluye acciones criticas de cierre/reinicio; riesgo de importar textos ambiguos en acciones. | Validar copy de acciones criticas y accesibilidad antes de importacion. |

Total minimo inventariado:

```text
159 slots
```

## 8. Estado actual de textos TEMP

La arquitectura editorial actual define:

- `EditorialLocale = "es" | "en"`;
- `EditorialStatus = "TEMP" | "DRAFT" | "REVIEW" | "APPROVED" | "FINAL"`;
- `EditorialSource = "temporary" | "editorial_excel" | "fallback"`;
- `EditorialEmitter = "ambiente" | "interfaz" | "lia" | "sistema"`.

El registry actual crea entradas por medio de `temporaryEsEntry`, con:

```text
locale: es
status: TEMP
source: temporary
```

Observacion editorial:

- el estado dominante es `TEMP`;
- el idioma dominante es `es`;
- la fuente dominante es `temporary`;
- no existen traducciones `en` cargadas como contenido final;
- algunos textos visibles no llevan prefijo literal `TEMP`, por ejemplo botones `Continuar`, pero su metadata sigue siendo `status: "TEMP"` y `source: "temporary"`.

## 9. Contrato futuro Excel -> GVO

El contrato futuro debe mapear cada fila editorial hacia una entrada de registry por `slotId`, locale y estado.

Equivalencias propuestas con la estructura runtime actual:

- `Slot ID` -> `slotId`;
- `Emisor` -> `emitter`;
- `Idioma` -> `locale`;
- `Estado de revision` -> `status`;
- `Texto final` -> `text`;
- `Alternativa corta` -> `shortText`;
- `Notas implementacion` -> `notes` o campo de auditoria complementario;
- `Bloque` y `Orden` -> metadata de validacion/reporte, no necesariamente runtime;
- `Texto base / intencion` y `Notas escritor` -> evidencia editorial y trazabilidad.

La fuente `source` no debe inferirse a ciegas desde el Excel. Para una importacion aprobada debe quedar como `editorial_excel`; para fallback tecnico debe quedar como `fallback`; para contenido no reemplazado debe permanecer `temporary`.

## 10. Columnas minimas recomendadas

| Columna Excel | Obligatoria | Tipo esperado | Uso en GVO | Validacion | Riesgo si falta |
|---|---|---|---|---|---|
| `Bloque` | Si | Texto controlado | Agrupar slots por Transiciones, Mundo II, Mundo III, Mundo IV, Mundo V o Pantalla Final. | Debe mapear a bloque conocido. | Dificulta auditoria y reportes por pantalla. |
| `Orden` | Si | Entero positivo o codigo ordenable | Preservar orden editorial dentro del bloque. | Debe ser unico por bloque o estar justificado. | Puede desordenar secuencias narrativas. |
| `Slot ID` | Si | Texto exacto | Identificador principal contra registry. | Debe existir en registry y no repetirse por idioma. | Bloquea importacion segura. |
| `Emisor` | Si | Lista cerrada | Mapear a `ambiente`, `interfaz`, `lia` o `sistema`. | Debe estar en vocabulario permitido. | Puede cambiar voz narrativa o responsabilidades de UI. |
| `Texto base / intencion` | Recomendado | Texto | Preservar intencion editorial y comparacion con TEMP. | Debe estar presente para revision humana cuando haya cambios sustanciales. | Reduce trazabilidad editorial. |
| `Texto final` | Si para estados finales | Texto no vacio | Alimentar `text`. | No vacio si estado es `APROBADO` o `FINAL`; sin prefijo `TEMP`. | Importaria contenido incompleto o placeholder. |
| `Alternativa corta` | Recomendado | Texto breve o vacio | Alimentar `shortText` cuando exista version compacta. | Longitud controlada por tipo de slot. | UI puede quedar densa o inconsistente. |
| `Idioma` | Si | `es` o `en` | Alimentar `locale`. | Debe normalizar a locale soportado. | Rompe fallback o mezcla idiomas. |
| `Estado de revision` | Si | Lista cerrada | Controlar promocion editorial. | Debe estar en lista acordada. | Importacion accidental de borradores. |
| `Notas escritor` | Recomendado | Texto | Trazabilidad de criterio editorial. | Debe conservarse en reporte aunque no sea runtime. | Pierde contexto de decisiones. |
| `Notas implementacion` | Recomendado | Texto | Alertar limites tecnicos, accesibilidad o UI. | Debe reportarse en diff de importacion. | Aumenta riesgo de cambios runtime no auditados. |

## 11. Reglas de validacion futura

| Validacion | Objetivo | Bloquea importacion | Como reportarla | Ticket sugerido |
|---|---|---|---|---|
| Cada `Slot ID` del Excel existe en registry | Evitar crear slots invisibles o no soportados. | Si | Reporte de faltantes/nuevos por bloque. | 012F |
| No hay `Slot ID` duplicado por idioma | Evitar conflictos de fuente de verdad. | Si | Tabla de duplicados con filas Excel. | 012F |
| `Texto final` no esta vacio en estados finales | Evitar publicar huecos editoriales. | Si | Lista de slots con texto final vacio. | 012F |
| `Idioma` mapea a `es` o `en` | Mantener contrato runtime actual. | Si | Lista de idiomas invalidos y normalizacion rechazada. | 012F |
| `Estado de revision` esta en lista cerrada | Evitar estados libres imposibles de gobernar. | Si | Tabla de estados desconocidos. | 012F |
| Textos finales no contienen prefijo `TEMP` | Evitar arrastrar placeholders a contenido final. | Si para `APROBADO`/`FINAL` | Lista de textos finales contaminados. | 012F |
| Slots no usados se reportan sin eliminar | Preservar trazabilidad del registry. | No siempre | Seccion de slots sin fila Excel. | 012G |
| Slots nuevos bloquean importacion hasta aprobacion | Impedir cambios de contrato no autorizados. | Si | Seccion de slots nuevos propuestos. | 012G |
| Importador genera diff auditable | Permitir revision humana antes de tocar runtime. | Si | Markdown/CSV de diff fuera de runtime, segun ticket futuro. | 012G |
| Importador no modifica runtime sin aprobacion humana | Mantener gobernanza GVO. | Si | PRE-CIERRE obligatorio antes de escribir cambios. | 012H |

## 12. Estrategia de fallback ES/EN

Reglas recomendadas:

1. `es` sigue siendo idioma base.
2. `en` debe hacer fallback a `es` si no existe traduccion aprobada.
3. No se deben inventar traducciones automaticas.
4. Las traducciones `en` deben venir del Excel o de una revision editorial aprobada.
5. El selector visible de idioma queda fuera de este ticket.

Estado tecnico actual:

- `EDITORIAL_DEFAULT_LOCALE` es `es`;
- locales soportados: `es`, `en`;
- `normalizeEditorialLocale()` solo conserva `en` cuando llega exactamente `en`; cualquier otro valor vuelve a `es`;
- `resolveEditorialText()` resuelve directo si existe entrada del locale solicitado y, si no, cae a `es`;
- el resultado expone `requestedLocale`, `resolvedLocale` y `fallbackUsed`.

## 13. Reglas de seguridad editorial

- El Excel no debe convertirse en dependencia runtime.
- El Excel no debe copiarse al repo salvo ticket explicito que lo autorice.
- Un importador futuro debe ser offline, auditable y reversible.
- Cualquier lectura de Excel debe estar aprobada por ticket especifico.
- Ningun texto `FINAL` debe entrar sin diff revisable.
- Los estados `BORRADOR` y `EN_REVISION` no deben reemplazar runtime productivo.
- Los slots nuevos deben bloquear importacion hasta aprobacion humana.
- Los slots faltantes deben reportarse; no deben eliminarse silenciosamente del registry.
- La importacion no debe tocar pantallas, rutas, assets, QR/camara, contador diario ni configuracion.
- El importador futuro no debe instalar dependencias ni usar red durante ejecucion en GVO.

## 14. Estados editoriales recomendados

Lista cerrada propuesta para el Excel:

```text
TEMP
BORRADOR
EN_REVISION
APROBADO
FINAL
DESCARTADO
```

Aclaracion de compatibilidad:

El codigo actual usa estados en ingles:

```text
TEMP
DRAFT
REVIEW
APPROVED
FINAL
```

Antes de implementar importacion real, el ticket futuro debe alinear nombres con el Excel vigente. Puede hacerse por mapeo controlado, por ejemplo `BORRADOR -> DRAFT`, `EN_REVISION -> REVIEW`, `APROBADO -> APPROVED`, o ajustando tipos solo si el ticket lo autoriza.

## 15. Propuesta de fases futuras

| Fase | Objetivo | Salida esperada | Runtime | Observacion |
|---|---|---|---|---|
| `012E-PUSH` | Sincronizar este plan documental. | Commit documental publicado. | No toca. | Paso inmediato despues de aprobar 012E. |
| `012F` | Crear validador offline de Excel sin modificar runtime. | Validador local controlado o especificacion ejecutable segun alcance aprobado. | No toca. | Debe poder fallar sin escribir cambios. |
| `012G` | Generar reporte de diferencias Excel vs registry. | Diff auditable de slots, estados, textos y riesgos. | No toca. | Recomendado despues de tener validador. |
| `012H` | Importacion controlada de textos ES aprobados. | Cambio limitado al registry o fuente editorial autorizada. | Solo si se aprueba. | Requiere PRE-CIERRE y diff humano. |
| `012I` | Preparar estrategia EN/fallback. | Politica y/o carga controlada de traducciones `en`. | Solo si se aprueba. | No traducir automaticamente. |

Secuencia recomendada:

```text
012E-PUSH -> 012F -> 012G -> 012H -> 012I
```

Justificacion: conviene crear y probar el validador antes de producir reportes de diferencias y mucho antes de cualquier importacion real.

## 16. Riesgos residuales

| Riesgo | Impacto | Probabilidad | Bloqueante | Mitigacion | Ticket sugerido |
|---|---|---|---|---|---|
| Excel no versionado | Medio | Alta | No para este ticket; si para importacion real | Registrar ruta/fuente aprobada y hash del archivo externo en ticket futuro. | 012F |
| Estructura Excel distinta al registry | Alto | Media | Si | Validar columnas y equivalencias antes de leer datos como fuente. | 012F |
| Slots faltantes | Alto | Media | Si para importacion completa | Reportar faltantes por bloque y no eliminar registry. | 012G |
| Slots duplicados | Alto | Media | Si | Bloquear importacion y listar filas duplicadas. | 012F |
| Textos finales vacios | Alto | Media | Si en estados finales | Bloquear `APROBADO`/`FINAL` con texto vacio. | 012F |
| Traducciones EN incompletas | Medio | Alta | No si existe fallback ES | Mantener fallback `en -> es` y reportar cobertura EN. | 012I |
| Prefijos TEMP no removidos | Medio | Media | Si en estados finales | Validar que `Texto final` no contenga prefijo `TEMP`. | 012F |
| Importacion accidental de borradores | Alto | Media | Si | Estados cerrados y bloqueo para `BORRADOR`/`EN_REVISION`. | 012F |
| Cambios runtime no auditados | Alto | Baja/media | Si | PRE-CIERRE, diff auditable y aprobacion humana antes de escribir. | 012H |
| Dependencias para leer Excel | Medio | Media | Si no estan aprobadas | Evaluar herramienta offline local sin runtime y sin instalacion no autorizada. | 012F |
| Binarios Excel dentro del repo | Medio | Media | Si no hay autorizacion explicita | Mantener Excel fuera de GVO y registrar evidencia externa. | 012F |

## 17. Recomendacion de siguiente ticket

Siguiente ticket recomendado inmediato:

```text
012E-PUSH - Sincronizar preparacion importacion Excel editorial
```

Luego, para avanzar hacia importacion real sin mezclar riesgos:

```text
012F - Crear validador offline de Excel sin modificar runtime
```

## 18. Matriz de continuidad

| Opcion | Descripcion | Ventaja | Riesgo | Recomendacion | Ticket siguiente |
|---|---|---|---|---|---|
| `012E-PUSH` | Sincronizar preparacion importacion Excel editorial. | Cierra y publica el contrato documental. | Bajo si el working tree queda limpio. | Recomendado inmediato. | `012E-PUSH` |
| `012F` | Crear validador offline de Excel sin modificar runtime. | Reduce riesgo antes de cualquier importacion. | Puede requerir decidir herramienta de lectura Excel. | Recomendado despues de push. | `012F` |
| `012G` | Generar reporte de diferencias Excel vs registry. | Permite revision humana del impacto. | Sin validador previo puede duplicar trabajo. | Recomendado despues de 012F. | `012G` |
| `012D` | Prototipo controlado de contador diario sin QR real. | Atiende deuda funcional independiente. | Distrae de la deuda editorial principal. | Posponer salvo prioridad humana. | `012D` |
| `013B` | Pulido funcional menor W1 -> Final. | Atiende residuales de experiencia. | Puede mezclar pulido con contenido final si no se acota. | Alternativa si se prioriza estabilidad visual. | `013B` |
| `008I` | Preparar entorno externo de seguridad. | Fortalece gobernanza externa. | No desbloquea importacion editorial. | Posponer salvo necesidad de seguridad. | `008I` |

## 19. Validaciones ejecutadas

| Comando | Resultado | Estado |
|---|---|---|
| `git status --short --branch` | `## main...origin/main` al inicio. | Paso |
| `git log --oneline -n 8` | HEAD `86d5708 docs: review full W1 Final flow 013A`. | Paso |
| `git diff --check` | Sin salida. | Paso |

No se ejecutaron scripts npm, tests, servidor local ni baseline completo porque el ticket es documental y prohibe tocar runtime.

## 20. Confirmaciones de alcance

- No se importo Excel.
- No se copio Excel al repo.
- No se leyo Excel externo sin autorizacion.
- No se creo script.
- No se creo parser.
- No se creo CLI.
- No se creo endpoint.
- No se modifico runtime.
- No se modifico `src/**`.
- No se modifico `public/**`.
- No se modifico `assets/**`.
- No se modifico `docs/archive_manifests/**`.
- No se modifico `docs/visual/**`.
- No se modifico `docs/gvo/world-1/validation/**`.
- No se modifico `docs/gvo/performance/validation/**`.
- No se modifico `package.json`.
- No se modifico `package-lock.json`.
- No se modifico `.gitignore`.
- No se modifico `.pre-commit-config.yaml`.
- No se modifico `requirements-security.txt`.
- No se modifico `scripts/run_security_checks.ps1`.
- No se modifico `index.html`.
- No se modificaron tests.
- No se instalaron dependencias.
- No se ejecuto `npm install`.
- No se ejecuto `npm update`.
- No se ejecuto `npx`.
- No se ejecuto `npm audit`.
- No se ejecuto `npm run build`.
- No se ejecuto `npm run check`.
- No se ejecuto `npm run format`.
- No se ejecutaron scripts npm.
- No se ejecuto servidor local.
- No se implemento selector ES/EN visible.
- No se implemento contador diario.
- No se activo QR/camara.
- No se ejecuto baseline completo.
- No se ejecuto `pre-commit`.
- No se ejecuto `gitleaks`.
- No se ejecuto `scripts/run_security_checks.ps1`.
- No se ejecuto Graphify.
- No se ejecuto SkillCheck.
- No se ejecuto Claude Code, Spec-kit, Gstack, Claude Council ni MCP.
- No se crearon carpetas `.agents`, `.codex`, `.claude`, `.cursor`, `skills` ni `.mcp*`.
- No se crearon hooks.
- No se creo configuracion MCP.
- No se creo rama.
- No se hizo push.
- No se creo Pull Request.
- `PR_NO_APLICA`.
- No se ejecuto `okua-delivery-md` antes de aprobacion humana.
