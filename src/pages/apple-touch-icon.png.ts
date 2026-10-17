// /apple-touch-icon.png: 180×180, the Logo centered on ground with air around it,
// 135px tall (three quarters of the square) at its own proportions, rendered with sharp at build time.
import type { APIRoute } from "astro";
import sharp from "sharp";
import { colors, logoSize, logoSvg } from "../lib/brand.ts";

const side = 180;
const height = (side * 3) / 4;
const width = (height * logoSize.width) / logoSize.height;

export const GET: APIRoute = async () => {
  const logo = logoSvg({ x: (side - width) / 2, y: (side - height) / 2, width, height });
  const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="${side}" height="${side}" viewBox="0 0 ${side} ${side}"><rect width="${side}" height="${side}" fill="${colors.ground}"/>${logo}</svg>`;
  const png = await sharp(new TextEncoder().encode(icon)).flatten({ background: colors.ground }).png().toBuffer();
  return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png" } });
};
