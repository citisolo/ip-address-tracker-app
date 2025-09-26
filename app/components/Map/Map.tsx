import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const pinIcon = L.icon({
  iconUrl: "/images/icon-location.svg",
  iconSize: [46, 56],
  iconAnchor: [23, 56],
  popupAnchor: [0, -48],
  className: "drop-shadow-[0_6px_12px_rgba(0,0,0,0.25)]",
});

type Props = {
  lat?: number;
  lng?: number;
  label?: string;
  zoom?: number;
};

export function MapView({ lat, lng, label, zoom = 13 }: Props) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  const center = useMemo<[number, number] | null>(() => {
    if (typeof lat === "number" && typeof lng === "number") return [lat, lng];
    return null;
  }, [lat, lng]);

  if (!isClient || !center) {
    return (
      <div className="h-[520px] w-full bg-gray-200 dark:bg-gray-800 grid place-items-center">
        <span className="text-gray-600 dark:text-gray-300">
          {isClient ? "Waiting for location…" : "Loading map…"}
        </span>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <MapContainer
        center={center}
        zoom={zoom}
        className="h-full w-full"
        scrollWheelZoom
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Recenter center={center} zoom={zoom} />
        <Marker position={center} icon={pinIcon}>
          {label ? <Popup>{label}</Popup> : null}
        </Marker>
      </MapContainer>
    </div>
  );
}

function Recenter({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 0.6 });
  }, [map, center[0], center[1], zoom]);
  return null;
}
