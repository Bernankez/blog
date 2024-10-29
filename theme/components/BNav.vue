<script setup lang="ts">
import { useData } from "vitepress";
import { toRefs } from "vue";
import { getIcon } from "../utils/icon";
import BButton from "./BButton.vue";
import BIcon from "./BIcon.vue";
import BLink from "./BLink.vue";
import BLogo from "./BLogo.vue";
import type { ThemeConfig } from "../types";

const { theme, isDark } = useData<ThemeConfig>();

const { socialLinks } = toRefs(theme.value);
</script>

<template>
  <header class="z-[var(--b-nav-z-index)] b-0 b-b-1 b-border b-solid bg-card bg-opacity-70 backdrop-blur-8 backdrop-saturate-50 md:sticky md:top-0">
    <div class="b-nav grid grid-cols-3 mx-auto box-border max-w-[var(--b-max-width)]">
      <section class="flex items-center">
        <BLogo class="px-xs" />
      </section>
      <section class="flex items-center justify-center">
      </section>
      <section class="flex items-center justify-end">
        <BButton variant="outline" class="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <div class="i-line-md-search -scale-x-100"></div>
          Search
          <kbd class="b-1 b-border rounded b-solid px-1">/</kbd>
        </BButton>
        <BIcon :icon=" isDark ? 'i-line-md-sunny-outline-to-moon-alt-loop-transition' : 'i-line-md-moon-alt-to-sunny-outline-loop-transition'" @click="isDark = !isDark" />
        <BLink v-for="link in socialLinks" :key="link.link" :href="link.link" target="_blank" :aria-label="link.ariaLabel">
          <BIcon :icon="getIcon(link.icon)" />
        </BLink>
        <BIcon icon="i-line-md-grid-3-filled" />
      </section>
    </div>
  </header>
</template>

<style scoped>
.b-nav {
  height: var(--b-nav-height);
}
</style>
