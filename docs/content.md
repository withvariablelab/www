# Content

The approved content of the site, field by field as [content-model.md](content-model.md) defines it. Derived fields are left out. Use the copy exactly as written.

## Index

| Field | Value |
| --- | --- |
| intro | `A public index of apps and libraries.` |
| unpublishedLine | `Variable Land also builds software that isn't published here.` |
| projects | run-run, vland, env |
| description | `A public index of apps and libraries. Variable Land also builds software that isn't published here.` |

theme-toggle is published but stays out of `projects`, as [add-a-project.md](add-a-project.md) says.

Keeper:

| Field | Value |
| --- | --- |
| name | `rcrd` |
| site | `rcrd.space` → `https://rcrd.space` |
| statement | `I keep this index. I don't ship a tool I wouldn't put in a repo I have to maintain.` |
| github | `GitHub` → `https://github.com/withvariablelab` |

## run-run

| Field | Value |
| --- | --- |
| class | App |
| sign | `M2 2h12v8h8v12H10v-8H2V2z` |
| tagline | `One way to run the scripts in a repo.` |
| body | `Every tool is a plugin you add. The commands stay the same in every repo.` |
| installCommand | `pnpm add -D @rrlab/cli` |
| executable | `rr` |
| package | `@rrlab/cli` |
| requirement | `Node 22.18 or later` |
| repository | `https://github.com/withvariablelab/dx/tree/main/run-run/cli` |
| links | `CLI reference` → `https://github.com/withvariablelab/dx/blob/main/run-run/cli/CLI.md`; `GitHub` → the repository |
| closingLine | `Ships no Biome or TypeScript. Each plugin installs its tool.` |
| description | `One way to run the scripts in a repo. Every tool is a plugin you add.` |

Example: one Terminal snippet.

```sh
# add the tools, one per call
pnpm rr plugins add biome
pnpm rr plugins add ts
pnpm rr plugins add tsdown

# format, lint and type-check
pnpm rr check

# compile and emit types
pnpm rr pack
```

## vland

| Field | Value |
| --- | --- |
| class | App |
| sign | `M2 2h8v8h4v4h8v8H2V2z` |
| tagline | `Starts a project in Variable Land.` |
| body | `A library, a backend or a monorepo. Every template targets Node, uses pnpm and ships rr as the one entry point for lint, format, type-check and build.` |
| installCommand | `pnpm add -g @variablelab/vland` |
| executable | `vland` |
| package | `@variablelab/vland` |
| requirement | `Node 22.18 or later` |
| repository | `https://github.com/withvariablelab/dx/tree/main/vland/cli` |
| links | `CLI reference` → `https://github.com/withvariablelab/dx/blob/main/vland/cli/CLI.md`; `GitHub` → the repository |
| closingLine | `No upgrade command. After init, the project is yours.` |
| description | `Starts a project in Variable Land. A library, a backend or a monorepo.` |

Example: one Terminal snippet. The page shows no table of templates and no note on configs.

```sh
# interactive
vland init

# explicit template
vland init my-app -t library

# skip install and git init
vland init my-app -t backend --no-install --no-git
```

## env

| Field | Value |
| --- | --- |
| class | Library |
| sign | `M2 2h20v20H2V2zm4 8h12v4H6v-4z` |
| tagline | `Only declared variables, checked at boot.` |
| body | `One Standard Schema contract. Files and the environment, resolved at boot. If a value is missing or malformed, the process stops before your code reads it.` |
| installCommand | `pnpm add @variablelab/env` |
| package | `@variablelab/env` |
| runtimes | Node, Bun, Deno, browser, Workers, Edge |
| repository | `https://github.com/withvariablelab/env` |
| links | `Docs` → `https://lab.variable.land/env/docs/getting-started/installation`; `GitHub` → the repository |
| closingLine | `No validator bundled. Bring Zod, Valibot or ArkType.` |
| description | `Only declared variables, checked at boot. If a value is missing or malformed, the process stops before your code reads it.` |

Example: one File snippet, `env.ts`, language `TypeScript`.

```ts
import { defineEnv, schema } from "@variablelab/env";
import * as e from "@variablelab/env/zod";

const Env = schema({
  server: { PORT: e.port, HOST: e.host },
});

export const env = defineEnv({ schema: Env });
```
