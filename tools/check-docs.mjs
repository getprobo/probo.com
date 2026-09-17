import { readdir, readFile, stat } from "node:fs/promises";
import { extname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import {
  cliCommandItems,
  mcpCategoryItems,
  n8nResourceItems,
} from "../src/lib/generated-reference-manifest.mjs";
import { docsSidebarGroups } from "../src/lib/docs-sidebar.ts";
import { cloudflareRedirectLines, redirects } from "../src/lib/redirects.mjs";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const contentRoot = resolve(root, "src/content/docs");
const docsRoot = resolve(contentRoot, "docs");
const publicRoot = resolve(root, "public");

const files = await collectFiles(docsRoot, ".mdx");
const publishedFiles = files.filter(
  (file) => !file.split(sep).some((segment) => segment.startsWith("_")),
);
const routes = new Set(publishedFiles.map(routeForFile));
const errors = [];
let checkedLinks = 0;
let checkedAssets = 0;

for (const file of files) {
  const content = await readFile(file, "utf8");
  const frontmatter = content.match(/^---\s*\n([\s\S]*?)\n---/);

  if (!frontmatter) {
    errors.push(`${displayPath(file)}: missing frontmatter`);
    continue;
  }

  if (!/^title:\s*\S+/m.test(frontmatter[1])) {
    errors.push(`${displayPath(file)}: missing title`);
  }
  if (!/^description:\s*\S+/m.test(frontmatter[1])) {
    errors.push(`${displayPath(file)}: missing description`);
  }

  if (!publishedFiles.includes(file)) continue;

  for (const target of findDocLinks(content)) {
    checkedLinks += 1;
    const route = normalizeRoute(target);
    if (!routes.has(route)) {
      errors.push(`${displayPath(file)}: broken documentation link ${target}`);
    }
  }

  for (const target of findPublicAssets(content)) {
    checkedAssets += 1;
    const assetPath = resolve(publicRoot, target.slice(1));
    if (!(await exists(assetPath))) {
      errors.push(`${displayPath(file)}: missing public asset ${target}`);
    }
  }

  if (displayPath(file).startsWith("src/content/docs/docs/developers/")) {
    for (const legacyLabel of [
      "Settings → API Tokens",
      "Settings → API Keys",
    ]) {
      if (content.includes(legacyLabel)) {
        errors.push(
          `${displayPath(file)}: replace the legacy ${legacyLabel} label with account menu → OAuth tokens`,
        );
      }
    }
  }

  for (const legacyPrefix of [
    "/docs/api/",
    "/docs/cli/",
    "/docs/configuration/",
    "/docs/self-hosting/",
    "/docs/getting-started/",
  ]) {
    const escaped = legacyPrefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const internalLink = new RegExp(`(?:\\]\\(|href=["'])${escaped}`);
    if (internalLink.test(content)) {
      errors.push(
        `${displayPath(file)}: links to legacy route prefix ${legacyPrefix}`,
      );
    }
  }
}

const groupIds = new Set();
const validSectionIds = new Set([
  "overview",
  "product",
  "developers",
  "deployment",
]);
for (const group of docsSidebarGroups) {
  if (groupIds.has(group.id)) {
    errors.push(`src/lib/docs-sidebar.ts: duplicate group id ${group.id}`);
  }
  groupIds.add(group.id);
  if (!validSectionIds.has(group.sectionId)) {
    errors.push(
      `src/lib/docs-sidebar.ts: unknown section ${group.sectionId} for ${group.id}`,
    );
  }
}

const sidebarSlugs = new Set(
  docsSidebarGroups.flatMap((group) => collectSidebarSlugs(group.items)),
);
for (const slug of sidebarSlugs) {
  const route = normalizeRoute(`/${slug}`);
  if (!routes.has(route)) {
    errors.push(`src/lib/docs-sidebar.ts: sidebar route has no page ${route}`);
  }
}

for (const item of [
  ...cliCommandItems,
  ...mcpCategoryItems,
  ...n8nResourceItems,
]) {
  if (!sidebarSlugs.has(item.slug)) {
    errors.push(
      `src/lib/generated-reference-manifest.mjs: generated route is absent from sidebar /${item.slug}`,
    );
  }
}

for (const legacyDirectory of [
  "api",
  "cli",
  "configuration",
  "getting-started",
  "self-hosting",
]) {
  if (await exists(resolve(docsRoot, legacyDirectory))) {
    errors.push(
      `src/content/docs/docs/${legacyDirectory}: legacy content directory must not be authored`,
    );
  }
}

const cloudflareRedirects = await readFile(
  resolve(publicRoot, "_redirects"),
  "utf8",
);
for (const redirectLine of cloudflareRedirectLines()) {
  if (!cloudflareRedirects.split("\n").includes(redirectLine)) {
    errors.push(
      `public/_redirects: missing generated redirect; run npm run redirects:generate (${redirectLine})`,
    );
  }
}

for (const [from, { destination }] of Object.entries(redirects)) {
  if (
    from.includes("*") ||
    from.includes("[") ||
    !destination.startsWith("/docs") ||
    destination.startsWith("/md/") ||
    destination.endsWith(".md")
  ) {
    continue;
  }
  const route = normalizeRoute(destination);
  if (!routes.has(route)) {
    errors.push(
      `src/lib/redirects.mjs: ${from} redirects to unpublished page ${destination}`,
    );
  }
}

if (errors.length > 0) {
  console.error(`Documentation checks failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(
    `Documentation checks passed: ${publishedFiles.length} pages, ${checkedLinks} internal links, ${checkedAssets} public assets.`,
  );
}

async function collectFiles(directory, extension) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const path = resolve(directory, entry.name);
      if (entry.isDirectory()) return collectFiles(path, extension);
      return extname(entry.name) === extension ? [path] : [];
    }),
  );
  return nested.flat();
}

function routeForFile(file) {
  let route = relative(contentRoot, file).split(sep).join("/");
  route = route.replace(/\.mdx$/, "").replace(/\/index$/, "");
  return normalizeRoute(`/${route}`);
}

function normalizeRoute(target) {
  const path = target.split(/[?#]/, 1)[0].replace(/\.html$/, "");
  const normalized = path.length > 1 ? path.replace(/\/+$/, "") : path;
  try {
    return decodeURIComponent(normalized);
  } catch {
    return normalized;
  }
}

function findDocLinks(content) {
  const targets = new Set();
  const patterns = [
    /\]\((\/docs(?:[/?#][^)\s]*)?)\)/g,
    /\bhref=["'](\/docs(?:[/?#][^"']*)?)["']/g,
  ];

  for (const pattern of patterns) {
    for (const [, target] of content.matchAll(pattern)) {
      if (!/\.[a-z0-9]+(?:$|[?#])/i.test(target)) targets.add(target);
    }
  }

  return targets;
}

function findPublicAssets(content) {
  const targets = new Set();
  const patterns = [
    /!\[[^\]]*\]\((\/[^)\s]+\.(?:avif|gif|jpe?g|png|svg|webp))(?:\s+["'][^"']*["'])?\)/gi,
    /\bsrc=["'](\/[^"']+\.(?:avif|gif|jpe?g|png|svg|webp))["']/gi,
  ];

  for (const pattern of patterns) {
    for (const [, target] of content.matchAll(pattern)) targets.add(target);
  }

  return targets;
}

function collectSidebarSlugs(items) {
  return items.flatMap((item) => {
    if ("slug" in item) return [item.slug];
    if ("items" in item) return collectSidebarSlugs(item.items);
    return [];
  });
}

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

function displayPath(file) {
  return relative(root, file).split(sep).join("/");
}
