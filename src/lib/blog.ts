import type { CollectionEntry } from "astro:content";

export const blogCategories = [
  "Compliance",
  "Engineering",
  "Perspectives",
] as const;
export type BlogCategory = (typeof blogCategories)[number];
export const blogDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});
export const postHref = (id: string) => `/blog/${id.split("/").at(-1)}`;
export const categoryHref = (category?: BlogCategory, page = 1) => {
  const base = category ? `/blog/category/${category.toLowerCase()}` : "/blog";
  return page === 1 ? base : `${base}/page/${page}`;
};
export const newestFirst = (
  a: CollectionEntry<"blog">,
  b: CollectionEntry<"blog">,
) => b.data.date.valueOf() - a.data.date.valueOf();
export const readingMinutes = (body = "") =>
  Math.max(
    1,
    Math.ceil(body.replace(/```[\s\S]*?```/g, "").split(/\s+/).length / 220),
  );
