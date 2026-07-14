/** Check pixel procedural de Estación III (SVG por rejilla, crispEdges). */

type Palette = Record<string, string>;

function PixelSprite({
  pixels,
  palette,
  className,
}: {
  pixels: readonly string[];
  palette: Palette;
  className?: string;
}) {
  const width = Math.max(...pixels.map((row) => row.length));

  return (
    <svg
      className={className}
      viewBox={`0 0 ${width} ${pixels.length}`}
      shapeRendering="crispEdges"
      focusable="false"
      aria-hidden="true"
    >
      {pixels.flatMap((row, y) =>
        Array.from(row).flatMap((char, x) => {
          const fill = palette[char];
          if (!fill) {
            return [];
          }
          return [
            <rect
              fill={fill}
              height={1}
              key={`${x}-${y}`}
              width={1}
              x={x}
              y={y}
            />,
          ];
        }),
      )}
    </svg>
  );
}

/* --- Check pixel --------------------------------------------------------- */

const checkPalette: Palette = {
  O: "#7a6a55",
  P: "#f1e8d2",
  C: "#4f8f37",
  c: "#7cc352",
};

const checkDonePixels: readonly string[] = [
  "OOOOOOOOO",
  "OPPPPPPPO",
  "OPPPPPcPO",
  "OPPPPCcPO",
  "OPcPCCPPO",
  "OPCcCPPPO",
  "OPPCPPPPO",
  "OPPPPPPPO",
  "OOOOOOOOO",
];

const checkEmptyPixels: readonly string[] = [
  "OOOOOOOOO",
  "OPPPPPPPO",
  "OPPPPPPPO",
  "OPPPPPPPO",
  "OPPPPPPPO",
  "OPPPPPPPO",
  "OPPPPPPPO",
  "OPPPPPPPO",
  "OOOOOOOOO",
];

export function PixelCheck({
  className,
  checked,
}: {
  className?: string;
  checked: boolean;
}) {
  return (
    <PixelSprite
      className={className}
      pixels={checked ? checkDonePixels : checkEmptyPixels}
      palette={checkPalette}
    />
  );
}
