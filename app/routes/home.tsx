import type { Route } from "./+types/home";
import { Main } from "../main/main";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "IP tracker app" },
    { name: "description", content: "Welcome to the IP Tracker app" },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  return { message: context.VALUE_FROM_NETLIFY };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <Main message={loaderData.message} />;
}
