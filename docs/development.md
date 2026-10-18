# Development

How to work on www in a clone. The [contributing guide](contributing.md) covers how a change gets in.

## Layout

- `src/pages/`: the Index, the Project pages, the `og:image`s and the icons.
- `src/content/`: the stored content, typed and checked by `src/content.config.ts`.
- `src/lib/`: the derived fields, the fixed words, the brand values, the code colors and the `og:image` drawing.
- `src/components/`, `src/layouts/` and `src/styles/`: the parts the pages are built from.
- `public/`: files copied as is: `robots.txt` and `_headers`.
- `docs/`: the site's design, content model, content and glossary, the steps to add a Project, and these two guides.
- `wrangler.jsonc`: how the Worker serves `dist/`.

## Setup

[mise](https://mise.jdx.dev) pins Node and pnpm (`mise.toml`, `mise.lock`) and puts `node_modules/.bin` on the PATH, so the tools run by name:

```sh
mise install
pnpm install
```

In a shell where mise isn't activated, run them as `mise exec -- <command>`.

## Tasks

```sh
astro dev                   # the site, rebuilt as you edit
rr check                    # format and lint with Biome, then types with astro check
rr jsc --fix                # apply Biome's fixes
astro build                 # the site, into dist/
wrangler dev                # dist/, served as the Worker serves it
wrangler deploy --dry-run   # the deploy, without deploying
```

`rr check` runs Biome, then `astro check` through `@rrlab/astro-plugin`, which type-checks `.astro` files, `.ts` files and the content schema. `rr tsc` runs only the type check.

## CI

- **On each pull request to `main`:** CI runs `pnpm rr check` and `pnpm astro build`, and Workflow audit runs zizmor on the workflows. Both are required checks.
- **On each push:** Workers Builds builds the branch. `main` deploys the site, and every other branch deploys its own Preview, as [Deploying](#deploying) says.
- **Every Monday:** a workflow runs `pnpm audit` on `pnpm-lock.yaml`, and keeps an issue labeled `dependency-audit` open while it finds known vulnerabilities (Dependency audit). Dependabot opens pull requests for security updates only, never for version updates.

The repo has no git hooks.

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

## Deploying

Deployed with [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/) (Git integration). Its build settings, under the Worker's Settings → Build, have two sets: Production, for `main`, and Previews Base, for every other branch.

| Setting | Production | Previews Base |
| --- | --- | --- |
| Root directory | `/` | `/` |
| Build command | `pnpm exec astro build` | `pnpm exec astro build` |
| Build variable | `NODE_VERSION` = `24` | `NODE_VERSION` = `24` |
| Deploy command | `pnpm exec wrangler deploy` | `npx wrangler preview` |

- The Build command is set in Workers Builds, not as `build.command` in `wrangler.jsonc`. Both `wrangler deploy` and `wrangler preview` would run `build.command` after Workers Builds' own Build command, so every build would run Astro twice.
- `NODE_VERSION` is there because Workers Builds doesn't read `mise.toml` or `mise.lock`. Without it, a build gets the build image's default Node.
- Each branch copies the Previews Base into its own trigger the first time it's pushed, so a change to the base applies only to branches pushed after it. A branch pushed before the change keeps its old settings until its own trigger is edited. Deleting the branch deletes its trigger and its Preview.
- The API returns both sets as `production_settings` and `previews_base_config` from `GET /accounts/{account_id}/builds/workers/{worker_tag}`.
- The Previews Base under Settings → Build is not the one under Variables and secrets or Bindings. That other one is the Previews' runtime configuration, which this Worker doesn't need.
- `previews: {}` in `wrangler.jsonc` is required for the preview command.
- `preview_urls: true` in `wrangler.jsonc`, together with Preview turned on under the Worker's Domains → Worker URL, gives each branch its own Preview URL: `https://<branch>-variablelab-www.<subdomain>.workers.dev`, with each `/` in the branch name turned into `-`. The branch `ci/foo` gets `https://ci-foo-variablelab-www.<subdomain>.workers.dev`.
