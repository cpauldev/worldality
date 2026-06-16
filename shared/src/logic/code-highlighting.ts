import { createHighlighter } from "shiki";

import { buttonVariants } from "../ui";

const DEFAULT_SELECTOR =
  ".wl-code-panel > code.wl-code-text, .rounded-b-none > code.wl-code-text";
const SOURCE_ATTR = "data-wl-highlight-source";
const HIGHLIGHTED_ATTR = "data-wl-highlighted";
const COPY_BUTTON_CLASS = "wl-code-copy-btn";
const PRESERVE_SOURCE_ATTR = "data-wl-preserve-source";
const SOURCE_NODE_ATTR = "data-wl-source-node";
const RENDERED_NODE_ATTR = "data-wl-rendered";

type Language = "javascript" | "typescript" | "jsx" | "tsx" | "html" | "json";

const LANGUAGE_ALIASES: Record<string, Language> = {
  js: "javascript",
  javascript: "javascript",
  ts: "typescript",
  typescript: "typescript",
  jsx: "jsx",
  tsx: "tsx",
  html: "html",
  xml: "html",
  markup: "html",
  json: "json",
};

function normalizeLanguage(input?: string | null): Language | null {
  if (!input) return null;
  return LANGUAGE_ALIASES[input.toLowerCase().trim()] ?? null;
}

function inferLanguage(code: string): Language {
  const value = code.trim();
  if (!value) return "typescript";
  if (
    (value.startsWith("{") || value.startsWith("[")) &&
    value.includes(":") &&
    !value.includes("=>")
  ) {
    return "json";
  }
  if (value.includes("<") && value.includes(">")) {
    return "tsx";
  }
  if (/\btype\b|\binterface\b|:\s*[A-Za-z_$]/.test(value)) {
    return "typescript";
  }
  return "javascript";
}

function normalizeNewlines(text: string): string {
  return text.replace(/\r\n?/g, "\n").trimEnd();
}

const SVG_NS = "http://www.w3.org/2000/svg";

function clipboardIcon(): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("width", "14");
  svg.setAttribute("height", "14");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("aria-hidden", "true");
  const rect = document.createElementNS(SVG_NS, "rect");
  rect.setAttribute("width", "8");
  rect.setAttribute("height", "4");
  rect.setAttribute("x", "8");
  rect.setAttribute("y", "2");
  rect.setAttribute("rx", "1");
  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute(
    "d",
    "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
  );
  svg.appendChild(rect);
  svg.appendChild(path);
  return svg;
}

function checkIcon(): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("width", "14");
  svg.setAttribute("height", "14");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute("d", "M20 6 9 17l-5-5");
  svg.appendChild(path);
  return svg;
}

let highlighterPromise: ReturnType<typeof createHighlighter> | null = null;

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["one-light", "one-dark-pro"],
      langs: ["javascript", "typescript", "jsx", "tsx", "html", "json"],
    });
  }
  return highlighterPromise;
}

async function copyText(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall back to document.execCommand below.
  }
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.setAttribute("readonly", "");
    textArea.style.position = "absolute";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.select();
    const copied = document.execCommand("copy");
    document.body.removeChild(textArea);
    return copied;
  } catch {
    return false;
  }
}

function ensureCopyButton(panel: HTMLElement, codeEl: HTMLElement): void {
  if (panel.querySelector(`.${COPY_BUTTON_CLASS}`)) return;
  panel.classList.add("wl-code-panel");

  const button = document.createElement("button");
  button.type = "button";
  button.className = `${COPY_BUTTON_CLASS} ${buttonVariants({ variant: "ghost", size: "icon-sm" })}`;
  button.setAttribute("aria-label", "Copy code");
  button.appendChild(clipboardIcon());

  let resetTimer: ReturnType<typeof setTimeout> | undefined;
  button.addEventListener("click", async () => {
    const source = codeEl.getAttribute(SOURCE_ATTR) ?? codeEl.textContent ?? "";
    const copied = await copyText(source);
    button.dataset.state = copied ? "copied" : "error";
    button.replaceChildren(copied ? checkIcon() : clipboardIcon());
    if (resetTimer) clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
      button.dataset.state = "";
      button.replaceChildren(clipboardIcon());
    }, 1400);
  });

  panel.appendChild(button);
}

function shouldPreserveSourceNode(codeEl: HTMLElement): boolean {
  return codeEl.getAttribute(PRESERVE_SOURCE_ATTR) === "true";
}

function ensureSourceNode(codeEl: HTMLElement): HTMLElement {
  const existing = codeEl.querySelector<HTMLElement>(
    `[${SOURCE_NODE_ATTR}="true"]`,
  );
  if (existing) return existing;

  const sourceNode = document.createElement("span");
  sourceNode.setAttribute(SOURCE_NODE_ATTR, "true");
  sourceNode.style.display = "none";

  while (codeEl.firstChild) {
    sourceNode.appendChild(codeEl.firstChild);
  }

  codeEl.appendChild(sourceNode);
  return sourceNode;
}

function ensureRenderedNode(codeEl: HTMLElement): HTMLElement {
  const existing = codeEl.querySelector<HTMLElement>(
    `[${RENDERED_NODE_ATTR}="true"]`,
  );
  if (existing) return existing;

  const renderedNode = document.createElement("span");
  renderedNode.setAttribute(RENDERED_NODE_ATTR, "true");
  codeEl.appendChild(renderedNode);
  return renderedNode;
}

async function highlightCodeElement(codeEl: HTMLElement): Promise<void> {
  codeEl.setAttribute(HIGHLIGHTED_ATTR, "false");
  const preserveSourceNode = shouldPreserveSourceNode(codeEl);
  const sourceNode = preserveSourceNode ? ensureSourceNode(codeEl) : null;
  const renderedTarget = preserveSourceNode
    ? ensureRenderedNode(codeEl)
    : codeEl;
  const source = normalizeNewlines(
    sourceNode?.textContent ?? codeEl.textContent ?? "",
  );
  const panel = codeEl.parentElement;
  if (panel) ensureCopyButton(panel, codeEl);

  if (
    codeEl.getAttribute(SOURCE_ATTR) === source &&
    renderedTarget.querySelector(".line")
  ) {
    codeEl.setAttribute(HIGHLIGHTED_ATTR, "true");
    return;
  }

  const language =
    normalizeLanguage(codeEl.dataset.lang) ?? inferLanguage(source);

  try {
    const highlighter = await getHighlighter();
    const html = highlighter.codeToHtml(source, {
      lang: language,
      themes: { light: "one-light", dark: "one-dark-pro" },
    });

    // Parse into a sandboxed document and move only element nodes (skip whitespace text nodes)
    const parser = new DOMParser();
    const parsed = parser.parseFromString(html, "text/html");
    const parsedCode = parsed.querySelector("code");

    renderedTarget.textContent = "";
    if (parsedCode) {
      for (const child of [...parsedCode.childNodes]) {
        if (child.nodeType === Node.ELEMENT_NODE) {
          renderedTarget.appendChild(child);
        }
      }
    }

    codeEl.classList.add(`language-${language}`);
    codeEl.setAttribute(SOURCE_ATTR, source);
    codeEl.setAttribute(HIGHLIGHTED_ATTR, "true");
  } catch {
    codeEl.setAttribute(SOURCE_ATTR, source);
    codeEl.setAttribute(HIGHLIGHTED_ATTR, "true");
  }
}

export function highlightCodeInElement(
  root: ParentNode = document,
  selector = DEFAULT_SELECTOR,
): void {
  const codeElements = root.querySelectorAll<HTMLElement>(selector);
  for (const codeEl of codeElements) {
    void highlightCodeElement(codeEl);
  }
}

export function installCodeHighlighting(
  root: Document | HTMLElement = document,
  selector = DEFAULT_SELECTOR,
): () => void {
  if (
    typeof window === "undefined" ||
    typeof MutationObserver === "undefined"
  ) {
    return () => {};
  }

  const observeRoot =
    root instanceof Document ? (root.body ?? root.documentElement) : root;
  if (!observeRoot) return () => {};

  let scheduled = false;
  const run = () => highlightCodeInElement(root, selector);
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(() => {
      scheduled = false;
      run();
    });
  };

  run();

  const observer = new MutationObserver(schedule);
  observer.observe(observeRoot, {
    childList: true,
    subtree: true,
    characterData: true,
  });
  return () => observer.disconnect();
}
