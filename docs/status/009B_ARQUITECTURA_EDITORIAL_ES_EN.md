# 009B - Arquitectura editorial ES/EN

Fecha: 2026-06-14

## 1. Proposito

Preparar una capa editorial minima para que GVO consuma textos temporales por `slotId`, con soporte tecnico inicial para locales `es` y `en`, fallback explicito hacia `es` y compatibilidad futura con el Excel editorial.

Este ticket no reemplaza textos por contenido final, no importa Excel, no implementa selector visible de idioma, no guarda preferencia de idioma, no implementa contador diario y no construye Mundo III.

## 2. Alcance

El alcance aplicado fue:

- crear tipos editoriales compartidos;
- crear registry central por `slotId`;
- crear soporte minimo de locales `es` y `en`;
- crear resolver editorial con fallback `en -> es`;
- migrar los textos temporales actuales de transicion W1->W2 y Mundo II hacia la capa editorial;
- mantener compatibilidad con los modulos consumidos por `TransitionWorld` y `World2RootScreen`;
- crear pruebas focalizadas del resolver;
- crear este reporte documental.

No se tocaron rutas, assets, Mundo I, carga inicial, `package.json`, lockfiles ni configuracion del proyecto.

## 3. Estado Git inicial

```text
## main...origin/main
```

Ultimo commit sincronizado al iniciar:

```text
df2b968 feat: build Mundo II temporary experience 009A
```

## 4. Estructura editorial previa

Antes de 009B, los textos temporales estaban separados en:

- `src/content/transitionEditorialSlots.ts`;
- `src/content/world2EditorialSlots.ts`.

Cada archivo exponia estructuras utiles para su pantalla, pero no existia un registry comun por `slotId`, ni tipos compartidos de locale/source/status, ni fallback tecnico `en -> es`.

## 5. Estructura editorial nueva

Se agrego:

```text
src/content/editorial/
  editorialTypes.ts
  editorialLocales.ts
  editorialRegistry.ts
  resolveEditorialText.ts
  editorialRegistry.test.ts
  index.ts
```

La fuente comun de textos temporales ahora vive en `editorialRegistry.ts`. Los modulos historicos de contenido siguen existiendo como adaptadores compatibles para las pantallas actuales.

## 6. Archivos creados

- `src/content/editorial/editorialTypes.ts`
- `src/content/editorial/editorialLocales.ts`
- `src/content/editorial/editorialRegistry.ts`
- `src/content/editorial/resolveEditorialText.ts`
- `src/content/editorial/editorialRegistry.test.ts`
- `src/content/editorial/index.ts`
- `docs/status/009B_ARQUITECTURA_EDITORIAL_ES_EN.md`

## 7. Archivos modificados

- `src/content/transitionEditorialSlots.ts`
- `src/content/world2EditorialSlots.ts`

## 8. Locales soportados

Locales soportados tecnicamente:

```text
es
en
```

Locale por defecto:

```text
es
```

No se agregaron textos finales en ingles. Los textos actuales permanecen en `es` y con `status: "TEMP"`.

## 9. Fallback implementado

La funcion `resolveEditorialText(slotId, { locale })` aplica estas reglas:

- si no se pide locale, usa `es`;
- si se pide `es`, resuelve `es`;
- si se pide `en` y no existe entrada `en`, usa fallback explicito a `es`;
- si se pide un locale no soportado, se normaliza a `es`;
- si el `slotId` no existe, lanza error controlado.

El resultado expone:

- `requestedLocale`;
- `resolvedLocale`;
- `fallbackUsed`.

## 10. Textos temporales preservados

Se preservaron los textos temporales de:

- transicion W1->W2: 2 slots;
- Mundo II: 32 slots.

Todos los textos migrados mantienen:

```text
status: "TEMP"
source: "temporary"
```

No se cambio el sentido editorial de los textos.

## 11. Pantallas conectadas al resolver

No se modificaron directamente los componentes de pantalla. La conexion se hizo por adaptadores de contenido:

- `TransitionWorld` sigue consumiendo `worldOneToWorldTwoTransitionCopy` desde `transitionEditorialSlots.ts`;
- `World2RootScreen` sigue consumiendo `world2EditorialSlots` y `world2LayerDefinitions` desde `world2EditorialSlots.ts`;
- ambos modulos derivan ahora sus textos desde `resolveEditorialText`.

Esto evita cambios visuales y mantiene compatibilidad con los tests existentes.

## 12. Compatibilidad con Excel futuro

El registry queda preparado para reemplazar entradas temporales por datos normalizados del Excel editorial en un ticket posterior.

Mapeo previsto:

- `ID` -> `slotId`;
- `Texto final` -> `text`;
- `Alternativa corta` -> `shortText`;
- `Notas escritor` -> `notes`;
- `Estado de revision` -> `status`.

No se implemento importador ni parser de Excel.

## 13. Confirmaciones de alcance

| Confirmacion | Estado |
|---|---|
| No se importo Excel | Confirmado |
| No se reemplazaron textos finales | Confirmado |
| No se implemento selector ES/EN | Confirmado |
| No se guardo preferencia de idioma | Confirmado |
| No se implemento contador diario | Confirmado |
| No se construyo Mundo III | Confirmado |
| No se construyo transicion W2->W3 real | Confirmado |
| No se modificaron assets | Confirmado |
| No se tocaron rutas app | Confirmado |
| No se instalaron dependencias | Confirmado |

## 14. Matriz obligatoria - Arquitectura editorial

| Area | Archivo | Cambio aplicado | Motivo | Riesgo | Validacion |
|---|---|---|---|---|---|
| Tipos editoriales | `src/content/editorial/editorialTypes.ts` | Define locale, status, source, emitter, entry, registry y resolved text. | Unificar contrato editorial runtime. | Bajo: archivo nuevo y aislado. | `npm run test -- editorial` |
| Locales ES/EN | `src/content/editorial/editorialLocales.ts` | Define `es` como default, soporta `es` y `en`, normaliza locales. | Preparar seleccion futura sin UI. | Bajo: sin selector ni persistencia. | `npm run test -- editorial` |
| Resolver editorial | `src/content/editorial/resolveEditorialText.ts` | Resuelve por `slotId` y locale, con fallback explicito a `es`. | Evitar reescribir pantallas cuando llegue Excel/EN. | Medio-bajo: nuevo punto comun de lectura. | `npm run test -- editorial` |
| Fallback ES | `src/content/editorial/resolveEditorialText.ts` | Si `en` no tiene texto, devuelve `es` con `fallbackUsed: true`. | Mantener experiencia estable sin inventar traducciones. | Bajo: probado por caso focalizado. | `npm run test -- editorial` |
| Textos temporales transicion | `src/content/editorial/editorialRegistry.ts`, `src/content/transitionEditorialSlots.ts` | Migra 2 slots W1->W2 al registry y conserva adaptador existente. | Centralizar contenido sin tocar pantalla. | Bajo: API publica preservada. | `npm run test -- TransitionWorld` |
| Textos temporales Mundo II | `src/content/editorial/editorialRegistry.ts`, `src/content/world2EditorialSlots.ts` | Migra 32 slots W2 al registry y conserva adaptador existente. | Preparar reemplazo editorial futuro. | Medio-bajo: muchas entradas centralizadas. | `npm run test -- World2RootScreen` |
| Compatibilidad Excel | `src/content/editorial/editorialTypes.ts`, este documento | Campos `slotId`, `text`, `shortText`, `notes`, `status`, `source`. | Alinear runtime con columnas futuras del editor. | Bajo: no se parsea Excel todavia. | Revision documental |
| World2RootScreen | `src/content/world2EditorialSlots.ts` | La pantalla conserva imports actuales, pero recibe slots desde resolver. | Evitar cambio visual/runtime directo. | Bajo: test de pantalla pasa. | `npm run test -- World2RootScreen` |
| TransitionWorld | `src/content/transitionEditorialSlots.ts` | La transicion conserva config actual, pero los textos salen del resolver. | Mantener W1->W2 funcional. | Bajo: test de transicion pasa. | `npm run test -- TransitionWorld` |
| Tests focalizados | `src/content/editorial/editorialRegistry.test.ts` | Prueba locale default, fallback EN, locale no soportado, slot inexistente y TEMP/temporary. | Hacer verificable la regla ES/EN. | Bajo. | `npm run test -- editorial` |

## 15. Matriz obligatoria - Mapeo Excel futuro

| Columna Excel | Campo runtime | Uso previsto | Implementado ahora | Pendiente |
|---|---|---|---|---|
| ID | `slotId` | Identificar cada texto reemplazable. | Si | Importador/validador de Excel. |
| Texto final | `text` | Reemplazar copy temporal aprobado. | Campo existe | Cargar desde Excel cuando este aprobado. |
| Alternativa corta | `shortText` | Version compacta para UI o accesibilidad. | Campo existe | Definir reglas de uso por pantalla. |
| Notas escritor | `notes` | Preservar instrucciones editoriales. | Campo existe | Cargar notas reales desde Excel. |
| Estado de revision | `status` | Controlar TEMP/DRAFT/REVIEW/APPROVED/FINAL. | Tipos existen | Politica de promocion editorial. |
| Emisor sugerido | `emitter` | Distinguir Lía, ambiente, interfaz o sistema. | Campo existe | Validar vocabulario final con editor. |
| Funcion del texto | `notes` o campo futuro | Clasificar intro, hint, confirmacion, accesible. | Parcial mediante `slotId` y notas. | Decidir si merece campo dedicado. |
| Concepto obligatorio | `notes` o campo futuro | Proteger conceptos del PDF A. | No | Definir campo en importador futuro. |
| Evitar | `notes` o campo futuro | Evitar terminos prohibidos o falsas promesas. | No | Definir regla editorial futura. |
| Longitud sugerida | `shortText` o campo futuro | Controlar densidad de texto por UI. | Parcial | Definir limites por slot. |
| Imagen Atlas | No aplica directo | Relacionar texto con referencia visual si aplica. | No | Evaluar solo si hay ticket de mapeo visual/editorial. |

## 16. Matriz obligatoria - Continuidad

| Opcion | Descripcion | Ventaja | Riesgo | Recomendacion | Ticket siguiente |
|---|---|---|---|---|---|
| 009B-PUSH - Sincronizar arquitectura editorial ES/EN | Publicar el commit de 009B despues de aprobacion humana. | Deja main remoto con la arquitectura editorial. | Bajo si el commit local queda limpio. | Recomendado primero. | 009B-PUSH |
| 009C - Disenar contador diario de uso | Planificar contador diario pendiente. | Atiende una deuda de experiencia futura. | Medio: puede tocar estado, persistencia o reglas de privacidad. | No hacerlo todavia salvo decision humana explicita. | 009C |
| 009D - Disenar transicion W2->W3 y entrada Mundo III | Preparar continuidad narrativa/visual hacia Mundo III. | Retoma avance funcional. | Alto si se hace sin assets y criterios aprobados. | Evaluar despues de sincronizar 009B. | 009D |
| 009E - Preparar importacion futura del Excel editorial | Disenar ingestion controlada de Excel sin activar contenido final aun. | Aprovecha arquitectura 009B. | Medio: requiere formato real de Excel y validaciones. | Recomendado antes de reemplazar textos finales. | 009E |
| 008I - Preparar entorno externo de seguridad | Retomar tooling externo de seguridad fuera de GVO. | Mejora confianza operativa. | Medio: puede distraer del retorno funcional. | Solo si se prioriza seguridad antes de Mundo III. | 008I |

## 17. Gates parciales ejecutados

| Comando | Resultado | Estado |
|---|---|---|
| `npm run test -- editorial` | 1 archivo, 5 tests pasaron. | PASO |
| `npm run test -- World2RootScreen` | 1 archivo, 2 tests pasaron. | PASO |
| `npm run test -- TransitionWorld` | 1 archivo, 11 tests pasaron. | PASO |
| `npm run lint` | ESLint completo sin errores. | PASO |
| `git diff --check` | Sin errores de whitespace; Git aviso normalizacion futura LF->CRLF en dos archivos modificados. | PASO |
| `git status --short --branch` | `## main...origin/main` con cambios locales de 009B pendientes de aprobacion/commit. | PASO |
| `git log --oneline -n 5` | HEAD sigue en `df2b968 feat: build Mundo II temporary experience 009A`. | PASO |

## 18. Estado Git al PRE-CIERRE

Estado al completar la implementacion antes de aprobacion humana:

```text
## main...origin/main
 M src/content/transitionEditorialSlots.ts
 M src/content/world2EditorialSlots.ts
?? docs/status/009B_ARQUITECTURA_EDITORIAL_ES_EN.md
?? src/content/editorial/
```

## 19. Gates no ejecutados por regla

No se ejecuto:

- `npm run build`;
- `npm run check`;
- `npm run format`;
- `npm audit`;
- `npm install`;
- `npm update`;
- `npx`;
- baseline completo;
- `pre-commit`;
- `gitleaks`;
- `scripts/run_security_checks.ps1`;
- Graphify;
- SkillCheck;
- Claude Code;
- Spec-kit;
- Gstack;
- Claude Council;
- MCP.

## 20. Riesgos residuales

| Riesgo | Estado | Mitigacion |
|---|---|---|
| El registry crece manualmente mientras no exista importador de Excel. | Abierto | Crear 009E para preparar ingestion controlada. |
| Textos `en` aun no existen. | Esperado | Fallback explicito `en -> es`; no inventar traducciones. |
| `status` editorial todavia no gobierna UI. | Aceptado | Mantener solo metadato hasta que haya politica editorial. |
| `World2RootScreen` mantiene algunos textos de UI fuera del registry, como el boton de inicio y notas de salida. | Abierto | Evaluar en ticket editorial posterior si deben convertirse en slots. |

## 21. Siguiente paso recomendado

Despues de aprobacion humana y commit local de 009B:

```text
009B-PUSH - Sincronizar arquitectura editorial ES/EN
```

Luego decidir entre:

```text
009D - Disenar transicion W2->W3 y entrada Mundo III
009E - Preparar importacion futura del Excel editorial
```

No implementar contador diario todavia salvo decision humana explicita posterior.
