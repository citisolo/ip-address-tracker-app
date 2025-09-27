// app/lib/ipClient.ts
export type GeoData = {
  ip: string;
  isp: string;
  location: {
    lat: number;
    lng: number;
    city: string;
    region: string;
    country: string;
    postalCode?: string;
    timezone: string;
  };
};

const DEV = !!import.meta.env.DEV;
const DIRECT_KEY = import.meta.env.VITE_IPIFY_KEY as string | undefined;

/** Use direct IPify only in dev AND when a key is present; otherwise use the Netlify function */
function useDirectIpify(): boolean {
  return DEV && !!DIRECT_KEY;
}

export async function getSelfIp(): Promise<string> {
  const res = await fetch("https://api.ipify.org?format=json");
  if (!res.ok) throw new Error("Could not determine client IP");
  const { ip } = (await res.json()) as { ip: string };
  return ip;
}

export async function lookup(query?: string): Promise<GeoData> {
  const q = query?.trim();

  if (useDirectIpify()) {
    // DEV path: call IPify directly with VITE_IPIFY_KEY (browser-visible)
    const key = DIRECT_KEY!;
    const url = new URL("https://geo.ipify.org/api/v2/country,city");
    url.searchParams.set("apiKey", key);

    if (q) {
      const isIp =
        /^\d{1,3}(\.\d{1,3}){3}$/.test(q) || // IPv4
        q.includes(":"); // quick IPv6 presence
      url.searchParams.set(isIp ? "ipAddress" : "domain", q);
    }

    const res = await fetch(url.toString());
    const text = await res.text();
    if (!res.ok) throw new Error(`Lookup failed: ${res.status} ${text}`);

    const j = JSON.parse(text);
    return mapIpifyResponse(j);
  } else {
    // PROD (and dev without key): use Netlify function proxy (server-side key)
    const url = new URL("/.netlify/functions/lookup", window.location.origin);
    if (q) url.searchParams.set("q", q);

    const res = await fetch(url.toString(), {
      headers: { "X-CSRF": "dev-demo" }, // optional; keep/remove as you like
    });
    const j = await res.json();

    if (!res.ok || j?.error) {
      throw new Error(j?.detail || j?.error || `HTTP ${res.status}`);
    }
    return mapIpifyResponse(j);
  }
}

function mapIpifyResponse(j: any): GeoData {
  return {
    ip: j.ip,
    isp: j.isp,
    location: {
      lat: j.location.lat,
      lng: j.location.lng,
      city: j.location.city,
      region: j.location.region,
      country: j.location.country,
      postalCode: j.location.postalCode ?? "",
      timezone: j.location.timezone?.startsWith("UTC")
        ? j.location.timezone
        : `UTC ${j.location.timezone}`,
    },
  };
}
