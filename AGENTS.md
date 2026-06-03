# Instrucciones para Codex

Este repositorio corresponde a GVO — Guía Virtual OKÚA. Todo cambio debe respetar las reglas no negociables del proyecto y mantenerse dentro del ticket activo.

## Reglas de trabajo

- No romper las reglas no negociables documentadas en `docs/01_REGLAS_NO_NEGOCIABLES.md`.
- No implementar pantallas sin ticket aprobado.
- No cargar recursos externos, CDN, fuentes remotas, imágenes remotas ni APIs externas.
- No agregar audio, librerías de audio, reproducción de sonido ni permisos innecesarios.
- No modificar la identidad de Lía sin instrucción explícita.
- No cambiar arquitectura, flujo o metodología sin actualizar documentación y ADR si aplica.
- No crear Pull Requests ni sugerir PR como siguiente paso. El proyecto tiene un único mantenedor; cuando corresponda publicar trabajo, hacer commit y push directo a la rama indicada por el ticket.
- Antes de proponer o crear una rama para la siguiente pantalla, verificar que la pantalla actual esté documentada como `APROBADA_PARA_AVANZAR` o `CERRADA_APROBADA_FINAL` según `docs/process/METODOLOGIA_AVANCE_POR_UMBRAL_VISUAL.md`. Si no lo está, detener el avance de fase y continuar la iteración de la pantalla actual.
- El avance por umbral visual requiere calificación del usuario >= 7/10 y aprobación explícita del usuario Ing. José David; no avanzar sin autorización explícita aunque exista una rama disponible.
- Antes de implementar una pantalla, deben existir assets, prompts, herramientas, criterios visuales, límites técnicos y ticket funcional aprobado.
- Codex no debe inventar arte, identidad visual, portales, Lía ni assets finales; puede documentar, estructurar prompts y montar runtime solo cuando el ticket lo autorice.
- Ejecutar pruebas antes de cerrar un ticket.
- Reportar honestamente cualquier validación que no se pudo ejecutar.

## Cierre de tickets

Cada ticket debe quedar pequeño, cerrable, documentado y probado. Si el alcance empieza a crecer, dividir el trabajo antes de implementar.

## Metodología GVO por pantalla

- Trabajar siempre por tickets pequeños, acotados y verificables.
- No avanzar a una pantalla nueva sin cierre explícito de la pantalla actual.
- No recomendar el siguiente paso en la salida final; la planificación del siguiente ticket la define el usuario con Ari.
- Reportar solo ejecución, archivos creados/modificados, validaciones, fallos, bloqueos, deudas y estado final del repo.
- No usar assets inventados cuando el ticket pida assets aprobados o runtime real.
- No animar placeholders como si fueran resultado final.
- Si un asset debe animarse, pedirlo o usarlo por piezas, estados o frames.
- Mantener textos finales en DOM/CSS, no incrustados en imagen, salvo ticket explícito.
- No usar CDN, audio, video runtime pesado, Three.js ni dependencias pesadas sin autorización explícita.
- Al cerrar una pantalla aprobada por el usuario, generar documento de cierre, handoff para nuevo chat, prompt base de auditoría para la fase siguiente, validación técnica final y merge/checkpoint cuando el ticket lo autorice.
