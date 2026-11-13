# ADR-0016 · Foto local con Lía en el Mirador

Estado: aprobada para [GVO 1.1.0](../releases/GVO_1.1.0.md).

El visitante puede crear un recuerdo al llegar al Mirador. El botón se presenta
junto a las acciones existentes. «Tomar foto» abre un encuadre con Lía y la
cámara dentro de GVO. «Elegir foto» importa una imagen existente. El visitante
elige una de dos poses o «Sin Lía» y recibe un JPEG de 1080 × 1920 para guardar
o compartir.

La captura usa `getUserMedia` en contexto seguro y sin audio. El diálogo
solicita la cámara frontal para selfies y descarta una cámara que el navegador
identifique con otra orientación. El visor y el JPG conservan el espejo de la
selfie. GVO detiene las pistas al capturar, salir u ocultar la página. Una
solicitud que termina después de cancelar también libera sus pistas.
La captura y la composición ocurren en memoria. El diálogo permite elegir un
archivo si el navegador no puede usar la cámara.

Cuando `canShare` acepta el JPEG, «Compartir» abre el selector del sistema. El
dispositivo determina los destinos disponibles. La entrega dirigida a Historias
que Meta documentó usa un puente nativo. En iOS usa el portapapeles de UIKit
y un esquema de Instagram. En Android usa un intent nativo y concede acceso
al archivo mediante un URI de contenido. GVO conserva «Guardar foto» como
alternativa web. El visitante revisa y confirma cualquier publicación en
Instagram.

El JPEG enmarca la foto en papel de cámara instantánea. El tratamiento cálido,
el grano y la inclinación quedan incorporados al archivo, junto con el logotipo,
el emblema aprobado y un grabado botánico en una esquina del papel. La vista
previa añade un movimiento breve al aparecer y respeta el movimiento reducido.

Al hombro y Se asoma arriba son poses exclusivas de la foto. Ambas ganan
escala. La primera busca el espacio junto al hombro y la segunda se ubica
sobre la cabeza o junto a su parte alta. La silueta puede acercarse al
cabello y a la ropa. El detector local Pico reserva los rasgos de los rostros
detectados. Tocar un lado o usar las flechas cambia la posición preferida.
Si falta detección, las poses conservan sus alturas en una esquina del
encuadre. Si los rostros detectados ocupan el espacio, la composición
continúa sin Lía. El disparador depende solo del estado de la cámara.

El visor usa el video nativo del navegador y una capa transparente para Lía.
El detector toma una muestra reducida como máximo cada 240 ms, con una pausa
mayor en equipos que requieren más tiempo de análisis. El JPG vuelve a
componer la pose en el fotograma capturado.
«Sin Lía» conserva el marco instantáneo en vivo y después del disparo. El modelo
se sirve desde GVO y los fotogramas se procesan en el dispositivo. Puede omitir
rostros. Los recursos de cinco pétalos y el modelo quedan registrados en
`current-used/final-root/photo`.
El paisaje conserva las capas, los encuadres y la geometría de GVO 1.0. Dos capas
decorativas CSS añaden luz al sol y reflejos al río. La preferencia de movimiento
reducido desactiva ambas.

José David aprobó la selfie tras probarla en su iPhone. Allí comprobó que
Instagram aparecía en el selector de compartir. La apertura directa del
editor de Historias con el JPG cargado queda fuera de esta implementación.

## Marco aprobado en GVO 1.1.1

La revisión del papel conserva el logotipo y el ornamento de esquina. Una
enredadera floral pixel art sube por el borde derecho y algunas hojas se
superponen levemente al margen del retrato. El emblema dorado da paso a la frase
provisional «La naturaleza también canta» («Nature sings, too» en inglés).
La frase se dibuja en cursiva sobre el JPEG. La vista previa muestra ese
mismo archivo. José David aprobó la foto en iPhone y autorizó la frase
provisional hasta recibir el texto final del escritor. El
[acta de versión](../releases/GVO_1.1.1.md) registra el cierre.
