# Contributing

www takes fixes to the site and its docs, and new Projects for the Index. To set up the repo and run its checks, see the [development guide](development.md).

## Issues

- A bug report names the page, its URL and the browser, and says what you expected and what happened.
- A new page, a change to [design.md](design.md), or new copy starts as an issue before any pull request. [content.md](content.md) holds the approved copy, and new copy needs the Keeper's approval.
- A new Project follows [add-a-project.md](add-a-project.md).

## Pull requests

1. Branch from `main` with a prefix: `feat/`, `fix/`, `docs/`, `refactor/`, `ci/` or `chore/`.
2. Write commits as [Conventional Commits](https://www.conventionalcommits.org), such as `docs: give the Previews Base its own build settings in Deploying`. The pull request title takes the same form, because it becomes the squash commit.
3. Run `rr check` and `astro build` before you push. A page is done after the visual check in [design.md](design.md#verifying).
4. Workers Builds deploys each pushed branch as a Preview, with its own URL: see [Deploying](development.md#deploying).

CI has to pass, and a maintainer squash-merges. A merge to `main` deploys the site.
