import type { StarlightRouteData } from "@astrojs/starlight/route-data";
import { docsSidebarGroups } from "./docs-sidebar.ts";
import type { IconName } from "../components/Icon.astro";

const sidebarIcons: Record<string, IconName> = {
  "Get started": "compass",
  "Getting started": "compass",
  "Product overview": "book-open-text",
  "Choose a deployment": "terminal-window",
  Quickstart: "sparkle",
  "First steps with Probo Cloud": "compass",
  "First organization and framework": "briefcase",
  "Core concepts": "files",
  Glossary: "article",
  "Manage compliance": "shield-check",
  "Use Probo": "book-open-text",
  "Compliance program": "shield-check",
  Tasks: "list-checks",
  "Risk management": "shield-warning",
  "Third-party management": "handshake",
  "Privacy management": "fingerprint",
  "Audits and findings": "list-checks",
  "Document management": "files",
  "Assets and obligations": "briefcase",
  "Workspace and access": "users-three",
  "Access reviews": "list-checks",
  "Share your compliance": "handshake",
  "Cookie consent": "cookie",
  "Device security": "monitor",
  "API fundamentals": "book-open-text",
  "GraphQL API": "graph",
  CLI: "terminal-window",
  MCP: "sparkle",
  n8n: "flow-arrow",
  Webhooks: "broadcast",
  "Device agent": "monitor",
  Cloud: "cloud",
  "Self-hosting": "terminal-window",
  Configuration: "sliders-horizontal",
  SSO: "key",
  SCIM: "users-three",
  Connectors: "plugs-connected",
  Overview: "book-open-text",
  "Record and review a risk": "shield-warning",
  "Roles and permissions": "key",
  "Audit log": "clock-counter-clockwise",
  Authentication: "key",
  Autocomplete: "terminal-window",
  "Command reference": "terminal-window",
  "Tool reference": "sliders-horizontal",
  "Resource reference": "files",
  Integrations: "plugs-connected",
  Installation: "terminal-window",
  Install: "terminal-window",
  Security: "shield-check",
  "Infrastructure security": "shield-check",
  "Credential security": "key",
  "Run a campaign": "list-checks",
  "CSV sources": "files",
  "Content management": "files",
  Branding: "paint-brush",
  "Visitor access and NDA": "key",
  "Rights requests": "fingerprint",
  "Multiple portals": "files",
  "Permissions and integrations": "plugs-connected",
  "JavaScript SDK": "code",
  "React Integration": "code",
  "Consent Manager API": "code",
  Theming: "paint-brush",
  "Docker Compose": "terminal-window",
  Kubernetes: "cloud",
  "Config file": "sliders-horizontal",
  "Configuration file": "sliders-horizontal",
  "Environment variables": "sliders-horizontal",
};

export function getDocsSidebarIcon(label: string): IconName {
  return sidebarIcons[label] ?? "article";
}

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
    label: "Docs",
    href: "/docs",
    match: {
      exact: ["/docs"],
    },
  },
  {
    id: "product",
    label: "Docs",
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
