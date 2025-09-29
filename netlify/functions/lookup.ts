import type { Handler, HandlerEvent } from "@netlify/functions";

const IPIFY_KEY = process.env.IPIFY_KEY!;
const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:8888",
  "https://citisolo-ip-address-tracker.netlify.app",
];

const cors = (origin = "") => {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : "";
  return {
    "Access-Control-Allow-Origin": allowed || "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-CSRF",
    Vary: "Origin",
  } as Record<string, string>;
};

const json = (
  statusCode: number,
  body: unknown,
  extraHeaders: Record<string, string> = {}
) => ({
  statusCode,
  headers: { "content-type": "application/json", ...extraHeaders },
  body: JSON.stringify(body),
});

export const handler: Handler = async (event: HandlerEvent) => {
  const origin = event.headers.origin || "";

  // Preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: cors(origin), body: "" };
  }

  try {
    if (!IPIFY_KEY) {
      return json(500, { error: "Server missing IPIFY_KEY" }, cors(origin));
    }

    const q = (event.queryStringParameters?.q || "").trim();

    const url = new URL("https://geo.ipify.org/api/v2/country,city");
    url.searchParams.set("apiKey", IPIFY_KEY);

    if (q) {
      const isIp = q.includes(":") || /^\d{1,3}(\.\d{1,3}){3}$/.test(q);
      url.searchParams.set(isIp ? "ipAddress" : "domain", q);
    }

    const upstream = await fetch(url.toString(), {
      headers: { "User-Agent": "ip-tracker-app" },
    });

    const text = await upstream.text();
    const headers = cors(origin);

    // Pass through status; set cache modestly on success
    if (upstream.ok) {
      return {
        statusCode: upstream.status,
        headers: {
          ...headers,
          "content-type":
            upstream.headers.get("content-type") ?? "application/json",
          "cache-control": "public, max-age=60",
        },
        body: text,
      };
    }

    // Normalize error body
    return json(
      upstream.status,
      { error: "Upstream error", detail: text },
      headers
    );
  } catch (err: any) {
    return json(
      502,
      { error: "Upstream fetch failed", detail: err?.message ?? String(err) },
      cors(origin)
    );
  }
};
