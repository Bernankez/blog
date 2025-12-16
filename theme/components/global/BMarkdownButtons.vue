<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints, useClipboard } from "@vueuse/core";
import { ref } from "vue";
import BButton from "../common/BButton.vue";

function removeHtmlExtension(pathSegment: string): string {
  const lastSlashIndex = pathSegment.lastIndexOf("/");
  const lastDotIndex = pathSegment.lastIndexOf(".");

  if (lastDotIndex > lastSlashIndex && lastDotIndex !== -1 && pathSegment.endsWith(".html")) {
    return pathSegment.substring(0, lastDotIndex);
  }

  return pathSegment;
}

/**
 * Cleans a given URL by removing its file extension from the pathname, if present.
 *
 * This function parses the input URL, removes the file extension from the last path segment
 * if it exists (i.e., if the last dot comes after the last slash), and trims any trailing slash
 * (except for the root path). The returned URL excludes query parameters and hash fragments.
 *
 * @param url - The full URL string to clean.
 * @returns The cleaned URL string with the file extension removed from the pathname.
 *
 * @example
 * cleanUrl('https://example.com/docs/page.md')          // 'https://example.com/docs/page'
 * cleanUrl('https://example.com/docs/')                 // 'https://example.com/docs'
 * cleanUrl('https://example.com/docs/page.md?query=1')  // 'https://example.com/docs/page'
 */
function cleanUrl(url: string): string {
  const { origin, pathname } = new URL(url);

  const pathnameWithoutTrailingSlash = pathname.replace(/\/+$/, "");

  if (pathname.length) {
    return origin + removeHtmlExtension(pathnameWithoutTrailingSlash);
  }
  else {
    return origin;
  }
}

function resolveMarkdownPageURL(url: string): string {
  const cleanedURL = cleanUrl(url);

  // If the URL is the root of the site, append 'index.md'
  if (cleanedURL === window.location.origin) {
    return `${cleanedURL}/index.md`;
  }
  else {
    return `${cleanedURL}.md`;
  }
}

/**
 * Triggers a file download in the browser with the specified filename and content.
 *
 * @param filename - The name for the downloaded file (e.g., 'report.txt').
 * @param content - The content of the file. Can be a string or other Blob-compatible data.
 * @param blobType - The MIME type of the content (e.g., 'text/plain', 'application/json').
 *
 * @example
 * downloadFile('hello.txt', 'Hello, world!');
 */
function downloadFile(filename: string, content: string | Blob, blobType = "text/plain"): void {
  const blob = content instanceof Blob ? content : new Blob([content], { type: blobType });
  const url = URL.createObjectURL(blob);

  Object.assign(document.createElement("a"), {
    href: url,
    download: filename,
  }).click();

  URL.revokeObjectURL(url);
}

const { sm } = useBreakpoints(breakpointsTailwind);

const duration = ref(1500);

/** Copy markdown */
const { copy, copied } = useClipboard({
  copiedDuring: duration.value,
  legacy: true,
});
const currentURL = window.location.origin + window.location.pathname;
function onCopy() {
  fetch(resolveMarkdownPageURL(currentURL))
    .then(response => response.text())
    .then(text => copy(text))
    .catch(error => console.error("❌ Error copying markdown:", error));
}

/** Download markdown */
const downloaded = ref(false);
function onDownload() {
  const markdownPageURL = resolveMarkdownPageURL(currentURL);
  fetch(markdownPageURL)
    .then(response => response.text())
    .then((text) => {
      const filename = markdownPageURL.split("/").pop() || "科科Cole.md";
      downloadFile(filename, text, "text/markdown");

      downloaded.value = true;
      setTimeout(() => {
        downloaded.value = false;
      }, duration.value);
    })
    .catch(error => console.error("❌ Error downloading markdown:", error));
}
</script>

<template>
  <div class="my-sm flex items-center gap-1">
    <BButton variant="ghost" :size="sm ? 'sm' : 'icon-sm'" title="复制Markdown" class="flex items-center gap-1" @click="onCopy">
      <div :class="copied ? 'i-lucide-check' : 'i-lucide-copy'"></div>
      {{ sm ? '复制Markdown' : '' }}
    </BButton>
    <BButton variant="ghost" :size="sm ? 'sm' : 'icon-sm'" title="保存为Markdown" class="flex items-center gap-1" @click="onDownload">
      <div :class="downloaded ? 'i-lucide-check' : 'i-lucide-download'"></div>
      {{ sm ? '保存为Markdown' : '' }}
    </BButton>
  </div>
</template>
