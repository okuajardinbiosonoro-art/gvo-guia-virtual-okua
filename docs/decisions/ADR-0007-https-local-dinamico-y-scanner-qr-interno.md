# ADR-0007: HTTPS local dinámico y scanner QR interno

## Estado

Aceptado por alcance de `GVO_DEBT_015` y su corrección humana durante QA.

## Contexto

El handoff I→II, II→III, III→IV y IV→V depende del scanner QR integrado. Los navegadores móviles bloquean `getUserMedia` cuando GVO se abre en `http://<IP-LAN>`. La IPv4 del equipo cambia al cambiar de red, por lo que un certificado fijado a una sola dirección tampoco resuelve el uso de campo.

## Decisión

- `npm run dev` prepara una autoridad certificadora local persistente en el almacén del usuario actual de Windows.
- En cada arranque se detectan todas las IPv4 activas y se emite o reutiliza un certificado servidor con SAN para `localhost`, hostname, `127.0.0.1` y esas IPv4.
- Si cambia el conjunto de direcciones, se renueva sólo el certificado servidor; la autoridad local permanece estable.
- Vite sirve exclusivamente HTTPS en desarrollo y mantiene `0.0.0.0` como bind.
- iOS y Android deben confiar una sola vez en el certificado público de la autoridad local; nunca reciben su clave privada.
- El scanner interno compartido es obligatorio para el recorrido normal entre Mundos I–V. Los tokens QR siguen siendo host-independent y no ejecutan URLs leídas.
- El gate se monta mediante portal de viewport para no heredar `overflow`, escala ni recorte de una estación.

## Consecuencias

- Cambiar de red exige reiniciar `npm run dev`, pero no reinstalar la autoridad en dispositivos que ya la confían.
- La URL concreta se toma de la salida del proceso; no se codifica una IP en app, QR ni documentación canónica.
- Cada dispositivo móvil conserva una acción humana de seguridad: instalar y habilitar confianza para la autoridad pública.
- La certificación física de cámara se reporta separada de las pruebas automatizadas.
- `tools/dev/remove_https_trust.ps1` ofrece rollback explícito en el equipo servidor.
