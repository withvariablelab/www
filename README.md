# www

The site at [lab.variable.land](https://lab.variable.land): the Index of Variable Lab's apps and libraries, and a page for each one.

Until the Index is built, it serves `/robots.txt` and redirects everything else (302) to [github.com/withvariablelab](https://github.com/withvariablelab). The site is designed and specified in [docs/](./docs):

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

## Adding a Project

Follow [docs/add-a-project.md](./docs/add-a-project.md).

## Deploying

Deployed with [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/) (Git integration) using these build settings:

| Setting | Value |
| --- | --- |
| Root directory | `/` |
| Deploy command | `pnpm exec wrangler deploy` |
| Non-production branch deploy command | `npx wrangler preview` |

`previews: {}` in `wrangler.jsonc` is required for the preview command.

Each branch copies these settings into its own preview trigger the first time it's pushed. A change to them applies only to branches pushed after it.

## Local development

```sh
pnpm install
pnpm dev                          # wrangler dev
pnpm check                        # tsc
pnpm exec wrangler deploy --dry-run
```

Run `pnpm types` after changing `wrangler.jsonc` to regenerate `worker-configuration.d.ts`.
