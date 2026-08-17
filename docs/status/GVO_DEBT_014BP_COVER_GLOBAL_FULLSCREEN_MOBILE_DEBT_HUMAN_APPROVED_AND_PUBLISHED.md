# GVO_DEBT_014BP — Aprobación humana y publicación de Portada, fullscreen global y contrato móvil

## 1. Identidad y autoridad

| Campo | Valor |
| ----- | ----- |
| Proyecto | GVO — Guía Virtual OKÚA |
| Fase | `PROJECT DEBT CORRECTION` |
| Fecha | 2026-08-17 (`America/Bogota`) |
| Baseline | `458c788843a3eb12beaee844ac407bae166f7c50` |
| Autoridad humana | Ing. José David |
| Estado humano | `HUMAN_APPROVED_WITH_ACCEPTED_TECHNICAL_DEBT` |
| SHA publicado | `SELF` |

La decisión humana vinculante aprueba la cadena local acumulada
`GVO_DEBT_013 → GVO_DEBT_014B` y acepta expresamente como deuda técnica la
certificación de fullscreen real en dispositivos móviles físicos. Los informes
históricos `FOR_REVIEW` conservan el estado y la evidencia de su fecha; esta
acta posterior es la autoridad de publicación y no los reescribe.

`SELF` identifica el único commit que contiene la cadena aprobada, esta acta y
la actualización de `CURRENT_STATE.md`. Adquiere efecto de publicación cuando
ese mismo commit queda disponible en `origin/main`.

## 2. Cadena incluida

- `GVO_DEBT_013 — Entry and Cover Visual Assets Completion`.
- `GVO_DEBT_013A — Cover Portal Visual Asset Inventory`.
- `GVO_DEBT_013B — Current Station Capture Pack`.
- `GVO_DEBT_013C — Approved Cover Portal Interiors Integration`.
- `GVO_DEBT_014 — Global Fullscreen Continuity, Cover Revisit Unlock and Portal I Fit`.
- `GVO_DEBT_014A — Real Fullscreen Enablement`.
- `GVO_DEBT_014B — Mobile Fullscreen Contract`.

## 3. Entrada, Portada y assets publicados

`/inicio` publica la composición visual aprobada, selección `Español / English`,
persistencia `gvo.language.v1`, CTA de entrada, accesibilidad, responsive y el
contrato fullscreen/fallback. Cuando la plataforma no ofrece Fullscreen API
real, no se presenta un botón muerto: se informa el fallback y el visitante
puede continuar.

Portada publica interiores HUMAN_APPROVED diferentes para sus cinco portales:

| Portal | Mundo | Interior |
| ------ | ----- | -------- |
| I | Mundo Raíz | Raíces y brote |
| II | Pulso invisible | Planta, electrodo y onda |
| III | Cuaderno de pruebas | Cuaderno y marcas |
| IV | Mesa de sistema | Mesa, red y nodo central |
| V | Mapa del presente | Mapa y sectores |

Los assets de Mirador dejan de operar como interiores provisionales de Portada
y permanecen preservados para `/inicio` y Final. Portal I cierra con overflow
de `0 px`; frames, glow, locks, números romanos, labels, Lía, CTA y motion se
conservan. Los 15 binarios aprobados, las 20 copias de repositorio y los cinco
pares runtime/`current-used` permanecen íntegros y byte-idénticos.

## 4. Revisita Mirador → Portada

Una revisita válida desde Mirador vuelve a Portada con Portales I–V
desbloqueados y acceso a cualquiera de los cinco Mundos. La autoridad combina
`gvo.final.reviewContext.v1`, progreso completo I–V y guards canónicos.

La publicación preserva el gating de primera visita, el progreso parcial y el
fallo cerrado: una sesión nueva o un contexto inválido no obtiene bypass.

## 5. Fullscreen global y certificación desktop

En plataformas y contextos que exponen Fullscreen API real queda publicada una
sola autoridad global. Portada, Mundos I–V y Mirador usan el control compartido;
las transiciones no lo duplican y `/inicio` conserva su interacción de entrada.
Entrada, salida, rechazo y contexto bloqueado están sincronizados sin impedir el
recorrido, con contrato ES/EN, teclado, touch, foco visible y reduced motion.

La prueba real de escritorio queda certificada en:

- Chrome desktop: `PASS`.
- Edge desktop: `PASS`.
- Opera GX desktop: `PASS`.

## 6. Deuda técnica móvil aceptada

```text
MOBILE REAL FULLSCREEN
→ NOT CERTIFIED ACROSS PHYSICAL DEVICES
→ DEFERRED TECHNICAL DEBT
→ DOES NOT BLOCK PUBLICATION
```

Durante la implementación no hubo dispositivo físico disponible y no se
inventa evidencia: `REAL_DEVICE_QA=NOT_EXECUTED_NO_DEVICE_AVAILABLE`. La
revisión humana posterior confirmó que fullscreen real no fue consistente en
los celulares disponibles y aceptó resolverlo en un frente posterior.

Estado publicado:

- Android: `ANDROID_REAL_FULLSCREEN = NOT_CERTIFIED`; quedan pendientes marca,
  modelo, navegador/versión, URL LAN, Permissions Policy, feature detection,
  permisos/contexto y portrait/landscape.
- iPhone/iOS: `PLATFORM_DEPENDENT / NOT_CERTIFIED`; si la API no existe se
  oculta el control roto, se informa el fallback y el recorrido continúa.
- Mobile fallback: `HUMAN_APPROVED / PUBLISHED`.

No se declara `ANDROID_REAL_FULLSCREEN_PASS`,
`IPHONE_PRODUCT_FALLBACK_PASS` ni fullscreen real donde la plataforma no lo
concede. La certificación física queda abierta como deuda no bloqueante.

## 7. Contrato visitante y probe QA

El contrato vinculante permanece:

```text
QR → navegador → experiencia
```

No se exige instalar una app o PWA, usar Add to Home Screen ni configurar
permisos. Cambiar esta garantía requiere una nueva decisión humana explícita.

`/qa/fullscreen/index.html` se publica sólo como diagnóstico para una campaña
física posterior. No está enlazado desde el recorrido y no forma parte de la
interfaz visitante.

## 8. Evidencia técnica publicada

| Validación | Resultado |
| ---------- | --------- |
| `npm run audit:assets` | PASS — sin URLs externas, CDN ni audio |
| `npm run lint` | PASS |
| `npm test -- --maxWorkers=1` | PASS — 42 archivos / 522 pruebas |
| `npx tsc -b --pretty false` | PASS |
| `npm run build` | PASS — 609 módulos; PWA generada |
| Verificador `GVO_DEBT_013C` | PASS — 15 aprobados, 20 copias, 5 pares runtime/mirror, manifests equivalentes |
| Verificador `GVO_DEBT_014` | PASS |
| Contrato E2E `GVO_DEBT_014A` | PASS — 5/5 |
| Contrato E2E `GVO_DEBT_014B` | PASS — 7/7; automatización, no evidencia física |
| Matriz visual `GVO_DEBT_014` | PASS — 11/11 |
| `npm run test:e2e` | PASS — 176/176 |
| `git diff --cached --check` | `ACCEPTED_SCOPED_EXCEPTION` — 9 historical Markdown hardbreaks / 5 files / 0 other findings |
| `docs/visual` | Intacto |

El verificador 013C conserva el SHA-256 del ZIP aprobado
`b70b2604dd5e960a0057c10d269f756c18e3cd47411d84348b395e0f119a78cc`.
El build mantiene 49 entradas / 14.829,05 KiB de precache y el warning
informativo histórico del chunk principal mayor a 500 kB. Dependencias,
lockfile, configuración PWA/Workbox y `docs/visual` permanecen sin cambios.
La excepción de whitespace está documentada y acotada en
[GVO_DEBT_014BPH_HISTORICAL_MARKDOWN_HARDBREAK_EXCEPTION.md](GVO_DEBT_014BPH_HISTORICAL_MARKDOWN_HARDBREAK_EXCEPTION.md);
no autoriza ningún hallazgo adicional ni la normalización de los documentos
históricos.

## 9. Deuda futura concreta

La única deuda abierta de esta publicación es:

```text
MOBILE REAL FULLSCREEN / PHYSICAL DEVICE CERTIFICATION
DEFERRED / NON_BLOCKING
```

Debe abordarse con dispositivos físicos, navegadores reales y URL LAN. No
bloquea el roadmap actual y no convierte la fase completa
`PROJECT DEBT CORRECTION` en terminada; continúan existiendo otros frentes
editoriales o funcionales bajo tickets separados.

## 10. Estado de publicación

Estado vinculante al publicarse el commit `SELF` en `origin/main`:

```text
GVO_DEBT_013C
HUMAN_APPROVED / PUBLISHED

GVO_DEBT_014
HUMAN_APPROVED / PUBLISHED

GVO_DEBT_014A
DESKTOP_REAL_FULLSCREEN / HUMAN_APPROVED / PUBLISHED

GVO_DEBT_014B
MOBILE_CONTRACT_AND_FALLBACK / HUMAN_APPROVED_WITH_ACCEPTED_TECHNICAL_DEBT / PUBLISHED

MOBILE REAL FULLSCREEN / PHYSICAL DEVICE CERTIFICATION
DEFERRED / NON_BLOCKING
```
