declare module "*lia-preview-proxy.mjs" {
  export function validateApiBase(value?: string): string;
  export function liaPreviewProxy(options: {
    enabled: boolean;
    base: string;
    upstream?: string;
  }): import("vite").Plugin;
}
