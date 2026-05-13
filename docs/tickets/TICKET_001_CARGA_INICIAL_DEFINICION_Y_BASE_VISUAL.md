# TICKET 001: Carga inicial definición y base visual

## Objetivo

Crear la primera versión estática, clara y mobile-first de la pantalla de carga inicial pre-portada de GVO, usando los insumos de referencia obligatorios del proyecto.

## Estado de cierre

BLOQUEADO.

Código de bloqueo: `BLOCKED_REFERENCE_INPUTS_MISSING`.

## Alcance previsto

- Implementar la pantalla real de carga inicial pre-portada.
- Mantener `/carga` como ruta de la pantalla de carga.
- Evaluar si `/` también debe mostrar la carga inicial.
- Respetar estrictamente la identidad de Lía.
- Mantener operación local sin Internet, sin audio y sin recursos externos.
- Agregar prueba mínima o smoke test de la pantalla cuando existan los insumos.

## Fuera de alcance

- Portada / Intro.
- Estaciones reales.
- Final.
- Pantalla reutilizable de transición entre mundos.
- Scanner QR interno funcional.
- Flujo completo de navegación.
- Animaciones avanzadas.
- Audio, música, sonidos o librerías de audio.
- Recursos externos, CDN, fuentes remotas, APIs externas o imágenes remotas.
- Cambios de arquitectura, stack o metodología de ramas.
- Pull Request.

## Insumos de referencia usados

No se usaron insumos de referencia porque no existen todavía los archivos requeridos.

Rutas revisadas:

- `docs/source_specs/`
- `assets/reference/screens/`

Archivos encontrados:

- `docs/source_specs/.gitkeep`
- `assets/reference/screens/.gitkeep`

Archivos faltantes:

- TXT de especificación de la pantalla de carga inicial pre-portada.
- PNG de referencia visual de la pantalla de carga inicial pre-portada.

Ubicación esperada:

- `docs/source_specs/001_carga_inicial_pre_portada.txt`
- `assets/reference/screens/001_carga_inicial_pre_portada.png`

Si los nombres finales cambian, deben estar claramente asociados a la carga inicial pre-portada.

## Decisiones visuales tomadas

No se tomaron decisiones visuales nuevas. El trabajo funcional se detuvo antes de modificar componentes visuales porque faltan el TXT y el PNG de referencia.

## Cómo se respetó la identidad de Lía

No se implementó ni modificó ninguna representación de Lía. Esto evita inventar una versión alternativa sin los insumos aprobados. La próxima implementación debe conservar exactamente cinco pétalos, cabeza cristal opalescente, ojos en media luna cerrada, collar ámbar, bulbo inferior segmentado y ausencia de boca, nariz, cejas, brazos, manos, piernas y pies.

## Rutas afectadas

Ninguna. `/carga` y `/` siguen mostrando el placeholder técnico existente.

## Archivos modificados

- `docs/tickets/TICKET_001_CARGA_INICIAL_DEFINICION_Y_BASE_VISUAL.md`
- `docs/status/ESTADO_ACTUAL_PROYECTO.md`

No se modificó código de la aplicación.

## Pruebas ejecutadas y resultado

- `npm run lint`: OK.
- `npm run test`: OK. 1 suite, 5 tests.
- `npm run build`: OK. Build Vite + PWA generado.
- `npm run audit:assets`: OK. Sin URLs externas, CDN ni uso de audio.
- `npm run test:e2e`: OK. 1 smoke test en mobile-chromium.

## Limitaciones pendientes para tickets futuros

- Agregar el TXT de especificación de carga inicial pre-portada en `docs/source_specs/`.
- Agregar el PNG de referencia visual en `assets/reference/screens/`.
- Reabrir la implementación funcional solo cuando existan ambos insumos o cuando el ticket autorice explícitamente un cierre parcial.
- Implementar la pantalla estática sin avanzar a portada, estaciones, transición ni animaciones avanzadas.
