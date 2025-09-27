import type { Route } from "./+types/not-found";
import { Link, useSearchParams } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [{ title: "IP not found" }, { name: "robots", content: "noindex" }];
}

export default function NotFound() {
  const [sp] = useSearchParams();
  const q = sp.get("q") ?? "";
  const reason =
    sp.get("reason") ?? "We couldn't find the location data for that input.";

  return (
    <main className="page">
      <section className="hero">
        <div className="shell">
          <h1 className="hero-title">No results</h1>

          <div className="mx-auto mt-6 max-w-[560px] text-center">
            <p className="text-white/90">
              {q ? (
                <>
                  We couldn’t find data for <strong>{q}</strong>.
                </>
              ) : (
                "We couldn’t find data."
              )}
            </p>
            <p className="mt-2 text-white/80 text-sm">{reason}</p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <Link
                to={q ? `/?q=${encodeURIComponent(q)}` : "/"}
                className="rounded-2xl bg-white/95 text-gray-900 px-4 py-2 shadow hover:bg-white"
              >
                Try again
              </Link>
              <Link
                to="/"
                className="rounded-2xl bg-black text-white px-4 py-2 shadow hover:opacity-90"
              >
                Start over
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="map-section grid place-items-center">
        <p className="text-muted">No map to display.</p>
      </section>
    </main>
  );
}
