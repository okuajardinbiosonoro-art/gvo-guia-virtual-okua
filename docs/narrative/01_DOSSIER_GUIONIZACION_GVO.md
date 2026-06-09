# 01 — Dossier de guionización GVO

## Propósito

Este dossier convierte los insumos visuales y las especificaciones existentes en una guía de trabajo para escritura. Su finalidad es que el escritor pueda producir textos de Lía, textos ambientales, textos de espera, microcopy, mensajes de bloqueo y cierres de estación sin tener que entender programación ni implementación.

## Alcance

El documento define:

- qué pantalla existe;
- qué ve el visitante;
- qué acción realiza;
- qué debe entender;
- qué texto se necesita;
- qué conceptos deben protegerse;
- qué formulaciones deben evitarse;
- dónde queda libertad autoral.

No define estilo literario final. No debe usarse para limitar la voz creativa del escritor. Sirve para delimitar la función de cada texto dentro de la experiencia.

## Contexto de experiencia

GVO es una guía visual local para acompañar el recorrido OKÚA desde navegador móvil. La experiencia debe leerse en pantalla, funcionar sin instalación y sostenerse sin audio. Por eso los textos deben poder cumplir su función de forma visual, breve y comprensible para público general: niños, adolescentes, adultos y adultos mayores.

## Emisores textuales posibles

| Emisor | Uso recomendado | Notas |
| --- | --- | --- |
| Lía | Guía, orientación, explicación breve, invitación a actuar, cierre de sentido. | No se define como persona humana. Es la guía visual única. |
| Ambiente | Respuesta del mundo, activación de raíz, pulso, energía o estado contemplativo. | Puede ser más sensorial, sin atribuir literalmente emociones humanas a la planta. |
| Sistema / interfaz | Botones, estados, bloqueos, navegación, confirmaciones, mensajes accesibles. | Debe priorizar claridad sobre belleza verbal. |

## Mapa general de pantallas y bloques

| # | Pantalla / estación | Función | Interacción principal | Textos requeridos |
| --- | --- | --- | --- | --- |
| 00 | Carga inicial pre-portada | Comunicar que el recorrido se está preparando sin convertir la espera en una pantalla técnica. | Sin interacción del visitante. Avance automático hacia Portada. | Título de carga, Subtítulo de espera, Descripción accesible de la escena |
| 01 | Portada — El Archivo Vivo de OKÚA | Presentar GVO, introducir a Lía, ordenar la primera pasada y evitar que la experiencia se entienda como menú libre inicial. | Tocar Comenzar recorrido o Portal I; avanzar diálogos de Lía; tocar portales bloqueados solo genera feedback; después de completar la introducción se abre Portal I. | Título y subtítulo fijo, Botón principal, Cinco diálogos de Lía, Mensajes de portales bloqueados, Texto de entrada a Mundo I, Texto de modo libre |
| 02 | Transición entre mundos | Dar continuidad, ocultar cambio de ruta y mantener sensación de cruce sin introducir contenido pedagógico nuevo. | Sin interacción. Bloquea taps repetidos. Avance automático al destino. | Texto principal por destino, Texto secundario breve por destino, Mensaje accesible si aplica |
| 03 | Estación I — Mundo I: Raíz | Fundar la experiencia: antes de hablar de señal, técnica o sonido, el visitante aprende a mirar la planta como vida activa y relación. | Activar tres nodos en orden: RELACIÓN → PERCEPCIÓN → MEDIACIÓN. Leer textos breves y continuar hacia Estación II. | Entrada de Lía, Instrucción por nodo, Respuesta ambiental por nodo, Mensaje de bloqueo suave, Cierre de estación, Botón continuar |
| 04 | Estación II — Mundo II: Lía y el pulso invisible | Aclarar que la señal existe, pero no equivale a música por sí sola. | Activar seis capas en orden: Planta viva → Señal → Captura → Acondicionamiento → Mapeo → Resultado mediado. | Entrada de Lía, Texto por capa, Mensaje de bloqueo suave, Cierre de estación, Botón continuar |
| 05 | Estación III — Mundo III: Cuaderno Pixel de Pruebas | Mostrar proceso: observar, probar, detectar límites, ajustar y mejorar. | Activar tres bloques en orden: PLANTA → PROTOTIPO → SEÑAL; luego aparece sello AJUSTADO y se habilita continuar. | Entrada de Lía, Texto por bloque, Texto del sello Ajustado, Mensaje de bloqueo suave, Cierre, Botón continuar |
| 06 | Estación IV — Mundo IV: Mesa de Sistema | Responder cómo se conecta todo para que una señal vegetal termine en una experiencia sonora mediada. | Activar ocho nodos en orden: Planta → Bionosificador → ESP32 → MIDI → Wi‑Fi/UDP → Router → Sistema central → Sonido. | Entrada de Lía, Tarjeta breve por nodo, Mensaje de bloqueo suave, Cierre técnico, Botón continuar |
| 07 | Estación V — Mundo V: Mapa del Presente | Aterrizar todo lo aprendido como montaje actual en un espacio real. | Activar cuatro áreas en orden: PLANTAS → SISTEMA → ESPACIO → VISITANTE; luego ir al cierre. | Entrada de Lía, Texto por área, Mensaje de bloqueo suave, Cierre previo, Botón Ir al cierre |
| 08 | Pantalla final — Mirador Final del Jardín | Confirmar cierre, habilitar revisión libre y dar una salida clara sin introducir nuevos conceptos pedagógicos. | Tocar accesos a los cinco mundos en modo revisión libre, volver al inicio o reiniciar recorrido. | Mensaje final de Lía, Ayuda breve, Labels de accesos, Botón Volver al inicio, Botón Reiniciar recorrido, Confirmación de reinicio, Créditos esenciales |

## Regla de libertad autoral

La matriz de textos no debe llenarse como una tarea mecánica. Cada fila indica una necesidad funcional. El escritor puede proponer una solución verbal distinta, más sensible, más sintética o más evocadora, siempre que respete el contexto visual, la acción del visitante y el concepto que la pantalla necesita comunicar.

## Regla de público general

Los textos deben poder ser entendidos por visitantes de edades y niveles de conocimiento distintos. Esto no obliga a infantilizar el lenguaje. Significa que cada frase debe poder ser leída en un celular, en movimiento, dentro de un recorrido físico y sin explicación oral adicional.

## Referencias visuales

Las imágenes están en `visual_refs/`. Cada ficha de estación las inserta como referencia. El escritor debe usarlas para entender composición, ritmo y contexto emocional, no para describir literalmente cada objeto.
