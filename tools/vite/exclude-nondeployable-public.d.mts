import type { Plugin } from "vite";

export const NON_DEPLOYABLE_PUBLIC_ARTIFACTS: readonly string[];

export function excludeNonDeployablePublicArtifacts(): Plugin;
