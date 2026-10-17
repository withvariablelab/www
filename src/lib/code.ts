// Code coloring for the Project page and the og:images: a Command or a Snippet becomes lines of tokens,
// each with a role of the syntax palette (the skill's color.md). Pages give a role its class (`syntaxClass`);
// images map it to a hex value with `syntaxColors` from ./brand.ts. Build time only: no client JS.
import { type BundledLanguage, bundledThemes, createHighlighter, type Highlighter, type ThemeRegistration } from "shiki";
import { colors, type SyntaxRole, syntaxColors, vesperRoles } from "./brand.ts";
import type { FileSnippet, Snippet, TerminalSnippet } from "./content.ts";

export type { SyntaxRole } from "./brand.ts";

export interface Token {
  text: string;
  role: SyntaxRole;
}

/** One line of a Snippet, as both the page and the og:image draw it. */
export type CodeLine =
  /** A File snippet's line; `number` counts from 1. An empty line has no tokens. */
  | { kind: "code"; number: number; tokens: Token[] }
  /** A Terminal snippet's comment, with its leading "# ", in the `comment` role. */
  | { kind: "comment"; tokens: Token[] }
  /** A Terminal snippet's Command, by the shell rule. The `prompt` goes before it, outside the tokens. */
  | { kind: "command"; tokens: Token[] }
  /** The blank line between a Terminal snippet's groups. */
  | { kind: "blank" };

/** The prompt before each Command of a Terminal snippet: in the `gutter` role, aria-hidden and not selectable on a page. */
export const prompt = "$";

const commentPrefix = "# ";

/** The class of site.css that colors a role: `syntax-keyword`, `syntax-string`… */
export const syntaxClass = (role: SyntaxRole): string => `syntax-${role}`;

/**
 * A Command by the shell rule of color.md: the first token is `function`, a token starting with "-" is `text`
 * (a flag), every other token is `string`. Whitespace is kept as is, as its own `text` tokens, so each word
 * stays one token.
 */
export function commandTokens(command: string): Token[] {
  let words = 0;
  return command
    .split(/(\s+)/)
    .filter((text) => text !== "")
    .map((text): Token => {
      if (/^\s+$/.test(text)) return { text, role: "text" };
      words += 1;
      if (words === 1) return { text, role: "function" };
      return { text, role: text.startsWith("-") ? "text" : "string" };
    });
}

/** The grammar of each File snippet extension. */
const grammars: Record<string, BundledLanguage> = { ".ts": "typescript", ".tsx": "tsx", ".html": "html" };

function grammar(file: string): BundledLanguage {
  const extension = /\.[^.]+$/.exec(file)?.[0] ?? "";
  const language = grammars[extension];
  if (language === undefined) {
    throw new Error(
      `${file}: src/lib/code.ts has no grammar for "${extension || file}" files; it colors ${Object.keys(grammars).join(", ")}. Add the extension to its grammars.`,
    );
  }
  return language;
}

/**
 * The theme, as the skill's color.md sets it: Vesper's scope rules, each Vesper color swapped for the role that has
 * it in tokens.json. Any other Vesper color, its third accent included, is `text`.
 */
async function loadTheme(): Promise<ThemeRegistration> {
  const vesper = (await bundledThemes.vesper()).default;
  const rules = (vesper.tokenColors ?? []).flatMap(({ scope, settings }) =>
    settings?.foreground === undefined
      ? []
      : [{ scope, settings: { foreground: syntaxColors[vesperRoles.get(settings.foreground.toLowerCase()) ?? "text"] } }],
  );
  return {
    name: "vlab-syntax",
    type: "dark",
    fg: syntaxColors.text,
    bg: colors.surface,
    settings: [{ settings: { foreground: syntaxColors.text } }, ...rules],
  };
}

// The six syntax colors are distinct, so a color names its role.
const roleOf = new Map(Object.entries(syntaxColors).map(([role, color]) => [color.toLowerCase(), role as SyntaxRole]));

// Created on the first File snippet, then shared.
let highlighter: Promise<{ highlighter: Highlighter; theme: ThemeRegistration }> | undefined;

/** A File snippet's code, one entry per line, each line's tokens with neighbors of the same role merged. */
export async function fileLines(snippet: Pick<FileSnippet, "file" | "code">): Promise<Token[][]> {
  const lang = grammar(snippet.file);
  highlighter ??= loadTheme().then(async (theme) => ({
    highlighter: await createHighlighter({ themes: [theme], langs: Object.values(grammars) }),
    theme,
  }));
  const { highlighter: shiki, theme } = await highlighter;
  const lines = shiki.codeToTokensBase(snippet.code, { lang, theme });
  return lines.map((line) =>
    line.reduce<Token[]>((tokens, { content, color }) => {
      const role = roleOf.get(color?.toLowerCase() ?? "");
      if (role === undefined) {
        throw new Error(`${snippet.file}: "${content}" got the color ${color}, which is no syntax role.`);
      }
      const last = tokens.at(-1);
      if (last?.role === role) last.text += content;
      else tokens.push({ text: content, role });
      return tokens;
    }, []),
  );
}

/** A Terminal snippet's lines: each group's comment, then its Commands, with a blank line between groups. */
export function terminalLines(snippet: Pick<TerminalSnippet, "groups">): CodeLine[] {
  return snippet.groups.flatMap(({ comment, commands }, group): CodeLine[] => [
    ...(group > 0 ? [{ kind: "blank" } as const] : []),
    { kind: "comment", tokens: [{ text: `${commentPrefix}${comment}`, role: "comment" }] },
    ...commands.map((command): CodeLine => ({ kind: "command", tokens: commandTokens(command) })),
  ]);
}

/** Any Snippet's lines: a File snippet's numbered lines, or a Terminal snippet's comments, Commands and blanks. */
export async function snippetLines(snippet: Snippet): Promise<CodeLine[]> {
  if (snippet.kind === "terminal") return terminalLines(snippet);
  const lines = await fileLines(snippet);
  return lines.map((tokens, index) => ({ kind: "code", number: index + 1, tokens }));
}
