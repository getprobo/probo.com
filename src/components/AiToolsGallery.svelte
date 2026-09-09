<script lang="ts">
  import { onMount } from "svelte";

  const categories = [
    {
      title: "Risks",
      tools: 49,
      description:
        "Create, score, and update risks, then link them to the measures that treat them.",
    },
    {
      title: "Documents and approvals",
      tools: 25,
      description:
        "Draft policies, request signatures, and move versions through approval quorums.",
    },
    {
      title: "Privacy",
      tools: 23,
      description:
        "Handle processing activities, DPIAs, transfer assessments, and rights requests.",
    },
    {
      title: "Access reviews",
      tools: 18,
      description:
        "Run campaigns, pull entries from connected sources, and record decisions.",
    },
    {
      title: "Frameworks and controls",
      tools: 16,
      description:
        "Map controls to SOC 2, ISO 27001, and every framework in your organization.",
    },
    {
      title: "Audits and findings",
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
  let descriptionOffset = $state("8px");
  let scrollFrame = 0;

  function buttons() {
    return viewport.querySelectorAll<HTMLButtonElement>("button");
  }

  function centerButton(index: number, instant: boolean) {
    const button = buttons()[index];
    if (!button) return;

    const buttonBounds = button.getBoundingClientRect();
    const viewportBounds = viewport.getBoundingClientRect();
    const buttonCenter =
      buttonBounds.left -
      viewportBounds.left +
      viewport.scrollLeft +
      buttonBounds.width / 2;

    viewport.scrollTo({
      left: buttonCenter - viewport.clientWidth / 2,
      behavior: instant || reducedMotion ? "instant" : "smooth",
    });
  }

  function select(
    index: number,
    instant = false,
    physicalIndex = categoryCount + index,
  ) {
    const distance = (index - active + categoryCount) % categoryCount;
    if (distance !== 0) {
      descriptionOffset = distance <= categoryCount / 2 ? "8px" : "-8px";
    }
    animateSelection = !instant && !reducedMotion && distance !== 0;
    active = index;
    requestAnimationFrame(() => {
      centerButton(physicalIndex, instant);
    });
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
        if (!entry?.isIntersecting) return;
        revealed = true;
        revealObserver.disconnect();
      },
      { threshold: 0.25 },
    );
    const preferenceChanged = () => {
      reducedMotion = preference.matches;
      if (reducedMotion) revealed = true;
    };
    preference.addEventListener("change", preferenceChanged);
    if (reducedMotion) revealed = true;
    else revealObserver.observe(gallery);
    select(active, true);
    return () => {
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
          <span class="gallery-prompt-command">/access-review</span>
          <span class="gallery-prompt-copy">Review the remaining accounts</span
          ><i></i>
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
        <div class="gallery-slide" aria-hidden={item.copy !== 1}>
          <button
            type="button"
            role="tab"
            class:active={item.index === active}
            class:animate-selection={item.index === active && animateSelection}
            aria-selected={item.copy === 1 && item.index === active}
            aria-controls="ai-category-description"
            tabindex={item.copy === 1 && item.index === active ? 0 : -1}
            onclick={() => select(item.index, false, physicalIndex)}
            onkeydown={(event) => keyboard(event, item.index, physicalIndex)}
            onfocus={(event) => {
              if (event.currentTarget.matches(":focus-visible"))
                select(item.index, true, physicalIndex);
            }}>{item.category.title}</button
          >
        </div>
      {/each}
    </div>
  </div>
  <div
    class="gallery-description"
    id="ai-category-description"
    role="tabpanel"
    aria-live="polite"
    aria-atomic="true"
  >
    {#key active}
      <div
        class="gallery-description-content"
        class:animate={animateSelection}
        style={`--description-offset: ${descriptionOffset}`}
      >
        <p>{categories[active].description}</p>
        <span class="gallery-count">{categories[active].tools} tools</span>
      </div>
    {/key}
  </div>
</section>

<style>
  .gallery {
    --benji-smooth: cubic-bezier(0.19, 1, 0.22, 1);
    --benji-snappy: cubic-bezier(0.175, 0.885, 0.32, 1.1);
    text-align: center;
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
    display: flex;
    align-items: flex-start;
    white-space: nowrap;
  }
  .gallery-prompt-command {
    color: #6b716a;
  }
  .gallery-prompt-copy {
    margin-left: 4px;
    color: #21201c;
  }
  .gallery-prompt-field i {
    display: inline-block;
    width: 1px;
    height: 23px;
    background: #21201c;
  }
  .gallery-viewport {
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
  .gallery-slide button {
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
  .gallery-slide button.animate-selection {
    animation: gallery-title-select 220ms var(--benji-snappy) both;
  }
  button:focus-visible,
  a:focus-visible {
    outline: 2px solid #141e12;
    outline-offset: -2px;
    border-radius: 4px;
  }
  .gallery-description {
    max-width: 380px;
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
  .gallery-description-content.animate {
    animation: gallery-description-enter 300ms var(--benji-smooth) both;
  }
  .gallery-description-content.animate .gallery-count {
    animation: gallery-count-enter 220ms var(--benji-snappy) 55ms both;
  }
  @keyframes gallery-title-select {
    from {
      transform: translateY(1px) scale(0.965);
    }
    to {
      transform: translateY(0) scale(1);
    }
  }
  @keyframes gallery-description-enter {
    from {
      opacity: 0;
      transform: translate3d(var(--description-offset), 3px, 0);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }
  @keyframes gallery-count-enter {
    from {
      opacity: 0;
      transform: translateY(2px) scale(0.92);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  @keyframes gallery-orb-enter {
    from {
      opacity: 0;
      transform: translate(-50%, -50%) scale(1.035);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }
  @keyframes gallery-card-enter {
    from {
      opacity: 0;
      transform: translate3d(-50%, -18px, 0) scale(0.985);
    }
    to {
      opacity: 1;
      transform: translate3d(-50%, 0, 0) scale(1);
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
      height: 88px;
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
