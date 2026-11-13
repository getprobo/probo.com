export const githubUrl = "https://github.com/getprobo/probo";

export const plans = [
  {
    id: "open-source",
    name: "Open Source",
    tagline: "Host Probo. Manage compliance in-house.",
    finderPrompt: "We want to self-host.",
    summary:
      "Free to self-host under the MIT license. Your team operates the software, configures integrations and runs compliance. Community support is available.",
    cta: "Deploy today",
    href: "https://github.com/getprobo/probo",
    includesLabel: "The open-source platform:",
    features: [
      "Free to self-host under the MIT license",
      "Community support",
      "Frameworks, controls and evidence",
      "API, webhooks, CLI and MCP",
    ],
  },
  {
    id: "cloud",
    name: "Probo Cloud",
    tagline: "Your team runs compliance. We run the software.",
    finderPrompt: "We run compliance and need hosting.",
    summary:
      "Price on request. Probo hosts the platform in the EU or US, maintains it and provides Slack technical support. Your team runs compliance. Integrations are ready to use, and the third-party vetting agent is Cloud-only.",
    cta: "Talk to us",
    href: "/contact",
    includesLabel: "Everything in Open Source, plus:",
    features: [
      "Managed hosting, updates and backups",
      "Support on Slack",
      "One-click integrations",
      "SSO and SCIM ready to use",
      "Device monitoring",
      "Third-party risk management",
      "Compliance portal (trust center)",
      "Consent management platform",
      "Employee portal",
    ],
  },
  {
    id: "done-for-you",
    name: "Done for you",
    tagline: "Your compliance officer runs your program all year.",
    finderPrompt: "We need someone to run compliance.",
    summary:
      "Annual price on request, based on company size and frameworks. A dedicated compliance officer runs your program on Probo Cloud. Audit fees can be invoiced through Probo or paid directly to your auditor. Customer due diligence calls and on-site audits are paid extras.",
    cta: "Talk to us",
    href: "/contact",
    includesLabel: "Everything in Probo Cloud, plus:",
    features: [
      "A dedicated compliance officer",
      "Available on Slack and calls",
      "We run your risk assessment, gap analysis and roadmap",
      "We write and update your policies",
      "We create your assets and data registries",
      "We review your vendors",
      "We collect and manage your evidence",
      "We run your internal audit",
      "We book and manage your audit",
      "We set up and maintain your compliance portal",
      "We provide and track security awareness training",
      "We answer your security questionnaires",
    ],
    popular: true,
  },
] as const;

export type ComparisonRow = {
  label: string;
  detail?: string;
  values: [boolean | string, boolean | string, boolean | string];
  cellDetails?: Record<string, string>;
  ossSetupContinuation?: boolean;
};

export const comparison: { name: string; rows: ComparisonRow[] }[] = [
  {
    name: "Who runs what",
    rows: [
      {
        label: "Hosting and maintenance",
        detail:
          "Who runs the infrastructure and keeps the software up to date.",
        values: ["You configure", "Included", "Included"],
        cellDetails: {
          "You configure": "Your team hosts, updates and maintains Probo.",
          Included: "Probo hosts, updates and maintains the platform for you.",
        },
      },
      {
        label: "Direct Slack support",
        values: [false, true, true],
      },
      {
        label: "Dedicated compliance officer",
        detail:
          "Done for you includes a dedicated officer who runs your compliance program. On Open Source and Probo Cloud, your team runs it.",
        values: [false, false, true],
      },
    ],
  },
  {
    name: "Compliance work done for you",
    rows: [
      {
        label: "Scoping and onboarding call",
        detail:
          "Review your requirements and gather context with your compliance officer.",
        values: [false, false, true],
      },
      {
        label: "Company risk assessment",
        detail: "Your compliance officer assesses your company's risks.",
        values: [false, false, true],
      },
      {
        label: "Gap analysis",
        detail:
          "Identify what is missing between your current practices and the frameworks in scope.",
        values: [false, false, true],
      },
      {
        label: "Compliance roadmap for the year",
        detail: "Turn the gap analysis into a plan for the year.",
        values: [false, false, true],
      },
      {
        label: "Technical setup guidance",
        detail:
          "Your compliance officer explains what to do on your side and how to do it. Your team implements technical changes.",
        values: [false, false, true],
      },
      {
        label: "Policies written, updated and reviewed",
        detail: "Your compliance officer writes and maintains your policies.",
        values: [false, false, true],
      },
      {
        label: "Asset, data and processing registries built",
        detail:
          "Your compliance officer builds your asset, data and processing activity registries.",
        values: [false, false, true],
      },
      {
        label: "Third parties listed",
        detail: "Your compliance officer records the third parties in scope.",
        values: [false, false, true],
      },
      {
        label: "Third parties assessed",
        detail: "Your compliance officer assesses your third parties.",
        values: [false, false, true],
      },
      {
        label: "Audit managed end to end",
        detail:
          "Includes a complete internal audit and coordination with your external auditor on your behalf.",
        values: [false, false, true],
      },
      {
        label: "Policy renewals and signature campaigns",
        detail: "Keep policies current and send them out for signature.",
        values: [false, false, true],
      },
      {
        label: "Employee onboarding and offboarding follow-up",
        detail:
          "Send policies to new hires and follow up on access when employees leave.",
        values: [false, false, true],
      },
      {
        label: "Periodic access reviews conducted",
        detail:
          "Your compliance officer runs recurring reviews of who has access.",
        values: [false, false, true],
      },
      {
        label: "Security awareness training provided and tracked",
        values: [false, false, true],
      },
      {
        label: "Compliance Portal set up and kept current",
        detail:
          "Your compliance officer sets up the portal and keeps its information current.",
        values: [false, false, true],
      },
      {
        label: "Security questionnaires answered",
        detail: "AI drafts each answer and your compliance officer reviews it.",
        values: [false, false, true],
      },
      {
        label: "Migration from Vanta, Drata or another tool",
        detail:
          "Migration is included in Done for you and takes about one week.",
        values: [false, false, true],
      },
      {
        label: "Customer due diligence calls",
        detail:
          "Your compliance officer can join your customers' due diligence calls as a paid extra.",
        values: [false, false, "Paid extra"],
      },
      {
        label: "Audit fee",
        detail:
          "Choose an audit invoiced through Probo or pay your own auditor directly. Probo coordinates with the auditor either way.",
        values: [false, false, "Direct or via Probo"],
      },
      {
        label: "On-site audit",
        detail: "An on-site audit is billed as a paid extra when required.",
        values: [false, false, "Paid extra"],
      },
    ],
  },
  {
    name: "Compliance platform",
    rows: [
      {
        label: "Compliance frameworks",
        detail:
          "SOC 2, ISO 27001, ISO 27701, ISO 42001, GDPR, HIPAA, CCPA, NIS2, DORA and more.",
        values: [true, true, true],
      },
      {
        label: "Controls and internal controls",
        detail:
          "Track framework controls and the internal controls your team defines.",
        values: [true, true, true],
      },
      {
        label: "Statements of Applicability",
        detail: "Record which controls apply to your organization and why.",
        values: [true, true, true],
      },
      {
        label: "Tasks management system",
        detail: "Organize and follow up on compliance work.",
        values: [true, true, true],
      },
      {
        label: "Asset, data and obligation registries",
        detail:
          "Keep a record of the assets in scope for your compliance program. Keep a record of the data your organization handles. Record the compliance obligations that apply to your organization.",
        values: [true, true, true],
      },
    ],
  },
  {
    name: "Audits",
    rows: [
      {
        label: "Track your audits and certifications",
        detail: "Track your audits and certifications in Probo.",
        values: [true, true, true],
      },
      {
        label: "Bring your own auditor",
        values: [true, true, true],
      },
      {
        label: "Auditor role to give your auditor direct access",
        values: [true, true, true],
      },
      {
        label: "Findings and issue tracking",
        detail: "Track audit findings and the work needed to address them.",
        values: [true, true, true],
      },
      {
        label: "We book and manage your audit end to end",
        detail:
          "Includes a complete internal audit and coordination with your external auditor on your behalf.",
        values: [false, false, true],
      },
    ],
  },
  {
    name: "Bring your own AI",
    rows: [
      {
        label: "MCP server for any AI agent (Claude, ChatGPT, Cursor and more)",
        detail:
          "Use the MCP server, CLI or API to manage your compliance from an AI agent, under your own permissions. Use the MCP server to connect these tools to your Probo account.",
        values: ["You configure", "Included", "Included"],
        cellDetails: {
          "You configure":
            "Configure your AI tool to use the MCP endpoint on your instance.",
          Included: "Connect your AI tool to the MCP endpoint hosted by Probo.",
        },
      },
      {
        label: "Probo CLI for scripts and coding agents",
        detail:
          "Run Probo commands from your terminal. Set the CLI to use your self-hosted Probo instance.",
        values: ["You configure", "Included", "Included"],
        cellDetails: {
          "You configure":
            "Set the CLI to use your self-hosted Probo instance.",
          Included: "Connect the CLI to your existing Probo Cloud account.",
        },
        ossSetupContinuation: true,
      },
      {
        label: "Answer security questionnaires from everything in Probo",
        values: ["You configure", true, true],
        cellDetails: {
          "You configure":
            "Configure your AI tool to use the MCP endpoint on your instance.",
        },
        ossSetupContinuation: true,
      },
      {
        label: "Draft and update policies with your AI",
        values: ["You configure", true, true],
        cellDetails: {
          "You configure":
            "Configure your AI tool to use the MCP endpoint on your instance.",
        },
        ossSetupContinuation: true,
      },
      {
        label: "Upload evidence and close tasks from your AI",
        values: ["You configure", true, true],
        cellDetails: {
          "You configure":
            "Configure your AI tool to use the MCP endpoint on your instance.",
        },
        ossSetupContinuation: true,
      },
      {
        label: "Fill your registries and vendor list from your AI",
        values: ["You configure", true, true],
        cellDetails: {
          "You configure":
            "Configure your AI tool to use the MCP endpoint on your instance.",
        },
        ossSetupContinuation: true,
      },
      {
        label: "Run access reviews with your AI",
        values: ["You configure", true, true],
        cellDetails: {
          "You configure":
            "Configure your AI tool to use the MCP endpoint on your instance.",
        },
        ossSetupContinuation: true,
      },
      {
        label: "Find missing signatures and approvals with your AI",
        values: ["You configure", true, true],
        cellDetails: {
          "You configure":
            "Configure your AI tool to use the MCP endpoint on your instance.",
        },
        ossSetupContinuation: true,
      },
      {
        label: "Ready-made AI skills for common compliance jobs",
        values: ["You configure", true, true],
        cellDetails: {
          "You configure":
            "Configure your AI tool to use the MCP endpoint on your instance.",
        },
        ossSetupContinuation: true,
      },
    ],
  },
  {
    name: "Document management",
    rows: [
      {
        label: "Version history with restore",
        detail: "Document versions, approval quorums, e-signatures and export.",
        values: [true, true, true],
      },
      {
        label: "Approval workflows",
        values: [true, true, true],
      },
      {
        label: "Multiple approvers per document",
        values: [true, true, true],
      },
      {
        label: "Publish as a major or minor version",
        values: [true, true, true],
      },
      {
        label: "E-signature of documents",
        detail:
          "Available when self-hosted with your own email delivery configured. Probo operates email delivery on Cloud.",
        values: ["You configure", true, true],
        cellDetails: {
          "You configure":
            "Set up email delivery (SMTP) on your instance to send signature requests.",
        },
      },
      {
        label: "We write, update and review your documentation",
        values: [false, false, true],
      },
    ],
  },
  {
    name: "Risk management",
    rows: [
      {
        label: "Risk register with scoring",
        detail: "Identify and assess risks, and implement mitigation measures.",
        values: [true, true, true],
      },
      {
        label: "Risk analysis with threats, scenarios and diagrams",
        detail:
          "Manage risk analyses with diagrams, nodes, processes, threats and scenarios.",
        values: [true, true, true],
      },
      {
        label: "Treatment plans",
        values: [true, true, true],
      },
      {
        label: "Risks linked to controls and documents",
        values: [true, true, true],
      },
      {
        label: "We run and update your risk analysis over the year",
        values: [false, false, true],
      },
    ],
  },
  {
    name: "Third-party management",
    rows: [
      {
        label: "Vendor inventory and risk assessments",
        detail: "Vendors, subprocessors, contracts and assessments.",
        values: [true, true, true],
      },
      {
        label: "Automated risk scoring agent",
        detail:
          "The agent assesses vendors for you. This is the only Cloud-only platform feature.",
        values: [false, true, true],
      },
      {
        label: "Publish your subprocessor list",
        values: ["You configure", true, true],
        cellDetails: {
          "You configure":
            "Works once the Compliance Portal is publicly reachable from your instance.",
        },
      },
      {
        label: "We list and assess your vendors",
        values: [false, false, true],
      },
    ],
  },
  {
    name: "Compliance Portal (Trust Center)",
    rows: [
      {
        label: "Show frameworks, certifications and reports",
        detail:
          "NDA gating, custom domain, subprocessor list and mailing list. You operate public hosting when self-hosted.",
        values: ["You configure", true, true],
        cellDetails: {
          "You configure":
            "Set up the Compliance Portal to be publicly reachable from your instance.",
        },
      },
      {
        label: "Show your security commitments",
        values: ["You configure", true, true],
        cellDetails: {
          "You configure":
            "Set up the Compliance Portal to be publicly reachable from your instance.",
        },
        ossSetupContinuation: true,
      },
      {
        label: "Your policies and reports under request",
        values: ["You configure", true, true],
        cellDetails: {
          "You configure":
            "Set up the Compliance Portal to be publicly reachable from your instance.",
        },
        ossSetupContinuation: true,
      },
      {
        label: "Manage access requests from Slack",
        detail:
          "Access requests need email delivery on your instance. Handling them from Slack needs your own Slack app.",
        values: ["You configure", true, true],
        cellDetails: {
          "You configure":
            "Access requests need email delivery on your instance. Handling them from Slack needs your own Slack app.",
        },
        ossSetupContinuation: true,
      },
      {
        label: "Built-in NDA e-signature in your portal",
        values: ["You configure", "Included", "Included"],
        cellDetails: {
          "You configure":
            "Set up the Compliance Portal to be publicly reachable from your instance.",
          Included:
            "Visitors sign your NDA on the Compliance Portal before they open gated documents. No DocuSign or other e-signature tool needed.",
        },
        ossSetupContinuation: true,
      },
      {
        label: "Manage privacy requests (access / delete data)",
        values: ["You configure", true, true],
        cellDetails: {
          "You configure":
            "Set up the Compliance Portal to be publicly reachable from your instance.",
        },
        ossSetupContinuation: true,
      },
      {
        label: "Email updates to your subscribers",
        detail:
          "Set up email delivery (SMTP) on your instance to send updates.",
        values: ["You configure", true, true],
        cellDetails: {
          "You configure":
            "Set up email delivery (SMTP) on your instance to send updates.",
        },
        ossSetupContinuation: true,
      },
      {
        label: "Host it on your own domain",
        detail:
          "Point your domain to your instance and manage its TLS certificate.",
        values: ["You configure", true, true],
        cellDetails: {
          "You configure":
            "Point your domain to your instance and manage its TLS certificate.",
        },
        ossSetupContinuation: true,
      },
      {
        label: "Multi-language",
        values: ["You configure", true, true],
        cellDetails: {
          "You configure":
            "Set up the Compliance Portal to be publicly reachable from your instance.",
        },
        ossSetupContinuation: true,
      },
      {
        label: "We set up your Compliance Portal",
        values: [false, false, true],
      },
    ],
  },
  {
    name: "Employee Portal",
    rows: [
      {
        label: "One portal for every employee",
        detail:
          "Policies to sign, Device Agent and notifications for employees.",
        values: ["You configure", true, true],
        cellDetails: {
          "You configure":
            "Make the portal reachable for employees and set up email so they can sign in.",
        },
      },
      {
        label: "E-signature for policies",
        values: ["You configure", true, true],
        cellDetails: {
          "You configure":
            "Make the portal reachable for employees and set up email so they can sign in.",
        },
        ossSetupContinuation: true,
      },
      {
        label: "Approve documents",
        values: ["You configure", true, true],
        cellDetails: {
          "You configure":
            "Make the portal reachable for employees and set up email so they can sign in.",
        },
        ossSetupContinuation: true,
      },
      {
        label: "See and complete your assigned tasks",
        values: ["You configure", true, true],
        cellDetails: {
          "You configure":
            "Make the portal reachable for employees and set up email so they can sign in.",
        },
        ossSetupContinuation: true,
      },
      {
        label: "Install the device monitoring agent",
        values: ["You configure", true, true],
        cellDetails: {
          "You configure":
            "Make the portal reachable for employees and set up email so they can sign in.",
        },
        ossSetupContinuation: true,
      },
      {
        label: "Access your signed documents anytime",
        values: ["You configure", true, true],
        cellDetails: {
          "You configure":
            "Make the portal reachable for employees and set up email so they can sign in.",
        },
        ossSetupContinuation: true,
      },
      {
        label: "Connect the Probo Slack bot for notifications",
        values: ["You configure", true, true],
        cellDetails: {
          "You configure":
            "Make the portal reachable for employees and set up email so they can sign in.",
        },
        ossSetupContinuation: true,
      },
      {
        label: "Policies sent automatically to new joiners",
        values: ["You configure", true, true],
        cellDetails: {
          "You configure":
            "Make the portal reachable for employees and set up email so they can sign in.",
        },
        ossSetupContinuation: true,
      },
      {
        label: "Custom tasks for onboarding and offboarding",
        values: ["You configure", true, true],
        cellDetails: {
          "You configure":
            "Make the portal reachable for employees and set up email so they can sign in.",
        },
        ossSetupContinuation: true,
      },
    ],
  },
  {
    name: "Access monitoring",
    rows: [
      {
        label: "Review access across your tools",
        values: ["You configure", true, true],
        cellDetails: {
          "You configure":
            "Create and configure your own OAuth apps for the tools you want to review on your self-hosted instance.",
        },
      },
      {
        label: "Approve, revoke or flag each access",
        values: ["You configure", true, true],
        cellDetails: {
          "You configure":
            "Create and configure your own OAuth apps for the tools you want to review on your self-hosted instance.",
        },
        ossSetupContinuation: true,
      },
      {
        label: "Access review evidence export",
        values: ["You configure", true, true],
        cellDetails: {
          "You configure":
            "Create and configure your own OAuth apps for the tools you want to review on your self-hosted instance.",
        },
        ossSetupContinuation: true,
      },
      {
        label: "We run your periodic access reviews",
        values: [false, false, true],
      },
    ],
  },
  {
    name: "Device monitoring",
    rows: [
      {
        label: "Agent for macOS, Windows and Linux",
        detail:
          "Collect laptop security posture as evidence on macOS, Windows and Linux. Self-hosted teams distribute the agent and point it at their instance.",
        values: ["You configure", "Included", "Included"],
        cellDetails: {
          "You configure":
            "Distribute the Device Agent and configure it to report to your instance.",
          Included:
            "Install the Device Agent on employee devices to report to your Probo Cloud account.",
        },
      },
      {
        label: "Disk encryption, screen lock and OS update checks",
        values: ["You configure", true, true],
        cellDetails: {
          "You configure":
            "Distribute the Device Agent and configure it to report to your instance.",
        },
        ossSetupContinuation: true,
      },
      {
        label: "Downloadable evidence for auditors",
        values: ["You configure", true, true],
        cellDetails: {
          "You configure":
            "Distribute the Device Agent and configure it to report to your instance.",
        },
        ossSetupContinuation: true,
      },
      {
        label: "We alert you on non-compliant devices",
        values: [false, true, true],
      },
    ],
  },
  {
    name: "Privacy",
    rows: [
      {
        label: "Records of processing activities",
        detail: "Processing activities, DPIAs, TIAs and rights requests.",
        values: [true, true, true],
      },
      {
        label: "Data protection impact assessments (DPIA)",
        values: [true, true, true],
      },
      {
        label: "Transfer impact assessments (TIA)",
        values: [true, true, true],
      },
      {
        label: "Data subject rights requests",
        values: [true, true, true],
      },
      {
        label: "AI system registry",
        values: [true, true, true],
      },
      {
        label: "We build and maintain your privacy registers",
        values: [false, false, true],
      },
    ],
  },
  {
    name: "Integrations",
    rows: [
      {
        label: "Built-in Integrations for your tools access monitoring",
        detail:
          "Connect tools including AWS, Google Cloud, GitHub, Slack, Okta and HubSpot. Self-hosted teams provide their own OAuth apps; Cloud integrations are ready to connect.",
        values: ["You configure", "Included", "Included"],
        cellDetails: {
          "You configure":
            "Create and configure your own OAuth app for each connector you use.",
          Included:
            "Authorize the connection in Probo. The OAuth app is already set up for you.",
        },
      },
      {
        label: "Two-way task sync with Linear",
        detail:
          "Create your own Linear OAuth app and connect it to your instance.",
        values: ["You configure", true, true],
        cellDetails: {
          "You configure":
            "Create your own Linear OAuth app and connect it to your instance.",
        },
        ossSetupContinuation: true,
      },
      {
        label: "Identity providers: Google Workspace, Microsoft, Okta...",
        detail:
          "Connect your identity provider to your self-hosted instance yourself.",
        values: ["You configure", true, true],
        cellDetails: {
          "You configure":
            "Connect your identity provider to your self-hosted instance yourself.",
        },
        ossSetupContinuation: true,
      },
      {
        label: "SSO",
        detail:
          "Connect an identity provider for single sign-on and user provisioning. Create a SAML or OIDC app in your identity provider pointing to your instance, then add its details in Probo.",
        values: ["You configure", true, true],
        cellDetails: {
          "You configure":
            "Create a SAML or OIDC app in your identity provider pointing to your instance, then add its details in Probo.",
        },
        ossSetupContinuation: true,
      },
      {
        label: "SCIM provisioning",
        detail:
          "Create your own OAuth app with your identity provider so Probo can sync users to your instance.",
        values: ["You configure", true, true],
        cellDetails: {
          "You configure":
            "Create your own OAuth app with your identity provider so Probo can sync users to your instance.",
        },
        ossSetupContinuation: true,
      },
      {
        label: "Slack app for notifications and access requests",
        detail: "Create and connect your own Slack app on your instance.",
        values: ["You configure", true, true],
        cellDetails: {
          "You configure":
            "Create and connect your own Slack app on your instance.",
        },
        ossSetupContinuation: true,
      },
      {
        label: "n8n official nodes",
        detail:
          "Use Probo nodes to connect the platform to your n8n workflows. Set up the Probo nodes in n8n and connect them to your instance.",
        values: ["You configure", true, true],
        cellDetails: {
          "You configure":
            "Set up the Probo nodes in n8n and connect them to your instance.",
        },
        ossSetupContinuation: true,
      },
      {
        label: "Webhooks",
        detail:
          "Send Probo events to the tools that handle your workflows. Choose the events to send and configure the endpoint that receives them.",
        values: ["You configure", true, true],
        cellDetails: {
          "You configure":
            "Choose the events to send and configure the endpoint that receives them.",
        },
        ossSetupContinuation: true,
      },
      {
        label: "We guide your team through SSO and SCIM setup",
        values: [false, false, true],
      },
    ],
  },
  {
    name: "Notifications",
    rows: [
      {
        label: "Approval and signature requests",
        values: ["You configure", true, true],
        cellDetails: {
          "You configure":
            "Set up email delivery (SMTP) on your instance to send approval and signature requests.",
        },
      },
      {
        label: "Automatic reminders for pending signatures and approvals",
        values: ["You configure", true, true],
        cellDetails: {
          "You configure":
            "Set up email delivery (SMTP) on your instance to send approval and signature requests.",
        },
        ossSetupContinuation: true,
      },
      {
        label: "Task assignment and due date alerts",
        values: ["You configure", true, true],
        cellDetails: {
          "You configure":
            "Set up email delivery (SMTP) on your instance to send approval and signature requests.",
        },
        ossSetupContinuation: true,
      },
      {
        label: "In-app and email delivery",
        values: ["You configure", true, true],
        cellDetails: {
          "You configure":
            "Set up email delivery (SMTP) on your instance to send approval and signature requests.",
        },
        ossSetupContinuation: true,
      },
      {
        label: "Slack notifications",
        values: ["You configure", true, true],
        cellDetails: {
          "You configure":
            "Set up email delivery (SMTP) on your instance to send approval and signature requests.",
        },
        ossSetupContinuation: true,
      },
    ],
  },
  {
    name: "Cookie Banner",
    rows: [
      {
        label: "Customizable banner for your website or app",
        detail: "Collect cookie preferences and keep a record of consent.",
        values: ["You configure", true, true],
        cellDetails: {
          "You configure":
            "Serve the banner script from your instance on a public URL.",
        },
      },
      {
        label: "Automatic cookie and tracker scan",
        values: ["You configure", true, true],
        cellDetails: {
          "You configure":
            "Serve the banner script from your instance on a public URL.",
        },
        ossSetupContinuation: true,
      },
      {
        label: "Consent categories you define",
        values: ["You configure", true, true],
        cellDetails: {
          "You configure":
            "Serve the banner script from your instance on a public URL.",
        },
        ossSetupContinuation: true,
      },
      {
        label: "Consent records kept as proof",
        values: ["You configure", true, true],
        cellDetails: {
          "You configure":
            "Serve the banner script from your instance on a public URL.",
        },
        ossSetupContinuation: true,
      },
      {
        label: "IAB TCF vendor list support",
        values: ["You configure", true, true],
        cellDetails: {
          "You configure":
            "Serve the banner script from your instance on a public URL.",
        },
        ossSetupContinuation: true,
      },
      {
        label: "Multi-language",
        values: ["You configure", true, true],
        cellDetails: {
          "You configure":
            "Serve the banner script from your instance on a public URL.",
        },
        ossSetupContinuation: true,
      },
      {
        label: "We set up your cookie banner",
        values: [false, false, true],
      },
    ],
  },
  {
    name: "Access and developer tools",
    rows: [
      {
        label: "Users, roles and permissions",
        detail: "Manage who can access Probo and what they can do.",
        values: ["You configure", true, true],
        cellDetails: {
          "You configure":
            "Set up email delivery (SMTP) on your instance to send invitations.",
        },
      },
      {
        label: "Unlimited users",
        detail:
          "Invite the people involved in your compliance program without a user cap.",
        values: [true, true, true],
      },
      {
        label: "Audit logs",
        detail: "Review the record of activity in Probo.",
        values: [true, true, true],
      },
      {
        label: "Full GraphQL API: do everything by API, MCP or CLI",
        detail: "Access the platform through the GraphQL API.",
        values: [true, true, true],
      },
      {
        label: "Probo MCP",
        detail:
          "Connect an MCP client to Probo and work within your existing permissions.",
        values: ["You configure", true, true],
        cellDetails: {
          "You configure":
            "Configure your MCP client to connect to your self-hosted Probo instance.",
        },
      },
    ],
  },
  {
    name: "Hosting and operations",
    rows: [
      {
        label: "Deployment",
        detail:
          "Self-host on Docker Compose or Kubernetes and operate your own email delivery, connector OAuth apps and public hosting. On Cloud, Probo hosts your account in the EU or the US and manages operations.",
        values: ["You configure", "Included", "Included"],
        cellDetails: {
          "You configure":
            "Deploy and run Probo on your own infrastructure with Docker Compose or Kubernetes.",
          Included: "Probo deploys and hosts your account in the EU or the US.",
        },
      },
      {
        label: "Updates and security patches",
        detail: "Who applies software updates and security patches.",
        values: ["You configure", "Included", "Included"],
        cellDetails: {
          "You configure":
            "Your team installs software updates and security patches on your instance.",
          Included:
            "Probo applies software updates and security patches for you.",
        },
      },
      {
        label: "Backups, monitoring and availability",
        detail:
          "Who runs backups and monitors the availability of the platform.",
        values: ["You configure", "Included", "Included"],
        cellDetails: {
          "You configure":
            "Your team backs up your data and monitors the availability of your instance.",
          Included:
            "Probo runs backups and monitors platform availability for you.",
        },
      },
      {
        label: "Data export at any time",
        detail: "Export your data whenever you need it.",
        values: ["You configure", true, true],
        cellDetails: {
          "You configure":
            "Your team sets up and operates this capability on your self-hosted instance.",
        },
      },
    ],
  },
  {
    name: "Support",
    rows: [
      {
        label: "Community support on GitHub and Discord",
        detail: "Ask questions and get help from the Probo community.",
        values: [true, true, true],
      },
      {
        label: "Priority technical support on Slack",
        detail: "Reach the Probo team on Slack for priority technical support.",
        values: [false, true, true],
      },
      {
        label: "Dedicated compliance officer on Slack and calls",
        detail:
          "Year-round advice on Slack and calls, quarterly security meetings, and answers to your team’s and prospects’ compliance questions. Your team makes decisions, implements technical changes and provides evidence we cannot collect. Plan for a few hours per month.",
        values: [false, false, true],
      },
    ],
  },
];
