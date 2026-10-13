// Placeholder for the lab.variable.land root until the landing exists.
// Projects own their paths (lab.variable.land/<project>/*) through their own Worker routes,
// which are more specific than this custom domain and take precedence.

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

    // 302, not 301: this becomes the landing later and browsers cache permanent redirects.
    return Response.redirect(ORG_URL, 302);
  },
} satisfies ExportedHandler<Env>;
