<script setup lang="ts">
import { useData } from "vitepress";
import { computed, toRefs } from "vue";
import BSidebarItem from "./BSidebarItem.vue";
import type { ThemeConfig } from "../types";

const { theme } = useData<ThemeConfig>();

const { sidebar } = toRefs(theme.value);
const sidebarArray = computed(() => Array.isArray(sidebar?.value) ? sidebar.value : []);
</script>

<template>
  <BSidebarItem v-for="item in sidebarArray" :key="item.link" :sidebar-item="item" />
</template>
