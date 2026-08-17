# GVO_DEBT_014B — QA fullscreen móvil en dispositivo real

Estado: `PENDING_REAL_DEVICE_QA`  
Este procedimiento no autoriza publicación ni convierte emulación en evidencia física.

## Preparación

1. Conectar el computador y el teléfono a la misma LAN.
2. En el repositorio ejecutar:

   ```powershell
   npm run build
   npx vite preview --host=0.0.0.0 --port=4175 --strictPort
   ```

3. Tomar la URL `Network` correspondiente a la interfaz Wi-Fi. En la sesión de
   implementación fue `http://172.20.10.2:4175`; la IP puede cambiar.
4. No instalar la PWA, no usar Add to Home Screen y no abrir desde un Web Clip.
5. Abrir directamente en el navegador del teléfono:

   ```text
   http://<IP-LAN>:4175/qa/fullscreen/index.html
   ```

El probe es una herramienta técnica sin enlace desde el recorrido normal.

## Android Chrome

1. Abrir el probe en Chrome Android.
2. Registrar dispositivo, Android, Chrome, URL, protocolo y orientación.
3. Confirmar que el probe declara `topLevel: true`.
4. Pulsar `PROBAR FULLSCREEN` una sola vez.
5. Para PASS deben aparecer:
   - `Capability: active`;
   - `requestOutcome.method: standard` o un método prefijado realmente expuesto;
   - `requestOutcome.result: fullscreen-element-present`;
   - `fullscreenElement: HTML`.
6. Confirmar visualmente que el browser chrome salió del viewport.
7. Pulsar `SALIR FULLSCREEN` y confirmar `fullscreenElement: null`.
8. Abrir `http://<IP-LAN>:4175/inicio`.
9. Elegir idioma y comprobar que `Activar pantalla completa` está visible y habilitado.
10. Hacer tap, iniciar el recorrido y llegar a Portada sin perder fullscreen.
11. Salir mediante el control global.
12. Repetir en portrait y landscape, con toolbar expandida y contraída.
13. Si algo falla, pulsar `COPIAR DIAGNÓSTICO` y conservar el JSON íntegro.

Resultado permitido sólo con tap físico y `fullscreenElement` real:

```text
ANDROID_REAL_FULLSCREEN_PASS
```

## Segundo navegador Android

Repetir el bloque anterior en el segundo navegador disponible: Samsung Internet,
Edge, Opera u otro Chromium-family. Registrar nombre y versión exactos. No asumir
que el resultado de Chrome aplica al segundo navegador.

## iPhone Safari

1. Abrir el probe directamente en Safari mediante la URL LAN.
2. Si `requestFullscreen` y los métodos prefijados están ausentes, registrar:

   ```text
   fullscreen-unavailable-on-platform
   ```

3. Abrir `/inicio` y confirmar que no aparece un botón fullscreen deshabilitado.
4. Confirmar el mensaje: `La vista de navegador ya está optimizada para este dispositivo.`
5. Elegir idioma y verificar que `Iniciar recorrido` permanece habilitado.
6. Entrar a Portada y confirmar que no existe control global fullscreen ni hueco de dock.
7. Navegar, hacer scroll donde corresponda y rotar portrait/landscape.
8. Verificar safe areas, toolbar expandida/contraída y ausencia de solapes.

Si Safari no ofrece Element Fullscreen API y el recorrido funciona correctamente,
los únicos resultados válidos son:

```text
IPHONE_FULLSCREEN_PLATFORM_LIMITATION_CONFIRMED
IPHONE_PRODUCT_FALLBACK_PASS
```

No declarar `REAL_FULLSCREEN_PASS` para ese caso.

## iPad Safari, si está disponible

Tratarlo como categoría independiente. Si el probe detecta API real, aplicar el
mismo contrato de Android: control habilitado, tap físico, elemento fullscreen,
navegación SPA y salida. Si no hay API, registrar la evidencia sin extrapolar el
resultado del iPhone.

## Registro por dispositivo

| Campo | Valor |
| --- | --- |
| Device | |
| OS y versión | |
| Browser y versión | |
| URL exacta | |
| Protocol / hostname | |
| Orientación | |
| `isSecureContext` | |
| `fullscreenEnabled` | |
| Request method | |
| Botón visible / disabled | |
| Resultado del tap | |
| `fullscreenElement` | |
| Fallback path | |
| Resultado | `PASS` / `EXPECTED_LIMITATION` / `FAIL` |

Adjuntar debajo el JSON producido por `COPIAR DIAGNÓSTICO` sin editarlo.

## Criterios de bloqueo

- Un test desktop con viewport móvil no prueba dispositivo real.
- Un mock de Fullscreen API sólo prueba contrato DOM.
- `display-mode: standalone` no prueba Element Fullscreen API.
- PWA instalada, Add to Home Screen o Web Clip invalidan el recorrido visitante
  que este ticket debe certificar.
- Sin dispositivo físico no se emite ningún `ANDROID_REAL_FULLSCREEN_PASS` ni
  `IPHONE_PRODUCT_FALLBACK_PASS`.
