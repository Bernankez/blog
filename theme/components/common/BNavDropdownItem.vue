<script setup lang="ts">
import { twMerge } from "tailwind-merge";
import { useData } from "vitepress";
import { computed } from "vue";
import { isActive } from "../../utils/sidebar";
import type { NavItemWithLink, ThemeConfig } from "../../types";

const { item } = defineProps<{
  item: NavItemWithLink;
}>();

const { page } = useData<ThemeConfig>();
const active = computed(() => isActive(page.value.relativePath, item.activeMatch, true));

const base = computed(() => twMerge(["flex items-center gap-1 rounded-lg p-2 text-sm transition hover:bg-secondary motion-reduce:transition-none hover:text-secondary-foreground! outline-none", active.value && "text-primary hover:text-primary"]));
</script>

<template>
  <a v-if="!item.items" :class="[base]" :href="item.link" :rel="item.rel" :target="item.target">
    {{ item.text }}
    <div v-if="item.target === '_blank'" class="i-lucide-arrow-up-right text-xs text-muted-foreground"></div>
  </a>
</template>
