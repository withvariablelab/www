# Design

What to build for `lab.variable.land`: its pages, their head and `og:image`, the rules they render by, and every measurement. What each page says is in [content-model.md](content-model.md) and [content.md](content.md); terms are in [glossary.md](glossary.md). Brand rules (palette, type scale, voice, icons, how a Sign is drawn) come from the `vlab-brand` skill. Where this file and the skill differ on these pages, this file wins; on a brand rule, the skill does.

## Source of truth

The canvas in Claude Design is the visual source of truth: <https://claude.ai/artifact/378BdwFb3fCtP6oCrMPU4v>. It has each page at desktop (1280), tablet (834) and phone (390), and the `og:image` of each page.

| Artboards | Page |
| --- | --- |
| `Main`, `Main-tablet`, `Main-phone` | Index |
| `RunRun`, `Vland`, `Env`, and their `-tablet` and `-phone` | Project pages |
| `OG-Index`, `OG-RunRun`, `OG-Vland`, `OG-Env` | `og:image` |

The canvas also draws theme-toggle, which is not in the Index: the Keeper keeps only the most relevant Projects there, and theme-toggle isn't one of them. The site builds none of what the canvas draws for it: its `ThemeToggle` and `OG-ThemeToggle` artboards, its row on the Index and in `OG-Index`, and its place in each Also indexed.

Build by looking at the canvas, not from exported files. If the canvas and this file disagree, ask the Keeper.

To read it, an agent with access to claude.ai artifacts reads its files:

- `project/canvas.json` indexes the artboards.
- Each artboard is `project/<Name>.dc.html`, with its full HTML and CSS.

To look at an artboard, turn it into plain HTML:

1. Move the contents of `<helmet>` into `<head>`.
2. Move the contents of `<x-dc>` into `<body>`.
3. Replace each `{{value}}` with its default from the `data-props` of the `text/x-dc` script (`introSize` is 26).
4. On a Project page artboard, keep the contents of `<sc-if value="{{notCopied}}">`, drop `<sc-if value="{{copied}}">` and its contents (swap the two to see the Copied state), remove `onClick="{{onCopy}}"`, and replace `{{srStatus}}` with nothing.

Then open the converted HTML at the artboard's width, not the published canvas.

An agent without access builds from this file, which carries every measurement.

## Pages

| Path | What it is | Served by |
| --- | --- | --- |
| `/` | The Index. | www |
| `/<project>` | A Project page, for every Project in the Index, at that exact path. | www |
| `/og.png`, `/og/<project>.png` | The `og:image` of the Index and of each Project page. | www |
| `/favicon.svg`, `/apple-touch-icon.png` | The icons. | www |
| `/robots.txt` | Crawl rules. | www |
| Everything under `/<project>/`, such as `/env/docs/` and `/env/llms.txt` | Docs the Project publishes itself, with what they serve. | That Project's own Worker |

So none of www's own paths sit under `/<project>/`: when a Project publishes docs, that whole path is its Worker's. For a Project without docs, `/<project>/` reaches www, which redirects it to `/<project>`.

## Head

Every page:

```html
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="theme-color" content="#14120e">
<title>{title}</title>
<meta name="description" content="{description}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="canonical" href="https://lab.variable.land{path}">
<meta property="og:site_name" content="Variable Lab">
<meta property="og:type" content="website">
<meta property="og:url" content="https://lab.variable.land{path}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{description}">
<meta property="og:image" content="https://lab.variable.land{og-image}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="{og-alt}">
<meta name="twitter:card" content="summary_large_image">
```

- `{title}`, `{description}` and `{og-alt}` are the fields `title`, `description` and `ogAlt` of the Index or the Project ([content-model.md](content-model.md)).
- `{og-image}` is `/og.png` on the Index and `/og/<project>.png` on a Project page.
- The favicon is the Logo as it is (`assets/logo.svg` in `@variablelab/brand`).
- `apple-touch-icon.png` is 180×180: the Logo centered on `ground`, with air around it, 135px tall (three quarters of the square) at its own proportions, about 116×135.

## Rules

1. On the Index, a Project's name links to its Project page, and its "Published as" line links to its Repository. On the Project page, the Package links to npm and the Executable is plain text.
2. "Published as" shows the Project's `publishedAs` ([content-model.md](content-model.md#project)) in `dim`, with an App's Executable in `ink`. On a Project page, a Library's Package is in `ink` too.
3. Also indexed shows the Project's `alsoIndexed` ([content-model.md](content-model.md#project)). With the Index's three Projects that gives:

   | Page | Also indexed |
   | --- | --- |
   | run-run | vland, env |
   | vland | run-run, env |
   | env | run-run, vland |
4. The header shows the page's Address on the left, in mono, and the Signature on the right. On a Project page the Signature is one link to `/`; on the Index it isn't a link.
5. The Keeper's column is only on the Index: the name (not a link), the site (a link), the statement, and `GitHub` to the org.
6. The whole Install command box is the Copy button.
   - Its accessible name is `aria-label="Copy: {installCommand}"`, and the Copy icon sits on its right.
   - It copies the Command without the prompt.
   - On copy, the icon turns into Copied for 1.2 s and an `aria-live="polite"` region announces `Copied`.
7. The Index shows its `projects` in two sections, Apps first, then Libraries ([content-model.md](content-model.md#index)).
8. A Project page has one Install command, in its box with Copy. How the Project is used after that goes in the Example.
9. On a Project page, the facts column is an `aside` labeled `About {name}`, and Also indexed is an `aside` labeled `Also indexed`.
10. The page title is the only top-level heading: the intro on the Index, the name on a Project page. On the Index, the Class headings sit under it, and each Project's name sits under its Class heading.

## Frame

Shared by every page.

- **Page:** `ground` background, `ink` text, IBM Plex Sans at 16px / 1.45.
- **Container:** `max-width: 1040px`, centered. Two columns, `minmax(0, 1fr) 280px`, with `column-gap: 64px`. The header spans both.

  | Width | Layout | Padding |
  | --- | --- | --- |
  | ≥ 900px | two columns | `28px 48px 140px` |
  | 600–899px | one column | `24px 32px 120px` |
  | ≤ 599px | one column | `20px 16px 96px` |
- **Header:** the Address on one side and the Signature on the other (`space-between`), centered on the cross axis, `gap: 24px`. `padding-bottom: 18px`, then a 1px `rule` below.
  - Address: `meta`, `dim`.
  - Signature: the Logo at 16×18, 8px from `Variable Land` in `ui` at 500 with `-0.015em`, `ink`.
- **Links:**
  - At rest a link has no underline, except where an element below gives it one.
  - On hover the text turns `ink`, with a `dim` underline at a 4px offset.
  - An underlined link uses a 1px `rule-strong` underline.
- **Focus:** a 1px `dim` outline at a 3px offset.
- **Selection:** `rule-strong` background, `ink` text.
- **Text flow:** as in the skill's `typography.md`. Each element's row below says whether it uses `balance` or `pretty`.
- **Type in the tables below:** a name (`title`, `body`, `meta`…) is a step of the skill's type scale in `typography.md`, with its size, line height, weight and tracking. A raw value marks where these pages leave the scale on purpose, as the canvas does.

## Index

The Index is read, not browsed: a list under the house's own sentence, not a grid of cards or a person with a logo. The house speaks first, and the Keeper shares the first screen, in the margin.

- **Desktop:** the intro and the sections in the left column. The Keeper's column is on the right, `position: sticky` at `top: 28px`, with `padding-top: 36px`.
- **One column:** header, intro, the Keeper, Apps, Libraries.
  - The Keeper is static, `margin-top: 24px`, `padding: 16px 0`, with a 1px `rule` above and below.
  - It fits on the first screen.

| Element | Type | Color | Size and space |
| --- | --- | --- | --- |
| Intro block | | | `padding: 36px 0 12px` |
| intro | `title`, balance | `ink` | `max-width: 24ch` on desktop, none in one column |
| Unpublished line | 16px / 1.45, pretty | `dim` | `margin-top: 10px`; `max-width: 42ch` on desktop, none in one column |
| Keeper name | 15px, 500, `-0.015em` | `ink` | |
| Keeper site | `small`, underlined link at a 3px offset | `dim`; underline `dim` on hover | `margin-top: 6px` |
| Keeper statement | `small`, pretty | `ink` | `margin-top: 14px`, `max-width: 52ch` |
| Keeper GitHub | `small`, underlined link at a 3px offset | `dim` | `margin-top: 16px` |
| Class heading (`Apps`, `Libraries`) | `ui` at 500, with `-0.011em` | `ink` | Its Class stamp beside the text, as the skill's `iconography.md` sets shapes beside text; `margin-top: 28px`, `padding-bottom: 14px` |
| Project row | | | Grid `28px minmax(0, 1fr)`, `column-gap: 20px`, `padding: 26px 0`, a 1px `rule` above |
| Sign | | `ink` | 28px; the Class stamp when the Project has no Sign |
| Project name | `heading`; underlined link at a 5px offset | `ink`; underline `ink` on hover | |
| Tagline | 16px / 1.45, pretty | `ink` | `margin-top: 6px`, `max-width: 42ch` |
| Published as | `meta`; underlined link at a 3px offset | `dim`, the Executable `ink` | `margin-top: 8px` |

## Project page

- **Desktop:**
  - The main column holds the lead (the Sign and the name, the Tagline, the Body), then the Example and the Closing line, then Also indexed.
  - The side column holds the facts: Install, Requires or Runs on, Published as, Links. It is `position: sticky` at `top: 28px`, with `padding-top: 36px`, beside the lead and the Example.
- **One column:**
  1. The lead.
  2. The facts, as a grid: 3 columns at 600–899px and 2 at ≤ 599px, `gap: 22px 24px`. The side column gets `margin-top: 28px` and no top padding.
  3. The Install command, which moves after the other facts and spans the full width.
  4. The Example, 12px below the Install command. Both share the same left edge.
  5. The Closing line and Also indexed.
- **Focus order in one column:** focus moves through the facts as they are drawn, row by row (`reading-flow: grid-rows`), so the Install command comes last. Where `reading-flow` isn't supported, the DOM order stands: Install first.
- **Install command width:** half the width at 600–899px, growing past half only as far as its Command needs to fit one line, and the full width at ≤ 599px. Every Command on the site fits in half.
- **Published as:** at ≤ 599px it spans both columns for an App, always, and for a Library whose Package is wider than one column at the phone width, 390px. On the site that happens for the two Apps: env's Package fits one column.
- **Package:** whole wherever it fits; an App's line wraps after the separator, with the Package whole on the next line. Only when its column is narrower than it does it break, after its scope (`@variablelab/`, then the rest), never at a hyphen and never past its column. No Package on the site is wider than its column. Its link's accessible name stays exactly the Package.
- **Runs on:** its last two Runtimes and the separator between them stay on one line, so the list never ends on a single Runtime, as env's would at 351px.

| Element | Type | Color | Size and space |
| --- | --- | --- | --- |
| Sign and name | | | Side by side, 18px apart, `margin-top: 36px` |
| Sign | | `ink` | 56px; the Class stamp when the Project has no Sign |
| Name | `display` | `ink` | |
| Tagline | `lead`, balance | `ink` | `margin-top: 22px`, `max-width: 36ch`; one line at desktop and tablet |
| Body | `body`, pretty | `ink-muted` | `margin-top: 16px`, `max-width: 58ch` |
| Facts | | | A column, `gap: 22px` |
| Fact label (`Install`, `Requires`, `Runs on`, `Published as`, `Links`) | `label` | `dim` | 6px above its value, 8px for `Install` |
| Requires, Runs on | `small`, pretty | `ink` | |
| Published as | `meta` | `dim`, an App's Executable `ink`, a Library's Package `ink`; the Package is an underlined link at a 3px offset | |
| Links | `small`, each an underlined link at a 3px offset | `dim`; underline `dim` on hover | A column, `gap: 4px` |
| Install command box | `label` at line height 1.5, the Command colored by token ([content-model.md](content-model.md#command)), one line | `surface` background, 1px `rule` border, `rule-strong` on hover | `min-height: 44px`, `padding: 10px 12px`, full width of its column, the Command on the left and the icon on the right, 10px apart |
| Copy, Copied icon | UI icons, drawn as [Copy and Copied icons](#copy-and-copied-icons) gives | `dim`, `ink` while the box is hovered | 14px |
| Example | | `surface` background, 1px `rule` border | `margin-top: 32px`, 12px in one column |
| Snippet header | `meta` | The name in the syntax `keyword` color, the language label in the syntax `comment` color | The name on the left and the label on the right (`space-between`, baseline, `gap: 16px`), `padding: 10px 16px`, a 1px `rule` below; a later Snippet's header also has one above |
| Snippet code | `code` | `ink`, colored by token with the syntax palette | `padding: 18px 16px 20px`; a File snippet has no left padding, because its line numbers take it |
| Line numbers (File snippet) | | Syntax `gutter`, `aria-hidden`, not selectable | 24px wide, right-aligned, 20px before the code |
| Prompt (Terminal snippet) | | Syntax `gutter`, `aria-hidden`, not selectable | `$`, 2ch wide |
| Terminal comment | | Syntax `comment` | Its own line above its Commands; a blank 20px line between groups |
| Closing line | `small`, pretty | `dim` | `margin-top: 28px` |
| Also indexed | | | `margin-top: 48px`, `padding-top: 16px`, a 1px `rule` above |
| Also indexed label | `label` | `dim` | `margin-bottom: 10px` |
| Also indexed item | `small`, a link to its Project page | `ink` | Its Sign beside the name, as the skill's `iconography.md` sets shapes beside text; items wrap, `gap: 12px 28px` |

Snippet code follows the text flow in the skill's `typography.md`; in a Terminal snippet, that keeps `--no-install` and `my-app` whole. On these pages:

- The Snippet header stays fixed while the code scrolls.
- At the end of the scroll the block keeps its 16px right padding.
- The scrollbar is thin, `rule-strong` on transparent.

The Install command fits its box on one line. `text-overflow: ellipsis` is a last resort: when a Command doesn't fit, adjust the box or the type instead.

### Copy and Copied icons

The two icons of the Install command box (rule 6). Each is drawn on `viewBox 0 0 16 16` by the stroke rules for UI icons in the skill's `iconography.md`.

| Icon | Use | Geometry |
| --- | --- | --- |
| Copy | Copies the Install command. | `<rect x="5.75" y="5.75" width="8.5" height="8.5"/>` and `<path d="M2.75 10.25V2.75h7.5"/>` |
| Copied | Replaces Copy for 1.2 s after a copy. | `<path d="M3 8.5l3.25 3.25L13 5"/>` |

## og:image

1200×630, PNG, one per page. Each is generated from its page's content, with the same fonts and Signs as the pages, never drawn by hand. It only changes when the content changes, so cache it.

Every `og:image` has the same frame:

- **Background:** `ground`, `padding: 64px 72px`.
- **Left column**, 500px wide and full height, with its content spread top to bottom:
  - **Top:** the Signature, with the Logo at 34×40, 16px from `Variable Land` at 30px, 500, `-0.02em`.
  - **Middle:** the content.
  - **Bottom:** the Address, 24px mono, `dim`.
- **Panel:** `surface` with a 1px `rule` border, 620×640, starting at `x: 640, y: 64`.
  - It runs off the right and bottom edges; the crop is intended.
  - Whatever doesn't fit is cut at the edge, never wrapped.

### Index

- **Middle:** the intro, at 64px / 1.08, 500, `-0.035em`, pretty.
- **Panel:** a crop of the Index, `padding: 34px 40px`.
  - **Class heading:** 18px, 500, `-0.011em`, with its Class stamp at 18px, 12px from the text. It has `padding-bottom: 16px`, and the second heading `margin-top: 26px`.
  - **Rows:** grid `34px minmax(0, 1fr)`, `column-gap: 22px`, `padding: 22px 0`, a 1px `rule` above. The Projects appear in Index order.
    - The Sign is 34px.
    - The name is 30px / 1.15, 500, `-0.025em`.
    - The Tagline is 20px, 6px below the name.
    - "Published as" is 15px mono in `dim`, 8px below the Tagline, with the Executable in `ink`.

### Project

- **Middle:**
  - The Sign at 72px, 24px from the name, shifted 6px left so its edge lines up with the text.
  - The name at 84px / 1, 500, `-0.04em`. If it doesn't fit the column, it shrinks to the largest whole size that does. Every name on the site fits at 84px.
  - The Tagline at 34px / 1.22, `-0.02em`, `max-width: 20ch`, balance, 28px below.
- **Panel**, in mono, as three rows:
  1. **Install command:** `padding: 24px 28px`, 21px, a 1px `rule` below. A `$ ` prompt in `gutter` comes first, then the Command colored by token.
  2. **Snippet name:** the `ogSnippet` name (`env.ts` or `Terminal`), `padding: 16px 28px`, 17px, in the syntax `keyword` color, a 1px `rule` below.
  3. **Code:** that Snippet's code at 20px / 34px, colored with the syntax palette.
     - A File snippet has `padding: 22px 0` and line numbers 30px wide, right-aligned, in `gutter`, 24px before the code.
     - A Terminal snippet has `padding: 22px 28px` and no line numbers. Its comments are in `comment`, each Command gets a `$ ` prompt, and the line between groups is a blank 34px.

## Decisions

What this file left to the implementation, and what was chosen.

- **Rendering:** Astro 7, static output, with no adapter and no UI framework. `build.format: 'file'` and `trailingSlash: 'never'` build each page to `/<page>.html`. The Worker has no script: it serves `dist/` as static assets with `html_handling: "drop-trailing-slash"`, so `/<project>/` and `/<project>.html` redirect to `/<project>`, and `/<project>` never redirects. Copy is a small inline script. Each page carries its stylesheet inline and preloads its three fonts, and `public/_headers` lets browsers keep every file under `/_astro/` for a year, since the build names those files by their content: moving between pages waits for no stylesheet and no font.
- **Content:** Astro content collections, defined in `src/content.config.ts` with Zod from `astro/zod`. Each Project is a YAML file in `src/content/projects/`, and the Index with its Keeper is `src/content/index.yaml`. The schema enforces the rules of [content-model.md](content-model.md), and `src/lib/content.ts` computes the derived fields. The fixed words this file names (the fact labels, `Also indexed`, the Class headings, `Copy:`, `Copied`, `About {name}`, and `Variable Land` in the Signature) live in `src/lib/labels.ts`.
- **`og:image`:** the static endpoints `src/pages/og.png.ts` and `src/pages/og/[project].png.ts` draw each image from the content with satori and rasterize it with sharp at build time. Cloudflare serves them as static assets, so an image changes only when a build changes it.
- **Tokens, fonts and shapes:** `src/styles/site.css` imports `@variablelab/brand/tokens.css` and Fontsource's latin CSS for IBM Plex Sans 400 and 500 and Mono 400, so browsers load woff2. The `og:image`s read Fontsource's woff files. `src/lib/brand.ts` reads `tokens.json`, the Logo and the Class stamps from `@variablelab/brand` at build time.
- **Code coloring** (`src/lib/code.ts`): a Command by the shell rule of the skill's `color.md`. Its first token is `function`, a flag is `text` and every other token is `string`. A File snippet is colored by Shiki, with a theme built from Vesper's own scope rules: each Vesper color becomes the role that has it in `tokens.json`. The pages and the `og:image`s share the same tokens.
- **Icons:** `/favicon.svg` serves `assets/logo.svg` unchanged, and sharp renders `/apple-touch-icon.png` from it.

## External dependency

env's docs Worker (`withvariablelab/env`, `docsite/wrangler.jsonc`) claims `lab.variable.land/env` and `lab.variable.land/env/*` today, so it answers `/env` before www can, with env's own landing.

Before www serves the env Project page, two changes land in the env repository:

- The route `lab.variable.land/env` goes, so `/env` reaches www. `lab.variable.land/env/*` stays, with the docs and everything they serve.
- env's landing at `/env/` redirects to `/env`, the Project page that replaces it.

## Verifying

Before a page is done:

- Open it at 1280, 834 and 390px, beside its artboards.
- Open its `og:image` at 1200×630 and scaled down to 500px.
- Check that:
  - every Tagline and every Install command fits on one line;
  - no block ends on a single word;
  - the page never scrolls horizontally;
  - focus is visible from the keyboard;
  - Copy copies the Command and announces `Copied`.
