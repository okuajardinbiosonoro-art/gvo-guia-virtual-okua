# QR físicos entre estaciones

Paquete reproducible de GVO_DEBT_015. Contiene exclusivamente los cuatro tokens host-independent del recorrido normal:

| Origen | Destino | Payload |
| --- | --- | --- |
| Mundo I | Mundo II | `/qr/w2` |
| Mundo II | Mundo III | `/qr/w3` |
| Mundo III | Mundo IV | `/qr/w4` |
| Mundo IV | Mundo V | `/qr/w5` |

Cada SVG es el master vectorial. Cada PNG es 2048×2048, negro sobre blanco opaco, ECC H y margen de cuatro módulos. No contienen logo, decoración, URL absoluta, IP, hostname, Wi-Fi ni `/qr/start`.

Regenerar desde la raíz del repositorio:

```text
node tools/qr/generate_interstation_qr.mjs
node tools/qa/gvo_debt_015_verify_interstation_qr.mjs
```

Estos archivos son material físico/documental y no se cargan en runtime; por ello no pertenecen a `public/assets/gvo/current-used/<pantalla>/`.
