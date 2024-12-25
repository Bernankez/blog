<script setup lang="ts">
import LineMdMoonToSunny from "~icons/line-md/moon-alt-to-sunny-outline-loop-transition";
import LineMdSunnyToMoon from "~icons/line-md/sunny-outline-to-moon-alt-loop-transition";
import { useData } from "vitepress";
import BButton from "./BButton.vue";
import type { ThemeConfig } from "../../types";

const { isDark } = useData<ThemeConfig>();
</script>

<template>
  <BButton variant="outline" size="icon" :title="isDark ? '切换到浅色模式' : '切换到深色模式'" class="rounded-full opacity-50 hover:bg-opacity-100 hover:opacity-100" @click="isDark = !isDark">
    <component :is=" isDark ? LineMdSunnyToMoon : LineMdMoonToSunny" />
  </BButton>
</template>
