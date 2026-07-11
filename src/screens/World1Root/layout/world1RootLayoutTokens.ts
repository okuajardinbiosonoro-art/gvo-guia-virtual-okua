import type { CSSProperties } from "react";

export const WORLD1_ROOT_COORDINATE_SYSTEM_ID = "world1-stage-941x1672-004F1C";

export const WORLD1_ROOT_STAGE_ASPECT_RATIO = "941 / 1672";

export const WORLD1_ROOT_STAGE_DESIGN_WIDTH = 941;
export const WORLD1_ROOT_STAGE_DESIGN_HEIGHT = 1672;

export type World1RootLayoutStyle = CSSProperties &
  Record<`--world1-${string}`, string | number>;

export const world1RootRuntimeLayoutVariables: World1RootLayoutStyle = {
  "--world1-stage-scale": 1,
  "--world1-stage-offset-y": "0px",
  "--world1-plant-x": "50.5%",
  "--world1-plant-y": "33.5%",
  "--world1-plant-width": "40%",
  "--world1-plant-anchor-x": "56.9%",
  "--world1-plant-anchor-y": "93.2%",
  "--world1-root-origin-x": "50.8%",
  "--world1-root-origin-y": "35.9%",
  "--world1-roots-top": "20.3%",
  "--world1-roots-width": "100%",
  "--world1-active-relation-x": "49.4%",
  "--world1-active-relation-y": "70.1%",
  "--world1-active-relation-width": "96.2%",
  "--world1-active-relation-opacity": 1,
  "--world1-active-perception-x": "50%",
  "--world1-active-perception-y": "72%",
  "--world1-active-perception-width": "99.5%",
  "--world1-active-perception-opacity": 1,
  "--world1-active-mediation-x": "50%",
  "--world1-active-mediation-y": "69.4%",
  "--world1-active-mediation-width": "91.5%",
  "--world1-active-mediation-opacity": 1,
  "--world1-node-relation-x": "16%",
  "--world1-node-relation-y": "51.5%",
  "--world1-node-relation-scale": 0.92,
  "--world1-node-perception-x": "50%",
  "--world1-node-perception-y": "49.5%",
  "--world1-node-perception-scale": 0.92,
  "--world1-node-mediation-x": "84%",
  "--world1-node-mediation-y": "51.5%",
  "--world1-node-mediation-scale": 0.92,
  "--world1-ready-node-relation-y": "43%",
  "--world1-ready-node-perception-y": "41%",
  "--world1-ready-node-mediation-y": "43%",
  "--world1-node-size": "62px",
  "--world1-node-sheet-width": "238px",
  "--world1-node-sheet-height": "423px",
  "--world1-exit-path-x": "50%",
  "--world1-exit-path-y": "39%",
  "--world1-exit-path-width": "58%",
  "--world1-exit-path-opacity": 0.42,
  "--world1-lia-idle-x": "77%",
  "--world1-lia-idle-y": "10.8%",
  "--world1-lia-idle-width": "32%",
  "--world1-lia-pointRelation-x": "77%",
  "--world1-lia-pointRelation-y": "10.8%",
  "--world1-lia-pointRelation-width": "32%",
  "--world1-lia-lookPerception-x": "75%",
  "--world1-lia-lookPerception-y": "10.8%",
  "--world1-lia-lookPerception-width": "32%",
  "--world1-lia-guideMediation-x": "76%",
  "--world1-lia-guideMediation-y": "10.8%",
  "--world1-lia-guideMediation-width": "32%",
  "--world1-lia-readyContinue-x": "77%",
  "--world1-lia-readyContinue-y": "10.8%",
  "--world1-lia-readyContinue-width": "32%",
};
