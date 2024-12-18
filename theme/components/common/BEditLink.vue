<script setup lang="ts">
import { useData } from "vitepress";
import { computed } from "vue";
import BLink from "./BLink.vue";
import type { ThemeConfig } from "../../types";

const { page, theme } = useData<ThemeConfig>();
const pattern = computed(() => {
  const _pattern = theme.value.editLink?.pattern;
  if (typeof _pattern === "string") {
    return _pattern.replace(/:path/g, page.value.filePath);
  }
  return _pattern?.(page.value);
});
</script>

<template>
  <BLink v-if="theme.editLink" :href="pattern" class="w-fit flex items-center gap-1 text-sm text-foreground text-opacity-60 font-medium transition hover:text-primary motion-reduce:transition-none">
    <div class="i-lucide-edit"></div>
    {{ theme.editLink.text || "Edit this page on GitHub" }}
  </BLink>
</template>
