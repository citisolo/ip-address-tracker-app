import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons for Vite bundling
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

//Workaround for Leaflet URL resolver issue
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
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
    <div className="h-[520px] w-full">
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
        <Marker position={center}>
          {label ? <Popup>{label}</Popup> : null}
        </Marker>
      </MapContainer>
    </div>
  );
}

// Smoothly move map when props change
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
