<script setup lang="ts">
import { computed } from "vue";
import { hasDirectActiveLink, isActive } from "../utils/sidebar";
import BCollapse from "./BCollapse.vue";
import type { SidebarItem } from "../types";

const { item, keepNodeStyle, level = 0, indentFromLevel = 1, path, parent } = defineProps<{
  parent?: SidebarItem;
  item: SidebarItem;
  /** Whether to keep current node style even if the length of items is zero */
  keepNodeStyle?: boolean;
  /** current level, defaults to 0 */
  level?: number;
  indentFromLevel?: number;
  path: string;
}>();

const isParentNode = computed(() => item.items?.length || (keepNodeStyle && item.items?.length === 0));
const active = computed(() => isActive(path, item.link));
const hasActive = computed(() => hasDirectActiveLink(path, isParentNode.value ? item.items! : (parent?.items || [])));
</script>

<template>
  <div v-if="isParentNode">
    <BCollapse :readonly="item.collapsed === undefined" :default-collapsed="item.collapsed === true">
      <template v-if="item.text" #header="{ collapsed }">
        <div class="b-sidebar-item flex items-center justify-between py-2 transition motion-reduce:transition-none" :class="[hasActive ? 'text-base' : 'text-muted-foreground']">
          <div class="font-semibold">
            {{ item.text }}
          </div>
          <div v-if="item.collapsed !== undefined" class="i-line-md-chevron-small-right transition motion-reduce:transition-none" :class="[!collapsed && 'rotate-90']"></div>
        </div>
      </template>
      <div :class="[level >= indentFromLevel && item.text && 'pl-4 b-0 b-l-1 b-solid b-border']">
        <BSidebarItem v-for="_item in item.items" :key="_item.link" :parent="item" :path :level="level + 1" :item="_item" :indent-from-level="_item.indentFromLevel" :collapsed="_item.collapsed" />
      </div>
    </BCollapse>
  </div>
  <a
    v-else class="b-sidebar-item relative block cursor-pointer rounded-lg py-1.5 text-sm transition hover:text-primary motion-reduce:transition-none" :href="item.link" :rel="item.rel" :target="item.target" :class="[hasActive ? 'text-base' : 'text-muted-foreground', active && 'text-primary']"
  >
    <div v-if="active" class="absolute top-50% box-border h-70% w-2px bg-primary -left-17px -translate-y-50%"></div>
    {{ item.text }}
  </a>
</template>
