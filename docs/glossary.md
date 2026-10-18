# www

The language of `lab.variable.land`: the Index of Variable Lab's Projects and the page each one gets.

The house, its marks and its Projects (Variable Land, Variable Lab, Logo, Signature, Project, Class, App, Library, Sign, Class stamp) are defined in the `vlab-brand` skill's `glossary.md`. This file holds the terms of the site.

## The site

**Index**:
The page at `/`: the Projects by Class, and the Keeper's column.
_Avoid_: home, landing, catalog, directory

**Keeper**:
The person who keeps the Index. Today, rcrd.
_Avoid_: author, owner, maintainer, founder

**Address**:
Where a page lives, without the protocol: `lab.variable.land`, `lab.variable.land/env`.
_Avoid_: URL, domain, route

**Unpublished line**:
The Index's sentence saying that Variable Land also builds software that isn't published there.
_Avoid_: private work, clients

## A Project's facts

**Package**:
The name a Project is published under on npm: `@variablelab/env`, `@rrlab/cli`.
_Avoid_: module, dependency, library

**Executable**:
The name an App is invoked by in a terminal: `rr`, `vland`. It is not the Project's name.
_Avoid_: binary, bin, CLI, command

**Command**:
Something typed into a terminal: `pnpm add -D @rrlab/cli`, `vland init`, `rr check`.
_Avoid_: script, instruction, call

**Install command**:
The Command that installs a Project, the one its README recommends. Every Project has exactly one.
_Avoid_: install step, setup, run command

**Runtimes**:
Where a Project runs: Node, Bun, Deno, browser, Workers, Edge.
_Avoid_: platforms, environments, targets

**Requirement**:
The least a Project needs to work: Node 22.18 or later, React 18 or later.
_Avoid_: dependency, prerequisite, peer

**Repository**:
Where a Project's code lives.
_Avoid_: repo URL, GitHub, source

**Link**:
A named link on a Project page: Docs, CLI reference, GitHub.
_Avoid_: resource, reference, external link

## The Project page

**Project page**:
A Project's page, at its Address: `lab.variable.land/<project>`.
_Avoid_: landing, docs, detail page

**Tagline**:
A Project's sentence. It is written for the Project page, like the Body and the Closing line, and it is the same on the Index, on the Project page and in the Project's README, which copies it.
_Avoid_: description, slogan, headline

**Body**:
The paragraph after the Tagline on the Project page: what the Project does, in facts.
_Avoid_: description, summary, lead, intro

**Example**:
What shows how a Project is used. Every Project has one, made of one or more Snippets.
_Avoid_: demo, sample, code block, preview

**Snippet**:
One part of an Example: a File snippet or a Terminal snippet.
_Avoid_: block, section, code

**File snippet**:
A Snippet that is a file: its name, its language, where it goes when that matters (`<head>`), and its code.
_Avoid_: source, code file

**Terminal snippet**:
A Snippet that is a terminal session: Commands, each under its comment.
_Avoid_: shell block, console, CLI example

**Closing line**:
The line under the Example: something checkable that the Project doesn't do or doesn't ship.
_Avoid_: footer, refusal, boundary, disclaimer

**Also indexed**:
The other Projects listed at the foot of a Project page.
_Avoid_: related, see also, more projects
