# T003E8 - Integracion real Portada a Transicion y Mundo I

## 1. Resumen del ticket

T003E8 conecta funcionalmente el flujo real:

`Portada / Intro -> Transicion entre mundos -> Mundo I: Raiz`

El cambio mantiene `/dev/transition-world` como preview tecnico aislado y crea una ruta runtime separada para ejecutar la transicion con navegacion automatica al finalizar. No se rediseno Portada, no se rediseno TransitionWorld, no se tocaron assets visuales, no se cambio tipografia global y no se agregaron dependencias.

## 2. Rama base y rama final

- Rama base: `feature/003E7G-typography-visual-validation`
- Commit base: `76eb138 docs: validate gvo typography visual consistency`
- Rama final: `feature/003E8-cover-to-transition-flow`

## 3. Rutas auditadas

Rutas existentes antes de T003E8:

- `/`: Carga Inicial con handoff a Portada.
- `/carga`: Carga Inicial aislada.
- `/portada`: Portada / Intro.
- `/dev/transition-world`: preview tecnico de TransitionWorld sin navegacion.
- `/estacion/:stationId`: placeholder de estaciones.
- `/final`: placeholder final.
- `/qr/:stationId`: placeholder QR.

Ruta de Mundo I existente:

- `/estacion/1`: shell/placeholder tecnico existente para `Estacion I - Mundo I: Raiz`.

No existia una ruta runtime real para la transicion.

## 4. Ruta runtime de transicion

Ruta creada:

`/transition/intro-to-station-1`

Esta ruta renderiza `TransitionWorld` en `variant="runtime"` con la configuracion `intro-to-station-1`.

Comportamiento:

- muestra la transicion real;
- no muestra botones;
- no muestra links;
- bloquea taps sobre la transicion;
- respeta `durationMs: 2300`;
- respeta `reducedMotionDurationMs: 1000`;
- navega una sola vez al destino configurado.

## 5. Flujo Portada -> Transicion -> Mundo I

Flujo implementado:

1. El visitante abre `/portada?resetIntro=1`.
2. Pulsa `Comenzar recorrido`.
3. Completa los dialogos de Lia.
4. Pulsa `Entrar a Mundo I`.
5. Portada conserva la coreografia breve de activacion del Portal I.
6. Despues de `920ms`, Portada navega a `/transition/intro-to-station-1`.
7. TransitionWorld ejecuta la transicion runtime.
8. Al terminar, TransitionWorld navega a `/estacion/1`.

La transicion ya no depende del overlay placeholder de Portada ni del link manual `Continuar a Mundo I`.

## 6. Destino usado

Destino usado:

`/estacion/1`

Motivo:

- ya existia en el router;
- ya representa `Estacion I - Mundo I: Raiz`;
- evita inventar contenido pedagogico nuevo;
- permite validar el flujo continuo sin crear una pantalla final de Mundo I.

## 7. Shell temporal y deuda

No se creo un shell nuevo.

Se reutilizo el shell tecnico existente `StationPlaceholder` para `/estacion/1`. Ese destino muestra:

- `Estacion placeholder`;
- `Estacion I - Mundo I: Raiz`;
- `Ruta base creada para navegacion secuencial y acceso por QR fisico.`;
- aviso de transicion reutilizable pendiente.

Deuda explicita:

- `/estacion/1` no es la pantalla final de Mundo I.
- El contenido pedagogico real de Mundo I no se implementa en este ticket.

## 8. Doble navegacion

Protecciones implementadas:

- Portada usa `portalHandoffStartedRef` para ignorar clicks repetidos sobre `Entrar a Mundo I`.
- El CTA queda `disabled` durante `portal_1_opening_placeholder`.
- El boton del Portal I queda `disabled` mientras la apertura esta en curso.
- TransitionWorld usa `completionCalledRef` para ejecutar `onComplete` una sola vez.
- TransitionWorld limpia el timer al desmontarse.
- La ruta runtime marca `data-navigation-locked="true"` y CSS bloquea `pointer-events` y seleccion de usuario.

## 9. Estado de `/dev/transition-world`

`/dev/transition-world` se conserva como preview tecnico aislado.

Confirmaciones:

- renderiza `TransitionWorld` en `variant="preview"`;
- no navega al finalizar;
- mantiene textos, assets, progress, Lia, portal y sparkles;
- no muestra botones ni links;
- sigue cubierto por `tests/e2e/transition-world.spec.ts`.

## 10. Reduced motion runtime

En reduced motion:

- la ruta runtime conserva `data-reduced-motion="true"`;
- usa `reducedMotionDurationMs: 1000`;
- mantiene portal, Lia, texto y progress visibles;
- no agrega interaccion;
- navega automaticamente a `/estacion/1` al finalizar la version reducida.

## 11. Validacion manual desde celular

PC:

```powershell
npm run dev -- --host 0.0.0.0
```

Movil en la misma red:

```txt
http://IP_DEL_PC:5173/portada?resetIntro=1
```

Flujo esperado:

1. completar Portada / Intro;
2. pulsar `Entrar a Mundo I`;
3. ver la transicion real;
4. llegar automaticamente al shell de `Estacion I - Mundo I: Raiz`.

## 12. Capturas generadas

Carpeta:

`docs/visual/transition-world/validation/t003e8/`

Archivos:

- `flow-cover-start-390x844.png`
- `flow-transition-mid-390x844.png`
- `flow-destination-390x844.png`
- `flow-cover-start-430x932.png`
- `flow-transition-mid-430x932.png`
- `flow-destination-430x932.png`

## 13. Validaciones ejecutadas

```powershell
npm run validate:transition-root-assets
npm run lint
npm run test
npm run build
npm run audit:assets
npm run test:e2e -- tests/e2e/transition-world.spec.ts
npm run test:e2e -- tests/e2e/cover-to-transition-flow.spec.ts
npm run test:e2e -- tests/e2e/smoke.spec.ts
npm run test:e2e
```

Tambien se verifico manualmente en navegador integrado:

- inicio: `http://127.0.0.1:5173/transition/intro-to-station-1`;
- destino final: `http://127.0.0.1:5173/estacion/1`.

## 14. Resultado de validaciones

- `npm run validate:transition-root-assets`: OK, 34 archivos runtime validados.
- `npm run lint`: OK.
- `npm run test`: OK, 5 archivos y 45 tests.
- `npm run build`: OK.
- `npm run audit:assets`: OK, sin URLs externas, CDN ni uso de audio.
- `npm run test:e2e -- tests/e2e/transition-world.spec.ts`: OK, 4 tests.
- `npm run test:e2e -- tests/e2e/cover-to-transition-flow.spec.ts`: OK, 2 tests.
- `npm run test:e2e -- tests/e2e/smoke.spec.ts`: OK, 12 tests.
- `npm run test:e2e`: OK, 34 tests.

Incidente observado:

- Una primera ejecucion completa de `npm run test:e2e` fallo una vez en `smoke.spec.ts` para `/carga 430x932` porque no encontro el heading `Preparando el recorrido` dentro del timeout.
- Se re-ejecuto `npm run test:e2e -- tests/e2e/smoke.spec.ts` y paso completo.
- Se re-ejecuto `npm run test:e2e` y paso completo con 34 tests.
- No se aplico cambio de codigo por ese incidente porque quedo reproducido como fallo aislado no persistente.

## 15. Estado final del repo

Estado esperado al cierre:

- rama publicada en `origin/feature/003E8-cover-to-transition-flow`;
- working tree limpio;
- capturas historicas regeneradas por suites e2e restauradas antes del commit;
- capturas T003E8 conservadas.

## 16. Errores, fallos, bloqueos o deudas detectadas

Errores encontrados:

- Primer `npm run test:e2e` completo tuvo un fallo aislado en `/carga 430x932`; no persistio tras reintento.

Fallos restantes:

- No se detectan fallos persistentes en validaciones finales.

Bloqueos:

- Ninguno.

Deudas:

- `/estacion/1` sigue siendo un placeholder tecnico, no el Mundo I final.
- El manifest historico de intake de assets de transicion conserva metadata de planificacion previa; el runtime real se gobierna desde `transitionWorld.config.ts`.
- Las suites de QA visual historicas siguen regenerando capturas fuera de alcance; esas capturas deben restaurarse en tickets que no busquen actualizarlas.
