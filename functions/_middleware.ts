export async function onRequest(context: {
  request: Request;
  next: () => Promise<Response>;
  env: {
    ASSETS: { fetch: (req: Request | URL | string) => Promise<Response> };
  };
}): Promise<Response> {
  const url = new URL(context.request.url);
  if (url.pathname.startsWith("/md/")) {
    url.pathname = url.pathname.slice("/md".length);
    return Response.redirect(url.toString(), 301);
  }

  const isMarkdownPath =
    url.pathname.endsWith(".md") || url.pathname.startsWith("/md/");
  const isMarkdownAlternate =
    url.pathname.endsWith(".md") && !url.pathname.startsWith("/md/");

  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/_astro/") ||
    url.pathname.startsWith("/static/") ||
    (url.pathname.match(/\.\w+$/) && !isMarkdownPath)
  ) {
    return context.next();
  }

  const accept = context.request.headers.get("Accept")?.toLowerCase() || "";
  if (isMarkdownAlternate || accept.includes("text/markdown")) {
    const requestPath = isMarkdownAlternate
      ? url.pathname.slice(0, -3)
      : url.pathname;
    const path = requestPath === "/" ? "" : requestPath.replace(/\/+$/, "");
    const candidates = path
      ? [`/md${path}.md`, `/md${path}/index.md`]
      : ["/md/index.md"];

    for (const candidate of candidates) {
      const response = await context.env.ASSETS.fetch(
        new URL(candidate, url.origin),
      );

      if (response.ok) {
        return withMarkdownHeaders(response, true);
      }
    }
  }

  const response = await context.next();
  if (isMarkdownPath) {
    return withMarkdownHeaders(response, response.ok);
  }

  const headers = new Headers(response.headers);
  addVaryAccept(headers);

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function withMarkdownHeaders(
  response: Response,
  asMarkdown: boolean,
): Response {
  const headers = new Headers(response.headers);
  if (asMarkdown) {
    headers.set("Content-Type", "text/markdown; charset=utf-8");
  }
  headers.set("X-Robots-Tag", "noindex, nofollow");
  addVaryAccept(headers);

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function addVaryAccept(headers: Headers): void {
  const vary = headers.get("Vary");
  const values = vary
    ? vary
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean)
    : [];

  if (!values.some((value) => value.toLowerCase() === "accept")) {
    headers.set("Vary", [...values, "Accept"].join(", "));
  }
}
