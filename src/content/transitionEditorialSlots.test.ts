import { describe, expect, it } from "vitest";

import { resolveEditorialText } from "./editorial";
import { transitionEditorialSlots } from "./transitionEditorialSlots";
import { transitionWorldConfigs } from "../screens/TransitionWorld/transitionWorld.config";

const transitionInventory = [
  {
    configKey: "introToStationOne",
    id: "intro-to-station-1",
    route: "/transition/intro-to-station-1",
    fromRoute: "/portada",
    toRoute: "/estacion/1",
    titleSlotId: "TRANS_COVER_W1_TITLE_01",
    subtitleSlotId: "TRANS_COVER_W1_SUB_01",
    title: "Abriendo Sala I · Raíz",
    subtitle: "Preparando tu recorrido",
    titleShortText: "Abriendo Sala I",
    subtitleShortText: "Preparando tu recorrido",
    targetPreload: "world1RootInitial",
  },
  {
    configKey: "worldOneToWorldTwo",
    id: "world-1-to-world-2",
    route: "/transition/world-1-to-world-2",
    fromRoute: "/estacion/1",
    toRoute: "/estacion/2",
    titleSlotId: "TRANS_W1_W2_TITLE_01",
    subtitleSlotId: "TRANS_W1_W2_SUB_01",
    title: "Abriendo Sala II · Pulso invisible",
    subtitle: "Preparando tu recorrido",
    titleShortText: "Abriendo Sala II",
    subtitleShortText: "Preparando tu recorrido",
    targetPreload: "world2RootInitial",
  },
  {
    configKey: "worldTwoToWorldThree",
    id: "world-2-to-world-3",
    route: "/transition/world-2-to-world-3",
    fromRoute: "/estacion/2",
    toRoute: "/estacion/3",
    titleSlotId: "TRANS_W2_W3_TITLE_01",
    subtitleSlotId: "TRANS_W2_W3_SUB_01",
    title: "Abriendo Sala III · Cuaderno de práctica",
    subtitle: "Preparando tu recorrido",
    titleShortText: "Abriendo Sala III",
    subtitleShortText: "Preparando tu recorrido",
    targetPreload: "world3RootInitial",
  },
  {
    configKey: "worldThreeToWorldFour",
    id: "world-3-to-world-4",
    route: "/transition/world-3-to-world-4",
    fromRoute: "/estacion/3",
    toRoute: "/estacion/4",
    titleSlotId: "TRANS_W3_W4_TITLE_01",
    subtitleSlotId: "TRANS_W3_W4_SUB_01",
    title: "Abriendo Sala IV · Sistema biosonoro",
    subtitle: "Preparando tu recorrido",
    titleShortText: "Abriendo Sala IV",
    subtitleShortText: "Preparando tu recorrido",
    targetPreload: "world4RootInitial",
  },
  {
    configKey: "worldFourToWorldFive",
    id: "world-4-to-world-5",
    route: "/transition/world-4-to-world-5",
    fromRoute: "/estacion/4",
    toRoute: "/estacion/5",
    titleSlotId: "TRANS_W4_W5_TITLE_01",
    subtitleSlotId: "TRANS_W4_W5_SUB_01",
    title: "Abriendo Sala V · OKÚA, arte sensorial",
    subtitle: "Preparando tu recorrido",
    titleShortText: "Abriendo Sala V",
    subtitleShortText: "Preparando tu recorrido",
    targetPreload: "world5MapCritical",
  },
  {
    configKey: "worldFiveToFinal",
    id: "world-5-to-final",
    route: "/transition/world-5-to-final",
    fromRoute: "/estacion/5",
    toRoute: "/final",
    titleSlotId: "TRANS_W5_FINAL_TITLE_01",
    subtitleSlotId: "TRANS_W5_FINAL_SUB_01",
    title: "Abriendo el Mirador",
    subtitle: "Preparando el cierre del recorrido.",
    titleShortText: "Abriendo el Mirador",
    subtitleShortText: "Cierre del recorrido",
    targetPreload: "finalRootInitial",
  },
] as const;

const forbiddenTransitionCopy =
  /\b(?:TEMP|TODO|TBD|PLACEHOLDER|PROVISIONAL|DRAFT|LOREM)\b|MUNDO SIGUIENTE|SIGUIENTE MUNDO|CARGANDO\.\.\./iu;

describe("transitionEditorialSlots", () => {
  it("cubre exactamente todas las transiciones runtime existentes", () => {
    expect(Object.keys(transitionWorldConfigs)).toEqual(
      transitionInventory.map(({ configKey }) => configKey),
    );
    expect(Object.keys(transitionEditorialSlots)).toHaveLength(
      transitionInventory.length * 2,
    );
  });

  it.each(transitionInventory)(
    "$id corresponde ruta, destino y copy final",
    (expected) => {
      const config =
        transitionWorldConfigs[
          expected.configKey as keyof typeof transitionWorldConfigs
        ];
      const titleSlot = resolveEditorialText(expected.titleSlotId);
      const subtitleSlot = resolveEditorialText(expected.subtitleSlotId);

      expect(expected.route).toBe(`/transition/${config.id}`);
      expect(config).toMatchObject({
        id: expected.id,
        fromRoute: expected.fromRoute,
        toRoute: expected.toRoute,
        titleSlotId: expected.titleSlotId,
        subtitleSlotId: expected.subtitleSlotId,
        title: expected.title,
        subtitle: expected.subtitle,
        targetPreload: expected.targetPreload,
        durationMs: 2300,
        reducedMotionDurationMs: 1000,
        portalState: "open",
        portalSymbol: "root",
        editorialCopyStatus: expected.configKey === "worldFiveToFinal" ? "final" : "review",
      });

      expect(titleSlot).toMatchObject({
        slotId: expected.titleSlotId,
        text: expected.title,
        shortText: expected.titleShortText,
        locale: "es",
        source: expected.configKey === "worldFiveToFinal" ? "human_approved" : "editorial_excel",
        status: expected.configKey === "worldFiveToFinal" ? "FINAL" : "REVIEW",
      });
      expect(subtitleSlot).toMatchObject({
        slotId: expected.subtitleSlotId,
        text: expected.subtitle,
        shortText: expected.subtitleShortText,
        locale: "es",
        source: expected.configKey === "worldFiveToFinal" ? "human_approved" : "editorial_excel",
        status: expected.configKey === "worldFiveToFinal" ? "FINAL" : "REVIEW",
      });

      for (const slotId of [
        expected.titleSlotId,
        expected.subtitleSlotId,
      ] as const) {
        expect(transitionEditorialSlots[slotId]).toMatchObject({
          id: slotId,
          replacement: null,
          status: expected.configKey === "worldFiveToFinal" ? "final" : "review",
        });
      }

      expect(`${config.title} ${config.subtitle}`).not.toMatch(
        forbiddenTransitionCopy,
      );
    },
  );
});
