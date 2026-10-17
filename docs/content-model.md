# Content model

The content behind every page of this site, as entities and fields. It says what is stored, what each field may hold and how it is written. It doesn't say where the content lives: a headless CMS, files or code can all hold it. The current content is in [content.md](content.md); terms are defined in [glossary.md](glossary.md).

Each field is either **stored** (someone writes it) or **derived** (computed from stored fields, never written by hand).

## Index

One. The page at `/`.

| Field | Kind | Value |
| --- | --- | --- |
| intro | stored | The first sentence. It names apps before libraries, as the sections run. |
| unpublishedLine | stored | The Unpublished line. |
| keeper | stored | One Keeper. |
| projects | stored | The Projects in order. The page groups them by Class, Apps first; within a Class they keep this order. A new Project goes last in its Class unless the Keeper places it. |
| description | stored | The head description. |
| address | derived | `lab.variable.land`. |
| title | derived | `Variable Lab`. |
| ogAlt | derived | `Variable Lab — {intro}`. |

## Keeper

One, shown only on the Index.

| Field | Kind | Value |
| --- | --- | --- |
| name | stored | Shown as text, never a link. |
| site | stored | A Link to the Keeper's own site, shown by its host (`rcrd.space`). |
| statement | stored | One or two sentences in the first person. |
| github | stored | A Link named `GitHub` to the GitHub org. |

## Project

One per Project in the Index. Every Project has a Project page at `lab.variable.land/{name}`.

| Field | Kind | Value | How it's written |
| --- | --- | --- | --- |
| name | stored | Lowercase kebab-case, never `og`, which holds the `og:image`s. It is the title and the last segment of the Address. | The Project's own name, never its Executable or Package. |
| class | stored | `App` or `Library`. | App if it is run (it has an Executable); Library if it is imported. |
| sign | stored, optional | The Sign: one path on a 24×24 viewBox, filled with `fill-rule="evenodd"`. Without one, the page shows the Class stamp. | Copied from the Project's repository, `brand/sign.svg`. Drawing one follows the `vlab-brand` skill. |
| tagline | stored | One sentence, 34–41 characters, ending with a period. It fits one line on the Project page at desktop and tablet widths. | Says what the Project is or guarantees. Example: `The theme is set before first paint.` |
| body | stored | One to three sentences. | Facts from the README: what it does and how. It follows the Tagline without repeating it. |
| installCommand | stored | One Command. | The one the Project's README recommends, as written: `pnpm add` for a Library, `pnpm add -g` or `pnpm add -D` for an App, by where it gets installed. |
| executable | stored, Apps only | The Executable. | As its `package.json` `bin` names it. |
| package | stored | The Package. | As published on npm. |
| requirement | stored, optional | A Requirement, shown under the label `Requires`. | `<Thing> <version> or later`. |
| runtimes | stored, optional | A list of Runtimes, shown under the label `Runs on`. | Every runtime its README and tests support. |
| repository | stored | The Repository's URL. | The package's own directory when it lives in a monorepo. |
| links | stored | An ordered list of Links. The last one is `GitHub`, to the Repository. | Only what exists: `Docs` when the Project has its own docs, `CLI reference` for an App with one. |
| example | stored | One Example. | See [Example](#example). |
| closingLine | stored | One or two short sentences. | See [Closing line](#closing-line). |
| description | stored | The head description, at most 160 characters. | The Tagline plus one sentence of the Body. |
| npm | derived | `https://www.npmjs.com/package/{package}`. | |
| address | derived | `lab.variable.land/{name}`. | |
| title | derived | `{name} · Variable Lab`. | |
| ogAlt | derived | `{name} — {tagline}`. | |
| publishedAs | derived | A Library shows `{package}`; an App shows `{executable} · {package}`. | |
| alsoIndexed | derived | Up to three other Projects: first those of the same Class, then the other Class, each group in Index order. | |

A Project has a requirement, runtimes, or both.

### Closing line

It says what the Project leaves out, as the skill's `voice.md` describes, and like every claim it is checked against the code. The pattern is "No [something concrete]. [A fact]." Example: `No CSS to import. No provider to wrap.`

Before it ships:

- It names something concrete, not a category ("Not a framework").
- It doesn't repeat the Tagline or the Body.
- It holds in every Runtime the Project supports: a Project that runs in the browser can't promise anything about `process.env`.

## Example

One per Project: one or more Snippets, in order.

| Field | Kind | Value |
| --- | --- | --- |
| snippets | stored | One or more File snippets or Terminal snippets, in order. |
| ogSnippet | stored, optional | The Snippet the `og:image` shows. The first one when not set. |

- Real code: what the README documents or what the API accepts as is, checked against the code.
- Minimal but in context: a hook goes inside a component, not alone.
- No line longer than about 70 characters, so it fits the desktop column. A long attribute goes on its own line.

### File snippet

| Field | Value |
| --- | --- |
| file | The file name, kebab-case: `env.ts`, `theme-switch.tsx`. |
| placement | Optional. Where the code goes when that matters, shown after the name: `index.html · <head>`. Placement is said here, not with more code. |
| language | The language label: `TypeScript`, `TSX`, `HTML`. |
| code | The lines. They are numbered on the page. |

### Terminal snippet

| Field | Value |
| --- | --- |
| groups | One or more groups, each a comment and one or more Commands. Groups are separated by one blank line. |

The page shows it under the name `Terminal` with the language label `Shell`; its lines aren't numbered and each Command gets a `$` prompt.

- One comment above each group, lowercase, without a period: `# add the tools, one per call`.
- Every Command the later ones need is there (`rr check` needs the plugins it uses).
- Prefix the Executable with `pnpm` when it's installed in the project.

## Command

A string. On the page it is colored by token with the syntax palette in the `vlab-brand` skill's `color.md`.

## Link

| Field | Value |
| --- | --- |
| name | Shown text: `Docs`, `CLI reference`, `GitHub`, `rcrd.space`. |
| url | Absolute URL. |
