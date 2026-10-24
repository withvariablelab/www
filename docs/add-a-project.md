# Add a Project

How a Project gets into the Index and gets its Project page. Each step ends when its check holds; the next step uses what the previous one left. Fields are those of [content-model.md](content-model.md), and the result is a new entry in [content.md](content.md), with the same stored fields in `src/content/projects/<name>.yaml`, which the site is built from.

1. **It belongs.** It is Variable Lab's own, it is published, it isn't a fork, and it is among Variable Lab's most relevant Projects: the Keeper keeps only those in the Index. Today portless (a fork), gh-actions (not a Project) and theme-toggle (published, but not among the most relevant) stay out, and nothing private gets in until it is published.
   Check: it has a published Package and a public Repository, and the Keeper wants it in the Index.
2. **Its Class.** `class`, by the rule in [content-model.md](content-model.md#project).
   Check: one Class, which matches how its README uses it.
3. **Its facts.** `package`, `executable` (Apps only), `installCommand`, `requirement` and/or `runtimes`, `repository` and `links`.
   Check: each one is confirmed in the Project's README, `CLI.md` or `package.json`.
4. **Its copy.** `tagline`, `body`, `closingLine` and `description`, written by the rules in [content-model.md](content-model.md).
   Check:
   - the Tagline is 34–41 characters;
   - the Closing line is confirmed in the Project's code;
   - the description is at most 160 characters.
5. **Its Example.** One or more Snippets, and `ogSnippet` when the `og:image` should show one other than the first.
   Check: the code is what the README documents or runs as is, and no line is longer than about 70 characters.
6. **Its shape.** Until it has a Sign, it shows its Class stamp. A Sign is drawn by the `vlab-brand` skill's `project-brand.md`, and it lives in the Project's repository as `brand/sign.svg`.
   Check: the Sign passes the covered-names test, and its path is copied into `sign`.
7. **Its place.** Its position in the Index's `projects`, by the rule in [content-model.md](content-model.md#index), in [content.md](content.md) and in `src/content/index.yaml`.
   Check: every Project's Also indexed still follows rule 3 in [design.md](design.md#rules).
8. **Its page and its `og:image`.** They come from its content: `astro build` renders both, and stops when the content breaks a rule that `src/content.config.ts` checks. Nothing is drawn by hand.
   Check: its title, description and `og:image` follow [design.md](design.md#head).
9. **Its docs, if it publishes its own.** The Project's own Worker takes everything under `lab.variable.land/<project>/`, with the route `{ "pattern": "lab.variable.land/<project>/*", "zone_name": "variable.land" }`. The pattern ends in `/*`, so the Project page at `lab.variable.land/<project>` stays with www; `lab.variable.land/<project>*` would take it too. A landing the Project had before redirects to its Project page. www's `/robots.txt` (`public/robots.txt`) lists the docs' sitemap, and any crawl rule they need, such as disallowing their API.
   Check: `lab.variable.land/<project>` shows the Project page from www, a path under `lab.variable.land/<project>/` shows the Project's docs, and `/robots.txt` names that sitemap.
10. **Its README.** The Project's README follows the `vlab-brand` skill's `readme.md`, and copies its Tagline and Install command word for word. Its title links to the Project page.
    Check: the Tagline and the install command in the README match `tagline` and `installCommand`, and the README's `<h1>` links to `lab.variable.land/<project>`.
11. **Visual review.** As in [design.md](design.md#verifying).
    Check: every item in [design.md](design.md#verifying) holds for its page and its `og:image`.
