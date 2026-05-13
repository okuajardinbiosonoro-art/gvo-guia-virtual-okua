# Estrategia QR y cámara

La estrategia principal será QR físico que abre URLs locales de la app.

## Decisión base

El visitante puede usar la cámara nativa del celular para leer el QR y abrir una URL local como `/portada`, `/estacion/1` o `/qr/1`.

## Scanner interno

El scanner interno con cámara queda como función opcional porque los navegadores requieren contexto seguro para usar cámara. En una red local sin Internet, esa condición puede depender del dispositivo, navegador, certificados o configuración de origen seguro.

## Regla de avance

No se debe bloquear el proyecto esperando scanner interno. El flujo debe funcionar aunque el visitante use la cámara nativa del celular para abrir URLs locales.
