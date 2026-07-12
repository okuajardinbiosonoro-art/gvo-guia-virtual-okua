# Assets runtime — world-5-root (Estación V — Mapa del presente)

Registro de assets usados por `src/screens/World5Root/World5RootScreen.tsx`
(ticket FABLE5-S5-01).

## Assets compartidos referenciados (no duplicados)

La pantalla reutiliza la Lía oficial 2.5D ya registrada como asset compartido.
Se referencia por ruta absoluta pública; no se copia para evitar duplicados,
igual que en `world-4-root/`:

| Uso | Ruta runtime |
| --- | --- |
| Lía guía (pose calmada) | `/assets/gvo/shared/lia/current-used/portada-intro/lia_pose_explain_calm_v1.png` |
| Lía cierre (pose saludo) | `/assets/gvo/shared/lia/current-used/portada-intro/lia_pose_greeting_v1.png` |

## Visuales procedurales (slots reemplazables)

Los objetos de las cuatro áreas (Plantas, Sistema, Espacio, Visitante), el
nexo central, las conexiones punteadas y la maqueta son SVG/CSS procedurales
definidos en `src/screens/World5Root/station5AreaArt.tsx` y
`World5RootScreen.css`. Son placeholders con arquitectura de slot:

| Slot | Clave estable | Punto de reemplazo |
| --- | --- | --- |
| Área Plantas | `visualKey: "plants"` / `data-station5-visual="plants"` | `station5AreaArt.tsx` |
| Área Sistema | `visualKey: "system"` / `data-station5-visual="system"` | `station5AreaArt.tsx` |
| Área Espacio | `visualKey: "space"` / `data-station5-visual="space"` | `station5AreaArt.tsx` |
| Área Visitante | `visualKey: "visitor"` / `data-station5-visual="visitor"` | `station5AreaArt.tsx` |

Cuando Codex integre assets finales, copiarlos a esta carpeta y actualizar el
renderer correspondiente (o sustituirlo por `<img>` con `data-runtime-asset`).
