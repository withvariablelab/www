# www

The site at [lab.variable.land](https://lab.variable.land): the Index of Variable Lab's apps and libraries, and a page for each one.

The site is static: [Astro](https://astro.build) builds it into `dist/`, and a Worker with no script serves `dist/` as [static assets](https://developers.cloudflare.com/workers/static-assets/). Each page is served without a trailing slash: `/<project>/` and `/<project>.html` redirect to `/<project>`, and an unknown path gets a 404. `/robots.txt` is `public/robots.txt`, copied as is. The site is designed and specified in [docs/](./docs):

| Doc | What it holds |
| --- | --- |
| [design.md](./docs/design.md) | The pages, their head and `og:image`, the rules they render by, and every measurement. |
| [content-model.md](./docs/content-model.md) | The entities and fields behind the pages. |
| [content.md](./docs/content.md) | The approved content: the Index and each Project. |
| [glossary.md](./docs/glossary.md) | The terms used in code, content and copy. |
| [add-a-project.md](./docs/add-a-project.md) | How a Project gets into the Index. |

The brand comes from [withvariablelab/brand](https://github.com/withvariablelab/brand).

## How `lab.variable.land` is split

This Worker owns `lab.variable.land` as a [Custom Domain](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/), which also creates the DNS record. It serves the Index, every Project page at `/<project>`, and the `og:image`s at `/og.png` and `/og/<project>.png`.

A Project that publishes its own docs deploys its own Worker, with a route for everything under `/<project>/`. Routes on the same hostname [take precedence](https://developers.cloudflare.com/workers/configuration/routing/routes/), so those paths never reach this Worker. In the Project's `wrangler.jsonc`:

```jsonc
"routes": [
  { "pattern": "lab.variable.land/<project>/*", "zone_name": "variable.land" }
]
```

The pattern ends in `/*`, so `/<project>` itself, the Project page, still reaches this Worker. `lab.variable.land/<project>*` would take it too.

`/robots.txt` lives here because it must sit at the root. It also lists the sitemaps of the Projects' docs.

This Worker serves `/<project>` with no redirect, and redirects `/<project>/` to `/<project>`. A Project's Worker may redirect `/<project>/` to `/<project>` too, as env's does. So www must never redirect the other way, from `/<project>` to `/<project>/`, or the two would loop: keep `build.format: 'file'` in `astro.config.mjs` and `html_handling: "drop-trailing-slash"` in `wrangler.jsonc`.

## Adding a Project

Follow [docs/add-a-project.md](./docs/add-a-project.md).

## Deploying

Deployed with [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/) (Git integration) using these build settings:

| Setting | Value |
| --- | --- |
| Root directory | `/` |
| Build command | `pnpm exec astro build` |
| Build variable | `NODE_VERSION` = `24` |
| Deploy command | `pnpm exec wrangler deploy` |
| Non-production branch deploy command | `npx wrangler preview` |

- The Build command is set in the dashboard: `build.command` in `wrangler.jsonc` doesn't run with `wrangler preview`.
- `NODE_VERSION` is there because Workers Builds doesn't read `mise.toml`.
- Settings belong to a trigger: one for production, and Previews Base for other branches. Each branch copies them into its own preview trigger the first time it's pushed, so a change applies only to branches pushed after it. A branch pushed before the change keeps its old settings until its own trigger is edited.
- `previews: {}` in `wrangler.jsonc` is required for the preview command.
- `preview_urls: true` in `wrangler.jsonc`, together with Preview turned on under the Worker's Domains → Worker URL, gives each branch its own Preview URL: `https://<branch>-variablelab-www.<subdomain>.workers.dev`.

## Local development

[mise](https://mise.jdx.dev) pins Node and pnpm (`mise.toml`, `mise.lock`) and puts `node_modules/.bin` on the PATH, so the tools run by name:

```sh
mise install
pnpm install
astro dev                   # the site, rebuilt as you edit
rr jsc                      # format and lint with Biome; rr jsc --fix applies the fixes
astro check                 # types: .astro, .ts and the content schema
astro build                 # the site, into dist/
wrangler dev                # dist/, served as the Worker serves it
wrangler deploy --dry-run
```

In a shell where mise isn't activated, run them as `mise exec -- <command>`.

`astro check` is the type check: `rr check` stops at its type-check step, because rr has no plugin for Astro.

CI runs `pnpm rr jsc`, `pnpm astro check` and `pnpm astro build` on each pull request to `main`. It calls the tools through pnpm because mise's GitHub Action puts only mise's shims on the PATH, not `mise.toml`'s `[env]`.

A weekly workflow runs `pnpm audit` on `pnpm-lock.yaml` and keeps an issue labeled `dependency-audit` open while it finds known vulnerabilities. Dependabot opens pull requests for security updates only, never for version updates.
