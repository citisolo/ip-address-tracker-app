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

// const IPIFY_KEY = import.meta.env.VITE_IPIFY_KEY;

// const isIPv4 = (s: string) =>
//   /^(25[0-5]|2[0-4]\d|[01]?\d?\d)(\.(25[0-5]|2[0-4]\d|[01]?\d?\d)){3}$/.test(
//     s.trim()
//   );
// const isIPv6 = (s: string) =>
//   /^(([0-9a-f]{1,4}:){7}[0-9a-f]{1,4}|::1)$/i.test(s.trim());
// const isIp = (s: string) => isIPv4(s) || isIPv6(s);

export async function getSelfIp(): Promise<string> {
  const res = await fetch("https://api.ipify.org?format=json");
  if (!res.ok) throw new Error("Could not determine client IP");
  const { ip } = (await res.json()) as { ip: string };
  return ip;
}

export async function lookup(query?: string): Promise<GeoData> {
  const url = new URL("/.netlify/functions/lookup", window.location.origin);
  if (query?.trim()) url.searchParams.set("q", query.trim());

  const res = await fetch(url.toString(), {
    headers: { "X-CSRF": "dev-demo" },
  });
  const j = await res.json();

  if (!res.ok || (j && j.error)) {
    throw new Error(j?.detail || j?.error || `HTTP ${res.status}`);
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
