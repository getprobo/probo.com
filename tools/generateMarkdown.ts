import type { AstroIntegration } from "astro";
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  readdirSync,
  statSync,
  copyFileSync,
  existsSync,
} from "node:fs";
import { join, dirname, relative, basename } from "node:path";
import { fileURLToPath } from "node:url";

function frontmatterValue(content: string, field: string): string {
  const frontmatter = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!frontmatter) return "";
  const value = frontmatter[1].match(
    new RegExp(`^${field}:\\s*["']?(.+?)["']?\\s*$`, "m"),
  );
  return value?.[1] || "";
}

function inlineHtmlToMarkdown(content: string): string {
  return content
    .replace(/[ \t]*\n[ \t]*/g, " ")
    .replace(/<code>([\s\S]*?)<\/code>/g, "`$1`")
    .replace(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g, "[$2]($1)")
    .replace(/<[^>]+>/g, "")
    .replace(/\[\s+(.+?)\s+\]\(/g, "[$1](")
    .trim();
}

/**
 * Convert an MDX file to clean markdown by stripping frontmatter,
 * imports, and Astro/Starlight components.
 */
function mdxToMarkdown(content: string): string {
  let lines = content.split("\n");

  // Extract title from frontmatter
  let title = "";
  if (lines[0]?.trim() === "---") {
    const endIdx = lines.indexOf("---", 1);
    if (endIdx > 0) {
      const frontmatter = lines.slice(1, endIdx).join("\n");
      const titleMatch = frontmatter.match(/^title:\s*["']?(.+?)["']?\s*$/m);
      if (titleMatch) {
        title = titleMatch[1];
      }
      lines = lines.slice(endIdx + 1);
    }
  }

  let md = lines
    // Remove import statements
    .filter((line) => !line.match(/^\s*import\s+/))
    .join("\n");

  md = md.replace(
    /^[ \t]*<LinkCard\b([\s\S]*?)\/>/gm,
    (_, attributes: string) => {
      const getAttribute = (name: string) =>
        attributes.match(new RegExp(`${name}="([^"]+)"`))?.[1] || "";
      const title = getAttribute("title");
      const description = getAttribute("description");
      const href = getAttribute("href");
      if (!title || !href) return "";
      return `- [${title}](${href})${description ? ` — ${description}` : ""}`;
    },
  );

  md = md.replace(
    /^[ \t]*<details className="mcp-tool"[^>]*>([\s\S]*?)<\/details>[ \t]*$/gm,
    (_, tool: string) => {
      const name = tool.match(
        /<span className="mcp-tool__identity">\s*<code>([^<]+)<\/code>/,
      )?.[1];
      const title = tool.match(
        /<span className="mcp-tool__identity">[\s\S]*?<span>([^<]+)<\/span>/,
      )?.[1];
      const description = tool.match(
        /<p className="mcp-tool__description">([\s\S]*?)<\/p>/,
      )?.[1];
      const rows = [
        ...tool.matchAll(
          /<div>\s*<dt>([^<]+)<\/dt>\s*<dd>([\s\S]*?)<\/dd>\s*<\/div>/g,
        ),
      ];

      return [
        `### ${name ? `\`${name}\`` : ""}${title ? ` — ${title}` : ""}`,
        "",
        description ? inlineHtmlToMarkdown(description) : "",
        "",
        ...rows.map(
          ([, label, value]) =>
            `- **${label}:** ${inlineHtmlToMarkdown(value)}`,
        ),
      ].join("\n");
    },
  );
  md = md.replace(
    /^[ \t]*<\/?(?:ol(?: className="mcp-tool-list")?|li)>[ \t]*$/gm,
    "",
  );

  // Remove <CardGrid> / </CardGrid> wrappers
  md = md.replace(/<\/?CardGrid>/g, "");

  // Remove any remaining JSX/HTML-like component tags (self-closing and open/close)
  md = md.replace(/<\/?[A-Z][a-zA-Z]*[^>]*\/?>/g, "");
  md = md.replace(/\{\/\*[\s\S]*?\*\/\}/g, "");

  // Add title as H1
  if (title) {
    md = `# ${title}\n${md}`;
  }

  // Clean up excessive blank lines
  md = md.replace(/\n{3,}/g, "\n\n").trim() + "\n";

  return md;
}

/**
 * Convert a built HTML page to clean markdown by extracting text content
 * from the <main> element and converting HTML structures to markdown.
 */
function htmlToMarkdown(html: string): string {
  // Extract title from <title> tag
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  const rawTitle = titleMatch?.[1]?.replace(/\s*\|\s*Probo$/, "").trim() || "";

  // Extract the main content area — try <main>, then <article>, then <body>
  let content = "";
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/);
  if (mainMatch) {
    content = mainMatch[1];
  } else {
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/);
    content = bodyMatch?.[1] || html;
  }

  // Remove <script> and <style> blocks
  content = content.replace(/<script[\s\S]*?<\/script>/gi, "");
  content = content.replace(/<style[\s\S]*?<\/style>/gi, "");

  // Remove <nav>, <header>, <footer> blocks (navigation, not content)
  content = content.replace(/<nav[\s\S]*?<\/nav>/gi, "");
  content = content.replace(/<footer[\s\S]*?<\/footer>/gi, "");

  // Remove SVG elements
  content = content.replace(/<svg[\s\S]*?<\/svg>/gi, "");

  // Remove image tags
  content = content.replace(/<img[^>]*>/gi, "");
  content = content.replace(/<picture[\s\S]*?<\/picture>/gi, "");

  // Convert headings, preferring aria-label when the visible text is split
  // across animation clones (product heroes) or icon buttons (FAQ triggers).
  content = ["h1", "h2", "h3", "h4"].reduce((html, tag, index) => {
    const hashes = "#".repeat(index + 1);
    const pattern = new RegExp(`<${tag}([^>]*)>([\\s\\S]*?)</${tag}>`, "gi");
    return html.replace(pattern, (_, attrs: string, inner: string) => {
      const label = attrs.match(/aria-label="([^"]*)"/i)?.[1];
      const text = (label || inner)
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      return text ? `\n${hashes} ${text}\n` : "";
    });
  }, content);

  // Convert links
  content = content.replace(
    /<a[^>]+href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi,
    "[$2]($1)",
  );

  // Convert strong/bold
  content = content.replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/gi, "**$2**");

  // Convert em/italic, but drop Phosphor icon <i> tags
  content = content.replace(
    /<(em|i)([^>]*)>([\s\S]*?)<\/\1>/gi,
    (_match, tag: string, attrs: string, inner: string) => {
      if (tag.toLowerCase() === "i" && /class="[^"]*\bph\b/.test(attrs)) {
        return "";
      }
      return inner.trim() ? `*${inner}*` : "";
    },
  );

  // Convert list items
  content = content.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "- $1\n");

  // Remove remaining list wrappers
  content = content.replace(/<\/?(ul|ol)[^>]*>/gi, "\n");

  // Convert paragraphs
  content = content.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, "\n$1\n");

  // Convert <br> to newline
  content = content.replace(/<br\s*\/?>/gi, "\n");

  // Convert table elements
  content = content.replace(/<th[^>]*>([\s\S]*?)<\/th>/gi, "| $1 ");
  content = content.replace(/<td[^>]*>([\s\S]*?)<\/td>/gi, "| $1 ");
  content = content.replace(/<\/tr>/gi, "|\n");
  content = content.replace(/<tr[^>]*>/gi, "");
  content = content.replace(/<\/?(table|thead|tbody)[^>]*>/gi, "\n");

  // Strip all remaining HTML tags
  content = content.replace(/<[^>]+>/g, "");

  // Remove leftover attribute strings (e.g. class="..." that survived tag stripping)
  content = content.replace(/\s*class="[^"]*"/g, "");

  // Decode common HTML entities
  content = content.replace(/&amp;/g, "&");
  content = content.replace(/&lt;/g, "<");
  content = content.replace(/&gt;/g, ">");
  content = content.replace(/&quot;/g, '"');
  content = content.replace(/&#39;/g, "'");
  content = content.replace(/&nbsp;/g, " ");
  content = content.replace(/&mdash;/g, "—");
  content = content.replace(/&ndash;/g, "–");
  content = content.replace(/&rarr;/g, "→");
  content = content.replace(/&ldquo;|&rdquo;/g, '"');
  content = content.replace(/&lsquo;|&rsquo;/g, "'");

  // Add title as H1 if not already present
  if (rawTitle && !content.trim().startsWith("# ")) {
    content = `# ${rawTitle}\n${content}`;
  }

  // Clean up excessive whitespace
  content = content.replace(/[ \t]+/g, " ");
  content = content.replace(/\n /g, "\n");
  content = content.replace(/\n{3,}/g, "\n\n");
  content = content.trim() + "\n";

  return content;
}

/**
 * Recursively find all files matching an extension in a directory.
 */
function findFiles(dir: string, ext: string): string[] {
  const results: string[] = [];
  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      // Skip underscore-prefixed files and directories, matching Astro's
      // convention for partials/templates that are not published pages.
      if (entry.startsWith("_")) continue;
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        results.push(...findFiles(fullPath, ext));
      } else if (entry.endsWith(ext)) {
        results.push(fullPath);
      }
    }
  } catch {
    // Directory doesn't exist, return empty
  }
  return results.sort();
}

/**
 * Astro integration that generates markdown versions of all pages
 * into dist/md/ at build time.
 */
export function generateMarkdown(): AstroIntegration {
  return {
    name: "generate-markdown",
    hooks: {
      "astro:server:setup": ({ server }) => {
        const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
        const docsDir = join(rootDir, "src/content/docs/docs");

        server.middlewares.use((request, response, next) => {
          const pathname = new URL(request.url || "/", "http://localhost")
            .pathname;
          if (
            (pathname !== "/md/docs.md" && !pathname.startsWith("/md/docs/")) ||
            !pathname.endsWith(".md")
          ) {
            next();
            return;
          }

          const relativePath = pathname
            .slice("/md/docs".length, -".md".length)
            .replace(/^\/+/, "");
          const candidates = relativePath
            ? [
                join(docsDir, `${relativePath}.mdx`),
                join(docsDir, relativePath, "index.mdx"),
              ]
            : [join(docsDir, "index.mdx")];
          const sourcePath = candidates.find((candidate) =>
            existsSync(candidate),
          );

          if (!sourcePath) {
            next();
            return;
          }

          response.statusCode = 200;
          response.setHeader("Content-Type", "text/markdown; charset=utf-8");
          response.setHeader("X-Robots-Tag", "noindex, nofollow");
          response.end(mdxToMarkdown(readFileSync(sourcePath, "utf-8")));
        });
      },
      "astro:build:done": async ({ dir }) => {
        const distDir = fileURLToPath(dir);
        const mdDir = join(distDir, "md");
        const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");

        // Process docs MDX files
        const docsDir = join(rootDir, "src/content/docs/docs");
        const docsFiles = findFiles(docsDir, ".mdx");
        const llmsEntries: {
          title: string;
          description: string;
          markdownUrl: string;
          pageUrl: string;
          markdown: string;
        }[] = [];

        for (const file of docsFiles) {
          const relPath = relative(docsDir, file).replace(/\.mdx$/, ".md");
          const outPath = join(mdDir, "docs", relPath);
          const content = readFileSync(file, "utf-8");
          const md = mdxToMarkdown(content);
          const routePath = relPath
            .replace(/\.md$/, "")
            .replace(/(^|\/)index$/, "")
            .replace(/\/$/, "");
          const pageUrl = `https://www.probo.com/docs${routePath ? `/${routePath}` : ""}`;
          const markdownUrl = `https://www.probo.com/md/docs/${relPath}`;

          mkdirSync(dirname(outPath), { recursive: true });
          writeFileSync(outPath, md);
          if (relPath === "index.md" || relPath.endsWith("/index.md")) {
            const routeMarkdownPath = routePath
              ? join(mdDir, "docs", `${routePath}.md`)
              : join(mdDir, "docs.md");
            mkdirSync(dirname(routeMarkdownPath), { recursive: true });
            writeFileSync(routeMarkdownPath, md);
          }
          llmsEntries.push({
            title: frontmatterValue(content, "title"),
            description: frontmatterValue(content, "description"),
            markdownUrl,
            pageUrl,
            markdown: md,
          });
        }

        const sectionOrder = [
          "product/getting-started/",
          "product/",
          "developers/cli/",
          "developers/api/",
          "deployment/self-hosting/",
          "deployment/configuration/",
        ];
        llmsEntries.sort((left, right) => {
          const rank = (url: string) => {
            const path = new URL(url).pathname.replace(/^\/md\/docs\//, "");
            if (path === "index.md") return 0;
            const index = sectionOrder.findIndex((section) =>
              path.startsWith(section),
            );
            return index === -1 ? sectionOrder.length + 1 : index + 1;
          };
          return (
            rank(left.markdownUrl) - rank(right.markdownUrl) ||
            left.markdownUrl.localeCompare(right.markdownUrl)
          );
        });

        const llmsIndex = [
          "# Probo Documentation",
          "",
          "> Documentation for Probo, the open-source compliance management platform.",
          "",
          "## Documentation",
          "",
          ...llmsEntries.map(
            ({ title, description, markdownUrl }) =>
              `- [${title}](${markdownUrl})${description ? `: ${description}` : ""}`,
          ),
          "",
        ].join("\n");
        writeFileSync(join(distDir, "llms-docs.txt"), llmsIndex);

        const llmsFull = [
          "# Probo Documentation",
          "",
          "> Documentation for Probo, the open-source compliance management platform.",
          "",
          ...llmsEntries.flatMap(({ pageUrl, markdown }) => [
            `Source: ${pageUrl}`,
            "",
            markdown.trim(),
            "",
            "---",
            "",
          ]),
        ].join("\n");
        writeFileSync(join(distDir, "llms-full.txt"), llmsFull);

        const blogDir = join(rootDir, "src/content/blog");
        const blogFiles = findFiles(blogDir, ".mdx");
        for (const file of blogFiles) {
          const slug = basename(file, ".mdx");
          const outPath = join(mdDir, "blog", `${slug}.md`);
          const content = readFileSync(file, "utf-8");
          const md = mdxToMarkdown(content);
          mkdirSync(dirname(outPath), { recursive: true });
          writeFileSync(outPath, md);
        }

        const storiesDir = join(rootDir, "src/content/stories");
        const storyFiles = findFiles(storiesDir, ".mdx");
        for (const file of storyFiles) {
          const slug = basename(file, ".mdx");
          const outPath = join(mdDir, "stories", `${slug}.md`);
          const content = readFileSync(file, "utf-8");
          const md = mdxToMarkdown(content);
          mkdirSync(dirname(outPath), { recursive: true });
          writeFileSync(outPath, md);
        }

        // Convert remaining built HTML pages (product pages, hub, etc.)
        // without replacing markdown already produced from MDX.
        const htmlPages = findFiles(distDir, ".html");
        for (const file of htmlPages) {
          const relPath = relative(distDir, file);
          if (
            relPath === "404.html" ||
            relPath.endsWith("/404.html") ||
            relPath.startsWith("md/")
          ) {
            continue;
          }

          const outPath = join(mdDir, relPath.replace(/\.html$/, ".md"));
          if (existsSync(outPath)) {
            continue;
          }

          const md = htmlToMarkdown(readFileSync(file, "utf-8"));
          mkdirSync(dirname(outPath), { recursive: true });
          writeFileSync(outPath, md);
        }

        // Copy hand-written marketing page markdowns
        const marketingDir = join(rootDir, "src/content/markdown");
        try {
          const marketingFiles = findFiles(marketingDir, ".md");
          for (const file of marketingFiles) {
            const relPath = relative(marketingDir, file);
            const outPath = join(mdDir, relPath);
            mkdirSync(dirname(outPath), { recursive: true });
            copyFileSync(file, outPath);
          }
        } catch {
          // No marketing markdown directory yet
        }

        console.log(`[generate-markdown] Generated markdown files in ${mdDir}`);
      },
    },
  };
}
