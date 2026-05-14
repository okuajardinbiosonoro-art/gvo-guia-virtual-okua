# TICKET 001: Carga inicial definición y base visual

## Objetivo

Crear la primera versión estática, clara y mobile-first de la pantalla de carga inicial pre-portada de GVO.

La pantalla reemplaza el placeholder técnico inicial y comunica que el recorrido se está preparando desde una acción de cuidado: Lía riega una planta joven antes de entrar a la portada.

## Alcance

- Implementar la pantalla real de carga inicial pre-portada.
- Conectar `/carga` a la pantalla real.
- Mantener `/` como primera pantalla del flujo y conectarla también a la carga inicial.
- Usar insumos locales de referencia.
- Respetar identidad de Lía.
- Mantener operación local sin Internet, sin audio, sin CDN y sin recursos externos.
- Agregar prueba de componente y smoke e2e.

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

- TXT: `docs/source_specs/001_carga_inicial_pre_portada.txt`.
- PNG de referencia: `assets/reference/screens/001_carga_inicial_pre_portada.png`.
- PNG runtime local: `public/assets/runtime/loading-initial-pre-portada.png`.

Los insumos originales se tomaron desde:

- `C:\Users\JOSE DAVID\Desktop\OKÚA\Aplicaciones\GVO_archivos_iniciales\GVO_CARGA_INICIAL_PRE_PORTADA_ESPECIFICACION_V1.txt`
- `C:\Users\JOSE DAVID\Desktop\OKÚA\Aplicaciones\GVO_archivos_iniciales\carga.png`

No faltaron insumos al cierre de este ticket.

## Decisiones visuales tomadas

- Se usó la imagen aprobada como escena local de Lía regando una planta joven.
- La escena se muestra recortada en el área visual principal para evitar duplicar el texto embebido en la referencia.
- El texto principal y subtítulo se renderizan como HTML accesible:
  - `Preparando el recorrido`
  - `Cuidando el inicio...`
- La barra de carga es estática con una animación CSS mínima de brillo, sin temporizadores y sin navegación automática.
- La pantalla mantiene un fondo claro, sobrio y mobile-first.

## Cómo se respetó la identidad de Lía

- La escena usada muestra una sola Lía.
- Lía aparece como guía floral biomimética y flotante.
- La referencia conserva exactamente cinco pétalos.
- La referencia conserva cabeza cristal/opalescente, ojos cerrados en media luna, collar ámbar y bulbo inferior segmentado.
- No se agregaron boca, nariz, cejas, brazos, manos, piernas ni pies.
- No se agregó otro avatar ni personaje secundario.

## Rutas afectadas

- `/carga`: ahora muestra la pantalla real de carga inicial.
- `/`: también muestra la pantalla real de carga inicial porque es la primera pantalla del flujo.

No se redirige automáticamente a `/portada`.

## Archivos modificados

- `README.md`
- `docs/status/ESTADO_ACTUAL_PROYECTO.md`
- `docs/tickets/TICKET_001_CARGA_INICIAL_DEFINICION_Y_BASE_VISUAL.md`
- `docs/source_specs/001_carga_inicial_pre_portada.txt`
- `assets/reference/screens/001_carga_inicial_pre_portada.png`
- `public/assets/runtime/loading-initial-pre-portada.png`
- `src/app/router.tsx`
- `src/screens/LoadingInitial/LoadingInitialScreen.tsx`
- `src/screens/LoadingInitial/LoadingInitialScreen.css`
- `src/screens/LoadingInitial/LoadingInitialScreen.test.tsx`
- `src/screens/LoadingInitial/index.ts`
- `tests/e2e/smoke.spec.ts`

## Pruebas ejecutadas y resultado

- `npm run lint`: OK.
- `npm run test`: OK. 2 suites, 7 tests.
- `npm run build`: OK. Build Vite + PWA generado.
- `npm run audit:assets`: OK. Sin URLs externas, CDN ni uso de audio.
- `npm run test:e2e`: OK. 2 smoke tests en mobile-chromium.

## Limitaciones pendientes para iteraciones de carga inicial

- Animación completa de 10 a 15 segundos.
- Secuencia por estados: entrada de Lía, riego, crecimiento sutil, final de carga.
- Textos esperados definitivos.
- Forma, encuadre y composición final.
- Validación fina de Lía.
- Validación visual mobile-first.
- Criterios explícitos de aprobación por parte del usuario.
- Cierre documental como pantalla completa, no solo como base.
- Transición hacia portada solo cuando portada esté autorizada en una fase posterior.
- Posible sprite separado de Lía/maceta/planta si se decide no usar la imagen de referencia como runtime final.

## Estado de cierre

BASE VISUAL INTEGRADA — NO CERRADA COMO PANTALLA FINAL

Este ticket dejó una primera base visual estable de la carga inicial, integrada en `main`, con pruebas correctas. Sin embargo, la pantalla no se considera cerrada funcional, visual ni narrativamente. Quedan pendientes iteraciones de composición, textos, animación, validación visual de Lía, validación mobile-first y aprobación explícita del usuario.

La integración de esta base en `main` no autoriza avanzar a portada. TICKET_002_PORTADA_DEFINICION_Y_BASE_VISUAL queda bloqueado hasta que la carga inicial alcance estado CERRADA_APROBADA.
