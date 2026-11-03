import type mermaidType from "mermaid";
import { mermaidConfig } from "./mermaid-theme.ts";

let mermaidModule: typeof mermaidType | null = null;

function themeFromDocument(): "light" | "dark" {
  const htmlTheme = document.documentElement.getAttribute("data-theme");
  const bodyTheme = document.body.getAttribute("data-theme");
  const dataTheme = htmlTheme || bodyTheme;
  return dataTheme === "dark" ? "dark" : "light";
}

async function getMermaid() {
  if (!mermaidModule) {
    const mod = await import("mermaid");
    mermaidModule = mod.default;
    mermaidModule.initialize(mermaidConfig(themeFromDocument()));
  }
  return mermaidModule;
}

export async function renderMermaidDiagrams(root: ParentNode = document) {
  const nodes = root.querySelectorAll("pre.mermaid:not([data-processed])");
  if (nodes.length === 0) return;

  const mermaid = await getMermaid();
  const config = mermaidConfig(themeFromDocument());
  mermaid.initialize(config);

  for (const node of nodes) {
    if (!(node instanceof HTMLPreElement)) continue;
    const definition = node.dataset.diagram || node.textContent?.trim() || "";
    if (!definition) continue;
    if (!node.dataset.diagram) node.dataset.diagram = definition;

    const renderId = `mermaid-${Math.random().toString(36).slice(2, 11)}`;
    try {
      const { svg } = await mermaid.render(renderId, definition);
      node.innerHTML = svg;
      const diagram = node.querySelector("svg");
      const width = diagram?.viewBox.baseVal.width;
      if (diagram && width) {
        const bounds = diagram.viewBox.baseVal;
        const background = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect",
        );
        background.setAttribute("x", String(bounds.x));
        background.setAttribute("y", String(bounds.y));
        background.setAttribute("width", String(bounds.width));
        background.setAttribute("height", String(bounds.height));
        background.setAttribute("aria-hidden", "true");
        // A drawn background survives printing with CSS backgrounds disabled.
        background.style.fill = config.themeVariables.primaryColor;
        diagram.prepend(background);
        diagram.style.width = `${width}px`;
        diagram.style.maxWidth = "none";
        diagram.style.height = "auto";
      }
      node.dataset.processed = "true";
      updateDiagramOverflow();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown rendering error";
      node.dataset.processed = "true";
      node.textContent = "";
      node.classList.add("mermaid-error");
      const strong = document.createElement("strong");
      strong.textContent = "Could not render diagram.";
      node.append(strong, " ", message);
    }
  }
}

function updateDiagramOverflow() {
  for (const figure of document.querySelectorAll<HTMLElement>(
    ".mermaid-diagram",
  )) {
    const drawing = figure.querySelector("pre.mermaid svg");
    const overflowing = Boolean(
      drawing &&
      drawing.getBoundingClientRect().width + 32 > figure.clientWidth,
    );
    figure.dataset.diagramOverflow = String(overflowing);
    const caption = figure.querySelector<HTMLElement>("figcaption");
    if (caption)
      caption.hidden =
        !overflowing &&
        !caption.querySelector("span:not(.diagram-scroll-hint)");
  }
}

let listenersBound = false;

export function bindMermaidLifecycle() {
  if (typeof document === "undefined" || listenersBound) return;
  listenersBound = true;

  const run = () => {
    void renderMermaidDiagrams();
  };

  run();
  document.addEventListener("astro:page-load", run);
  let resizeFrame = 0;
  window.addEventListener(
    "resize",
    () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(updateDiagramOverflow);
    },
    { passive: true },
  );

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "data-theme"
      ) {
        document
          .querySelectorAll("pre.mermaid[data-processed]")
          .forEach((el) => {
            if (!(el instanceof HTMLPreElement)) return;
            // Keep the current SVG until its replacement is ready, preserving layout.
            delete el.dataset.processed;
            el.classList.remove("mermaid-error");
          });
        run();
        break;
      }
    }
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
}
