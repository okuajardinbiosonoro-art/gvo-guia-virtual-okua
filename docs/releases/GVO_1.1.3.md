# GVO 1.1.3 · Entrada al recorrido

El ajuste reduce el mínimo visible del riego inicial de 12 a 6 segundos.
Mantiene la precarga y la preparación de Portada antes de habilitar el
paso desde Inicio. Conserva el mínimo estático de 1,2 segundos cuando el
visitante usa movimiento reducido.

El fondo y las dos hojas de animación pasan a WebP sin pérdida. La
comparación de los archivos decodificados verificó igualdad RGBA en los
tres pares. Los recursos bajan de 5.486.328 a 3.247.166 bytes en conjunto.
La compilación de desarrollo conserva 44 entradas de precache y suma
8.858.017 bytes (8,45 MiB), frente a 10,58 MiB en 1.1.2. El SHA-256 de
su `dist/index.html` es
`f205db5d5c82e0c7c28dba879dd3bb2912f8a01663f19d69095eab14797a4fba`.

MOMOTTO_PC mantiene 1.1.2 en servicio. La candidata se prepara desde el
commit exacto de `main` y se compara con 1.1.2 con 20 clientes simulados,
en staging y antes de activar. Se debe medir el tiempo hasta Portada y la
transferencia, y verificar cámara y recorrido. La prueba física en móviles
sigue siendo un requisito para certificar la operación en sitio.

[Ticket](../tickets/GVO_ENTRADA_20261113.md) ·
[ADR](../decisions/ADR-0018-entrada-precargada.md) ·
[Handoff de campo](../field/FIELD_PC_HANDOFF.md).
