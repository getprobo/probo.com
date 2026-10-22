import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// Reuse the source-derived date rendered by Starlight; never stamp a build date.
export function documentationLastModified() {
  const dates = new Map();
  let hasCompleteHistory = false;
  try {
    hasCompleteHistory =
      execFileSync("git", ["rev-parse", "--is-shallow-repository"], {
        cwd: fileURLToPath(new URL("..", import.meta.url)),
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      }).trim() === "false";
  } catch {
    // Without history, explicit frontmatter dates remain the only reliable source.
  }
  return {
    dates,
    hasCompleteHistory,
    integration: {
      name: "documentation-last-modified",
      hooks: {
        "astro:build:done": async ({ dir }) => {
          dates.clear();
          const output = fileURLToPath(dir);
          const files = [
            join(output, "docs.html"),
            ...(await htmlFiles(join(output, "docs"))),
          ];
          for (const file of files) {
            let html;
            try {
              html = await readFile(file, "utf8");
            } catch (error) {
              if (error.code === "ENOENT") continue;
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
        },
      },
    },
  };
}

async function htmlFiles(directory) {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") return [];
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
import { execFileSync } from "node:child_process";
