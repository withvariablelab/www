# www

Root Worker for [lab.variable.land](https://lab.variable.land), the home of Variable Lab's open source projects.

Until the landing page exists, it serves `/robots.txt` and redirects everything else (302) to [github.com/withvariablelab](https://github.com/withvariablelab).

## Adding a project

Each project lives at `lab.variable.land/<project>` and deploys its own Worker with its own routes. This repo doesn't change. In the project's `wrangler.jsonc`:

```jsonc
"routes": [
  { "pattern": "lab.variable.land/<project>", "zone_name": "variable.land" },
  { "pattern": "lab.variable.land/<project>/*", "zone_name": "variable.land" }
]
```

This Worker owns `lab.variable.land` as a [Custom Domain](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/), which also creates the DNS record. Routes on the same hostname [take precedence](https://developers.cloudflare.com/workers/configuration/routing/routes/), so project paths never reach this Worker.

The only shared piece is `/robots.txt`, which lives here because it must sit at the root. Edit `src/index.ts` only if a project needs its own crawl rules or sitemap listed there.

## Deploying

Deployed with [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/) (Git integration) using these build settings:

| Setting | Value |
| --- | --- |
| Root directory | `/` |
| Deploy command | `pnpm exec wrangler deploy` |
| Non-production branch deploy command | `npx wrangler preview` |

`previews: {}` in `wrangler.jsonc` is required for the preview command.

Set these before the first push: each branch copies the build settings into its own preview trigger the first time it's pushed, so later changes only apply to new branches.

Local development:

```sh
pnpm install
pnpm dev                          # wrangler dev
pnpm check                        # tsc
pnpm exec wrangler deploy --dry-run
```

Run `pnpm types` after changing `wrangler.jsonc` to regenerate `worker-configuration.d.ts`.
