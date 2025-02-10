<script setup lang="ts">
import type { NavItemWithLink, ThemeConfig } from "../../types";
import { useData } from "vitepress";
import { computed } from "vue";
import { isActive } from "../../utils/sidebar";

const { item } = defineProps<{
  item: NavItemWithLink;
}>();

const { page } = useData<ThemeConfig>();
const active = computed(() => isActive(page.value.relativePath, item.activeMatch, true));
</script>

<template>
  <a class="inline-block w-full flex items-center gap-1 py-1.5 text-sm transition hover:text-primary motion-reduce:transition-none" :class="[active && 'text-primary']" :href="item.link" :rel="item.rel" :target="item.target">
    {{ item.text }}
    <div v-if="item.target === '_blank'" class="i-lucide-arrow-up-right text-xs text-muted-foreground"></div>
  </a>
</template>
