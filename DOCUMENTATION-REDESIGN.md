# Documentation interface

The documentation uses the existing Probo brand and Geist typography, with a neutral reading palette and responsive navigation across Docs, Developers, and Deployment.

## Navigation and reading

- A single header links the Probo logo to the marketing site and the contextual space label to `/docs`. Search is centered, with theme and contact controls alongside it.
- The left sidebar groups pages into collapsible sections. Only the current page has a persistent background. Every row has an icon; subsection icons are quieter than section icons, and the current icon is emphasized.
- Expanded groups have a thin vertical guide aligned with the parent icon and a consistent 24 px indent at every depth. A darker segment on the nearest guide marks the current page in both themes.
- Space links remain at the bottom of the sidebar. The global documentation home shows the entry paths without a contextual page list.
- The table of contents follows the visible article sections, including headings inside tabs. Its marker moves for pointer interactions and updates immediately for keyboard navigation.
- Articles change without a page fade. Menu, disclosure, search, and copy feedback preserve keyboard access and respect reduced motion.
- Tables and code scroll locally when necessary. Code tabs sit 8 px above their code panel, and successful code-copy feedback uses a white background.
- Neutral code and Mermaid surfaces work in both themes. Print, forced colors, long headings, small viewports, and unavailable browser storage have dedicated handling.

## Content and upstream integration

Existing routes, Markdown exports, search indexing, canonical metadata, structured data, and the LLM index remain available. The initial redesign adds task-oriented entry pages and Cloud/first-risk guides. Subsequent interface refinements preserve the article content.

The branch incorporates `v2` through `f8328ef`. Recent upstream connector guides, generated references, visitor/NDA instructions, risk walkthrough, search suggestions, breadcrumbs, and next/previous links are retained. Legacy risk-section anchors remain available alongside the updated walkthrough.

## Local preview

Use Node.js 24:

```sh
npm ci
npm run check:docs
npm run build
npm run preview:cloudflare
```

Open `http://127.0.0.1:4330/docs`. The Cloudflare preview also serves Markdown routes and applies the response headers used by documentation search.

## Validation

```sh
PROBO_REPO_PATH=/path/to/probo npm run docs:check-reference
node tools/check-docs-preservation.mjs --base origin/v2 --dist dist
```

The preservation checker reports source changes, missing routes, anchors, assets, internal links, Markdown exports, canonical metadata, structured data, and sitemap entries. Editorial changes are reported for review rather than silently accepted.

Browser verification covers desktop and mobile navigation, the search dialog and results, themes, tab switching, section links, table scrolling, and copy feedback. It does not validate product operations inside an authenticated Probo organization.
