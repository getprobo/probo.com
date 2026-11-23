import type { CollectionEntry } from "astro:content";

/** Pinned to the front of listing / homepage slider, in order. */
const PINNED_STORY_IDS = [
  "ahrefs-iso",
  "normal-computing-soc2",
  "blaxel-soc2",
] as const;

function pinnedRank(id: string): number {
  const index = PINNED_STORY_IDS.indexOf(
    id as (typeof PINNED_STORY_IDS)[number],
  );
  return index === -1 ? PINNED_STORY_IDS.length : index;
}

export function sortStoriesForListing(
  entries: CollectionEntry<"stories">[],
): CollectionEntry<"stories">[] {
  return [...entries].sort((a, b) => {
    const rankDiff = pinnedRank(a.id) - pinnedRank(b.id);
    if (rankDiff !== 0) return rankDiff;
    return b.data.date.valueOf() - a.data.date.valueOf();
  });
}
