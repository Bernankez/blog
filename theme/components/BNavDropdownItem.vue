<script setup lang="ts">
import { twMerge } from "tailwind-merge";
import { useData } from "vitepress";
import { computed } from "vue";
import { isActive } from "../utils/sidebar";
import BPopover from "./BPopover.vue";
import type { NavItem, ThemeConfig } from "../types";

const { item } = defineProps<{
  item: NavItem;
}>();

const { page } = useData<ThemeConfig>();

const active = computed(() => isActive(page.value.relativePath, item.activeMatch, true));

const base = computed(() => twMerge(
  ["rounded-xl bg-opacity-40 px-sm py-2 transition hover:bg-secondary hover:bg-opacity-70 motion-reduce:transition-none"],
  [active.value && "bg-secondary hover:bg-opacity-50! shadow-inset shadow"],
));
</script>

<template>
  <BPopover :disabled="!item.items" trigger="hover">
    <template #reference>
      <a v-if="!item.items" :class="[base]" :href="item.link" :rel="item.rel" :target="item.target">
        <span :class="[active && 'text-primary']">
          {{ item.text }}
        </span>
      </a>
      <div v-else class="inline-block cursor-pointer" :class="[active && 'text-primary', base]">
        {{ item.text }}
      </div>
    </template>
    <div>
      test
    </div>
  </BPopover>
</template>
