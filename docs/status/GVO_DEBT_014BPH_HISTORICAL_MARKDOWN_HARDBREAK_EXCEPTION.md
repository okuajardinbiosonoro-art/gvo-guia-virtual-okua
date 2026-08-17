# GVO_DEBT_014BPH — Excepción histórica de hardbreaks Markdown

## 1. Identidad y autoridad

| Campo | Valor |
| ----- | ----- |
| Proyecto | GVO — Guía Virtual OKÚA |
| Fase | `PROJECT DEBT CORRECTION` |
| Fecha | 2026-08-17 (`America/Bogota`) |
| Baseline | `458c788843a3eb12beaee844ac407bae166f7c50` |
| Autoridad humana | Ing. José David |
| Ticket | `GVO_DEBT_014BPH` |
| Estado | `PUBLICATION_EXCEPTION_ACCEPTED` |

La autoridad humana acepta exclusivamente nueve hardbreaks Markdown
intencionales ya presentes en cinco documentos históricos staged de la cadena
`GVO_DEBT_013 → GVO_DEBT_014B`. Esta excepción permite completar la publicación
014BP sin modificar, normalizar ni reformatear esos documentos.

```text
TOTAL_FINDINGS = 9
HISTORICAL_MARKDOWN_HARDBREAKS = 9
ALL_OTHER_FINDINGS = 0
FILES = 5
```

## 2. Documentos congelados

| Documento | Líneas | Findings | SHA-256 preservado |
| --------- | ------ | -------- | ----------------- |
| `docs/qa/GVO_DEBT_014B_MOBILE_FULLSCREEN_REAL_DEVICE_QA.md` | 3 | 1 | `768ae66274aadb15698235932a7d4a4d0254c045f0f7c8aab879163ad390658f` |
| `docs/status/GVO_DEBT_013C_APPROVED_COVER_PORTAL_INTERIORS_INTEGRATION_FOR_REVIEW.md` | 3 | 1 | `b60dedaa876cf8c4cf449fe3b4bf8a20f45e3fc9fadf22d3494fc3827cfbe40d` |
| `docs/status/GVO_DEBT_014A_REAL_FULLSCREEN_ENABLEMENT_FOR_REVIEW.md` | 3, 4, 232, 233 | 4 | `76c503ed2eb96667095e93242cae9563cced0017b0f7409513586b6741531c90` |
| `docs/status/GVO_DEBT_014B_MOBILE_FULLSCREEN_CONTRACT_FOR_REVIEW.md` | 3, 4 | 2 | `220a1e3daa98468b9a0c2790c0d490344e25dfe2525d8e32a76c083f7c199234` |
| `docs/status/GVO_DEBT_014_GLOBAL_FULLSCREEN_COVER_REVISIT_AND_PORTAL1_FIT_FOR_REVIEW.md` | 3 | 1 | `a610d9335ae68d3a7540526c19b4dc7d9e61d4601e1e33492a1b427a946450c7` |

Los bytes del working tree y del blob staged son idénticos en los cinco casos.
Cada finding termina exactamente en dos espacios ASCII, sintaxis Markdown para
un salto de línea explícito. No existe un tercer espacio, otro whitespace final
ni un cambio de line endings dentro de esta excepción.

## 3. Inventario de los nueve findings

| Documento | Línea | Espacios | Contenido antes del hardbreak |
| --------- | ----: | -------: | ----------------------------- |
| QA móvil 014B | 3 | 2 | `Estado: PENDING_REAL_DEVICE_QA` |
| Informe 013C | 3 | 2 | `Fecha de ejecución: 2026-08-16` |
| Informe 014A | 3 | 2 | `Fecha de ejecución: 2026-08-16` |
| Informe 014A | 4 | 2 | `Estado: PENDING_HUMAN_REVIEW` |
| Informe 014A | 232 | 2 | `Sin commit.` |
| Informe 014A | 233 | 2 | `Sin push.` |
| Informe 014B | 3 | 2 | `Estado de implementación: GVO_DEBT_014B_MOBILE_FULLSCREEN_IMPLEMENTATION_COMPLETE_FOR_HUMAN_REVIEW` |
| Informe 014B | 4 | 2 | `Estado de aprobación: PENDING_HUMAN_REVIEW` |
| Informe 014 | 3 | 2 | `Fecha de ejecución: 2026-08-16` |

## 4. Verificación scoped

| Control | Resultado |
| ------- | --------- |
| `git diff --cached --check` | Exit `2`; exactamente los 9 findings allowlisted |
| Archivos con findings | 5 documentos históricos Markdown |
| Check excluyendo únicamente la allowlist | PASS — exit `0`, sin salida |
| Código, JSON, TS/TSX, CSS, manifests, herramientas y configuración | PASS — 0 findings |
| Acta 014BP y `CURRENT_STATE.md` | PASS — 0 findings |
| Findings fuera de la allowlist | 0 |

La clasificación es `ACCEPTED_SCOPED_EXCEPTION`, no un PASS absoluto ni una
excepción general de whitespace.

## 5. Preservación y límites

No se eliminan los espacios, no se sustituyen por `<br>`, no se ejecuta
Prettier sobre los históricos y no se cambian encoding o line endings. La
excepción no cubre código, configuración, JSON, manifests, assets, el acta
014BP ni este registro.

`GVO_DEBT_005PA` continúa siendo una excepción independiente y limitada a su
propio informe DEBT_005. Esta acta no amplía, modifica ni reutiliza aquella
allowlist; registra una autoridad nueva y cerrada para los cinco documentos y
nueve líneas enumerados arriba.

## 6. Estado vinculante

```text
PUBLICATION_EXCEPTION_ACCEPTED

9 historical Markdown hardbreaks
5 frozen documents
0 other findings
normalization prohibited
publication may resume under GVO_DEBT_014BPH
```
