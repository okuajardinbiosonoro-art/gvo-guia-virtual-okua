# ADR-0008 — Preview extractiva desde el Mirador

LIA-M3-01 añade `/final/lia` con el guard existente de cierre completo y flag apagado por defecto. Entrada y regreso conservan progreso; foco vuelve al enlace de Lía. Pantalla dedicada con historial sólo en memoria, hasta 20 turnos. No reutiliza consola QA.

El browser usa `LIA_API_BASE=/lia-api`. El proxy Vite valida Host/Origin y destinos loopback antes de traducir cabeceras; no CORS amplio, cookies ni selección pública de runtime. El SW usa NetworkOnly y excluye el namespace API del fallback. Rutas ya visitadas conservan el contrato offline existente.

Copy centralizado en `liaPreviewCopy`, estado DRAFT_COPY. Asset aprobado reutilizado y registrado en current-used. La autorización M3 específica prevalece sobre la regla general de no crear PRs: una rama y un Draft PR previstos por repositorio. Sin producción, campo o M4 automático.
