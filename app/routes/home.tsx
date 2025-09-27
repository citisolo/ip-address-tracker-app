import type { Route } from "./+types/home";
import { Main } from "../main/main";
import { lookup } from "../lib/ipClient";
import { redirect } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "IP tracker app" },
    { name: "description", content: "Welcome to the IP Tracker app" },
  ];
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const message =
    import.meta.env.VITE_APP_MESSAGE ?? "Ready to track an IP or domain";

  const url = new URL(request.url);
  const q = url.searchParams.get("q") || undefined;

  try {
    const data = await lookup(q);
    return { data, q, message };
  } catch (e: any) {
    const reason = e?.message ?? "Lookup failed";

    // Detect bad key or API errors
    if (
      /missing/i.test(reason) ||
      /unauthorized/i.test(reason) ||
      /429/.test(reason)
    ) {
      throw redirect(
        `/error?${new URLSearchParams({
          reason,
          code: e?.code ?? "",
        })}`
      );
    }

    throw redirect(
      `/not-found?${new URLSearchParams({
        ...(q ? { q } : {}),
        reason,
      }).toString()}`
    );
  }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <Main initial={loaderData} />;
}
