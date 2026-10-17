/// <reference types="node" />
// The frame every og:image shares (docs/design.md#ogimage), laid out with satori and rasterized
// with sharp at build time.
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import satori, { type Font } from "satori";
import sharp from "sharp";
import { colors, fonts, logoSvg } from "../brand.ts";
import { signatureName } from "../labels.ts";

/** CSS declarations in satori's camelCase form, numbers in px. */
export type Style = Record<string, string | number>;

/** An element satori draws: the subset of HTML these images use. */
export interface Element {
  type: "div" | "span" | "img";
  /** As in React: satori passes it to `onNodeDetected`. */
  key?: string;
  props: { style?: Style; children?: Child[]; src?: string; width?: number; height?: number };
}

export type Child = Element | string;

/** A `div` or `span` with these styles and children. */
export const el = (type: "div" | "span", style: Style, ...children: Child[]): Element => ({
  type,
  props: { style, children },
});

const svgImage = (svg: string, width: number, height: number, style: Style = {}): Element => ({
  type: "img",
  props: {
    src: `data:image/svg+xml,${encodeURIComponent(svg)}`,
    width,
    height,
    style: { display: "block", flex: "none", ...style },
  },
});

/** A Sign or a Class stamp: its path on 24×24, in `ink`, at `size` px. */
export const shape = (path: string, size: number, style?: Style): Element =>
  svgImage(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="${colors.ink}" fill-rule="evenodd" d="${path}"/></svg>`,
    size,
    size,
    style,
  );

/** The image's size: Open Graph's 1200×630. */
export const ogSize = { width: 1200, height: 630 } as const;

/** The left column's width. The Project name shrinks to fit beside its Sign in it. */
export const columnWidth = 500;

const nodeRequire = createRequire(import.meta.url);

// Fontsource's woff files, unmodified, as the skill's typography.md sets for server-rendered images. Every weight the
// images set: Sans 400 and 500, Mono 400.
const fontFiles = [
  { stack: fonts.sans, weight: 400, file: "@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-400-normal.woff" },
  { stack: fonts.sans, weight: 500, file: "@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-500-normal.woff" },
  { stack: fonts.mono, weight: 400, file: "@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff" },
] as const;

/** A stack's first family, unquoted: the name satori matches `fontFamily` against (`IBM Plex Sans`). */
const familyName = (stack: string): string => (stack.split(",")[0] ?? stack).trim().replace(/^(["'])(.*)\1$/, "$2");

let loadedFonts: Promise<Font[]> | undefined;

const loadFonts = (): Promise<Font[]> => {
  loadedFonts ??= Promise.all(
    fontFiles.map(async ({ stack, weight, file }): Promise<Font> => {
      const data = await readFile(nodeRequire.resolve(file));
      return { name: familyName(stack), weight, style: "normal", data };
    }),
  );
  return loadedFonts;
};

/**
 * The line box a browser draws for `line-height: normal` in IBM Plex, at each size docs/design.md leaves at `normal`.
 * The browser rounds the ascent and the descent separately, so 20px gives 25, not 1.3em. satori's own `normal` is the
 * unrounded 1.3em, a pixel off at most of these sizes, so these texts take their line height from here and none is
 * left at satori's `normal`.
 */
export const normalLineHeight = {
  sans18: "23px",
  sans20: "25px",
  sans30: "39px",
  mono15: "19px",
  mono17: "22px",
  mono21: "28px",
  mono24: "32px",
} as const;

/** What every text inherits: Sans in `ink`. */
const textStyle: Style = { fontFamily: fonts.sans, color: colors.ink };

/** The width satori gives `text` on one line in this style, with the same fonts and shaping it draws with. */
async function lineWidth(text: string, style: Style): Promise<number> {
  let width: number | undefined;
  const line: Element = {
    type: "div",
    key: "line",
    props: { style: { ...style, flex: "none", whiteSpace: "nowrap" }, children: [text] },
  };
  await satori(el("div", { ...textStyle, display: "flex" }, line), {
    width: 100 * ogSize.width,
    fonts: await loadFonts(),
    onNodeDetected: (node) => {
      if (node.key === "line") width = node.width;
    },
  });
  if (width === undefined) throw new Error(`satori laid out no line for "${text}".`);
  return width;
}

/**
 * The largest whole font size, from `size` down, at which `text` fits `room` px on one line in `style`.
 * satori wraps or overflows without saying so, so each size is measured.
 */
export async function fitFontSize(text: string, style: Style, size: number, room: number): Promise<number> {
  for (let candidate = size; candidate > 1; candidate -= 1) {
    if ((await lineWidth(text, { ...style, fontSize: candidate })) <= room) return candidate;
  }
  throw new Error(`"${text}" fits ${room}px at no font size.`);
}

export interface FrameContent {
  /** The page's Address, at the foot of the left column. */
  address: string;
  /** The page's own content, in the middle of the left column. */
  middle: Element;
  /** The panel's own styles, such as its padding and font, and its rows from the top. */
  panel: { style: Style; rows: Child[] };
}

function frame({ address, middle, panel }: FrameContent): Element {
  const signature = el(
    "div",
    {
      display: "flex",
      alignItems: "center",
      gap: 16,
      fontSize: 30,
      lineHeight: normalLineHeight.sans30,
      fontWeight: 500,
      letterSpacing: "-0.02em",
    },
    svgImage(logoSvg({ width: 34, height: 40 }), 34, 40),
    signatureName,
  );
  const column = el(
    "div",
    { display: "flex", flexDirection: "column", justifyContent: "space-between", width: columnWidth, height: "100%" },
    signature,
    middle,
    el("div", { fontFamily: fonts.mono, fontSize: 24, lineHeight: normalLineHeight.mono24, color: colors.dim }, address),
  );
  const panelBox = el(
    "div",
    {
      position: "absolute",
      left: 640,
      top: 64,
      width: 620,
      height: 640,
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      background: colors.surface,
      border: `1px solid ${colors.rule}`,
      whiteSpace: "nowrap",
      ...panel.style,
    },
    ...panel.rows,
  );
  return el(
    "div",
    {
      ...textStyle,
      position: "relative",
      overflow: "hidden",
      display: "flex",
      width: ogSize.width,
      height: ogSize.height,
      boxSizing: "border-box",
      padding: "64px 72px",
      background: colors.ground,
    },
    column,
    panelBox,
  );
}

/** The og:image of a page: the frame around its content, as a PNG response. */
export async function ogImage(content: FrameContent): Promise<Response> {
  const svg = await satori(frame(content), { ...ogSize, fonts: await loadFonts() });
  const png = await sharp(new TextEncoder().encode(svg)).flatten({ background: colors.ground }).png().toBuffer();
  return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png" } });
}
