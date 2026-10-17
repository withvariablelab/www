// The brand, read from @variablelab/brand: its token values, the Logo and the Class stamps.
// Pages and the og:image endpoints both read it here, at build time; nothing in it is copied by hand.
import logoMarkup from "@variablelab/brand/assets/logo.svg?raw";
import appStamp from "@variablelab/brand/assets/stamps/app.svg?raw";
import libraryStamp from "@variablelab/brand/assets/stamps/library.svg?raw";
import tokens from "@variablelab/brand/tokens.json";
import type { Project, ProjectClass } from "./content.ts";

type Values<Group extends Record<string, { value: string }>> = { [Token in keyof Group]: string };

const values = <Group extends Record<string, { value: string }>>(group: Group): Values<Group> =>
  Object.fromEntries(Object.entries(group).map(([token, { value }]) => [token, value])) as Values<Group>;

export type ColorToken = keyof typeof tokens.color;
/** A role of the syntax palette in the skill's color.md. */
export type SyntaxRole = keyof typeof tokens.syntax;

/** The palette's hex values, such as `colors.ground`. Pages use the `--vlab-*` custom properties instead. */
export const colors: Record<ColorToken, string> = values(tokens.color);
/** Each syntax role's hex value. Pages use the role classes of site.css instead; images map roles through this. */
export const syntaxColors: Record<SyntaxRole, string> = values(tokens.syntax);
/** Each syntax role by its Vesper color (tokens.json's `vesper`, lowercased), for the code theme of src/lib/code.ts. */
export const vesperRoles: ReadonlyMap<string, SyntaxRole> = new Map(
  Object.entries(tokens.syntax).map(([role, { vesper }]) => [vesper.toLowerCase(), role as SyntaxRole]),
);
/** The font stacks: `sans` and `mono`. */
export const fonts: Record<keyof typeof tokens.font, string> = values(tokens.font);

/** The Logo, `assets/logo.svg`, exactly as the package publishes it: /favicon.svg serves it as is. */
export const logo: string = logoMarkup;

const logoViewBox = /^<svg\b[^>]*\bviewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(logo);
if (logoViewBox?.[1] === undefined || logoViewBox[2] === undefined) {
  throw new Error('@variablelab/brand/assets/logo.svg no longer starts with <svg viewBox="0 0 <width> <height>">.');
}
/** The Logo's own proportions, from its viewBox. Scale it to these, never stretch it. */
export const logoSize = { width: Number(logoViewBox[1]), height: Number(logoViewBox[2]) };

const escapeAttribute = (value: string): string =>
  value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");

/**
 * The Logo's markup with these attributes added to its `<svg>`, such as
 * `logoSvg({ width: 16, height: 18, "aria-hidden": "true" })`. The rest of the file is left as it is.
 */
export function logoSvg(attributes: Record<string, string | number>): string {
  const added = Object.entries(attributes)
    .map(([name, value]) => ` ${name}="${escapeAttribute(String(value))}"`)
    .join("");
  return logo.trim().replace(/^<svg\b/, `<svg${added}`);
}

function onlyPath(svg: string, file: string): string {
  const paths = [...svg.matchAll(/<path\b[^>]*\sd="([^"]+)"/g)];
  const d = paths[0]?.[1];
  if (paths.length !== 1 || d === undefined) {
    throw new Error(`@variablelab/brand/${file} holds one <path> on a 24×24 viewBox; it holds ${paths.length}.`);
  }
  return d;
}

/** Each Class stamp's path, from `assets/stamps/app.svg` and `library.svg`: the `d` of their one path on 24×24. */
export const stampPaths: Record<ProjectClass, string> = {
  App: onlyPath(appStamp, "assets/stamps/app.svg"),
  Library: onlyPath(libraryStamp, "assets/stamps/library.svg"),
};

/** The path a Project is drawn with on 24×24: its Sign, or its Class stamp when it has none. */
export const shapePath = (project: Pick<Project, "sign" | "class">): string => project.sign ?? stampPaths[project.class];
