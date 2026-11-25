# ADR-0019 · Volver a jugar desde la portada

Candidata de desarrollo para revisión del escritor y de gerencia, 25 de noviembre de 2026.

Al finalizar la visita, los cinco accesos del Mirador permiten consultar las salas con los resultados que obtuvo el visitante. «Volver al inicio» lleva a los cinco portales desde los que se puede volver a participar. Las dos entradas usan las mismas pantallas y los mismos recursos locales.

Abrir un portal en la portada de regreso inicia una práctica en la pestaña. La aplicación la sirve bajo `/repetir/` y dirige sus escrituras de avance a un registro independiente en `sessionStorage`. El idioma y el volumen siguen siendo preferencias del visitante. Una recarga recupera el estado de la práctica. «Portales» vuelve a la selección de salas. El Mirador muestra el resultado de la visita original.

La trivia ofrece una primera ronda y un único reintento tras un resultado inferior a cuatro aciertos. Un registro anterior puede contener hasta cuatro rondas. La aplicación puede consultar todas ellas y terminar una ya empezada bajo la regla anterior. Un acierto perfecto en la práctica se celebra allí. El comprobante original del premio se conserva.

La ruta de repetición usa el mismo documento de entrada de la aplicación. El servidor de revisión debe servirlo también para las rutas bajo `/repetir/`. Los cuatro códigos de paso conservan sus valores canónicos `/qr/w2`, `/qr/w3`, `/qr/w4` y `/qr/w5`.
