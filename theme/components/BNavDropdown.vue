<script setup lang="ts">
import { useData } from "vitepress";
import { toRefs } from "vue";
import BDropdown from "./BDropdown.vue";
import BNavDropdownItem from "./BNavDropdownItem.vue";
import type { ThemeConfig } from "../types";

const { theme } = useData<ThemeConfig>();

const { nav } = toRefs(theme.value);
</script>

<template>
  <div class="flex items-center gap-xs">
    <BNavDropdownItem v-for="(item, index) in nav" :key="index" :item />
    <BDropdown />
  </div>
</template>
