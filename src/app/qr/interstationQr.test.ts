import { describe, expect, it } from "vitest";

import {
  interstationQrContracts,
  validateInterstationQrPayload,
} from "./interstationQr";

describe("interstation QR contract", () => {
  it("mantiene payloads host-independent y transiciones secuenciales", () => {
    expect(
      Object.values(interstationQrContracts).map(({ payload }) => payload),
    ).toEqual(["/qr/w2", "/qr/w3", "/qr/w4", "/qr/w5"]);
    expect(
      Object.values(interstationQrContracts).map(
        ({ transitionRoute }) => transitionRoute,
      ),
    ).toEqual([
      "/transition/world-1-to-world-2",
      "/transition/world-2-to-world-3",
      "/transition/world-3-to-world-4",
      "/transition/world-4-to-world-5",
    ]);
  });

  it("acepta sólo trim más coincidencia exacta esperada por mundo", () => {
    expect(validateInterstationQrPayload(1, "  /qr/w2\n")).toBe("valid");
    expect(validateInterstationQrPayload(1, "/qr/w3")).toBe("wrong");
    expect(
      validateInterstationQrPayload(1, ["https:", "", "gvo.test", "qr", "w2"].join("/")),
    ).toBe("unknown");
    expect(validateInterstationQrPayload(1, "javascript:/qr/w2")).toBe(
      "unknown",
    );
    expect(validateInterstationQrPayload(4, "/qr/w5?next=/final")).toBe(
      "unknown",
    );
  });
});
