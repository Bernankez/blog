<script setup lang="ts">
import { cva } from "cva";
import { twMerge } from "tailwind-merge";
import { computed } from "vue";
import type { VariantProps } from "cva";
import BCollapse from "./BCollapse.vue";
import type { SidebarItem } from "../types";

const { sidebarItem, keepNodeStyle, level = 0, active } = defineProps<{
  base?: string;
  sidebarItem: SidebarItem;
  /** Whether to keep current node style even if the length of items is zero */
  keepNodeStyle?: boolean;
  /** current level, defaults to 0 */
  level?: number;
  active?: boolean;
}>();

const isParentNode = computed(() => sidebarItem.items?.length || (keepNodeStyle && sidebarItem.items?.length === 0));

const sidebarItemVariants = cva("pl-4 b-0 b-l-1 b-solid", {
  variants: {
    active: {
      true: "b-primary",
      false: "b-border",
    },
  },
});

export type SidebarItemVariants = VariantProps<typeof sidebarItemVariants>;
</script>

<template>
  <div v-if="isParentNode">
    <BCollapse>
      <template #header="{ collapsed }">
        <div v-if="sidebarItem.text" class="b-sidebar-item flex items-center justify-between py-2 text-base">
          <div class="font-semibold">
            {{ sidebarItem.text }}
          </div>
          <div class="i-line-md-chevron-small-right transition" :class="[!collapsed && 'rotate-90']"></div>
        </div>
      </template>
      <div :class="[level !== 0 && sidebarItem.text && twMerge(sidebarItemVariants({ active }))]">
        <BSidebarItem v-for="item in sidebarItem.items" :key="item.link" :level="level + 1" :sidebar-item="item" />
      </div>
    </BCollapse>
  </div>
  <div
    v-else class="b-sidebar-item cursor-pointer py-1.5 text-sm text-muted-foreground transition hover:text-foreground" :class="[active && 'text-primary']"
  >
    {{ sidebarItem.text }}
  </div>
</template>
