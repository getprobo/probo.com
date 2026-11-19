<script lang="ts">
  import { slide } from "svelte/transition";
  import Button from "./ui/Button.svelte";
  import Select from "./ui/Select.svelte";
  import FrameworkPicker from "./FrameworkPicker.svelte";
  import { capturePosthogEvent } from "../lib/posthog";
  import {
    checkEmail,
    emailDomain,
    exploringTiming,
    sources,
    timings,
    type ContactPayload,
  } from "../lib/contact";

  type Member = { name: string; image: string };

  let { team = [] }: { team?: Member[] } = $props();

  const discordUrl = "https://discord.com/invite/8qfdJYfvpY";
  const calendlyUrl = "https://calendly.com/d/cx3w-dsm-xsh/15min-with-probo";

  let step = $state<
    "form" | "community" | "schedule" | "explore" | "booked" | "slack"
  >("form");
  // "on" from the checkbox, "sent" once a Slack invite has been asked for.
  let slackChecked = $state(false);
  // Two ways in: book a call, or get invited to a shared Slack channel.
  // Same form either way; /contact?via=slack opens on the Slack one.
  let mode = $state<"call" | "slack">("call");
  let slackRequested = $state(false);
  let slackSending = $state(false);
  let email = $state("");
  let firstName = $state("");
  let lastName = $state("");
  let website = $state("");
  let websiteEdited = $state(false);
  let fax = $state("");
  let detailsOpen = $state(false);
  let firstNameEl = $state<HTMLInputElement>();
  let selected = $state<string[]>([]);
  let customFrameworks = $state<string[]>([]);
  let timing = $state("");
  let source = $state("");
  let emailTouched = $state(false);
  let submitted = $state(false);
  let submitting = $state(false);
  let serverError = $state("");
  let started = false;
  let scheduleHeight = $state(720);
  let scheduleEl = $state<HTMLElement>();

  const emailStatus = $derived(checkEmail(email));
  const showEmailError = $derived(
    emailStatus === "invalid" &&
      (submitted || (emailTouched && email.trim() !== "")),
  );
  const noFrameworks = $derived(
    selected.length === 0 && customFrameworks.length === 0,
  );
  // Ids of what still blocks the submit, in form order, so the first one
  // can take focus.
  const missing = $derived(
    [
      emailStatus !== "valid" && "contact-email",
      !firstName.trim() && "contact-first-name",
      !lastName.trim() && "contact-last-name",
      noFrameworks && "contact-frameworks",
      !timing && "contact-timing",
    ].filter((id): id is string => Boolean(id)),
  );
  const exploring = $derived(timing === exploringTiming);
  const scheduleSrc = $derived.by(() => {
    const params = new URLSearchParams({
      embed_type: "Inline",
      embed_domain: typeof location === "undefined" ? "" : location.hostname,
      hide_gdpr_banner: "1",
      hide_event_type_details: "1",
      background_color: "ffffff",
      text_color: "141e12",
      primary_color: "141e12",
      name: `${firstName} ${lastName}`.trim(),
      email: email.trim().toLowerCase(),
    });
    return `${calendlyUrl}?${params}`;
  });

  const inputClass =
    "border-border-mid placeholder:text-quaternary/70 bg-level-1 focus-visible:outline-primary h-12 w-full rounded-lg border px-3 focus-visible:outline-2 focus-visible:-outline-offset-1 aria-invalid:border-error aria-invalid:focus-visible:outline-error";
  const chipClass =
    "border-border-mid bg-level-1 hover:bg-highlight aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground focus-visible:outline-primary h-10 rounded-full border px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2";

  function markStarted() {
    if (started) return;
    started = true;
    capturePosthogEvent("contact_form_started");
  }

  function utmParams(): Record<string, string> {
    const utm: Record<string, string> = {};
    new URLSearchParams(location.search).forEach((value, key) => {
      if (key.startsWith("utm_")) utm[key] = value;
    });
    return utm;
  }

  function context() {
    return {
      fax,
      pageUrl: location.origin + location.pathname,
      referrer: document.referrer,
      utm: utmParams(),
    };
  }

  // Step one: the visitor explicitly hands over their work email, so the
  // lead exists even if they never finish the rest of the form.
  // Calls are for companies. A personal address is not sent anywhere: the
  // visitor is pointed to the community instead.
  function showCommunity() {
    capturePosthogEvent("contact_personal_email");
    step = "community";
  }

  function handleContinue() {
    if (emailStatus === "personal") return showCommunity();
    if (emailStatus !== "valid") {
      submitted = true;
      return;
    }
    submitted = false;
    detailsOpen = true;
    saveEmail().catch((error) =>
      console.error("cannot save contact email:", error),
    );
  }

  function saveEmail() {
    capturePosthogEvent("contact_email_submitted");
    return fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage: "email", email, ...context() }),
    });
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!detailsOpen) return handleContinue();
    if (emailStatus === "personal") return showCommunity();
    submitted = true;
    serverError = "";
    if (missing.length > 0) {
      document.getElementById(missing[0])?.focus();
      return;
    }

    const payload: ContactPayload = {
      email,
      firstName,
      lastName,
      website,
      frameworks: selected,
      otherFramework: customFrameworks.join(", "),
      timing,
      source,
      slack: mode === "slack" || slackChecked,
      intent: mode,
      ...context(),
    };

    submitting = true;
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        serverError =
          result.code === "personal_email"
            ? "To book a call, please use your work email."
            : "Something went wrong. Please try again.";
        return;
      }

      capturePosthogEvent("contact_form_submitted", {
        frameworks: [...selected, ...customFrameworks].join(", "),
        timing,
        slack: String(mode === "slack" || slackChecked),
        mode,
      });
      if (mode === "slack" || slackChecked) slackRequested = true;
      step = mode === "slack" ? "slack" : exploring ? "explore" : "schedule";
    } catch (error) {
      console.error("cannot submit contact form:", error);
      serverError = "Something went wrong. Please try again.";
    } finally {
      submitting = false;
    }
  }

  // "Chat with us on Slack instead": the lead already exists, this only
  // asks the workflow to open the shared channel.
  async function requestSlack() {
    if (slackRequested) {
      step = "slack";
      return;
    }
    slackSending = true;
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage: "slack",
          email,
          firstName,
          lastName,
          website,
          ...context(),
        }),
      });
      if (!response.ok) throw new Error(`status ${response.status}`);
      capturePosthogEvent("contact_slack_requested", { from: step });
      slackRequested = true;
      step = "slack";
    } catch (error) {
      console.error("cannot request Slack channel:", error);
      serverError = "Something went wrong. Please try again.";
    } finally {
      slackSending = false;
    }
  }

  $effect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== "https://calendly.com") return;
      if (e.data?.event === "calendly.page_height") {
        const height = parseInt(e.data.payload?.height, 10);
        if (height > 0) scheduleHeight = height;
      } else if (e.data?.event === "calendly.event_scheduled") {
        capturePosthogEvent("contact_meeting_booked");
        step = "booked";
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  });

  // Prefill the website from the work email until the visitor types their
  // own, since the email domain is not always the website.
  $effect(() => {
    if (emailStatus !== "valid") return;
    const domain = emailDomain(email);
    if (!websiteEdited) website = domain;
  });

  $effect(() => {
    if (new URLSearchParams(location.search).get("via") === "slack") {
      mode = "slack";
    }
  });

  function switchMode(next: "call" | "slack") {
    if (mode === next) return;
    mode = next;
    capturePosthogEvent("contact_mode_switch", { mode: next });
  }

  $effect(() => {
    firstNameEl?.focus({ preventScroll: true });
  });

  $effect(() => {
    scheduleEl?.scrollIntoView({ block: "start", behavior: "smooth" });
  });
</script>

{#snippet avatars(size: string)}
  {#if team.length > 0}
    <ul
      class="flex flex-none -space-x-2"
      aria-label="Who you will talk to: {team.map((m) => m.name).join(', ')}"
    >
      {#each team as member (member.name)}
        <li>
          <img
            src={member.image}
            alt={member.name}
            title={member.name}
            width="56"
            height="56"
            class="{size} border-level-1 rounded-full border-2 object-cover"
          />
        </li>
      {/each}
    </ul>
  {/if}
{/snippet}

{#snippet slackOffer(lead: string | null)}
  {#if slackRequested}
    <p
      class="border-border-low text-muted-foreground rounded-xl border p-4 text-sm"
    >
      Your Slack invite is on its way to {email}.
    </p>
  {:else}
    <div
      class="border-border-low flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div class="flex items-start gap-3">
        <img
          src="/logos/slack.svg"
          alt=""
          width="20"
          height="20"
          class="mt-0.5 size-5 flex-none"
        />
        <div>
          <p class="font-medium">
            {lead ? `${lead} Chat with us on Slack` : "Chat with us on Slack"}
          </p>
          <p class="text-muted-foreground text-sm">
            A shared channel with our team. Ask anything, at your own pace.
          </p>
        </div>
      </div>
      <Button
        type="button"
        variant={lead ? "secondary" : "primary"}
        class="flex-none"
        disabled={slackSending}
        onclick={requestSlack}
      >
        {slackSending ? "Opening..." : "Open a channel"}
      </Button>
    </div>
  {/if}
{/snippet}

{#if step === "form"}
  <form
    class="flex flex-col gap-6"
    novalidate
    onsubmit={handleSubmit}
    oninput={markStarted}
  >
    <div
      class="bg-highlight grid grid-cols-2 gap-1 rounded-full p-1"
      role="group"
      aria-label="How do you want to talk to us?"
    >
      {#each [{ id: "call", label: "Book a call" }, { id: "slack", label: "Get a Slack invite" }] as option (option.id)}
        <button
          type="button"
          class="aria-pressed:bg-level-1 aria-pressed:text-foreground aria-pressed:shadow-btn text-muted-foreground hover:text-foreground focus-visible:outline-primary flex h-9 items-center justify-center gap-2 rounded-full text-sm font-medium transition-colors focus-visible:outline-2"
          aria-pressed={mode === option.id}
          onclick={() => switchMode(option.id as "call" | "slack")}
        >
          {#if option.id === "slack"}
            <img
              src="/logos/slack.svg"
              alt=""
              width="14"
              height="14"
              class="size-3.5"
            />
          {/if}
          {option.label}
        </button>
      {/each}
    </div>

    <div class="flex items-center justify-between gap-4">
      <div>
        <h2 class="text-h5 font-medium">
          {mode === "slack"
            ? "Chat with our team on Slack"
            : "Book a 15 minute call"}
        </h2>
      </div>
      {@render avatars("size-8")}
    </div>

    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium" for="contact-email">Work email</label>
      <input
        id="contact-email"
        class={inputClass}
        type="email"
        name="email"
        autocomplete="email"
        placeholder="jane@company.com"
        required
        aria-invalid={showEmailError}
        aria-describedby="contact-email-hint"
        bind:value={email}
        onblur={() => (emailTouched = true)}
      />
      <p
        id="contact-email-hint"
        class="text-muted-foreground text-sm"
        class:hidden={!showEmailError}
        aria-live="polite"
      >
        {#if showEmailError}
          <span class="text-error font-medium"
            >Enter a valid email address.</span
          >
        {/if}
      </p>
    </div>

    <div class="hidden" aria-hidden="true">
      <label for="contact-fax">Fax</label>
      <input
        id="contact-fax"
        name="fax"
        tabindex="-1"
        autocomplete="off"
        bind:value={fax}
      />
    </div>

    {#if detailsOpen}
      <div class="flex flex-col gap-6" transition:slide={{ duration: 250 }}>
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium" for="contact-first-name"
              >First name</label
            >
            <input
              id="contact-first-name"
              class={inputClass}
              bind:this={firstNameEl}
              name="firstName"
              autocomplete="given-name"
              required
              aria-invalid={submitted && !firstName.trim()}
              bind:value={firstName}
            />
            {#if submitted && !firstName.trim()}
              <p class="text-error text-sm">Enter your first name.</p>
            {/if}
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium" for="contact-last-name"
              >Last name</label
            >
            <input
              id="contact-last-name"
              class={inputClass}
              name="lastName"
              autocomplete="family-name"
              required
              aria-invalid={submitted && !lastName.trim()}
              bind:value={lastName}
            />
            {#if submitted && !lastName.trim()}
              <p class="text-error text-sm">Enter your last name.</p>
            {/if}
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium" for="contact-website"
            >Company website</label
          >
          <input
            id="contact-website"
            class={inputClass}
            name="website"
            inputmode="url"
            autocomplete="url"
            placeholder="company.com"
            bind:value={website}
            oninput={() => (websiteEdited = true)}
          />
        </div>

        <fieldset
          id="contact-frameworks"
          tabindex="-1"
          class="flex flex-col gap-3 outline-none"
        >
          <legend class="mb-3 text-sm font-medium">
            Which frameworks do you need?
          </legend>
          <FrameworkPicker
            bind:selected
            bind:custom={customFrameworks}
            invalid={submitted && noFrameworks}
          />
          {#if submitted && noFrameworks}
            <p class="text-error text-sm" role="alert">
              Pick at least one, or "Not sure yet".
            </p>
          {/if}
        </fieldset>

        <fieldset
          id="contact-timing"
          tabindex="-1"
          class="flex flex-col gap-3 outline-none"
        >
          <legend class="mb-3 text-sm font-medium">
            When do you need to be compliant?
          </legend>
          <div class="flex flex-wrap gap-2">
            {#each timings as option (option.value)}
              <button
                type="button"
                class={chipClass}
                class:border-error={submitted && !timing}
                aria-pressed={timing === option.value}
                onclick={() => (timing = option.value)}
              >
                {option.label}
              </button>
            {/each}
          </div>
          {#if submitted && !timing}
            <p class="text-error text-sm" role="alert">Pick a timeline.</p>
          {/if}
        </fieldset>

        <div class="flex flex-col gap-2">
          <span id="contact-source-label" class="text-sm font-medium">
            How did you hear about us?
            <span class="text-muted-foreground font-normal">Optional</span>
          </span>
          <Select
            id="contact-source"
            labelId="contact-source-label"
            options={sources}
            bind:value={source}
          />
        </div>
      </div>
    {/if}

    {#if detailsOpen && mode === "call"}
      <label
        class="border-border-mid has-checked:border-primary has-checked:bg-subtle flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors"
      >
        <input
          type="checkbox"
          class="accent-primary mt-0.5 size-4 flex-none"
          bind:checked={slackChecked}
        />
        <span class="flex flex-col gap-1">
          <span class="flex items-center gap-1.5 text-sm font-medium">
            I want to receive a
            <img
              src="/logos/slack.svg"
              alt=""
              width="16"
              height="16"
              class="size-4"
            />
            Slack channel invite
          </span>
          <span class="text-muted-foreground text-sm">
            For your questions before and after the call. No marketing.
          </span>
        </span>
      </label>
    {/if}

    {#if serverError}
      <p class="text-error text-sm" role="alert">{serverError}</p>
    {:else if detailsOpen && submitted && missing.length > 0}
      <p class="text-error text-sm" role="alert">
        Fill in the highlighted fields to continue.
      </p>
    {/if}

    <Button
      type="submit"
      size="lg"
      class="w-full text-base"
      disabled={submitting}
    >
      {#if !detailsOpen}
        Continue
      {:else if submitting}
        Sending...
      {:else if mode === "slack"}
        Invite me on Slack
      {:else if exploring}
        Continue
      {:else}
        Pick a time
      {/if}
    </Button>
  </form>
{:else if step === "community"}
  <div class="flex flex-col gap-6">
    <div>
      <h2 class="text-h5 font-medium">Join the Probo community</h2>
      <p class="text-muted-foreground mt-2">
        Exploring compliance on your own? Our Discord is a great place to start:
        ask questions, get help with the open-source platform and follow what we
        ship.
      </p>
    </div>
    <Button
      href={discordUrl}
      target="_blank"
      rel="noopener noreferrer"
      size="lg"
      class="w-full text-base"
      data-ph-event="contact_discord_click"
    >
      Join the Discord
    </Button>
    <ul class="flex flex-col gap-2">
      {#each [{ href: "/docs", title: "Documentation", text: "See how the platform works." }, { href: "https://github.com/getprobo/probo", title: "GitHub", text: "Read the code or self-host it." }] as link (link.href)}
        <li>
          <a
            href={link.href}
            class="border-border-low hover:bg-highlight flex flex-col rounded-xl border px-4 py-3 transition-colors"
          >
            <span class="font-medium">{link.title}</span>
            <span class="text-muted-foreground text-sm">{link.text}</span>
          </a>
        </li>
      {/each}
    </ul>
    <button
      type="button"
      class="text-muted-foreground hover:text-foreground self-start text-sm underline"
      onclick={() => {
        email = "";
        step = "form";
      }}
    >
      Booking for your company? Use your work email
    </button>
  </div>
{:else if step === "schedule"}
  <div
    class="contact-schedule flex scroll-mt-24 flex-col gap-4"
    bind:this={scheduleEl}
  >
    <div class="flex flex-col items-center gap-4 text-center">
      {@render avatars("size-14")}
      <div>
        <h2 class="text-h4 font-medium">Thanks {firstName}, pick a time</h2>
        <p class="text-muted-foreground mt-2 text-lg">
          15 minutes with one of our compliance experts.
        </p>
      </div>
    </div>
    <iframe
      src={scheduleSrc}
      title="Book a 15 minute call with Probo"
      class="w-full"
      style:height="{scheduleHeight}px"
    ></iframe>
    {@render slackOffer("Not ready to book?")}
  </div>
{:else if step === "explore"}
  <div class="flex flex-col gap-6">
    <div>
      <h2 class="text-h5 font-medium">
        Thanks {firstName}, good place to start
      </h2>
      <p class="text-muted-foreground mt-1">
        No rush. Ask us anything on Slack, at your own pace, or look around on
        your own.
      </p>
    </div>
    {@render slackOffer(null)}
    <ul class="flex flex-col gap-2">
      {#each [{ href: "/pricing", title: "Pricing", text: "Compare open source, cloud and done-for-you." }, { href: "/docs", title: "Documentation", text: "See how the platform works." }, { href: "https://github.com/getprobo/probo", title: "GitHub", text: "Read the code or self-host it." }] as link (link.href)}
        <li>
          <a
            href={link.href}
            class="border-border-low hover:bg-highlight flex flex-col rounded-xl border px-4 py-3 transition-colors"
          >
            <span class="font-medium">{link.title}</span>
            <span class="text-muted-foreground text-sm">{link.text}</span>
          </a>
        </li>
      {/each}
    </ul>
    <Button
      type="button"
      variant="secondary"
      size="lg"
      class="w-full text-base"
      onclick={() => (step = "schedule")}
    >
      Book a 15 minute call anyway
    </Button>
  </div>
{:else if step === "slack"}
  <div class="flex flex-col gap-4">
    {@render avatars("size-10")}
    <div>
      <h2 class="text-h5 font-medium">
        Check your inbox{firstName ? `, ${firstName}` : ""}
      </h2>
      <p class="text-muted-foreground mt-1">
        We are opening a shared Slack channel with our team and sending the
        invite to {email}. It comes from Slack, so it can take a few minutes.
      </p>
    </div>
    <Button
      type="button"
      variant="secondary"
      size="lg"
      class="w-full text-base"
      onclick={() => (step = "schedule")}
    >
      Book a 15 minute call too
    </Button>
  </div>
{:else}
  <div>
    <h2 class="text-h5 font-medium">You are booked, {firstName}</h2>
    <p class="text-muted-foreground mt-1">
      A calendar invite is on its way to {email}.
      {#if slackRequested}
        So is an invite to your shared Slack channel with our team.
      {/if}
      Talk soon.
    </p>
  </div>
{/if}
