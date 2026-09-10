<script lang="ts">
  import { flushSync, onMount } from "svelte";

  const categories = [
    {
      title: "Risks",
      steps: [
        "List",
        "Show me our biggest risks",
        "Show me our biggest risks and suggest mitigations for the top 3",
        "Show me our biggest risks and suggest mitigations for the top 3. Turn those into tasks with suggested owners",
      ],
      tools: 49,
      description:
        "Create, score, and update risks, then link them to the measures that treat them.",
    },
    {
      title: "Documents and approvals",
      steps: [
        "Update our access policy for contractors, highlight what changed and prepare the new version for approval",
      ],
      tools: 25,
      description:
        "Draft policies, request signatures, and move versions through approval quorums.",
    },
    {
      title: "Privacy",
      steps: [
        "Which processing activities need a DPIA?",
        "Which processing activities need a DPIA? Draft one for the highest-risk activity and flag what you need from me",
      ],
      tools: 23,
      description:
        "Handle processing activities, DPIAs, transfer assessments, and rights requests.",
    },
    {
      title: "Access reviews",
      steps: [
        "Review all accounts",
        "Review admin accounts first",
        "Review admin accounts first and flag access that looks unnecessary",
        "Review admin accounts first and flag access that looks unnecessary. Group it by owner so I can follow up",
      ],
      tools: 18,
      description:
        "Run campaigns, pull entries from connected sources, and record decisions.",
    },
    {
      title: "Frameworks and controls",
      steps: [
        "What's missing for ISO 27001",
        "What's missing for SOC 2? Map the gaps to our controls and make a checklist",
        "What's missing for SOC 2? Map the gaps to our controls and make a checklist, ordered by priority",
      ],
      tools: 16,
      description:
        "Map controls to SOC 2, ISO 27001, and every framework in your organization.",
    },
    {
      title: "Audits and findings",
      steps: [
        "Summarize the open findings from our last audit and link each one to its supporting evidence",
        "Summarize the open findings from our last audit and link each one to its supporting evidence. Draft a follow-up plan too",
      ],
      tools: 16,
      description:
        "Track audits, log findings, and tie evidence back to the controls it supports.",
    },
  ];

  const categoryCount = categories.length;
  const loopedCategories = Array.from({ length: 3 }, (_, copy) =>
    categories.map((category, index) => ({ category, index, copy })),
  ).flat();

  let gallery: HTMLElement;
  let viewport: HTMLDivElement;
  let active = $state(3);
  let reducedMotion = $state(false);
  let revealed = $state(false);
  let animateSelection = $state(false);
  let scrollFrame = 0;
  let centeringFrame = 0;
  let centering = false;
  const cycleDuration = 8000;
  const startDelay = 500;
  const typingDelay = 24;
  const deletingDelay = 20;
  let elapsed = 0;
  let visible = false;
  let typedText = $state("");
  let editing = $state(false);
  const prompt = $derived(categories[active].steps.at(-1)!);
  const displayed = $derived(reducedMotion ? prompt : typedText);
  const sequence = $derived.by(() => {
    const stages: { from: string; to: string; start: number; end: number }[] =
      [];
    let previous = "";
    let time = 0;
    for (const [index, text] of categories[active].steps.entries()) {
      let keep = 0;
      while (keep < previous.length && previous[keep] === text[keep]) keep++;
      if (keep < previous.length) {
        const end = time + (previous.length - keep) * deletingDelay;
        stages.push({
          from: previous,
          to: previous.slice(0, keep),
          start: time,
          end,
        });
        time = end + 170;
      }
      const end = time + (text.length - keep) * typingDelay;
      stages.push({ from: text.slice(0, keep), to: text, start: time, end });
      time = end + [360, 440, 300][index % 3];
      previous = text;
    }
    const eraseDuration = Math.min(1200, prompt.length * 9);
    const eraseStart = cycleDuration - 250 - eraseDuration;
    const lastEnd = stages.at(-1)!.end;
    const scale = Math.min(1, (eraseStart - startDelay - 1400) / lastEnd);
    return { stages, scale, eraseStart, eraseDuration };
  });

  function resetPrompt() {
    elapsed = 0;
    typedText = "";
    editing = false;
  }

  function updatePrompt(delta: number) {
    elapsed += delta;
    if (elapsed >= cycleDuration) {
      select((active + 1) % categoryCount, false, categoryCount + active + 1);
      return;
    }
    const { stages, scale, eraseStart, eraseDuration } = sequence;
    editing = false;
    if (elapsed >= eraseStart) {
      const remaining = Math.max(0, 1 - (elapsed - eraseStart) / eraseDuration);
      typedText = prompt.slice(0, Math.ceil(prompt.length * remaining));
      editing = typedText.length > 0;
      return;
    }
    const time = (elapsed - startDelay) / scale;
    typedText = "";
    for (const stage of stages) {
      if (time < stage.start) break;
      if (time >= stage.end) {
        typedText = stage.to;
        continue;
      }
      const progress = (time - stage.start) / (stage.end - stage.start);
      const length =
        stage.from.length +
        Math.trunc((stage.to.length - stage.from.length) * progress);
      typedText = (
        stage.to.length > stage.from.length ? stage.to : stage.from
      ).slice(0, length);
      editing = true;
      break;
    }
  }

  function buttons() {
    return viewport.querySelectorAll<HTMLButtonElement>("button");
  }

  function buttonPosition(index: number) {
    const slide = buttons()[index]?.parentElement;
    if (!slide) return viewport.scrollLeft;
    const bounds = slide.getBoundingClientRect();
    return (
      bounds.left -
      viewport.getBoundingClientRect().left +
      viewport.scrollLeft +
      bounds.width / 2 -
      viewport.clientWidth / 2
    );
  }

  // Benji's smooth curve: cubic-bezier(0.19, 1, 0.22, 1).
  function smooth(progress: number) {
    let low = 0;
    let high = 1;
    for (let i = 0; i < 16; i++) {
      const t = (low + high) / 2;
      const x =
        3 * (1 - t) ** 2 * t * 0.19 + 3 * (1 - t) * t ** 2 * 0.22 + t ** 3;
      if (x < progress) low = t;
      else high = t;
    }
    return 1 - (1 - (low + high) / 2) ** 3;
  }

  function centerButton(
    index: number,
    instant: boolean,
    initialWidths?: number[],
    initialOffset = buttonPosition(index) - viewport.scrollLeft,
  ) {
    cancelAnimationFrame(centeringFrame);
    cancelAnimationFrame(scrollFrame);
    const slides = Array.from(
      viewport.querySelectorAll<HTMLElement>(".gallery-slide"),
    );
    const fromWidths =
      initialWidths ??
      slides.map((slide) => slide.getBoundingClientRect().width);
    slides.forEach((slide) => {
      slide.style.width = "";
      slide.style.minWidth = "";
    });
    const toWidths = slides.map((slide) => slide.getBoundingClientRect().width);
    if (instant || reducedMotion) {
      viewport.scrollLeft = buttonPosition(categoryCount + active);
      centering = false;
      return;
    }
    const applyWidths = (progress: number) => {
      slides.forEach((slide, i) => {
        slide.style.minWidth = "0px";
        slide.style.width = `${fromWidths[i] + (toWidths[i] - fromWidths[i]) * progress}px`;
      });
    };
    applyWidths(0);
    centering = true;
    const started = performance.now();
    const frame = (now: number) => {
      const progress = Math.min((now - started) / 460, 1);
      const eased = smooth(progress);
      applyWidths(eased);
      viewport.scrollLeft = buttonPosition(index) - initialOffset * (1 - eased);
      if (progress < 1) centeringFrame = requestAnimationFrame(frame);
      else {
        slides.forEach((slide) => {
          slide.style.width = "";
          slide.style.minWidth = "";
        });
        // Rebase only once the movement finishes, never during the crossing.
        viewport.scrollLeft = buttonPosition(categoryCount + active);
        centering = false;
      }
    };
    centeringFrame = requestAnimationFrame(frame);
  }

  function select(
    index: number,
    instant = false,
    physicalIndex = categoryCount + index,
  ) {
    const initialWidths = Array.from(
      viewport.querySelectorAll<HTMLElement>(".gallery-slide"),
      (slide) => slide.getBoundingClientRect().width,
    );
    const initialOffset = buttonPosition(physicalIndex) - viewport.scrollLeft;
    const distance = (index - active + categoryCount) % categoryCount;
    animateSelection = !instant && !reducedMotion && distance !== 0;
    flushSync(() => {
      active = index;
    });
    resetPrompt();
    centerButton(physicalIndex, instant, initialWidths, initialOffset);
  }

  function keyboard(
    event: KeyboardEvent,
    index: number,
    physicalIndex: number,
  ) {
    let target = -1;
    if (event.key === "ArrowRight") target = physicalIndex + 1;
    if (event.key === "ArrowLeft") target = physicalIndex - 1;
    if (event.key === "Home") target = categoryCount;
    if (event.key === "End") target = categoryCount * 2 - 1;
    if (target < 0) return;

    const next =
      (index + target - physicalIndex + categoryCount) % categoryCount;
    event.preventDefault();
    select(next, true, target);
    buttons()[categoryCount + next]?.focus({ preventScroll: true });
  }

  function loopScroll() {
    if (centering) return;
    cancelAnimationFrame(scrollFrame);
    scrollFrame = requestAnimationFrame(() => {
      const slides = viewport.querySelectorAll<HTMLElement>(".gallery-slide");
      const firstMiddleSlide = slides[categoryCount];
      const firstLastSlide = slides[categoryCount * 2];
      if (!firstMiddleSlide || !firstLastSlide) return;

      const viewportBounds = viewport.getBoundingClientRect();
      const middleStart =
        firstMiddleSlide.getBoundingClientRect().left -
        viewportBounds.left +
        viewport.scrollLeft;
      const middleEnd =
        firstLastSlide.getBoundingClientRect().left -
        viewportBounds.left +
        viewport.scrollLeft;

      const loopWidth = middleEnd - middleStart;
      const viewportCenter = viewport.scrollLeft + viewport.clientWidth / 2;
      if (viewportCenter < middleStart) viewport.scrollLeft += loopWidth;
      if (viewportCenter >= middleEnd) viewport.scrollLeft -= loopWidth;
    });
  }

  onMount(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotion = preference.matches;
    const revealObserver = new IntersectionObserver(
      ([entry]) => {
        visible = Boolean(entry?.isIntersecting);
        if (visible) revealed = true;
      },
      { threshold: 0.25 },
    );
    const preferenceChanged = () => {
      reducedMotion = preference.matches;
      resetPrompt();
      if (reducedMotion) revealed = true;
    };
    preference.addEventListener("change", preferenceChanged);
    if (reducedMotion) revealed = true;
    revealObserver.observe(gallery);
    let previous = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      const delta = Math.min(now - previous, 100);
      previous = now;
      if (visible && !document.hidden && !reducedMotion) updatePrompt(delta);
    }, 16);
    select(active, true);
    const resizeObserver = new ResizeObserver(() =>
      centerButton(categoryCount + active, false),
    );
    resizeObserver.observe(viewport);
    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(centeringFrame);
      window.clearInterval(timer);
      cancelAnimationFrame(scrollFrame);
      revealObserver.disconnect();
      preference.removeEventListener("change", preferenceChanged);
    };
  });
</script>

<section
  bind:this={gallery}
  class="gallery"
  class:revealed
  aria-label="Explore Probo tool categories"
>
  <div class="gallery-visual" aria-hidden="true">
    <img class="gallery-orb" src="/ai-agents/orb.svg" alt="" />
    <div class="gallery-prompt-card">
      <div class="gallery-prompt-field">
        <p>
          <span class="gallery-prompt-copy">{displayed}</span><i
            class:blinking={!editing}
          ></i>
        </p>
      </div>
    </div>
  </div>
  <div
    bind:this={viewport}
    class="gallery-viewport"
    role="tablist"
    onscroll={loopScroll}
  >
    <div class="gallery-track">
      {#each loopedCategories as item, physicalIndex}
        <div
          class="gallery-slide"
          class:selected={item.index === active}
          aria-hidden={item.copy !== 1}
        >
          <button
            type="button"
            role="tab"
            class:active={item.index === active}
            aria-selected={item.copy === 1 && item.index === active}
            aria-controls="ai-category-description"
            tabindex={item.copy === 1 && item.index === active ? 0 : -1}
            onclick={() => select(item.index, false, physicalIndex)}
            onkeydown={(event) => keyboard(event, item.index, physicalIndex)}
            >{item.category.title}</button
          >
        </div>
      {/each}
    </div>
  </div>
  <div
    class="gallery-description"
    id="ai-category-description"
    role="tabpanel"
    aria-live="off"
    aria-atomic="true"
  >
    {#key active}
      <div class="gallery-description-content" class:animate={animateSelection}>
        <p>{categories[active].description}</p>
        <span class="gallery-count">{categories[active].tools} tools</span>
      </div>
    {/key}
  </div>
</section>

<style>
  .gallery {
    --benji-smooth: cubic-bezier(0.19, 1, 0.22, 1);
    text-align: center;
    position: relative;
  }
  .gallery-visual {
    height: 344px;
    position: relative;
    overflow: hidden;
    border-radius: 10px;
    background: #f6f9f5;
  }
  .gallery-orb {
    position: absolute;
    width: 126.9%;
    max-width: none;
    height: auto;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .gallery-prompt-card {
    position: absolute;
    top: -150px;
    left: calc(50% - 12px);
    display: flex;
    width: 61.6%;
    height: 413px;
    padding: 24px;
    align-items: flex-end;
    transform: translateX(-50%);
    border-radius: 12px;
    background: #fff;
  }
  .gallery-prompt-field {
    width: 100%;
    height: 110px;
    padding: 12px;
    border: 1px solid rgba(31, 24, 0, 0.13);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.9);
    color: #21201c;
    font-size: 16px;
    line-height: 22px;
    text-align: left;
  }
  .gallery-prompt-field p {
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }
  .gallery-prompt-copy {
    color: #21201c;
  }
  .gallery-prompt-field i {
    display: inline-block;
    width: 1px;
    height: 1.15em;
    vertical-align: -0.2em;
    background: #21201c;
  }
  .gallery-prompt-field i.blinking {
    animation: caret-blink 1s step-end infinite;
  }
  @keyframes caret-blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }
  .gallery-viewport {
    overflow-anchor: none;
    overflow-x: auto;
    overflow-y: hidden;
    margin-top: 24px;
    touch-action: pan-x pan-y pinch-zoom;
    -webkit-mask-image: linear-gradient(
      to right,
      transparent,
      #000 96px,
      #000 calc(100% - 96px),
      transparent
    );
    mask-image: linear-gradient(
      to right,
      transparent,
      #000 96px,
      #000 calc(100% - 96px),
      transparent
    );
    scrollbar-width: none;
  }
  .gallery-viewport::-webkit-scrollbar {
    display: none;
  }
  .gallery-track {
    display: flex;
    width: max-content;
    padding-inline: calc(50% - 150px);
  }
  .gallery-slide {
    flex: 0 0 auto;
    min-width: 0;
    padding: 0 28px;
  }
  .gallery-slide.selected {
    min-width: 384px;
  }
  .gallery-slide button {
    white-space: nowrap;
    padding: 4px;
    color: #a5ada3;
    font-size: 20px;
    line-height: 28px;
    font-weight: 600;
    letter-spacing: -0.4px;
    cursor: pointer;
    transition: color 220ms var(--benji-smooth);
  }
  .gallery-slide button.active {
    color: #141e12;
  }
  button:focus-visible,
  a:focus-visible {
    outline: 2px solid #141e12;
    outline-offset: -2px;
    border-radius: 4px;
  }
  .gallery-description {
    max-width: 360px;
    min-height: 86px;
    margin: 8px auto 0;
    color: #6b716a;
    font-size: 16px;
    line-height: 24px;
  }
  .gallery-count {
    display: inline-block;
    margin-top: 8px;
    padding: 3px 6px;
    border-radius: 6px;
    background: rgba(32, 16, 0, 0.06);
    font-size: 12px;
    line-height: 16px;
  }
  .gallery-description-content.animate p {
    animation: gallery-description-enter 500ms var(--benji-smooth) 480ms both;
  }
  .gallery-description-content.animate .gallery-count {
    animation: gallery-count-enter 500ms var(--benji-smooth) 600ms both;
  }
  @keyframes gallery-description-enter {
    from {
      opacity: 0;
      transform: translate3d(0, 22px, 0);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }
  @keyframes gallery-count-enter {
    from {
      opacity: 0;
      transform: translateY(26px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes gallery-orb-enter {
    from {
      opacity: 0;
      transform: translate(-50%, -50%) scale(1.035);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
  }
  @keyframes gallery-card-enter {
    from {
      opacity: 0;
      transform: translate3d(-50%, -18px, 0) scale(0.985);
    }
    to {
      opacity: 1;
      transform: translate3d(-50%, 0, 0);
    }
  }
  @keyframes gallery-controls-enter {
    from {
      opacity: 0;
      transform: translate3d(0, 8px, 0);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }
  @media (prefers-reduced-motion: no-preference) {
    .gallery.revealed .gallery-orb {
      animation: gallery-orb-enter 700ms var(--benji-smooth) both;
    }
    .gallery.revealed .gallery-prompt-card {
      animation: gallery-card-enter 700ms var(--benji-smooth) 45ms both;
    }
    .gallery.revealed .gallery-viewport {
      animation: gallery-controls-enter 520ms var(--benji-smooth) 90ms both;
    }
    .gallery.revealed .gallery-description {
      animation: gallery-controls-enter 520ms var(--benji-smooth) 130ms both;
    }
  }
  @media (max-width: 639px) {
    .gallery-slide {
      padding-inline: 16px;
    }
    .gallery-slide.selected {
      min-width: 380px;
    }
    .gallery-slide button {
      font-size: 18px;
    }
    .gallery-visual {
      height: 260px;
    }
    .gallery-prompt-card {
      top: -110px;
      width: 76%;
      height: 320px;
      padding: 16px;
    }
    .gallery-prompt-field {
      height: 154px;
      padding: 10px;
      font-size: 13px;
      line-height: 18px;
    }
    .gallery-prompt-field i {
      height: 19px;
    }
    .gallery-viewport {
      -webkit-mask-image: linear-gradient(
        to right,
        transparent,
        #000 32px,
        #000 calc(100% - 32px),
        transparent
      );
      mask-image: linear-gradient(
        to right,
        transparent,
        #000 32px,
        #000 calc(100% - 32px),
        transparent
      );
    }
    .gallery-track {
      padding-inline: calc(50% - 120px);
    }
    .gallery-description {
      padding: 0 12px;
      min-height: 110px;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .gallery-slide,
    .gallery-description-content.animate .gallery-count,
    .gallery-description-content.animate p,
    .gallery-prompt-field i.blinking,
    .gallery-slide button,
    .gallery-description-content,
    .gallery-count,
    .gallery-orb,
    .gallery-prompt-card,
    .gallery-viewport,
    .gallery-description {
      animation: none;
      transition: none;
    }
  }
</style>
