# Estrategia QR y cámara

La estrategia vigente usa scanner integrado y QR físicos host-independent para el handoff entre estaciones.

## Recorrido normal

Los payloads permitidos son `/qr/w2`, `/qr/w3`, `/qr/w4` y `/qr/w5`. Cada Mundo acepta únicamente el token de su estación siguiente, verifica la completion durable y navega a la transición correspondiente. Un QR incorrecto o desconocido no escribe progreso ni navega.

No se usa la cámara nativa como bypass del recorrido normal y no se ejecutan URLs o schemes contenidos en un QR.

## Cámara

`/inicio` solicita cámara trasera después del gesto `Iniciar recorrido`; nunca solicita micrófono. El gate final de Mundo I–IV abre el mismo servicio de cámara y decoder local. Todos los tracks terminan al completar, cerrar, ocultar, desmontar o fallar fatalmente.

En una revisita autorizada desde Mirador no se monta el gate y no se solicita cámara.

## Origen seguro local

`npm run dev` ejecuta `tools/dev/ensure_https_certificate.ps1` mediante un wrapper Node controlado. El script:

1. conserva una autoridad local estable en `Cert:\CurrentUser`;
2. detecta todas las IPv4 activas en cada arranque;
3. genera un certificado servidor con SAN dinámicos cuando cambia la red;
4. exporta sólo la autoridad pública para iOS/Android;
5. inicia Vite sobre HTTPS y `0.0.0.0`.

La dirección concreta no forma parte del código ni de los QR. Se usa la URL `https://<IP-ACTUAL>:5173` que imprime Vite. Tras cambiar de red se reinicia el proceso para renovar SAN.

La instalación de confianza y la matriz física están documentadas en `docs/qa/GVO_DEBT_015_LOCAL_HTTPS_DEVICE_SETUP.md` y `docs/qa/GVO_DEBT_015_IN_APP_QR_SCANNER_PHYSICAL_QA.md`.

Decisión arquitectónica: `docs/decisions/ADR-0007-https-local-dinamico-y-scanner-qr-interno.md`.
