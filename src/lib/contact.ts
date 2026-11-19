// Shared by the contact form (browser) and functions/api/contact.ts (edge).
// Option values are the HubSpot property values the inbound workflow writes,
// so the labels can change freely but the values cannot.

export type Option = { value: string; label: string };

// `id` is what the form tracks, `label` what it shows. `value` must be one of
// the options of the HubSpot deal property `seeked_compliances`; frameworks
// HubSpot does not list go in as "Other" with their name in the free text.
export type Framework = {
  id: string;
  label: string;
  value: string;
  logo?: string;
};

export const frameworks: Framework[] = [
  { id: "soc2", label: "SOC 2", value: "SOC 2", logo: "SOC2_TYPE2" },
  { id: "iso27001", label: "ISO 27001", value: "ISO 27001", logo: "ISO27001" },
  { id: "gdpr", label: "GDPR", value: "GDPR", logo: "GDPR" },
  { id: "hipaa", label: "HIPAA", value: "HIPAA", logo: "HIPAA" },
  { id: "iso42001", label: "ISO 42001", value: "ISO 42001", logo: "ISO42001" },
  { id: "unsure", label: "Not sure yet", value: "I don't know" },
  { id: "iso27701", label: "ISO 27701", value: "ISO 27701", logo: "ISO27701" },
  { id: "dora", label: "DORA", value: "DORA", logo: "DORA" },
  { id: "nis2", label: "NIS2", value: "Other", logo: "NIS2" },
  { id: "pci-dss", label: "PCI DSS", value: "PCI DSS" },
  { id: "hds", label: "HDS", value: "HDS" },
  { id: "eu-ai-act", label: "EU AI Act", value: "Other" },
  { id: "ccpa", label: "CCPA", value: "CCPA", logo: "CCPA" },
  { id: "casa", label: "CASA", value: "CASA", logo: "CASA" },
  { id: "soc3", label: "SOC 3", value: "SOC 3", logo: "SOC3" },
  { id: "ferpa", label: "FERPA", value: "FERPA", logo: "FERPA" },
  { id: "hitrust", label: "HITRUST", value: "HITRUST" },
  { id: "fedramp", label: "FedRAMP", value: "FedRAMP" },
  { id: "cmmc", label: "CMMC", value: "Other" },
  { id: "nist-csf", label: "NIST CSF", value: "Other" },
  { id: "21-cfr-11", label: "21 CFR Part 11", value: "21 CFR Part 11" },
];

export const primaryFrameworkCount = 6;

export const exploringTiming = "Just curious!";

export const timings: Option[] = [
  { value: "ASAP", label: "ASAP" },
  { value: "3 months +", label: "3 months or more" },
  { value: exploringTiming, label: "Just exploring" },
];

export const sources: string[] = [
  "A friend",
  "LinkedIn",
  "YC",
  "Web search",
  "AI chatbot",
  "Hacker News",
  "Product Hunt",
  "Reddit",
  "Hexa",
  "Other",
  "I don't know",
];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const personalEmailDomains = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "yahoo.fr",
  "yahoo.co.uk",
  "yahoo.co.in",
  "yahoo.in",
  "ymail.com",
  "hotmail.com",
  "hotmail.fr",
  "hotmail.co.uk",
  "outlook.com",
  "outlook.fr",
  "live.com",
  "live.fr",
  "msn.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
  "pm.me",
  "gmx.com",
  "gmx.de",
  "gmx.fr",
  "mail.com",
  "yandex.com",
  "yandex.ru",
  "zoho.com",
  "zohomail.in",
  "rediffmail.com",
  "qq.com",
  "163.com",
  "126.com",
  "duck.com",
  "hey.com",
  "fastmail.com",
  "tutanota.com",
  "orange.fr",
  "free.fr",
  "wanadoo.fr",
  "laposte.net",
  "sfr.fr",
  "web.de",
  "gamil.com",
  "gmial.com",
  "gmai.com",
  "ggmail.com",
]);

export type EmailStatus = "valid" | "invalid" | "personal";

export function emailDomain(email: string): string {
  return email.trim().toLowerCase().split("@")[1] ?? "";
}

export function checkEmail(email: string): EmailStatus {
  const value = email.trim().toLowerCase();
  if (!emailRegex.test(value)) return "invalid";
  if (personalEmailDomains.has(emailDomain(value))) return "personal";
  return "valid";
}

const websiteRegex = /^([a-z0-9-]+\.)+[a-z]{2,}$/;

// "https://www.acme.com/about" -> "acme.com"; "" when it is not a domain.
export function normalizeWebsite(value: string): string {
  const host = value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split(/[/?#]/)[0];
  return websiteRegex.test(host) ? host : "";
}

const secondLevelSuffixes = new Set(["co", "com", "org", "net", "ac", "gov"]);

// Best guess shown in the form for the visitor to correct:
// "acme-labs.co.uk" -> "Acme Labs".
export function companyFromDomain(domain: string): string {
  const labels = domain.split(".").filter(Boolean);
  if (labels.length < 2) return "";
  labels.pop();
  if (labels.length > 1 && secondLevelSuffixes.has(labels[labels.length - 1])) {
    labels.pop();
  }
  return labels[labels.length - 1]
    .split("-")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

// First step of the form: the work email alone, sent on "Continue".
export type ContactEmailPayload = {
  stage: "email";
  email: string;
  pageUrl?: string;
  referrer?: string;
  utm?: Record<string, string>;
  fax?: string;
};

// "Chat with us on Slack instead", sent after the full form.
export type ContactSlackPayload = {
  stage: "slack";
  email: string;
  firstName?: string;
  lastName?: string;
  website?: string;
  pageUrl?: string;
  referrer?: string;
  utm?: Record<string, string>;
};

export type ContactPayload = {
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  website?: string;
  // Framework ids, plus anything typed with "Add yours".
  frameworks: string[];
  otherFramework?: string;
  timing: string;
  source?: string;
  pageUrl?: string;
  referrer?: string;
  utm?: Record<string, string>;
  // Ticked "Also open a shared Slack channel with our team".
  slack?: boolean;
  // Which path the visitor chose: book a call, or a Slack invite only.
  intent?: "call" | "slack";
  // Honeypot: real visitors never see or fill it.
  fax?: string;
};
