# Slots de texto — Estación I: Mundo Raíz

## Propósito

Este archivo lista los textos que debe producir o revisar el escritor para Mundo Raiz. No contiene textos finales obligatorios. Su funcion es facilitar revision por ID, estado y necesidad de interfaz sin imponer una voz literaria cerrada.

## Tabla de slots

| ID | Estado | Emisor sugerido | Tipo de texto | Contexto visual | Accion previa | Funcion del texto | Concepto obligatorio | Evitar | Longitud sugerida |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| W1_INTRO_LIA_01 | `w1_intro` | Lia | Entrada | Mundo raiz visible con planta joven, raices y Lia. | Transicion a Mundo I finalizo. | Presentar el origen vivo de OKUA y abrir la lectura de la estacion. | Planta viva / origen | Tecnica avanzada o promesa de audio | 90-160 caracteres |
| W1_INTRO_AMB_01 | `w1_intro` | Ambiente | Texto ambiental | Fondo organico/subterraneo y raices luminosas. | El visitante acaba de entrar. | Crear clima de cuidado y observacion. | Raiz / cuidado | Tratar la planta como decoracion | 50-110 caracteres |
| W1_RELACION_HINT_01 | `w1_relacion_available` | Lia | Instruccion contextual | Nodo RELACIÓN disponible. | Entrada leida o escena inicial disponible. | Invitar a activar el primer nodo. | Relacion | Orden agresiva o mecanica | 40-90 caracteres |
| W1_RELACION_AMB_01 | `w1_relacion_active` | Ambiente | Respuesta ambiental | Nodo o raiz de RELACIÓN se ilumina. | Visitante toco RELACIÓN. | Conectar planta y visitante desde el vinculo. | Relacion | Emocion humana literal | 50-120 caracteres |
| W1_RELACION_CONFIRM_01 | `w1_relacion_active` | Lia | Confirmacion breve | RELACIÓN queda marcada como comprendida. | Visitante lee la respuesta ambiental. | Confirmar que observar tambien es relacionarse. | Observacion / vinculo | Leerlo como minijuego decorativo | 40-90 caracteres |
| W1_PERCEPCION_HINT_01 | `w1_percepcion_available` | Lia | Instruccion contextual | Nodo PERCEPCIÓN queda disponible. | RELACIÓN fue completada. | Dirigir la atencion a lo no evidente. | Percepcion | Poder magico | 40-90 caracteres |
| W1_PERCEPCION_AMB_01 | `w1_percepcion_active` | Ambiente | Respuesta ambiental | Raiz o luz de PERCEPCIÓN se activa. | Visitante toco PERCEPCIÓN. | Mostrar que una planta puede sostener actividad no visible. | Percepcion | Planta que canta | 50-120 caracteres |
| W1_PERCEPCION_CONFIRM_01 | `w1_percepcion_active` | Lia | Confirmacion breve | PERCEPCIÓN queda marcada como comprendida. | Visitante lee la respuesta ambiental. | Confirmar atencion a procesos invisibles. | Lo no evidente | Sobrenatural o magia literal | 40-90 caracteres |
| W1_MEDIACION_HINT_01 | `w1_mediacion_available` | Lia | Instruccion contextual | Nodo MEDIACIÓN queda disponible. | PERCEPCIÓN fue completada. | Invitar a activar el tercer nodo. | Mediacion | Cadena tecnica completa | 40-90 caracteres |
| W1_MEDIACION_AMB_01 | `w1_mediacion_active` | Ambiente | Respuesta ambiental | Raiz o luz de MEDIACIÓN se activa. | Visitante toco MEDIACIÓN. | Preparar la idea de interpretacion cuidadosa. | Mediacion | Reemplazar la planta | 50-130 caracteres |
| W1_MEDIACION_CONFIRM_01 | `w1_mediacion_active` | Lia | Confirmacion breve | La triada conceptual queda completa. | Visitante lee la respuesta ambiental. | Cerrar relacion, percepcion y mediacion como secuencia. | Experiencia mediada | Voz falsa de la planta | 40-100 caracteres |
| W1_NODE_LOCKED_01 | `w1_node_locked` | Lia o sistema | Bloqueo suave | Nodo fuera de orden no avanza. | Visitante toca un nodo bloqueado. | Orientar al siguiente nodo correcto sin frustrar. | Secuencia pedagogica | Regano o error tecnico | 35-90 caracteres |
| W1_NODE_REPEAT_01 | `w1_node_locked` | Lia o sistema | Relectura / repeticion | Nodo ya completado recibe nuevo toque. | Visitante repite un nodo ya leido. | Indicar que ese paso ya fue revisado. | Revision cuidadosa | Castigo o falla | 35-90 caracteres |
| W1_COMPLETE_LIA_01 | `w1_complete` | Lia | Cierre | Tres nodos activados y raiz completa. | Visitante completo MEDIACION. | Cerrar Mundo I y preparar Mundo II. | Antes de escuchar, aprender a mirar | Explicar senal completa | 80-150 caracteres |
| W1_COMPLETE_AMB_01 | `w1_complete` | Ambiente | Cierre ambiental | Escena completa con todos los nodos activos. | Cierre de Lia disponible. | Dejar sensacion de origen y paso hacia lo invisible. | Origen / raiz | Triunfalismo tecnico | 50-120 caracteres |
| W1_CONTINUE_BTN_01 | `w1_complete` | Sistema / interfaz | Boton | Boton continuar habilitado. | Estacion completada. | Avanzar a la transicion hacia Mundo II. | Avance secuencial | Texto ambiguo | 1-4 palabras |
| W1_ACCESSIBLE_SCENE_01 | `w1_intro` | Sistema / accesibilidad | Descripcion accesible | Escena completa de planta, raiz, nodos y Lia. | Ingreso a Mundo I. | Describir la pantalla para fallback o lector de pantalla. | Planta, raiz, Lia | Texto excesivo | 90-170 caracteres |
| W1_ACCESSIBLE_RELACION_01 | `w1_relacion_active` | Sistema / accesibilidad | Descripcion accesible | RELACIÓN esta activo. | Activacion de RELACIÓN. | Describir el estado del primer nodo. | Relacion | Decoracion | 70-140 caracteres |
| W1_ACCESSIBLE_PERCEPCION_01 | `w1_percepcion_active` | Sistema / accesibilidad | Descripcion accesible | PERCEPCIÓN esta activo. | Activacion de PERCEPCIÓN. | Describir el estado del segundo nodo. | Percepcion | Magia literal | 70-140 caracteres |
| W1_ACCESSIBLE_MEDIACION_01 | `w1_mediacion_active` | Sistema / accesibilidad | Descripcion accesible | MEDIACIÓN esta activo. | Activacion de MEDIACIÓN. | Describir el estado del tercer nodo. | Mediacion | Reemplazo de la planta | 70-140 caracteres |
