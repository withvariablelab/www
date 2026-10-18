# www

A public index of Variable Lab's apps and libraries. It is the site at [lab.variable.land](https://lab.variable.land): the Index, and a Project page for each Project.

The site is static: [Astro](https://astro.build) builds it into `dist/`, and a Worker with no script serves `dist/` as [static assets](https://developers.cloudflare.com/workers/static-assets/). Each page is served without a trailing slash: `/<project>/` and `/<project>.html` redirect to `/<project>`, and an unknown path gets a 404. `/robots.txt` is `public/robots.txt`, copied as is. The site is designed and specified in [docs/](docs):

- [design.md](docs/design.md): the pages, their head and `og:image`, the rules they render by, and every measurement.
- [content-model.md](docs/content-model.md): the entities and fields behind the pages.
- [content.md](docs/content.md): the approved content of the Index and of each Project.
- [glossary.md](docs/glossary.md): the terms used in code, content and copy.
- [add-a-project.md](docs/add-a-project.md): how a Project gets into the Index.

The brand comes from [withvariablelab/brand](https://github.com/withvariablelab/brand).

## Adding a Project

Follow [docs/add-a-project.md](docs/add-a-project.md).

## Contributing

The [contributing guide](docs/contributing.md) covers issues and pull requests, and the [development guide](docs/development.md) covers setting up the repo and running its checks.

## License

[MIT](LICENSE).

<p align="center">
  <a href="https://lab.variable.land"><img src="https://cdn.jsdelivr.net/gh/withvariablelab/brand@v0.3.1/.github/readme/logo.svg" width="24" alt="" align="absmiddle">&nbsp;Variable Land</a>
</p>
