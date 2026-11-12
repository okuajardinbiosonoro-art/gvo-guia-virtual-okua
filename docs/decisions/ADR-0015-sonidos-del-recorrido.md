# ADR-0015 · Sonidos del recorrido

Estado: aprobado para [GVO 1.1.0](../releases/GVO_1.1.0.md).

GVO reproduce los 14 MP3 de la entrega del diseñador a partir de eventos del
recorrido. Los originales y sus disparadores constan en los manifiestos
`current-used/*/audio/manifest.json`. Los MP3 se precargan en la caché de la
PWA y se sirven desde el mismo origen de GVO. La cámara conserva sus permisos
y la reproducción se inicia con un toque del visitante.

La aplicación usa un contexto Web Audio compartido. Solo reproduce una pista
a la vez y silencia el audio cuando la pestaña pasa a segundo plano. El efecto
de interacción básica y el cierre de sala pueden terminar durante una
transición. La interacción básica tiene el 70 % de su ganancia anterior y
también acompaña el avance en las explicaciones y el repaso de Sala IV, la
navegación de la trivia y los accesos principales del Mirador. El juego y las
respuestas conservan sus efectos dedicados y los archivos originales siguen
intactos.

El ajuste de volumen de la pantalla de idioma se aplica al recorrido completo.
Su valor se guarda en el navegador, por separado del interruptor de sonido.
Ambas preferencias se mantienen al reiniciar la visita.

La preportada prepara los efectos compartidos y cada transición carga los
audios de destino en paralelo con sus módulos, fuentes e imágenes. Si ya se
habilitó Web Audio con un toque, también se decodifican antes de revelar la
sala. El audio tiene un máximo de seis segundos dentro del presupuesto de
la transición; si no está disponible, la sala puede abrirse y el efecto
vuelve a intentarse en una acción posterior. Las imágenes críticas conservan
el límite general de 15 segundos. La transición de Sala III incluye las tres
páginas, sus ilustraciones y las animaciones de Lía; el cuaderno reutiliza
la verificación de esos recursos al abrir cada capítulo.

En Sala II, cada relación de mapeo reproduce su ejemplo. El resultado mediado
puede escucharse otra vez desde su botón. Se conserva la duración original de
las pistas, y al avanzar se libera el sonido de la escena anterior.

José David completó el recorrido en su iPhone y confirmó el nivel de sonido
y la apertura del cuaderno al primer toque. El acta de 1.1.0 registra la
aprobación y la evidencia técnica.
