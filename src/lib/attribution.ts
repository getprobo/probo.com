// Where a contact-form lead came from, kept for the visitor's current tab
// session only (sessionStorage: nothing survives the tab, nothing leaves the
// browser until the visitor submits the form).
//
// - The first UTMs, landing page and outside referrer of the session, so an
//   ad that lands on the home page is still known when /contact is submitted.
// - The last link to /contact the visitor clicked: its `data-cta` label
//   ("pricing-probo-cloud") and the page it was on.
//
// The site uses Astro's client router, so `document.referrer` stays the
// entry referrer for the whole session and cannot tell which page linked to
// /contact. The click record does.

export const utmKeys = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

const storageKey = "probo:attribution";
// A CTA click older than this is not credited to a later /contact visit.
const ctaMaxAgeMs = 30 * 60 * 1000;

type Stored = {
  utm?: Record<string, string>;
  landingPage?: string;
  entryReferrer?: string;
  cta?: string;
  ctaPage?: string;
  ctaAt?: number;
};

export type Attribution = {
  utm: Record<string, string>;
  landingPage?: string;
  entryReferrer?: string;
  cta?: string;
  ctaPage?: string;
};

function load(): Stored {
  try {
    return JSON.parse(sessionStorage.getItem(storageKey) ?? "{}") ?? {};
  } catch {
    return {};
  }
}

function save(value: Stored) {
  try {
    sessionStorage.setItem(storageKey, JSON.stringify(value));
  } catch {
    // Storage blocked: the form still sends what the current URL holds.
  }
}

function utmFrom(search: string): Record<string, string> {
  const params = new URLSearchParams(search);
  const utm: Record<string, string> = {};
  for (const key of utmKeys) {
    const value = params.get(key)?.trim();
    if (value) utm[key] = value.slice(0, 200);
  }
  return utm;
}

function externalReferrer(): string | undefined {
  try {
    if (!document.referrer) return undefined;
    const url = new URL(document.referrer);
    return url.host === location.host ? undefined : url.href;
  } catch {
    return undefined;
  }
}

// "/" -> "home", "/hub/soc2/" -> "hub-soc2".
function pageSlug(path: string): string {
  const slug = path.replace(/^\/+|\/+$/g, "").replace(/\//g, "-");
  return slug || "home";
}

function isContactLink(link: HTMLAnchorElement): boolean {
  try {
    const url = new URL(link.href, location.href);
    const sameSite = url.host === location.host || url.host === "www.probo.com";
    return sameSite && url.pathname.replace(/\/$/, "") === "/contact";
  } catch {
    return false;
  }
}

// Call on every page view (first load and each client-router swap).
export function recordVisit() {
  const stored = load();
  const utm = utmFrom(location.search);
  let changed = false;

  if (!stored.landingPage) {
    stored.landingPage = location.origin + location.pathname;
    stored.entryReferrer = externalReferrer();
    changed = true;
  }
  if (!stored.utm && Object.keys(utm).length > 0) {
    stored.utm = utm;
    changed = true;
  }
  if (changed) save(stored);
}

// Call from a document click listener. Labels come from `data-cta` on the
// link; unlabelled links fall back to "header", "footer" or the page slug.
export function recordContactClick(target: EventTarget | null) {
  if (!(target instanceof Element)) return;
  const link = target.closest<HTMLAnchorElement>("a[href]");
  if (!link || !isContactLink(link)) return;

  const label =
    link.dataset.cta ||
    link.closest("[data-cta-area]")?.getAttribute("data-cta-area") ||
    (link.closest("header") && "header") ||
    (link.closest("footer") && "footer") ||
    pageSlug(location.pathname);

  save({
    ...load(),
    cta: label.slice(0, 100),
    ctaPage: location.pathname,
    ctaAt: Date.now(),
  });
}

// Read on /contact when the form is sent. A `?from=` on the /contact URL
// (links in emails, LinkedIn, Slack) wins over a recorded click, and UTMs
// on the /contact URL win over the session's first ones.
export function readAttribution(): Attribution {
  const stored = load();
  const params = new URLSearchParams(location.search);
  const urlUtm = utmFrom(location.search);
  const from = params.get("from")?.trim().slice(0, 100);
  const freshClick =
    stored.cta && stored.ctaAt && Date.now() - stored.ctaAt < ctaMaxAgeMs;

  return {
    utm: Object.keys(urlUtm).length > 0 ? urlUtm : (stored.utm ?? {}),
    landingPage: stored.landingPage,
    entryReferrer: stored.entryReferrer ?? externalReferrer(),
    cta: from || (freshClick ? stored.cta : undefined),
    ctaPage: from ? undefined : freshClick ? stored.ctaPage : undefined,
  };
}
