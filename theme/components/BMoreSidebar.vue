<script setup lang="ts">
import { useData } from "vitepress";
import { computed } from "vue";
import { isActive } from "../utils/sidebar";
import BMoreSidebarItem from "./BMoreSidebarItem.vue";
import type { NavItem, ThemeConfig } from "../types";

const { item } = defineProps<{
  item: NavItem;
}>();

const { page } = useData<ThemeConfig>();
const active = computed(() => isActive(page.value.relativePath, item.activeMatch, true));
</script>

<template>
  <a v-if="!item.items" class="inline-block w-full flex items-center gap-1 py-1.5 text-sm transition hover:text-primary motion-reduce:transition-none" :class="[active && 'text-primary']" :href="item.link" :rel="item.rel" :target="item.target">
    {{ item.text }}
    <div v-if="item.target === '_blank'" class="i-lucide-arrow-up-right text-xs text-muted-foreground"></div>
  </a>
  <template v-else>
    <div class="cursor-default select-none py-1.5 font-semibold">
      {{ item.text }}
    </div>
    <div v-for="(group, i) in item.items" :key="i" class="pl-4">
      <template v-if="group.items">
        <div class="select-none py-1.5 text-xs text-muted-foreground">
          {{ group.text }}
        </div>
        <BMoreSidebarItem v-for="(subItem, index) in group.items" :key="index" :item="subItem" />
      </template>
      <BMoreSidebarItem v-else :item="group" />
    </div>
  </template>
</template>
