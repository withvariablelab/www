// The Index's og:image (docs/design.md#index-1): the intro in the middle, and a crop of the Index in the panel,
// its Projects grouped by Class as on the page.
import { colors, fonts, shapePath, stampPaths } from "../brand.ts";
import type { ClassGroup, Index, Project } from "../content.ts";
import { classHeadings } from "../labels.ts";
import { type Child, el, normalLineHeight, ogImage, shape } from "./frame.ts";

const rule = `1px solid ${colors.rule}`;

const name = { fontSize: 30, fontWeight: 500, letterSpacing: "-0.025em", lineHeight: 1.15 };

/** "Published as" with the Executable in `ink` and the rest in `dim`. */
function publishedAs({ publishedAs: { executable, text } }: Project): Child[] {
  return executable === undefined ? [text] : [el("span", { color: colors.ink }, executable), text.slice(executable.length)];
}

const row = (project: Project): Child =>
  el(
    "div",
    { display: "grid", gridTemplateColumns: "34px minmax(0, 1fr)", columnGap: 22, padding: "22px 0", borderTop: rule },
    shape(shapePath(project), 34),
    el(
      "div",
      { display: "flex", flexDirection: "column" },
      // The name's line box is 34.5px. satori rounds a text's box up to a whole pixel, which would drop each row half a
      // pixel below the last; a plain box of that height rounds to the nearest pixel.
      el("div", { display: "flex", height: name.fontSize * name.lineHeight }, el("div", name, project.name)),
      el("div", { marginTop: 6, fontSize: 20, lineHeight: normalLineHeight.sans20 }, project.tagline),
      el(
        "div",
        { marginTop: 8, fontFamily: fonts.mono, fontSize: 15, lineHeight: normalLineHeight.mono15, color: colors.dim },
        ...publishedAs(project),
      ),
    ),
  );

const group = ({ class: projectClass, projects }: ClassGroup, position: number): Child[] => [
  el(
    "div",
    {
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginTop: position === 0 ? 0 : 26,
      paddingBottom: 16,
      fontSize: 18,
      lineHeight: normalLineHeight.sans18,
      fontWeight: 500,
      letterSpacing: "-0.011em",
    },
    shape(stampPaths[projectClass], 18),
    classHeadings[projectClass],
  ),
  ...projects.map(row),
];

export const indexImage = (index: Index): Promise<Response> =>
  ogImage({
    address: index.address,
    middle: el(
      "div",
      { fontSize: 64, fontWeight: 500, letterSpacing: "-0.035em", lineHeight: 1.08, textWrap: "pretty" },
      index.intro,
    ),
    panel: { style: { padding: "34px 40px" }, rows: index.byClass.flatMap(group) },
  });
