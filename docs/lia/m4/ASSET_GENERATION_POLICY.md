# Política M4 de producción de assets

Capacidad detectada: IMAGE_GENERATION_AVAILABLE por herramienta image_gen.imagegen. No se genera nada en discovery. El gate de dirección autoriza un máximo total de 12 candidatos (6 estados × 2 variantes), incluyendo intentos válidos: registrar fallos y no reiniciar el contador por reparación. Mantener estado CANDIDATE hasta decisión humana en el gate final. Ningún asset de Internet.

En cada candidato registrar prompt, restricciones negativas, herramienta/modelo efectivamente reportado (UNKNOWN si no se expone), timestamp, canvas, alpha/background, concepto fuente, hash, referencia y derechos/provenance. Guardar originales; no sobrescribir ni reexportar el arte canónico. No integrar candidatos en producción ni afirmar aprobación automática por QA técnica. Si no hay capacidad, conservar prompt pack ejecutable y usar assets canónicos con states DOM; como máximo una deuda P1, sin bloquear el prototipo.

Sólo después del gate y bajo el concepto seleccionado, registrar los assets usados por la preview en current-used/lia-preview con consumidor, funciones, dimensiones, hash y estado exacto. El mirror no cambia el import runtime. Las ilustraciones no agregan hechos al conocimiento.
