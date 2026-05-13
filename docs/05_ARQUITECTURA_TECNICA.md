# Arquitectura técnica

La base técnica usa Vite, React, TypeScript y React Router. La aplicación se sirve como web local y debe poder empaquetar todos sus recursos de runtime en el build.

## Carpetas principales

- `src/app`: aplicación, router y providers.
- `src/components`: componentes reutilizables.
- `src/data`: datos estáticos del flujo.
- `src/domain`: reglas de dominio, como progreso secuencial.
- `src/screens`: pantallas placeholder y futuras pantallas reales.
- `src/styles`: tokens y estilos globales.
- `docs`: documentación viva del proyecto.
- `tools`: scripts de auditoría y estado.
- `tests/e2e`: pruebas end-to-end.

## Progreso

La capa mínima de progreso usa `localStorage`. Permite leer progreso, marcar estaciones completadas, reiniciar progreso y validar acceso secuencial.

## PWA

La PWA queda configurada de forma mínima para cache local básico. No usa notificaciones push ni solicita permisos innecesarios.
