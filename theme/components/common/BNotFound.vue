<script setup lang="ts">
import { presetShadcn } from "@bernankez/theme";
import { useData } from "vitepress";
import { computed } from "vue";
import BButton from "./BButton.vue";
import BLifeGame from "./BLifeGame.vue";

import BLink from "./BLink.vue";
import type { ThemeConfig } from "../../types";

const { isDark, theme } = useData<ThemeConfig>();

const cellColor = computed(() => presetShadcn.theme.colors.primary[isDark.value ? "dark" : "light"]);

const notFound = computed(() => theme.value.notFound);
</script>

<template>
  <div class="mx-auto box-border h-full max-w-[var(--b-max-width)] min-h-[calc(100vh_-_var(--b-nav-height)_-_var(--b-footer-height))] w-full flex flex-col items-center justify-center gap-lg p-xs text-primary">
    <p class="text-6xl font-bold">
      404
    </p>
    <h1 class="text-2xl font-bold">
      {{ notFound?.title || 'PAGE NOT FOUND' }}
    </h1>
    <BLink href="/">
      <BButton as="div">
        {{ notFound?.homeButton || 'Take Me Home' }}
      </BButton>
    </BLink>
    <BLifeGame :cell-color border-color="#ffffff00" :cols="40" :speed="24" :rows="40" :cell-size="5" />
  </div>
</template>
