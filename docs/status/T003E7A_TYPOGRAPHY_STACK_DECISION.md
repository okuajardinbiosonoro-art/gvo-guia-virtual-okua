# T003E7A - Decision tipografica base: stack body/dialog y politica de fuentes

## 1. Resumen

T003E7A cierra una decision documental previa a la implementacion de tokens tipograficos globales. Parte de la auditoria T003E7 y define que GVO usara una pareja tipografica controlada:

- Pixelify Sans local para identidad, headings, microcopy y UI corta.
- Stack sistema local provisional para body narrativo y dialogos largos de Lia.

Este ticket no modifica CSS runtime, no cambia `tokens.css`, no cambia `global.css`, no toca pantallas, no agrega fuentes y no instala dependencias.

## 2. Rama base y rama final

- Rama base: `feature/003E7-gvo-typography-audit`
- Commit base: `1fea865 docs: audit gvo typography system`
- Rama final: `feature/003E7A-typography-stack-decision`

## 3. Hallazgos usados de T003E7

La decision se basa en estos hallazgos verificados:

- `@fontsource-variable/pixelify-sans` ya existe en `package.json`.
- `src/main.tsx` importa `@fontsource-variable/pixelify-sans/index.css`.
- Carga Inicial usa `"Pixelify Sans Variable", "Pixelify Sans", system-ui, sans-serif`.
- Portada / Intro usa `"Pixelify Sans Variable", "Pixelify Sans", ui-sans-serif, system-ui, sans-serif` como fuente visual principal.
- TransitionWorld usa `"Pixelify Sans", system-ui, sans-serif`, omitiendo el nombre `"Pixelify Sans Variable"`.
- Portada / Intro define `--cover-readable-font` como stack sistema para dialogos y textos largos.
- `src/styles/tokens.css` declara `Inter` en `:root`, pero no hay dependencia, asset local ni import de Inter.
- No existen tokens tipograficos globales compartidos para display, heading, body, dialog, UI y microcopy.

## 4. Decision de fuente de identidad

La fuente de identidad oficial provisional para GVO sera:

```css
"Pixelify Sans Variable", "Pixelify Sans", system-ui, sans-serif
```

Uso aprobado:

- display/logo;
- headings cortos;
- titulos de mundos;
- textos de transicion;
- microcopy breve;
- labels;
- CTA principales;
- UI corta.

Justificacion:

- ya existe localmente via Fontsource;
- ya esta importada en `src/main.tsx`;
- no depende de Internet;
- no usa CDN;
- ya funciona visualmente en Carga Inicial y Portada / Intro;
- sostiene la identidad pixelart-organica del proyecto;
- evita introducir una nueva dependencia antes de tener una revision visual especifica.

Nota para T003E7B: TransitionWorld debe pasar a usar el stack completo con `"Pixelify Sans Variable"` cuando se implementen tokens globales o cuando se aplique el primer ticket tipografico de pantalla.

## 5. Decision de body/dialog

Para body narrativo y dialogos largos de Lia se mantiene temporalmente un stack sistema local:

```css
system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
```

Uso provisional:

- dialogos largos de Lia;
- cuerpo narrativo;
- explicaciones pedagogicas;
- mensajes que requieren lectura comoda en movil;
- textos donde Pixelify pueda cansar o reducir legibilidad.

Justificacion:

- evita agregar dependencias en este momento;
- mantiene legibilidad movil;
- respeta el requisito de app local;
- no introduce CDN;
- no descarga fuentes en runtime;
- evita elegir una segunda fuente sin revision visual;
- mantiene abierta la opcion de incorporar una fuente local futura si el usuario la aprueba.

Decision importante: el stack sistema para dialogos no se considera el estilo final definitivo, sino una solucion provisional documentada. Si el proyecto necesita una segunda fuente con mas caracter OKUA, debe entrar en un ticket separado.

## 6. Decision sobre Inter

`Inter` debe retirarse del stack global en el ticket de implementacion T003E7B, porque hoy aparece declarado en `src/styles/tokens.css` pero no esta instalado ni importado localmente.

No se modifica en este ticket.

Decision:

- no declarar fuentes no disponibles;
- no usar nombres de fuentes no instaladas;
- no simular una fuente que en runtime cae silenciosamente al sistema;
- si una fuente se declara en tokens globales, debe existir como asset local, dependencia local o fallback generico real.

Riesgo actual:

- el build no falla porque el navegador resuelve fallback;
- la documentacion tecnica queda confusa;
- la identidad visual puede variar por sistema operativo si se cree erroneamente que Inter esta activa.

## 7. Politica de fuentes futuras

Reglas para cualquier fuente futura:

- No usar CDN.
- No usar `@import url(...)`.
- No usar Google Fonts remoto.
- No descargar fuentes en runtime.
- No depender de Internet.
- No agregar fuentes por decision implicita dentro de un ticket visual amplio.
- Toda fuente nueva debe tener ticket propio.
- Toda fuente nueva debe entrar como dependencia local o archivo local validado.
- Toda fuente nueva debe pasar `npm run audit:assets`.
- Toda fuente nueva debe revisarse visualmente en 360px, 390px y 430px.
- Toda fuente nueva debe justificar peso, legibilidad, tamano de build y coherencia OKUA.
- No reemplazar Pixelify Sans como identidad sin aprobacion explicita del usuario.

## 8. Riesgos evitados

Esta decision evita:

- instalar una segunda fuente sin revision visual;
- consolidar `Inter` como fuente falsa/no disponible;
- forzar Pixelify Sans en dialogos largos donde puede afectar lectura;
- dejar que cada pantalla siga definiendo stacks aislados;
- mezclar tipografias por accidente en lugar de hacerlo por sistema.

## 9. Que NO se implemento

- No se modifico `src/styles/tokens.css`.
- No se modifico `src/styles/global.css`.
- No se modifico Carga Inicial.
- No se modifico Portada / Intro.
- No se modifico TransitionWorld.
- No se modificaron dialogos.
- No se agregaron fuentes.
- No se agregaron dependencias.
- No se tocaron assets.
- No se cambiaron rutas.
- No se cambio navegacion.
- No se ejecuto ningun cambio visual.

## 10. Que debe hacer T003E7B

T003E7B debe implementar solo la base de tokens tipograficos globales, sin aplicar todavia la refactorizacion completa a pantallas finales.

Alcance recomendado para T003E7B:

- crear tokens tipograficos globales en `src/styles/tokens.css`;
- reemplazar `Inter` por el stack body real;
- agregar tokens:
  - `--gvo-font-display`;
  - `--gvo-font-heading`;
  - `--gvo-font-ui`;
  - `--gvo-font-microcopy`;
  - `--gvo-font-body`;
  - `--gvo-font-dialog`;
- agregar tokens de tamanos, pesos, line-heights y letter-spacing base;
- no aplicar tokens a TransitionWorld si eso queda reservado para T003E7C;
- no redisenar Carga Inicial, Portada ni TransitionWorld;
- documentar si algun placeholder que hereda `:root` cambia por la correccion de `Inter`.

Secuencia sugerida posterior:

- `T003E7B`: tokens globales.
- `T003E7C`: aplicacion controlada a TransitionWorld.
- `T003E7D`: aplicacion controlada a Carga Inicial.
- `T003E7E`: aplicacion controlada a Portada / Intro.
- `T003E7F`: sistema especifico de dialogos de Lia.
- `T003E7G`: QA visual comparativa.

## 11. Validaciones ejecutadas

Comandos requeridos para este ticket documental:

```powershell
npm run lint
npm run test
npm run build
npm run audit:assets
```

No se debe ejecutar `npm run test:e2e` porque este ticket no modifica runtime.

## 12. Resultado de validaciones

- `npm run lint`: OK.
- `npm run test`: OK, 5 archivos y 41 tests.
- `npm run build`: OK, build de produccion generado correctamente.
- `npm run audit:assets`: OK, sin URLs externas, CDN ni audio.

## 13. Estado final del repo

El cierre debe quedar publicado en `feature/003E7A-typography-stack-decision` con working tree limpio. T003E7B queda habilitado como siguiente ticket documental/tecnico para implementar tokens tipograficos globales sin redisenar pantallas.
