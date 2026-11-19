<script setup lang="ts">
import { useMounted } from "@vueuse/core";
import { useData } from "vitepress";
import MoonToSun from "~icons/line-md/moon-alt-to-sunny-outline-loop-transition";
import SunToMoon from "~icons/line-md/sunny-outline-to-moon-alt-loop-transition";

const { isDark } = useData();
const mounted = useMounted();
</script>

<template>
  <component :is="isDark ? SunToMoon : MoonToSun" v-if="mounted" />
  <span v-else aria-hidden="true" class="inline-block h-1.2em w-1.2em"></span>
</template>
