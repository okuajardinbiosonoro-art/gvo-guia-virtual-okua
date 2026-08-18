# GVO_DEBT_015 — Preparación HTTPS local para iOS y Android

## 1. Arranque del servidor

En la raíz del repositorio:

```powershell
npm run dev
```

El prearranque detecta todas las IPv4 locales activas. Vite escucha en `0.0.0.0` y muestra una o más URLs `https://<IP-ACTUAL>:5173`. No se debe reutilizar una URL impresa en otra red: después de cambiar de red, detener y volver a ejecutar el comando.

La autoridad permanece estable. Sólo el certificado servidor se renueva si cambian las direcciones, por lo que los dispositivos no deben reinstalar la autoridad en cada red.

## 2. Archivo público para dispositivos

Compartir únicamente:

```text
.gvo-dev-certs/GVO_LOCAL_DEVELOPMENT_CA.cer
```

No compartir `gvo-dev-server.pfx`, `metadata.json` ni archivos del almacén de certificados. La clave privada de la autoridad no es exportable y permanece en el usuario actual de Windows.

## 3. iPhone / iPad

1. Transferir el `.cer` al dispositivo por un medio local controlado y abrirlo.
2. Instalar el perfil descargado desde Ajustes.
3. Abrir Ajustes → General → Información → Ajustes de confianza de certificados.
4. Habilitar confianza total para `GVO Local Development CA`.
5. Conectar el dispositivo a una red que alcance al equipo servidor.
6. Abrir exactamente una de las URLs HTTPS impresas por Vite.
7. Confirmar que el navegador no presenta advertencia de certificado y que `/inicio` solicita cámara después de `Iniciar recorrido`.

## 4. Android

1. Transferir el `.cer` al dispositivo por un medio local controlado.
2. En Ajustes de seguridad, instalarlo como certificado CA para apps/VPN; el nombre exacto del menú depende del fabricante y versión.
3. Conectar el dispositivo a una red que alcance al equipo servidor.
4. Abrir exactamente una de las URLs HTTPS impresas por Vite en Chrome.
5. Confirmar que no aparece advertencia de certificado y que `/inicio` solicita cámara después de `Iniciar recorrido`.

## 5. Comprobación mínima

En cada dispositivo registrar:

- URL completa usada;
- navegador y versión;
- `camera-granted` en `/inicio`;
- apertura y cierre del scanner al final de Mundo I;
- indicador físico de cámara apagado al cerrar;
- ausencia de recorte en 375×667 y en orientación horizontal.

La existencia de HTTPS automatizado no equivale por sí sola a certificación física. El estado cambia a `CERTIFIED` únicamente después de registrar los resultados reales en la matriz QA.

## 6. Rollback del equipo servidor

Para retirar del usuario Windows actual la autoridad y el certificado servidor generados por GVO:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File tools/dev/remove_https_trust.ps1
```

El script valida dos thumbprints exactos desde metadata antes de eliminar y no toca otras autoridades. Los perfiles instalados en iOS/Android se retiran manualmente desde cada dispositivo.
