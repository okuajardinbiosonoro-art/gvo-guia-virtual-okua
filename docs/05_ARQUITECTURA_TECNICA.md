# Arquitectura técnica

La base técnica usa Vite, React, TypeScript y React Router. La aplicación se sirve como web local y debe poder empaquetar todos sus recursos de runtime en el build.

## Carpetas principales

- `src/app`: aplicación, router y providers.
- `src/components`: componentes reutilizables.
- `src/data`: datos estáticos del flujo.
- `src/domain`: reglas de dominio, como progreso secuencial.
- `src/screens`: pantallas runtime, pantallas de desarrollo autorizadas y placeholders restantes.
- `src/styles`: tokens y estilos globales.
- `docs`: documentación viva del proyecto.
- `tools`: scripts de auditoría y estado.
- `tests/e2e`: pruebas end-to-end.

## Progreso

La capa mínima de progreso usa `localStorage`. Permite leer progreso, marcar estaciones completadas, reiniciar progreso y validar acceso secuencial.

## PWA

La PWA queda configurada de forma mínima para cache local básico. No usa notificaciones push ni solicita permisos innecesarios.

## Estado de rutas runtime 007C

- `/` y `/carga`: carga inicial.
- `/portada`: Portada / Intro.
- `/transition/intro-to-station-1`: transición runtime desde Portada hacia Mundo I.
- `/dev/transition-world`: preview técnica aislada de transición.
- `/dev/world1-root-layout`: calibrador técnico de Mundo I.
- `/estacion/1`: Mundo I: Raíz montado con `World1RootScreen`.
- `/estacion/:stationId`: placeholder para estaciones no implementadas, excepto `/estacion/1`.
- `/final`: placeholder de final.
- `/qr/:stationId`: placeholder de acceso QR.

Las rutas de desarrollo y placeholders no deben confundirse con pantallas finales. Cualquier avance de estaciones II-V o final requiere ticket aprobado.
