<script setup lang="ts">
import type { ThemeConfig } from "../../types";
import { useData } from "vitepress";
import { Toaster } from "vue-sonner";

const { isDark } = useData<ThemeConfig>();
</script>

<template>
  <Toaster :theme="isDark ? 'dark' : 'light'" position="bottom-right" close-button />
</template>
