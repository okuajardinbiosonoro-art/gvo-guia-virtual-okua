# Politica de permisos sensibles QR y camara

## 1. Estado actual

La funcionalidad QR/camara de GVO queda pendiente de implementacion funcional controlada. Este documento no autoriza activar camara, scanner QR ni `getUserMedia`.

## 2. Prohibicion base

Queda prohibido activar `navigator.mediaDevices.getUserMedia`, solicitar camara o montar scanner QR sin un ticket funcional aprobado que lo indique de forma explicita.

Tambien queda prohibido:

- solicitar microfono;
- reproducir audio;
- pedir permisos no documentados;
- activar camara en segundo plano;
- enviar imagenes o frames por red;
- guardar capturas sin consentimiento;
- depender de servicios externos para escanear QR.

## 3. Requisitos antes de implementar scanner

Antes de implementar QR/camara debe existir:

- ticket funcional aprobado;
- criterios de UX;
- criterios de privacidad;
- flujo de consentimiento;
- fallback sin camara;
- validacion en navegador movil;
- pruebas locales sin Internet;
- definicion de datos leidos del QR;
- decision sobre almacenamiento local;
- criterio de cierre visual y tecnico.

## 4. Requisitos de UX y consentimiento

La interfaz debe:

- explicar por que se solicita camara;
- pedir accion del usuario antes de abrir la camara;
- mostrar estado claro cuando la camara esta activa;
- permitir cancelar o cerrar scanner;
- ofrecer alternativa si el permiso se rechaza;
- no bloquear el recorrido si existe fallback aprobado;
- evitar textos finales incrustados en imagen.

## 5. Requisitos de fallback sin camara

El flujo debe contemplar una alternativa para visitantes sin permiso de camara, sin hardware disponible o con navegador incompatible.

Posibles fallback, sujetos a ticket:

- ingreso manual de codigo;
- seleccion de estacion en flujo controlado;
- enlace local predefinido;
- modo demo local para validacion.

El fallback no debe romper el flujo secuencial del recorrido.

## 6. Requisitos de seguridad local

La implementacion debe:

- funcionar sin Internet;
- no usar CDN;
- no enviar frames ni resultados fuera del dispositivo;
- no cargar librerias remotas;
- no registrar imagenes de camara;
- no pedir microfono;
- limitar la lectura al contenido del QR;
- validar el dato escaneado contra rutas/estaciones permitidas;
- rechazar URLs externas no aprobadas;
- registrar decisiones de seguridad en documentacion.

## 7. Requisitos de pruebas

El ticket funcional debe definir pruebas para:

- permiso concedido;
- permiso denegado;
- camara no disponible;
- QR valido;
- QR invalido;
- QR de estacion no permitida;
- fallback sin camara;
- uso mobile;
- funcionamiento local sin Internet;
- ausencia de audio y permisos adicionales.

Las pruebas que generen artefactos deben documentarse y limpiarse segun ticket.

## 8. Que queda prohibido

- Activar `getUserMedia` sin ticket.
- Pedir microfono.
- Agregar audio.
- Usar servicios externos de QR.
- Usar CDN o scripts remotos.
- Guardar capturas.
- Enviar datos a red.
- Cambiar el flujo secuencial sin documentacion.
- Agregar dependencias sin ticket de dependencias.
- Solicitar permisos por adelantado sin accion del usuario.

## 9. Relacion con operacion local MikroTik

GVO debe operar en red local. Cualquier flujo QR/camara debe respetar:

- navegacion local;
- ausencia de Internet;
- recursos servidos desde el propio proyecto;
- no dependencia de APIs externas;
- compatibilidad con el entorno de operacion local;
- no exposicion de credenciales de red o administracion.

Este documento no autoriza cambios de configuracion MikroTik.

## 10. Criterios de aprobacion humana

Antes de cerrar un ticket QR/camara, el usuario debe aprobar:

- UX de consentimiento;
- alcance exacto del permiso;
- fallback sin camara;
- pruebas ejecutadas;
- ausencia de audio;
- ausencia de red externa;
- datos almacenados o confirmacion de que no se almacenan;
- validacion mobile;
- documentacion actualizada;
- estado Git final.

## 11. Relacion con el security gate

Esta politica complementa `docs/security/SECURITY_GATE_COMANDOS_SCRIPTS_PERMISOS.md`.

Si hay duda, la regla es bloquear la activacion de permisos sensibles hasta que exista ticket funcional aprobado y evidencia tecnica suficiente.
