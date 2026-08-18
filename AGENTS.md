# Instrucciones para Codex — GVO

Este repositorio corresponde a GVO — Guía Virtual OKÚA. Todo cambio debe
respetar el ticket activo y `docs/01_REGLAS_NO_NEGOCIABLES.md`.

## Fuentes de autoridad

Leer primero:

1. `README.md`
2. `AGENTS.md`
3. `docs/field/FIELD_PC_HANDOFF.md`
4. `docs/status/CURRENT_STATE.md`
5. `docs/01_REGLAS_NO_NEGOCIABLES.md`
6. documentación específica del ticket

`CURRENT_STATE.md` es la fuente viva. Las actas
`HUMAN_APPROVED/PUBLISHED` tienen autoridad posterior a sus informes
`FOR_REVIEW`, que se preservan como evidencia histórica.

## Reglas compartidas

- Ejecutar el cambio mínimo verificable y mantener los tickets pequeños.
- No implementar pantallas, flujo, narrativa, copy, identidad o assets sin
  ticket y aprobación aplicables.
- No cargar CDN, recursos remotos, fuentes remotas, APIs externas ni servicios
  online en runtime.
- No agregar audio, micrófono, video pesado, Three.js ni dependencias pesadas
  sin autorización explícita.
- Lía es el único avatar guía y conserva exactamente cinco pétalos.
- Mantener el flujo secuencial y los guards de progreso.
- Preferir abstracciones cercanas al consumidor; no introducir arquitectura
  genérica ni frameworks internos para necesidades hipotéticas.
- No mezclar feature, refactor y limpieza salvo que el ticket lo requiera.
- Ejecutar y reportar pruebas antes del cierre; no convertir validación técnica
  en aprobación humana.
- No crear ni sugerir Pull Requests. Cuando el ticket autorice publicar, hacer
  commit y push directo a la rama indicada.
- `main` es la única rama operativa. No crear ramas salvo ticket explícito.

## Modo PC de desarrollo

El PC de desarrollo atiende features, assets, pruebas, documentación y
publicación.

- Confirmar rama, SHA remoto, divergencia y worktree antes de editar.
- Respetar aprobación por umbral visual antes de avanzar pantallas.
- Mantener textos finales en DOM/CSS salvo autorización explícita.
- Antes de integrar o documentar assets runtime, leer
  `docs/process/POLITICA_ASSETS_UTILIZADOS_RUNTIME.md` y
  `public/assets/gvo/current-used/README.md`.
- Registrar cada asset runtime usado bajo
  `public/assets/gvo/current-used/<pantalla>/`; el Atlas no reemplaza ese
  registro.
- No usar placeholders animados como resultado final.
- Al publicar, verificar `HEAD`, `origin/main`, remoto, divergencia y worktree.

## Modo PC de campo

El PC de campo atiende exclusivamente deployment, red, TLS/DNS y QA físico.

- Trabajar sobre `main` limpio y actualizar mediante `git pull --ff-only`.
- No reabrir assets, narrativa, copy ni comportamiento ya aprobados.
- No usar la CA local de desarrollo como solución TLS del visitante.
- No instalar app, PWA, CA, certificado, extensión ni scanner en dispositivos
  visitantes.
- No generar QR de red o `/qr/start` antes de cerrar MikroTik, hostname y TLS.
- No hornear IP en QR canónicos.
- Host provisional: `gvo`. FQDN final:
  `gvo.<dominio-real-controlado-por-OKÚA>`.
- No usar `.local` como sustituto de un dominio confiable públicamente.
- Certificar cámara y recorrido completo en dispositivos físicos antes de
  declarar el despliegue de campo listo.
- No crear ramas ni cambiar runtime salvo ticket humano explícito.

## Metodología por pantalla y cierre

- No avanzar a otra pantalla sin estado `APROBADA_PARA_AVANZAR` o
  `CERRADA_APROBADA_FINAL` y aprobación explícita del Ing. José David.
- Antes de implementar deben existir assets, prompts, herramientas, criterios,
  límites técnicos y ticket funcional aprobado.
- Un cierre debe registrar ejecución, archivos, validaciones, fallos, bloqueos,
  deuda y estado final; no debe inventar el siguiente ticket.
- Si un cambio altera arquitectura, flujo u operación, actualizar la
  documentación y el ADR correspondiente.
