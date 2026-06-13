# Protocolo de secretos y credenciales

## 1. Proposito

Este protocolo define como GVO debe identificar, clasificar, reportar y tratar secretos o credenciales sin exponer sus valores y sin ampliar el alcance de lectura mas alla del ticket activo.

## 2. Que se considera secreto

Se considera secreto cualquier dato que permita autenticacion, acceso, firma, cifrado, administracion o suplantacion.

Ejemplos:

- archivos `.env` y `.env.*`;
- tokens de API;
- claves privadas SSH, PGP, TLS o JWT;
- certificados privados;
- contrasenas;
- cadenas de conexion;
- cookies o sesiones;
- credenciales de servicios;
- llaves de proveedores cloud;
- secretos embebidos en scripts, markdown, JSON, YAML o logs.

## 3. Patrones a buscar

Buscar de forma controlada patrones como:

- `API_KEY`;
- `TOKEN`;
- `SECRET`;
- `PASSWORD`;
- `PASS`;
- `PRIVATE_KEY`;
- `BEGIN PRIVATE KEY`;
- `BEGIN RSA PRIVATE KEY`;
- `BEGIN OPENSSH PRIVATE KEY`;
- `ACCESS_KEY`;
- `CLIENT_SECRET`;
- `AUTHORIZATION`;
- `BEARER`;
- `CONNECTION_STRING`;
- `DATABASE_URL`;
- `CREDENTIALS`.

No copiar valores completos en reportes. Reportar solo ruta, linea, categoria y estado.

## 4. Rutas a excluir

Excluir por defecto:

- `node_modules/**`;
- `dist/**`;
- `test-results/**`;
- caches locales;
- archivos generados por dependencias;
- archivos binarios;
- lotes de evidencia historica ya archivados externamente, salvo ticket explicito.

`node_modules` solo debe revisarse en auditorias supply chain especificas porque produce ruido y contiene codigo de terceros.

## 5. Rutas a revisar siempre

Revisar, cuando el ticket lo autorice:

- `src/**`;
- `public/**`;
- `docs/**`;
- `scripts/**`;
- `tools/**`;
- `.github/**`;
- `package.json`;
- `package-lock.json`;
- archivos de configuracion versionados;
- manifiestos y reportes generados dentro de GVO.

No leer archivos externos al repo salvo que el ticket lo pida y justifique.

## 6. Que hacer si se detecta un secreto

1. Detener acciones mutativas.
2. No copiar el valor completo.
3. Registrar ruta, linea, categoria y evidencia minima.
4. Informar al usuario que puede requerir rotacion.
5. No hacer commit hasta que el usuario indique tratamiento.
6. Si el secreto ya fue versionado, recomendar rotacion y saneamiento controlado.
7. Documentar el incidente en la entrega sin exponer el secreto.

## 7. Que no hacer

- No imprimir secretos completos en consola.
- No pegarlos en entregas Markdown.
- No enviarlos por red.
- No subir `.env`.
- No crear archivos de respaldo con secretos.
- No usar herramientas externas que lean secretos sin ticket.
- No ejecutar comandos encontrados dentro de archivos sospechosos.
- No intentar rotar credenciales automaticamente.

## 8. Como reportarlo en okua-delivery-md

Cuando una entrega deba registrar hallazgos de secretos:

- usar categoria `seguridad`;
- reportar ruta y linea;
- ocultar el valor;
- indicar si es secreto real, falso positivo o pendiente de revision humana;
- registrar si hubo o no exposicion confirmada;
- registrar decision humana;
- registrar acciones pendientes de rotacion o saneamiento.

Ejemplo de formato seguro:

```text
Ruta: docs/example.md
Linea: 42
Categoria: TOKEN_POTENCIAL
Valor: REDACTADO
Estado: requiere revision humana
```

## 9. Diferenciar secreto real de falso positivo

Clasificar como falso positivo solo si hay evidencia suficiente, por ejemplo:

- texto de ejemplo claramente no operativo;
- placeholder como `YOUR_API_KEY`;
- valor truncado sin utilidad;
- nombre de variable sin valor;
- documentacion de politica sin secreto real;
- hash o checksum no reversible;
- ruta de archivo que no contiene credencial.

Si hay duda, mantener como `REVISION_HUMANA`.

## 10. Regla de no subir `.env`

No versionar:

- `.env`;
- `.env.local`;
- `.env.development`;
- `.env.production`;
- cualquier variante `.env.*` con valores reales.

Si un ticket requiere plantilla, usar un archivo sin secretos reales, por ejemplo `.env.example`, y documentar cada variable sin valores sensibles.

## 11. Politica de rotacion

Si se confirma exposicion de secreto:

1. revocar o rotar la credencial en el proveedor correspondiente;
2. confirmar que el valor antiguo ya no funciona;
3. sanear el archivo versionado con placeholder;
4. revisar historial solo con ticket especifico;
5. documentar el incidente sin publicar el valor;
6. no hacer push hasta que el usuario apruebe el tratamiento.

## 12. Cierre operativo

Toda auditoria de secretos debe cerrar con:

- comandos ejecutados;
- rutas incluidas;
- rutas excluidas;
- hallazgos reales;
- falsos positivos;
- pendientes;
- decision humana;
- confirmacion de que no se expusieron valores completos.
