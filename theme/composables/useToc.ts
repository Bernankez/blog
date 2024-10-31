import { useEventListener, useMounted } from "@vueuse/core";
import { getScrollOffset, useData, useRoute } from "vitepress";
import { computed, onMounted, ref, toRefs, watch } from "vue";
import { throttleAndDebounce } from "../utils";
import { getAbsoluteTop, getHeaders } from "../utils/toc";
import type { ThemeConfig, TocItem } from "../types";

export function useToc() {
  const { theme, frontmatter } = useData<ThemeConfig>();
  const { toc } = toRefs(theme.value);
  const route = useRoute();

  const mounted = useMounted();

  const headers = ref<TocItem[]>([]);
  watch([() => route.data.relativePath, mounted], ([_, _mounted]) => {
    if (_mounted) {
      headers.value = getHeaders(frontmatter.value.toc ?? toc?.value?.outline);
    } else {
      headers.value = [];
    }
  }, {
    immediate: true,
    flush: "post",
  });

  const flattedHeaders = computed(() => flatHeaders(headers.value));

  function flatHeaders(headers: TocItem[], result: TocItem[] = []) {
    for (const header of headers) {
      result.push(header);
      if (header.children?.length) {
        flatHeaders(header.children, result);
      }
    }
    return result;
  }

  const activeLink = ref<string>();
  const activeIndex = computed(() => flattedHeaders.value.findIndex(item => item.link === activeLink.value));

  function updateActiveLink() {
    const scrollY = window.scrollY;
    const innerHeight = window.innerHeight;
    const offsetHeight = document.body.offsetHeight;
    const isBottom = Math.abs(scrollY + innerHeight - offsetHeight) < 1;

    const sortedHeaders = flattedHeaders.value
      .map(({ element, link }) => ({
        link,
        top: getAbsoluteTop(element),
      }))
      .filter(({ top }) => !Number.isNaN(top))
      .sort((a, b) => a.top - b.top);

    // no headers available for active link
    if (!sortedHeaders.length) {
      activeLink.value = undefined;
      return;
    }

    // page top
    if (scrollY < 1) {
      activeLink.value = undefined;
      return;
    }

    // page bottom - highlight last link
    if (isBottom) {
      activeLink.value = sortedHeaders.at(-1)?.link;
      return;
    }

    // find the last header above the top of viewport
    let _activeLink: string | undefined;
    for (const { link, top } of sortedHeaders) {
      if (top > scrollY + getScrollOffset() + 4) {
        break;
      }
      _activeLink = link;
    }
    activeLink.value = _activeLink;
  }

  const onScroll = throttleAndDebounce(updateActiveLink, 100);

  onMounted(() => {
    requestAnimationFrame(updateActiveLink);
  });

  useEventListener("scroll", onScroll);

  return {
    headers,
    flattedHeaders,
    activeLink,
    activeIndex,
    updateActiveLink,
  };
}
