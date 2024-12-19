<script setup lang="ts">
import { computed } from "vue";
import { hasDirectActiveLink, isActive } from "../../utils/sidebar";
import BCollapse from "./BCollapse.vue";
import type { SidebarItem } from "../../types";

const { item, keepNodeStyle, level = 0, path, parent } = defineProps<{
  parent?: SidebarItem;
  item: SidebarItem;
  /** Whether to keep current node style even if the length of items is zero */
  keepNodeStyle?: boolean;
  /** current level, defaults to 0 */
  level?: number;
  path: string;
}>();

const emit = defineEmits<{
  click: [e: MouseEvent, item: SidebarItem];
}>();

const isParentNode = computed(() => item.items?.length || (keepNodeStyle && item.items?.length === 0));
const active = computed(() => isActive(path, item.link));
const hasActive = computed(() => hasDirectActiveLink(path, isParentNode.value ? item.items! : (parent?.items || [])));

function onClick(e: MouseEvent, _item?: SidebarItem) {
  emit("click", e, _item ?? item);
}
</script>

<template>
  <div v-if="isParentNode">
    <BCollapse :readonly="item.collapsed === undefined" :default-collapsed="item.collapsed === true">
      <template v-if="item.text" #header="{ collapsed }">
        <div class="b-sidebar-item flex select-none items-center justify-between py-2 transition motion-reduce:transition-none" :class="[!hasActive && 'opacity-70']">
          <div class="font-semibold">
            {{ item.text }}
          </div>
          <div v-if="item.collapsed !== undefined" class="i-line-md-chevron-small-right transition motion-reduce:transition-none" :class="[!collapsed && 'rotate-90']"></div>
        </div>
      </template>
      <div :class="[level >= (item.indentFromLevel ?? 1) && item.text && 'pl-4 b-0 b-l-1 b-solid b-border', !hasActive && 'opacity-70']">
        <BSidebarItem v-for="_item in item.items" :key="_item.link" :parent="item" :path :level="level + 1" :item="_item" :collapsed="_item.collapsed" @click="onClick" />
      </div>
    </BCollapse>
  </div>
  <a
    v-else class="b-sidebar-item relative block cursor-pointer select-none rounded-lg py-1.5 text-sm transition hover:text-primary motion-reduce:transition-none" :href="item.link" :rel="item.rel" :target="item.target" :class="[active && 'text-primary']" @click="onClick"
  >
    <Transition name="fade">
      <div v-if="active" class="absolute top-50% box-border h-70% w-2px bg-primary -left-17px -translate-y-50%"></div>
    </Transition>
    {{ item.text }}
  </a>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition-timing-function: var(--b-transition-animation);
  transition-duration: var(--b-transition-duration);
  transition-property: opacity;
}

@media (prefers-reduced-motion: reduce) {
  .fade-enter-active,
  .fade-leave-active {
    transition: none;
  }
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
