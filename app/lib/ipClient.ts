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

const IPIFY_KEY: string | undefined = import.meta.env.VITE_IPIFY_KEY;

export async function getSelfIp(): Promise<string> {
  const res = await fetch("https://api.ipify.org?format=json");
  if (!res.ok) throw new Error("Could not determine client IP");
  const { ip } = (await res.json()) as { ip: string };
  return ip;
}

export async function lookup(query?: string): Promise<GeoData> {
  if (!IPIFY_KEY) {
    throw new Error(
      "Missing VITE_IPIFY_KEY. Add it to your env to enable lookups."
    );
  }

  const url = new URL("https://geo.ipify.org/api/v2/country,city");
  url.searchParams.set("apiKey", IPIFY_KEY);

  const q = query?.trim();
  if (q) {
    // treat IPv6 or IPv4 as IP, otherwise domain
    const isIp = /^\d{1,3}(\.\d{1,3}){3}$/.test(q) || q.includes(":");
    url.searchParams.set(isIp ? "ipAddress" : "domain", q);
  }
  // no q => let IPify default to client IP

  const res = await fetch(url.toString());

  // Try to parse JSON either way so we can surface IPify's {code, messages/message}
  const raw = await res.text();
  let j: any;
  try {
    j = raw ? JSON.parse(raw) : {};
  } catch {
    if (!res.ok) throw new Error(`Lookup failed: ${res.status} ${raw}`);
    throw new Error("Unexpected response from IPify.");
  }

  if (!res.ok || j?.code) {
    const msg = j?.messages ?? j?.message ?? `HTTP ${res.status}`;
    throw new Error(typeof msg === "string" ? msg : "Lookup failed");
  }

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
      // ipify returns like "-05:00" → normalize to "UTC -05:00"
      timezone: j.location.timezone?.startsWith("UTC")
        ? j.location.timezone
        : `UTC ${j.location.timezone}`,
    },
  };
}
