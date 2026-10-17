// /og/<project>.png: each Project's og:image, generated from the content at build time.
import type { APIRoute, GetStaticPaths } from "astro";
import { getIndex, type Project } from "../../lib/content.ts";
import { projectImage } from "../../lib/og/project-image.ts";

export const getStaticPaths = (async () => {
  const index = await getIndex();
  return index.projects.map((project) => ({ params: { project: project.name }, props: { project } }));
}) satisfies GetStaticPaths;

interface Props {
  project: Project;
}

export const GET: APIRoute<Props> = ({ props }) => projectImage(props.project);
