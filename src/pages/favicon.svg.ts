// /favicon.svg: the Logo, assets/logo.svg of @variablelab/brand, as it is.
import type { APIRoute } from "astro";
import { logo } from "../lib/brand.ts";

export const GET: APIRoute = () => new Response(logo, { headers: { "Content-Type": "image/svg+xml" } });
