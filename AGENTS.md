# www

The site at `lab.variable.land`: the Index of Variable Lab's Projects and a Project page for each. [README.md](./README.md) is for people, [docs/development.md](./docs/development.md) holds the commands, and this file is for agents working in this repo.

The site is static. `astro build` renders the pages in `src/pages` and the content in `src/content` into `dist/`, with `public/robots.txt` copied as is. The Worker has no script: [wrangler.jsonc](./wrangler.jsonc) serves `dist/` as assets, so how a path resolves, redirects or 404s is set there. The pages are designed and specified in `docs/`.

## Docs

- [docs/design.md](./docs/design.md): what to build. It covers the pages, their head and `og:image`, the rules they render by, every measurement, and the implementation's decisions. Read it before building or changing a page.
- [docs/content-model.md](./docs/content-model.md): the entities and fields behind the pages, and how each field is written. Read it before storing, rendering or writing content.
- [docs/content.md](./docs/content.md): the approved content. Render it exactly as written. New copy needs the Keeper's approval.
- [docs/glossary.md](./docs/glossary.md): the site's terms. Use them when naming anything in code, content or copy.
- [docs/add-a-project.md](./docs/add-a-project.md): the steps to add a Project.

## Code

- Stored content is in `src/content/`, typed and checked by `src/content.config.ts`. Derived fields are computed in `src/lib/content.ts`, never stored.
- The fixed words that `docs/design.md` names are in `src/lib/labels.ts`; [design.md](./docs/design.md#decisions) lists them.
- Brand values come from `@variablelab/brand`, never typed by hand. CSS uses the `--vlab-*` custom properties of its `tokens.css`, which `src/styles/site.css` imports with Fontsource's IBM Plex. TypeScript (the Logo, the Class stamps, `theme-color` and the `og:image`s) reads them through `src/lib/brand.ts`. Code gets its colors from `src/lib/code.ts`, which the Project page and the `og:image`s share.
- The tools run by name through mise's PATH; the commands are in [docs/development.md](./docs/development.md#tasks). In a non-interactive shell mise's hook may not run: use `mise exec -- <command>`.
- For the visual check in [design.md](./docs/design.md#verifying), serve the build as the Worker does: `astro build`, then `wrangler dev` ([docs/development.md](./docs/development.md#tasks)).

## Brand

Brand rules come from the `vlab-brand` skill, which is expected to be installed globally. Before designing or writing anything public, check that it is available. If it isn't, install it with `npx skills add withvariablelab/brand --skill vlab-brand -g`.

The tokens, the Logo and the Class stamps ship in the `@variablelab/brand` package on npm. This repo keeps no copy of the brand.

## Rules

- Work from this directory. Everything this repo needs is in it or behind a public URL.
- A change that another repository needs, such as the routes of env's docs Worker, is flagged to the Keeper, not made from here.
- Docs and public copy are in English, written for any harness: say "agents", not one tool's name, and keep install commands free of agent flags.
- Copy lives in `src/content/` and `src/lib/labels.ts`, never in a page, component or script.
- A page is done after the visual check in [design.md](./docs/design.md#verifying).
