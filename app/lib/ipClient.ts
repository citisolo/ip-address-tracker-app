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

const IPIFY_KEY = import.meta.env.VITE_IPIFY_KEY;

const isIPv4 = (s: string) =>
  /^(25[0-5]|2[0-4]\d|[01]?\d?\d)(\.(25[0-5]|2[0-4]\d|[01]?\d?\d)){3}$/.test(
    s.trim()
  );
const isIPv6 = (s: string) =>
  /^(([0-9a-f]{1,4}:){7}[0-9a-f]{1,4}|::1)$/i.test(s.trim());
const isIp = (s: string) => isIPv4(s) || isIPv6(s);

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
    const isIp = /^\d{1,3}(\.\d{1,3}){3}$/.test(q) || q.includes(":");
    url.searchParams.set(isIp ? "ipAddress" : "domain", q);
  }

  const res = await fetch(url.toString());

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
      timezone: j.location.timezone?.startsWith("UTC")
        ? j.location.timezone
        : `UTC ${j.location.timezone}`,
    },
  };
}
