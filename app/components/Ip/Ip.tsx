import { useState } from "react";

export function IpSearch({ onSubmit }: { onSubmit: (value: string) => void }) {
  const [value, setValue] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(value.trim());
      }}
      className="flex items-stretch w-full"
      aria-label="Search for any IP address or domain"
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search for any IP address or domain"
        className="
            flex-1 rounded-l-2xl px-5 py-4 text-[15px] leading-none
            outline-none shadow-lg bg-white/95
            focus:ring-2 focus:ring-black/20
            text-black
          "
        name="query"
        autoComplete="off"
        aria-label="IP or domain"
      />
      <button
        type="submit"
        className="
            px-5 rounded-r-2xl bg-black text-white
            hover:opacity-90 active:opacity-80 grid place-items-center shadow-lg
          "
        aria-label="Track"
        title="Track"
      >
        <svg
          width="10"
          height="14"
          viewBox="0 0 10 14"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M1 1l7 6-7 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </form>
  );
}

type Props = {
  ip: string;
  location: string;
  timezone: string;
  isp: string;
};

export function IpInfo({ ip, location, timezone, isp }: Props) {
  return (
    <div className="rounded-3xl bg-white shadow-xl p-6 md:p-8">
      <div
        className="
          grid grid-cols-1 md:grid-cols-4
          gap-6 md:gap-0
          md:divide-x md:divide-gray-200
        "
      >
        <InfoCell label="IP ADDRESS" value={ip} />
        <InfoCell label="LOCATION" value={location} />
        <InfoCell label="TIMEZONE" value={timezone} />
        <InfoCell label="ISP" value={isp} />
      </div>
    </div>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="md:px-6">
      <p className="text-[10px] tracking-[2px] text-gray-500 font-semibold mb-2">
        {label}
      </p>
      <p className="text-[22px] md:text-[26px] font-medium leading-snug whitespace-pre-line text-black">
        {value}
      </p>
    </div>
  );
}
