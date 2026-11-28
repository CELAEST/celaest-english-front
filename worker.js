/**
 * Parses a single HTTP Range header (`bytes=start-end`, `bytes=start-`, `bytes=-suffix`).
 */
export function parseByteRange(rangeHeader, totalSize) {
  if (!rangeHeader || !rangeHeader.startsWith("bytes=") || totalSize <= 0) {
    return null;
  }
  const spec = rangeHeader.slice(6).split(",")[0]?.trim() || "";
  const dashIdx = spec.indexOf("-");
  if (dashIdx === -1) return null;

  const rawStart = spec.slice(0, dashIdx).trim();
  const rawEnd = spec.slice(dashIdx + 1).trim();

  if (rawStart === "") {
    const suffix = Number(rawEnd);
    if (!Number.isInteger(suffix) || suffix <= 0) return null;
    const start = Math.max(0, totalSize - suffix);
    return { start, end: totalSize - 1 };
  }

  const start = Number(rawStart);
  const end = rawEnd === "" ? totalSize - 1 : Math.min(totalSize - 1, Number(rawEnd));
  if (
    !Number.isInteger(start) ||
    !Number.isInteger(end) ||
    start < 0 ||
    start >= totalSize ||
    end < start
  ) {
    return null;
  }
  return { start, end };
}

function sliceByteStream(body, start, end) {
  let offset = 0;
  const transformer = new TransformStream({
    transform(chunk, controller) {
      const chunkStart = offset;
      const chunkEnd = offset + chunk.byteLength - 1;
      offset += chunk.byteLength;

      if (chunkEnd < start) return;
      if (chunkStart > end) {
        controller.terminate();
        return;
      }

      const from = Math.max(0, start - chunkStart);
      const to = Math.min(chunk.byteLength, end - chunkStart + 1);
      controller.enqueue(from === 0 && to === chunk.byteLength ? chunk : chunk.subarray(from, to));

      if (offset > end) {
        controller.terminate();
      }
    },
  });
  return body.pipeThrough(transformer);
}

async function serveRangeAwareMedia(request, env, pathname) {
  const assetRes = await env.ASSETS.fetch(new Request(request.url, { method: "GET" }));
  if (assetRes.status === 404) {
    const headers = new Headers(assetRes.headers);
    headers.set("X-Robots-Tag", "noindex, nofollow");
    return new Response(assetRes.body, {
      status: 404,
      statusText: assetRes.statusText,
      headers,
    });
  }
  if (!assetRes.ok) return assetRes;

  const headers = new Headers(assetRes.headers);
  headers.set("Accept-Ranges", "bytes");
  headers.set("Vary", "Range");
  if (!headers.has("Cache-Control")) {
    headers.set(
      "Cache-Control",
      pathname.startsWith("/assets/")
        ? "public, max-age=31536000, immutable"
        : "public, max-age=604800",
    );
  }

  let totalSize = Number(headers.get("content-length") || 0);
  const bodyStream = assetRes.body;

  if (totalSize <= 0 && bodyStream) {
    const buf = await assetRes.arrayBuffer();
    totalSize = buf.byteLength;
    headers.set("Content-Length", String(totalSize));
    if (request.method === "HEAD") {
      return new Response(null, { status: 200, headers });
    }
    const rangeHeader = request.headers.get("range");
    if (!rangeHeader) {
      return new Response(buf, { status: 200, headers });
    }
    const parsed = parseByteRange(rangeHeader, totalSize);
    if (!parsed) {
      headers.set("Content-Range", `bytes */${totalSize}`);
      headers.set("Content-Length", "0");
      return new Response(null, { status: 416, headers });
    }
    headers.set("Content-Range", `bytes ${parsed.start}-${parsed.end}/${totalSize}`);
    headers.set("Content-Length", String(parsed.end - parsed.start + 1));
    return new Response(buf.slice(parsed.start, parsed.end + 1), {
      status: 206,
      headers,
    });
  }

  if (request.method === "HEAD") {
    await bodyStream?.cancel();
    return new Response(null, { status: 200, headers });
  }

  const rangeHeader = request.headers.get("range");
  if (!rangeHeader || !bodyStream) {
    return new Response(bodyStream, { status: 200, headers });
  }

  const parsed = parseByteRange(rangeHeader, totalSize);
  if (!parsed) {
    await bodyStream.cancel();
    headers.set("Content-Range", `bytes */${totalSize}`);
    headers.set("Content-Length", "0");
    return new Response(null, { status: 416, headers });
  }

  headers.set("Content-Range", `bytes ${parsed.start}-${parsed.end}/${totalSize}`);
  headers.set("Content-Length", String(parsed.end - parsed.start + 1));
  return new Response(sliceByteStream(bodyStream, parsed.start, parsed.end), {
    status: 206,
    headers,
  });
}

const ICON_LINK_HEADER =
  '</favicon-v2.ico>; rel="icon"; type="image/x-icon", </icon-48-v2.png>; rel="icon"; type="image/png"; sizes="48x48", </icon-192-v2.png>; rel="icon"; type="image/png"; sizes="192x192"';

const STATIC_EXT_REGEX =
  /\.(png|jpe?g|svg|xml|txt|json|js|css|ico|map|webp|woff2?)$/i;

function withSecurityHeaders(response, { contentType, noindex = false } = {}) {
  const headers = new Headers(response.headers);
  headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Permissions-Policy", "microphone=(self), camera=(), geolocation=()");
  if (contentType) {
    headers.set("Content-Type", contentType);
  }
  const effectiveType = headers.get("content-type") || "";
  if (effectiveType.includes("text/html")) {
    headers.set("Link", ICON_LINK_HEADER);
  }
  if (noindex || response.status === 404) {
    headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function isSpanishText(raw) {
  if (!raw) return false;
  if (/[¿¡áéíóúÁÉÍÓÚñÑ]/.test(raw)) return true;
  return /\b(hola|que|qué|como|cómo|para|pero|estoy|vamos|puedes|bueno|dime|algo|muy|bien|claro|trabajar|practicar|hoy|ingles|español)\b/i.test(
    raw,
  );
}

async function handleEdgeTts(request, env) {
  if (!env || !env.AI || typeof env.AI.run !== "function") {
    return new Response(JSON.stringify({ error: "Workers AI binding unavailable" }), {
      status: 503,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }
  const text = typeof body?.text === "string" ? body.text.trim().slice(0, 500) : "";
  if (!text) {
    return new Response(JSON.stringify({ error: "text is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }
  const useSpanish = body?.lang === "es" || isSpanishText(text);
  const model = useSpanish ? "@cf/deepgram/aura-2-es" : "@cf/deepgram/aura-2-en";
  const speaker = useSpanish ? "javier" : "orion";

  try {
    const aiResp = await env.AI.run(
      model,
      { text, speaker },
      { returnRawResponse: true },
    );
    if (!aiResp || !aiResp.ok) {
      return new Response(JSON.stringify({ error: "Edge TTS upstream unavailable" }), {
        status: 503,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      });
    }
    const headers = new Headers(aiResp.headers);
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "audio/mpeg");
    }
    headers.set("Cache-Control", "no-store");
    return new Response(aiResp.body, { status: 200, headers });
  } catch {
    return new Response(JSON.stringify({ error: "Edge TTS execution failed" }), {
      status: 503,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }
}

const worker = {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/edge-tts" && request.method === "POST") {
      return withSecurityHeaders(await handleEdgeTts(request, env));
    }

    if (url.hostname === "lingua.celaest.com" && url.protocol === "http:") {
      url.protocol = "https:";
      return new Response(null, {
        status: 301,
        headers: {
          Location: url.toString(),
          Link: ICON_LINK_HEADER,
        },
      });
    }

    if (
      url.pathname === "/$" ||
      url.pathname === "/&" ||
      url.pathname === "/%24" ||
      url.pathname === "/%26"
    ) {
      return withSecurityHeaders(
        new Response("Not Found", { status: 404 }),
        { contentType: "text/plain; charset=utf-8", noindex: true },
      );
    }

    if (url.pathname === "/sitemap.xml") {
      const res = await env.ASSETS.fetch(request);
      return withSecurityHeaders(res, {
        contentType: "application/xml; charset=utf-8",
      });
    }

    if (url.pathname === "/robots.txt") {
      const res = await env.ASSETS.fetch(request);
      return withSecurityHeaders(res, {
        contentType: "text/plain; charset=utf-8",
      });
    }

    if (/\.(mp4|webm|m4v|mov|mp3|ogg|wav|m4a)$/i.test(url.pathname)) {
      return withSecurityHeaders(await serveRangeAwareMedia(request, env, url.pathname));
    }

    const assetResponse = await env.ASSETS.fetch(request);
    if (assetResponse.status === 404 && STATIC_EXT_REGEX.test(url.pathname)) {
      return withSecurityHeaders(
        new Response("Not Found", { status: 404 }),
        { contentType: "text/plain; charset=utf-8", noindex: true },
      );
    }

    return withSecurityHeaders(assetResponse);
  },
};

export default worker;
