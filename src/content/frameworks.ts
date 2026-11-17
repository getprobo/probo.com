type Framework = {
  label: string;
  badge: string;
  badgeDark?: string;
  /** Guide page for the framework. Badges link to it when set. */
  href?: string;
};

export const frameworks: Framework[] = [
  { label: "SOC 2", badge: "SOC2_TYPE2", href: "/hub/soc2" },
  {
    label: "SOC 2 Type 1",
    badge: "SOC2_TYPE1",
    href: "/hub/soc2-type1-vs-type2",
  },
  { label: "SOC 2 Type 2", badge: "SOC2_TYPE2", href: "/hub/soc2" },
  { label: "SOC 3", badge: "SOC3" },
  {
    label: "ISO 27001",
    badge: "ISO27001",
    badgeDark: "ISO27001_dark",
    href: "/hub/iso27001",
  },
  { label: "ISO 27701", badge: "ISO27701", badgeDark: "ISO27701_dark" },
  { label: "ISO 42001", badge: "ISO42001", badgeDark: "ISO42001_dark" },
  // GDPR badge is renamed to avoid being blocked by adblockers
  { label: "GDPR", badge: "JetDePierre" },
  { label: "CCPA", badge: "CCPA" },
  { label: "HIPAA", badge: "HIPAA" },
  { label: "FERPA", badge: "FERPA" },
  { label: "CASA", badge: "CASA" },
];

export function frameworkBadgeAlt(name: string): string {
  const key = name.replace(/_dark$/, "");
  const match = frameworks.find(
    (framework) => framework.badge === key || framework.badgeDark === name,
  );
  const label = match?.label ?? key.replaceAll("_", " ");
  return `${label} compliance badge`;
}
