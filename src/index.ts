// Placeholder for lab.variable.land until the site specified in docs/ is built.
// A Project with its own docs claims lab.variable.land/<project>/* through its own Worker route,
// which is more specific than this custom domain and takes precedence.

const ORG_URL = "https://github.com/withvariablelab";

const ROBOTS_TXT = `User-agent: *
Disallow: /env/api/

Sitemap: https://lab.variable.land/env/sitemap.xml
`;

export default {
  fetch(request) {
    const { pathname } = new URL(request.url);

    if (pathname === "/robots.txt") {
      return new Response(ROBOTS_TXT, {
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }

    // 302, not 301: this becomes the Index later and browsers cache permanent redirects.
    return Response.redirect(ORG_URL, 302);
  },
} satisfies ExportedHandler<Env>;
