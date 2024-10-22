<script setup lang="ts">
import { useData } from "vitepress";
import { toRefs } from "vue";
import BButton from "./BButton.vue";
import type { ThemeConfig } from "../types";

const { theme, site } = useData<ThemeConfig>();

const { siteTitle } = toRefs(theme.value);
</script>

<template>
  <header class="k-nav sticky top-0 z-30 flex items-center justify-between bg-background p-sm">
    <div class="flex items-center gap-sm">
      <img :src="theme.logo" class="logo" />
      <span v-if="siteTitle !== false" class="text-2xl font-bold">{{ siteTitle ?? site.title }}</span>
    </div>
    <div>
      <BButton variant="outline" size="icon">
        H
      </BButton>
    </div>
  </header>
</template>

<style scoped>
.k-nav .logo {
  object-fit: scale-down;
  height: var(--k-nav-logo-height);
}
</style>
