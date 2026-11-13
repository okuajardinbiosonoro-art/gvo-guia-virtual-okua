# ADR-0018 · Duración y recursos de entrada

Fecha: 2026-11-13. Implementado para GVO 1.1.3. Activación pendiente de staging.

En la validación de 1.1.2 con 20 clientes simulados, Portada abrió en
17,78 s a 5 Mb/s y en 15,34 s a 10 Mb/s. El riego tenía un mínimo
visible de 12 s y comenzaba una vez listos sus recursos propios.

GVO 1.1.3 conserva esa secuencia con un mínimo visible de 6 s. La duración
se comparte entre el controlador de preparación y la animación. Los inicios
de los pulsos de agua, el crecimiento y los efectos de Carga conservan su
proporción en la secuencia. Con movimiento reducido se conserva el mínimo
estático de 1,2 s. La preparación de Portada y el límite por intento de 15 s
siguen vigentes. El visitante sólo entra con los recursos críticos listos.

Tres imágenes se convierten a WebP con igualdad de píxeles RGBA. El build
sirve los WebP y excluye sus tres PNG de origen, que permanecen en Git.
Workbox conserva el shell, las nuevas URLs, los 14 audios y la enredadera.
El resto de archivos históricos de la decisión 0017 sigue en la distribución.

Campo compara la misma versión publicada en staging y la 1.1.2 activa
con 20 clientes simulados antes de cualquier activación.
