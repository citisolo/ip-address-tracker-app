import { useEffect, useState } from "react";
import { IpSearch, IpInfo } from "../components/Ip/Ip";
import { type GeoData } from "../lib/ipClient";
import { MapView } from "../components/Map/Map";
import "leaflet/dist/leaflet.css";

type View = {
  loading: boolean;
  error?: string;
  data?: GeoData;
};

export function Main({
  initial,
}: {
  initial?: { data: GeoData; q?: string; message: string };
}) {
  const [view, setView] = useState<View>(
    initial?.data ? { loading: false, data: initial.data } : { loading: true }
  );

  useEffect(() => {
    if (initial?.data) setView({ loading: false, data: initial.data });
  }, [initial?.data]);

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
    <main className="page">
      {/* Hero */}
      <section className="hero">
        <div className="shell p-0">
          <h1 className="hero-title">IP Address Tracker</h1>
          <div className="relative z-30 mt-6 w-full max-w-[560px] mx-auto">
            <IpSearch />
            {view.error ? (
              <p className="mt-2 text-center text-sm text-red-100/90">
                {view.error}
              </p>
            ) : null}
          </div>
        </div>

        {/* Floating info card */}
        <div className="overlay-wrap">
          {/* <div className="w-full max-w-[1100px] px-4 pointer-events-auto"> */}
          <div className="shell">
            <IpInfo ip={ip} location={location} timezone={timezone} isp={isp} />
          </div>
        </div>
      </section>

      {/* MapView */}
      <section className="map-section">
        <MapView lat={coords?.lat} lng={coords?.lng} label={label} />
      </section>
    </main>
  );
}
