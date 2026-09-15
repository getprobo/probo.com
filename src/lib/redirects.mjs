/**
 * Redirects an entire moved documentation section with a single wildcard
 * rule instead of one rule per file. Cloudflare Pages enforces a small cap
 * on the number of redirect rules it will actually apply (well under the
 * ~190 rules a per-file enumeration produced here), so any section move
 * must collapse to a couple of rules rather than one per page.
 * @param {string} fromPrefix
 * @param {string} toPrefix
 * @returns {Record<string, { status: 301; destination: string }>}
 */
function movedDocsRedirects(fromPrefix, toPrefix) {
  return {
    [fromPrefix]: redirect(toPrefix),
    [`${fromPrefix}/*`]: { status: 301, destination: `${toPrefix}/:splat` },
  };
}

/**
 * @param {string} destination
 * @returns {{ status: 301; destination: string }}
 */
const redirect = (destination) => ({ status: 301, destination });

export const redirects = {
  "/sitemap.xml": redirect("/sitemap-index.xml"),
  "/products/ai-agents": redirect("/products/ai-agents-for-compliance"),
  "/subprocessors": redirect("https://compliance.probo.com/subprocessors"),
  "/compliance-guides": redirect("/hub"),
  "/compliance-guides/soc2": redirect("/hub/soc2"),
  "/compliance-guides/iso27001": redirect("/hub/iso27001"),
  "/wall-of-trust": redirect("/love-from-customer"),
  "/blog/page/1": redirect("/blog"),
  "/fr": redirect("/"),
  "/fr/about": redirect("/about"),
  "/fr/blog": redirect("/blog"),
  "/fr/blog/[id]": redirect("/blog/[id]"),
  "/fr/blog/page/[page]": redirect("/blog/page/[page]"),
  "/fr/brand": redirect("/brand"),
  "/fr/compliance-guides": redirect("/hub"),
  "/fr/contact": redirect("/contact"),
  "/fr/cookie-policy": redirect("/cookie-policy"),
  "/fr/privacy": redirect("/privacy"),
  "/fr/stories": redirect("/stories"),
  "/fr/stories/[id]": redirect("/stories/[id]"),
  "/fr/terms": redirect("/terms"),
  "/fr/yc": redirect("/yc"),
  ...movedDocsRedirects(
    "/docs/getting-started",
    "/docs/product/getting-started",
  ),
  ...movedDocsRedirects("/docs/cli", "/docs/developers/cli"),
  ...movedDocsRedirects("/docs/api", "/docs/developers/api"),
  ...Object.fromEntries(
    [
      ["controls", "control"],
      ["findings", "finding"],
      ["frameworks", "framework"],
      ["organizations", "org"],
      ["risks", "risk"],
      ["users", "user"],
      ["webhooks", "webhook"],
    ].map(([from, to]) => [
      `/docs/developers/cli/commands/${from}`,
      redirect(`/docs/developers/cli/commands/${to}`),
    ]),
  ),
  ...movedDocsRedirects("/docs/self-hosting", "/docs/deployment/self-hosting"),
  "/docs/developers/api/n8n/graphql": redirect(
    "/docs/developers/api/n8n/resources/execute",
  ),
  ...movedDocsRedirects(
    "/docs/configuration",
    "/docs/deployment/configuration",
  ),
  "/docs/product/probo-agent/contributing": redirect(
    "/docs/developers/api/agent/contributing",
  ),
  "/docs/product/probo-agent/installation": redirect(
    "/docs/product/probo-agent/macos",
  ),
  "/docs/product/probo-agent/desktop-install": redirect(
    "/docs/product/probo-agent/macos",
  ),
  "/docs/product/probo-agent/server-install": redirect(
    "/docs/product/probo-agent/linux",
  ),
  "/docs/product/access-review/infrastructure-security": redirect(
    "/docs/deployment/infrastructure-security",
  ),
  "/docs/product/access-review/clerk": redirect(
    "/docs/product/access-review/directory",
  ),
  ...Object.fromEntries(
    Object.entries({
      assets: "assets-and-data",
      audits: "audits-and-findings",
      controls: "frameworks-and-controls",
      "data-classification": "assets-and-data",
      documents: "documents-and-approvals",
      dpias: "privacy",
      findings: "audits-and-findings",
      frameworks: "frameworks-and-controls",
      measures: "measures-tasks-and-evidence",
      obligations: "obligations",
      organizations: "organizations",
      "processing-activities": "privacy",
      risks: "risks",
      "states-of-applicability": "statements-of-applicability",
      tasks: "measures-tasks-and-evidence",
      "third-parties": "third-parties",
      tias: "privacy",
      users: "identity-and-provisioning",
    }).map(([from, to]) => [
      `/docs/developers/api/mcp/tools/${from}`,
      redirect(`/docs/developers/api/mcp/tools/catalog/${to}`),
    ]),
  ),
};

export function cloudflareRedirectLines() {
  return Object.entries(redirects).map(([from, { destination, status }]) => {
    const source = from.replaceAll(/\[([^\]]+)\]/g, ":$1");
    const target = destination.replaceAll(/\[([^\]]+)\]/g, ":$1");
    return `${source} ${target} ${status}`;
  });
}
