# www

The site at `lab.variable.land`: the Index of Variable Lab's Projects and a Project page for each. [README.md](./README.md) is for people and holds the commands; this file is for agents working in this repo.

Today `src/index.ts` is a placeholder Worker: it serves `/robots.txt` and redirects everything else. The site itself is designed and specified in `docs/`, and not built yet.

## Docs

- [docs/design.md](./docs/design.md): what to build. It covers the pages, their head and `og:image`, the rules they render by, every measurement, and what is left open. Read it before building or changing a page.
- [docs/content-model.md](./docs/content-model.md): the entities and fields behind the pages, and how each field is written. Read it before storing, rendering or writing content.
- [docs/content.md](./docs/content.md): the approved content. Render it exactly as written. New copy needs the Keeper's approval.
- [docs/glossary.md](./docs/glossary.md): the site's terms. Use them when naming anything in code, content or copy.
- [docs/add-a-project.md](./docs/add-a-project.md): the steps to add a Project.

## Brand

Brand rules come from the `vlab-brand` skill, which is expected to be installed globally. Before designing or writing anything public, check that it is available. If it isn't, install it with `npx skills add withvariablelab/brand --skill vlab-brand -g`.

The tokens, the Logo and the Class stamps ship in the `@variablelab/brand` package on npm. This repo keeps no copy of the brand.

## Rules

- Work from this directory. Everything this repo needs is in it or behind a public URL.
- A change that another repository needs, such as the routes of env's docs Worker, is flagged to the Keeper, not made from here.
- Docs and public copy are in English, written for any harness: say "agents", not one tool's name, and keep install commands free of agent flags.
- Copy lives in the content, never hardcoded in a page.
- A page is done after the visual check in [design.md](./docs/design.md#verifying).
