# Conversar con Lía — preview

Copy DRAFT_COPY para aceptación humana final. Flag `VITE_LIA_PREVIEW_ENABLED=true` sólo en la demo de desarrollo; valor ausente u otro valor lo desactiva. La ruta `/final/lia` requiere completar el recorrido y vuelve a `/final` con foco en la entrada.

API relativo `LIA_API_BASE=/lia-api` (variantes `/lia-api-<sufijo>`); upstream privado `LIA_DEV_UPSTREAM` sólo HTTP 127.0.0.1 y puertos temporales 49152–49215. El script `ops/lia_m3_demo.py` del repo hermano Intelligence inicia ambos servicios HTTPS/HTTP locales, verifica readiness y preserva sus PIDs. Reutiliza TLS de desarrollo existente sin copiarlo.

Mensajes sólo en memoria, máximo 20 turnos/2000 caracteres. Timeout 10s, una petición a la vez. La UI escapa texto y valida respuesta/citas con el snapshot público aprobado; no muestra IDs, paths ni nombres técnicos. API fuera del caché. Estados soportado, abstención, rechazo y no disponible.

El corpus no contiene definiciones generales completas de OKÚA o biosonificación; se demuestra abstención honesta. Copy/asset decisions se presentan con doce escenarios en el gate final.

Pruebas: `node tools/qa/lia_m3_guards.mjs`, Vitest y `playwright.lia-m3.config.ts` contra la demo local. No campo, modelos, tools ni M4 automático.
