# Operación local MikroTik

GVO debe ejecutarse dentro de la red local gestionada por MikroTik. La red de visitantes no debe depender de Internet para abrir ni navegar la guía.

## Principios

- Servir la app desde una máquina local accesible por la red.
- Usar `npm run dev` o un build servido localmente durante pruebas.
- Exponer el servidor con host `0.0.0.0` para permitir acceso desde otros dispositivos de la LAN.
- Generar QR físicos con URLs locales verificadas en la red activa.
- No usar URLs públicas ni servicios externos como parte del runtime.

## Validación mínima en sitio

Antes de imprimir o fijar QR, abrir manualmente la URL local desde un celular conectado a la red MikroTik. La URL que funciona manualmente debe ser la misma codificada en el QR.
