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
    label: "Use Probo",
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
    label: "Deploy Probo",
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
