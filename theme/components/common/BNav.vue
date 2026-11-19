<script setup lang="ts">
import type { ThemeConfig } from "../../types";
import { breakpointsTailwind, useBreakpoints, useResizeObserver } from "@vueuse/core";
import { useData } from "vitepress";
import { computed, ref, toRefs, watchPostEffect } from "vue";
import { isActive } from "../../utils/sidebar";
import BLogo from "./BLogo.vue";
import BMore from "./BMore.vue";
import BNavDropdown from "./BNavDropdown.vue";
import BSearch from "./BSearch.vue";

const { theme, page } = useData<ThemeConfig>();

const { nav } = toRefs(theme.value);

const { sm } = useBreakpoints(breakpointsTailwind);
const track = ref<HTMLElement>();
const activeIndex = computed(() => nav?.value?.findIndex(item => isActive(page.value.relativePath, item.activeMatch, true)) ?? -1);
const pill = ref<{ transform: string; width: string }>();
function measure() {
  const el = track.value?.querySelectorAll<HTMLElement>(".nav-segment")[activeIndex.value];
  pill.value = el ? { transform: `translateX(${el.offsetLeft}px)`, width: `${el.offsetWidth}px` } : undefined;
}
watchPostEffect(measure);
useResizeObserver(track, measure);
</script>

<template>
  <header class="b-nav z-[var(--b-nav-z-index)] b-0 b-b-1 b-border b-solid bg-card bg-opacity-70 backdrop-blur-8 backdrop-saturate-50 md:sticky md:top-0">
    <div class="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] mx-auto box-border h-full max-w-[var(--b-max-width)]">
      <section class="flex items-center">
        <BLogo class="px-xs" :show-title="sm" />
      </section>
      <section class="z-1 flex items-center justify-center">
        <div ref="track" class="relative isolate flex shrink-0">
          <span v-if="pill" aria-hidden="true" class="nav-pill pointer-events-none absolute inset-y-0 left-0 rounded-xl bg-accent shadow shadow-inset -z-1" :style="pill"></span>
          <div v-for="(item, i) in nav" :key="i" class="nav-segment flex" :class="!pill && i === activeIndex && 'rounded-xl bg-accent shadow-inset shadow'">
            <BNavDropdown :item="item" :active="i === activeIndex" />
          </div>
        </div>
      </section>
      <section class="flex items-center justify-end">
        <BSearch />
        <BMore />
      </section>
    </div>
  </header>
</template>

<style scoped>
.b-nav {
  height: var(--b-nav-height);
}

@media (prefers-reduced-motion: no-preference) {
  .nav-pill {
    transition:
      transform 240ms ease-out,
      width 240ms ease-out;
  }
}
</style>
