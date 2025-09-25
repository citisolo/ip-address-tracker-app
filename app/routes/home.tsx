import type { Route } from "./+types/home";
import { Main } from "../main/main";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "IP tracker app" },
    { name: "description", content: "Welcome to the IP Tracker app" },
  ];
}

export async function clientLoader({}: Route.ClientLoaderArgs) {
  const message =
    import.meta.env.VITE_APP_MESSAGE ?? "Ready to track an IP or domain";
  return { message };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <Main message={loaderData.message} />;
}
