# Prompt nuevo chat - 002 Portada / Intro GVO

Vas a continuar el proyecto GVO - Guía Virtual OKÚA.

## Contexto del proyecto

GVO es una aplicación web local, mobile-first e insonora para guiar el recorrido OKÚA mediante QR físicos dentro de una red MikroTik sin Internet. El visitante debe usar el navegador móvil, sin instalación, sin CDN, sin recursos externos, sin audio y sin video runtime.

## Estado del repo

- Repositorio: `https://github.com/okuajardinbiosonoro-art/gvo-guia-virtual-okua.git`
- Base actual: `main`
- Carga inicial V13 consolidada en `main`.
- Commit V13: `87e048b feat: register initial loading frames timeline`
- Tag: `checkpoint/carga-inicial-v13-7p2`
- Rutas de carga inicial: `/` y `/carga`
- Estado de carga inicial: `APROBADA_PARA_AVANZAR / 7.2_DE_10 / DEUDA_VISUAL_DOCUMENTADA`
- La carga inicial no está `CERRADA_APROBADA_FINAL`.
- Portada / Intro está `PREPRODUCCION_DESBLOQUEADA / NO_IMPLEMENTADA`.

## Metodología de avance por umbral visual

- `APROBADA_PARA_AVANZAR`: calificación usuario >= 7/10, aprobación explícita del usuario Ing. José David, estabilidad técnica, reglas no negociables cumplidas y deuda visual documentada.
- `CERRADA_APROBADA_FINAL`: calificación objetivo >= 9/10 y sin deuda visual importante.
- `main` puede contener pantallas aprobadas para avanzar, no necesariamente finales.
- No avanzar a implementación funcional sin ticket explícito.

## Insumos locales

Ruta local de insumos:

`C:\Users\JOSE DAVID\Desktop\OKÚA\Aplicaciones\GVO_archivos_iniciales`

Archivos que se adjuntarán al nuevo chat:

- `GVO_PORTADA_ARCHIVO_VIVO_ESPECIFICACION_V1.txt`
- `portada.png`

No usar ZIP en el nuevo chat. Adjuntar los archivos directamente.

Ruta local sugerida para nuevos assets:

`C:\Users\JOSE DAVID\Desktop\OKÚA\Aplicaciones\GVO_archivos_iniciales\portada_intro_v1\`

Estructura sugerida:

```text
portada_intro_v1\
├── 00_especificacion\
├── 01_referencias_chatgpt\
├── 02_aprobadas\
│   ├── reference\
│   ├── lia\
│   ├── portals\
│   ├── locks\
│   ├── background\
│   ├── button\
│   └── dialog\
├── 03_editables_photopea\
├── 04_runtime_export\
├── 05_descartadas\
└── 06_notas_revision\
```

## Qué debe hacer el nuevo chat

1. Leer la especificación de Portada / Intro.
2. Analizar `portada.png` como referencia visual, no como runtime final.
3. Ayudar a producir o seleccionar assets visuales para Portada / Intro.
4. Mantener UI final como DOM/CSS.
5. Separar responsabilidades entre usuario, ChatGPT Images, Photopea y Codex.
6. Preparar assets para que un ticket posterior de Codex pueda implementar runtime.

## Qué no debe hacer

- No implementar portada.
- No tocar React.
- No crear rutas.
- No modificar carga inicial.
- No crear estaciones.
- No crear transición entre mundos.
- No usar ZIP como única entrada.
- No usar CDN.
- No usar recursos externos.
- No agregar audio.
- No agregar video runtime.
- No marcar `CERRADA_APROBADA_FINAL`.

## Primer paso esperado

Analizar la especificación `GVO_PORTADA_ARCHIVO_VIVO_ESPECIFICACION_V1.txt` y la referencia `portada.png`, luego proponer un plan de producción de assets `portada_intro_v1` con prompts para ChatGPT Images y tareas de limpieza en Photopea. No escribir código todavía.
