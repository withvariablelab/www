// The fixed UI words docs/design.md defines, so no page template holds copy. Everything else a page says is content.
import type { ProjectClass } from "./content.ts";

/** The name set beside the Logo in the Signature: the house, Variable Land (the vlab-brand skill's logo.md). */
export const signatureName = "Variable Land";

/** The labels of a Project page's facts. */
export const factLabels = {
  install: "Install",
  requires: "Requires",
  runsOn: "Runs on",
  publishedAs: "Published as",
  links: "Links",
} as const;

/** The label, and the aside's accessible name, of the other Projects at the foot of a Project page. */
export const alsoIndexedLabel = "Also indexed";

/** The Index's heading for each Class. */
export const classHeadings: Record<ProjectClass, string> = { App: "Apps", Library: "Libraries" };

/** The Install command box's accessible name: `Copy: {installCommand}`. */
export const copyLabel = (command: string): string => `Copy: ${command}`;

/** What the aria-live region announces after a copy. */
export const copiedAnnouncement = "Copied";

/** The accessible name of a Project page's facts column: `About {name}`. */
export const aboutLabel = (name: string): string => `About ${name}`;
