<script setup lang="ts">
import type { NavItem, ThemeConfig } from "../../types";
import { twMerge } from "tailwind-merge";
import { useData } from "vitepress";
import { computed, ref } from "vue";
import { isActive } from "../../utils/sidebar";
import BNavDropdownItem from "./BNavDropdownItem.vue";
import BPopover from "./BPopover.vue";

const { item } = defineProps<{
  item: NavItem;
}>();

const show = ref(false);

const { page } = useData<ThemeConfig>();
const active = computed(() => isActive(page.value.relativePath, item.activeMatch, true));

const base = computed(() => twMerge(
  ["rounded-xl bg-opacity-40 px-sm py-2 transition hover:text-primary motion-reduce:transition-none"],
  [active.value && "bg-accent hover:bg-opacity-50! shadow-inset shadow"],
));
</script>

<template>
  <a v-if="!item.items" :class="[base, active && 'text-primary']" class="flex select-none items-center gap-1" :href="item.link" :rel="item.rel" :target="item.target" :title="item.text">
    <div :class="[item.icon]"></div>
    <span class="hidden md:inline">
      {{ item.text }}
    </span>
    <div v-if="item.target === '_blank'" class="i-lucide-arrow-up-right text-xs text-muted-foreground"></div>
  </a>
  <BPopover v-else trigger="hover" :offset="0" :auto-close="false" raw-popup-style class="flex items-center gap-1" :class="[active && 'text-primary', base]" :title="item.text">
    <template #reference>
      <div :class="[item.icon]"></div>
      <div class="hidden cursor-pointer select-none md:inline-block" @mouseenter="show = true">
        {{ item.text }}
      </div>
    </template>
    <div class="z-[var(--b-popover-z-index)] min-w-50 b-1 b-border rounded-lg b-solid bg-card shadow" :side-offset="5">
      <div v-for="(group, i) in item.items" :key="i" class="p-2" :class="[i && 'b-t-1 b-solid b-border b-0']">
        <template v-if="group.items">
          <div class="cursor-default p-2 text-xs text-muted-foreground">
            {{ group.text }}
          </div>
          <BNavDropdownItem v-for="(subItem, index) in group.items" :key="index" :item="subItem" />
        </template>
        <BNavDropdownItem v-else :item="group" />
      </div>
    </div>
  </BPopover>
</template>
