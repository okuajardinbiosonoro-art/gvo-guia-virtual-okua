# GVO — Mundo I: Raiz
## Mobile layout audit 004F-0A

## 0. Estado

Estado del ticket: AUDITORIA DOCUMENTAL COMPLETADA.

Pantalla auditada:

```txt
/estacion/1
```

Estados revisados:

- intro
- relation
- perception
- mediation
- ready_to_continue

Viewports:

- `360x800`
- `390x844`
- `430x932`

Evidencia:

```txt
docs/gvo/performance/validation/004F0A/world1-intro_360x800.png
docs/gvo/performance/validation/004F0A/world1-intro_390x844.png
docs/gvo/performance/validation/004F0A/world1-intro_430x932.png
docs/gvo/performance/validation/004F0A/world1_ready_360x800.png
docs/gvo/performance/validation/004F0A/world1_ready_390x844.png
docs/gvo/performance/validation/004F0A/world1_ready_430x932.png
```

## 1. Observaciones del usuario incorporadas

La auditoria toma como insumos las observaciones manuales recientes:

- en celular los nodos pueden tapar textos o competir con lectura;
- el camino de salida se ve sobrepuesto/pegado;
- planta y raiz todavia pueden requerir verificacion fina de alineacion;
- la carga por capas se percibe lenta;
- mobile es el objetivo primario, no una adaptacion secundaria.

## 2. Hallazgos de layout mobile

### 2.1 Overflow

No se detecto overflow horizontal en `/estacion/1` para 360, 390 ni 430 px.

El estado `ready_to_continue` no genero scroll vertical en las capturas runtime.

### 2.2 Nodos y panel inferior

Los nodos RELACION, PERCEPCION y MEDIACION son legibles, pero en 360 px quedan cerca del panel inferior.

Riesgo:

- al agregar motion, estados activos, focus scaling o dialogos mas largos, los nodos pueden invadir el espacio de lectura;
- si se mantiene el panel bajo y los nodos descienden, puede reaparecer la lectura confusa reportada por el usuario.

Recomendacion:

- reservar una zona segura entre nodos y panel;
- no aumentar escala de nodos en mobile sin recalibracion;
- evitar que estados activos empujen visualmente los nodos hacia el texto.

### 2.3 Camino de salida

En `ready_to_continue`, el camino de salida funciona tecnicamente y no rompe overflow, pero visualmente se percibe como una capa grande sobrepuesta a la escena.

Riesgo:

- si se conecta navegacion real con esta capa sin calibracion, puede sentirse pegada al fondo en lugar de integrada como salida organica.

Recomendacion:

- separar variables de posicion/tamano/opacidad del camino de salida;
- incluir el estado `ready_to_continue` en la herramienta de calibracion;
- precargar y decodificar el asset antes de mostrar el estado ready para evitar aparicion tardia.

### 2.4 Planta y raiz

La planta y la raiz base se ven suficientemente estables para seguir con auditoria/preload. Sin embargo, por el peso de capas y la sensibilidad visual del usuario, la alineacion debe seguir validandose en dispositivo real antes de agregar animacion.

Recomendacion:

- no mover planta ni raiz en este ticket;
- congelar los valores actuales como base de auditoria;
- si se abre ticket visual, calibrar solo con capturas mobile reales.

### 2.5 Lía

Lía no invade el panel inferior ni bloquea los nodos en las capturas auditadas.

Recomendacion:

- no mover Lía durante trabajos de performance;
- cualquier motion futura debe mantener su zona segura actual.

## 3. Hallazgos de performance visual en Mundo I

Mundo I usa pocos elementos visibles al inicio, pero solicita muchos recursos de imagen. Esto explica que en mobile se perciba carga por capas aunque el layout no se desborde.

Datos medidos:

- `/estacion/1`: 40 recursos de imagen.
- peso medido de recursos: 7908.9 KB.
- inventario total Mundo I: 19.55 MB.
- critico inicial estimado: 5.01 MB.

Activos mas sensibles:

- background base: 2.03 MB;
- planta joven: 0.78 MB;
- Lía idle: 0.70 MB;
- raices activas: 1.24 MB a 1.38 MB cada una;
- camino de salida: 2.09 MB.

## 4. Recomendaciones especificas para Mundo I

1. Implementar preload/decode por estado antes de animar.

2. Cargar al inicio solo:
   - fondo;
   - planta;
   - raiz base;
   - Lía idle;
   - nodos base.

3. Cargar cada raiz activa antes de entrar a su estado correspondiente.

4. Cargar el camino de salida durante MEDIACION, no desde el primer frame.

5. Evitar focus scaling fuerte en 360 px hasta que exista una zona segura real para panel/nodos.

6. Mantener la herramienta `/dev/world1-root-layout` como apoyo, pero no aplicar valores arbitrarios sin ticket visual.

## 5. Decision tecnica para siguientes tickets

Antes de agregar animaciones, teletransportes, particulas, root flow o navegacion final, se recomienda resolver:

- estrategia de preload/decode por bundle;
- calibracion especifica del camino de salida;
- zona segura de nodos contra panel en 360 px;
- validacion en dispositivo real.

Este ticket no implementa esas mejoras; solo deja la auditoria y la evidencia.

## 6. Fuera de alcance confirmado

- No se implemento animacion.
- No se implemento teleport.
- No se implemento root flow.
- No se implemento focus scaling.
- No se cambio el layout de Mundo I.
- No se modificaron assets.
- No se agregaron dependencias.
