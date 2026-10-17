// The site's content: the stored fields from src/content, with the derived fields of docs/content-model.md.
import { type CollectionEntry, getCollection } from "astro:content";

type StoredIndex = CollectionEntry<"index">["data"];
type StoredProject = CollectionEntry<"projects">["data"];
type StoredSnippet = StoredProject["example"]["snippets"][number];

export type ProjectClass = StoredProject["class"];
export type Link = StoredProject["links"][number];
export type Keeper = StoredIndex["keeper"];

export type FileSnippet = Extract<StoredSnippet, { file: string }> & {
  kind: "file";
  /** Shown in the Snippet header: the file. */
  name: string;
  languageLabel: string;
};

export type TerminalSnippet = Extract<StoredSnippet, { groups: unknown }> & {
  kind: "terminal";
  name: "Terminal";
  languageLabel: "Shell";
};

export type Snippet = FileSnippet | TerminalSnippet;

export interface Example {
  snippets: Snippet[];
  /** The Snippet the og:image shows: the one ogSnippet names, else the first. */
  ogSnippet: Snippet;
}

/** "Published as": an App shows `{executable} · {package}`, a Library `{package}`. */
export interface PublishedAs {
  /** An App's Executable, shown apart from the Package; a Library has none. */
  executable?: string;
  package: string;
  /** The whole line as text. */
  text: string;
}

export interface Project extends Omit<StoredProject, "example"> {
  example: Example;
  npm: string;
  address: string;
  title: string;
  ogAlt: string;
  publishedAs: PublishedAs;
  /** Up to three other Projects: first those of the same Class, then the other Class, each group in Index order. */
  alsoIndexed: Project[];
  path: string;
  ogImage: string;
}

export interface ClassGroup {
  class: ProjectClass;
  projects: Project[];
}

export interface Index extends Omit<StoredIndex, "projects"> {
  /** Every Project, in Index order. */
  projects: Project[];
  /** The Projects grouped by Class, Apps first, each group in Index order. */
  byClass: ClassGroup[];
  address: string;
  title: string;
  ogAlt: string;
  path: string;
  ogImage: string;
}

const address = "lab.variable.land";
/** The Index's title: the name in the Signature, and every page's og:site_name. */
export const siteName = "Variable Land";
/** The Index's path. The Signature links here from every other page. */
export const indexPath = "/";
const separator = " · ";
const classOrder: ProjectClass[] = ["App", "Library"];

function toSnippet(snippet: StoredSnippet): Snippet {
  return "groups" in snippet
    ? { ...snippet, kind: "terminal", name: "Terminal", languageLabel: "Shell" }
    : { ...snippet, kind: "file", name: snippet.file, languageLabel: snippet.language };
}

function toProject(stored: StoredProject): Project {
  const snippets = stored.example.snippets.map(toSnippet);
  const { executable, package: pkg } = stored;
  return {
    ...stored,
    example: {
      snippets,
      // The schema checks that ogSnippet, when set, names one of the Snippets.
      ogSnippet: snippets.find((snippet) => snippet.name === stored.example.ogSnippet) ?? snippets[0],
    },
    npm: `https://www.npmjs.com/package/${pkg}`,
    address: `${address}/${stored.name}`,
    title: `${stored.name}${separator}${siteName}`,
    ogAlt: `${stored.name} — ${stored.tagline}`,
    publishedAs:
      executable === undefined
        ? { package: pkg, text: pkg }
        : { executable, package: pkg, text: `${executable}${separator}${pkg}` },
    alsoIndexed: [],
    path: `/${stored.name}`,
    ogImage: `/og/${stored.name}.png`,
  };
}

function alsoIndexed(project: Project, projects: Project[]): Project[] {
  const others = projects.filter((other) => other !== project);
  const sameClass = others.filter((other) => other.class === project.class);
  const otherClass = others.filter((other) => other.class !== project.class);
  return [...sameClass, ...otherClass].slice(0, 3);
}

/** The Index, with every Project in Index order. */
export async function getIndex(): Promise<Index> {
  const [indexEntries, projectEntries] = await Promise.all([getCollection("index"), getCollection("projects")]);
  const [entry, ...extra] = indexEntries;
  if (entry === undefined || extra.length > 0) {
    throw new Error(`src/content/index.yaml holds one Index; it holds ${indexEntries.length}.`);
  }
  const stored = entry.data;

  const storedById = new Map(projectEntries.map((project) => [project.id, project.data]));
  const listed = stored.projects.map(({ id }) => {
    const project = storedById.get(id);
    if (project === undefined) {
      throw new Error(`The Index lists "${id}", but src/content/projects has no Project named "${id}".`);
    }
    return project;
  });
  const unlisted = projectEntries.filter((project) => !stored.projects.some(({ id }) => id === project.id));
  if (unlisted.length > 0) {
    throw new Error(`Every Project is in the Index's projects; missing: ${unlisted.map(({ id }) => id).join(", ")}.`);
  }

  const projects = listed.map(toProject);
  for (const project of projects) {
    project.alsoIndexed.push(...alsoIndexed(project, projects));
  }

  return {
    ...stored,
    projects,
    byClass: classOrder
      .map((projectClass) => ({ class: projectClass, projects: projects.filter((project) => project.class === projectClass) }))
      .filter((group) => group.projects.length > 0),
    address,
    title: siteName,
    ogAlt: `${siteName} — ${stored.intro}`,
    path: indexPath,
    ogImage: "/og.png",
  };
}
