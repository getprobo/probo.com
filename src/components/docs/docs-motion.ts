/**
 * Motion for repeated reading tasks: continuity for containers, tactility for
 * small controls. Values are adapted from the documented Benji motion tokens.
 */
const SMOOTH = "cubic-bezier(0.19, 1, 0.22, 1)";
const SNAPPY = "cubic-bezier(0.175, 0.885, 0.32, 1.1)";
const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
const running = new Set<Animation>();
const panels = new Map<HTMLElement, Animation>();
let disposePage: (() => void) | undefined;
let initialized = false;

function animate(
  element: HTMLElement,
  frames: Keyframe[],
  options: KeyframeAnimationOptions,
) {
  if (motionPreference.matches || !element.animate) return null;
  const animation = element.animate(frames, options);
  running.add(animation);
  void animation.finished.then(
    () => running.delete(animation),
    () => running.delete(animation),
  );
  return animation;
}

export function cancelDocsPanel(element: HTMLElement) {
  panels.get(element)?.cancel();
  panels.delete(element);
  delete element.dataset.docsPanelState;
}

/** Start before changing a drawer's expanded attribute, after showModal(). */
export function animateDocsPanel(
  element: HTMLElement,
  opening: boolean,
  kind: "drawer" | "search",
): Promise<boolean> {
  const previous = panels.get(element);
  const current = getComputedStyle(element);
  const fromTransform = previous
    ? current.transform
    : kind === "drawer"
      ? current.transform
      : opening
        ? "translateY(-6px) scale(0.99)"
        : "none";
  const fromOpacity = previous
    ? current.opacity
    : kind === "search" && opening
      ? "0.86"
      : "1";
  cancelDocsPanel(element);
  const toTransform = opening
    ? "none"
    : kind === "drawer"
      ? "translateX(-100%)"
      : "translateY(-4px) scale(0.992)";
  const animation = animate(
    element,
    [
      { transform: fromTransform, opacity: fromOpacity },
      {
        transform: toTransform,
        opacity: kind === "search" && !opening ? 0 : 1,
      },
    ],
    { duration: opening ? 300 : 200, easing: SMOOTH, fill: "both" },
  );
  if (!animation) return Promise.resolve(true);
  panels.set(element, animation);
  element.dataset.docsPanelState = opening ? "opening" : "closing";
  return animation.finished.then(
    () => {
      if (panels.get(element) !== animation) return false;
      panels.delete(element);
      delete element.dataset.docsPanelState;
      animation.cancel();
      return true;
    },
    () => false,
  );
}

export function animateDocsResults(elements: HTMLElement[]) {
  for (const [index, element] of elements.entries()) {
    animate(
      element,
      [
        { opacity: 0.86, transform: "translateY(2px)" },
        { opacity: 1, transform: "none" },
      ],
      { duration: 180, delay: Math.min(index * 12, 48), easing: SMOOTH },
    );
  }
}

export function animateDocsTab(panel: HTMLElement, direction: 1 | -1) {
  return animate(
    panel,
    [
      { opacity: 0.92, transform: `translateX(${direction * 12}px)` },
      { opacity: 1, transform: "none" },
    ],
    { duration: 240, easing: SMOOTH },
  );
}

function enhanceDisclosure(details: HTMLDetailsElement) {
  const summary = details.querySelector<HTMLElement>(":scope > summary");
  if (!summary) return () => {};
  const content = Array.from(details.children).filter(
    (element): element is HTMLElement =>
      element instanceof HTMLElement && element !== summary,
  );
  const previousHeight = details.style.height;
  const previousOverflow = details.style.overflow;
  const previousExpanded = summary.getAttribute("aria-expanded");
  const previousInert = content.map((element) => element.inert);
  let desiredOpen = details.open;
  let animation: Animation | null = null;

  const sync = () => {
    details.dataset.docsDisclosure = desiredOpen ? "open" : "closed";
    summary.setAttribute("aria-expanded", String(desiredOpen));
    content.forEach((element, index) => {
      element.inert = !desiredOpen || previousInert[index];
    });
  };
  const settle = () => {
    animation?.cancel();
    animation = null;
    details.open = desiredOpen;
    details.style.height = previousHeight;
    details.style.overflow = previousOverflow;
    sync();
  };

  const toggle = (event: MouseEvent) => {
    const target = event.target;
    if (
      event.button !== 0 ||
      !(target instanceof Element) ||
      target.closest("a, button, input, select, textarea")
    )
      return;
    event.preventDefault();
    desiredOpen = !desiredOpen;
    if (
      !desiredOpen &&
      content.some((element) => element.contains(document.activeElement))
    ) {
      summary.focus({ preventScroll: true });
    }
    const from = details.getBoundingClientRect().height;
    animation?.cancel();
    animation = null;
    sync();
    if (motionPreference.matches || !details.animate) {
      settle();
      return;
    }

    // Keep native content rendered while its containing space closes. A fixed
    // height exists only for the gesture; intrinsic layout returns afterwards.
    details.open = true;
    details.style.height = previousHeight;
    const style = getComputedStyle(details);
    const summaryStyle = getComputedStyle(summary);
    const collapsed =
      summary.getBoundingClientRect().height +
      parseFloat(style.paddingTop) +
      parseFloat(style.paddingBottom) +
      parseFloat(style.borderTopWidth) +
      parseFloat(style.borderBottomWidth) +
      parseFloat(summaryStyle.marginTop) +
      parseFloat(summaryStyle.marginBottom);
    const to = desiredOpen ? details.getBoundingClientRect().height : collapsed;
    details.style.height = `${from}px`;
    details.style.overflow = "clip";
    const next = animate(
      details,
      [{ height: `${from}px` }, { height: `${to}px` }],
      { duration: desiredOpen ? 300 : 220, easing: SMOOTH, fill: "both" },
    );
    animation = next;
    if (!next) {
      settle();
      return;
    }
    void next.finished.then(
      () => {
        if (animation === next) settle();
      },
      () => {},
    );
  };

  const nativeToggle = () => {
    if (animation) {
      // Native dismissal (Escape, outside click, or a selected ToC link) wins
      // even if it arrives before the opening animation has completed.
      if (!details.open) {
        desiredOpen = false;
        settle();
      }
      return;
    }
    desiredOpen = details.open;
    sync();
  };
  const reduce = () => {
    if (motionPreference.matches) settle();
  };
  sync();
  summary.addEventListener("click", toggle);
  details.addEventListener("toggle", nativeToggle);
  motionPreference.addEventListener("change", reduce);
  return () => {
    settle();
    summary.removeEventListener("click", toggle);
    details.removeEventListener("toggle", nativeToggle);
    motionPreference.removeEventListener("change", reduce);
    delete details.dataset.docsDisclosure;
    if (previousExpanded === null) summary.removeAttribute("aria-expanded");
    else summary.setAttribute("aria-expanded", previousExpanded);
    content.forEach((element, index) => {
      element.inert = previousInert[index];
    });
  };
}

function enhanceCopyFeedback(root: HTMLElement) {
  const observer = new MutationObserver((records) => {
    const labels = new Set<HTMLElement>();
    for (const record of records) {
      const target =
        record.target instanceof HTMLElement
          ? record.target
          : record.target.parentElement;
      const label = target?.closest<HTMLElement>("[data-copy-label]");
      if (label) labels.add(label);
    }
    for (const label of labels) {
      animate(label, [{ opacity: 0.72 }, { opacity: 1 }], {
        duration: 140,
        easing: SMOOTH,
      });
      if (label.textContent === "Copied" && !motionPreference.matches) {
        const icon = label.parentElement?.querySelector<SVGElement>("svg");
        if (icon) {
          const animation = icon.animate(
            [{ transform: "scale(0.88)" }, { transform: "scale(1)" }],
            { duration: 220, easing: SNAPPY },
          );
          running.add(animation);
          void animation.finished.then(
            () => running.delete(animation),
            () => running.delete(animation),
          );
        }
      }
    }
  });
  root.querySelectorAll<HTMLElement>("[data-copy-label]").forEach((label) => {
    observer.observe(label, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  });
  return () => observer.disconnect();
}

function enhanceTableScrolling(root: HTMLElement) {
  const scrollers = Array.from(
    root.querySelectorAll<HTMLElement>(".docs-table-scroll"),
  );
  const previousTabIndexes = scrollers.map((element) =>
    element.getAttribute("tabindex"),
  );
  const update = (element: HTMLElement) => {
    const overflows = element.scrollWidth > element.clientWidth + 1;
    if (overflows) element.tabIndex = 0;
    else if (element === document.activeElement) element.tabIndex = -1;
    else element.removeAttribute("tabindex");
    element.dataset.tableOverflow = String(overflows);
  };
  const observer = new ResizeObserver((entries) => {
    const changed = new Set<HTMLElement>();
    for (const { target } of entries) {
      const scroller = target.closest<HTMLElement>(".docs-table-scroll");
      if (scroller) changed.add(scroller);
    }
    changed.forEach(update);
  });
  for (const element of scrollers) {
    update(element);
    observer.observe(element);
    const table = element.querySelector("table");
    if (table) observer.observe(table);
  }
  return () => {
    observer.disconnect();
    scrollers.forEach((element, index) => {
      const previous = previousTabIndexes[index];
      if (previous === null) element.removeAttribute("tabindex");
      else element.setAttribute("tabindex", previous);
      delete element.dataset.tableOverflow;
    });
  };
}

function enhanceTabLinks(root: HTMLElement) {
  type NativeTabs = HTMLElement & {
    switchTab?: (tab: HTMLAnchorElement, index: number, sync: boolean) => void;
  };
  const groups = Array.from(
    root.querySelectorAll<NativeTabs>(".sl-markdown-content starlight-tabs"),
  ).filter((group) => !group.closest("docs-page-tabs"));
  if (!groups.length) return () => {};

  let frame = 0;
  let disposed = false;
  const linkedPanel = () => {
    let id: string;
    try {
      id = decodeURIComponent(location.hash.slice(1));
    } catch {
      return;
    }
    const target = id ? document.getElementById(id) : null;
    const panel = target?.closest<HTMLElement>('[role="tabpanel"]');
    const group = panel?.parentElement as NativeTabs | null;
    if (target && panel && group && groups.includes(group))
      return { target, panel, group };
  };
  const observer = new MutationObserver(() => {
    const linked = linkedPanel();
    if (!linked?.panel.hidden) return;
    const url = new URL(location.href);
    url.hash = "";
    history.replaceState(history.state, "", url);
  });
  const reveal = () => {
    observer.disconnect();
    if (disposed) return;
    const linked = linkedPanel();
    if (!linked?.group.switchTab) return;
    const tabs = (group: NativeTabs) =>
      Array.from(
        group.querySelectorAll<HTMLAnchorElement>(
          ':scope > .tablist-wrapper [role="tab"]',
        ),
      );
    const index = Array.from(
      linked.group.querySelectorAll(':scope > [role="tabpanel"]'),
    ).indexOf(linked.panel);
    const tab = tabs(linked.group)[index];
    if (!tab) return;
    const label = tab.textContent?.trim();
    const key = linked.group.dataset.syncKey;
    // Match synced groups without persisting a preference or moving focus.
    for (const group of groups) {
      if (group !== linked.group && (!key || group.dataset.syncKey !== key))
        continue;
      const groupTabs = tabs(group);
      const match = groupTabs.findIndex(
        (item) => item.textContent?.trim() === label,
      );
      if (match >= 0) {
        group.switchTab?.(groupTabs[match], match, false);
        groupTabs[match].scrollIntoView({
          block: "nearest",
          inline: "nearest",
          behavior: "instant",
        });
      }
    }
    (linked.target === linked.panel
      ? linked.group
      : linked.target
    ).scrollIntoView({
      block: "start",
      behavior: "instant",
    });
    for (const group of groups)
      observer.observe(group, {
        subtree: true,
        attributes: true,
        attributeFilter: ["hidden"],
      });
  };
  const schedule = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(reveal);
  };
  window.addEventListener("hashchange", schedule);
  void customElements.whenDefined("starlight-tabs").then(() => {
    if (!disposed) schedule();
  });
  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
    observer.disconnect();
    window.removeEventListener("hashchange", schedule);
  };
}

function setupPage() {
  disposePage?.();
  const root = document.querySelector<HTMLElement>(".docs-shell");
  if (!root) return;
  const disposers = Array.from(
    root.querySelectorAll<HTMLDetailsElement>(
      ".sidebar details, .accordion-step > details, .sl-markdown-content details, #starlight__mobile-toc",
    ),
  ).map(enhanceDisclosure);
  disposers.push(
    enhanceCopyFeedback(root),
    enhanceTableScrolling(root),
    enhanceTabLinks(root),
  );
  disposePage = () => {
    disposers.forEach((dispose) => dispose());
    disposePage = undefined;
  };
}

export function initDocsMotion() {
  if (initialized) return;
  initialized = true;
  document.addEventListener("astro:page-load", setupPage);
  document.addEventListener("astro:before-swap", () => {
    disposePage?.();
    for (const [element] of panels) cancelDocsPanel(element);
    for (const animation of running) animation.cancel();
    running.clear();
  });
  motionPreference.addEventListener("change", () => {
    if (motionPreference.matches) {
      for (const animation of running) animation.finish();
    }
  });
  setupPage();
}
