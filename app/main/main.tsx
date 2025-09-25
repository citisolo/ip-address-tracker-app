import { useEffect, useState } from "react";
import { IpSearch, IpInfo } from "../components/Ip/Ip";
import { getSelfIp, lookup, type GeoData } from "../lib/ipClient";

type View = {
  loading: boolean;
  error?: string;
  data?: GeoData;
};

export function Main({ message }: { message: string }) {
  const [view, setView] = useState<View>({ loading: true });

  useEffect(() => {
    (async () => {
      try {
        const ip = await getSelfIp();
        const data = await lookup(ip);
        setView({ loading: false, data });
      } catch (e: any) {
        setView({ loading: false, error: e?.message ?? "Failed to load" });
      }
    })();
  }, []);

  async function handleSearch(q: string) {
    if (!q) return; // ignore empty submits
    setView((v) => ({ ...v, loading: true, error: undefined }));
    try {
      const data = await lookup(q);
      setView({ loading: false, data });
      // TODO: center map later with data.location.lat/lng
    } catch (e: any) {
      setView({ loading: false, error: e?.message ?? "Lookup failed" });
    }
  }

  const ip = view.data?.ip ?? "—";
  const location = view.data
    ? `${view.data.location.city}, ${view.data.location.region}\n${view.data.location.postalCode ?? ""}`
    : "—";
  const timezone = view.data?.location.timezone ?? "—";
  const isp = view.data?.isp ?? "—";

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Blue Hero */}
      <section
        className="relative bg-gradient-to-b from-indigo-600 to-indigo-500
                    pt-12 pb-44 md:pb-48 px-4"
      >
        <h1 className="text-white text-2xl md:text-3xl font-medium text-center">
          IP Address Tracker
        </h1>

        {/* Search */}
        <div className="relative z-30 mt-6 w-full max-w-[560px] mx-auto">
          <IpSearch onSubmit={handleSearch} />
          {view.error ? (
            <p className="mt-2 text-center text-sm text-red-100/90">
              {view.error}
            </p>
          ) : null}
        </div>

        {/* Info card overlay */}
        <div
          className="absolute inset-x-0 top-full -translate-y-1/2 z-20
                  flex justify-center pointer-events-none"
        >
          <div className="w-full max-w-[1100px] px-4 pointer-events-auto">
            <IpInfo ip={ip} location={location} timezone={timezone} isp={isp} />
          </div>
        </div>
      </section>

      {/* Map section */}
      <section className="relative">
        <div
          id="map"
          className="h-[520px] w-full bg-gray-200 dark:bg-gray-800 grid place-items-center"
        >
          <span className="text-gray-600 dark:text-gray-300">
            Map goes here
          </span>
        </div>
      </section>
    </main>
  );
}
