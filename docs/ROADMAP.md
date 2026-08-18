# Roadmap de GVO

Actualizado: 2026-08-18

## Fases completadas

- Recorrido narrativo y visual de Carga, Entrada, Portada, Mundos I–V,
  transiciones y Mirador.
- Cierre de la fase Mirador con assets, composición, motion, revisita y reset.
- `GVO_DEBT_001→015`: auditoría, progreso, checkpoints, evidencia, responsive,
  shell, QR, PWA, performance, entrada, assets, fullscreen y scanner interno.
- Publicación del flujo QR interestación y canonicalización del repositorio.

## Fase actual

```text
FIELD DEPLOYMENT PREPARATION
```

El trabajo siguiente ocurre en el PC y la red de campo. No autoriza nuevas
features, cambios visuales ni reapertura de assets aprobados.

## Gates de campo

| Gate | Alcance | Criterio de cierre |
| --- | --- | --- |
| F1 | Field repo/bootstrap verification | Clone/pull de `main`, `npm ci`, build y smoke reproducibles |
| F2 | MikroTik/network inventory | Topología, direccionamiento, aislamiento y alcance documentados |
| F3 | Stable hostname + trusted TLS | FQDN controlado y HTTPS confiable sin instalación en visitantes |
| F4 | Camera secure-origin physical certification | Grant, decode y lifecycle reales en iPhone y Android |
| F5 | Network/start QR generation | QR de red e inicio generados sólo después de F2–F4 |
| F6 | Complete physical journey | Recorrido I→V→Mirador completo en dispositivos reales |
| F7 | Offline/reconnect/field soak | Continuidad, reconexión y operación prolongada verificadas |
| F8 | Field documentation + publish | Evidencia, operación y estado de campo publicados |

No se asignan nuevos identificadores `GVO_DEBT` sin ticket humano posterior.
La descripción operativa está en
[`field/FIELD_PC_HANDOFF.md`](field/FIELD_PC_HANDOFF.md).
