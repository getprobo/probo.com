import {
  cliCommandItems,
  mcpCategoryItems,
  n8nResourceItems,
} from "./generated-reference-manifest.mjs";
import type { IconName } from "../components/Icon.astro";

type SidebarItem<Extra> = { label: string } & Extra &
  ({ slug: string } | { items: SidebarItem<Extra>[]; collapsed?: boolean });

export type DocsSidebarItem = SidebarItem<{ icon?: IconName }>;

export type DocsSidebarGroup = {
  id: string;
  sectionId: string;
  label: string;
  icon?: IconName;
  showHeading?: boolean;
  items: DocsSidebarItem[];
};

// Sorted by label so the sidebar cannot drift as connectors are added.
// Entries are compared case-insensitively, which keeps incident.io among
// the i's rather than after every capitalised name.
const accessReviewConnectorItems = [
  { label: "1Password", slug: "docs/product/access-review/one-password" },
  { label: "Amazon Web Services", slug: "docs/product/access-review/aws" },
  { label: "Anthropic", slug: "docs/product/access-review/anthropic" },
  { label: "Apollo.io", slug: "docs/product/access-review/apollo" },
  { label: "Attio", slug: "docs/product/access-review/attio" },
  { label: "authentik", slug: "docs/product/access-review/authentik" },
  { label: "Better Stack", slug: "docs/product/access-review/better-stack" },
  { label: "Brevo", slug: "docs/product/access-review/brevo" },
  { label: "Brex", slug: "docs/product/access-review/brex" },
  { label: "Cal.com", slug: "docs/product/access-review/calcom" },
  { label: "Calendly", slug: "docs/product/access-review/calendly" },
  { label: "ClickHouse Cloud", slug: "docs/product/access-review/clickhouse" },
  { label: "Cloudflare", slug: "docs/product/access-review/cloudflare" },
  { label: "Crisp", slug: "docs/product/access-review/crisp" },
  { label: "Cursor", slug: "docs/product/access-review/cursor" },
  { label: "Daytona", slug: "docs/product/access-review/daytona" },
  { label: "Deepgram", slug: "docs/product/access-review/deepgram" },
  { label: "Dotfile", slug: "docs/product/access-review/dotfile" },
  { label: "Elastic Cloud", slug: "docs/product/access-review/elastic-cloud" },
  { label: "Front", slug: "docs/product/access-review/front" },
  { label: "GitHub", slug: "docs/product/access-review/github" },
  { label: "Google Cloud", slug: "docs/product/access-review/gcp" },
  { label: "Grafana", slug: "docs/product/access-review/grafana" },
  { label: "HubSpot", slug: "docs/product/access-review/hubspot" },
  { label: "incident.io", slug: "docs/product/access-review/incident-io" },
  { label: "Langfuse", slug: "docs/product/access-review/langfuse" },
  { label: "Mercury", slug: "docs/product/access-review/mercury" },
  { label: "Metabase", slug: "docs/product/access-review/metabase" },
  { label: "Microsoft Azure", slug: "docs/product/access-review/azure" },
  { label: "MongoDB Atlas", slug: "docs/product/access-review/mongodb-atlas" },
  { label: "Neon", slug: "docs/product/access-review/neon" },
  { label: "New Relic", slug: "docs/product/access-review/new-relic" },
  { label: "Nuki", slug: "docs/product/access-review/nuki" },
  { label: "Okta", slug: "docs/product/access-review/okta" },
  { label: "OpenAI", slug: "docs/product/access-review/openai" },
  { label: "OpenRouter", slug: "docs/product/access-review/openrouter" },
  { label: "OVHcloud", slug: "docs/product/access-review/ovhcloud" },
  { label: "PlanetScale", slug: "docs/product/access-review/planetscale" },
  { label: "Pylon", slug: "docs/product/access-review/pylon" },
  { label: "Qovery", slug: "docs/product/access-review/qovery" },
  { label: "Railway", slug: "docs/product/access-review/railway" },
  { label: "Render", slug: "docs/product/access-review/render" },
  { label: "Resend", slug: "docs/product/access-review/resend" },
  { label: "Retool", slug: "docs/product/access-review/retool" },
  { label: "Scaleway", slug: "docs/product/access-review/scaleway" },
  { label: "Segment", slug: "docs/product/access-review/segment" },
  { label: "SendGrid", slug: "docs/product/access-review/sendgrid" },
  { label: "SigNoz", slug: "docs/product/access-review/signoz" },
  { label: "Slack", slug: "docs/product/access-review/slack" },
  { label: "Supabase", slug: "docs/product/access-review/supabase" },
  { label: "Tailscale", slug: "docs/product/access-review/tailscale" },
  { label: "Tally", slug: "docs/product/access-review/tally" },
  { label: "Twingate", slug: "docs/product/access-review/twingate" },
  { label: "UpCloud", slug: "docs/product/access-review/upcloud" },
  { label: "Yousign", slug: "docs/product/access-review/yousign" },
].sort((a, b) => a.label.localeCompare(b.label, "en", { sensitivity: "base" }));

export const docsSidebarGroups: DocsSidebarGroup[] = [
  {
    id: "getting-started",
    sectionId: "product",
    label: "Get started",
    icon: "compass",
    items: [
      {
        label: "Getting started",
        icon: "compass",
        slug: "docs/product/getting-started",
      },
      {
        label: "Product overview",
        icon: "book-open-text",
        slug: "docs/product/getting-started/product-overview",
      },
      {
        label: "Choose a deployment",
        icon: "terminal-window",
        slug: "docs/product/getting-started/choose-deployment",
      },
      {
        label: "Quickstart",
        icon: "sparkle",
        slug: "docs/product/getting-started/quickstart",
      },
      {
        label: "First steps with Probo Cloud",
        icon: "compass",
        slug: "docs/product/getting-started/cloud-first-steps",
      },
      {
        label: "First organization and framework",
        icon: "briefcase",
        slug: "docs/product/getting-started/first-organization-and-framework",
      },
      {
        label: "Core concepts",
        icon: "files",
        slug: "docs/product/getting-started/core-concepts",
      },
      {
        label: "Glossary",
        icon: "article",
        slug: "docs/product/getting-started/glossary",
      },
    ],
  },
  {
    id: "compliance-program",
    sectionId: "product",
    label: "Manage compliance",
    icon: "shield-check",
    items: [
      { label: "Use Probo", icon: "book-open-text", slug: "docs/product" },
      {
        label: "Compliance program",
        icon: "shield-check",
        slug: "docs/product/compliance-program",
      },
      {
        label: "Tasks",
        icon: "list-checks",
        slug: "docs/product/tasks/overview",
      },
      {
        label: "Risk management",
        icon: "shield-warning",
        collapsed: true,
        items: [
          {
            label: "Overview",
            icon: "book-open-text",
            slug: "docs/product/risk-management",
          },
          {
            label: "Record and review a risk",
            icon: "shield-warning",
            slug: "docs/product/risk-management/first-risk",
          },
        ],
      },
      {
        label: "Third-party management",
        icon: "handshake",
        slug: "docs/product/third-party-management",
      },
      {
        label: "Privacy management",
        icon: "fingerprint",
        slug: "docs/product/privacy-management",
      },
      {
        label: "Audits and findings",
        icon: "list-checks",
        slug: "docs/product/audits-and-findings",
      },
      {
        label: "Document management",
        icon: "files",
        slug: "docs/product/document-management",
      },
      {
        label: "Assets and obligations",
        icon: "briefcase",
        slug: "docs/product/assets-and-obligations",
      },
    ],
  },
  {
    id: "identity-and-access",
    sectionId: "product",
    label: "Workspace and access",
    icon: "users-three",
    items: [
      {
        label: "Overview",
        icon: "book-open-text",
        slug: "docs/product/identity-and-access",
      },
      {
        label: "Roles and permissions",
        icon: "key",
        slug: "docs/product/roles-and-permissions",
      },
      {
        label: "Audit log",
        icon: "clock-counter-clockwise",
        slug: "docs/product/audit-log",
      },
      {
        label: "Notifications",
        icon: "bell",
        slug: "docs/product/notifications",
      },
      {
        label: "SSO",
        icon: "key",
        collapsed: true,
        items: [
          {
            label: "Overview",
            icon: "book-open-text",
            slug: "docs/product/sso/overview",
          },
          {
            label: "Microsoft Entra ID",
            slug: "docs/product/sso/microsoft-entra-id",
          },
          { label: "Okta", slug: "docs/product/sso/okta" },
          {
            label: "Google Workspace",
            slug: "docs/product/sso/google-workspace",
          },
        ],
      },
      {
        label: "SCIM",
        icon: "users-three",
        collapsed: true,
        items: [
          {
            label: "Overview",
            icon: "book-open-text",
            slug: "docs/product/scim/overview",
          },
          {
            label: "Microsoft 365",
            slug: "docs/product/scim/microsoft-365",
          },
          {
            label: "Google Workspace",
            slug: "docs/product/scim/google-workspace",
          },
          { label: "Okta", slug: "docs/product/scim/okta" },
        ],
      },
    ],
  },
  {
    id: "access-reviews",
    sectionId: "product",
    label: "Access reviews",
    icon: "list-checks",
    items: [
      {
        label: "Overview",
        icon: "book-open-text",
        slug: "docs/product/access-review/overview",
      },
      {
        label: "Run a campaign",
        icon: "list-checks",
        slug: "docs/product/access-review/campaigns",
      },
      {
        label: "CSV sources",
        icon: "files",
        slug: "docs/product/access-review/csv-sources",
      },
      {
        label: "Credential security",
        icon: "key",
        slug: "docs/product/access-review/integration-security",
      },
      {
        label: "Connectors",
        icon: "plugs-connected",
        collapsed: true,
        items: [
          {
            label: "Connector directory",
            slug: "docs/product/access-review/directory",
          },
          ...accessReviewConnectorItems,
        ],
      },
    ],
  },
  {
    id: "compliance-portal",
    sectionId: "product",
    label: "Share your compliance",
    icon: "handshake",
    items: [
      {
        label: "Overview",
        icon: "book-open-text",
        slug: "docs/product/compliance-portal",
      },
      {
        label: "Quickstart",
        icon: "sparkle",
        slug: "docs/product/compliance-portal/quickstart",
      },
      {
        label: "Branding",
        icon: "paint-brush",
        slug: "docs/product/compliance-portal/branding-and-domains",
      },
      {
        label: "Content management",
        icon: "files",
        collapsed: true,
        items: [
          {
            label: "Publishing content",
            slug: "docs/product/compliance-portal/publishing-content",
          },
          {
            label: "Commitments",
            slug: "docs/product/compliance-portal/commitments",
          },
          {
            label: "Subprocessors",
            slug: "docs/product/compliance-portal/subprocessors",
          },
          {
            label: "Updates and mailing list",
            slug: "docs/product/compliance-portal/updates-and-mailing-list",
          },
        ],
      },
      {
        label: "Visitor access and NDA",
        icon: "key",
        slug: "docs/product/compliance-portal/visitor-access-and-nda",
      },
      {
        label: "Rights requests",
        icon: "fingerprint",
        slug: "docs/product/compliance-portal/rights-requests",
      },
      {
        label: "Multiple portals",
        icon: "files",
        slug: "docs/product/compliance-portal/multiple-portals",
      },
      {
        label: "SEO and discoverability",
        slug: "docs/product/compliance-portal/seo-and-discoverability",
      },
      {
        label: "Permissions and integrations",
        icon: "plugs-connected",
        slug: "docs/product/compliance-portal/permissions-and-integrations",
      },
    ],
  },
  {
    id: "consent-and-devices",
    sectionId: "product",
    label: "Cookie consent",
    icon: "cookie",
    items: [
      {
        label: "Cookie consent",
        icon: "cookie",
        slug: "docs/product/cookie-banner/overview",
      },
      {
        label: "Quickstart",
        icon: "sparkle",
        slug: "docs/product/cookie-banner/quickstart",
      },
      {
        label: "Geolocation and regulations",
        slug: "docs/product/cookie-banner/geolocation",
      },
      {
        label: "JavaScript SDK",
        icon: "code",
        slug: "docs/product/cookie-banner/javascript-sdk",
      },
      {
        label: "React Integration",
        icon: "code",
        slug: "docs/product/cookie-banner/react",
      },
      {
        label: "Consent Manager API",
        icon: "code",
        slug: "docs/product/cookie-banner/consent-manager",
      },
      {
        label: "Theming",
        icon: "paint-brush",
        slug: "docs/product/cookie-banner/theming",
      },
      {
        label: "Blocking resources",
        slug: "docs/product/cookie-banner/blocking-resources",
      },
    ],
  },
  {
    id: "probo-agent",
    sectionId: "product",
    label: "Device security",
    icon: "monitor",
    items: [
      {
        label: "Overview",
        icon: "book-open-text",
        slug: "docs/product/device-agent/overview",
      },
      {
        label: "Security",
        icon: "shield-check",
        slug: "docs/product/device-agent/security",
      },
      {
        label: "Install",
        icon: "terminal-window",
        collapsed: true,
        items: [
          {
            label: "Overview",
            icon: "book-open-text",
            slug: "docs/product/device-agent/install",
          },
          { label: "macOS", slug: "docs/product/device-agent/macos" },
          { label: "Windows", slug: "docs/product/device-agent/windows" },
          { label: "Linux", slug: "docs/product/device-agent/linux" },
          { label: "FreeBSD", slug: "docs/product/device-agent/freebsd" },
        ],
      },
      {
        label: "Commands",
        slug: "docs/product/device-agent/commands",
      },
    ],
  },
  {
    id: "developer-overview",
    sectionId: "developers",
    label: "Developer Overview",
    showHeading: false,
    items: [
      { label: "Overview", icon: "book-open-text", slug: "docs/developers" },
      {
        label: "API fundamentals",
        icon: "book-open-text",
        slug: "docs/developers/api-overview",
      },
      { label: "GraphQL API", icon: "graph", slug: "docs/developers/graphql" },
    ],
  },
  {
    id: "cli",
    sectionId: "developers",
    label: "CLI",
    icon: "terminal-window",
    items: [
      {
        label: "Overview",
        icon: "book-open-text",
        slug: "docs/developers/cli/overview",
      },
      {
        label: "Authentication",
        icon: "key",
        slug: "docs/developers/cli/authentication",
      },
      {
        label: "Configuration",
        icon: "sliders-horizontal",
        slug: "docs/developers/cli/configuration",
      },
      {
        label: "Autocomplete",
        icon: "terminal-window",
        slug: "docs/developers/cli/autocomplete",
      },
      {
        label: "Command reference",
        icon: "terminal-window",
        collapsed: true,
        items: [
          {
            label: "Overview",
            icon: "book-open-text",
            slug: "docs/developers/cli/commands",
          },
          ...cliCommandItems,
        ],
      },
    ],
  },
  {
    id: "mcp",
    sectionId: "developers",
    label: "MCP",
    icon: "sparkle",
    items: [
      {
        label: "Overview",
        icon: "book-open-text",
        slug: "docs/developers/api/mcp/overview",
      },
      {
        label: "Authentication",
        icon: "key",
        slug: "docs/developers/api/mcp/authentication",
      },
      { label: "Pagination", slug: "docs/developers/api/mcp/pagination" },
      {
        label: "Integrations",
        icon: "plugs-connected",
        collapsed: true,
        items: [
          {
            label: "Overview",
            icon: "book-open-text",
            slug: "docs/developers/api/mcp/integrations",
          },
          {
            label: "Claude Desktop",
            slug: "docs/developers/api/mcp/claude-desktop",
          },
          {
            label: "Claude Code",
            slug: "docs/developers/api/mcp/claude-code",
          },
          {
            label: "Claude.ai",
            slug: "docs/developers/api/mcp/claude-ai",
          },
          { label: "Dust", slug: "docs/developers/api/mcp/dust" },
          {
            label: "OpenAI API",
            slug: "docs/developers/api/mcp/openai",
          },
          { label: "Cursor", slug: "docs/developers/api/mcp/cursor" },
          {
            label: "Windsurf",
            slug: "docs/developers/api/mcp/windsurf",
          },
          {
            label: "Visual Studio Code",
            slug: "docs/developers/api/mcp/vscode",
          },
          { label: "Zed", slug: "docs/developers/api/mcp/zed" },
          {
            label: "OpenCode",
            slug: "docs/developers/api/mcp/opencode",
          },
        ],
      },
      {
        label: "Tool reference",
        icon: "sliders-horizontal",
        collapsed: true,
        items: [
          {
            label: "Overview",
            icon: "book-open-text",
            slug: "docs/developers/api/mcp/tools",
          },
          ...mcpCategoryItems,
        ],
      },
    ],
  },
  {
    id: "n8n",
    sectionId: "developers",
    label: "n8n",
    icon: "flow-arrow",
    items: [
      {
        label: "Overview",
        icon: "book-open-text",
        slug: "docs/developers/api/n8n/overview",
      },
      {
        label: "Installation",
        icon: "terminal-window",
        slug: "docs/developers/api/n8n/installation",
      },
      {
        label: "Authentication",
        icon: "key",
        slug: "docs/developers/api/n8n/authentication",
      },
      {
        label: "Resource reference",
        icon: "files",
        collapsed: true,
        items: [
          {
            label: "Overview",
            icon: "book-open-text",
            slug: "docs/developers/api/n8n/resources",
          },
          ...n8nResourceItems,
        ],
      },
      {
        label: "Trigger",
        slug: "docs/developers/api/n8n/trigger",
      },
    ],
  },
  {
    id: "webhooks",
    sectionId: "developers",
    label: "Webhooks",
    icon: "broadcast",
    items: [
      {
        label: "Overview",
        icon: "book-open-text",
        slug: "docs/developers/api/webhooks/overview",
      },
      {
        label: "Quickstart",
        icon: "sparkle",
        slug: "docs/developers/api/webhooks/quickstart",
      },
      {
        label: "Signature verification",
        slug: "docs/developers/api/webhooks/signature-verification",
      },
      {
        label: "Event types",
        slug: "docs/developers/api/webhooks/event-types",
      },
      {
        label: "Delivery and recovery",
        slug: "docs/developers/api/webhooks/delivery-and-recovery",
      },
    ],
  },
  {
    id: "device-agent",
    sectionId: "developers",
    label: "Device agent",
    icon: "monitor",
    items: [
      {
        label: "Overview",
        icon: "book-open-text",
        slug: "docs/developers/api/agent/overview",
      },
      {
        label: "Authentication",
        icon: "key",
        slug: "docs/developers/api/agent/authentication",
      },
      {
        label: "Endpoints",
        slug: "docs/developers/api/agent/endpoints",
      },
      {
        label: "Contributing",
        slug: "docs/developers/api/agent/contributing",
      },
    ],
  },
  {
    id: "deployment-overview",
    sectionId: "deployment",
    label: "Deployment Overview",
    showHeading: false,
    items: [
      { label: "Overview", icon: "book-open-text", slug: "docs/deployment" },
    ],
  },
  {
    id: "cloud",
    sectionId: "deployment",
    label: "Cloud",
    icon: "cloud",
    items: [
      {
        label: "Overview",
        icon: "book-open-text",
        slug: "docs/deployment/cloud",
      },
      {
        label: "Infrastructure security",
        icon: "shield-check",
        slug: "docs/deployment/infrastructure-security",
      },
      {
        label: "Egress IP addresses",
        slug: "docs/deployment/ip-ranges",
      },
    ],
  },
  {
    id: "self-hosting",
    sectionId: "deployment",
    label: "Self-hosting",
    icon: "terminal-window",
    items: [
      {
        label: "Overview",
        icon: "book-open-text",
        slug: "docs/deployment/self-hosting",
      },
      {
        label: "Docker Compose",
        icon: "terminal-window",
        slug: "docs/deployment/self-hosting/docker-compose",
      },
      {
        label: "Kubernetes",
        icon: "cloud",
        slug: "docs/deployment/self-hosting/kubernetes",
      },
    ],
  },
  {
    id: "configuration",
    sectionId: "deployment",
    label: "Configuration",
    icon: "sliders-horizontal",
    items: [
      {
        label: "Overview",
        icon: "book-open-text",
        slug: "docs/deployment/configuration/overview",
      },
      {
        label: "Config file",
        icon: "sliders-horizontal",
        slug: "docs/deployment/configuration/config-file",
      },
      {
        label: "Environment variables",
        icon: "sliders-horizontal",
        slug: "docs/deployment/configuration/environment-variables",
      },
      {
        label: "References",
        collapsed: true,
        items: [
          {
            label: "Configuration file",
            icon: "sliders-horizontal",
            slug: "docs/deployment/configuration/config-reference",
          },
          {
            label: "Environment variables",
            icon: "sliders-horizontal",
            slug: "docs/deployment/configuration/environment-reference",
          },
        ],
      },
    ],
  },
];

// Starlight rejects unknown keys on sidebar links, so icons stay in this
// config and are paired with the resolved sidebar entries by position.
function withoutIcons(items: DocsSidebarItem[]): SidebarItem<{}>[] {
  return items.map(({ icon: _icon, ...item }) =>
    "items" in item ? { ...item, items: withoutIcons(item.items) } : item,
  );
}

export const docsSidebar = docsSidebarGroups.map(
  ({
    id: _id,
    sectionId: _sectionId,
    showHeading: _showHeading,
    icon: _icon,
    items,
    ...group
  }) => ({ ...group, items: withoutIcons(items) }),
);
