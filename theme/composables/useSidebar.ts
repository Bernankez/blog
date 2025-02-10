import type { ThemeConfig } from "../types";
import { useData } from "vitepress";
import { computed, toRefs } from "vue";
import { resolveSidebar } from "../utils/sidebar";

export function useSidebar() {
  const { theme, page } = useData<ThemeConfig>();

  const path = computed(() => page.value.relativePath);
  const { sidebar } = toRefs(theme.value);

  const current = computed(() => resolveSidebar(sidebar?.value, path.value));

  return {
    path,
    origin: sidebar,
    sidebar: current,
  };
}
