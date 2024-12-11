import { inBrowser } from "vitepress";
import type { Sidebar, SidebarItem, SidebarObject, SidebarSingle } from "../types";

const HASH_RE = /#.*$/;
const HASH_OR_QUERY_RE = /[?#].*$/;
const INDEX_OR_EXT_RE = /(?:(^|\/)index)?\.(?:md|html)$/;

export function ensureStartingSlash(path: string): string {
  return /^\//.test(path) ? path : `/${path}`;
}

export function resolveSidebar(_sidebar: Sidebar | undefined, path: string): Omit<SidebarObject, "base"> {
  if (!_sidebar) {
    return {
      items: [],
    };
  }
  if (isSidebarSingle(_sidebar)) {
    if (Array.isArray(_sidebar)) {
      return {
        items: addBase(_sidebar),
      };
    }
    return {
      items: addBase(_sidebar.items, _sidebar.base),
      collapsed: _sidebar.collapsed,
      indentFromLevel: _sidebar.indentFromLevel,
    };
  }
  path = ensureStartingSlash(path);
  const dir = Object.keys(_sidebar)
    .sort((a, b) => b.split("/").length - a.split("/").length)
    .find((dir) => {
      // make sure the multi sidebar key starts with slash too
      return path.startsWith(ensureStartingSlash(dir));
    });

  const sidebar = dir ? _sidebar[dir] : [];
  return Array.isArray(sidebar)
    ? { items: addBase(sidebar) }
    : {
        items: addBase(sidebar.items, sidebar.base),
        collapsed: sidebar.collapsed,
        indentFromLevel: sidebar.indentFromLevel,
      };
}

export function addBase(_items: SidebarItem[], _base?: string): SidebarItem[] {
  return _items.map((_item) => {
    const item = { ..._item };
    const base = item.base || _base;
    if (base && item.link) {
      item.link = base + item.link;
    }
    if (item.items) {
      item.items = addBase(item.items, base);
    }
    return item;
  });
}

export function isSidebarSingle(sidebar: Sidebar): sidebar is SidebarSingle {
  if (Array.isArray(sidebar)) {
    return true;
  }
  if ("items" in sidebar && Array.isArray(sidebar.items)) {
    return true;
  }
  return false;
}

/**
 * Check if the given sidebar item contains any active link.
 */
export function hasActiveLink(
  path: string,
  items: SidebarItem | SidebarItem[],
): boolean {
  if (Array.isArray(items)) {
    return items.some(item => hasActiveLink(path, item));
  }

  return isActive(path, items.link)
    ? true
    : items.items
      ? hasActiveLink(path, items.items)
      : false;
}

export function hasDirectActiveLink(
  path: string,
  items: SidebarItem | SidebarItem[],
): boolean {
  if (Array.isArray(items)) {
    return items.some(item => hasDirectActiveLink(path, item));
  }

  return isActive(path, items.link);
}

export function isActive(
  currentPath: string,
  matchPath?: string,
  asRegex: boolean = false,
): boolean {
  if (matchPath === undefined) {
    return false;
  }

  currentPath = normalize(`/${currentPath}`);

  if (asRegex) {
    return new RegExp(matchPath).test(currentPath);
  }

  if (normalize(matchPath) !== currentPath) {
    return false;
  }

  const hashMatch = matchPath.match(HASH_RE);

  if (hashMatch) {
    return (inBrowser ? location.hash : "") === hashMatch[0];
  }

  return true;
}

function normalize(path: string): string {
  return decodeURI(path)
    .replace(HASH_OR_QUERY_RE, "")
    .replace(INDEX_OR_EXT_RE, "$1");
}

export interface SidebarLink {
  text: string;
  link: string;
  docFooterText?: string;
}

export function getFlatSideBarLinks(sidebar: SidebarItem[]): SidebarLink[] {
  const links: SidebarLink[] = [];

  function recursivelyExtractLinks(items: SidebarItem[]) {
    for (const item of items) {
      if (item.text && item.link) {
        links.push({
          text: item.text,
          link: item.link,
          docFooterText: item.docFooterText,
        });
      }

      if (item.items) {
        recursivelyExtractLinks(item.items);
      }
    }
  }

  recursivelyExtractLinks(sidebar);

  return links;
}
