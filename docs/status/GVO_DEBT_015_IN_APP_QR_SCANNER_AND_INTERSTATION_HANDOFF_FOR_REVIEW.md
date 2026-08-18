# GVO_DEBT_015 — In-App Camera QR Scanner and QR-Only Interstation Handoff

Estado: `PENDING_HUMAN_REVIEW`

```text
GVO_DEBT_015_IMPLEMENTATION_COMPLETE_FOR_REVIEW
PENDING_HUMAN_REVIEW
FIELD_CAMERA_SECURE_ORIGIN_NOT_CERTIFIED
```

## Baseline y alcance

- Rama inicial: `main`.
- Baseline publicado GVO_DEBT_014BPH: `490ad60017511bfb7cd1b2ba082ab1ba3609593f`.
- Al iniciar: `HEAD == origin/main`, divergencia `0 0` y worktree limpio.
- Este cierre no crea commit, no hace push y no crea PR.
- `docs/status/CURRENT_STATE.md` permanece intacto.
- No se generaron QR Wi-Fi ni `/qr/start`; los cuatro payloads siguen sin IP, hostname ni URL absoluta.
- El HTTPS de desarrollo descubre direcciones efímeras al arrancar, pero ninguna IP queda codificada en app, QR o configuración canónica.

## Contrato implementado

El recorrido normal de Mundo I a Mundo V exige ahora el QR físico de la estación siguiente. Los cuatro botones anteriores de avance interstation fueron retirados; los controles pedagógicos, diálogos, guardado local, fullscreen, return dock y el cierre W5→Final se conservan.

| Origen | Token aceptado | Completion verificada | Destino |
| --- | --- | --- | --- |
| Mundo I | `/qr/w2` | Estación 1 | `/transition/world-1-to-world-2` |
| Mundo II | `/qr/w3` | Estación 2 | `/transition/world-2-to-world-3` |
| Mundo III | `/qr/w4` | Estación 3 | `/transition/world-3-to-world-4` |
| Mundo IV | `/qr/w5` | Estación 4 | `/transition/world-4-to-world-5` |

La validación aplica `.trim()` y coincidencia exacta contra una allowlist local. Un QR de otra estación o un valor desconocido no escribe progreso, no navega y nunca se interpreta como URL o scheme ejecutable.

La transacción conserva este orden:

```text
VALID_QR
→ detener scanner y tracks
→ ejecutar la transacción de completion existente
→ verificar write/re-read
→ confirmar completion
→ navegar a la transición
```

Si la persistencia falla, la ruta permanece bloqueada y se ofrece `Reintentar guardado verificado` sin exigir un segundo escaneo. En Mundo IV, cerrar la cadena deja `chain_pending` durable; la completion global y el cleanup del checkpoint ocurren únicamente después del QR válido.

## Cámara y origen seguro

`/inicio` solicita cámara sólo después de seleccionar idioma y pulsar `Iniciar recorrido`, con:

```js
{
  audio: false,
  video: { facingMode: { ideal: "environment" } }
}
```

Tras conceder permiso, el preflight detiene inmediatamente el stream antes de abrir Portada. Una denegación mantiene `/inicio`, informa en ES/EN y permite reintentar; no se guarda un permiso ficticio.

La autoridad compartida distingue:

- `camera-supported`;
- `camera-permission-pending`;
- `camera-granted`;
- `camera-denied`;
- `camera-not-found`;
- `camera-in-use`;
- `camera-blocked-insecure-context`;
- `camera-unsupported`;
- `camera-error`.

El diagnóstico inspecciona `window.isSecureContext`, `navigator.mediaDevices`, `getUserMedia`, protocolo y hostname. Los tracks se detienen al completar, cerrar, ocultar la página, desmontar/cambiar de ruta o recibir un error fatal.

Tras el QA humano sobre `http://<IP-LAN>`, que bloqueó cámara tanto en iPhone como en Android, el alcance se amplió para hacer seguro el origen local. `npm run dev` ahora:

1. ejecuta un prearranque Node que inicia Windows PowerShell con su módulo de certificados correcto;
2. conserva una CA local estable y no exportable en `Cert:\CurrentUser`;
3. detecta todas las IPv4 activas en cada ejecución;
4. genera o reutiliza un certificado servidor con SAN para hostname, `localhost`, `127.0.0.1` y todas esas IPv4;
5. regenera sólo el certificado servidor si cambia la red;
6. sirve Vite por HTTPS en `0.0.0.0:5173` con puerto estricto.

La CA pública para instalar una sola vez en iOS/Android queda en `.gvo-dev-certs/GVO_LOCAL_DEVELOPMENT_CA.cer`; PFX y metadata permanecen ignorados por Git. La ejecución verificada usó CA `4ACE13271EDF86201CD038C347A993D3C01E1703`, leaf `FC20F5BC3757A372E38E2D53263359A57AF1EBA5`, issuer `CN=GVO Local Development CA` y SAN para las cuatro IPv4 detectadas, incluido loopback. La CA aparece confiada en el almacén `CurrentUser\Root`.

La configuración y el rollback están documentados en `docs/qa/GVO_DEBT_015_LOCAL_HTTPS_DEVICE_SETUP.md`; la decisión arquitectónica queda en `ADR-0007` y reemplaza la estrategia opcional histórica de `ADR-0003`.

En revisita autorizada desde Mirador, el gate QR no se monta, la cámara no se abre, no se reescribe progreso y el return dock permanece disponible. Se amplió de 4 px a 8 px el ajuste adicional de separación del dock `below-end` para eliminar una colisión medida con el título de Mundo III a 360×640; las nueve rutas de revisita aprobaron en ocho viewports.

## Decoder y dependencias

- Decoder runtime: `@zxing/browser@0.1.5`, ya presente antes del ticket y reutilizado mediante `import()` dinámico.
- Dependencia runtime directa añadida: ninguna.
- DevDependency directa añadida: `qrcode@1.5.4`, exclusivamente para generación reproducible.
- `qr-scanner`: no instalado, porque ya existía un decoder equivalente.
- CDN, recursos externos, audio y micrófono: ninguno.
- Instalaciones requeridas al visitante: cero.

`npm install` informó 10 vulnerabilidades conocidas del árbol instalado (2 low y 8 high). No se ejecutó `audit fix` porque no forma parte de este ticket y podría introducir cambios no autorizados.

## UI compartida

`src/app/qr/InterstationQrGate.tsx` concentra preview `playsInline`, retícula, próximo Mundo, estado de cámara, estado de lectura, wrong/unknown QR, retry de cámara, retry de completion, close/reopen, `aria-live` y targets mínimos de 44×44. `src/app/qr/camera.ts` y `src/app/qr/interstationQr.ts` concentran capability/lifecycle y allowlist respectivamente.

El gate se renderiza mediante portal en `document.body`: el CTA cerrado queda fijo dentro de safe-area y el scanner abierto ocupa un overlay `100dvh` con scroll propio, sin heredar `overflow`, transform ni escala de Mundo I–IV. En 375×667 se midieron íntegros el inicio (`bottom 577.92/667`), CTA de W1 (`bottom 659/667`), scanner (`bottom 433.88/667`) y cierre. En 667×375 el scanner terminó en `244.38/375`; no hubo overflow horizontal. La inspección visual también confirmó cámara real de escritorio `camera-granted` y preview activo; esto no sustituye la prueba física móvil.

## QR físicos reproducibles

Directorio documental: `docs/assets/qr/interstation/`. Estos materiales físicos no se cargan en runtime y, por política, no requieren espejo en `public/assets/gvo/current-used/`.

Todos usan negro sobre blanco opaco, ECC `H`, margen de 4 módulos, sin logo ni decoración. Los PNG son `2048×2048`.

| Archivo | Payload | SHA-256 |
| --- | --- | --- |
| `gvo_qr_world1_to_world2_v01.svg` | `/qr/w2` | `6b241edc4a4a320e245784ca04f4a6d33cfa18df71bf4dd5dbd8fc7b2016bf5d` |
| `gvo_qr_world1_to_world2_v01.png` | `/qr/w2` | `7312fa524532b98af0eed223642fa7ce595b2690323c19aa5f1ae4b8367fe84f` |
| `gvo_qr_world2_to_world3_v01.svg` | `/qr/w3` | `a18ee918dc2c735f9f7a09daa411a20ec772406669c299302288d387ba37be6a` |
| `gvo_qr_world2_to_world3_v01.png` | `/qr/w3` | `1dac0254c3a49aca99ab8615d274aec29d8628c06951319cea7389b2a9272925` |
| `gvo_qr_world3_to_world4_v01.svg` | `/qr/w4` | `3e709e0ff93b00a724648e3d49de44770ad764e7a1310abb2d88bfffd43af7c4` |
| `gvo_qr_world3_to_world4_v01.png` | `/qr/w4` | `8d477040db369c95a1edfc561f4754cde79d256e6448d728e77b1b5fb5768795` |
| `gvo_qr_world4_to_world5_v01.svg` | `/qr/w5` | `516eeb13d143c944eba93a9e985bd7a47856b4c26cbd8a08f8a3736071cea73e` |
| `gvo_qr_world4_to_world5_v01.png` | `/qr/w5` | `00462cd8e57f7c233bfb53a0227f8679e4e48b60e9a36f1786a1a8501db4dd75` |

Generador: `tools/qr/generate_interstation_qr.mjs`. Verificador: `tools/qa/gvo_debt_015_verify_interstation_qr.mjs`. El verificador decodificó los ocho archivos y confirmó inventario, hashes, dimensiones, opacidad, blanco/negro, ECC, margen, payloads distintos y ausencia de valores prohibidos.

## Performance y PWA

- JS inicial de producción: `400732` bytes; `128.30 kB` gzip.
- Baseline histórico del verificador DEBT_011: `818393` bytes.
- Reducción conservada: `417661` bytes, `51.03 %`.
- Chunk lazy del decoder ZXing: `436.01 kB`; `115.18 kB` gzip.
- El service worker generó 49 entradas (`14690.07 KiB`).
- El chunk del decoder no aparece en `dist/sw.js` y los siete chunks de ruta permanecen fuera del precache; runtime cache activo.

## Validación automatizada

| Validación | Resultado |
| --- | --- |
| `npm run audit:assets` | PASS — sin URL externa, CDN ni audio |
| `npm run lint` | PASS |
| `npm test` | PASS — 45 archivos, 532 pruebas |
| `npx tsc -b --pretty false` | PASS |
| `npm run build` | PASS — 838 módulos, PWA generada |
| `npm run predev` | PASS — CA persistente, SAN dinámicos y PFX reutilizable |
| HTTPS local observado | PASS — HTTP rechazado; loopback y LAN HTTPS respondieron 200 |
| Verificador QR DEBT_015 | PASS — 4 SVG, 4 PNG, 8/8 decode |
| Verificador DEBT_013C | PASS |
| Verificador DEBT_014 | PASS |
| Verificador de chunks DEBT_011 | PASS |
| E2E focal DEBT_015 | PASS — 10/10 sobre HTTPS |
| `npm run test:e2e` | PASS — 186/186 en Chromium móvil, 17.0 min |
| Matriz revisita DEBT_007 | PASS — 9 rutas × 8 viewports sin colisión |
| `git diff --check` | PASS |

La suite E2E histórica fue reconciliada para presentar un QR válido mediante el mismo gate compartido, sin reintroducir los botones retirados. Los contratos legacy de red de ST5-020A/B/C/H ahora clasifican el origen por hostname en vez de fijar `http://`; sólo toleran `ERR_ABORTED` del mismo origen durante navegación SPA y siguen rechazando hosts externos. W5→Final aprobó tanto el caso focal DEBT_015 como sus contratos ST5-020H completos.

Incidencias de validación resueltas:

- una desconexión del VHDX produjo `EIO`; tras el remontaje humano, la unidad reapareció `Healthy/OK` y todas las validaciones se repitieron;
- la primera suite completa obtuvo `176/186` por supuestos HTTP del arnés legacy; después de la reconciliación focal, la repetición completa terminó `186/186`;
- el verificador histórico `st5_020h_verify_contracts.mjs` no aplica al baseline actual porque compara contra `ddd6859…` y el precache anterior a DEBT_011; sus dos evidencias reescritas al fallar fueron restauradas exactamente desde `HEAD`, dejando `docs/visual/` sin diff.

## Preservación comprobada

- Resolver y guards `/qr/start`, `/qr/w2`, `/qr/w3`, `/qr/w4`, `/qr/w5`: preservados.
- `docs/visual/`: sin cambios.
- `public/assets/gvo/current-used/`: sin cambios.
- Assets Cover/Portada: sin cambios y verificador 013C PASS.
- `src/screens/FinalRoot/` y `src/screens/World5Root/`: sin cambios.
- Autoridades `src/domain/progress/` y `src/domain/checkpoints/`: sin cambios.
- Implementación fullscreen: sin cambios y verificadores/E2E 014–014B PASS.
- W5→Final: preservado.

## QA físico y estado de campo

La matriz manual está preparada en `docs/qa/GVO_DEBT_015_IN_APP_QR_SCANNER_PHYSICAL_QA.md`. La prueba humana previa sí confirmó el defecto sobre HTTP en iPhone y Android, pero los casos HTTPS permanecen `NOT_EXECUTED`: todavía no se instaló la CA pública y no se repitió el recorrido real en esos dispositivos.

```text
FIELD_CAMERA_SECURE_ORIGIN_CERTIFICATION = NOT_CERTIFIED
FIELD_CAMERA_SECURE_ORIGIN_NOT_CERTIFIED
```

La automatización HTTPS local y `window.isSecureContext === true` están verificadas. No se declara `field-ready` hasta instalar la CA en ambos móviles, abrir una de las URLs HTTPS impresas por Vite y registrar grant, decode, lifecycle y responsive reales.

## Estado final del repositorio

- Worktree con cambios locales intencionales de GVO_DEBT_015.
- Commit: no creado.
- Push: no ejecutado.
- PR: no creado.
- Revisión visual automatizada: completa en portrait/landscape, incluida 375×667.
- Revisión humana física HTTPS en iPhone/Android: pendiente.

```text
GVO_DEBT_015_IMPLEMENTATION_COMPLETE_FOR_REVIEW
PENDING_HUMAN_REVIEW
FIELD_CAMERA_SECURE_ORIGIN_NOT_CERTIFIED
```
