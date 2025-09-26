import { useEffect, useState } from "react";
import { IpSearch, IpInfo } from "../components/Ip/Ip";
import { getSelfIp, lookup, type GeoData } from "../lib/ipClient";
import { MapView } from "../components/Map/Map";

import "leaflet/dist/leaflet.css";

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

  const coords = view.data?.location;
  const label = view.data
    ? `${view.data.location.city}, ${view.data.location.region}`
    : undefined;

  return (
    <main className="h-full min-h-[100svh] flex flex-col bg-gray-50 dark:bg-gray-900 overflow-x-hidden overflow-y-hidden">
      {/* Hero keeps natural height */}
      <section
        className="relative z-10 bg-gradient-to-b from-indigo-600 to-indigo-500 pt-12 pb-44 md:pb-48 px-4
                   bg-[url('/images/pattern-bg-mobile.png')] md:bg-[url('/images/pattern-bg-desktop.png')]
                   bg-cover bg-center bg-no-repeat"
      >
        <h1 className="text-white text-2xl md:text-3xl font-medium text-center">
          IP Address Tracker
        </h1>

        <div className="relative z-30 mt-6 w-full max-w-[560px] mx-auto">
          <IpSearch onSubmit={handleSearch} />
          {view.error ? (
            <p className="mt-2 text-center text-sm text-red-100/90">
              {view.error}
            </p>
          ) : null}
        </div>

        {/* Floating info card */}
        <div className="absolute inset-x-0 top-full -translate-y-1/2 z-30 flex justify-center pointer-events-none">
          <div className="w-full max-w-[1100px] px-4 pointer-events-auto">
            <IpInfo ip={ip} location={location} timezone={timezone} isp={isp} />
          </div>
        </div>
      </section>

      {/* Map fills the remaining viewport height */}
      <section className="relative z-0 flex-1 overflow-hidden">
        <MapView lat={coords?.lat} lng={coords?.lng} label={label} />
      </section>
    </main>
  );
}
