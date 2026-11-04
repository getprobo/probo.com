import { execFileSync } from "node:child_process";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Shows "Last updated" on docs pages and exposes the same dates for sitemap
 * `<lastmod>`. Dates come from the pages Starlight rendered, so the sitemap
 * never disagrees with the page and never gets a build date.
 */
export function starlightDocsLastModified() {
  /** @type {Map<string, string>} */
  const dates = new Map();
  let enabled = false;
  let collected = false;
  let warned = false;

  /** @type {import("@astrojs/starlight/types").StarlightPlugin} */
  const plugin = {
    name: "docs-last-modified",
    hooks: {
      "config:setup"({ updateConfig, addIntegration, logger }) {
        // A shallow clone dates every page to its newest commit.
        enabled = isCompleteGitHistory();
        if (!enabled) {
          logger.warn(
            "Git history is shallow or missing; docs last-updated dates are disabled.",
          );
          return;
        }

        updateConfig({ lastUpdated: true });
        // Starlight inserts plugin integrations right after itself, so the
        // dates are collected before integrations listed later, like sitemap().
        addIntegration({
          name: "docs-last-modified",
          hooks: {
            "astro:build:done": async ({ dir }) => {
              dates.clear();
              for (const [url, date] of await collectDates(
                fileURLToPath(dir),
              )) {
                dates.set(url, date);
              }
              collected = true;
            },
          },
        });
      },
    },
  };

  return {
    plugin,
    /** @param {string} url */
    get(url) {
      if (enabled && !collected && !warned) {
        warned = true;
        console.warn(
          "[docs-last-modified] Dates requested before collection; list sitemap() after starlight().",
        );
      }
      return dates.get(url);
    },
  };
}

function isCompleteGitHistory() {
  try {
    return (
      execFileSync("git", ["rev-parse", "--is-shallow-repository"], {
        cwd: fileURLToPath(new URL("..", import.meta.url)),
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      }).trim() === "false"
    );
  } catch {
    return false;
  }
}

/** @param {string} output */
async function collectDates(output) {
  /** @type {Map<string, string>} */
  const dates = new Map();
  const files = [
    join(output, "docs.html"),
    ...(await htmlFiles(join(output, "docs"))),
  ];
  for (const file of files) {
    let html;
    try {
      html = await readFile(file, "utf8");
    } catch (error) {
      if (/** @type {NodeJS.ErrnoException} */ (error).code === "ENOENT")
        continue;
      throw error;
    }
    for (const [, json] of html.matchAll(
      /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
    )) {
      const schema = JSON.parse(json);
      if (
        ["TechArticle", "WebPage"].includes(schema["@type"]) &&
        schema.url?.startsWith("https://www.probo.com/docs") &&
        schema.dateModified &&
        !Number.isNaN(Date.parse(schema.dateModified))
      ) {
        dates.set(schema.url, schema.dateModified);
      }
    }
  }
  return dates;
}

/**
 * @param {string} directory
 * @returns {Promise<string[]>}
 */
async function htmlFiles(directory) {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (/** @type {NodeJS.ErrnoException} */ (error).code === "ENOENT")
      return [];
    throw error;
  }
  return (
    await Promise.all(
      entries.map((entry) => {
        const path = join(directory, entry.name);
        return entry.isDirectory()
          ? htmlFiles(path)
          : entry.name.endsWith(".html")
            ? [path]
            : [];
      }),
    )
  ).flat();
}
