import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { frameworks } from "./content/frameworks.ts";
import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";

export const pageSize = 10;

const nonEmptyAlt = z
  .string()
  .trim()
  .min(1, "Image alt text is required and cannot be empty");

const blog = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/blog" }),
  schema: z
    .object({
      title: z.string(),
      date: z.date(),
      dateModified: z.date().optional(),
      /** Meta description / preview excerpt; keep 120-160 chars for SEO. */
      excerpt: z.string().min(120),
      author: z.object({
        name: z.string(),
      }),
      ogImage: z.string().optional(),
      /** Optional hero image shown next to the title. Requires titleImageAlt. */
      titleImage: z.string().optional(),
      titleImageAlt: nonEmptyAlt.optional(),
      faqs: z
        .array(
          z.object({
            question: z.string(),
            answer: z.string(),
          }),
        )
        .optional(),
    })
    .refine((data) => !data.titleImage || Boolean(data.titleImageAlt), {
      message: "titleImageAlt is required when titleImage is set",
      path: ["titleImageAlt"],
    }),
});

const stories = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/stories" }),
  schema: z.object({
    title: z.string(),
    /** Meta description; keep 120+ chars for SEO when set. */
    description: z.string().min(120).optional(),
    date: z.date(),
    impacts: z
      .array(
        z.object({
          title: z.string(),
          label: z.string(),
        }),
      )
      .min(1),
    image: z.string(),
    imageAlt: nonEmptyAlt,
    previewImage: z.string().optional(),
    /** Public URL for a muted looping card trailer (e.g. /stories/trailers/foo.mp4) */
    trailer: z.string().optional(),
    /** Public URL for the trailer poster; defaults to the trailer URL with a .webp extension */
    trailerPoster: z.string().optional(),
    ogImage: z.string().optional(),
    framework: z.enum(frameworks.map((f) => f.label) as any),
    logo: z.string(),
    /** Hero logo height in px (story page + cards); default 23 */
    logoHeight: z.number().optional(),
    /** Logo asset for light UI (e.g. story cards); falls back to `logo` */
    logoLightBg: z.string().optional(),
    invertLogo: z.boolean().optional().default(true),
    /** Floating logo placement on story cards; default bottom-left */
    logoPosition: z.enum(["top-left", "bottom-left"]).optional(),
    company: z.object({
      name: z.string(),
      url: z.string().url().optional(),
      industry: z.string(),
      type: z.string(),
      about: z.string(),
    }),
  }),
});

const hub = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/hub" }),
  schema: z.object({
    title: z.string(),
    /** Word/phrase within `title` to highlight in the article <h1> */
    highlight: z.string().optional(),
    /** Small pill shown under the <h1> (e.g. "The Complete SOC 2 Guide for 2026") */
    eyebrow: z.string().optional(),
    /** Meta description; keep 120+ chars for SEO. */
    description: z.string().min(120),
    /** Card label on the hub index (e.g. "Guide", "Comparison", "Checklist") */
    tag: z.string().default("Guide"),
    /** Which hub index section the card appears in */
    section: z.enum(["articles", "tool-recommendation"]).default("articles"),
    /** Tailwind gradient classes for the card accent */
    accentColor: z.string().default("from-emerald-400 to-teal-500"),
    /** FrameworkBadge names rendered next to the <h1> */
    badges: z.array(z.string()).default([]),
    date: z.date(),
    dateModified: z.date().optional(),
    ogImage: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const changelog = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/changelog" }),
  schema: z.object({
    title: z.string(),
    /** Meta description; keep 120+ chars for SEO. */
    description: z.string().min(120),
    date: z.date(),
    image: z.string().optional(),
    images: z.array(z.string()).optional(),
    imagesLayout: z.enum(["stacked", "logos"]).default("stacked"),
    tags: z
      .array(
        z.enum([
          "TPRM",
          "Risk Management",
          "Governance",
          "Privacy",
          "Audits",
          "Documents",
          "Assets",
          "IAM",
          "Access Review",
          "Cookie Banner",
          "Compliance Portal",
          "Devices",
          "Internationalization",
          "Integrations",
          "Infra",
          "Console",
        ]),
      )
      .default([]),
  }),
});

const jobs = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/jobs" }),
  schema: z.object({
    title: z.string(),
    location: z.string(),
    type: z.string(),
    description: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const wall = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/wall" }),
  schema: z.object({
    /** Display name shown on the card (company or person). */
    company: z.string(),
    /** Person who authored the post; rendered as the overlapping avatar. */
    author: z.string().optional(),
    /** Follower count shown under the name (e.g. 23096 -> "23,096 followers"). */
    followers: z.number().optional(),
    /** Logo asset filename in src/assets/wall (e.g. "acme-logo.svg"). */
    logo: z.string(),
    /** Optional avatar asset filename in src/assets/wall. */
    avatar: z.string().optional(),
    /** Framework badge to display (must match a label in frameworks.ts). */
    framework: z.enum(frameworks.map((f) => f.label) as any).optional(),
    /** The post text. Line breaks are preserved. */
    post: z.string(),
    /** Optional English translation, shown via the language toggle. */
    translatedPost: z.string().optional(),
    /** Original language code shown on the toggle pill (e.g. "FR"). */
    originalLang: z.string().optional(),
    /** Optional attached image/thumbnail asset filename in src/assets/wall. */
    thumbnail: z.string().optional(),
    likes: z.number().optional(),
    comments: z.number().optional(),
    /** Link to the original LinkedIn post. */
    postUrl: z.string().url().optional(),
    date: z.date().optional(),
    /** Manual ordering; lower shows first. Falls back to followers desc. */
    order: z.number().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const docs = defineCollection({
  loader: docsLoader(),
  schema: docsSchema({
    extend: z.object({
      /** Meta description; keep 120+ chars for SEO. */
      description: z.string().min(120),
      badge: z
        .union([
          z.string(),
          z.object({
            text: z.string(),
            variant: z
              .enum(["note", "danger", "success", "caution", "tip", "default"])
              .default("default"),
            class: z.string().optional(),
          }),
        ])
        .transform((badge) => {
          if (typeof badge === "string") {
            return { variant: "default" as const, text: badge };
          }
          return badge;
        })
        .optional(),
    }),
  }),
});

export const collections = { blog, stories, docs, changelog, jobs, hub, wall };
