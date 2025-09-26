import type { Route } from "./+types/home";
import { Main } from "../main/main";
import { lookup } from "../lib/ipClient";

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
  const data = await lookup(q);
  return { data, q, message };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <Main initial={loaderData} />;
}
