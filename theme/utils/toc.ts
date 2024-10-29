// import { getScrollOffset, type Header } from "vitepress";
// import { onMounted, onUnmounted, onUpdated, ref, type Ref } from "vue";
// import type { DefaultTheme } from "vitepress/theme";
// import { throttleAndDebounce } from ".";

import type { ThemeConfig, TocItem, TocOutline } from "../types";

export function getHeaders(range: TocOutline | TocOutline["level"] | false): TocItem[] {
  const headers = [
    ...document.querySelectorAll(".b-doc :where(h1,h2,h3,h4,h5,h6)"),
  ]
    .filter(el => el.id && el.hasChildNodes())
    .map((el) => {
      const level = Number(el.tagName[1]);
      return {
        element: el as HTMLHeadElement,
        title: serializeHeader(el),
        link: `#${el.id}`,
        level,
      };
    });

  return resolveHeaders(headers, range);
}

function serializeHeader(h: Element): string {
  let ret = "";
  for (const node of h.childNodes) {
    if (node.nodeType === 1) {
      if (
        (node as Element).classList.contains("VPBadge")
        || (node as Element).classList.contains("header-anchor")
        || (node as Element).classList.contains("ignore-header")
      ) {
        continue;
      }
      ret += node.textContent;
    } else if (node.nodeType === 3) {
      ret += node.textContent;
    }
  }
  return ret.trim();
}

function resolveHeaders(headers: TocItem[], range?: TocOutline | TocOutline["level"] | false) {
  if (range === false) {
    return [];
  }

  const levelsRange = (typeof range === "object" && !Array.isArray(range)
    ? range.level
    : range) || 2;

  const [high, low]: [number, number] = typeof levelsRange === "number"
    ? [levelsRange, levelsRange]
    : levelsRange === "deep"
      ? [2, 6]
      : levelsRange;

  return buildTree(headers, high, low);
}

export function resolveTitle(theme: ThemeConfig): string {
  return (
    (typeof theme.toc?.outline === "object"
      && !Array.isArray(theme.toc.outline)
      && theme.toc.outline.label)
      || theme.toc?.title
      || "Table of content"
  );
}

export function getAbsoluteTop(element: HTMLElement): number {
  let offsetTop = 0;
  while (element !== document.body) {
    if (element === null) {
      // child element is:
      // - not attached to the DOM (display: none)
      // - set to fixed position (not scrollable)
      // - body or html element (null offsetParent)
      return Number.NaN;
    }
    offsetTop += element.offsetTop;
    element = element.offsetParent as HTMLElement;
  }
  return offsetTop;
}

function buildTree(data: TocItem[], min: number, max: number): TocItem[] {
  const result: TocItem[] = [];
  const stack: (TocItem | { level: number; shouldIgnore: true })[] = [];

  data.forEach((item) => {
    const node = { ...item, children: [] };
    let parent = stack[stack.length - 1];

    while (parent && parent.level >= node.level) {
      stack.pop();
      parent = stack[stack.length - 1];
    }

    if (
      node.element.classList.contains("ignore-header")
      || (parent && "shouldIgnore" in parent)
    ) {
      stack.push({ level: node.level, shouldIgnore: true });
      return;
    }

    if (node.level > max || node.level < min) {
      return;
    }

    if (parent) {
      parent.children!.push(node);
    } else {
      result.push(node);
    }

    stack.push(node);
  });

  return result;
}
