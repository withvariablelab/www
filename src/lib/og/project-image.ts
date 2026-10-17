// A Project's og:image (docs/design.md#project-1): its Sign, name and Tagline in the middle, and in the panel its
// Install command, its ogSnippet's name and that Snippet's code, colored with the syntax palette. The texts the canvas
// sets at line-height `normal` get the line box Chrome draws for it, as px (see `normalLineHeight` in frame.ts).
import { colors, fonts, shapePath, syntaxColors } from "../brand.ts";
import { type CodeLine, commandTokens, prompt, snippetLines, type Token } from "../code.ts";
import type { Project } from "../content.ts";
import { type Child, columnWidth, el, fitFontSize, normalLineHeight, ogImage, shape } from "./frame.ts";

const rule = `1px solid ${colors.rule}`;

const sign = { size: 72, shift: 6, gap: 24 };
const nameStyle = { fontWeight: 500, letterSpacing: "-0.04em", lineHeight: 1 };
/**
 * The name's largest size. Every name is set at the largest whole size up to it that fits `nameRoom` on one line
 * (`fitFontSize`), so a long name's size comes from fitting the column: no name has a size of its own.
 */
const nameSize = 84;
/** The room beside the Sign: the column less the Sign, which is shifted left, and the gap. */
const nameRoom = columnWidth - (sign.size - sign.shift) - sign.gap;
const codeLineHeight = 34;

/**
 * The Sign row: the Sign and the name, each centered on the taller one as the canvas draws them. Where their heights
 * differ by an odd number (theme-toggle's 71px name beside the 72px Sign), centering puts the shorter one on a half
 * pixel: the canvas draws it on the pixel above, and satori's layout would round it to the one below. So each is set
 * at the top with a whole-pixel inset, rounded down as the canvas draws it.
 */
function signRow(signPath: string, name: string, nameFontSize: number): Child {
  const height = Math.max(sign.size, nameFontSize);
  const inset = (size: number) => Math.floor((height - size) / 2);
  return el(
    "div",
    { display: "flex", alignItems: "flex-start", gap: sign.gap },
    shape(signPath, sign.size, { marginLeft: -sign.shift, marginTop: inset(sign.size) }),
    el("div", { ...nameStyle, fontSize: nameFontSize, marginTop: inset(nameFontSize), whiteSpace: "nowrap" }, name),
  );
}

const tokens = (line: Token[]): Child[] => line.map(({ text, role }) => el("span", { color: syntaxColors[role] }, text));

const gutter = (text: string): Child => el("span", { color: syntaxColors.gutter }, text);

const promptText = `${prompt} `;

function codeLine(line: CodeLine): Child {
  switch (line.kind) {
    case "code":
      return el(
        "div",
        { display: "flex" },
        el(
          "span",
          { flex: "none", width: 30, marginRight: 24, textAlign: "right", color: syntaxColors.gutter },
          String(line.number),
        ),
        el("span", {}, ...tokens(line.tokens)),
      );
    case "comment":
      return el("div", {}, ...tokens(line.tokens));
    case "command":
      return el("div", {}, gutter(promptText), ...tokens(line.tokens));
    case "blank":
      return el("div", { height: codeLineHeight });
  }
}

export async function projectImage(project: Project): Promise<Response> {
  const { ogSnippet } = project.example;
  const [nameFontSize, lines] = await Promise.all([
    fitFontSize(project.name, nameStyle, nameSize, nameRoom),
    snippetLines(ogSnippet),
  ]);
  return ogImage({
    address: project.address,
    middle: el(
      "div",
      { display: "flex", flexDirection: "column" },
      signRow(shapePath(project), project.name, nameFontSize),
      el(
        "div",
        { marginTop: 28, maxWidth: "20ch", fontSize: 34, letterSpacing: "-0.02em", lineHeight: 1.22, textWrap: "balance" },
        project.tagline,
      ),
    ),
    panel: {
      style: { fontFamily: fonts.mono, whiteSpace: "pre" },
      rows: [
        el(
          "div",
          { padding: "24px 28px", borderBottom: rule, fontSize: 21, lineHeight: normalLineHeight.mono21 },
          gutter(promptText),
          ...tokens(commandTokens(project.installCommand)),
        ),
        el(
          "div",
          {
            padding: "16px 28px",
            borderBottom: rule,
            fontSize: 17,
            lineHeight: normalLineHeight.mono17,
            color: syntaxColors.keyword,
          },
          ogSnippet.name,
        ),
        el(
          "div",
          {
            display: "flex",
            flexDirection: "column",
            padding: ogSnippet.kind === "file" ? "22px 0" : "22px 28px",
            fontSize: 20,
            lineHeight: `${codeLineHeight}px`,
            color: syntaxColors.text,
          },
          ...lines.map(codeLine),
        ),
      ],
    },
  });
}
