export type MenuIconName =
  | "article"
  | "book-open-text"
  | "briefcase"
  | "claude"
  | "clock-counter-clockwise"
  | "code"
  | "compass"
  | "cookie"
  | "files"
  | "github-logo"
  | "handshake"
  | "heart"
  | "list-checks"
  | "monitor"
  | "paint-brush"
  | "quotes"
  | "shield-check"
  | "users-three";
export type MenuItem = {
  label: string;
  description: string;
  href: string;
  icon: MenuIconName;
};

export type MenuFeature = {
  eyebrow: string;
  title: string;
  href: string;
  asset: string;
  alt: string;
  variant: "product" | "story" | "guide" | "illustration";
};

export type MenuGroup = {
  label: string;
  href?: string;
  showLabel?: boolean;
  items: MenuItem[];
  feature: MenuFeature;
};

export const menuGroups: MenuGroup[] = [
  {
    label: "Products",
    items: [
      {
        label: "Compliance Officer Service",
        description: "Expert-led compliance, end to end",
        href: "/products/compliance-as-a-service",
        icon: "handshake",
      },
      {
        label: "Compliance Portal",
        description: "Share security documents securely",
        href: "/products/compliance-portal",
        icon: "shield-check",
      },
      {
        label: "Document Management",
        description: "Draft, approve, and sign your policies",
        href: "/products/document-management",
        icon: "files",
      },
      {
        label: "Employee Portal",
        description: "Your whole team’s compliance, in one portal",
        href: "/products/employee-portal",
        icon: "users-three",
      },
      {
        label: "Access Review",
        description: "Monitor user access across all your systems",
        href: "/products/access-review",
        icon: "list-checks",
      },
      {
        label: "AI Agents",
        description: "Run compliance from the tools you use",
        href: "/products/ai-agents-for-compliance",
        icon: "claude",
      },
      {
        label: "Cookie Banner",
        description: "Consent that follows every visitor's law",
        href: "/products/cookie-banner",
        icon: "cookie",
      },
      {
        label: "Device Agent",
        description: "Continuous security posture for every device",
        href: "/device-agent",
        icon: "monitor",
      },
      {
        label: "Open-source platform",
        description: "Deploy Probo on your own infrastructure",
        href: "/docs/deployment/self-hosting/docker-compose",
        icon: "code",
      },
    ],
    feature: {
      eyebrow: "New on Probo",
      title: "Compliance Portal",
      href: "/products/compliance-portal",
      asset: "/navigation/browser.svg",
      alt: "Compliance Portal preview",
      variant: "product",
    },
  },
  {
    label: "Resources",
    items: [
      {
        label: "Customer stories",
        description: "How teams get compliant with Probo",
        href: "/stories",
        icon: "quotes",
      },
      {
        label: "Blog",
        description: "Ideas and guidance from the Probo team",
        href: "/blog",
        icon: "article",
      },
      {
        label: "Compliance Hub",
        description: "Practical compliance guides and free tools",
        href: "/hub",
        icon: "compass",
      },
      {
        label: "Love from customers",
        description: "What customers say about working with Probo",
        href: "/love-from-customer",
        icon: "heart",
      },
    ],
    feature: {
      eyebrow: "Featured story",
      title: "How Ahrefs became ISO 27001 certified in 3 months",
      href: "/stories/ahrefs-iso",
      asset: "/navigation/ahrefs.webp",
      alt: "Ahrefs team collaborating in their office",
      variant: "story",
    },
  },
  {
    label: "Docs",
    href: "/docs",
    showLabel: false,
    items: [
      {
        label: "Overview",
        description: "Understand Probo and its core concepts",
        href: "/docs",
        icon: "book-open-text",
      },
      {
        label: "Product",
        description: "Explore Probo's GRC capabilities",
        href: "/docs/product",
        icon: "shield-check",
      },
      {
        label: "Developers",
        description: "Explore GraphQL, CLI, MCP, n8n, and webhooks",
        href: "/docs/developers",
        icon: "code",
      },
      {
        label: "Deployment",
        description: "Probo Cloud, self-hosting, and configuration",
        href: "/docs/deployment",
        icon: "compass",
      },
    ],
    feature: {
      eyebrow: "Documentation",
      title: "Understand and operate Probo",
      href: "/docs",
      asset: "/navigation/browser.svg",
      alt: "Probo documentation preview",
      variant: "product",
    },
  },
];

/** Header link without a dropdown. */
export type MenuLink = Pick<
  MenuItem,
  "label" | "description" | "href" | "icon"
>;

export const storiesMenuLink: MenuLink = {
  label: "Stories",
  description: "How teams get compliant with Probo",
  href: "/stories",
  icon: "quotes",
};

/** Desktop header order: dropdown groups with the Stories link before Docs. */
export const headerMenuEntries: (MenuGroup | MenuLink)[] = [
  ...menuGroups.filter((group) => group.label !== "Docs"),
  storiesMenuLink,
  ...menuGroups.filter((group) => group.label === "Docs"),
];

export const pricingMenuItem = {
  label: "Pricing",
  description: "Find the right way to run compliance",
  href: "/pricing",
};

export const directMenuItems: MenuItem[] = [
  {
    label: "GitHub",
    description: "Explore our open-source compliance tools",
    href: "https://github.com/getprobo/probo",
    icon: "github-logo",
  },
];
