import {
  cliCommandItems,
  mcpCategoryItems,
  n8nResourceItems,
} from "./generated-reference-manifest.mjs";

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
  { label: "Deepgram", slug: "docs/product/access-review/deepgram" },
  { label: "Dotfile", slug: "docs/product/access-review/dotfile" },
  { label: "GitHub", slug: "docs/product/access-review/github" },
  { label: "Google Cloud", slug: "docs/product/access-review/gcp" },
  { label: "Grafana", slug: "docs/product/access-review/grafana" },
  { label: "HubSpot", slug: "docs/product/access-review/hubspot" },
  { label: "incident.io", slug: "docs/product/access-review/incident-io" },
  { label: "Langfuse", slug: "docs/product/access-review/langfuse" },
  { label: "Mercury", slug: "docs/product/access-review/mercury" },
  { label: "Metabase", slug: "docs/product/access-review/metabase" },
  { label: "Neon", slug: "docs/product/access-review/neon" },
  { label: "Nuki", slug: "docs/product/access-review/nuki" },
  { label: "Okta", slug: "docs/product/access-review/okta" },
  { label: "OpenAI", slug: "docs/product/access-review/openai" },
  { label: "OpenRouter", slug: "docs/product/access-review/openrouter" },
  { label: "Pylon", slug: "docs/product/access-review/pylon" },
  { label: "Qovery", slug: "docs/product/access-review/qovery" },
  { label: "Railway", slug: "docs/product/access-review/railway" },
  { label: "Render", slug: "docs/product/access-review/render" },
  { label: "Resend", slug: "docs/product/access-review/resend" },
  { label: "Scaleway", slug: "docs/product/access-review/scaleway" },
  { label: "Segment", slug: "docs/product/access-review/segment" },
  { label: "SendGrid", slug: "docs/product/access-review/sendgrid" },
  { label: "SigNoz", slug: "docs/product/access-review/signoz" },
  { label: "Supabase", slug: "docs/product/access-review/supabase" },
  { label: "Tailscale", slug: "docs/product/access-review/tailscale" },
  { label: "Tally", slug: "docs/product/access-review/tally" },
  { label: "UpCloud", slug: "docs/product/access-review/upcloud" },
  { label: "Yousign", slug: "docs/product/access-review/yousign" },
].sort((a, b) => a.label.localeCompare(b.label, "en", { sensitivity: "base" }));

export const docsSidebarGroups = [
  {
    id: "overview",
    sectionId: "overview",
    label: "Overview",
    showHeading: false,
    items: [
      { label: "Documentation home", slug: "docs" },
      {
        label: "Getting started",
        collapsed: false,
        items: [
          {
            label: "Overview",
            slug: "docs/product/getting-started",
          },
          {
            label: "Product overview",
            slug: "docs/product/getting-started/product-overview",
          },
          {
            label: "Choose a deployment",
            slug: "docs/product/getting-started/choose-deployment",
          },
          {
            label: "Quickstart",
            slug: "docs/product/getting-started/quickstart",
          },
          {
            label: "First organization and framework",
            slug: "docs/product/getting-started/first-organization-and-framework",
          },
          {
            label: "Core concepts",
            slug: "docs/product/getting-started/core-concepts",
          },
          {
            label: "Glossary",
            slug: "docs/product/getting-started/glossary",
          },
        ],
      },
    ],
  },
  {
    id: "compliance-program",
    sectionId: "product",
    label: "Compliance Program",
    items: [
      { label: "Product hub", slug: "docs/product" },
      {
        label: "Compliance program",
        slug: "docs/product/compliance-program",
      },
      { label: "Risk management", slug: "docs/product/risk-management" },
      {
        label: "Third-party management",
        slug: "docs/product/third-party-management",
      },
      {
        label: "Privacy management",
        slug: "docs/product/privacy-management",
      },
      {
        label: "Audits and findings",
        slug: "docs/product/audits-and-findings",
      },
      {
        label: "Document management",
        slug: "docs/product/document-management",
      },
      {
        label: "Assets and obligations",
        slug: "docs/product/assets-and-obligations",
      },
    ],
  },
  {
    id: "identity-and-access",
    sectionId: "product",
    label: "Identity and Access",
    items: [
      {
        label: "Overview",
        slug: "docs/product/identity-and-access",
      },
      {
        label: "Roles and permissions",
        slug: "docs/product/roles-and-permissions",
      },
      {
        label: "Audit log",
        slug: "docs/product/audit-log",
      },
      {
        label: "SSO",
        collapsed: true,
        items: [
          { label: "Overview", slug: "docs/product/sso/overview" },
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
        collapsed: true,
        items: [
          { label: "Overview", slug: "docs/product/scim/overview" },
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
    label: "Access Reviews",
    items: [
      {
        label: "Overview",
        slug: "docs/product/access-review/overview",
      },
      {
        label: "Run a campaign",
        slug: "docs/product/access-review/campaigns",
      },
      {
        label: "CSV sources",
        slug: "docs/product/access-review/csv-sources",
      },
      {
        label: "Credential security",
        slug: "docs/product/access-review/integration-security",
      },
      {
        label: "Connectors",
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
    label: "Compliance Portal",
    items: [
      {
        label: "Overview",
        slug: "docs/product/compliance-portal",
      },
      {
        label: "Quickstart",
        slug: "docs/product/compliance-portal/quickstart",
      },
      {
        label: "Branding",
        slug: "docs/product/compliance-portal/branding-and-domains",
      },
      {
        label: "Content management",
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
        slug: "docs/product/compliance-portal/visitor-access-and-nda",
      },
      {
        label: "Rights requests",
        slug: "docs/product/compliance-portal/rights-requests",
      },
      {
        label: "Multiple portals",
        slug: "docs/product/compliance-portal/multiple-portals",
      },
      {
        label: "SEO and discoverability",
        slug: "docs/product/compliance-portal/seo-and-discoverability",
      },
      {
        label: "Permissions and integrations",
        slug: "docs/product/compliance-portal/permissions-and-integrations",
      },
    ],
  },
  {
    id: "consent-and-devices",
    sectionId: "product",
    label: "Cookie Banner",
    items: [
      {
        label: "Cookie consent",
        slug: "docs/product/cookie-banner/overview",
      },
      {
        label: "Quickstart",
        slug: "docs/product/cookie-banner/quickstart",
      },
      {
        label: "Geolocation and regulations",
        slug: "docs/product/cookie-banner/geolocation",
      },
      {
        label: "JavaScript SDK",
        slug: "docs/product/cookie-banner/javascript-sdk",
      },
      {
        label: "React Integration",
        slug: "docs/product/cookie-banner/react",
      },
      {
        label: "Consent Manager API",
        slug: "docs/product/cookie-banner/consent-manager",
      },
      { label: "Theming", slug: "docs/product/cookie-banner/theming" },
      {
        label: "Blocking resources",
        slug: "docs/product/cookie-banner/blocking-resources",
      },
    ],
  },
  {
    id: "probo-agent",
    sectionId: "product",
    label: "Probo Agent",
    items: [
      { label: "Overview", slug: "docs/product/probo-agent/overview" },
      {
        label: "Security",
        slug: "docs/product/probo-agent/security",
      },
      {
        label: "Install",
        collapsed: true,
        items: [
          { label: "Overview", slug: "docs/product/probo-agent/install" },
          { label: "macOS", slug: "docs/product/probo-agent/macos" },
          { label: "Windows", slug: "docs/product/probo-agent/windows" },
          { label: "Linux", slug: "docs/product/probo-agent/linux" },
          { label: "FreeBSD", slug: "docs/product/probo-agent/freebsd" },
        ],
      },
      {
        label: "Commands",
        slug: "docs/product/probo-agent/commands",
      },
    ],
  },
  {
    id: "developer-overview",
    sectionId: "developers",
    label: "Developer Overview",
    showHeading: false,
    items: [
      { label: "Overview", slug: "docs/developers" },
      { label: "API fundamentals", slug: "docs/developers/api-overview" },
      { label: "GraphQL API", slug: "docs/developers/graphql" },
    ],
  },
  {
    id: "cli",
    sectionId: "developers",
    label: "CLI",
    items: [
      { label: "Overview", slug: "docs/developers/cli/overview" },
      {
        label: "Authentication",
        slug: "docs/developers/cli/authentication",
      },
      {
        label: "Configuration",
        slug: "docs/developers/cli/configuration",
      },
      {
        label: "Autocomplete",
        slug: "docs/developers/cli/autocomplete",
      },
      {
        label: "Command reference",
        collapsed: true,
        items: [
          {
            label: "Overview",
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
    items: [
      { label: "Overview", slug: "docs/developers/api/mcp/overview" },
      {
        label: "Authentication",
        slug: "docs/developers/api/mcp/authentication",
      },
      { label: "Pagination", slug: "docs/developers/api/mcp/pagination" },
      {
        label: "Integrations",
        collapsed: true,
        items: [
          {
            label: "Overview",
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
        collapsed: true,
        items: [
          {
            label: "Overview",
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
    items: [
      { label: "Overview", slug: "docs/developers/api/n8n/overview" },
      {
        label: "Installation",
        slug: "docs/developers/api/n8n/installation",
      },
      {
        label: "Authentication",
        slug: "docs/developers/api/n8n/authentication",
      },
      {
        label: "Resource References",
        collapsed: true,
        items: [
          {
            label: "Overview",
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
    items: [
      { label: "Overview", slug: "docs/developers/api/webhooks/overview" },
      {
        label: "Quickstart",
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
    items: [
      {
        label: "Overview",
        slug: "docs/developers/api/agent/overview",
      },
      {
        label: "Authentication",
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
    items: [{ label: "Overview", slug: "docs/deployment" }],
  },
  {
    id: "cloud",
    sectionId: "deployment",
    label: "Cloud",
    items: [
      { label: "Overview", slug: "docs/deployment/cloud" },
      {
        label: "Infrastructure security",
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
    label: "Self-Hosting",
    items: [
      { label: "Overview", slug: "docs/deployment/self-hosting" },
      {
        label: "Docker Compose",
        slug: "docs/deployment/self-hosting/docker-compose",
      },
      {
        label: "Kubernetes",
        slug: "docs/deployment/self-hosting/kubernetes",
      },
    ],
  },
  {
    id: "configuration",
    sectionId: "deployment",
    label: "Configuration",
    items: [
      {
        label: "Overview",
        slug: "docs/deployment/configuration/overview",
      },
      {
        label: "Config file",
        slug: "docs/deployment/configuration/config-file",
      },
      {
        label: "Environment variables",
        slug: "docs/deployment/configuration/environment-variables",
      },
      {
        label: "References",
        collapsed: true,
        items: [
          {
            label: "Configuration file",
            slug: "docs/deployment/configuration/config-reference",
          },
          {
            label: "Environment variables",
            slug: "docs/deployment/configuration/environment-reference",
          },
        ],
      },
    ],
  },
];

export const docsSidebar = docsSidebarGroups.map(
  ({ id: _id, sectionId: _sectionId, showHeading: _showHeading, ...group }) =>
    group,
);
