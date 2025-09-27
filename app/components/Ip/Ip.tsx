import { useState } from "react";
import { useNavigate } from "react-router";

export function IpSearch() {
  const [value, setValue] = useState("");
  const navigate = useNavigate();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const q = value.trim();
        navigate(q ? `/?q=${encodeURIComponent(q)}` : "/");
      }}
      className="search-form"
      aria-label="Search for any IP address or domain"
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search for any IP address or domain"
        className="search-input"
        name="query"
        autoComplete="off"
        aria-label="IP or domain"
      />
      <button
        type="submit"
        className="search-button"
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
    <div className="rounded-3xl bg-white shadow-xl p-6 md:p-8 hover:cursor-pointer ">
      <div className="ipinfo">
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
    <div className="ipinfo-cell">
      <p className="ipinfo-label">{label}</p>
      <p className="ipinfo-value">{value}</p>
    </div>
  );
}
