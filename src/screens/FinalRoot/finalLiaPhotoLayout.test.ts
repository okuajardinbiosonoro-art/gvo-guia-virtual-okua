import { describe, expect, it } from "vitest";
import { defaultPhotoPlacement, liaPlacementClearsFaces, planLiaPlacement, portraitCover, protectedFace } from "./finalLiaPhotoLayout";

const preference = defaultPhotoPlacement.shoulder;
const face = { x: 0.13, y: 0.19, width: 0.32, height: 0.27, confidence: 100 };

describe("Lía within the portrait", () => {
  it("fills a single continuous frame with the camera image", () => {
    expect(portraitCover(640, 480, 414, 505)).toEqual({
      x: expect.closeTo(-129.67), y: expect.closeTo(0), width: expect.closeTo(673.33), height: expect.closeTo(505),
    });
  });

  it("adapts to a face moving between sides", () => {
    const rightFace = { ...face, x: 0.56 };
    const left = planLiaPlacement([rightFace], preference, "shoulder")!;
    const right = planLiaPlacement([face], preference, "shoulder")!;
    expect(left.x).toBeLessThan(right.x);
    expect(liaPlacementClearsFaces(left, [rightFace], "shoulder")).toBe(true);
    expect(liaPlacementClearsFaces(right, [face], "shoulder")).toBe(true);
  });

  it("keeps the sprite clear of every detected face", () => {
    const otherFace = { ...face, x: 0.60, y: 0.40, confidence: 30 };
    const sprite = planLiaPlacement([face, otherFace], preference, "shoulder")!;
    expect(liaPlacementClearsFaces(sprite, [face, otherFace], "shoulder")).toBe(true);
  });

  it("leaves Lía out if the detected face fills the frame", () => {
    for (const pose of ["shoulder", "peek"] as const) {
      expect(planLiaPlacement([{ x: 0, y: 0, width: 1, height: 1, confidence: 100 }], defaultPhotoPlacement[pose], pose)).toBeUndefined();
    }
  });

  it("keeps a prominent pose above the head when there is space", () => {
    const head = { ...face, x: 0.3, y: 0.42 };
    const peek = planLiaPlacement([head], defaultPhotoPlacement.peek, "peek")!;
    expect(peek.width).toBeGreaterThan(0.45);
    expect(peek.y + peek.height).toBeLessThan(protectedFace(head).y);
    expect(liaPlacementClearsFaces(peek, [head], "peek")).toBe(true);
  });

  it("keeps the small pose high when the head is close to the top edge", () => {
    const highHead = { ...face, x: 0.33, y: 0.03 };
    const peek = planLiaPlacement([highHead], defaultPhotoPlacement.peek, "peek")!;
    expect(peek.y).toBeLessThan(0.15);
    expect(liaPlacementClearsFaces(peek, [highHead], "peek")).toBe(true);
  });

  it("keeps both poses prominent on the close-up from the synthetic portrait", () => {
    const closeUp = { x: 0.215, y: 0.088, width: 0.541, height: 0.444, confidence: 55 };
    const shoulder = planLiaPlacement([closeUp], defaultPhotoPlacement.shoulder, "shoulder")!;
    const peek = planLiaPlacement([closeUp], defaultPhotoPlacement.peek, "peek")!;
    expect(shoulder.width).toBeGreaterThan(0.52);
    expect(peek.width).toBeGreaterThan(0.27);
    expect(peek.y).toBeLessThan(0.14);
    expect(liaPlacementClearsFaces(peek, [closeUp], "peek")).toBe(true);
    expect(liaPlacementClearsFaces(shoulder, [closeUp], "shoulder")).toBe(true);
  });

  it("follows a larger face to the side that has more space by default", () => {
    const right = { x: 0.46, y: 0.19, width: 0.4, height: 0.326, confidence: 55 };
    const left = { ...right, x: 0.14 };
    const shoulder = defaultPhotoPlacement.shoulder;
    expect(planLiaPlacement([right], shoulder, "shoulder")!.x).toBeLessThan(0.35);
    expect(planLiaPlacement([left], shoulder, "shoulder")!.x).toBeGreaterThan(planLiaPlacement([right], shoulder, "shoulder")!.x + 0.2);
  });

  it("keeps different sizes and heights if tracking finds no face", () => {
    expect(planLiaPlacement([], defaultPhotoPlacement.shoulder, "shoulder")).toMatchObject({ y: expect.closeTo(0.5025), width: 0.58 });
    expect(planLiaPlacement([], defaultPhotoPlacement.peek, "peek")).toMatchObject({ y: 0.065, width: 0.46 });
  });
});
