<script setup lang="ts">
import { useSidebar } from "../composables/useSidebar";
import BSidebarItem from "./BSidebarItem.vue";

const { sidebar, path } = useSidebar();
</script>

<template>
  <BSidebarItem v-for="item in sidebar.items" :key="item.link" :collapsed="sidebar.collapsed" :path :indent-from-level="sidebar.indentFromLevel" :item />
</template>
