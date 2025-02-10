import { inBrowser } from "vitepress";

export function throttleAndDebounce<T extends any[]>(fn: (...args: T) => void, delay: number): (...args: T) => void {
  let timeoutId: NodeJS.Timeout;
  let called = false;

  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (!called) {
      fn(...args);
      called = true;
      setTimeout(() => {
        called = false;
      }, delay);
    } else {
      timeoutId = setTimeout(() => fn(...args), delay);
    }
  };
}

// https://github.com/rollup/rollup/blob/fec513270c6ac350072425cc045db367656c623b/src/utils/sanitizeFileName.ts

// eslint-disable-next-line no-control-regex
const INVALID_CHAR_REGEX = /[\u0000-\u001F"#$&*+,:;<=>?[\]^`{|}\u007F]/g;
const DRIVE_LETTER_REGEX = /^[a-z]:/i;

export function sanitizeFileName(name: string): string {
  const match = DRIVE_LETTER_REGEX.exec(name);
  const driveLetter = match ? match[0] : "";

  return (
    driveLetter
    + name
      .slice(driveLetter.length)
      .replace(INVALID_CHAR_REGEX, "_")
      // eslint-disable-next-line regexp/no-super-linear-backtracking
      .replace(/(^|\/)_+(?=[^/]*$)/, "$1")
  );
}

/**
 * Converts a url path to the corresponding js chunk filename.
 */
export function pathToFile(path: string) {
  let pagePath = path.replace(/\.html$/, "");
  pagePath = decodeURIComponent(pagePath);
  pagePath = pagePath.replace(/\/$/, "/index"); // /foo/ -> /foo/index
  if (import.meta.env.DEV) {
    // always force re-fetch content in dev
    pagePath += `.md?t=${Date.now()}`;
  } else {
    // in production, each .md file is built into a .md.js file following
    // the path conversion scheme.
    // /foo/bar.html -> ./foo_bar.md
    if (inBrowser) {
      const base = import.meta.env.BASE_URL;
      pagePath
        = `${sanitizeFileName(
          pagePath.slice(base.length).replace(/\//g, "_") || "index",
        )}.md`;
      // client production build needs to account for page hash, which is
      // injected directly in the page's html
      let pageHash = __VP_HASH_MAP__[pagePath.toLowerCase()];
      if (!pageHash) {
        pagePath = pagePath.endsWith("_index.md")
          ? `${pagePath.slice(0, -9)}.md`
          : `${pagePath.slice(0, -3)}_index.md`;
        pageHash = __VP_HASH_MAP__[pagePath.toLowerCase()];
      }
      if (!pageHash) {
        return null;
      }
      pagePath = `${base}${__ASSETS_DIR__}/${pagePath}.${pageHash}.js`;
    } else {
      // ssr build uses much simpler name mapping
      pagePath = `./${sanitizeFileName(
        pagePath.slice(1).replace(/\//g, "_"),
      )}.md.js`;
    }
  }

  return pagePath;
}

// https://github.com/sindresorhus/escape-string-regexp/blob/ba9a4473850cb367936417e97f1f2191b7cc67dd/index.js
export function escapeRegExp(str: string) {
  return str.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}
