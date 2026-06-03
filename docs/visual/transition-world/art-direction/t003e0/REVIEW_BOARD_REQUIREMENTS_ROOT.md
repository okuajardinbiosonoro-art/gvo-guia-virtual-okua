# Review board - Transicion Mundo I: Raiz

## Objetivo

Crear una hoja de revision visual para que el usuario apruebe o rechace assets antes de integrarlos.

## Formato

- Archivo: `transition_root_contact_sheet_v1.png`
- Tamaño: 1440x2560.
- Fondo neutro claro.
- Sin texto generado por IA dentro de los assets.
- Etiquetas de la hoja pueden ser DOM/documentales o texto limpio agregado en Photopea, no dentro de assets runtime.

## Filas requeridas

1. Referencias canonicas:
   - Lía master portada.
   - Portal I portada.
   - Captura T003D marcada como "no final".
2. Lía master candidata.
3. Lía idle 4 frames.
4. Lía guide 2 frames + exit + blink opcional.
5. Portal inactive / activating / open.
6. Symbol root + progress reference.
7. Mockups 390x844 y 430x932 sin UI incrustada.
8. Zona de decision: aprobado / ajustar / rechazado.

## Capturas mobile requeridas

- 360x640.
- 390x844.
- 430x932.
- Reduced motion mockup si hay animacion posterior.

## Formato de feedback del usuario

Registrar:

- calificacion 0-10;
- assets aprobados;
- assets rechazados;
- razon visual principal;
- ajustes obligatorios;
- si se autoriza pasar a integracion runtime.

## Criterio para pasar a integracion

No pasar a integracion si:

- Lía no esta aprobada;
- portal no esta aprobado;
- no existe contact sheet;
- no hay transparencia limpia;
- la calificacion visual sigue por debajo de 7/10;
- el usuario no autoriza explicitamente avanzar.
