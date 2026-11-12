# Editor local del escritor · 2026-10-29

Autorización: petición directa de José David del 29 de octubre de 2026.
Preparar un nuevo paquete editorial desde la candidata OBS05 build02,
manteniendo la aplicación de edición conocida. Mejorar guardado sencillo,
recuperación de borradores al cambiar/cerrar pestaña y aviso de salida;
permitir añadir, quitar y mover textos y simplificar color/tipografía.

Base ejecutable: `.tool-reports/obs05/build02/candidate`, índice SHA-256
`96d518d5887e4e8fe9da7a489ab82171cbff830f4c74fdfae367e0eaf70fc941`.
El editor anterior v3 permanece intacto como antecedente. Su catálogo y su
build antiguo no se presentan como la versión actual. Las propuestas del
escritor quedan separadas del original y no se integran automáticamente.

Alcance: herramientas editoriales y copia distribuida para Windows 10/11,
entrada directa a pantallas/estados sólo en esa copia, recursos locales,
catálogo actualizado, documentación, QA y ZIP autocontenido con SHA-256.
Conservar el servidor local, navegación conocida y exportación de entrega.
Usar tipografías incluidas/locales; no cargar fuentes ni servicios externos.
El guardado confirmado debe persistir en el PC, con copia de recuperación;
el borrador del navegador debe distinguirse de la entrega exportada.

Criterios: no perder cambios al cambiar de registro/sala/pestaña, recargar o
reabrir; avisar ante fallo de almacenamiento o guardado; no sobrescribir
cambios concurrentes; recuperar adiciones, eliminaciones reversibles, estilos
y posiciones tras exportar/importar y reiniciar el servidor. Verificar
coordenadas/selección en tamaños móvil/escritorio y texto modificado por React.
El paquete inicial no debe contener borradores, datos de QA ni historiales
del editor anterior. Los controles editoriales no se añaden a la candidata.

Límites: no cambiar narrativa o lógica de la aplicación visitante, no crear
assets nuevos de salas, no publicar ni desplegar, no crear ramas/PR, no hacer
commit/push. El estado técnico no implica aprobación humana del producto.
La coordinación metodológica continúa en el mismo ChatGPT contextual de GVO.
