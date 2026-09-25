// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import svelte from "@astrojs/svelte";
import starlight from "@astrojs/starlight";
import sitemap from "@astrojs/sitemap";
import { removeHtmlExtension } from "./vite-plugin-remove-html.mjs";
import { docsSidebar } from "./src/lib/docs-sidebar.ts";
import { redirects } from "./src/lib/redirects.mjs";
import { generateMarkdown } from "./tools/generateMarkdown";
import { generateSecurityTxt } from "./tools/generateSecurityTxt";
import { unified } from "@astrojs/markdown-remark";
import { remarkRequireImageAlt } from "./src/lib/remark-require-image-alt";

const sitemapExcludedPaths = new Set(
  Object.keys(redirects)
    .filter((from) => !from.includes("*") && !from.includes("["))
    .map((from) => from.replace(/\/+$/, "") || "/"),
);

/** @param {string} url */
function sitemapSection(url) {
  return new URL(url).pathname.split("/")[1];
}

// Post-enforce fallback: when vite-plugin-svelte cannot resolve a Svelte
// virtual CSS module (e.g. during dev re-optimization), return empty CSS so
// @tailwindcss/vite does not receive the raw .svelte source and crash.
function svelteVirtualCssFallback() {
  const filter = /[?&]svelte&type=style&lang\.css$/;
  /** @param {string} id */
  const load = (id) => {
    if (filter.test(id)) return "";
  };
  return {
    name: "svelte-virtual-css-fallback",
    enforce: "post",
    load,
  };
}

// https://astro.build/config
export default defineConfig({
  site: "https://www.probo.com",
  compressHTML: true,
  prefetch: false,
  trailingSlash: "never",
  build: {
    format: "file",
  },
  vite: {
    optimizeDeps: {
      include: ["lottie-web"],
      exclude: ["svelte-sonner"],
    },
    build: {
      rollupOptions: {
        output: {
          /** @param {string} id */
          manualChunks(id) {
            if (
              id.includes("node_modules/svelte") ||
              id.includes("lib/runes") ||
              id.includes("node_modules/runed")
            ) {
              return "svelte";
            }

            if (id.includes("@splide")) {
              return "splide";
            }

            return null;
          },
        },
      },
    },
    plugins: [svelteVirtualCssFallback(), tailwindcss()],
  },

  markdown: {
    processor: unified({
      remarkPlugins: [remarkRequireImageAlt],
    }),
  },

  integrations: [
    removeHtmlExtension(),
    starlight({
      components: {
        ContentPanel: "./src/components/docs/ContentPanel.astro",
        Footer: "./src/components/docs/Footer.astro",
        Head: "./src/components/docs/Head.astro",
        Footer: "./src/components/docs/Footer.astro",
        PageFrame: "./src/components/docs/PageFrame.astro",
        PageTitle: "./src/components/docs/PageTitle.astro",
        Search: "./src/components/docs/Search.astro",
        ThemeSelect: "./src/components/docs/ThemeToggle.astro",
        MobileMenuToggle: "./src/components/docs/MobileMenuToggle.astro",
        Sidebar: "./src/components/docs/Sidebar.astro",
        TwoColumnContent: "./src/components/docs/TwoColumnContent.astro",
        PageSidebar: "./src/components/docs/PageSidebar.astro",
      },
      disable404Route: true,
      title: "Probo Docs",
      favicon: "/favicon-192.png",
      logo: {
        replacesTitle: true,
        src: "./src/assets/probo-logo.svg",
        alt: "Probo Logo",
      },
      defaultLocale: "root",
      customCss: ["./src/styles/starlight.css"],
      lastUpdated: true,
      pagination: false,
      editLink: {
        baseUrl: "https://github.com/getprobo/probo.com/edit/v2/",
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/getprobo/probo",
        },
        {
          icon: "discord",
          label: "Discord",
          href: "https://discord.com/invite/8qfdJYfvpY",
        },
      ],
      sidebar: docsSidebar,
    }),
    generateMarkdown(),
    generateSecurityTxt(),
    mdx(),
    svelte(),
    sitemap({
      chunks: {
        docs: (item) =>
          sitemapSection(item.url) === "docs" ? item : undefined,
        changelog: (item) =>
          sitemapSection(item.url) === "changelog" ? item : undefined,
        blog: (item) =>
          ["blog", "hub", "stories"].includes(sitemapSection(item.url))
            ? item
            : undefined,
      },
      filter(page) {
        const path = new URL(page).pathname.replace(/\/+$/, "") || "/";
        if (
          path === "/md" ||
          path.startsWith("/md/") ||
          path.endsWith(".md") ||
          sitemapExcludedPaths.has(path)
        ) {
          return false;
        }
        if (page.endsWith("/yc") || page.endsWith("/yc/")) {
          return false;
        }
        if (page.includes("/404")) {
          return false;
        }
        if (page.includes("/whats-next")) {
          return false;
        }
        if (page.includes("/feedback")) {
          return false;
        }
        if (page.includes("/welcome")) {
          return false;
        }
        if (page.includes("/static")) {
          return false;
        }
        if (page.includes("/orderform")) {
          return false;
        }
        if (page.includes("/blog/page/1")) {
          return false;
        }
        return true;
      },
      serialize(item) {
        item.url = item.url.replace(/\/+$/, "") || item.url;
        if (item.url === "https://www.probo.com") {
          item.changefreq = /** @type {import('sitemap').EnumChangefreq} */ (
            "weekly"
          );
          item.priority = 1.0;
        } else if (item.url === "https://www.probo.com/docs") {
          item.changefreq = /** @type {import('sitemap').EnumChangefreq} */ (
            "weekly"
          );
          item.priority = 0.9;
        } else if (item.url.includes("/products/")) {
          item.changefreq = /** @type {import('sitemap').EnumChangefreq} */ (
            "weekly"
          );
          item.priority = 0.8;
        } else if (item.url.includes("/blog/")) {
          item.changefreq = /** @type {import('sitemap').EnumChangefreq} */ (
            "weekly"
          );
          item.priority = 0.8;
        } else if (item.url.includes("/hub")) {
          item.changefreq = /** @type {import('sitemap').EnumChangefreq} */ (
            "weekly"
          );
          item.priority = 0.8;
        } else if (
          item.url.includes("/docs/deployment/configuration") ||
          item.url.includes("/docs/deployment/self-hosting")
        ) {
          item.changefreq = /** @type {import('sitemap').EnumChangefreq} */ (
            "monthly"
          );
          item.priority = 0.8;
        } else if (item.url.includes("/docs")) {
          item.changefreq = /** @type {import('sitemap').EnumChangefreq} */ (
            "monthly"
          );
          item.priority = 0.7;
        } else if (item.url.includes("/changelog")) {
          item.changefreq = /** @type {import('sitemap').EnumChangefreq} */ (
            "weekly"
          );
          item.priority = 0.7;
        } else if (item.url.includes("/stories")) {
          item.changefreq = /** @type {import('sitemap').EnumChangefreq} */ (
            "monthly"
          );
          item.priority = 0.7;
        } else if (item.url.includes("/about")) {
          item.changefreq = /** @type {import('sitemap').EnumChangefreq} */ (
            "monthly"
          );
          item.priority = 0.6;
        } else if (
          item.url.includes("/privacy") ||
          item.url.includes("/terms") ||
          item.url.includes("/cookie-policy") ||
          item.url.includes("/subprocessors")
        ) {
          item.changefreq = /** @type {import('sitemap').EnumChangefreq} */ (
            "yearly"
          );
          item.priority = 0.3;
        } else {
          item.changefreq = /** @type {import('sitemap').EnumChangefreq} */ (
            "monthly"
          );
          item.priority = 0.5;
        }

        return item;
      },
    }),
  ],
});
