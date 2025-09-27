import type { Route } from "./+types/error";
import { Link, useSearchParams } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Error – IP Tracker" },
    { name: "robots", content: "noindex" },
  ];
}

export default function ErrorPage() {
  const [sp] = useSearchParams();
  const reason = sp.get("reason") ?? "An unexpected error occurred.";
  const code = sp.get("code") ?? "";

  return (
    <main className="page">
      <section className="hero">
        <div className="shell">
          <h1 className="hero-title">Something went wrong</h1>

          <div className="mx-auto mt-6 max-w-[560px] text-center text-white">
            <p className="text-lg font-medium">
              {code && <span className="block mb-1">Error code: {code}</span>}
              {reason}
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <Link
                to="/"
                className="rounded-2xl bg-white/95 text-gray-900 px-4 py-2 shadow hover:bg-white"
              >
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="map-section grid place-items-center">
        <p className="text-muted">No map available.</p>
      </section>
    </main>
  );
}
