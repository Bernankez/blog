<script setup lang="ts">
import LineMdMoonToSunny from "~icons/line-md/moon-alt-to-sunny-outline-loop-transition";
import LineMdSunnyToMoon from "~icons/line-md/sunny-outline-to-moon-alt-loop-transition";
import { useData } from "vitepress";
import BIcon from "./BIcon.vue";
import BLogo from "./BLogo.vue";
import BMore from "./BMore.vue";
import BNavDropdown from "./BNavDropdown.vue";
import BSearch from "./BSearch.vue";
import type { ThemeConfig } from "../types";

const { isDark } = useData<ThemeConfig>();
</script>

<template>
  <header class="z-[var(--b-nav-z-index)] b-0 b-b-1 b-border b-solid bg-card bg-opacity-70 backdrop-blur-8 backdrop-saturate-50 md:sticky md:top-0">
    <div class="b-nav grid grid-cols-3 mx-auto box-border max-w-[var(--b-max-width)]">
      <section class="flex items-center">
        <BLogo class="px-xs" />
      </section>
      <section class="z-1 flex items-center justify-center">
        <div class="hidden shrink-0 md:block">
          <BNavDropdown />
        </div>
      </section>
      <section class="flex items-center justify-end">
        <BSearch />
        <BIcon :icon=" isDark ? LineMdSunnyToMoon : LineMdMoonToSunny" :title="isDark ? '切换到浅色模式' : '切换到深色模式'" @click="isDark = !isDark" />
        <BMore />
      </section>
    </div>
  </header>
</template>

<style scoped>
.b-nav {
  height: var(--b-nav-height);
}
</style>
