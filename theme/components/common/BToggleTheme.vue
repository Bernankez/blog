<script setup lang="ts">
import type { ThemeConfig } from "../../types";
import { useMounted } from "@vueuse/core";
import { useData } from "vitepress";
import BButton from "./BButton.vue";
import BThemeIcon from "./BThemeIcon.vue";

const { isDark } = useData<ThemeConfig>();
const mounted = useMounted();
</script>

<template>
  <BButton variant="outline" size="icon" :title="mounted && isDark ? '切换到浅色模式' : '切换到深色模式'" class="rounded-full opacity-50 hover:bg-opacity-100 hover:opacity-100" @click="isDark = !isDark">
    <BThemeIcon />
  </BButton>
</template>
