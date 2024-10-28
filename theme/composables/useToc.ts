import { useData } from "vitepress";
import { computed, toRefs } from "vue";
import { getHeaders } from "../utils/toc";
import type { ThemeConfig } from "../types";

export function useToc() {
  const { theme, frontmatter } = useData<ThemeConfig>();

  const { toc } = toRefs(theme.value);

  const headers = computed(() => getHeaders(frontmatter.value.toc ?? toc?.value));

  return {
    headers,
  };
}
