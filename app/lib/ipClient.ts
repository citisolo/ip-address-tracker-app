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

export async function lookup(query: string): Promise<GeoData> {
  if (!IPIFY_KEY) {
    throw new Error(
      "Missing VITE_IPIFY_KEY. Add it to your env to enable lookups."
    );
  }

  const url = new URL("https://geo.ipify.org/api/v2/country,city");
  url.searchParams.set("apiKey", IPIFY_KEY);

  if (isIp(query)) url.searchParams.set("ipAddress", query.trim());
  else url.searchParams.set("domain", query.trim());

  const res = await fetch(url.toString());
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Lookup failed: ${res.status} ${text}`);
  }
  const j = await res.json();

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
      // ipify returns "-05:00" → normalize to "UTC -05:00"
      timezone: j.location.timezone?.startsWith("UTC")
        ? j.location.timezone
        : `UTC ${j.location.timezone}`,
    },
  };
}
