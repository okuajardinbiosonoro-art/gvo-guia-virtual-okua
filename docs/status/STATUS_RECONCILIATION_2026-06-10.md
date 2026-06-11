# Reconciliación de estado — 2026-06-10

Fecha: 2026-06-10
Rama: `baseline/funcional-organizacion-2026-06-10`
Tipo: auditoría documental sin cambio runtime.

## Propósito

Este documento identifica discrepancias entre el estado documental histórico y el estado funcional observado del repo para evitar que Codex avance con premisas equivocadas.

No implementa features. No declara aprobación visual. No reemplaza la decisión del usuario Ing. José David.

## Hallazgo principal

La documentación histórica todavía describe `/estacion/1` como placeholder técnico o Mundo I no implementado.

Sin embargo, el repo reciente contiene señales de una base funcional de Mundo I:

- `src/screens/World1Root/World1RootScreen.tsx` existe.
- `/estacion/1` renderiza `World1RootScreen` desde el router.
- Hay assets registrados para `world1RootInitial`, `world1RootRelation`, `world1RootPerception`, `world1RootMediation` y `world1RootReady`.
- Hay commits recientes asociados a Mundo I, incluyendo estabilización mobile, interacción estática y eliminación de salida temporal.

Esto sugiere que el estado documental debe actualizarse de:

```text
PLACEHOLDER_TECNICO / MUNDO_I_NO_IMPLEMENTADO
```

hacia un estado más preciso, pendiente de revisión visual del usuario:

```text
BASE_FUNCIONAL_MUNDO_I / NO_CERRADA_FINAL / PENDIENTE_RECONCILIACION_VISUAL
```

## Estado recomendado provisional

Hasta que el usuario emita decisión visual explícita, usar:

```text
Estación I — Mundo I: BASE_FUNCIONAL_TECNICA / NO_CERRADA_FINAL / PENDIENTE_REVISION_VISUAL
```

Esto significa:

- no es solo placeholder técnico;
- tampoco está aprobada como final;
- no debe desbloquear automáticamente Estación II;
- puede ser auditada, limpiada y documentada;
- cualquier avance narrativo o visual requiere ticket explícito.

## Impacto operativo

Antes de seguir con nuevas features, Codex debe:

1. Actualizar README y estado documental para reflejar Mundo I con precisión.
2. Separar deuda técnica de deuda visual.
3. No declarar `APROBADA_PARA_AVANZAR` sin calificación explícita del usuario.
4. No abrir avance a Estación II si Mundo I no tiene decisión visual suficiente.

## Estado por pantalla propuesto para documentación actualizada

| Pantalla | Estado documental recomendado | Nota |
| --- | --- | --- |
| Carga inicial | `APROBADA_PARA_AVANZAR / 7.2_DE_10 / DEUDA_VISUAL_DOCUMENTADA` | No final 9/10. |
| Portada / Intro | `APROBADA_PARA_AVANZAR / 7.8_DE_10 / DEUDA_VISUAL_DOCUMENTADA / NO_CERRADA_FINAL` | Avance permitido documentado. |
| Transición | `APROBADA_PARA_AVANZAR / 7.9_DE_10 / FUNCIONAL_INTEGRADA / DEUDA_VISUAL_DOCUMENTADA` | Integrada entre portada y estación I. |
| Estación I — Mundo I | `BASE_FUNCIONAL_TECNICA / NO_CERRADA_FINAL / PENDIENTE_REVISION_VISUAL` | No debe seguir figurando como no implementada si el código actual se conserva. |
| Estación II | `NO_INICIADA / BLOQUEADA` | No avanzar sin decisión sobre Mundo I. |
| Estación III | `NO_INICIADA / BLOQUEADA` | Bloqueada. |
| Estación IV | `NO_INICIADA / BLOQUEADA` | Bloqueada. |
| Estación V | `NO_INICIADA / BLOQUEADA` | Bloqueada. |
| Final | `NO_INICIADA / BLOQUEADO` | Bloqueado. |

## Deuda detectada

### Deuda documental

- README raíz desactualizado respecto a Mundo I.
- `docs/status/ESTADO_ACTUAL_PROYECTO.md` conserva fecha 2026-06-02 y no refleja todos los commits posteriores.
- La matriz de estados debe incorporar Mundo I como base técnica si se confirma el código actual.
- Falta índice corto de pantallas para onboarding.

### Deuda técnica potencial

- `src/app/router.tsx` concentra lógica de rutas y componentes de ruta.
- `CoverIntroScreen.tsx` concentra demasiadas responsabilidades.
- `World1RootScreen.tsx` mezcla contenido, estado y render.
- No se detectó workflow CI en `.github/workflows/` durante esta revisión.

### Deuda de proceso

- Hay que distinguir con mayor rigor:
  - placeholder técnico;
  - base funcional técnica;
  - aprobada para avanzar;
  - cerrada final.

## Recomendación de actualización documental

Actualizar README y estado documental con una fórmula prudente:

```text
Mundo I cuenta con una base funcional técnica en `/estacion/1`, pero no está cerrado como pantalla final ni desbloquea automáticamente Estación II. Requiere revisión visual, documentación de deuda y decisión explícita del usuario para quedar `APROBADA_PARA_AVANZAR`.
```

## Reglas para tickets siguientes

Hasta cerrar esta reconciliación:

- No implementar Estación II.
- No declarar Mundo I final.
- No reescribir Mundo I.
- No refactorizar visualmente Mundo I.
- Sí se permite documentación, auditoría y limpieza sin cambio visual.

## Validación esperada

Como este documento no modifica runtime, la validación mínima es:

```powershell
npm run status
```

Si se actualiza README o `ESTADO_ACTUAL_PROYECTO.md`, volver a ejecutar:

```powershell
npm run status
```

Si luego se toca código, ejecutar:

```powershell
npm run check
```

## Estado de cierre de este documento

Este documento deja constancia de la discrepancia. No la resuelve por completo hasta que se actualicen README y `docs/status/ESTADO_ACTUAL_PROYECTO.md`, o hasta que el usuario decida explícitamente el estado de Mundo I.
