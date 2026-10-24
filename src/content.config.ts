// The stored fields of docs/content-model.md, with its rules. Derived fields live in src/lib/content.ts.
import { defineCollection, reference } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";

const kebabCase = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const kebabCaseFile = /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\.[a-z0-9]+)+$/;
// SVG path data: commands, numbers and separators, starting with a moveto.
const pathData = /^[Mm][\d\s,.eE+\-MmZzLlHhVvCcSsQqTtAa]*$/;

const characters = (text: string): number => [...text].length;

const text = (field: string) => z.string({ error: `${field} is text.` }).min(1, { error: `${field} is not empty.` });

// Every stored shape is strict: a field the content model doesn't store, such as a derived one, fails the build.
const stored = <Shape extends z.core.$ZodLooseShape>(shape: Shape) =>
  z.strictObject(shape, {
    error: (issue) =>
      issue.code === "unrecognized_keys"
        ? `${issue.keys.join(", ")}: not a stored field. Derived fields are computed in src/lib/content.ts.`
        : undefined,
  });

const absoluteUrl = z.httpUrl({ error: "A URL is absolute, such as https://github.com/withvariablelab." });

const link = stored({
  name: text("A Link's name"),
  url: absoluteUrl,
});

const fileSnippet = stored({
  file: z
    .string()
    .regex(kebabCaseFile, { error: "A File snippet's file is a kebab-case file name, such as env.ts or theme-switch.tsx." }),
  placement: text("A File snippet's placement").optional(),
  language: text("A File snippet's language"),
  code: text("A File snippet's code"),
});

// A Terminal snippet stores each comment without its leading "# " and each Command without its "$" prompt:
// the page adds both.
const terminalSnippet = stored({
  groups: z
    .array(
      stored({
        comment: z
          .string()
          .refine((comment) => !comment.startsWith("#"), { error: 'A Terminal comment is stored without its leading "# ".' })
          .refine((comment) => comment === comment.toLowerCase(), { error: "A Terminal comment is lowercase." })
          .refine((comment) => !comment.endsWith("."), { error: "A Terminal comment has no final period." }),
        commands: z
          .array(
            text("A Command").refine((command) => !command.startsWith("$"), {
              error: 'A Command is stored without its "$" prompt.',
            }),
          )
          .min(1, { error: "A Terminal snippet's group has one or more Commands." }),
      }),
    )
    .min(1, { error: "A Terminal snippet has one or more groups." }),
});

const snippetName = (snippet: z.infer<typeof fileSnippet> | z.infer<typeof terminalSnippet>): string =>
  "file" in snippet ? snippet.file : "Terminal";

const example = stored({
  snippets: z.array(z.union([fileSnippet, terminalSnippet])).min(1, { error: "An Example has one or more Snippets." }),
  ogSnippet: z.string().optional(),
}).superRefine((example, context) => {
  const names = example.snippets.map(snippetName);
  if (example.ogSnippet !== undefined && !names.includes(example.ogSnippet)) {
    context.addIssue({
      code: "custom",
      path: ["ogSnippet"],
      message: `ogSnippet names one of the Example's Snippets, a File snippet by its file and a Terminal snippet as "Terminal": ${names.join(", ")}.`,
    });
  }
});

const project = stored({
  name: z
    .string()
    .regex(kebabCase, { error: "A Project's name is lowercase kebab-case, such as run-run." })
    .refine((name) => name !== "og", { error: 'A Project is never named "og": /og/ holds the og:images.' }),
  class: z.enum(["App", "Library"], { error: 'class is "App" or "Library".' }),
  // The Sign: the d attribute of the one path in the Project's brand/sign.svg.
  sign: z
    .string()
    .regex(pathData, { error: "sign is one SVG path's d attribute, such as M2 2h20v20H2V2z, not an <svg> or <path> element." })
    .optional(),
  tagline: z
    .string()
    .refine((tagline) => characters(tagline) >= 34 && characters(tagline) <= 41, {
      error: (issue) => `A Tagline is 34–41 characters, so it fits one line; this one has ${characters(String(issue.input))}.`,
    })
    .refine((tagline) => tagline.endsWith("."), { error: "A Tagline ends with a period." }),
  body: text("body"),
  installCommand: text("installCommand"),
  executable: text("executable").optional(),
  package: text("package"),
  requirement: text("requirement").optional(),
  runtimes: z.array(text("A Runtime")).min(1, { error: "runtimes, when set, lists one or more Runtimes." }).optional(),
  repository: absoluteUrl,
  links: z.array(link).min(1, { error: "links has one or more Links, the last one GitHub." }),
  example,
  closingLine: text("closingLine"),
  description: text("description").refine((description) => characters(description) <= 160, {
    error: (issue) => `A description is at most 160 characters; this one has ${characters(String(issue.input))}.`,
  }),
}).superRefine((project, context) => {
  if (project.class === "App" && project.executable === undefined) {
    context.addIssue({
      code: "custom",
      path: ["executable"],
      message: "An App has an executable, as its package.json bin names it.",
    });
  }
  if (project.class === "Library" && project.executable !== undefined) {
    context.addIssue({ code: "custom", path: ["executable"], message: "A Library has no executable: only an App is run." });
  }
  if (project.requirement === undefined && project.runtimes === undefined) {
    context.addIssue({ code: "custom", path: ["requirement"], message: "A Project has a requirement, runtimes, or both." });
  }
  const last = project.links.at(-1);
  if (last !== undefined && (last.name !== "GitHub" || last.url !== project.repository)) {
    context.addIssue({
      code: "custom",
      path: ["links", project.links.length - 1],
      message: `The last Link is named "GitHub" and points to the repository, ${project.repository}.`,
    });
  }
});

const keeper = stored({
  name: text("The Keeper's name"),
  site: link.refine((site) => site.name === URL.parse(site.url)?.host, {
    error: "The Keeper's site is named by its host, such as rcrd.space.",
  }),
  statement: text("The Keeper's statement"),
  github: link.refine((github) => github.name === "GitHub", { error: 'The Keeper\'s github Link is named "GitHub".' }),
});

const index = stored({
  intro: text("intro"),
  unpublishedLine: text("unpublishedLine"),
  keeper,
  projects: z
    .array(reference("projects"))
    .min(1, { error: "The Index lists one or more Projects." })
    .refine((projects) => new Set(projects.map(({ id }) => id)).size === projects.length, {
      error: "The Index lists each Project once.",
    }),
  description: text("description"),
});

export const collections = {
  // One YAML file per Project; its stored name is its entry id.
  projects: defineCollection({
    loader: glob({
      base: "./src/content/projects",
      pattern: "*.yaml",
      generateId: ({ data, entry }) => (typeof data.name === "string" ? data.name : entry),
    }),
    schema: project,
  }),
  // The one Index, with its Keeper.
  index: defineCollection({
    loader: file("src/content/index.yaml"),
    schema: index,
  }),
};
