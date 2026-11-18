# AGENTS.md

Guidelines for AI coding assistants working on the probo.com marketing website and documentation portal.

## Project Overview

This is the marketing website and documentation portal for [Probo](https://www.probo.com), an open-source compliance management platform. The site is built with Astro, Svelte, and Tailwind CSS, deployed on Cloudflare Pages.

## Tech Stack

| Technology       | Purpose                                           |
| ---------------- | ------------------------------------------------- |
| Astro 5          | Meta-framework for static/dynamic site generation |
| Svelte 5         | Interactive components with runes syntax          |
| TypeScript       | Type safety throughout                            |
| Tailwind CSS 4   | Utility-first styling                             |
| Starlight        | Documentation theme                               |
| MDX              | Content authoring                                 |
| Cloudflare Pages | Hosting and edge functions                        |

## Commands

```bash
# Development
npm run dev          # Start dev server at http://localhost:4321
npm run build        # Production build to dist/
npm run preview      # Preview production build

# Formatting
make format          # Format all files with Prettier
npm run format       # Alternative formatting command

# Deployment
npm run deploy       # Build and deploy to Cloudflare Pages
```

## Project Structure

```
src/
├── pages/           # Astro pages (file-based routing)
├── components/      # Reusable components
│   ├── block/       # Section components (Hero, Logos, etc.)
│   ├── ui/          # Atomic UI components
│   └── docs/        # Starlight overrides
├── content/         # Content collections
│   ├── blog/        # Blog posts (MDX)
│   ├── stories/     # Customer stories (MDX with schema)
│   └── docs/        # Documentation (Starlight)
├── layouts/         # Page layouts
├── lib/             # Utilities and helpers
│   └── runes/       # Svelte runes (hooks)
└── styles/          # Global CSS

tools/               # Build scripts
functions/           # Cloudflare Workers
public/              # Static assets
```

## Key Patterns

### Astro Pages

Pages use frontmatter for metadata and import components:

```astro
---
import Layout from "@/layouts/Layout.astro";
import Hero from "@/components/block/Hero.astro";
const { currentLocale } = Astro;
---

<Layout title="Page Title">
  <Hero />
</Layout>
```

### Svelte Components

Use Svelte 5 runes syntax for reactivity:

```svelte
<script lang="ts">
  interface Props {
    title: string;
    variant?: "primary" | "secondary";
  }

  let { title, variant = "primary" }: Props = $props();
  let count = $state(0);
</script>
```

### Content Collections

Blog and stories use MDX with Zod schemas for validation. Stories require:

- `title`, `date`, `impacts[]`, `image`, `framework`, `logo`, `company{}`

### Styling

Read [DESIGN.md](DESIGN.md) before any visual change: it documents the colours, type scale, components and guardrails of the site. Theme tokens live in `src/styles/theme.css`.

Use Tailwind utilities. For complex variants, use `tailwind-variants`:

```typescript
import { tv } from "tailwind-variants";

const button = tv({
  base: "px-4 py-2 rounded",
  variants: {
    color: {
      primary: "bg-blue-500",
      secondary: "bg-gray-500",
    },
  },
});
```

## Content Locations

| Content Type     | Location               | Format          |
| ---------------- | ---------------------- | --------------- |
| Blog posts       | `src/content/blog/`    | MDX             |
| Customer stories | `src/content/stories/` | MDX with schema |
| Documentation    | `src/content/docs/`    | MDX (Starlight) |
| Framework data   | `public/frameworks/`   | JSON            |

## Important Notes

1. **No test framework** - Focus on build verification and manual testing
2. **Format before commit** - Run `make format` before pushing
3. **Auto-deploy** - Commits to `v2` branch auto-deploy to Cloudflare Pages
4. **Strict TypeScript** - Use proper typing; Zod for runtime validation
5. **Content-first** - Most changes are content (MDX), not component code

## Don't

- Don't add unnecessary abstractions or over-engineer solutions
- Don't create new components when existing ones suffice
- Don't skip formatting before commits
- Don't add comments or docstrings unless the logic is non-obvious
- Don't add features beyond what's requested

## Do

- Do check existing components before creating new ones
- Do use Tailwind utilities for styling
- Do run `npm run build` to verify changes compile
- Do keep solutions simple and focused
