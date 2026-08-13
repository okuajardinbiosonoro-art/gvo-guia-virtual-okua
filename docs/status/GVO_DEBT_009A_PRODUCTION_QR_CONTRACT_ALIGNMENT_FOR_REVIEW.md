# GVO DEBT 009A — Alineación del contrato QR de producción — Para revisión

Fecha de ejecución: 2026-08-13
Estado: `PENDING_HUMAN_REVIEW`

## Resultado

El resolver QR de aplicación quedó alineado con el recorrido físico aprobado:

- `QR-START` → `/qr/start` → inicio del recorrido en `/`.
- No existe QR de entrada a Mundo I.
- `QR-W2` → `/qr/w2` → Estación II, sujeta al guard canónico.
- `QR-W3` → `/qr/w3` → Estación III, sujeta al guard canónico.
- `QR-W4` → `/qr/w4` → Estación IV, sujeta al guard canónico.
- `QR-W5` → `/qr/w5` → Estación V, sujeta al guard canónico.

Las rutas numéricas anteriores `/qr/1` a `/qr/5` ya no son contratos válidos. Se resuelven como identificadores legacy/inválidos y aplican el mismo fallback seguro que cualquier entrada manipulada.

## Baseline

- Baseline obligatorio: `04eb2e125e67f1634b261fa05905e5415bc19185`.
- Rama activa: `main`.
- `HEAD`: `04eb2e125e67f1634b261fa05905e5415bc19185`.
- `origin/main`: `04eb2e125e67f1634b261fa05905e5415bc19185`.
- Divergencia al iniciar: `0 0`.
- El worktree contenía la implementación no publicada de DEBT 009; DEBT 009A se aplicó encima sin descartar ni publicar ese trabajo.

## Contrato tipado

| Identificador | Ruta del resolver | Destino       | Prefijo requerido          |
| ------------- | ----------------- | ------------- | -------------------------- |
| `start`       | `/qr/start`       | `/`           | Ninguno                    |
| `w2`          | `/qr/w2`          | `/estacion/2` | Estación I completa        |
| `w3`          | `/qr/w3`          | `/estacion/3` | Estaciones I–II completas  |
| `w4`          | `/qr/w4`          | `/estacion/4` | Estaciones I–III completas |
| `w5`          | `/qr/w5`          | `/estacion/5` | Estaciones I–IV completas  |

El resolver continúa reutilizando `readProgress`, `canOpenStation` y `mostAdvancedAvailableStation`. Nunca concede progreso, repara storage, modifica checkpoints ni deriva acceso de query strings.

Cuando un QR de estación no está autorizado, el usuario vuelve a la estación más avanzada permitida por el prefijo coherente de progreso. Un identificador inválido, legacy o manipulado usa el mismo fallback. Si el storage está corrupto, falla cerrado hacia Estación I y conserva los bytes corruptos como evidencia.

## QR-LAN-START futuro

Se añadió un contrato explícito `qrLanStartContract` con:

- estado `resolution_only`;
- responsabilidad futura de conectar a la red local y abrir el recorrido;
- vínculo lógico con el identificador de recorrido `start`;
- `networkConfiguration: null`.

No se definieron SSID, contraseña, IP, hostname ni configuración MikroTik. Tampoco se creó una ruta de cámara o un QR WiFi real.

## Integración del router

- El parámetro del resolver pasó de `stationId` a `qrId` para impedir que el pathname se trate como número de estación directo.
- `/qr/:qrId` resuelve exclusivamente identificadores tipados.
- `/qr/*` captura formas incompletas, extras y manipuladas para aplicar fallback.
- El resolver sólo redirige al destino autorizado; no presenta una ruta interna como payload físico directo.
- El contexto efímero de revisión Final continúa limpiándose antes de una entrada QR, sin tocar progreso.

## Pruebas

### Validación focal

| Validación                     | Resultado   |
| ------------------------------ | ----------- |
| Unitarias del resolver + shell | PASS, 9/9   |
| E2E DEBT 009 + DEBT 009A       | PASS, 14/14 |
| E2E nuevo DEBT 009A            | PASS, 5/5   |

El E2E nuevo comprueba QR inicio, W2–W5, identificadores inválidos/legacy/manipulados, progreso insuficiente, fallback, storage corrupto y cero mutación de progreso o del sentinel de checkpoints.

La primera corrida focal detectó una carrera en la prueba heredada DEBT 009: se reutilizaba una página después de abrir `/qr/start`, aunque esa ruta activa intencionalmente el timeline real de carga. Se reordenaron únicamente sus aserciones para comprobar W2–W5 antes de `start`; la corrida focal final pasó 14/14. No hubo cambio de runtime por este hallazgo.

### Validación general

| Validación             | Resultado                                        |
| ---------------------- | ------------------------------------------------ |
| `npm run audit:assets` | PASS; sin URLs externas, CDN ni audio            |
| `npm run lint`         | PASS                                             |
| `npm test`             | PASS; 36 archivos y 482/482 pruebas              |
| `npm run build`        | PASS; 608 módulos y precache PWA de 278 entradas |
| `npm run test:e2e`     | 140/141 PASS en 15,2 min                         |

El único fallo de la suite integral fue `tests/e2e/smoke.spec.ts`, escenario “muestra la portada y ejecuta diálogos/gating base en /portada”. Falló esperando el copy transitorio de Portada/Transición mientras el preload seguía activo. Una repetición aislada pasó y otra falló en un punto transitorio adyacente, demostrando comportamiento intermitente ligado al preload. DEBT 009A no modifica `src/screens/Cover/**`, assets ni la transición Portada→Mundo I; por límite del ticket no se alteró ese smoke ni su runtime.

El build mantiene las advertencias conocidas de chunk principal mayor de 500 kB y `PLUGIN_TIMINGS`; no impidieron el PASS.

## Archivos de DEBT 009A

### Modificados

- `src/app/qr/qrNavigation.ts`
- `src/app/qr/qrNavigation.test.ts`
- `src/app/router.tsx`
- `src/app/routes.ts`
- `tests/e2e/gvo-debt-009-immersive-qr-navigation.spec.ts`

### Creados

- `tests/e2e/gvo-debt-009a-production-qr-contract.spec.ts`
- `docs/status/GVO_DEBT_009A_PRODUCTION_QR_CONTRACT_ALIGNMENT_FOR_REVIEW.md`

`src/data/stations.ts` conserva metadatos QR numéricos legacy porque está fuera del allowlist estricto de DEBT 009A. El resolver de producción ya no importa ni consume `stations[].qrRoute`; su contrato operativo canónico reside en `src/app/routes.ts` y `src/app/qr/qrNavigation.ts`.

## Alcance preservado

- Sin cambios de DEBT 009A en progreso, checkpoints o reset.
- Sin cambios de DEBT 009A en Mirador o shell inmersivo.
- Sin cambios de DEBT 009A en assets, PWA, service worker, dependencias o lockfile.
- Sin cámara, scanner, `getUserMedia`, librerías QR ni QR WiFi real.
- Sin SSID, contraseña, IP, hostname o MikroTik.
- Sin commit, push o Pull Request.
- Sin modificación de estado canónico.

## Gate humano

La implementación queda técnicamente lista para revisar. La aprobación del contrato físico y de los destinos observables corresponde al gate humano; hasta entonces el estado es:

`PENDING_HUMAN_REVIEW`
