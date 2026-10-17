// /og.png: the Index's og:image, generated from the content at build time.
import type { APIRoute } from "astro";
import { getIndex } from "../lib/content.ts";
import { indexImage } from "../lib/og/index-image.ts";

export const GET: APIRoute = async () => indexImage(await getIndex());
