import http from "node:http";
import { URL } from "node:url";
import { Buffer } from "node:buffer";
import { setTimeout, clearTimeout } from "node:timers";

export function validateApiBase(value = "/lia-api") {
  if (!/^\/lia-api(?:-[a-z0-9]+)?$/.test(value))
    throw new Error("Invalid relative LIA_API_BASE");
  return value;
}
export function validLocalHeaders(req, host, origin) {
  const counts = Object.create(null);
  for (let i = 0; i < req.rawHeaders.length; i += 2) {
    const key = req.rawHeaders[i].toLowerCase();
    counts[key] = (counts[key] ?? 0) + 1;
  }
  const authorityValid = req.httpVersionMajor === 2
    ? counts[":authority"] === 1 && req.headers[":authority"] === host &&
      !counts.host && req.headers[":scheme"] === origin.split(":")[0]
    : counts.host === 1 && req.headers.host === host && !counts[":authority"];
  return Boolean(host && authorityValid && (counts.origin ?? 0) <= 1 &&
    (req.headers.origin === undefined || req.headers.origin === origin) &&
    req.headers["sec-fetch-site"] !== "cross-site");
}
export function liaPreviewProxy({ enabled, base, upstream }) {
  base = validateApiBase(base);
  let target;
  if (enabled && upstream) {
    target = new URL(upstream);
    if (
      target.protocol !== "http:" ||
      target.hostname !== "127.0.0.1" ||
      !/^(4915[2-9]|491[6-9][0-9]|4920[0-9]|4921[0-5])$/.test(target.port) ||
      target.pathname !== "/" ||
      target.username ||
      target.password ||
      target.search ||
      target.hash
    )
      throw new Error("Invalid loopback upstream");
  }
  return {
    name: "lia-preview-loopback-only",
    apply: "serve",
    configureServer(server) {
      const prefix = (url) => url === base || url?.startsWith(base + "/");
      const reject = (res, code) => {
        if (res.writableEnded || res.destroyed) return;
        res.writeHead(code, {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff",
        });
        res.end('{"error":"unavailable"}');
      };
      server.httpServer?.on("upgrade", (req, socket) => {
        if (prefix(req.url)) socket.destroy();
      });
      server.middlewares.use((req, res, next) => {
        if (!prefix(req.url)) return next();
        // Vite's preceding CORS middleware is for development assets. This
        // same-origin API has its own boundary and never advertises CORS.
        for (const header of res.getHeaderNames()) {
          if (header.toLowerCase().startsWith("access-control-")) res.removeHeader(header);
        }
        const address = server.httpServer?.address();
        const host =
          typeof address === "object" && address
            ? `127.0.0.1:${address.port}`
            : "";
        const origin = `${server.config.server.https ? "https" : "http"}://${host}`;
        const counts = Object.create(null);
        for (let i = 0; i < req.rawHeaders.length; i += 2) {
          const key = req.rawHeaders[i].toLowerCase();
          counts[key] = (counts[key] ?? 0) + 1;
        }
        if (
          !validLocalHeaders(req, host, origin)
        )
          return reject(res, 403);
        if (!enabled || !target) return reject(res, 503);
        const route = req.url.slice(base.length);
        const valid =
          (req.method === "GET" &&
            ["/healthz", "/readyz", "/v1/about"].includes(route)) ||
          (req.method === "POST" && route === "/v1/conversations/messages");
        if (!valid) return reject(res, 404);
        if (
          req.method === "POST" &&
          (req.headers["content-type"] !== "application/json" ||
            req.headers["content-encoding"] ||
            (counts["content-length"] ?? 0) > 1 ||
            Number(req.headers["content-length"] ?? 0) > 8192)
        )
          return reject(res, 413);
        const chunks = [];
        let bytes = 0;
        let finished = false;
        let outgoing;
        const deadline = setTimeout(() => {
          finished = true;
          outgoing?.destroy();
          reject(res, 408);
        }, 2000);
        res.on("close", () => {
          clearTimeout(deadline);
          outgoing?.destroy();
        });
        req.on("error", () => {
          clearTimeout(deadline);
          finished = true;
          reject(res, 400);
        });
        req.on("data", (chunk) => {
          bytes += chunk.length;
          if (bytes > 8192) {
            finished = true;
            clearTimeout(deadline);
            reject(res, 413);
          } else if (!finished) chunks.push(chunk);
        });
        req.on("end", () => {
          clearTimeout(deadline);
          if (finished) return;
          const body = Buffer.concat(chunks);
          outgoing = http.request(
            {
              hostname: target.hostname,
              port: target.port,
              path: route,
              method: req.method,
              headers: {
                Host: target.host,
                Origin: target.origin,
                ...(req.method === "POST"
                  ? {
                      "Content-Type": "application/json",
                      "Content-Length": String(body.length),
                    }
                  : {}),
              },
            },
            (response) => {
              const parts = [];
              let size = 0;
              response.on("data", (chunk) => {
                size += chunk.length;
                if (size > 32768) {
                  outgoing.destroy();
                  reject(res, 502);
                } else parts.push(chunk);
              });
              response.on("end", () => {
                if (res.writableEnded || res.destroyed) return;
                if (
                  !response.headers["content-type"]?.startsWith(
                    "application/json",
                  )
                )
                  return reject(res, 502);
                res.writeHead(response.statusCode ?? 502, {
                  "Content-Type": "application/json",
                  "Cache-Control": "no-store",
                  "X-Content-Type-Options": "nosniff",
                });
                res.end(Buffer.concat(parts));
              });
              response.on("error", () => reject(res, 502));
            },
          );
          outgoing.setTimeout(3000, () => {
            outgoing.destroy();
            reject(res, 504);
          });
          outgoing.on("error", () => reject(res, 503));
          outgoing.end(body);
        });
      });
    },
  };
}
