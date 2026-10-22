import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, extname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import Slugger from "github-slugger";
import { parse as parseHtml } from "parse5";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { parse as parseYaml } from "yaml";
import { docsSidebarGroups } from "../src/lib/docs-sidebar.ts";

// Compare with a known source revision; built HTML is checked only with --dist.
const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const contentRoot = "src/content/docs";
const args = process.argv.slice(2);
const option = (name) => {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
};
const base = option("--base") || "HEAD";
const dist = args.includes("--dist")
  ? resolve(root, option("--dist") || "dist")
  : undefined;
const reportPath = option("--report");
const parser = unified().use(remarkParse).use(remarkMdx);
const errors = [];
const warnings = [];
const changed = [];
const basePaths = git(["ls-tree", "-r", "--name-only", base, "--", contentRoot])
  .trim()
  .split("\n")
  .filter(Boolean);
const currentPaths = await collect(resolve(root, contentRoot));
const currentSet = new Set(currentPaths);
const sourcePages = new Map();
const basePages = new Map();
const expectedAssets = new Map();
let oldAnchors = 0;
let sourceLinks = 0;
let fragmentLinks = 0;

for (const path of basePaths) {
  if (!currentSet.has(path)) {
    errors.push(`Source removed: ${path}`);
    continue;
  }
  const before = gitBuffer(["show", `${base}:${path}`]);
  const after = await readFile(resolve(root, path));
  if (hash(before) !== hash(after)) changed.push(path);
  if (extname(path) !== ".mdx") {
    if (hash(before) !== hash(after))
      warnings.push(`Source asset changed: ${path}`);
    continue;
  }
  if (path.split("/").some((segment) => segment.startsWith("_"))) continue;
  const oldPage = inspectSource(path, before.toString());
  basePages.set(oldPage.route, oldPage);
  for (const asset of oldPage.assets) {
    if (!existsInGit(asset)) continue;
    expectedAssets.set(asset, hash(gitBuffer(["show", `${base}:${asset}`])));
  }
}

for (const path of currentPaths.filter((path) => extname(path) === ".mdx")) {
  if (path.split("/").some((segment) => segment.startsWith("_"))) continue;
  const page = inspectSource(path, await readFile(resolve(root, path), "utf8"));
  if (page.published) sourcePages.set(page.route, page);
}

for (const [route, before] of basePages) {
  if (!before.published) continue;
  const after = sourcePages.get(route);
  if (!after) {
    errors.push(`Published URL removed: ${route}`);
    continue;
  }
  for (const key of ["title", "description"]) {
    if (!after.data[key]) errors.push(`Metadata missing: ${route} (${key})`);
  }
  for (const key of ["title", "description", "head", "lastUpdated"]) {
    if (JSON.stringify(before.data[key]) !== JSON.stringify(after.data[key]))
      warnings.push(`Metadata changed in ${route}: ${key}`);
  }
  for (const anchor of before.anchors) {
    oldAnchors += 1;
    if (!after.anchors.has(anchor))
      errors.push(`Original anchor removed: ${route}#${anchor}`);
  }
  const lostLinks = [...before.links].filter((link) => !after.links.has(link));
  if (lostLinks.length)
    warnings.push(
      `Links removed or replaced in ${route}: ${lostLinks.join(", ")}`,
    );
  const beforeWords = before.body.trim().split(/\s+/).length;
  const afterWords = after.body.trim().split(/\s+/).length;
  if (afterWords < beforeWords * 0.8)
    warnings.push(
      `Content reduced in ${route}: ${beforeWords} → ${afterWords} words; review semantic preservation`,
    );
}

for (const [asset, originalHash] of expectedAssets) {
  if (!existsSync(resolve(root, asset)))
    errors.push(`Referenced asset removed: ${asset}`);
  else if (hash(await readFile(resolve(root, asset))) !== originalHash)
    warnings.push(`Referenced asset changed: ${asset}`);
}

const graph = new Map();
for (const [route, page] of sourcePages) {
  const reachable = new Set();
  for (const href of page.links) {
    const target = docsTarget(href, route);
    if (!target) continue;
    sourceLinks += 1;
    if (!sourcePages.has(target.route)) {
      errors.push(`Broken source link: ${route} → ${href}`);
      continue;
    }
    reachable.add(target.route);
    if (target.anchor) {
      fragmentLinks += 1;
      if (!sourcePages.get(target.route).anchors.has(target.anchor))
        errors.push(`Broken source anchor: ${route} → ${href}`);
    }
  }
  graph.set(route, reachable);
}

const sidebarRoutes = new Set(
  docsSidebarGroups
    .flatMap((group) => sidebarSlugs(group.items))
    .map((slug) => normalizeRoute(`/${slug}`)),
);
for (const route of sidebarRoutes)
  if (!sourcePages.has(route))
    errors.push(`Sidebar points to missing page: ${route}`);
const visited = new Set();
const pending = ["/docs", ...sidebarRoutes];
while (pending.length) {
  const route = pending.pop();
  if (visited.has(route)) continue;
  visited.add(route);
  pending.push(...(graph.get(route) || []));
}
const missingSidebar = [...sourcePages.keys()].filter(
  (route) => !sidebarRoutes.has(route),
);
const unreachable = [...sourcePages.keys()].filter(
  (route) => !visited.has(route),
);
for (const route of unreachable)
  errors.push(`No path from docs home or sidebar: ${route}`);

let builtPages = 0;
let builtLinks = 0;
let sitemapPages = 0;
let markdownPages = 0;
if (dist) {
  const htmlPages = new Map();
  const sitemapFiles = (await collect(dist)).filter((path) =>
    /\/sitemap[^/]*\.xml$/.test(path),
  );
  const sitemapUrls = new Set();
  const sitemapDates = new Map();
  for (const path of sitemapFiles) {
    const xml = await readFile(resolve(root, path), "utf8");
    for (const [, entry] of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
      const url = entry.match(/<loc>(.*?)<\/loc>/)?.[1];
      if (!url) continue;
      const target = docsTarget(url, "/docs");
      if (target) {
        sitemapUrls.add(target.route);
        sitemapDates.set(
          target.route,
          entry.match(/<lastmod>(.*?)<\/lastmod>/)?.[1],
        );
      }
    }
  }
  const llmsIndex = await optionalRead(resolve(dist, "llms-docs.txt"));
  const llmsFull = await optionalRead(resolve(dist, "llms-full.txt"));
  const llmsRoot = await optionalRead(resolve(dist, "llms.txt"));
  if (!llmsRoot) errors.push("Built llms.txt is missing or empty");
  for (const route of sourcePages.keys()) {
    const htmlPath = resolve(dist, `${route.slice(1)}.html`);
    if (!existsSync(htmlPath)) {
      errors.push(`Built HTML missing: ${route}`);
      continue;
    }
    builtPages += 1;
    const html = await readFile(htmlPath, "utf8");
    const document = inspectHtml(html);
    htmlPages.set(route, document);
    const canonical = document.links.find(
      (link) => link.rel === "canonical",
    )?.href;
    if (canonical !== `https://www.probo.com${route}`)
      errors.push(`Wrong canonical for ${route}: ${canonical || "missing"}`);
    if (
      document.robots.some((value) =>
        /(?:^|[,\s])noindex(?:$|[,\s])/.test(value),
      )
    )
      errors.push(`Built HTML is noindex: ${route}`);
    if (!document.title || !document.description)
      errors.push(`Built title/description missing: ${route}`);
    const h1s = document.headings.filter(({ tag }) => tag === "h1");
    if (h1s.length !== 1)
      errors.push(`Expected one H1 in ${route}, found ${h1s.length}`);
    for (const anchor of basePages.get(route)?.anchors || []) {
      if (!document.ids.has(anchor))
        errors.push(`Original anchor missing from HTML: ${route}#${anchor}`);
    }
    for (const node of document.schemas) {
      if (node.url === canonical && node.publisher?.name === "Probo") {
        if (node.dateModified && Number.isNaN(Date.parse(node.dateModified)))
          errors.push(`Invalid dateModified: ${route}`);
        if (
          node.dateModified &&
          Date.parse(node.dateModified) !== Date.parse(sitemapDates.get(route))
        )
          errors.push(
            `Sitemap date differs from source-derived dateModified: ${route}`,
          );
      }
    }
    if (
      !document.schemas.some(
        (node) =>
          node.url === canonical &&
          ["WebPage", "TechArticle"].includes(node["@type"]),
      )
    )
      errors.push(`Documentation JSON-LD missing: ${route}`);
    if (!sitemapUrls.has(route)) errors.push(`Sitemap omits ${route}`);
    else sitemapPages += 1;
    const markdownPath = resolve(dist, "md", `${route.slice(1)}.md`);
    const markdown = await optionalRead(markdownPath);
    if (!markdown?.trim()) errors.push(`Markdown export missing: ${route}.md`);
    else markdownPages += 1;
    if (!llmsIndex?.includes(`https://www.probo.com${route}.md)`))
      errors.push(`LLM index omits ${route}`);
    if (!llmsFull?.includes(`Source: https://www.probo.com${route}\n`))
      errors.push(`LLM corpus omits ${route}`);
    const alternate = document.links.find(
      (link) => link.rel === "alternate" && link.type === "text/markdown",
    );
    if (alternate?.href !== `${route}.md`)
      errors.push(`Markdown alternate missing or wrong: ${route}`);
  }
  for (const route of sitemapUrls)
    if (!sourcePages.has(route))
      errors.push(`Sitemap includes unknown docs URL: ${route}`);
  for (const [route, document] of htmlPages) {
    for (const href of document.hrefs) {
      const target = docsTarget(href, route);
      if (!target || target.route.endsWith(".md")) continue;
      builtLinks += 1;
      const destination = htmlPages.get(target.route);
      if (!destination) errors.push(`Broken built link: ${route} → ${href}`);
      else if (target.anchor && !destination.ids.has(target.anchor))
        errors.push(`Broken built anchor: ${route} → ${href}`);
    }
    for (const src of document.assets) {
      const url = new URL(src, `https://www.probo.com${route}`);
      if (url.origin !== "https://www.probo.com") continue;
      const asset = resolve(dist, decodeURIComponent(url.pathname.slice(1)));
      if (!existsSync(asset))
        errors.push(`Built asset missing: ${route} → ${src}`);
    }
  }
}

const uniqueErrors = [...new Set(errors)];
const uniqueWarnings = [...new Set(warnings)];
const summary = [
  `Documentation preservation: ${uniqueErrors.length ? "FAILED" : "PASSED"}`,
  `Base: ${base}`,
  `Original sources present: ${basePaths.length - basePaths.filter((path) => !currentSet.has(path)).length}/${basePaths.length}; changed: ${changed.length}`,
  `Published pages: ${sourcePages.size}; original anchors checked: ${oldAnchors}; linked original assets: ${expectedAssets.size}`,
  `Source docs links: ${sourceLinks} (${fragmentLinks} fragments); sidebar: ${sidebarRoutes.size}; reachable: ${visited.size}/${sourcePages.size}`,
  dist
    ? `Build: ${builtPages} HTML, ${markdownPages} Markdown, ${sitemapPages} sitemap entries; ${builtLinks} rendered docs links`
    : "Build not checked: run after npm run build with --dist dist",
  `Errors: ${uniqueErrors.length}; review notes: ${uniqueWarnings.length}`,
  "",
  "Changed source files:",
  ...changed.map((path) => `- ${path}`),
  "",
  "Pages reached via links rather than direct sidebar entries:",
  ...missingSidebar.map((route) => `- ${route}`),
  "",
  "Errors:",
  ...uniqueErrors.map((error) => `- ${error}`),
  "",
  "Review notes (editorial changes still require human review):",
  ...uniqueWarnings.map((warning) => `- ${warning}`),
].join("\n");
console.log(summary);
if (reportPath) await writeFile(resolve(root, reportPath), `${summary}\n`);
process.exitCode = uniqueErrors.length ? 1 : 0;

function gitBuffer(args) {
  return execFileSync("git", args, { cwd: root, maxBuffer: 32 * 1024 * 1024 });
}
function git(args) {
  return gitBuffer(args).toString();
}
function existsInGit(path) {
  try {
    gitBuffer(["cat-file", "-e", `${base}:${path}`]);
    return true;
  } catch {
    return false;
  }
}
function hash(content) {
  return createHash("sha256").update(content).digest("hex");
}
async function collect(directory) {
  if (!existsSync(directory)) return [];
  const entries = await readdir(directory, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((entry) =>
        entry.isDirectory()
          ? collect(resolve(directory, entry.name))
          : [
              relative(root, resolve(directory, entry.name)).replaceAll(
                "\\",
                "/",
              ),
            ],
      ),
    )
  ).flat();
}
async function optionalRead(path) {
  return existsSync(path) ? readFile(path, "utf8") : undefined;
}
function normalizeRoute(path) {
  return (
    decodeURIComponent(path)
      .replace(/\.html$/, "")
      .replace(/\/+$/, "") || "/"
  );
}
function docsTarget(href, route) {
  if (!href || /^(?:mailto|tel|javascript|data):/i.test(href)) return undefined;
  let url;
  try {
    url = new URL(href, `https://www.probo.com${route}`);
  } catch {
    return undefined;
  }
  if (
    url.origin !== "https://www.probo.com" ||
    !/^\/docs(?:\/|$)/.test(url.pathname)
  )
    return undefined;
  return {
    route: normalizeRoute(url.pathname),
    anchor: decodeURIComponent(url.hash.slice(1)),
  };
}
function text(node) {
  return node.value || node.children?.map(text).join("") || "";
}
function walk(node, visit) {
  visit(node);
  for (const child of node.children || []) walk(child, visit);
}
function inspectSource(path, content) {
  const frontmatter = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
  const data = frontmatter ? parseYaml(frontmatter[1]) : {};
  const body = frontmatter ? content.slice(frontmatter[0].length) : content;
  let tree;
  try {
    tree = parser.parse(body);
  } catch (error) {
    throw new Error(`Cannot parse ${path}: ${error.message}`, { cause: error });
  }
  const slugger = new Slugger();
  const anchors = new Set();
  const links = new Set();
  const assets = new Set();
  const addAsset = (target) => {
    if (/^(?:https?:|data:|#)/.test(target)) return;
    const clean = target.split(/[?#]/, 1)[0];
    const full = clean.startsWith("@/")
      ? resolve(root, "src", clean.slice(2))
      : clean.startsWith("/")
        ? resolve(root, "public", clean.slice(1))
        : resolve(root, dirname(path), clean);
    assets.add(relative(root, full).replaceAll("\\", "/"));
  };
  walk(tree, (node) => {
    if (node.type === "heading") anchors.add(slugger.slug(text(node)));
    if (node.type === "link" || node.type === "definition") links.add(node.url);
    if (node.type === "image") addAsset(node.url);
    for (const attr of node.attributes || []) {
      if (attr.name === "id" && typeof attr.value === "string")
        anchors.add(attr.value);
      if (attr.name === "href" && typeof attr.value === "string")
        links.add(attr.value);
      if (attr.name === "src" && typeof attr.value === "string")
        addAsset(attr.value);
    }
    if (node.type === "mdxjsEsm") {
      for (const [, target] of node.value.matchAll(
        /\bfrom\s+["']([^"']+\.(?:svg|png|jpe?g|webp|gif|mermaid))["']/g,
      ))
        addAsset(target);
    }
  });
  const route = normalizeRoute(
    `/${relative(contentRoot, path)
      .replace(/\.mdx$/, "")
      .replace(/\/index$/, "")}`,
  );
  return {
    path,
    route,
    data,
    body,
    links,
    anchors,
    assets,
    published:
      !path.split("/").some((segment) => segment.startsWith("_")) &&
      !data.draft,
  };
}
function sidebarSlugs(items) {
  return items.flatMap((item) =>
    "slug" in item
      ? [item.slug]
      : "items" in item
        ? sidebarSlugs(item.items)
        : [],
  );
}
function inspectHtml(html) {
  const tree = parseHtml(html);
  const ids = new Set(),
    hrefs = new Set(),
    assets = new Set(),
    links = [],
    robots = [],
    headings = [],
    schemas = [];
  let title = "",
    description = "";
  const visit = (node) => {
    const attrs = Object.fromEntries(
      (node.attrs || []).map(({ name, value }) => [name, value]),
    );
    const content = () =>
      node.childNodes
        ?.map(
          (child) =>
            child.value ||
            child.childNodes?.map((sub) => sub.value || "").join("") ||
            "",
        )
        .join("") || "";
    if (attrs.id) ids.add(attrs.id);
    if (node.tagName === "a" && attrs.href) hrefs.add(attrs.href);
    if (["img", "source", "video"].includes(node.tagName) && attrs.src)
      assets.add(attrs.src);
    if (node.tagName === "link") links.push(attrs);
    if (node.tagName === "meta" && ["robots", "googlebot"].includes(attrs.name))
      robots.push(attrs.content || "");
    if (node.tagName === "meta" && attrs.name === "description")
      description = attrs.content || "";
    if (node.tagName === "title") title = content();
    if (/^h[1-6]$/.test(node.tagName))
      headings.push({ tag: node.tagName, id: attrs.id });
    if (node.tagName === "script" && attrs.type === "application/ld+json") {
      try {
        schemas.push(JSON.parse(content()));
      } catch {
        errors.push("Invalid built JSON-LD");
      }
    }
    for (const child of node.childNodes || []) visit(child);
  };
  visit(tree);
  return {
    ids,
    hrefs,
    assets,
    links,
    robots,
    headings,
    schemas,
    title,
    description,
  };
}
