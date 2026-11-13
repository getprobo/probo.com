const initPricing = () => {
  const page = document.querySelector<HTMLElement>("[data-pricing-page]");
  if (!page || page.dataset.enhanced) return;
  page.dataset.enhanced = "true";

  const head = page.querySelector<HTMLElement>("[data-comparison-head]");
  const body = page.querySelector<HTMLElement>("[data-comparison-body]");
  if (head && body) {
    const previous = page.querySelector<HTMLButtonElement>(
      "[data-comparison-previous]",
    );
    const next = page.querySelector<HTMLButtonElement>(
      "[data-comparison-next]",
    );
    const columns = Array.from(
      head.querySelectorAll<HTMLElement>(".comparison-plan"),
    );
    const updateNavigation = () => {
      if (previous) previous.disabled = body.scrollLeft <= 1;
      if (next)
        next.disabled =
          body.scrollLeft >= body.scrollWidth - body.clientWidth - 1;
    };
    const movePlan = (direction: number) => {
      const featureWidth =
        head.querySelector<HTMLElement>(".comparison-heading-cell")
          ?.offsetWidth || 0;
      const positions = columns.map((column) =>
        Math.min(
          body.scrollWidth - body.clientWidth,
          column.offsetLeft - featureWidth,
        ),
      );
      const current = positions.reduce(
        (best, position, index) =>
          Math.abs(position - body.scrollLeft) <
          Math.abs(positions[best] - body.scrollLeft)
            ? index
            : best,
        0,
      );
      body.scrollLeft =
        positions[
          Math.max(0, Math.min(positions.length - 1, current + direction))
        ];
    };
    previous?.addEventListener("click", () => movePlan(-1));
    next?.addEventListener("click", () => movePlan(1));
    const scrollTargets = new WeakMap<HTMLElement, number>();
    const syncScroll = (from: HTMLElement, to: HTMLElement) => {
      const left = from.scrollLeft;
      const target = scrollTargets.get(from);
      scrollTargets.delete(from);
      if (target !== undefined && Math.abs(left - target) <= 1) return;
      page.classList.toggle("is-comparison-scrolled", left > 1);
      if (Math.abs(left - to.scrollLeft) > 1) {
        scrollTargets.set(to, left);
        to.scrollLeft = left;
      }
      updateNavigation();
    };
    head.addEventListener("scroll", () => syncScroll(head, body), {
      passive: true,
    });
    body.addEventListener("scroll", () => syncScroll(body, head), {
      passive: true,
    });
    syncScroll(body, head);
    const resizeObserver = new ResizeObserver(updateNavigation);
    resizeObserver.observe(body);
    document.addEventListener(
      "astro:before-swap",
      () => resizeObserver.disconnect(),
      { once: true },
    );
  }

  const events = new AbortController();
  const { signal } = events;
  const motionAllowed = window.matchMedia(
    "(prefers-reduced-motion: no-preference)",
  );
  const root = document.documentElement;
  let guidePlan: HTMLElement | undefined;
  let guideTimer: number | undefined;
  const clearGuideMotion = () => {
    window.clearTimeout(guideTimer);
    root.removeAttribute("data-pricing-guide-scroll");
    guidePlan = undefined;
  };
  const finishGuideMotion = () => {
    if (!guidePlan || location.hash !== `#${guidePlan.id}`) return;
    const plan = guidePlan;
    const top = plan.getBoundingClientRect().top;
    if (top < 0 || top > window.innerHeight / 3) return;
    clearGuideMotion();
    if (!motionAllowed.matches) return;
    plan.setAttribute("data-pricing-arrival", "");
    plan.addEventListener(
      "animationend",
      () => plan.removeAttribute("data-pricing-arrival"),
      { once: true, signal },
    );
  };
  page.querySelector<HTMLElement>("[data-pricing-chooser]")?.addEventListener(
    "click",
    (event) => {
      if (
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link = (event.target as Element).closest<HTMLAnchorElement>(
        ".chooser-compare",
      );
      const state = history.state;
      if (!link) return;
      history.scrollRestoration = "auto";
      // Keep the position that Astro restores when returning from a native anchor.
      if (typeof state?.scrollY === "number") {
        history.replaceState(
          { ...state, scrollX: window.scrollX, scrollY: window.scrollY },
          "",
        );
      }
      clearGuideMotion();
      if (!event.detail || !motionAllowed.matches) return;
      guidePlan = document.getElementById(link.hash.slice(1)) ?? undefined;
      if (!guidePlan) return;
      // Scope smooth scrolling to this anchor activation and retain native history and focus.
      root.setAttribute("data-pricing-guide-scroll", "");
      guideTimer = window.setTimeout(() => {
        finishGuideMotion();
        clearGuideMotion();
      }, 2400);
    },
    { signal },
  );
  document.addEventListener("scrollend", finishGuideMotion, { signal });
  window.addEventListener(
    "popstate",
    () => {
      if (guidePlan && location.hash !== `#${guidePlan.id}`) clearGuideMotion();
    },
    { signal },
  );
  const highlight = page.querySelector<HTMLElement>(
    "[data-comparison-highlight]",
  );
  if (body && highlight) {
    const desktopPointer = window.matchMedia(
      "(min-width: 768px) and (hover: hover) and (pointer: fine)",
    );
    let hoveredRow: HTMLTableRowElement | null = null;
    const hideHighlight = () => {
      hoveredRow = null;
      highlight.removeAttribute("data-visible");
    };
    const updateHighlightMode = () => {
      hideHighlight();
      body.toggleAttribute("data-moving-highlight", desktopPointer.matches);
    };
    const followRow = (event: PointerEvent) => {
      if (!desktopPointer.matches || event.pointerType !== "mouse") return;
      const row = (event.target as Element).closest<HTMLTableRowElement>(
        ".comparison-data tr",
      );
      if (row === hoveredRow) return;
      if (!row) {
        hideHighlight();
        return;
      }
      const bounds = row.getBoundingClientRect();
      highlight.toggleAttribute("data-sliding", hoveredRow !== null);
      highlight.style.translate = `0 ${bounds.top - body.getBoundingClientRect().top + body.scrollTop}px`;
      highlight.style.height = `${bounds.height}px`;
      highlight.setAttribute("data-visible", "");
      hoveredRow = row;
    };
    updateHighlightMode();
    desktopPointer.addEventListener("change", updateHighlightMode, { signal });
    body.addEventListener("pointerover", followRow, { signal });
    body.addEventListener("pointermove", followRow, { signal });
    body.addEventListener("pointerleave", hideHighlight, { signal });
    window.addEventListener("resize", hideHighlight, { signal });
  }

  if (page.hasAttribute("data-pricing-entrance")) {
    const finishIntro = () =>
      page.setAttribute("data-pricing-entrance-finished", "");
    if (!motionAllowed.matches || location.hash || scrollY > 12) finishIntro();
    document.addEventListener("keydown", finishIntro, {
      capture: true,
      signal,
    });
    document.addEventListener("click", finishIntro, {
      capture: true,
      signal,
    });
    motionAllowed.addEventListener(
      "change",
      () => {
        if (!motionAllowed.matches) finishIntro();
      },
      { signal },
    );
  }

  const revealTargets = page.querySelectorAll<HTMLElement>(
    "[data-pricing-reveal]",
  );
  page
    .querySelectorAll<HTMLElement>(
      '.plan-card, [data-pricing-reveal="chooser"]',
    )
    .forEach((card) => {
      const finishEntrance = () => {
        card.classList.remove(
          "is-awaiting-reveal",
          "is-plan-revealed",
          "motion-safe:animate-slide-in",
        );
        revealObserver?.unobserve(card);
      };
      card.addEventListener("click", finishEntrance, { signal });
      card.addEventListener(
        "focusin",
        (event) => {
          if ((event.target as Element).matches(":focus-visible"))
            finishEntrance();
        },
        { signal },
      );
    });
  const canReveal =
    "IntersectionObserver" in window &&
    window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
  const revealObserver = canReveal
    ? new IntersectionObserver(
        (entries, observer) => {
          entries.forEach(({ isIntersecting, target }) => {
            if (!isIntersecting) return;
            if (!target.classList.contains("is-awaiting-reveal")) {
              observer.unobserve(target);
              return;
            }
            target.classList.remove("is-awaiting-reveal");
            target.classList.add(
              (target as HTMLElement).dataset.pricingReveal === "plan"
                ? "is-plan-revealed"
                : "motion-safe:animate-slide-in",
            );
            observer.unobserve(target);
          });
        },
        { rootMargin: "0px 0px -8% 0px" },
      )
    : undefined;
  revealTargets.forEach((target) => {
    if (!revealObserver) return;
    if (
      target.dataset.pricingReveal === "chooser" &&
      ["#pricing-chooser", "#pricing-final-heading"].includes(location.hash)
    )
      return;
    target.classList.add("is-awaiting-reveal");
    revealObserver.observe(target);
  });

  type Tooltip = { button: HTMLButtonElement; content: HTMLElement };
  const siteHeader = document.querySelector("header.page-header");
  let active: Tooltip | undefined;
  let pinned = false;
  let closeTimer: ReturnType<typeof setTimeout> | undefined;

  const close = () => {
    clearTimeout(closeTimer);
    if (!active) return;
    active.content.hidePopover();
    active.button.setAttribute("aria-expanded", "false");
    active = undefined;
    pinned = false;
  };

  const open = (tooltip: Tooltip, fromPointer: boolean) => {
    clearTimeout(closeTimer);
    if (active === tooltip) return;
    close();

    const { button, content } = tooltip;
    active = tooltip;
    content.toggleAttribute("data-motion", fromPointer);
    content.showPopover();
    const anchor = button.getBoundingClientRect();
    const width = content.offsetWidth;
    const height = content.offsetHeight;
    const gutter = 12;
    const gap = 8;
    const viewportWidth = document.documentElement.clientWidth;
    const right = anchor.right + gap;
    const placeRight =
      button.classList.contains("feature-detail-trigger") &&
      right + width <= viewportWidth - gutter;
    const centered = Math.max(
      gutter,
      Math.min(
        anchor.left + (anchor.width - width) / 2,
        viewportWidth - width - gutter,
      ),
    );
    const minTop = Math.max(
      gutter,
      siteHeader?.getBoundingClientRect().bottom ?? 0,
    );
    const maxTop = window.innerHeight - height - gutter;
    const above = anchor.top - height - gap;
    const below = anchor.bottom + gap;
    const placeAbove = above >= minTop || below > maxTop;
    const top = placeRight
      ? anchor.top + (anchor.height - height) / 2
      : placeAbove
        ? above
        : below;
    content.style.left = `${placeRight ? right : centered}px`;
    content.style.top = `${Math.max(minTop, Math.min(top, maxTop))}px`;
    content.style.setProperty("--tooltip-enter-x", placeRight ? "-4px" : "0px");
    content.style.setProperty(
      "--tooltip-enter-y",
      placeRight ? "0px" : placeAbove ? "4px" : "-4px",
    );
    button.setAttribute("aria-expanded", "true");
  };

  const scheduleClose = (tooltip: Tooltip) => {
    if (
      active !== tooltip ||
      pinned ||
      tooltip.button.matches(":focus-visible")
    )
      return;
    clearTimeout(closeTimer);
    // Allow the pointer to cross the space between the trigger and its tooltip.
    closeTimer = setTimeout(close, 80);
  };

  page
    .querySelectorAll<HTMLButtonElement>("[data-pricing-tooltip]")
    .forEach((button) => {
      const content = document.getElementById(
        button.getAttribute("aria-controls") || "",
      );
      if (!content) return;
      const tooltip = { button, content };

      button.addEventListener(
        "pointerenter",
        (event) => {
          if (event.pointerType === "mouse") open(tooltip, true);
        },
        { signal },
      );
      button.addEventListener("pointerleave", () => scheduleClose(tooltip), {
        signal,
      });
      button.addEventListener(
        "focus",
        () => {
          if (button.matches(":focus-visible")) open(tooltip, false);
        },
        { signal },
      );
      button.addEventListener(
        "blur",
        () => {
          if (active === tooltip) close();
        },
        { signal },
      );
      button.addEventListener(
        "click",
        () => {
          if (active === tooltip && pinned) {
            close();
            return;
          }
          open(tooltip, false);
          pinned = true;
        },
        { signal },
      );
      content.addEventListener("pointerenter", () => clearTimeout(closeTimer), {
        signal,
      });
      content.addEventListener("pointerleave", () => scheduleClose(tooltip), {
        signal,
      });
    });

  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Escape" && active) close();
    },
    { signal },
  );
  document.addEventListener(
    "pointerdown",
    (event) => {
      if (
        active &&
        event.target instanceof Node &&
        !active.button.contains(event.target) &&
        !active.content.contains(event.target)
      ) {
        close();
      }
    },
    { signal },
  );
  document.addEventListener("scroll", close, { capture: true, signal });
  window.addEventListener("resize", close, { signal });
  document.addEventListener(
    "astro:before-swap",
    () => {
      clearGuideMotion();
      close();
      events.abort();
      revealObserver?.disconnect();
    },
    { once: true },
  );
};

document.addEventListener("astro:page-load", initPricing);
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPricing, { once: true });
} else {
  initPricing();
}
