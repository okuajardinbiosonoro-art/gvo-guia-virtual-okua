# Metodología de cierre por pantalla — GVO

## Regla principal

GVO avanza de forma secuencial por pantallas. Esta metodología define el cierre final de una pantalla.

Desde TICKET_002A, el avance operativo también contempla la metodología de umbral visual documentada en `docs/process/METODOLOGIA_AVANCE_POR_UMBRAL_VISUAL.md`. Una pantalla puede permitir avance si está `APROBADA_PARA_AVANZAR` con deuda visual documentada, aunque todavía no esté en cierre final.

## Definición de pantalla cerrada

Una pantalla se considera cerrada únicamente cuando cumple todos estos criterios:

1. Criterio funcional
   - La ruta correspondiente existe.
   - La pantalla se renderiza correctamente en navegador móvil.
   - No hay navegación accidental o automática no aprobada.
   - No se implementan elementos fuera de alcance.

2. Criterio visual
   - La composición coincide con la referencia aprobada.
   - Lía respeta estrictamente su identidad oficial.
   - No aparecen rasgos prohibidos en Lía.
   - La pantalla conserva el tono visual OKÚA.
   - El usuario aprueba explícitamente la imagen o escena final.

3. Criterio narrativo
   - Los textos son los esperados.
   - El mensaje evita interpretaciones erróneas sobre las plantas.
   - La pantalla cumple su función dentro del recorrido.

4. Criterio de animación/interacción
   - Las animaciones esperadas para esa pantalla están implementadas.
   - No hay animaciones excesivas, distractoras o fuera del concepto.
   - La pantalla queda preparada para el flujo real del recorrido.

5. Criterio técnico
   - No usa Internet.
   - No usa CDN.
   - No carga recursos externos.
   - No reproduce audio.
   - Funciona en mobile-first.
   - Pasa lint, test, build, audit:assets y e2e cuando aplique.

6. Criterio documental
   - El ticket documenta alcance real, limitaciones y estado.
   - El estado del proyecto queda actualizado.
   - Los insumos fuente quedan ubicados en docs/source_specs y assets/reference/screens cuando aplique.
   - El estado de madurez queda explícito.

7. Criterio de aprobación
   - El usuario aprueba explícitamente la pantalla.
   - Solo después de esa aprobación se puede habilitar el siguiente ticket de pantalla.

## Estados de madurez permitidos

Cada pantalla debe tener uno de estos estados:

- NO_INICIADA
- BASE_TECNICA
- BASE_VISUAL
- EN_ITERACION_VISUAL
- EN_ITERACION_ANIMACION
- CANDIDATA_A_CIERRE
- CERRADA_APROBADA

## Interpretación de main

main representa el estado estable del repositorio, pero no implica necesariamente que todas las pantallas allí presentes estén cerradas visual o narrativamente.

Una base parcial puede integrarse a main si es estable, no rompe pruebas y sirve como punto de partida. Sin embargo, debe quedar documentada como BASE_VISUAL, EN_ITERACION_VISUAL o el estado correspondiente, no como CERRADA_APROBADA.

## Bloqueo de avance

Para cierre final, mientras la pantalla actual no esté en CERRADA_APROBADA:

- no se implementa la siguiente pantalla;
- no se agregan rutas reales de la siguiente pantalla;
- no se avanza a estaciones, transición o final como runtime funcional.

Para preproducción o avance controlado, usar `APROBADA_PARA_AVANZAR` según la metodología de umbral visual.

## Caso actual histórico: carga inicial

La carga inicial pre-portada estuvo inicialmente en estado BASE_VISUAL / EN_ITERACION_VISUAL.

Desde el checkpoint V13, la carga inicial queda:

- `APROBADA_PARA_AVANZAR / 7.2_DE_10 / DEUDA_VISUAL_DOCUMENTADA`

Esto desbloquea Portada / Intro solo para preproducción. No equivale a `CERRADA_APROBADA_FINAL`.
