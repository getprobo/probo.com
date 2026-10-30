import type { StarlightRouteData } from "@astrojs/starlight/route-data";
import { docsSidebarGroups } from "./docs-sidebar.ts";

export type DocsSectionId =
  "overview" | "product" | "developers" | "deployment";

export type DocsSection = {
  id: DocsSectionId;
  label: string;
  href: string;
  match?: {
    exact?: readonly string[];
    prefixes?: readonly string[];
  };
  fallback?: boolean;
};

export const docsSections: readonly DocsSection[] = [
  {
    id: "overview",
    label: "Get started",
    href: "/docs",
    match: {
      exact: ["/docs"],
      prefixes: ["/docs/product/getting-started"],
    },
  },
  {
    id: "product",
    label: "Product",
    href: "/docs/product",
    match: {
      prefixes: ["/docs/product"],
    },
    fallback: true,
  },
  {
    id: "developers",
    label: "Developers",
    href: "/docs/developers",
    match: {
      prefixes: ["/docs/developers"],
    },
  },
  {
    id: "deployment",
    label: "Deployment",
    href: "/docs/deployment",
    match: {
      prefixes: ["/docs/deployment"],
    },
  },
] as const;

export function normalizeDocsPath(pathname: string): string {
  return pathname.replace(/\.html$/, "").replace(/\/+$/, "") || "/";
}

export function getDocsSectionForPath(pathname: string): DocsSectionId {
  const path = normalizeDocsPath(pathname);
  const section = docsSections.find(
    ({ match }) =>
      match?.exact?.includes(path) ||
      match?.prefixes?.some(
        (prefix) => path === prefix || path.startsWith(`${prefix}/`),
      ),
  );
  const fallback = docsSections.find(({ fallback }) => fallback);

  if (!section && !fallback) {
    throw new Error("A fallback documentation section must be configured.");
  }

  return (section ?? fallback)!.id;
}

export function getDocsSection(id: DocsSectionId): DocsSection {
  const section = docsSections.find((entry) => entry.id === id);
  if (!section) {
    throw new Error(`Unknown docs section: ${id}`);
  }
  return section;
}

export function getSidebarGroupsForSection<Entry extends { type: string }>(
  sidebar: Entry[],
  sectionId: DocsSectionId,
): Array<{
  group: Extract<Entry, { type: "group" }>;
  showHeading: boolean;
}> {
  if (sidebar.length !== docsSidebarGroups.length) {
    throw new Error(
      "The resolved Starlight sidebar does not match its configuration.",
    );
  }

  return docsSidebarGroups.flatMap((definition, index) => {
    const group = sidebar[index];
    if (!group || group.type !== "group") {
      throw new Error(`Sidebar entry "${definition.id}" is not a group.`);
    }

    if (definition.sectionId !== sectionId) return [];

    return [
      {
        group: group as Extract<Entry, { type: "group" }>,
        showHeading:
          !("showHeading" in definition) || definition.showHeading !== false,
      },
    ];
  });
}

export type DocsBreadcrumb = {
  label: string;
  href?: string;
};

type SidebarEntry = StarlightRouteData["sidebar"][number];

export function getDocsBreadcrumbs(
  pathname: string,
  sidebar: SidebarEntry[],
  title: string,
): DocsBreadcrumb[] {
  const path = normalizeDocsPath(pathname);
  if (path === "/docs") return [{ label: title }];

  function firstHref(entries: SidebarEntry[]): string | undefined {
    for (const entry of entries) {
      if (entry.type === "link") return entry.href;
      const href = firstHref(entry.entries);
      if (href) return href;
    }
  }

  function findCurrent(
    entries: SidebarEntry[],
    parents: DocsBreadcrumb[] = [],
  ): DocsBreadcrumb[] | undefined {
    for (const entry of entries) {
      if (entry.type === "link" && entry.isCurrent) return parents;
      if (entry.type === "group") {
        const result = findCurrent(entry.entries, [
          ...parents,
          { label: entry.label, href: firstHref(entry.entries) },
        ]);
        if (result) return result;
      }
    }
  }

  const section = getDocsSection(getDocsSectionForPath(path));
  const seen = new Set([path]);
  const parents = [
    { label: "Documentation home", href: "/docs" },
    { label: section.label, href: section.href },
    ...(findCurrent(sidebar) ?? []),
  ].filter((crumb) => {
    if (!crumb.href) return false;
    const href = normalizeDocsPath(crumb.href);
    if (seen.has(href)) return false;
    seen.add(href);
    return true;
  });

  return [
    ...parents.map((crumb) => ({
      label: crumb.label,
      href: normalizeDocsPath(crumb.href!),
    })),
    { label: title },
  ];
}
