import {
  worldFourToWorldFiveTransitionRoute,
  worldOneToWorldTwoTransitionRoute,
  worldThreeToWorldFourTransitionRoute,
  worldTwoToWorldThreeTransitionRoute,
} from "../routes";

export type InterstationQrOriginWorld = 1 | 2 | 3 | 4;
export type InterstationQrPayload = "/qr/w2" | "/qr/w3" | "/qr/w4" | "/qr/w5";
export type InterstationQrValidation = "unknown" | "valid" | "wrong";

export type InterstationQrContract = Readonly<{
  nextWorld: 2 | 3 | 4 | 5;
  payload: InterstationQrPayload;
  transitionRoute: string;
}>;

export const interstationQrContracts: Readonly<
  Record<InterstationQrOriginWorld, InterstationQrContract>
> = {
  1: {
    nextWorld: 2,
    payload: "/qr/w2",
    transitionRoute: worldOneToWorldTwoTransitionRoute,
  },
  2: {
    nextWorld: 3,
    payload: "/qr/w3",
    transitionRoute: worldTwoToWorldThreeTransitionRoute,
  },
  3: {
    nextWorld: 4,
    payload: "/qr/w4",
    transitionRoute: worldThreeToWorldFourTransitionRoute,
  },
  4: {
    nextWorld: 5,
    payload: "/qr/w5",
    transitionRoute: worldFourToWorldFiveTransitionRoute,
  },
};

const interstationPayloadAllowlist = new Set<InterstationQrPayload>(
  Object.values(interstationQrContracts).map((contract) => contract.payload),
);

export function validateInterstationQrPayload(
  originWorld: InterstationQrOriginWorld,
  rawPayload: string,
): InterstationQrValidation {
  const payload = rawPayload.trim();
  if (payload === interstationQrContracts[originWorld].payload) {
    return "valid";
  }

  return interstationPayloadAllowlist.has(payload as InterstationQrPayload)
    ? "wrong"
    : "unknown";
}
