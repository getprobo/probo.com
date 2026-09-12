import type { AstroIntegration } from "astro";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Astro integration that generates a RFC 9116 security.txt file at build
 * time, so the Expires field always reflects the current deploy rather
 * than going stale in a hand-maintained static file.
 */
export function generateSecurityTxt(): AstroIntegration {
  return {
    name: "generate-security-txt",
    hooks: {
      "astro:build:done": async ({ dir }) => {
        const distDir = fileURLToPath(dir);
        const wellKnownDir = join(distDir, ".well-known");

        const expires = new Date();
        expires.setUTCFullYear(expires.getUTCFullYear() + 1);

        const content = [
          "Contact: mailto:security@probo.com",
          `Expires: ${expires.toISOString().replace(/\.\d+Z$/, "Z")}`,
          "Policy: https://www.probo.com/docs/deployment/infrastructure-security",
          "Preferred-Languages: en",
          "Hiring: https://www.probo.com/careers",
          "Canonical: https://www.probo.com/.well-known/security.txt",
          "",
        ].join("\n");

        mkdirSync(wellKnownDir, { recursive: true });
        writeFileSync(join(wellKnownDir, "security.txt"), content);

        console.log(
          `[generate-security-txt] Generated security.txt (expires ${expires.toISOString()})`,
        );
      },
    },
  };
}
