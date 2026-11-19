import {
  checkEmail,
  companyFromDomain,
  emailDomain,
  frameworks,
  normalizeWebsite,
  sources,
  timings,
  type ContactPayload,
} from "../../src/lib/contact";

type Env = {
  N8N_CONTACT_WEBHOOK_URL: string;
  WEBHOOK_AUTH_USERNAME: string;
  WEBHOOK_AUTH_PASSWORD: string;
};

const frameworksById = new Map(frameworks.map((f) => [f.id, f]));
const timingValues = new Set(timings.map((t) => t.value));
const sourceValues = new Set(sources);
const utmKeys = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
];

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function choice(label: string, values: string[]) {
  return {
    label,
    type: "MULTIPLE_CHOICE",
    value: values,
    options: values.map((value) => ({ id: value, text: value })),
  };
}

async function forward(env: Env, payload: unknown): Promise<Response> {
  const auth = btoa(
    `${env.WEBHOOK_AUTH_USERNAME}:${env.WEBHOOK_AUTH_PASSWORD}`,
  );

  const webhookResponse = await fetch(env.N8N_CONTACT_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify(payload),
  });

  if (!webhookResponse.ok) {
    console.error(
      "cannot process contact submission:",
      await webhookResponse.text(),
    );

    return json({ error: "internal server error" }, 500);
  }

  return json({}, 200);
}

export async function onRequestPost(context: {
  request: Request;
  env: Env;
}): Promise<Response> {
  try {
    const { request, env } = context;

    const origin = request.headers.get("Origin");
    if (origin && new URL(origin).host !== new URL(request.url).host) {
      return json({ error: "forbidden" }, 403);
    }

    let input: Partial<ContactPayload> & { stage?: string };
    try {
      input = await request.json();
    } catch {
      return json({ error: "invalid request" }, 400);
    }

    // Bots fill every field: accept silently so they do not retry.
    if (text(input.fax, 200)) {
      return json({}, 200);
    }

    const email = text(input.email, 254).toLowerCase();
    const emailStatus = checkEmail(email);
    if (emailStatus === "invalid") {
      return json(
        { error: "invalid email format", code: "invalid_email" },
        400,
      );
    }
    if (emailStatus === "personal") {
      return json(
        { error: "a work email is required", code: "personal_email" },
        422,
      );
    }

    const utm: Record<string, string> = {};
    for (const key of utmKeys) {
      const value = text(input.utm?.[key], 200);
      if (value) utm[key] = value;
    }

    const language = input.language === "fr" ? "fr" : "en";
    const pageContext = {
      pageUrl: text(input.pageUrl, 500),
      referrer: text(input.referrer, 500),
      utm,
    };

    // Step one of the form: the work email alone. The workflow creates the
    // contact if it is new and leaves existing contacts untouched.
    if (input.stage === "email") {
      return forward(env, {
        eventType: "CONTACT_EMAIL",
        createdAt: new Date().toISOString(),
        data: { email, website: emailDomain(email), language },
        context: pageContext,
      });
    }

    const firstName = text(input.firstName, 100);
    const lastName = text(input.lastName, 100);
    const website =
      normalizeWebsite(text(input.website, 253)) || emailDomain(email);

    // Slack Connect asked for on its own, after the form was submitted
    // ("Chat with us on Slack instead"). The contact already exists; the
    // workflow only has to open the channel and send the invite.
    if (input.stage === "slack") {
      return forward(env, {
        eventType: "SLACK_CONNECT_REQUEST",
        createdAt: new Date().toISOString(),
        data: { email, firstName, lastName, website, language },
        context: pageContext,
      });
    }
    // The form no longer asks for the company name: HubSpot gets a name
    // derived from the website ("acme-labs.co.uk" -> "Acme Labs").
    const company =
      text(input.company, 150) || companyFromDomain(website) || website;
    const timing = text(input.timing, 50);
    const source = text(input.source, 50);
    const picked = Array.isArray(input.frameworks)
      ? input.frameworks.flatMap((id) => frameworksById.get(id) ?? [])
      : [];
    // Frameworks HubSpot has no option for, and anything typed in, travel as
    // "Other" with their names in the free-text field.
    const otherNames = [
      ...picked.filter((f) => f.value === "Other").map((f) => f.label),
      text(input.otherFramework, 300),
    ].filter(Boolean);
    const selected = [...new Set(picked.map((f) => f.value))];
    if (otherNames.length > 0 && !selected.includes("Other")) {
      selected.push("Other");
    }

    if (!firstName || !lastName) {
      return json({ error: "first and last name are required" }, 400);
    }

    if (selected.length === 0 || !timingValues.has(timing)) {
      return json({ error: "framework and timeline are required" }, 400);
    }

    // The inbound workflow parses Tally's FORM_RESPONSE payload by field
    // label, so this mirrors that shape and the workflow stays unchanged.
    const now = new Date().toISOString();
    const responseId = crypto.randomUUID();
    const payload = {
      eventId: responseId,
      eventType: "FORM_RESPONSE",
      createdAt: now,
      data: {
        responseId,
        formId: "probo-contact",
        formName: "probo.com contact form",
        // Ticked "Also open a shared Slack channel with our team".
        slackConnect: input.slack === true,
        language,
        intent: input.intent === "slack" ? "slack" : "call",
        createdAt: now,
        fields: [
          { label: "First name", type: "INPUT_TEXT", value: firstName },
          { label: "Last name", type: "INPUT_TEXT", value: lastName },
          { label: "Email", type: "INPUT_EMAIL", value: email },
          { label: "Company", type: "INPUT_TEXT", value: company },
          {
            label: "What's your website?",
            type: "INPUT_TEXT",
            value: website,
          },
          choice("Which framework(s) do you need?", selected),
          {
            label: "What do you need?",
            type: "INPUT_TEXT",
            value: otherNames.join(", ") || null,
          },
          choice("When do you need to be compliant?", [timing]),
          {
            label: "What do you already have?",
            type: "MULTIPLE_CHOICE",
            value: null,
          },
          sourceValues.has(source)
            ? choice("How did you hear about us?", [source])
            : {
                label: "How did you hear about us?",
                type: "MULTIPLE_CHOICE",
                value: null,
              },
        ],
      },
      context: pageContext,
    };

    return forward(env, payload);
  } catch (error) {
    console.error("cannot process contact submission:", error);

    return json({ error: "internal server error" }, 500);
  }
}
