const photoAssets = "/assets/gvo/stations/final-root/photo";

export const finalLiaPhotoAssets = {
  shoulder: `${photoAssets}/lia-photo-shoulder-v03.webp`,
  peek: `${photoAssets}/lia-photo-peek-v03.webp`,
  inscriptionFont: `${photoAssets}/type/Cinzel.ttf`,
  logo: "/assets/runtime/cover-intro/brand/okua-jardin-biosonoro-logo-v01.png",
};

type MonthDay = { month: number; day: number };
type PhotoFrame = {
  id: string;
  label: { es: string; en: string };
  garland: string;
  engraving?: string;
  garlandPlacement: { top: number; bottom: number; edge: number };
  backdrop: readonly [string, string, string];
  paper: readonly [string, string, string];
  outline: string;
  photoEdge: string;
  lights?: { wire: string; glow: string; bulb: string };
  season?: { start: MonthDay; end: MonthDay };
};

const gardenFrame: PhotoFrame = {
  id: "garden",
  label: { es: "Jardín", en: "Garden" },
  garland: `${photoAssets}/okua-photo-vine-v03.webp`,
  engraving: `${photoAssets}/okua-photo-engraving-v01.webp`,
  garlandPlacement: { top: 14, bottom: 1232, edge: 0.61 },
  backdrop: ["#704c54", "#48313e", "#251c28"],
  paper: ["#fff0d5", "#f0dec3", "#e0bc96"],
  outline: "#9e6c4b6c",
  photoEdge: "#644858",
};

const seasonalFrames: PhotoFrame[] = [
  {
    id: "christmas",
    label: { es: "Navidad", en: "Christmas" },
    garland: `${photoAssets}/frames/okua-photo-christmas-v01.webp`,
    garlandPlacement: { top: 23, bottom: 1091, edge: 0.85 },
    backdrop: ["#803d46", "#51252f", "#271d27"],
    paper: ["#fff9eb", "#f6edda", "#e6cead"],
    outline: "#345846ad",
    photoEdge: "#4a6052",
    lights: { wire: "#b1875757", glow: "#ffb25248", bulb: "#fff2c8" },
    season: { start: { month: 11, day: 16 }, end: { month: 1, day: 6 } },
  },
];

const siteCalendar = new Intl.DateTimeFormat("en", {
  timeZone: "America/Bogota",
  month: "numeric",
  day: "numeric",
});

function calendarDay({ month, day }: MonthDay) {
  return month * 100 + day;
}

export function availablePhotoFrames(now = new Date()): readonly PhotoFrame[] {
  const parts = siteCalendar.formatToParts(now);
  const today = calendarDay({
    month: Number(parts.find((part) => part.type === "month")?.value),
    day: Number(parts.find((part) => part.type === "day")?.value),
  });
  const seasonal = seasonalFrames.find(({ season }) => {
    if (!season) return false;
    const start = calendarDay(season.start);
    const end = calendarDay(season.end);
    return start <= end ? today >= start && today <= end : today >= start || today <= end;
  });
  return seasonal ? [seasonal, gardenFrame] : [gardenFrame];
}

export function getFinalLiaPhotoImages() {
  return [
    finalLiaPhotoAssets.logo,
    finalLiaPhotoAssets.shoulder,
    finalLiaPhotoAssets.peek,
    ...availablePhotoFrames().flatMap(({ garland, engraving }) => engraving ? [garland, engraving] : [garland]),
  ];
}

export type { PhotoFrame };
